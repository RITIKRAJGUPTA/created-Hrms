import { useState, useEffect } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import AddEmployeePopup from "../components/AddEmployeePopup";

export default function Dashboard() {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");
  const userName = localStorage.getItem("userName") || "User";
  const [showPopup, setShowPopup] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const location = useLocation();
  const isBaseDashboard = location.pathname === "/dashboard";

  // Close sidebar on route change on mobile
  useEffect(() => {
    setSidebarOpen(false);
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("userName");
    localStorage.removeItem("name");
    navigate("/");
  };

  return (
    <div className="dashboard-layout">
      {/* Mobile Header */}
      <div className="mobile-header d-lg-none">
        <button 
          className="menu-toggle" 
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-label="Toggle menu"
        >
          <span className="hamburger"></span>
        </button>
        <h4 className="mb-0">Dashboard</h4>
        <div className="role-badge">{role?.toUpperCase()}</div>
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)}></div>
      )}

      {/* ================= LEFT SIDEBAR ================= */}
      <div className={`sidebar ${sidebarOpen ? 'sidebar-open' : ''}`}>
        <div className="sidebar-header">
          <h3 className="text-center mb-0">Menu</h3>
          <button className="close-sidebar d-lg-none" onClick={() => setSidebarOpen(false)}>×</button>
        </div>

        <div className="sidebar-menu">
          {/* ADMIN MENU */}
          {role === "admin" && (
            <>
              <Link 
                to="/dashboard/employees" 
                className="menu-item"
                onClick={() => setSidebarOpen(false)}
              >
                <span className="menu-icon">👥</span>
                <span>View All Employees</span>
              </Link>

              <Link 
                to="/dashboard/hr-list" 
                className="menu-item"
                onClick={() => setSidebarOpen(false)}
              >
                <span className="menu-icon">👔</span>
                <span>View HR Managers</span>
              </Link>
            </>
          )}

          {/* HR MENU */}
          {role === "hr" && (
            <>
              <div
                className="menu-item"
                style={{ cursor: "pointer" }}
                onClick={() => {
                  setShowPopup(true);
                  setSidebarOpen(false);
                }}
              >
                <span className="menu-icon">➕</span>
                <span>Add New Employee</span>
              </div>

              <Link 
                to="/dashboard/manage-employees" 
                className="menu-item"
                onClick={() => setSidebarOpen(false)}
              >
                <span className="menu-icon">📋</span>
                <span>Manage Employees</span>
              </Link>

              <Link 
                to="/dashboard/attendance" 
                className="menu-item"
                onClick={() => setSidebarOpen(false)}
              >
                <span className="menu-icon">✅</span>
                <span>Mark Attendance</span>
              </Link>

              <Link 
                to="/dashboard/see-attendance" 
                className="menu-item"
                onClick={() => setSidebarOpen(false)}
              >
                <span className="menu-icon">📊</span>
                <span>See Attendance</span>
              </Link>

              <Link 
                to="/dashboard/leave-status" 
                className="menu-item"
                onClick={() => setSidebarOpen(false)}
              >
                <span className="menu-icon">📝</span>
                <span>Leave Status</span>
              </Link>

              <Link 
                to="/dashboard/leave-tracking" 
                className="menu-item"
                onClick={() => setSidebarOpen(false)}
              >
                <span className="menu-icon">📅</span>
                <span>Leave Tracking</span>
              </Link>
            </>
          )}
        </div>

        {/* Logout Button in Sidebar */}
        <div className="sidebar-footer">
          <button className="logout-btn" onClick={handleLogout}>
            <span className="menu-icon">🚪</span>
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* ================= RIGHT CONTENT AREA ================= */}
      <div className="content-area">
        <div className="content-header">
          <div className="header-left">
            <Link to="/dashboard" className="dashboard-title">
              <h2 className="mb-0">Dashboard ({role?.toUpperCase()})</h2>
            </Link>
          </div>
          
          {/* Desktop Logout Button */}
          <div className="header-right d-none d-lg-block">
            <div className="user-info">
              <span className="user-name">👋 {userName}</span>
              <button className="logout-btn-desktop" onClick={handleLogout}>
                Logout
              </button>
            </div>
          </div>
        </div>

        <hr className="divider" />

        {/* Show welcome message ONLY when on base dashboard path */}
        {isBaseDashboard && (
          <div className="welcome-container">
            <div className={`welcome-card ${role === "admin" ? "admin-card" : "hr-card"}`}>
              <div className="welcome-icon">
                {role === "admin" ? "👋" : "🎯"}
              </div>
              <h1 className="welcome-title">Welcome, {userName}!</h1>
              
              <h3 className="welcome-subtitle">
                {role === "admin" ? (
                  <span>Administrator Dashboard</span>
                ) : (
                  <span>HR Manager Dashboard</span>
                )}
              </h3>
              
              <p className="welcome-description">
                {role === "admin" 
                  ? "You have full access to manage the HR system. View all employees and HR managers from the sidebar."
                  : "You can manage employees, track attendance, and handle leave requests. Use the sidebar to navigate."
                }
              </p>
              
              <div className="privileges-section">
                {role === "admin" ? (
                  <div className="alert admin-alert">
                    <h5>Admin Privileges:</h5>
                    <ul>
                      <li>View all employee records</li>
                      <li>Monitor HR managers</li>
                      <li>System-wide oversight</li>
                    </ul>
                  </div>
                ) : (
                  <div className="alert hr-alert">
                    <h5>HR Manager Tools:</h5>
                    <ul>
                      <li>Add and manage employees</li>
                      <li>Track attendance records</li>
                      <li>Approve/reject leave requests</li>
                    </ul>
                  </div>
                )}
              </div>
              
              <div className="footer-note">
                <small>Select an option from the sidebar to get started</small>
              </div>
            </div>
          </div>
        )}

        {/* Router Nested Pages will load here */}
        <div className="outlet-container">
          <Outlet />
        </div>
      </div>

      <AddEmployeePopup show={showPopup} onClose={() => setShowPopup(false)} />

      {/* ===== CSS ===== */}
      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        .dashboard-layout {
          display: flex;
          min-height: 100vh;
          background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
          position: relative;
        }

        /* Mobile Header */
        .mobile-header {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          background: white;
          padding: 1rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          z-index: 1000;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
        }

        .menu-toggle {
          background: none;
          border: none;
          cursor: pointer;
          padding: 0.5rem;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .hamburger {
          width: 25px;
          height: 3px;
          background: white;
          position: relative;
          border-radius: 3px;
        }

        .hamburger::before,
        .hamburger::after {
          content: '';
          position: absolute;
          width: 25px;
          height: 3px;
          background: white;
          border-radius: 3px;
          transition: all 0.3s;
        }

        .hamburger::before { top: -8px; }
        .hamburger::after { bottom: -8px; }

        .role-badge {
          background: rgba(255,255,255,0.2);
          padding: 0.25rem 0.75rem;
          border-radius: 20px;
          font-size: 0.875rem;
          font-weight: 600;
        }

        /* Sidebar Overlay */
        .sidebar-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0,0,0,0.5);
          z-index: 999;
          animation: fadeIn 0.3s;
        }

        /* Sidebar - Non-scrollable */
        .sidebar {
          width: 280px;
          background: linear-gradient(180deg, #1a1a2e 0%, #16213e 100%);
          color: white;
          display: flex;
          flex-direction: column;
          position: fixed;
          left: 0;
          top: 0;
          bottom: 0;
          z-index: 1000;
          transform: translateX(-100%);
          transition: transform 0.3s ease-in-out;
          box-shadow: 2px 0 10px rgba(0,0,0,0.1);
          overflow: hidden; /* Prevents scrolling */
        }

        .sidebar-open {
          transform: translateX(0);
        }

        .sidebar-header {
          padding: 1.5rem;
          border-bottom: 1px solid rgba(255,255,255,0.1);
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-shrink: 0; /* Prevents shrinking */
        }

        .close-sidebar {
          background: none;
          border: none;
          color: white;
          font-size: 2rem;
          cursor: pointer;
          line-height: 1;
          opacity: 0.7;
          transition: opacity 0.3s;
        }

        .close-sidebar:hover {
          opacity: 1;
        }

        .sidebar-menu {
          flex: 1;
          padding: 1rem 0;
          overflow-y: visible; /* Changed from auto to visible */
          overflow-x: visible;
          flex-shrink: 1;
        }

        .sidebar-footer {
          padding: 1rem;
          border-top: 1px solid rgba(255,255,255,0.1);
          flex-shrink: 0; /* Prevents shrinking */
          background: linear-gradient(180deg, #16213e 0%, #1a1a2e 100%);
        }

        .logout-btn {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 0.875rem 1.5rem;
          background: rgba(220, 53, 69, 0.2);
          border: 1px solid rgba(220, 53, 69, 0.3);
          color: #ff6b6b;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s;
          font-size: 1rem;
          font-weight: 500;
        }

        .logout-btn:hover {
          background: rgba(220, 53, 69, 0.3);
          border-color: rgba(220, 53, 69, 0.5);
          transform: translateX(5px);
        }

        .menu-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 0.875rem 1.5rem;
          color: rgba(255,255,255,0.8);
          text-decoration: none;
          transition: all 0.3s;
          cursor: pointer;
        }

        .menu-item:hover {
          background: rgba(255,255,255,0.1);
          color: white;
          padding-left: 2rem;
        }

        .menu-icon {
          font-size: 1.25rem;
          width: 24px;
        }

        /* Content Area */
        .content-area {
          flex: 1;
          margin-left: 0;
          padding: 1rem;
          transition: margin-left 0.3s;
          overflow-y: auto;
          height: 100vh;
        }

        .content-header {
          background: white;
          padding: 1rem 1.5rem;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.05);
          margin-bottom: 1rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .header-left {
          flex: 1;
        }

        .header-right {
          display: flex;
          align-items: center;
        }

        .user-info {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .user-name {
          color: #4a5568;
          font-weight: 500;
          padding: 0.5rem 1rem;
          background: #f7fafc;
          border-radius: 8px;
        }

        .logout-btn-desktop {
          padding: 0.5rem 1.5rem;
          background: linear-gradient(135deg, #dc3545 0%, #c82333 100%);
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 600;
          transition: all 0.3s;
        }

        .logout-btn-desktop:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(220, 53, 69, 0.3);
        }

        .dashboard-title {
          text-decoration: none;
          transition: transform 0.3s;
          display: inline-block;
        }

        .dashboard-title:hover {
          transform: translateX(5px);
        }

        .dashboard-title h2 {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin: 0;
        }

        .divider {
          border: none;
          height: 2px;
          background: linear-gradient(90deg, #667eea, #764ba2, transparent);
          margin: 1rem 0;
        }

        /* Welcome Container */
        .welcome-container {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: calc(100vh - 120px);
          padding: 1rem;
        }

        .welcome-card {
          max-width: 700px;
          width: 100%;
          background: white;
          border-radius: 24px;
          padding: 2rem;
          text-align: center;
          box-shadow: 0 20px 60px rgba(0,0,0,0.1);
          animation: slideUp 0.5s ease-out;
        }

        .admin-card {
          border-top: 5px solid #667eea;
        }

        .hr-card {
          border-top: 5px solid #48bb78;
        }

        .welcome-icon {
          font-size: 4rem;
          margin-bottom: 1rem;
        }

        .welcome-title {
          font-size: clamp(1.5rem, 5vw, 2.5rem);
          margin-bottom: 1rem;
          color: #2d3748;
        }

        .welcome-subtitle {
          font-size: clamp(1rem, 4vw, 1.5rem);
          margin-bottom: 1.5rem;
        }

        .welcome-subtitle span {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .welcome-description {
          color: #4a5568;
          line-height: 1.6;
          margin-bottom: 2rem;
          font-size: clamp(0.875rem, 3vw, 1rem);
        }

        .privileges-section {
          margin: 2rem 0;
        }

        .alert {
          padding: 1.25rem;
          border-radius: 12px;
          text-align: left;
        }

        .admin-alert {
          background: linear-gradient(135deg, #e0e7ff 0%, #ede9fe 100%);
          border-left: 4px solid #667eea;
        }

        .hr-alert {
          background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%);
          border-left: 4px solid #48bb78;
        }

        .alert h5 {
          margin-bottom: 0.75rem;
          font-size: 1rem;
        }

        .alert ul {
          margin: 0;
          padding-left: 1.25rem;
        }

        .alert li {
          margin: 0.5rem 0;
          font-size: 0.875rem;
        }

        .footer-note {
          margin-top: 2rem;
          padding-top: 1rem;
          border-top: 1px solid #e2e8f0;
          color: #718096;
        }

        .outlet-container {
          margin-top: 1rem;
        }

        /* Animations */
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
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
        @media (min-width: 992px) {
          .mobile-header {
            display: none;
          }

          .sidebar {
            position: relative;
            transform: translateX(0);
            height: 100vh;
          }

          .close-sidebar {
            display: none;
          }

          .content-area {
            margin-left: 0;
            overflow-y: auto;
          }

          .sidebar-overlay {
            display: none;
          }
        }

        @media (min-width: 1200px) {
          .sidebar {
            width: 300px;
          }

          .content-area {
            padding: 1.5rem;
          }
        }

        @media (max-width: 768px) {
          .welcome-card {
            padding: 1.5rem;
          }

          .alert {
            padding: 1rem;
          }

          .alert ul li {
            font-size: 0.8125rem;
          }

          .content-header {
            margin-top: 60px;
          }
          
          .sidebar {
            height: 100%;
          }
        }

        @media (max-width: 480px) {
          .welcome-card {
            padding: 1rem;
          }

          .welcome-icon {
            font-size: 3rem;
          }

          .privileges-section {
            margin: 1rem 0;
          }

          .alert h5 {
            font-size: 0.875rem;
          }

          .user-name {
            font-size: 0.875rem;
          }

          .logout-btn-desktop {
            padding: 0.5rem 1rem;
            font-size: 0.875rem;
          }
        }

        /* Custom Scrollbar for Content Area Only */
        .content-area::-webkit-scrollbar {
          width: 8px;
        }

        .content-area::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 4px;
        }

        .content-area::-webkit-scrollbar-thumb {
          background: #888;
          border-radius: 4px;
        }

        .content-area::-webkit-scrollbar-thumb:hover {
          background: #555;
        }
      `}</style>
    </div>
  );
}