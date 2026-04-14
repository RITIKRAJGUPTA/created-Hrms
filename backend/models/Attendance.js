import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema({
  employee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Employee",
    required: true,
  },
  date: { type: String, required: true }, // "2025-01-10"
  status: {
    type: String,
    enum: ["P", "A", "SL", "CL", "PL"],
    required: true,
  },
});

attendanceSchema.index({ employee: 1, date: 1 }, { unique: true });

export default mongoose.model("Attendance", attendanceSchema);
