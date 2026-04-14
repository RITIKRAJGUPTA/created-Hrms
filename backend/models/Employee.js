import mongoose from "mongoose";

const employeeSchema = new mongoose.Schema({
  name: { type: String, required: true },

  gender: { type: String, required: true },

  email: { type: String, required: true, unique: true },

  phone: { type: String, required: true },


  // NEW FIELD: Employee Code (must start with Comed)
 employeeCode: { 
  type: String,
  required: true,
  unique: true,
  match: /^Comed-/ 
},

  // NEW FIELD: Joining Date
  joiningDate: { type: Date, required: true },

  // Auto assigned leaves
  leaves: {
    casual: { type: Number, default: 8 },
    sick: { type: Number, default: 10 },
    paid: { type: Number, default: 10 },
  },

  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Employee", employeeSchema);
