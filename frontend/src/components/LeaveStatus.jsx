import { useEffect, useState } from "react";

export default function LeaveStatus() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchLeaveStatus = async () => {
    try {
      const res = await fetch("https://hrms-6s7f.onrender.com/api/hr/leave-status/all");
      const data = await res.json();
      setEmployees(data);
    } catch (err) {
      console.error("Error fetching leave status:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaveStatus();
  }, []);

  // Filter employees based on search
  const filteredEmployees = employees.filter(emp => 
    emp.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.employeeCode?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate total leaves summary
  const totalLeaves = employees.reduce((acc, emp) => {
    acc.sick += emp.leaves?.sick || 0;
    acc.casual += emp.leaves?.casual || 0;
    acc.paid += emp.leaves?.paid || 0;
    return acc;
  }, { sick: 0, casual: 0, paid: 0 });

  // Get color for leave count
  const getLeaveColor = (count, type) => {
    if (count === 0) return "#dc3545";
    if (count <= 2) return "#ffc107";
    if (type === 'sick' && count >= 5) return "#28a745";
    if (type === 'casual' && count >= 3) return "#28a745";
    if (type === 'paid' && count >= 10) return "#28a745";
    return "#17a2b8";
  };

  // Get status message
  const getLeaveStatus = (count, type) => {
    if (count === 0) return "Exhausted";
    if (count <= 2) return "Low";
    if (type === 'sick' && count >= 5) return "Healthy";
    if (type === 'casual' && count >= 3) return "Good";
    if (type === 'paid' && count >= 10) return "Ample";
    return "Available";
  };

  return (
    <div style={{ 
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      minHeight: '100vh',
      fontFamily: "'Inter', 'Poppins', sans-serif",
      width: '100%',
      overflowX: 'hidden'
    }}>
      <div className="container-fluid px-2 px-sm-3 px-md-4 px-lg-5 py-3 py-md-5" style={{ maxWidth: '100%', overflowX: 'hidden' }}>
        
        {/* Hero Section - Mobile Optimized */}
        <div className="mb-4 mb-md-5">
          <div className="text-center text-md-start">
            <div className="mb-2 mb-md-3">
              <span className="badge px-2 px-md-3 py-1 py-md-2 rounded-pill" style={{ 
                background: 'rgba(255,255,255,0.2)',
                backdropFilter: 'blur(10px)',
                color: 'white',
                fontSize: '0.75rem'
              }}>
                🌟 Leave Management
              </span>
            </div>
            <h1 className="h2 h1-md display-4 fw-bold mb-2 mb-md-3 text-white" style={{ 
              letterSpacing: '-0.02em',
              textShadow: '2px 2px 4px rgba(0,0,0,0.1)',
              fontSize: 'clamp(1.5rem, 5vw, 3rem)'
            }}>
              Employee Leave Status
            </h1>
            <p className="text-white-50 small mb-0" style={{ fontSize: 'clamp(0.875rem, 4vw, 1rem)' }}>
              Track and monitor leave balances for all employees
            </p>
          </div>
          
          {/* Stats Cards - Mobile Optimized */}
          {!loading && employees.length > 0 && (
            <div className="mt-3 mt-md-4">
              <div className="bg-white rounded-3 rounded-md-4 shadow-lg p-2 p-md-3">
                <div className="d-flex justify-content-around align-items-center">
                  <div className="text-center">
                    <div className="fw-bold" style={{ color: '#667eea', fontSize: 'clamp(1.2rem, 4vw, 2rem)' }}>{employees.length}</div>
                    <small className="text-muted" style={{ fontSize: 'clamp(0.65rem, 3vw, 0.75rem)' }}>Employees</small>
                  </div>
                  <div className="vr" style={{ height: '30px' }}></div>
                  <div className="text-center">
                    <div className="fw-bold" style={{ color: '#28a745', fontSize: 'clamp(1.2rem, 4vw, 2rem)' }}>{totalLeaves.sick}</div>
                    <small className="text-muted" style={{ fontSize: 'clamp(0.65rem, 3vw, 0.75rem)' }}>Total SL</small>
                  </div>
                  <div className="vr" style={{ height: '30px' }}></div>
                  <div className="text-center">
                    <div className="fw-bold" style={{ color: '#ffc107', fontSize: 'clamp(1.2rem, 4vw, 2rem)' }}>{totalLeaves.casual}</div>
                    <small className="text-muted" style={{ fontSize: 'clamp(0.65rem, 3vw, 0.75rem)' }}>Total CL</small>
                  </div>
                  <div className="vr" style={{ height: '30px' }}></div>
                  <div className="text-center">
                    <div className="fw-bold" style={{ color: '#17a2b8', fontSize: 'clamp(1.2rem, 4vw, 2rem)' }}>{totalLeaves.paid}</div>
                    <small className="text-muted" style={{ fontSize: 'clamp(0.65rem, 3vw, 0.75rem)' }}>Total PL</small>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Leave Information Cards - Mobile Optimized */}
        {!loading && employees.length > 0 && (
          <div className="row g-2 g-md-3 mb-3 mb-md-4">
            <div className="col-12 col-md-4">
              <div className="card border-0 rounded-3 rounded-md-4 shadow-sm" style={{ background: 'rgba(255,255,255,0.95)' }}>
                <div className="card-body p-2 p-md-4">
                  <div className="d-flex align-items-center gap-2 gap-md-3">
                    <div className="rounded-circle p-2 p-md-3" style={{ background: 'rgba(40,167,69,0.1)' }}>
                      <span style={{ fontSize: 'clamp(1rem, 4vw, 1.5rem)' }}>🏥</span>
                    </div>
                    <div>
                      <h6 className="mb-0 fw-bold" style={{ fontSize: 'clamp(0.8rem, 3.5vw, 1rem)' }}>Sick Leave (SL)</h6>
                      <p className="text-muted small mb-0 d-none d-sm-block">Medical leave for health issues</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-12 col-md-4">
              <div className="card border-0 rounded-3 rounded-md-4 shadow-sm" style={{ background: 'rgba(255,255,255,0.95)' }}>
                <div className="card-body p-2 p-md-4">
                  <div className="d-flex align-items-center gap-2 gap-md-3">
                    <div className="rounded-circle p-2 p-md-3" style={{ background: 'rgba(255,193,7,0.1)' }}>
                      <span style={{ fontSize: 'clamp(1rem, 4vw, 1.5rem)' }}>🏖️</span>
                    </div>
                    <div>
                      <h6 className="mb-0 fw-bold" style={{ fontSize: 'clamp(0.8rem, 3.5vw, 1rem)' }}>Casual Leave (CL)</h6>
                      <p className="text-muted small mb-0 d-none d-sm-block">Personal or family emergencies</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-12 col-md-4">
              <div className="card border-0 rounded-3 rounded-md-4 shadow-sm" style={{ background: 'rgba(255,255,255,0.95)' }}>
                <div className="card-body p-2 p-md-4">
                  <div className="d-flex align-items-center gap-2 gap-md-3">
                    <div className="rounded-circle p-2 p-md-3" style={{ background: 'rgba(23,162,184,0.1)' }}>
                      <span style={{ fontSize: 'clamp(1rem, 4vw, 1.5rem)' }}>💰</span>
                    </div>
                    <div>
                      <h6 className="mb-0 fw-bold" style={{ fontSize: 'clamp(0.8rem, 3.5vw, 1rem)' }}>Paid Leave (PL)</h6>
                      <p className="text-muted small mb-0 d-none d-sm-block">Annual vacation or planned leave</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Search Section - Mobile Optimized */}
        {!loading && employees.length > 0 && (
          <div className="mb-3 mb-md-4">
            <div className="position-relative">
              <input
                type="text"
                className="form-control rounded-pill border-0 shadow-sm"
                placeholder="🔍 Search by name or code..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ 
                  paddingLeft: '40px',
                  paddingRight: '40px',
                  background: 'rgba(255,255,255,0.95)',
                  height: 'clamp(40px, 8vw, 48px)',
                  fontSize: 'clamp(0.875rem, 3.5vw, 1rem)'
                }}
              />
              <span style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', fontSize: 'clamp(0.9rem, 3.5vw, 1.1rem)' }}>🔍</span>
              {searchTerm && (
                <button
                  className="btn btn-link position-absolute end-0 top-50 translate-middle-y me-2"
                  onClick={() => setSearchTerm("")}
                  style={{ textDecoration: 'none', padding: '0' }}
                >
                  ✖
                </button>
              )}
            </div>
          </div>
        )}

        {/* Loading State - Mobile Optimized */}
        {loading && (
          <div className="text-center py-5">
            <div className="spinner-border text-light mb-3" role="status" style={{ width: 'clamp(2rem, 8vw, 3rem)', height: 'clamp(2rem, 8vw, 3rem)' }}>
              <span className="visually-hidden">Loading...</span>
            </div>
            <h5 className="text-white" style={{ fontSize: 'clamp(1rem, 4vw, 1.25rem)' }}>Loading leave records...</h5>
          </div>
        )}

        {/* Empty State - Mobile Optimized */}
        {!loading && employees.length === 0 && (
          <div className="text-center py-5">
            <div className="mb-3" style={{ fontSize: 'clamp(3rem, 10vw, 4rem)' }}>📋</div>
            <h4 className="text-white mb-2" style={{ fontSize: 'clamp(1rem, 5vw, 1.5rem)' }}>No employee data found</h4>
            <p className="text-white-50" style={{ fontSize: 'clamp(0.8rem, 3.5vw, 1rem)' }}>No leave records available to display</p>
          </div>
        )}

        {/* Records Display - Mobile First */}
        {!loading && employees.length > 0 && (
          <>
            {/* Results Count */}
            {searchTerm && (
              <div className="mb-2 mb-md-3 text-center">
                <span className="badge bg-white text-dark px-2 px-md-3 py-1 py-md-2 rounded-pill shadow-sm" style={{ fontSize: 'clamp(0.7rem, 3vw, 0.8rem)' }}>
                  Found {filteredEmployees.length} of {employees.length} employees
                </span>
              </div>
            )}

            {/* Mobile Card View - Primary for all screen sizes */}
            <div className="row g-2 g-md-3">
              {filteredEmployees.map((emp, index) => (
                <div key={emp._id} className="col-12">
                  <div className="card border-0 rounded-3 rounded-md-4 shadow-lg" style={{ 
                    background: 'rgba(255, 255, 255, 0.95)',
                    transition: 'transform 0.2s',
                    overflow: 'hidden'
                  }}>
                    <div className="card-body p-3 p-md-4">
                      {/* Employee Header */}
                      <div className="d-flex justify-content-between align-items-start mb-2 mb-md-3">
                        <div className="flex-grow-1" style={{ paddingRight: '8px' }}>
                          <h6 className="fw-bold mb-1" style={{ fontSize: 'clamp(0.9rem, 4vw, 1.1rem)' }}>
                            {emp.name || 'N/A'}
                          </h6>
                          <code className="text-secondary" style={{ fontSize: 'clamp(0.7rem, 3vw, 0.8rem)' }}>
                            {emp.employeeCode || 'N/A'}
                          </code>
                          {emp.email && (
                            <div className="mt-1">
                              <small className="text-muted" style={{ fontSize: 'clamp(0.65rem, 3vw, 0.75rem)' }}>
                                {emp.email}
                              </small>
                            </div>
                          )}
                        </div>
                        <span className="badge bg-secondary rounded-pill" style={{ fontSize: 'clamp(0.65rem, 3vw, 0.75rem)' }}>
                          #{index + 1}
                        </span>
                      </div>
                      
                      {/* Leave Details Section */}
                      <div className="mt-2 mt-md-3">
                        <div className="mb-2 pb-1 border-bottom">
                          <small className="text-muted fw-bold" style={{ fontSize: 'clamp(0.7rem, 3vw, 0.75rem)' }}>
                            LEAVE BALANCES
                          </small>
                        </div>
                        
                        {/* Sick Leave */}
                        <div className="d-flex justify-content-between align-items-center mb-2 mb-md-3">
                          <div className="d-flex align-items-center gap-2">
                            <span style={{ fontSize: 'clamp(0.9rem, 4vw, 1.1rem)' }}>🏥</span>
                            <div>
                              <div className="fw-semibold" style={{ fontSize: 'clamp(0.8rem, 3.5vw, 0.9rem)' }}>
                                Sick Leave
                              </div>
                              <small className="text-muted" style={{ fontSize: 'clamp(0.6rem, 2.5vw, 0.7rem)' }}>
                                Medical leave
                              </small>
                            </div>
                          </div>
                          <div className="text-end">
                            <span className="fw-bold" style={{ 
                              color: getLeaveColor(emp.leaves?.sick, 'sick'),
                              fontSize: 'clamp(1rem, 4vw, 1.2rem)'
                            }}>
                              {emp.leaves?.sick || 0} days
                            </span>
                            <div>
                              <span className="badge" style={{
                                background: `${getLeaveColor(emp.leaves?.sick, 'sick')}20`,
                                color: getLeaveColor(emp.leaves?.sick, 'sick'),
                                fontSize: 'clamp(0.6rem, 2.5vw, 0.7rem)',
                                padding: '2px 6px'
                              }}>
                                {getLeaveStatus(emp.leaves?.sick, 'sick')}
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        {/* Casual Leave */}
                        <div className="d-flex justify-content-between align-items-center mb-2 mb-md-3">
                          <div className="d-flex align-items-center gap-2">
                            <span style={{ fontSize: 'clamp(0.9rem, 4vw, 1.1rem)' }}>🏖️</span>
                            <div>
                              <div className="fw-semibold" style={{ fontSize: 'clamp(0.8rem, 3.5vw, 0.9rem)' }}>
                                Casual Leave
                              </div>
                              <small className="text-muted" style={{ fontSize: 'clamp(0.6rem, 2.5vw, 0.7rem)' }}>
                                Personal leave
                              </small>
                            </div>
                          </div>
                          <div className="text-end">
                            <span className="fw-bold" style={{ 
                              color: getLeaveColor(emp.leaves?.casual, 'casual'),
                              fontSize: 'clamp(1rem, 4vw, 1.2rem)'
                            }}>
                              {emp.leaves?.casual || 0} days
                            </span>
                            <div>
                              <span className="badge" style={{
                                background: `${getLeaveColor(emp.leaves?.casual, 'casual')}20`,
                                color: getLeaveColor(emp.leaves?.casual, 'casual'),
                                fontSize: 'clamp(0.6rem, 2.5vw, 0.7rem)',
                                padding: '2px 6px'
                              }}>
                                {getLeaveStatus(emp.leaves?.casual, 'casual')}
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        {/* Paid Leave */}
                        <div className="d-flex justify-content-between align-items-center">
                          <div className="d-flex align-items-center gap-2">
                            <span style={{ fontSize: 'clamp(0.9rem, 4vw, 1.1rem)' }}>💰</span>
                            <div>
                              <div className="fw-semibold" style={{ fontSize: 'clamp(0.8rem, 3.5vw, 0.9rem)' }}>
                                Paid Leave
                              </div>
                              <small className="text-muted" style={{ fontSize: 'clamp(0.6rem, 2.5vw, 0.7rem)' }}>
                                Annual leave
                              </small>
                            </div>
                          </div>
                          <div className="text-end">
                            <span className="fw-bold" style={{ 
                              color: getLeaveColor(emp.leaves?.paid, 'paid'),
                              fontSize: 'clamp(1rem, 4vw, 1.2rem)'
                            }}>
                              {emp.leaves?.paid || 0} days
                            </span>
                            <div>
                              <span className="badge" style={{
                                background: `${getLeaveColor(emp.leaves?.paid, 'paid')}20`,
                                color: getLeaveColor(emp.leaves?.paid, 'paid'),
                                fontSize: 'clamp(0.6rem, 2.5vw, 0.7rem)',
                                padding: '2px 6px'
                              }}>
                                {getLeaveStatus(emp.leaves?.paid, 'paid')}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Legend Section - Mobile Optimized */}
            <div className="mt-3 mt-md-4">
              <div className="card border-0 rounded-3 rounded-md-4 shadow-sm" style={{ background: 'rgba(255,255,255,0.9)' }}>
                <div className="card-body p-2 p-md-3">
                  <div className="d-flex flex-wrap justify-content-center gap-2 gap-md-3">
                    <div className="d-flex align-items-center gap-1 gap-md-2">
                      <div className="rounded-circle" style={{ width: '8px', height: '8px', background: '#28a745' }}></div>
                      <small className="text-muted" style={{ fontSize: 'clamp(0.65rem, 2.5vw, 0.75rem)' }}>Good</small>
                    </div>
                    <div className="d-flex align-items-center gap-1 gap-md-2">
                      <div className="rounded-circle" style={{ width: '8px', height: '8px', background: '#ffc107' }}></div>
                      <small className="text-muted" style={{ fontSize: 'clamp(0.65rem, 2.5vw, 0.75rem)' }}>Low</small>
                    </div>
                    <div className="d-flex align-items-center gap-1 gap-md-2">
                      <div className="rounded-circle" style={{ width: '8px', height: '8px', background: '#dc3545' }}></div>
                      <small className="text-muted" style={{ fontSize: 'clamp(0.65rem, 2.5vw, 0.75rem)' }}>Exhausted</small>
                    </div>
                    <div className="d-flex align-items-center gap-1 gap-md-2">
                      <div className="rounded-circle" style={{ width: '8px', height: '8px', background: '#17a2b8' }}></div>
                      <small className="text-muted" style={{ fontSize: 'clamp(0.65rem, 2.5vw, 0.75rem)' }}>Available</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer - Mobile Optimized */}
            <div className="mt-2 mt-md-3 text-center">
              <div className="text-white-50" style={{ fontSize: 'clamp(0.65rem, 2.5vw, 0.75rem)' }}>
                📊 Showing {filteredEmployees.length} employee{filteredEmployees.length !== 1 ? 's' : ''}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}