import { useEffect, useState } from "react";
import * as XLSX from "xlsx";

export default function SeeAttendance() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  // Fetch Attendance History
  const fetchAttendance = async () => {
    try {
      const res = await fetch("https://hrms-6s7f.onrender.com/api/hr/attendance/all");
      const data = await res.json();
      setRecords(data);
    } catch (err) {
      console.error("Error loading attendance:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, []);

  // Helper function to format date
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

  // Get full formatted date for export
  const getFullDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Get status configuration
  const getStatusConfig = (status) => {
    switch(status) {
      case "P":
        return { 
          label: "Present", 
          gradient: "linear-gradient(135deg, #00b09b, #96c93d)",
          icon: "✅",
          bgLight: "rgba(0,176,155,0.1)"
        };
      case "A":
        return { 
          label: "Absent", 
          gradient: "linear-gradient(135deg, #f12711, #f5af19)",
          icon: "❌",
          bgLight: "rgba(241,39,17,0.1)"
        };
      case "SL":
        return { 
          label: "Sick Leave", 
          gradient: "linear-gradient(135deg, #4facfe, #00f2fe)",
          icon: "🤒",
          bgLight: "rgba(79,172,254,0.1)"
        };
      case "CL":
        return { 
          label: "Casual Leave", 
          gradient: "linear-gradient(135deg, #fa709a, #fee140)",
          icon: "🏖️",
          bgLight: "rgba(250,112,154,0.1)"
        };
      case "PL":
        return { 
          label: "Paid Leave", 
          gradient: "linear-gradient(135deg, #a8edea, #fed6e3)",
          icon: "💎",
          bgLight: "rgba(168,237,234,0.1)"
        };
      default:
        return { 
          label: status || "Unknown", 
          gradient: "linear-gradient(135deg, #667eea, #764ba2)",
          icon: "❓",
          bgLight: "rgba(102,126,234,0.1)"
        };
    }
  };

  // Get statistics
  const getStatusStats = () => {
    const stats = { present: 0, absent: 0, sl: 0, cl: 0, pl: 0 };
    records.forEach(record => {
      const status = record.status;
      if (status === 'P') stats.present++;
      else if (status === 'A') stats.absent++;
      else if (status === 'SL') stats.sl++;
      else if (status === 'CL') stats.cl++;
      else if (status === 'PL') stats.pl++;
    });
    return stats;
  };

  // Filter records
  const filteredRecords = records.filter(record => {
    const matchesSearch = record.employee?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.employee?.employeeCode?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || record.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  // Export to Excel function
  const exportToExcel = () => {
    // Prepare data for export
    const exportData = filteredRecords.map((record, index) => ({
      "S.No": index + 1,
      "Employee Name": record.employee?.name || 'N/A',
      "Employee Code": record.employee?.employeeCode || 'N/A',
      "Email": record.employee?.email || 'N/A',
      "Date": getFullDate(record.date),
      "Status": getStatusConfig(record.status).label,
      "Status Code": record.status || 'N/A'
    }));

    // Add summary sheet
    const stats = getStatusStats();
    const summaryData = [
      { "Metric": "Total Records", "Value": records.length },
      { "Metric": "Present", "Value": stats.present },
      { "Metric": "Absent", "Value": stats.absent },
      { "Metric": "Sick Leave (SL)", "Value": stats.sl },
      { "Metric": "Casual Leave (CL)", "Value": stats.cl },
      { "Metric": "Paid Leave (PL)", "Value": stats.pl },
      { "Metric": "Attendance Rate", "Value": `${((stats.present / records.length) * 100).toFixed(2)}%` },
      { "Metric": "Export Date", "Value": new Date().toLocaleString() }
    ];

    // Create workbook and sheets
    const wb = XLSX.utils.book_new();
    
    // Main data sheet
    const wsData = XLSX.utils.json_to_sheet(exportData);
    
    // Summary sheet
    const wsSummary = XLSX.utils.json_to_sheet(summaryData);
    
    // Style the sheets
    wsData['!cols'] = [
      { wch: 8 },   // S.No
      { wch: 25 },  // Employee Name
      { wch: 15 },  // Employee Code
      { wch: 30 },  // Email
      { wch: 15 },  // Date
      { wch: 15 },  // Status
      { wch: 12 }   // Status Code
    ];
    
    wsSummary['!cols'] = [
      { wch: 20 },  // Metric
      { wch: 15 }   // Value
    ];
    
    // Add sheets to workbook
    XLSX.utils.book_append_sheet(wb, wsData, "Attendance Records");
    XLSX.utils.book_append_sheet(wb, wsSummary, "Summary");
    
    // Generate filename with current date
    const fileName = `Attendance_Report_${new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })}.xlsx`;
    
    // Save the file
    XLSX.writeFile(wb, fileName);
  };

  const stats = getStatusStats();
  const totalRecords = records.length;
  const attendancePercentage = totalRecords > 0 ? ((stats.present / totalRecords) * 100).toFixed(1) : 0;

  return (
    <div style={{ 
      background: 'radial-gradient(circle at 10% 20%, rgba(216, 241, 230, 0.4) 0%, rgba(233, 226, 226, 0.4) 90%)',
      minHeight: '100vh',
      fontFamily: "'Inter', 'Poppins', sans-serif"
    }}>
      <div className="container-fluid px-3 px-md-4 px-lg-5 py-4 py-md-5">
        
        {/* Animated Background Elements */}
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, overflow: 'hidden', zIndex: 0, pointerEvents: 'none' }}>
          <div style={{ position: 'absolute', top: '10%', left: '5%', width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(102,126,234,0.1) 0%, rgba(118,75,162,0) 70%)', borderRadius: '50%' }}></div>
          <div style={{ position: 'absolute', bottom: '10%', right: '5%', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(0,176,155,0.1) 0%, rgba(150,201,61,0) 70%)', borderRadius: '50%' }}></div>
        </div>

        {/* Main Content */}
        <div style={{ position: 'relative', zIndex: 1 }}>
          
          {/* Hero Section */}
          <div className="mb-5 text-center text-md-start">
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-end">
              <div>
                <div className="mb-3">
                  <span className="badge px-3 py-2 rounded-pill" style={{ 
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    boxShadow: '0 4px 15px rgba(102,126,234,0.3)'
                  }}>
                    ✨ Live Dashboard ✨
                  </span>
                </div>
                <h1 className="display-4 fw-bold mb-3" style={{ 
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%, #f093fb 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  letterSpacing: '-0.02em'
                }}>
                  Attendance Analytics
                </h1>
                <p className="lead text-muted">Track employee attendance with beautiful insights</p>
              </div>
              
              {!loading && records.length > 0 && (
                <div className="mt-3 mt-md-0 d-flex gap-3">
                  {/* Export Button */}
                  <button
                    onClick={exportToExcel}
                    className="btn btn-success rounded-pill shadow-lg px-4 py-2 fw-bold"
                    style={{
                      background: 'linear-gradient(135deg, #28a745, #20c997)',
                      border: 'none',
                      transition: 'transform 0.3s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                  >
                    📊 Export to Excel
                  </button>
                  
                  <div className="px-4 py-2 bg-white rounded-4 shadow-lg" style={{ backdropFilter: 'blur(10px)' }}>
                    <div className="d-flex align-items-center gap-3">
                      <div className="text-center">
                        <div className="display-6 fw-bold" style={{ color: '#667eea' }}>{attendancePercentage}%</div>
                        <small className="text-muted">Attendance Rate</small>
                      </div>
                      <div className="vr"></div>
                      <div className="text-center">
                        <div className="display-6 fw-bold" style={{ color: '#00b09b' }}>+{stats.present}</div>
                        <small className="text-muted">This Month</small>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Stats Cards with Glassmorphism */}
          {!loading && records.length > 0 && (
            <div className="row g-4 mb-5">
              <div className="col-6 col-md-4 col-lg-2">
                <div className="card border-0 rounded-4 shadow-lg h-100" style={{ 
                  background: 'rgba(255, 255, 255, 0.9)',
                  backdropFilter: 'blur(10px)',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer'
                }} onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-8px)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0px)'}>
                  <div className="card-body text-center p-4">
                    <div className="mb-3">
                      <div className="rounded-circle d-inline-flex align-items-center justify-content-center" style={{ width: '60px', height: '60px', background: 'linear-gradient(135deg, #667eea20, #764ba220)' }}>
                        <span className="display-6">📊</span>
                      </div>
                    </div>
                    <div className="display-5 fw-bold" style={{ color: '#667eea' }}>{totalRecords}</div>
                    <div className="text-muted small fw-semibold mt-2">Total Records</div>
                  </div>
                </div>
              </div>
              
              <div className="col-6 col-md-4 col-lg-2">
                <div className="card border-0 rounded-4 shadow-lg h-100" style={{ background: 'rgba(255, 255, 255, 0.9)', backdropFilter: 'blur(10px)', transition: 'all 0.3s ease', cursor: 'pointer' }} onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-8px)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0px)'}>
                  <div className="card-body text-center p-4">
                    <div className="mb-3">
                      <div className="rounded-circle d-inline-flex align-items-center justify-content-center" style={{ width: '60px', height: '60px', background: 'linear-gradient(135deg, #00b09b20, #96c93d20)' }}>
                        <span className="display-6">✅</span>
                      </div>
                    </div>
                    <div className="display-5 fw-bold" style={{ color: '#00b09b' }}>{stats.present}</div>
                    <div className="text-muted small fw-semibold mt-2">Present</div>
                  </div>
                </div>
              </div>

              <div className="col-6 col-md-4 col-lg-2">
                <div className="card border-0 rounded-4 shadow-lg h-100" style={{ background: 'rgba(255, 255, 255, 0.9)', backdropFilter: 'blur(10px)', transition: 'all 0.3s ease', cursor: 'pointer' }} onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-8px)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0px)'}>
                  <div className="card-body text-center p-4">
                    <div className="mb-3">
                      <div className="rounded-circle d-inline-flex align-items-center justify-content-center" style={{ width: '60px', height: '60px', background: 'linear-gradient(135deg, #f1271120, #f5af1920)' }}>
                        <span className="display-6">❌</span>
                      </div>
                    </div>
                    <div className="display-5 fw-bold" style={{ color: '#f12711' }}>{stats.absent}</div>
                    <div className="text-muted small fw-semibold mt-2">Absent</div>
                  </div>
                </div>
              </div>

              <div className="col-6 col-md-4 col-lg-2">
                <div className="card border-0 rounded-4 shadow-lg h-100" style={{ background: 'rgba(255, 255, 255, 0.9)', backdropFilter: 'blur(10px)', transition: 'all 0.3s ease', cursor: 'pointer' }} onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-8px)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0px)'}>
                  <div className="card-body text-center p-4">
                    <div className="mb-3">
                      <div className="rounded-circle d-inline-flex align-items-center justify-content-center" style={{ width: '60px', height: '60px', background: 'linear-gradient(135deg, #4facfe20, #00f2fe20)' }}>
                        <span className="display-6">🤒</span>
                      </div>
                    </div>
                    <div className="display-5 fw-bold" style={{ color: '#4facfe' }}>{stats.sl}</div>
                    <div className="text-muted small fw-semibold mt-2">Sick Leave</div>
                  </div>
                </div>
              </div>

              <div className="col-6 col-md-4 col-lg-2">
                <div className="card border-0 rounded-4 shadow-lg h-100" style={{ background: 'rgba(255, 255, 255, 0.9)', backdropFilter: 'blur(10px)', transition: 'all 0.3s ease', cursor: 'pointer' }} onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-8px)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0px)'}>
                  <div className="card-body text-center p-4">
                    <div className="mb-3">
                      <div className="rounded-circle d-inline-flex align-items-center justify-content-center" style={{ width: '60px', height: '60px', background: 'linear-gradient(135deg, #fa709a20, #fee14020)' }}>
                        <span className="display-6">🏖️</span>
                      </div>
                    </div>
                    <div className="display-5 fw-bold" style={{ color: '#fa709a' }}>{stats.cl}</div>
                    <div className="text-muted small fw-semibold mt-2">Casual Leave</div>
                  </div>
                </div>
              </div>

              <div className="col-6 col-md-4 col-lg-2">
                <div className="card border-0 rounded-4 shadow-lg h-100" style={{ background: 'rgba(255, 255, 255, 0.9)', backdropFilter: 'blur(10px)', transition: 'all 0.3s ease', cursor: 'pointer' }} onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-8px)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0px)'}>
                  <div className="card-body text-center p-4">
                    <div className="mb-3">
                      <div className="rounded-circle d-inline-flex align-items-center justify-content-center" style={{ width: '60px', height: '60px', background: 'linear-gradient(135deg, #a8edea20, #fed6e320)' }}>
                        <span className="display-6">💎</span>
                      </div>
                    </div>
                    <div className="display-5 fw-bold" style={{ color: '#a8edea' }}>{stats.pl}</div>
                    <div className="text-muted small fw-semibold mt-2">Paid Leave</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Search and Filter Section */}
          {!loading && records.length > 0 && (
            <div className="mb-4">
              <div className="row g-3">
                <div className="col-md-7">
                  <div className="position-relative">
                    <input
                      type="text"
                      className="form-control form-control-lg rounded-5 border-0 shadow-sm"
                      placeholder="🔍 Search by employee name or code..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      style={{ paddingLeft: '45px', background: 'rgba(255,255,255,0.9)' }}
                    />
                    <span style={{ position: 'absolute', left: '18px', top: '12px', fontSize: '20px' }}>🔍</span>
                  </div>
                </div>
                <div className="col-md-3">
                  <select
                    className="form-select form-select-lg rounded-5 border-0 shadow-sm"
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    style={{ background: 'rgba(255,255,255,0.9)', cursor: 'pointer' }}
                  >
                    <option value="all">📋 All Status</option>
                    <option value="P">✅ Present</option>
                    <option value="A">❌ Absent</option>
                    <option value="SL">🤒 Sick Leave</option>
                    <option value="CL">🏖️ Casual Leave</option>
                    <option value="PL">💎 Paid Leave</option>
                  </select>
                </div>
                <div className="col-md-2">
                  <button
                    onClick={exportToExcel}
                    className="btn btn-success w-100 rounded-5 shadow-lg py-2 fw-bold"
                    style={{
                      background: 'linear-gradient(135deg, #28a745, #20c997)',
                      border: 'none',
                      height: '48px'
                    }}
                  >
                    📊 Export
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="text-center py-5">
              <div className="spinner-border text-primary mb-3" role="status" style={{ width: '4rem', height: '4rem' }}>
                <span className="visually-hidden">Loading...</span>
              </div>
              <h5 className="text-muted">Loading beautiful attendance records...</h5>
            </div>
          )}

          {/* Empty State */}
          {!loading && records.length === 0 && (
            <div className="text-center py-5">
              <div className="mb-4" style={{ fontSize: '5rem' }}>✨</div>
              <h4 className="text-muted mb-2">No attendance records found</h4>
              <p className="text-muted">Start tracking attendance to see beautiful insights</p>
            </div>
          )}

          {/* Records Display with Modern Cards */}
          {!loading && records.length > 0 && (
            <>
              {/* Results Count */}
              <div className="mb-3 d-flex justify-content-between align-items-center">
                <div>
                  <span className="fw-bold" style={{ color: '#667eea' }}>{filteredRecords.length}</span>
                  <span className="text-muted"> records found</span>
                </div>
                {searchTerm && (
                  <button className="btn btn-sm btn-link" onClick={() => setSearchTerm("")}>
                    Clear search ✖
                  </button>
                )}
              </div>

              {/* Desktop Table View */}
              <div className="d-none d-lg-block">
                <div className="card border-0 rounded-4 shadow-lg overflow-hidden" style={{ background: 'rgba(255, 255, 255, 0.95)' }}>
                  <div className="table-responsive">
                    <table className="table table-hover mb-0">
                      <thead>
                        <tr style={{ background: 'linear-gradient(135deg, #667eea, #764ba2)' }}>
                          <th className="border-0 text-white ps-4 py-3">#</th>
                          <th className="border-0 text-white py-3">Employee</th>
                          <th className="border-0 text-white py-3">Code</th>
                          <th className="border-0 text-white py-3">Date</th>
                          <th className="border-0 text-white py-3">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredRecords.map((item, index) => {
                          const statusConfig = getStatusConfig(item.status);
                          return (
                            <tr key={item._id} style={{ transition: 'all 0.3s', cursor: 'pointer' }} onMouseEnter={(e) => e.currentTarget.style.background = statusConfig.bgLight}>
                              <td className="ps-4 fw-bold text-muted">{index + 1}</td>
                              <td>
                                <div className="fw-semibold">{item.employee?.name || 'N/A'}</div>
                                <small className="text-muted">{item.employee?.email || ''}</small>
                              </td>
                              <td>
                                <span className="badge bg-light text-dark px-3 py-2 rounded-pill">
                                  {item.employee?.employeeCode || 'N/A'}
                                </span>
                              </td>
                              <td>
                                <span className="badge bg-light text-dark px-3 py-2 rounded-pill">
                                  📅 {formatDate(item.date)}
                                </span>
                              </td>
                              <td>
                                <span 
                                  className="badge px-3 py-2 rounded-pill shadow-sm"
                                  style={{ 
                                    background: statusConfig.gradient,
                                    color: 'white',
                                    fontWeight: '500'
                                  }}
                                >
                                  {statusConfig.icon} {statusConfig.label}
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Mobile/Tablet Card View */}
              <div className="d-lg-none">
                <div className="row g-3">
                  {filteredRecords.map((item, index) => {
                    const statusConfig = getStatusConfig(item.status);
                    return (
                      <div key={item._id} className="col-md-6 col-12">
                        <div className="card border-0 rounded-4 shadow-lg h-100" style={{ 
                          background: 'rgba(255, 255, 255, 0.95)',
                          transition: 'all 0.3s ease',
                          cursor: 'pointer'
                        }} onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0px)'}>
                          <div className="card-body p-4">
                            <div className="d-flex justify-content-between align-items-start mb-3">
                              <div>
                                <h5 className="fw-bold mb-1" style={{ color: '#333' }}>{item.employee?.name || 'N/A'}</h5>
                                <span className="badge bg-light text-dark px-3 py-2 rounded-pill mt-2">
                                  #{item.employee?.employeeCode || 'N/A'}
                                </span>
                              </div>
                              <span 
                                className="badge px-3 py-2 rounded-pill shadow-sm"
                                style={{ 
                                  background: statusConfig.gradient,
                                  color: 'white',
                                  fontSize: '0.9rem'
                                }}
                              >
                                {statusConfig.icon} {statusConfig.label}
                              </span>
                            </div>
                            <hr className="my-3" />
                            <div className="d-flex justify-content-between align-items-center">
                              <div>
                                <small className="text-muted d-block mb-1">📅 Date</small>
                                <span className="fw-semibold">{formatDate(item.date)}</span>
                              </div>
                              <div>
                                <small className="text-muted d-block mb-1">🔢 Record</small>
                                <span className="fw-semibold">#{index + 1}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Footer */}
              <div className="mt-4 pt-3 d-flex justify-content-between align-items-center flex-wrap gap-3">
                <div className="text-muted small">
                  🎯 Showing {filteredRecords.length} of {totalRecords} total records
                </div>
                <div className="text-muted small">
                  ⚡ Last updated: {new Date().toLocaleString()}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}