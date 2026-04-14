import mongoose from "mongoose";


const userSchema = new mongoose.Schema({
name: { type: String, required: true },
email: { type: String, required: true, unique: true },
phone: { type: String, required: true },
gender: { type: String, required: true },
role: { type: String, enum: ["admin", "hr"], required: true },
password: { type: String, required: true },
resetToken: String,
resetTokenExpires: Date,
});


export default mongoose.model("User", userSchema);