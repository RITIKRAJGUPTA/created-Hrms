import { useEffect, useState } from "react";
import AddEmployeePopup from "./AddEmployeePopup";

export default function ManageEmployees() {
  const [employees, setEmployees] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  // Fetch All Employees
  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const res = await fetch("https://hrms-6s7f.onrender.com/api/hr/employees");
      const data = await res.json();
      setEmployees(data);
    } catch (err) {
      console.error("Error loading employees:", err);
    } finally {
      setLoading(false);
    }
  };

  // Start Editing
  const startEdit = (emp) => {
    setEditId(emp._id);
    setEditForm(emp);
  };

  // Cancel Editing
  const cancelEdit = () => {
    setEditId(null);
    setEditForm({});
  };

  // Update form values
  const handleChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  // Save Edited Employee
  const saveEdit = async () => {
    try {
      const res = await fetch(
        `https://hrms-6s7f.onrender.com/api/hr/edit-employee/${editId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(editForm),
        }
      );

      const data = await res.json();
      alert("Employee Updated Successfully!");

      setEditId(null);
      fetchEmployees();
    } catch (err) {
      alert("Error updating employee");
    }
  };

  // Delete Employee
  const deleteEmployee = async (id) => {
    if (!window.confirm("Are you sure you want to delete this employee?")) return;

    try {
      const res = await fetch(`https://hrms-6s7f.onrender.com/api/hr/delete-employee/${id}`, {
        method: "DELETE",
      });

      const data = await res.json();
      alert(data.message);
      fetchEmployees();
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  // Filter employees based on search
  const filteredEmployees = employees.filter(emp =>
    emp.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.employeeCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.phone?.includes(searchTerm)
  );

  // Load employees at mount
  useEffect(() => {
    fetchEmployees();
  }, []);

  return (
    <div className="manage-employees-container">
      <div className="page-header">
        <div className="header-content">
          <h2 className="page-title">Manage Employees</h2>
          <p className="page-subtitle">View, edit, and manage all employee records</p>
        </div>
        <button className="add-employee-btn" onClick={() => setShowPopup(true)}>
          <span className="btn-icon">+</span>
          <span>Add Employee</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="search-section">
        <div className="search-wrapper">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            className="search-input"
            placeholder="Search by name, employee code, email, or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button className="clear-search" onClick={() => setSearchTerm("")}>
              ✕
            </button>
          )}
        </div>
        <div className="stats-badge">
          <span className="stats-count">{filteredEmployees.length}</span>
          <span className="stats-label">Employees Found</span>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading employees...</p>
        </div>
      )}

      {/* Employees Table - Desktop View */}
      {!loading && (
        <div className="table-responsive">
          <table className="employees-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Employee Code</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Gender</th>
                <th>Joining Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredEmployees.length === 0 ? (
                <tr>
                  <td colSpan="8" className="empty-state">
                    <div className="empty-icon">📋</div>
                    <p>No Employees Found</p>
                    <button className="btn-add-small" onClick={() => setShowPopup(true)}>
                      Add your first employee
                    </button>
                  </td>
                </tr>
              ) : (
                filteredEmployees.map((emp, index) => (
                  <tr key={emp._id} className={editId === emp._id ? "editing-row" : ""}>
                    <td className="serial-number">{index + 1}</td>

                    {editId === emp._id ? (
                      <>
                        <td>
                          <input
                            type="text"
                            name="name"
                            value={editForm.name}
                            onChange={handleChange}
                            className="edit-input"
                            placeholder="Name"
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            name="employeeCode"
                            value={editForm.employeeCode}
                            onChange={handleChange}
                            className="edit-input"
                            placeholder="Employee Code"
                          />
                        </td>
                        <td>
                          <input
                            type="email"
                            name="email"
                            value={editForm.email}
                            onChange={handleChange}
                            className="edit-input"
                            placeholder="Email"
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            name="phone"
                            value={editForm.phone}
                            onChange={handleChange}
                            className="edit-input"
                            placeholder="Phone"
                          />
                        </td>
                        <td>
                          <select
                            name="gender"
                            value={editForm.gender}
                            onChange={handleChange}
                            className="edit-select"
                          >
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                          </select>
                        </td>
                        <td>
                          <input
                            type="date"
                            name="joiningDate"
                            value={editForm.joiningDate?.substring(0, 10)}
                            onChange={handleChange}
                            className="edit-input"
                          />
                        </td>
                        <td className="action-buttons">
                          <button className="btn-save" onClick={saveEdit}>
                            Save
                          </button>
                          <button className="btn-cancel" onClick={cancelEdit}>
                            Cancel
                          </button>
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="employee-name">{emp.name}</td>
                        <td className="employee-code">{emp.employeeCode}</td>
                        <td className="employee-email">{emp.email}</td>
                        <td className="employee-phone">{emp.phone}</td>
                        <td>
                          <span className={`gender-badge ${emp.gender?.toLowerCase()}`}>
                            {emp.gender}
                          </span>
                        </td>
                        <td className="joining-date">{emp.joiningDate?.substring(0, 10)}</td>
                        <td className="action-buttons">
                          <button className="btn-edit" onClick={() => startEdit(emp)}>
                            Edit
                          </button>
                          <button className="btn-delete" onClick={() => deleteEmployee(emp._id)}>
                            Delete
                          </button>
                        </td>
                      </>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Mobile Card View */}
      {!loading && filteredEmployees.length > 0 && (
        <div className="mobile-card-view">
          {filteredEmployees.map((emp, index) => (
            <div key={emp._id} className="employee-card">
              {editId === emp._id ? (
                <div className="edit-form-mobile">
                  <h4>Edit Employee</h4>
                  <input
                    type="text"
                    name="name"
                    value={editForm.name}
                    onChange={handleChange}
                    placeholder="Name"
                    className="edit-input-mobile"
                  />
                  <input
                    type="text"
                    name="employeeCode"
                    value={editForm.employeeCode}
                    onChange={handleChange}
                    placeholder="Employee Code"
                    className="edit-input-mobile"
                  />
                  <input
                    type="email"
                    name="email"
                    value={editForm.email}
                    onChange={handleChange}
                    placeholder="Email"
                    className="edit-input-mobile"
                  />
                  <input
                    type="text"
                    name="phone"
                    value={editForm.phone}
                    onChange={handleChange}
                    placeholder="Phone"
                    className="edit-input-mobile"
                  />
                  <select
                    name="gender"
                    value={editForm.gender}
                    onChange={handleChange}
                    className="edit-select-mobile"
                  >
                    <option>Male</option>
                    <option>Female</option>
                    <option>Other</option>
                  </select>
                  <input
                    type="date"
                    name="joiningDate"
                    value={editForm.joiningDate?.substring(0, 10)}
                    onChange={handleChange}
                    className="edit-input-mobile"
                  />
                  <div className="edit-actions">
                    <button className="btn-save-mobile" onClick={saveEdit}>Save</button>
                    <button className="btn-cancel-mobile" onClick={cancelEdit}>Cancel</button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="card-header">
                    <div className="employee-info">
                      <div className="employee-avatar">
                        {emp.gender === "Male" ? "👨" : emp.gender === "Female" ? "👩" : "👤"}
                      </div>
                      <div className="employee-basic-info">
                        <h4 className="card-name">{emp.name}</h4>
                        <span className="card-code">{emp.employeeCode}</span>
                      </div>
                    </div>
                    <span className={`gender-badge-mobile ${emp.gender?.toLowerCase()}`}>
                      {emp.gender}
                    </span>
                  </div>
                  
                  <div className="card-details">
                    <div className="detail-item">
                      <span className="detail-label">📧 Email:</span>
                      <span className="detail-value">{emp.email}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">📱 Phone:</span>
                      <span className="detail-value">{emp.phone}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">📅 Joined:</span>
                      <span className="detail-value">{emp.joiningDate?.substring(0, 10)}</span>
                    </div>
                  </div>
                  
                  <div className="card-actions">
                    <button className="card-btn-edit" onClick={() => startEdit(emp)}>
                      Edit
                    </button>
                    <button className="card-btn-delete" onClick={() => deleteEmployee(emp._id)}>
                      Delete
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}

      <AddEmployeePopup
        show={showPopup}
        onClose={() => {
          setShowPopup(false);
          fetchEmployees();
        }}
      />

      <style>{`
        .manage-employees-container {
          padding: 20px;
          max-width: 1400px;
          margin: 0 auto;
          width: 100%;
        }

        /* Page Header */
        .page-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 20px;
          margin-bottom: 30px;
          padding-bottom: 20px;
          border-bottom: 2px solid #e2e8f0;
        }

        .page-title {
          font-size: 1.8rem;
          color: #1a202c;
          margin: 0 0 8px 0;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .page-subtitle {
          color: #718096;
          margin: 0;
          font-size: 0.9rem;
        }

        .add-employee-btn {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 12px;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: all 0.3s;
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
        }

        .add-employee-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(102, 126, 234, 0.4);
        }

        .btn-icon {
          font-size: 1.2rem;
          font-weight: bold;
        }

        /* Search Section */
        .search-section {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 15px;
          margin-bottom: 30px;
        }

        .search-wrapper {
          flex: 1;
          position: relative;
          max-width: 500px;
        }

        .search-icon {
          position: absolute;
          left: 15px;
          top: 50%;
          transform: translateY(-50%);
          font-size: 1.2rem;
        }

        .search-input {
          width: 100%;
          padding: 12px 40px 12px 45px;
          border: 2px solid #e2e8f0;
          border-radius: 12px;
          font-size: 0.95rem;
          transition: all 0.3s;
          background: white;
        }

        .search-input:focus {
          outline: none;
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }

        .clear-search {
          position: absolute;
          right: 15px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          font-size: 1.2rem;
          cursor: pointer;
          color: #a0aec0;
          padding: 4px;
        }

        .stats-badge {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 8px 20px;
          border-radius: 30px;
          display: flex;
          align-items: center;
          gap: 8px;
          box-shadow: 0 2px 8px rgba(102, 126, 234, 0.2);
        }

        .stats-count {
          font-size: 1.5rem;
          font-weight: bold;
          color: white;
        }

        .stats-label {
          color: white;
          font-size: 0.85rem;
        }

        /* Loading State */
        .loading-container {
          text-align: center;
          padding: 60px 20px;
        }

        .spinner {
          width: 50px;
          height: 50px;
          border: 4px solid #e2e8f0;
          border-top-color: #667eea;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
          margin: 0 auto 20px;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        /* Desktop Table */
        .table-responsive {
          overflow-x: auto;
          background: white;
          border-radius: 16px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.05);
        }

        .employees-table {
          width: 100%;
          border-collapse: collapse;
          min-width: 1000px;
        }

        .employees-table thead tr {
          background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
          border-bottom: 2px solid #e2e8f0;
        }

        .employees-table th {
          padding: 16px;
          text-align: left;
          font-weight: 600;
          color: #475569;
          font-size: 0.85rem;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .employees-table td {
          padding: 16px;
          border-bottom: 1px solid #e2e8f0;
          color: #334155;
        }

        .employees-table tbody tr:hover {
          background: #f8fafc;
        }

        .editing-row {
          background: #fef3c7;
        }

        .serial-number {
          font-weight: 600;
          color: #64748b;
        }

        .employee-name {
          font-weight: 600;
          color: #1e293b;
        }

        .employee-code {
          font-family: monospace;
          font-size: 0.9rem;
        }

        .employee-email, .employee-phone {
          font-size: 0.9rem;
        }

        .gender-badge {
          display: inline-block;
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: 500;
        }

        .gender-badge.male {
          background: #dbeafe;
          color: #1e40af;
        }

        .gender-badge.female {
          background: #fce7f3;
          color: #9d174d;
        }

        .gender-badge.other {
          background: #e0e7ff;
          color: #3730a3;
        }

        .joining-date {
          font-size: 0.85rem;
        }

        .action-buttons {
          display: flex;
          gap: 8px;
        }

        .btn-edit, .btn-delete, .btn-save, .btn-cancel {
          padding: 6px 12px;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-size: 0.8rem;
          font-weight: 500;
          transition: all 0.2s;
        }

        .btn-edit {
          background: #fbbf24;
          color: #78350f;
        }

        .btn-edit:hover {
          background: #f59e0b;
          transform: translateY(-1px);
        }

        .btn-delete {
          background: #fecaca;
          color: #991b1b;
        }

        .btn-delete:hover {
          background: #fca5a5;
          transform: translateY(-1px);
        }

        .btn-save {
          background: #10b981;
          color: white;
        }

        .btn-save:hover {
          background: #059669;
        }

        .btn-cancel {
          background: #94a3b8;
          color: white;
        }

        .btn-cancel:hover {
          background: #64748b;
        }

        .edit-input, .edit-select {
          width: 100%;
          padding: 8px;
          border: 1px solid #cbd5e1;
          border-radius: 6px;
          font-size: 0.85rem;
        }

        .edit-input:focus, .edit-select:focus {
          outline: none;
          border-color: #667eea;
          ring: 2px solid rgba(102, 126, 234, 0.1);
        }

        /* Empty State */
        .empty-state {
          text-align: center;
          padding: 60px 20px;
        }

        .empty-icon {
          font-size: 4rem;
          margin-bottom: 16px;
        }

        .btn-add-small {
          margin-top: 16px;
          padding: 8px 20px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
        }

        /* Mobile Card View - Hidden on Desktop */
        .mobile-card-view {
          display: none;
        }

        /* Responsive Styles */
        @media (max-width: 1024px) {
          .manage-employees-container {
            padding: 16px;
          }
        }

        @media (max-width: 768px) {
          .table-responsive {
            display: none;
          }

          .mobile-card-view {
            display: flex;
            flex-direction: column;
            gap: 16px;
          }

          .employee-card {
            background: white;
            border-radius: 16px;
            padding: 16px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.05);
            transition: all 0.3s;
          }

          .card-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 16px;
            padding-bottom: 12px;
            border-bottom: 1px solid #e2e8f0;
          }

          .employee-info {
            display: flex;
            align-items: center;
            gap: 12px;
          }

          .employee-avatar {
            width: 48px;
            height: 48px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.5rem;
          }

          .employee-basic-info {
            flex: 1;
          }

          .card-name {
            margin: 0 0 4px 0;
            font-size: 1rem;
            color: #1e293b;
          }

          .card-code {
            font-size: 0.75rem;
            color: #64748b;
            font-family: monospace;
          }

          .gender-badge-mobile {
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 0.75rem;
            font-weight: 500;
          }

          .gender-badge-mobile.male {
            background: #dbeafe;
            color: #1e40af;
          }

          .gender-badge-mobile.female {
            background: #fce7f3;
            color: #9d174d;
          }

          .card-details {
            margin-bottom: 16px;
          }

          .detail-item {
            display: flex;
            justify-content: space-between;
            padding: 8px 0;
            border-bottom: 1px solid #f1f5f9;
          }

          .detail-label {
            font-size: 0.85rem;
            color: #64748b;
          }

          .detail-value {
            font-size: 0.85rem;
            color: #1e293b;
            font-weight: 500;
          }

          .card-actions {
            display: flex;
            gap: 12px;
          }

          .card-btn-edit, .card-btn-delete {
            flex: 1;
            padding: 10px;
            border: none;
            border-radius: 8px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.2s;
          }

          .card-btn-edit {
            background: #fef3c7;
            color: #78350f;
          }

          .card-btn-delete {
            background: #fecaca;
            color: #991b1b;
          }

          .edit-form-mobile {
            display: flex;
            flex-direction: column;
            gap: 12px;
          }

          .edit-form-mobile h4 {
            margin: 0 0 8px 0;
            color: #1e293b;
          }

          .edit-input-mobile, .edit-select-mobile {
            padding: 10px;
            border: 1px solid #cbd5e1;
            border-radius: 8px;
            font-size: 0.9rem;
          }

          .edit-actions {
            display: flex;
            gap: 12px;
            margin-top: 8px;
          }

          .btn-save-mobile, .btn-cancel-mobile {
            flex: 1;
            padding: 10px;
            border: none;
            border-radius: 8px;
            font-weight: 500;
            cursor: pointer;
          }

          .btn-save-mobile {
            background: #10b981;
            color: white;
          }

          .btn-cancel-mobile {
            background: #94a3b8;
            color: white;
          }

          .page-header {
            flex-direction: column;
            align-items: stretch;
          }

          .add-employee-btn {
            justify-content: center;
          }

          .search-section {
            flex-direction: column;
            align-items: stretch;
          }

          .search-wrapper {
            max-width: 100%;
          }

          .stats-badge {
            justify-content: center;
          }

          .page-title {
            font-size: 1.5rem;
          }
        }

        @media (max-width: 480px) {
          .manage-employees-container {
            padding: 12px;
          }

          .employee-card {
            padding: 12px;
          }

          .employee-avatar {
            width: 40px;
            height: 40px;
            font-size: 1.2rem;
          }

          .card-name {
            font-size: 0.9rem;
          }
        }

        @media (min-width: 769px) and (max-width: 1024px) {
          .employees-table {
            min-width: 800px;
          }
        }
      `}</style>
    </div>
  );
}