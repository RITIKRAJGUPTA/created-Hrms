import mongoose from "mongoose";

const leaveHistorySchema = new mongoose.Schema({
  employee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Employee",
    required: true,
  },
  date: { type: String, required: true },
  type: { type: String, enum: ["CL", "SL", "PL"], required: true },
});

export default mongoose.model("LeaveHistory", leaveHistorySchema);
