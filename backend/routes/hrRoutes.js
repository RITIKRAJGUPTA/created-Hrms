import express from "express";
import Employee from "../models/Employee.js";
import Attendance from "../models/Attendance.js";
import LeaveHistory from "../models/LeaveHistory.js";

const router = express.Router();

/* -----------------------------------------------------------
   1️⃣ HR – Add Employee
------------------------------------------------------------ */
router.post("/add-employee", async (req, res) => {
  try {
    const employee = await Employee.create(req.body);
    res.json({ message: "Employee added", employee });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* -----------------------------------------------------------
   2️⃣ HR – View All Employees
------------------------------------------------------------ */
router.get("/employees", async (req, res) => {
  try {
    const employees = await Employee.find();
    res.json(employees);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* -----------------------------------------------------------
   3️⃣ HR – Edit Employee
------------------------------------------------------------ */
router.put("/employee/:id", async (req, res) => {
  try {
    const updated = await Employee.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* -----------------------------------------------------------
   3️⃣ HR – Edit Employee  ✔ NEW
------------------------------------------------------------ */
router.put("/edit-employee/:id", async (req, res) => {
  try {
    const updatedEmployee = await Employee.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedEmployee) {
      return res.status(404).json({ message: "Employee Not Found" });
    }

    res.json({
      message: "Employee updated successfully",
      employee: updatedEmployee,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* -----------------------------------------------------------
   4️⃣ HR – Delete Employee
------------------------------------------------------------ */
router.delete("/employee/:id", async (req, res) => {
  try {
    await Employee.findByIdAndDelete(req.params.id);
    res.json({ message: "Employee deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* -----------------------------------------------------------
   5️⃣ HR – Mark Attendance + Auto Deduct Leaves
------------------------------------------------------------ */
router.post("/attendance", async (req, res) => {
  try {
    const { employeeId, date, status } = req.body;

    // Save attendance
    const att = await Attendance.findOneAndUpdate(
      { employee: employeeId, date },
      { status },
      { upsert: true, new: true }
    );

    // Deduct leave if needed
    if (["SL", "CL", "PL"].includes(status)) {
      const emp = await Employee.findById(employeeId);

      const leaveKey =
        status === "SL"
          ? "sick"
          : status === "CL"
          ? "casual"
          : "paid";

      // Deduct leave only if available
      if (emp.leaves[leaveKey] > 0) {
        emp.leaves[leaveKey] -= 1;
        await emp.save();
      }

      // Save leave history
      await LeaveHistory.create({
        employee: employeeId,
        date,
        type: status,
      });
    }

    res.json({ message: "Attendance marked", att });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* -----------------------------------------------------------
   6️⃣ HR – Get All Attendance Records (See Attendance History)
------------------------------------------------------------ */
router.get("/attendance/all", async (req, res) => {
  try {
    const attendance = await Attendance.find()
      .populate("employee", "name employeeCode email joiningDate")
      .sort({ date: -1 }); // latest first

    res.json(attendance);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* -----------------------------------------------------------
   6️⃣ Employee – View Profile
------------------------------------------------------------ */
router.get("/employee/profile/:id", async (req, res) => {
  try {
    console.log("Fetching employee with ID:", req.params.id); // Add logging
    
    const employee = await Employee.findById(req.params.id);
    
    if (!employee) {
      console.log("Employee not found for ID:", req.params.id);
      return res.status(404).json({ 
        success: false, 
        message: "Employee not found" 
      });
    }
    
    console.log("Employee found:", employee.name);
    res.json({ 
      success: true, 
      employee  // Changed from just employee to { success, employee }
    });
    
  } catch (err) {
    console.error("Error fetching employee:", err.message);
    
    // Handle invalid ObjectId format
    if (err.name === 'CastError') {
      return res.status(400).json({ 
        success: false, 
        message: "Invalid employee ID format" 
      });
    }
    
    res.status(500).json({ 
      success: false, 
      message: "Server error",
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

/* -----------------------------------------------------------
   7️⃣ HR – Get Leave History (All Employees)
------------------------------------------------------------ */
router.get("/leave-history", async (req, res) => {
  try {
    const history = await LeaveHistory.find()
      .populate("employee", "name employeeCode email")
      .sort({ date: -1 });

    res.json(history);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
/* -----------------------------------------------------------
   7️⃣ HR – View Remaining Leaves of All Employees
------------------------------------------------------------ */
router.get("/leave-status/all", async (req, res) => {
  try {
    const employees = await Employee.find().select(
      "name employeeCode leaves"
    );

    res.json(employees);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});



export default router;
