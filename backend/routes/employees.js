import express from "express";
import Employee from "../models/Employee.js";
import Attendance from "../models/Attendance.js";
import { protect, permit } from "../middleware/authMiddleware.js";

const router = express.Router();

// Admin + HR: get all employees
router.get("/", protect, permit("admin","hr"), async (req, res) => {
  const employees = await Employee.find().sort({ createdAt: -1 });
  res.json(employees);
});

// HR only: create employee (auto-assign default leaves)
router.post("/", protect, permit("hr"), async (req, res) => {
  const { name, location, gender, email, phone } = req.body;
  try {
    const exists = await Employee.findOne({ email });
    if (exists) return res.status(400).json({ message: "Employee already exists" });

    const emp = await Employee.create({
      name, location, gender, email, phone,
      createdBy: req.user._id,
      // default leaves will be set by schema defaults
    });

    res.json(emp);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// HR: update employee
router.put("/:id", protect, permit("hr"), async (req, res) => {
  try {
    const emp = await Employee.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!emp) return res.status(404).json({ message: "Employee not found" });
    res.json(emp);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// HR: delete employee (also optionally delete attendance)
router.delete("/:id", protect, permit("hr"), async (req, res) => {
  try {
    const emp = await Employee.findByIdAndDelete(req.params.id);
    if (!emp) return res.status(404).json({ message: "Employee not found" });
    // remove attendances
    await Attendance.deleteMany({ employee: emp._id });
    res.json({ message: "Employee deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Anyone (admin/hr/employee) can fetch employee details (employee can fetch own)
router.get("/:id", protect, async (req, res) => {
  try {
    const emp = await Employee.findById(req.params.id);
    if (!emp) return res.status(404).json({ message: "Employee not found" });

    // if employee user role, ensure they are allowed to view only their own: 
    if (req.user.role === "employer") {
      // we need a mapping of employee -> user. If your employees are separate from users,
      // you may need email match. Simple approach: allow view if email matches.
      if (req.user.email !== emp.email) return res.status(403).json({ message: "Forbidden" });
    }

    res.json(emp);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get leave summary (remaining leaves) for an employee
router.get("/:id/leaves", protect, async (req, res) => {
  try {
    const emp = await Employee.findById(req.params.id);
    if (!emp) return res.status(404).json({ message: "Employee not found" });

    // count how many leave entries of type SL/CL/PL have been taken
    const leaveCounts = await Attendance.aggregate([
      { $match: { employee: emp._id, status: { $in: ["SL","CL","PL"] } } },
      { $group: { _id: "$status", count: { $sum: 1 } } }
    ]);

    // build counts map
    const taken = { SL:0, CL:0, PL:0 };
    leaveCounts.forEach(l => { taken[l._id] = l.count; });

    const remaining = {
      SL: Math.max(0, emp.leaves.SL - taken.SL),
      CL: Math.max(0, emp.leaves.CL - taken.CL),
      PL: Math.max(0, emp.leaves.PL - taken.PL)
    };

    res.json({ initial: emp.leaves, taken, remaining });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get attendance for an employee (optionally filter by month: YYYY-MM)
router.get("/:id/attendance", protect, async (req, res) => {
  try {
    const { month } = req.query; // e.g. 2025-12
    const match = { employee: req.params.id };
    if (month) {
      const [y,m] = month.split("-").map(Number);
      const start = new Date(y, m-1, 1);
      const end = new Date(y, m-1 + 1, 1);
      match.date = { $gte: start, $lt: end };
    }
    const Attendance = await import("../models/Attendance.js").then(m => m.default);
    const attendance = await Attendance.find(match).sort({ date: 1 });
    res.json(attendance);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
