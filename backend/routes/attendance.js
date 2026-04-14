import express from "express";
import Attendance from "../models/Attendance.js";
import Employee from "../models/Employee.js";
import { protect, permit } from "../middleware/authMiddleware.js";

const router = express.Router();

// HR: mark single attendance for an employee
router.post("/mark", protect, permit("hr"), async (req, res) => {
  try {
    const { employeeId, date, status, note } = req.body;
    const emp = await Employee.findById(employeeId);
    if (!emp) return res.status(404).json({ message: "Employee not found" });

    const attendanceDate = new Date(date);
    // upsert: create or update the attendance for that date
    const att = await Attendance.findOneAndUpdate(
      { employee: emp._id, date: attendanceDate },
      { employee: emp._id, date: attendanceDate, status, markedBy: req.user._id, note },
      { upsert: true, new: true, runValidators: true }
    );

    res.json(att);
  } catch (err) {
    // handle duplicate index errors etc
    res.status(500).json({ message: err.message });
  }
});

// optional: bulk mark attendance for many employees - accept array of {employeeId,date,status}
router.post("/bulk-mark", protect, permit("hr"), async (req, res) => {
  try {
    const records = req.body.records || [];
    const results = [];
    for (const r of records) {
      const date = new Date(r.date);
      const obj = {
        employee: r.employeeId,
        date,
        status: r.status,
        markedBy: req.user._id
      };
      const att = await Attendance.findOneAndUpdate(
        { employee: r.employeeId, date },
        obj,
        { upsert: true, new: true }
      );
      results.push(att);
    }
    res.json({ count: results.length });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
