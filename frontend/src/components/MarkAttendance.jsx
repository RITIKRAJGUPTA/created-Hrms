import { useEffect, useState } from "react";

export default function MarkAttendance() {
  const [employees, setEmployees] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [date, setDate] = useState(new Date().toISOString().substring(0, 10));
  const [submitting, setSubmitting] = useState(false);

  // Load Employees List
  const fetchEmployees = async () => {
    try {
      const res = await fetch("https://hrms-6s7f.onrender.com/api/hr/employees");
      const data = await res.json();
      setEmployees(data);
    } catch (err) {
      console.error("Error loading employees:", err);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  // Update an employee's attendance locally before submitting
  const handleStatusChange = (id, status) => {
    setAttendance({ ...attendance, [id]: status });
  };

  // Mark all employees with a specific status
  const markAll = (status) => {
    const newAttendance = {};
    employees.forEach(emp => {
      newAttendance[emp._id] = status;
    });
    setAttendance(newAttendance);
  };

  // Clear all attendance marks
  const clearAll = () => {
    if (window.confirm("Are you sure you want to clear all attendance marks?")) {
      setAttendance({});
    }
  };

  // Submit attendance to backend
  const submitAttendance = async () => {
    if (!date) {
      alert("Please select a date.");
      return;
    }

    const entries = Object.entries(attendance);
    if (entries.length === 0) {
      alert("Please mark attendance for at least one employee.");
      return;
    }

    setSubmitting(true);
    try {
      for (const [employeeId, status] of entries) {
        await fetch("https://hrms-6s7f.onrender.com/api/hr/attendance", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ employeeId, date, status }),
        });
      }

      alert("Attendance marked successfully!");
      setAttendance({});
    } catch (err) {
      alert("Error marking attendance");
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const getMarkedCount = () => {
    return Object.keys(attendance).length;
  };

  // Get statistics for each status
  const getStatusStats = () => {
    const stats = {
      present: 0,
      absent: 0,
      sl: 0,
      cl: 0,
      pl: 0
    };
    
    Object.values(attendance).forEach(status => {
      if (status === 'P') stats.present++;
      else if (status === 'A') stats.absent++;
      else if (status === 'SL') stats.sl++;
      else if (status === 'CL') stats.cl++;
      else if (status === 'PL') stats.pl++;
    });
    
    return stats;
  };

  const statusStats = getStatusStats();

  return (
    <div className="attendance-container">
      <div className="attendance-header">
        <h2 className="attendance-title">Mark Attendance</h2>
        <p className="attendance-subtitle">Record daily attendance for employees</p>
      </div>

      {/* Select Date */}
      <div className="date-section">
        <label className="date-label">📅 Select Date:</label>
        <input
          type="date"
          className="date-input"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </div>

      {/* Stats Bar */}
      <div className="stats-bar">
        <div className="stat-item">
          <span className="stat-number">{employees.length}</span>
          <span className="stat-text">Total Employees</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">{getMarkedCount()}</span>
          <span className="stat-text">Marked Today</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">{employees.length - getMarkedCount()}</span>
          <span className="stat-text">Pending</span>
        </div>
      </div>

      {/* Quick Actions - Mark All Buttons */}
      <div className="quick-actions">
        <div className="quick-actions-title">⚡ Quick Actions (Mark All)</div>
        <div className="quick-actions-buttons">
          <button 
            className="action-btn present-btn" 
            onClick={() => markAll('P')}
          >
            ✅ Mark All Present
          </button>
          <button 
            className="action-btn absent-btn" 
            onClick={() => markAll('A')}
          >
            ❌ Mark All Absent
          </button>
          <button 
            className="action-btn sl-btn" 
            onClick={() => markAll('SL')}
          >
            🤒 All Sick Leave
          </button>
          <button 
            className="action-btn cl-btn" 
            onClick={() => markAll('CL')}
          >
            🏖️ All Casual Leave
          </button>
          <button 
            className="action-btn pl-btn" 
            onClick={() => markAll('PL')}
          >
            💼 All Paid Leave
          </button>
          <button 
            className="action-btn clear-btn" 
            onClick={clearAll}
          >
            🗑️ Clear All
          </button>
        </div>
      </div>

      {/* Status Summary */}
      {getMarkedCount() > 0 && (
        <div className="status-summary">
          <div className="summary-title">Current Summary:</div>
          <div className="summary-items">
            {statusStats.present > 0 && (
              <span className="summary-badge present">✅ Present: {statusStats.present}</span>
            )}
            {statusStats.absent > 0 && (
              <span className="summary-badge absent">❌ Absent: {statusStats.absent}</span>
            )}
            {statusStats.sl > 0 && (
              <span className="summary-badge sl">🤒 Sick Leave: {statusStats.sl}</span>
            )}
            {statusStats.cl > 0 && (
              <span className="summary-badge cl">🏖️ Casual Leave: {statusStats.cl}</span>
            )}
            {statusStats.pl > 0 && (
              <span className="summary-badge pl">💼 Paid Leave: {statusStats.pl}</span>
            )}
          </div>
        </div>
      )}

      {/* Mobile Card View */}
      <div className="mobile-cards">
        {employees.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📋</div>
            <p>No Employees Found</p>
          </div>
        ) : (
          employees.map((emp, index) => (
            <div key={emp._id} className="employee-card">
              <div className="card-header">
                <div className="employee-number">#{index + 1}</div>
                <div className={`status-indicator ${attendance[emp._id]?.toLowerCase() || 'unmarked'}`}>
                  {attendance[emp._id] ? 
                    attendance[emp._id] === 'P' ? 'Present' :
                    attendance[emp._id] === 'A' ? 'Absent' :
                    attendance[emp._id] === 'SL' ? 'Sick Leave' :
                    attendance[emp._id] === 'CL' ? 'Casual Leave' : 'Paid Leave'
                    : 'Not Marked'}
                </div>
              </div>
              
              <div className="card-body">
                <div className="employee-avatar">
                  {emp.name?.charAt(0).toUpperCase()}
                </div>
                <div className="employee-info">
                  <h3 className="employee-name">{emp.name}</h3>
                  <div className="employee-code">Code: {emp.employeeCode}</div>
                </div>
              </div>
              
              <div className="card-footer">
                <select
                  className="status-select-mobile"
                  value={attendance[emp._id] || ""}
                  onChange={(e) => handleStatusChange(emp._id, e.target.value)}
                >
                  <option value="">-- Select Status --</option>
                  <option value="P">✅ Present</option>
                  <option value="A">❌ Absent</option>
                  <option value="SL">🤒 Sick Leave (SL)</option>
                  <option value="CL">🏖️ Casual Leave (CL)</option>
                  <option value="PL">💼 Paid Leave (PL)</option>
                </select>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Submit Button */}
      <button 
        className="submit-button" 
        onClick={submitAttendance}
        disabled={submitting || getMarkedCount() === 0}
      >
        {submitting ? 'Submitting...' : '📤 Submit Attendance'}
      </button>

      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        .attendance-container {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px 16px;
          background: #f7fafc;
          min-height: 100vh;
        }

        /* Header */
        .attendance-header {
          margin-bottom: 24px;
          text-align: center;
        }

        .attendance-title {
          font-size: 1.8rem;
          margin-bottom: 8px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .attendance-subtitle {
          color: #718096;
          font-size: 0.9rem;
        }

        /* Date Section */
        .date-section {
          background: white;
          padding: 16px;
          border-radius: 12px;
          margin-bottom: 16px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.05);
        }

        .date-label {
          display: block;
          font-weight: 600;
          color: #4a5568;
          margin-bottom: 8px;
          font-size: 0.9rem;
        }

        .date-input {
          width: 100%;
          padding: 10px 12px;
          border: 2px solid #e2e8f0;
          border-radius: 8px;
          font-size: 1rem;
          transition: all 0.3s;
        }

        .date-input:focus {
          outline: none;
          border-color: #667eea;
        }

        /* Stats Bar */
        .stats-bar {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
          margin-bottom: 20px;
        }

        .stat-item {
          background: white;
          padding: 12px;
          border-radius: 12px;
          text-align: center;
          box-shadow: 0 2px 4px rgba(0,0,0,0.05);
        }

        .stat-number {
          display: block;
          font-size: 1.5rem;
          font-weight: bold;
          color: #2d3748;
          margin-bottom: 4px;
        }

        .stat-text {
          font-size: 0.75rem;
          color: #718096;
        }

        /* Quick Actions */
        .quick-actions {
          background: white;
          padding: 16px;
          border-radius: 12px;
          margin-bottom: 20px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.05);
        }

        .quick-actions-title {
          font-weight: 600;
          color: #2d3748;
          margin-bottom: 12px;
          font-size: 0.9rem;
        }

        .quick-actions-buttons {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .action-btn {
          flex: 1;
          min-width: 100px;
          padding: 10px 12px;
          border: none;
          border-radius: 8px;
          font-size: 0.85rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s;
        }

        .action-btn:active {
          transform: scale(0.98);
        }

        .present-btn {
          background: #10b981;
          color: white;
        }

        .absent-btn {
          background: #ef4444;
          color: white;
        }

        .sl-btn {
          background: #f59e0b;
          color: white;
        }

        .cl-btn {
          background: #3b82f6;
          color: white;
        }

        .pl-btn {
          background: #8b5cf6;
          color: white;
        }

        .clear-btn {
          background: #64748b;
          color: white;
        }

        /* Status Summary */
        .status-summary {
          background: white;
          padding: 12px 16px;
          border-radius: 12px;
          margin-bottom: 20px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.05);
        }

        .summary-title {
          font-size: 0.85rem;
          font-weight: 600;
          color: #4a5568;
          margin-bottom: 8px;
        }

        .summary-items {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .summary-badge {
          padding: 4px 10px;
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: 500;
        }

        .summary-badge.present {
          background: #d1fae5;
          color: #065f46;
        }

        .summary-badge.absent {
          background: #fee2e2;
          color: #991b1b;
        }

        .summary-badge.sl {
          background: #fed7aa;
          color: #92400e;
        }

        .summary-badge.cl {
          background: #dbeafe;
          color: #1e40af;
        }

        .summary-badge.pl {
          background: #e9d5ff;
          color: #5b21b6;
        }

        /* Mobile Cards */
        .mobile-cards {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-bottom: 20px;
        }

        .employee-card {
          background: white;
          border-radius: 12px;
          padding: 16px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.05);
          transition: transform 0.2s;
        }

        .employee-card:active {
          transform: scale(0.99);
        }

        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
          padding-bottom: 12px;
          border-bottom: 1px solid #e2e8f0;
        }

        .employee-number {
          font-weight: 600;
          color: #a0aec0;
          font-size: 0.85rem;
        }

        .status-indicator {
          padding: 4px 10px;
          border-radius: 20px;
          font-size: 0.7rem;
          font-weight: 600;
        }

        .status-indicator.present,
        .status-indicator.p {
          background: #d1fae5;
          color: #065f46;
        }

        .status-indicator.absent,
        .status-indicator.a {
          background: #fee2e2;
          color: #991b1b;
        }

        .status-indicator.sl {
          background: #fed7aa;
          color: #92400e;
        }

        .status-indicator.cl {
          background: #dbeafe;
          color: #1e40af;
        }

        .status-indicator.pl {
          background: #e9d5ff;
          color: #5b21b6;
        }

        .status-indicator.unmarked {
          background: #f1f5f9;
          color: #475569;
        }

        .card-body {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 12px;
        }

        .employee-avatar {
          width: 50px;
          height: 50px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 1.2rem;
          font-weight: bold;
        }

        .employee-info {
          flex: 1;
        }

        .employee-name {
          font-size: 1rem;
          font-weight: 600;
          color: #2d3748;
          margin-bottom: 4px;
        }

        .employee-code {
          font-size: 0.75rem;
          color: #718096;
          font-family: monospace;
        }

        .card-footer {
          margin-top: 8px;
        }

        .status-select-mobile {
          width: 100%;
          padding: 10px;
          border: 2px solid #e2e8f0;
          border-radius: 8px;
          font-size: 0.9rem;
          background: white;
          cursor: pointer;
          transition: all 0.3s;
        }

        .status-select-mobile:focus {
          outline: none;
          border-color: #667eea;
        }

        /* Submit Button */
        .submit-button {
          width: 100%;
          padding: 14px;
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          color: white;
          border: none;
          border-radius: 12px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s;
          position: sticky;
          bottom: 16px;
          box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
        }

        .submit-button:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(16, 185, 129, 0.4);
        }

        .submit-button:active:not(:disabled) {
          transform: translateY(0);
        }

        .submit-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        /* Empty State */
        .empty-state {
          text-align: center;
          padding: 60px 20px;
          background: white;
          border-radius: 12px;
        }

        .empty-icon {
          font-size: 4rem;
          margin-bottom: 16px;
        }

        .empty-state p {
          color: #718096;
          font-size: 1rem;
        }

        /* Responsive */
        @media (max-width: 480px) {
          .attendance-container {
            padding: 16px 12px;
          }

          .attendance-title {
            font-size: 1.5rem;
          }

          .stat-number {
            font-size: 1.2rem;
          }

          .employee-name {
            font-size: 0.9rem;
          }

          .quick-actions-buttons {
            flex-direction: column;
          }

          .action-btn {
            width: 100%;
          }
        }

        @media (min-width: 768px) {
          .attendance-container {
            max-width: 800px;
          }
          
          .mobile-cards {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 16px;
          }
        }
      `}</style>
    </div>
  );
}