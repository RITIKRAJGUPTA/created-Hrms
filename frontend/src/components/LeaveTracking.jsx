import { useEffect, useState } from "react";

export default function LeaveTracking() {
  const [history, setHistory] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");
  const [loading, setLoading] = useState(true);

  // Fetch leave history
  const fetchHistory = async () => {
    try {
      setLoading(true);
      const res = await fetch("https://hrms-6s7f.onrender.com/api/hr/leave-history");
      const data = await res.json();
      setHistory(data);
    } catch (err) {
      console.error("Error loading leave history:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const filteredHistory = history.filter((item) => {
    const matchName = item.employee?.name.toLowerCase().includes(search.toLowerCase());
    const matchType = filter ? item.type === filter : true;
    return matchName && matchType;
  });

  // Get leave type configuration
  const getLeaveConfig = (type) => {
    switch(type) {
      case "SL":
        return { 
          label: "Sick Leave", 
          gradient: "linear-gradient(135deg, #dc3545, #e83e8c)",
          icon: "🤒",
          bgLight: "rgba(220,53,69,0.1)"
        };
      case "CL":
        return { 
          label: "Casual Leave", 
          gradient: "linear-gradient(135deg, #ffc107, #fd7e14)",
          icon: "🏖️",
          bgLight: "rgba(255,193,7,0.1)"
        };
      case "PL":
        return { 
          label: "Paid Leave", 
          gradient: "linear-gradient(135deg, #007bff, #6610f2)",
          icon: "💰",
          bgLight: "rgba(0,123,255,0.1)"
        };
      default:
        return { 
          label: type, 
          gradient: "linear-gradient(135deg, #6c757d, #495057)",
          icon: "📋",
          bgLight: "rgba(108,117,125,0.1)"
        };
    }
  };

  // Format date nicely
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) {
      return "Today";
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    }
  };

  // Get statistics
  const stats = {
    total: history.length,
    sl: history.filter(item => item.type === "SL").length,
    cl: history.filter(item => item.type === "CL").length,
    pl: history.filter(item => item.type === "PL").length
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
        
        {/* Hero Section */}
        <div className="mb-4 mb-md-5">
          <div className="text-center text-md-start">
            <div className="mb-2 mb-md-3">
              <span className="badge px-2 px-md-3 py-1 py-md-2 rounded-pill" style={{ 
                background: 'rgba(255,255,255,0.2)',
                backdropFilter: 'blur(10px)',
                color: 'white',
                fontSize: 'clamp(0.7rem, 3vw, 0.8rem)'
              }}>
                📅 Leave Tracking System
              </span>
            </div>
            <h1 className="fw-bold mb-2 mb-md-3 text-white" style={{ 
              letterSpacing: '-0.02em',
              textShadow: '2px 2px 4px rgba(0,0,0,0.1)',
              fontSize: 'clamp(1.5rem, 6vw, 2.5rem)'
            }}>
              Leave Tracking
            </h1>
            <p className="text-white-50 mb-0" style={{ fontSize: 'clamp(0.8rem, 4vw, 1rem)' }}>
              Track and monitor all employee leave requests
            </p>
          </div>
        </div>

        {/* Statistics Cards */}
        {!loading && history.length > 0 && (
          <div className="row g-2 g-md-3 mb-4 mb-md-5">
            <div className="col-6 col-sm-3">
              <div className="card border-0 rounded-3 rounded-md-4 shadow-lg" style={{ background: 'rgba(255,255,255,0.95)' }}>
                <div className="card-body p-2 p-md-3 text-center">
                  <div className="d-flex flex-column align-items-center">
                    <span style={{ fontSize: 'clamp(1.2rem, 5vw, 1.5rem)' }}>📊</span>
                    <div className="fw-bold mt-1" style={{ color: '#667eea', fontSize: 'clamp(1.1rem, 4vw, 1.3rem)' }}>{stats.total}</div>
                    <small className="text-muted" style={{ fontSize: 'clamp(0.65rem, 3vw, 0.7rem)' }}>Total Leaves</small>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-6 col-sm-3">
              <div className="card border-0 rounded-3 rounded-md-4 shadow-lg" style={{ background: 'rgba(255,255,255,0.95)' }}>
                <div className="card-body p-2 p-md-3 text-center">
                  <div className="d-flex flex-column align-items-center">
                    <span style={{ fontSize: 'clamp(1.2rem, 5vw, 1.5rem)' }}>🤒</span>
                    <div className="fw-bold mt-1" style={{ color: '#dc3545', fontSize: 'clamp(1.1rem, 4vw, 1.3rem)' }}>{stats.sl}</div>
                    <small className="text-muted" style={{ fontSize: 'clamp(0.65rem, 3vw, 0.7rem)' }}>Sick Leave</small>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-6 col-sm-3">
              <div className="card border-0 rounded-3 rounded-md-4 shadow-lg" style={{ background: 'rgba(255,255,255,0.95)' }}>
                <div className="card-body p-2 p-md-3 text-center">
                  <div className="d-flex flex-column align-items-center">
                    <span style={{ fontSize: 'clamp(1.2rem, 5vw, 1.5rem)' }}>🏖️</span>
                    <div className="fw-bold mt-1" style={{ color: '#ffc107', fontSize: 'clamp(1.1rem, 4vw, 1.3rem)' }}>{stats.cl}</div>
                    <small className="text-muted" style={{ fontSize: 'clamp(0.65rem, 3vw, 0.7rem)' }}>Casual Leave</small>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-6 col-sm-3">
              <div className="card border-0 rounded-3 rounded-md-4 shadow-lg" style={{ background: 'rgba(255,255,255,0.95)' }}>
                <div className="card-body p-2 p-md-3 text-center">
                  <div className="d-flex flex-column align-items-center">
                    <span style={{ fontSize: 'clamp(1.2rem, 5vw, 1.5rem)' }}>💰</span>
                    <div className="fw-bold mt-1" style={{ color: '#007bff', fontSize: 'clamp(1.1rem, 4vw, 1.3rem)' }}>{stats.pl}</div>
                    <small className="text-muted" style={{ fontSize: 'clamp(0.65rem, 3vw, 0.7rem)' }}>Paid Leave</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Filters Section - Mobile Optimized */}
        <div className="mb-3 mb-md-4">
          <div className="row g-2">
            <div className="col-12 col-md-6">
              <div className="position-relative">
                <input
                  type="text"
                  placeholder="🔍 Search employee name..."
                  className="form-control rounded-pill border-0 shadow-sm"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  style={{ 
                    paddingLeft: '40px',
                    paddingRight: '40px',
                    background: 'rgba(255,255,255,0.95)',
                    height: 'clamp(40px, 8vw, 45px)',
                    fontSize: 'clamp(0.85rem, 3.5vw, 0.95rem)'
                  }}
                />
                <span style={{ 
                  position: 'absolute', 
                  left: '15px', 
                  top: '50%', 
                  transform: 'translateY(-50%)',
                  fontSize: 'clamp(0.9rem, 3.5vw, 1rem)'
                }}>🔍</span>
              </div>
            </div>

            <div className="col-8 col-md-4">
              <select
                className="form-select rounded-pill border-0 shadow-sm"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                style={{ 
                  background: 'rgba(255,255,255,0.95)',
                  cursor: 'pointer',
                  height: 'clamp(40px, 8vw, 45px)',
                  fontSize: 'clamp(0.85rem, 3.5vw, 0.95rem)'
                }}
              >
                <option value="">All Leave Types</option>
                <option value="SL">🤒 Sick Leave (SL)</option>
                <option value="CL">🏖️ Casual Leave (CL)</option>
                <option value="PL">💰 Paid Leave (PL)</option>
              </select>
            </div>

            <div className="col-4 col-md-2">
              <button
                className="btn btn-light rounded-pill w-100 shadow-sm"
                onClick={() => {
                  setSearch("");
                  setFilter("");
                }}
                style={{
                  height: 'clamp(40px, 8vw, 45px)',
                  fontSize: 'clamp(0.85rem, 3.5vw, 0.95rem)',
                  fontWeight: '500',
                  transition: 'all 0.3s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
              >
                🔄 Reset
              </button>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-5">
            <div className="spinner-border text-light mb-3" role="status" style={{ width: 'clamp(2rem, 8vw, 3rem)', height: 'clamp(2rem, 8vw, 3rem)' }}>
              <span className="visually-hidden">Loading...</span>
            </div>
            <h5 className="text-white" style={{ fontSize: 'clamp(1rem, 4vw, 1.25rem)' }}>Loading leave records...</h5>
          </div>
        )}

        {/* Results Count */}
        {!loading && history.length > 0 && (
          <div className="mb-2 mb-md-3">
            <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
              <div>
                <span className="badge bg-white text-dark px-2 px-md-3 py-1 py-md-2 rounded-pill shadow-sm" style={{ fontSize: 'clamp(0.7rem, 3vw, 0.8rem)' }}>
                  📋 {filteredHistory.length} of {history.length} records
                </span>
              </div>
              {(search || filter) && (
                <button 
                  className="btn btn-link btn-sm text-white" 
                  onClick={() => {
                    setSearch("");
                    setFilter("");
                  }}
                  style={{ fontSize: 'clamp(0.7rem, 3vw, 0.8rem)' }}
                >
                  Clear all filters ✖
                </button>
              )}
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredHistory.length === 0 && (
          <div className="text-center py-5">
            <div className="mb-3" style={{ fontSize: 'clamp(3rem, 10vw, 4rem)' }}>📭</div>
            <h4 className="text-white mb-2" style={{ fontSize: 'clamp(1rem, 5vw, 1.3rem)' }}>No Leave Records Found</h4>
            <p className="text-white-50" style={{ fontSize: 'clamp(0.8rem, 3.5vw, 0.9rem)' }}>
              {search || filter ? "Try adjusting your search or filters" : "No leave requests have been submitted yet"}
            </p>
          </div>
        )}

        {/* Records Display - Mobile First Card View */}
        {!loading && filteredHistory.length > 0 && (
          <div className="row g-2 g-md-3">
            {filteredHistory.map((item, index) => {
              const leaveConfig = getLeaveConfig(item.type);
              return (
                <div key={item._id} className="col-12">
                  <div className="card border-0 rounded-3 rounded-md-4 shadow-lg" style={{ 
                    background: 'rgba(255, 255, 255, 0.95)',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    cursor: 'pointer',
                    overflow: 'hidden'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-3px)';
                    e.currentTarget.style.boxShadow = '0 10px 25px rgba(0,0,0,0.15)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 0.5rem 1rem rgba(0,0,0,0.15)';
                  }}>
                    <div className="card-body p-3 p-md-4">
                      <div className="d-flex justify-content-between align-items-start mb-2 mb-md-3">
                        <div className="flex-grow-1" style={{ paddingRight: '8px' }}>
                          <div className="d-flex align-items-center gap-2 mb-1">
                            <h6 className="fw-bold mb-0" style={{ fontSize: 'clamp(0.9rem, 4vw, 1rem)' }}>
                              {item.employee?.name || 'N/A'}
                            </h6>
                            <span className="badge bg-secondary rounded-pill" style={{ fontSize: 'clamp(0.65rem, 2.5vw, 0.7rem)' }}>
                              #{index + 1}
                            </span>
                          </div>
                          <code className="text-secondary" style={{ fontSize: 'clamp(0.7rem, 3vw, 0.8rem)' }}>
                            {item.employee?.employeeCode || 'N/A'}
                          </code>
                        </div>
                        <span 
                          className="badge px-2 px-md-3 py-1 py-md-2 rounded-pill shadow-sm text-white"
                          style={{ 
                            background: leaveConfig.gradient,
                            fontSize: 'clamp(0.7rem, 3vw, 0.8rem)',
                            fontWeight: '500'
                          }}
                        >
                          {leaveConfig.icon} {leaveConfig.label}
                        </span>
                      </div>
                      
                      <hr className="my-2 my-md-3" />
                      
                      <div className="d-flex justify-content-between align-items-center">
                        <div className="d-flex align-items-center gap-2">
                          <span style={{ fontSize: 'clamp(0.9rem, 4vw, 1rem)' }}>📅</span>
                          <div>
                            <div className="fw-semibold" style={{ fontSize: 'clamp(0.8rem, 3.5vw, 0.9rem)' }}>
                              {formatDate(item.date)}
                            </div>
                            <small className="text-muted" style={{ fontSize: 'clamp(0.6rem, 2.5vw, 0.7rem)' }}>
                              Leave Date
                            </small>
                          </div>
                        </div>
                        <div className="text-end">
                          <div className="fw-semibold" style={{ fontSize: 'clamp(0.8rem, 3.5vw, 0.9rem)' }}>
                            {item.type}
                          </div>
                          <small className="text-muted" style={{ fontSize: 'clamp(0.6rem, 2.5vw, 0.7rem)' }}>
                            Leave Type
                          </small>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Footer */}
        {!loading && history.length > 0 && (
          <div className="mt-3 mt-md-4 pt-2 pt-md-3 text-center">
            <div className="text-white-50" style={{ fontSize: 'clamp(0.65rem, 2.5vw, 0.75rem)' }}>
              ⚡ Last updated: {new Date().toLocaleString()}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}