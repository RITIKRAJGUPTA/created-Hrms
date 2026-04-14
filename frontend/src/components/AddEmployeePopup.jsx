import { useState } from "react";

export default function AddEmployeePopup({ show, onClose }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    gender: "",
    joiningDate: "",
    employeeCode: "Comed-", // auto start
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    // ensure employee code always starts with "Comed-"
    if (name === "employeeCode") {
      const code = value.startsWith("Comed-") ? value : "Comed-" + value;
      setForm({ ...form, [name]: code });
      return;
    }

    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("https://hrms-6s7f.onrender.com/api/hr/add-employee", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      alert(data.message);
      onClose();
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  if (!show) return null;

  return (
    <>
      <div className="popup-overlay" onClick={onClose}>
        <div className="popup-container" onClick={(e) => e.stopPropagation()}>
          <div className="popup-header">
            <div className="header-icon">👥</div>
            <h3>Add New Employee</h3>
            <button className="close-btn" onClick={onClose}>×</button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">
                <span className="label-icon">👤</span>
                Full Name
                <span className="required">*</span>
              </label>
              <input 
                type="text" 
                className="form-input" 
                name="name"
                placeholder="Enter employee's full name"
                value={form.name} 
                onChange={handleChange} 
                required 
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                <span className="label-icon">📧</span>
                Email Address
                <span className="required">*</span>
              </label>
              <input 
                type="email" 
                className="form-input" 
                name="email"
                placeholder="employee@company.com"
                value={form.email} 
                onChange={handleChange} 
                required 
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                <span className="label-icon">📱</span>
                Phone Number
                <span className="required">*</span>
              </label>
              <input 
                type="tel" 
                className="form-input" 
                name="phone"
                placeholder="+91 1234567890"
                value={form.phone} 
                onChange={handleChange} 
                required 
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                <span className="label-icon">⚥</span>
                Gender
                <span className="required">*</span>
              </label>
              <div className="gender-group">
                <label className="gender-option">
                  <input
                    type="radio"
                    name="gender"
                    value="Male"
                    checked={form.gender === "Male"}
                    onChange={handleChange}
                    required
                  />
                  <span className="gender-label">👨 Male</span>
                </label>
                <label className="gender-option">
                  <input
                    type="radio"
                    name="gender"
                    value="Female"
                    checked={form.gender === "Female"}
                    onChange={handleChange}
                    required
                  />
                  <span className="gender-label">👩 Female</span>
                </label>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group half">
                <label className="form-label">
                  <span className="label-icon">📅</span>
                  Joining Date
                  <span className="required">*</span>
                </label>
                <input 
                  type="date" 
                  className="form-input" 
                  name="joiningDate"
                  value={form.joiningDate} 
                  onChange={handleChange} 
                  required 
                />
              </div>

              <div className="form-group half">
                <label className="form-label">
                  <span className="label-icon">🆔</span>
                  Employee Code
                  <span className="required">*</span>
                </label>
                <input 
                  type="text" 
                  className="form-input" 
                  name="employeeCode"
                  placeholder="Comed-"
                  value={form.employeeCode} 
                  onChange={handleChange} 
                  required 
                />
                <small className="input-hint">Code automatically starts with "Comed-"</small>
              </div>
            </div>

            <div className="popup-footer">
              <button type="button" className="btn-cancel" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="btn-submit">
                <span>➕</span> Add Employee
              </button>
            </div>
          </form>
        </div>
      </div>

      <style>{`
        /* Overlay */
        .popup-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.6);
 backdrop-filter: blur(4px);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 9999;
          animation: fadeIn 0.3s ease;
          padding: 1rem;
        }

        /* Popup Container */
        .popup-container {
          background: white;
          border-radius: 20px;
          width: 100%;
          max-width: 550px;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
          animation: slideUp 0.3s ease;
        }

        /* Custom Scrollbar */
        .popup-container::-webkit-scrollbar {
          width: 8px;
        }

        .popup-container::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }

        .popup-container::-webkit-scrollbar-thumb {
          background: #888;
          border-radius: 10px;
        }

        .popup-container::-webkit-scrollbar-thumb:hover {
          background: #555;
        }

        /* Header */
        .popup-header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 1.5rem;
          border-radius: 20px 20px 0 0;
          color: white;
          display: flex;
          align-items: center;
          gap: 1rem;
          position: relative;
        }

        .header-icon {
          font-size: 2rem;
          background: rgba(255, 255, 255, 0.2);
          width: 50px;
          height: 50px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
        }

        .popup-header h3 {
          margin: 0;
          font-size: 1.5rem;
          font-weight: 600;
          flex: 1;
        }

        .close-btn {
          background: rgba(255, 255, 255, 0.2);
          border: none;
          color: white;
          font-size: 1.8rem;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s;
        }

        .close-btn:hover {
          background: rgba(255, 255, 255, 0.3);
          transform: rotate(90deg);
        }

        /* Form */
        form {
          padding: 1.5rem;
        }

        .form-group {
          margin-bottom: 1.25rem;
        }

        .form-row {
          display: flex;
          gap: 1rem;
          margin-bottom: 0;
        }

        .form-group.half {
          flex: 1;
        }

        .form-label {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-weight: 600;
          color: #2d3748;
          margin-bottom: 0.5rem;
          font-size: 0.9rem;
        }

        .label-icon {
          font-size: 1rem;
        }

        .required {
          color: #dc3545;
          margin-left: 0.25rem;
        }

        .form-input {
          width: 100%;
          padding: 0.75rem 1rem;
          border: 2px solid #e2e8f0;
          border-radius: 10px;
          font-size: 0.95rem;
          transition: all 0.3s;
          outline: none;
          font-family: inherit;
        }

        .form-input:focus {
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }

        .form-input:hover {
          border-color: #cbd5e0;
        }

        .input-hint {
          display: block;
          margin-top: 0.25rem;
          font-size: 0.75rem;
          color: #718096;
        }

        /* Gender Group */
        .gender-group {
          display: flex;
          gap: 1.5rem;
          padding: 0.5rem 0;
        }

        .gender-option {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          cursor: pointer;
          padding: 0.5rem 1rem;
          border: 2px solid #e2e8f0;
          border-radius: 10px;
          transition: all 0.3s;
          flex: 1;
          justify-content: center;
        }

        .gender-option:hover {
          border-color: #667eea;
          background: #f7fafc;
        }

        .gender-option input[type="radio"] {
          width: 18px;
          height: 18px;
          cursor: pointer;
          accent-color: #667eea;
        }

        .gender-label {
          font-size: 0.95rem;
          font-weight: 500;
          color: #4a5568;
        }

        /* Footer Buttons */
        .popup-footer {
          display: flex;
          gap: 1rem;
          margin-top: 2rem;
          padding-top: 1rem;
          border-top: 2px solid #e2e8f0;
        }

        .btn-cancel {
          flex: 1;
          padding: 0.75rem 1.5rem;
          background: white;
          color: #4a5568;
          border: 2px solid #e2e8f0;
          border-radius: 10px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s;
        }

        .btn-cancel:hover {
          background: #f7fafc;
          border-color: #cbd5e0;
          transform: translateY(-2px);
        }

        .btn-submit {
          flex: 2;
          padding: 0.75rem 1.5rem;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          border-radius: 10px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }

        .btn-submit:hover {
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
        }

        .btn-submit:active {
          transform: translateY(0);
        }

        /* Animations */
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .popup-container {
            max-width: 95%;
            max-height: 85vh;
          }

          .popup-header {
            padding: 1rem;
          }

          .header-icon {
            width: 40px;
            height: 40px;
            font-size: 1.5rem;
          }

          .popup-header h3 {
            font-size: 1.25rem;
          }

          .close-btn {
            width: 35px;
            height: 35px;
            font-size: 1.5rem;
          }

          form {
            padding: 1rem;
          }

          .form-row {
            flex-direction: column;
            gap: 0;
          }

          .form-group.half {
            margin-bottom: 1.25rem;
          }

          .gender-group {
            flex-direction: column;
            gap: 0.75rem;
          }

          .gender-option {
            justify-content: flex-start;
            padding: 0.6rem 1rem;
          }

          .popup-footer {
            flex-direction: column;
          }

          .btn-cancel,
          .btn-submit {
            padding: 0.7rem 1rem;
          }
        }

        @media (max-width: 480px) {
          .popup-container {
            max-width: 98%;
          }

          .form-label {
            font-size: 0.85rem;
          }

          .form-input {
            padding: 0.6rem 0.8rem;
            font-size: 0.9rem;
          }

          .gender-label {
            font-size: 0.85rem;
          }

          .btn-cancel,
          .btn-submit {
            font-size: 0.9rem;
          }
        }

        /* Tablet Optimization */
        @media (min-width: 769px) and (max-width: 1024px) {
          .popup-container {
            max-width: 500px;
          }
        }

        /* Loading state for button (optional) */
        .btn-submit:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }
      `}</style>
    </>
  );
}