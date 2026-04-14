import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
// import Navbar from "./components/Navbar";
import ForgetPassword from "./pages/ForgetPassword";
import ResetPassword from "./pages/ResetPassword";
import ManageEmployees from "./components/ManageEmployees";
import MarkAttendance from "./components/MarkAttendance";
import LeaveTracking from "./components/LeaveTracking";
import SeeAttendance from "./components/SeeAttendance";
import LeaveStatus from "./components/LeaveStatus";
import ViewAllEmployees from "./components/ViewAllEmployees";
import ViewHRList from "./components/ViewHRList";



export default function App() {
return (
<BrowserRouter>
<Routes>
<Route path="/" element={<Login />} />
<Route path="/register" element={<Register />} />
{/* Password Reset Routes */}
<Route path="/forgot-password" element={<ForgetPassword />} />
<Route path="/reset-password/:token" element={<ResetPassword />} />
<Route path="/dashboard" element={<Dashboard />}>
   <Route path="manage-employees" element={<ManageEmployees />} />
   <Route path="attendance" element={<MarkAttendance />} />
   <Route path="leave-tracking" element={<LeaveTracking />} />
   <Route path="see-attendance" element={<SeeAttendance />} />
   <Route path="leave-status" element={<LeaveStatus />} />
</Route>
<Route path="/dashboard" element={<Dashboard />}>
 <Route path="employees" element={<ViewAllEmployees />} />
<Route path="hr-list" element={<ViewHRList />} />
</Route>

</Routes>
</BrowserRouter>
);
}