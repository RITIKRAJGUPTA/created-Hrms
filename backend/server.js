import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.js";
import empRoutes from "./routes/employees.js";
import attRoutes from "./routes/attendance.js";
import hrRoutes from "./routes/hrRoutes.js";




dotenv.config();
connectDB();


const app = express();
app.use(cors());
app.use(express.json());


app.use("/api/auth", authRoutes);
app.use("/api/employees", empRoutes);
app.use("/api/attendance", attRoutes);
app.use("/api/hr", hrRoutes);


app.listen(5000, () => console.log("Server running on port 5000"));