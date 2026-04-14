import { useEffect, useState } from "react";
import api from "../utils/api";

export default function EmployeeProfile() {
  const [profile, setProfile] = useState(null);
  const [leaves, setLeaves] = useState(null);
  const [attendance, setAttendance] = useState([]);

  useEffect(() => {
    // assume logged-in employee's email matches an Employee record
    const fetch = async () => {
      const meRes = await api.get("/auth/me").catch(()=>null); // optional endpoint
      const userEmail = meRes?.data?.email || localStorage.getItem("userEmail");
      // fallback: fetch employee by email (we need an API for that)
      const empRes = await api.get(`/employees?email=${encodeURIComponent(userEmail)}`).catch(()=>null);
      const emp = empRes?.data?.[0];
      if (!emp) return;

      setProfile(emp);
      const leavesRes = await api.get(`/employees/${emp._id}/leaves`);
      setLeaves(leavesRes.data);
      const month = new Date().toISOString().slice(0,7);
      const attRes = await api.get(`/employees/${emp._id}/attendance?month=${month}`);
      setAttendance(attRes.data);
    };
    fetch();
  }, []);

  if (!profile) return <div className="container mt-4">Loading...</div>;

  return (
    <div className="container mt-4">
      <h3>{profile.name}'s Profile</h3>
      <p><strong>Email:</strong> {profile.email}</p>
      <p><strong>Phone:</strong> {profile.phone}</p>
      <p><strong>Location:</strong> {profile.location}</p>

      <h5 className="mt-4">Leaves</h5>
      {leaves && (
        <table className="table w-50">
          <thead><tr><th>Type</th><th>Initial</th><th>Taken</th><th>Remaining</th></tr></thead>
          <tbody>
            <tr><td>SL</td><td>{leaves.initial.SL}</td><td>{leaves.taken.SL}</td><td>{leaves.remaining.SL}</td></tr>
            <tr><td>CL</td><td>{leaves.initial.CL}</td><td>{leaves.taken.CL}</td><td>{leaves.remaining.CL}</td></tr>
            <tr><td>PL</td><td>{leaves.initial.PL}</td><td>{leaves.taken.PL}</td><td>{leaves.remaining.PL}</td></tr>
          </tbody>
        </table>
      )}

      <h5 className="mt-4">Attendance (this month)</h5>
      <table className="table">
        <thead><tr><th>Date</th><th>Status</th></tr></thead>
        <tbody>
          {attendance.map(a => (
            <tr key={a._id}>
              <td>{new Date(a.date).toLocaleDateString()}</td>
              <td>{a.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
