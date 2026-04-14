import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

export default function ViewAllEmployees() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        setLoading(true);
        const res = await axios.get("https://hrms-6s7f.onrender.com/api/hr/employees");
        setEmployees(res.data);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    fetchEmployees();
  }, []);

  // Filter employees based on search
  const filteredEmployees = employees.filter(emp =>
    emp.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.employeeCode?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get statistics
  const stats = {
    total: employees.length,
    male: employees.filter(emp => emp.gender === "Male").length,
    female: employees.filter(emp => emp.gender === "Female").length
  };

  return (
    <div style={{ 
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      minHeight: '100vh',
      fontFamily: "'Inter', 'Poppins', sans-serif"
    }}>
      <div className="container-fluid px-2 px-sm-3 px-md-4 py-3 py-md-4">
        
        {/* Header Section */}
        <div className="mb-4">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
            <div>
              <div className="mb-2">
                <span className="badge px-3 py-2 rounded-pill" style={{ 
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  boxShadow: '0 2px 8px rgba(102,126,234,0.3)'
                }}>
                  👥 Employee Directory
                </span>
              </div>
              <h1 className="display-6 fw-bold mb-1" style={{ 
                color: '#1a1a2e',
                fontSize: 'clamp(1.5rem, 5vw, 2rem)'
              }}>
                All Employees
              </h1>
              <p className="text-muted" style={{ fontSize: 'clamp(0.8rem, 3.5vw, 0.9rem)' }}>
                Complete list of all registered employees
              </p>
            </div>
            
            {/* Stats Cards */}
            {!loading && employees.length > 0 && (
              <div className="d-flex gap-2 gap-md-3">
                <div className="card border-0 shadow-sm rounded-3" style={{ background: 'white' }}>
                  <div className="card-body p-2 p-md-3 text-center">
                    <div className="d-flex align-items-center gap-2">
                      <span className="display-6" style={{ fontSize: 'clamp(1.2rem, 4vw, 1.5rem)' }}>📊</span>
                      <div>
                        <div className="fw-bold" style={{ color: '#667eea', fontSize: 'clamp(1rem, 4vw, 1.2rem)' }}>{stats.total}</div>
                        <small className="text-muted" style={{ fontSize: 'clamp(0.65rem, 2.5vw, 0.7rem)' }}>Total</small>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="card border-0 shadow-sm rounded-3" style={{ background: 'white' }}>
                  <div className="card-body p-2 p-md-3 text-center">
                    <div className="d-flex align-items-center gap-2">
                      <span className="display-6" style={{ fontSize: 'clamp(1.2rem, 4vw, 1.5rem)' }}>👨</span>
                      <div>
                        <div className="fw-bold" style={{ color: '#4299e1', fontSize: 'clamp(1rem, 4vw, 1.2rem)' }}>{stats.male}</div>
                        <small className="text-muted" style={{ fontSize: 'clamp(0.65rem, 2.5vw, 0.7rem)' }}>Male</small>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="card border-0 shadow-sm rounded-3" style={{ background: 'white' }}>
                  <div className="card-body p-2 p-md-3 text-center">
                    <div className="d-flex align-items-center gap-2">
                      <span className="display-6" style={{ fontSize: 'clamp(1.2rem, 4vw, 1.5rem)' }}>👩</span>
                      <div>
                        <div className="fw-bold" style={{ color: '#ed64a6', fontSize: 'clamp(1rem, 4vw, 1.2rem)' }}>{stats.female}</div>
                        <small className="text-muted" style={{ fontSize: 'clamp(0.65rem, 2.5vw, 0.7rem)' }}>Female</small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Search Section */}
        {!loading && employees.length > 0 && (
          <div className="mb-4">
            <div className="position-relative">
              <input
                type="text"
                className="form-control rounded-pill border-0 shadow-sm"
                placeholder="🔍 Search by name, email or employee code..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ 
                  paddingLeft: '45px',
                  paddingRight: '40px',
                  background: 'white',
                  height: 'clamp(42px, 8vw, 50px)',
                  fontSize: 'clamp(0.85rem, 3.5vw, 0.95rem)'
                }}
              />
              <span style={{ 
                position: 'absolute', 
                left: '18px', 
                top: '50%', 
                transform: 'translateY(-50%)',
                fontSize: 'clamp(1rem, 4vw, 1.1rem)'
              }}>🔍</span>
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

        {/* Loading State */}
        {loading && (
          <div className="text-center py-5">
            <div className="spinner-border text-primary mb-3" role="status" style={{ width: 'clamp(2rem, 8vw, 3rem)', height: 'clamp(2rem, 8vw, 3rem)' }}>
              <span className="visually-hidden">Loading...</span>
            </div>
            <h5 className="text-muted" style={{ fontSize: 'clamp(1rem, 4vw, 1.25rem)' }}>Loading employees...</h5>
          </div>
        )}

        {/* Empty State */}
        {!loading && employees.length === 0 && (
          <div className="text-center py-5">
            <div className="mb-3" style={{ fontSize: 'clamp(3rem, 10vw, 4rem)' }}>👥</div>
            <h4 className="text-muted mb-2" style={{ fontSize: 'clamp(1rem, 5vw, 1.3rem)' }}>No employees found</h4>
            <p className="text-muted" style={{ fontSize: 'clamp(0.8rem, 3.5vw, 0.9rem)' }}>No employee records available to display</p>
          </div>
        )}

        {/* Results Count */}
        {!loading && employees.length > 0 && (
          <div className="mb-3">
            <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
              <div>
                <span className="badge bg-white text-dark px-3 py-2 rounded-pill shadow-sm" style={{ fontSize: 'clamp(0.7rem, 3vw, 0.8rem)' }}>
                  📋 {filteredEmployees.length} of {employees.length} employees
                </span>
              </div>
              {searchTerm && (
                <button 
                  className="btn btn-link btn-sm text-primary" 
                  onClick={() => setSearchTerm("")}
                  style={{ fontSize: 'clamp(0.7rem, 3vw, 0.8rem)' }}
                >
                  Clear search ✖
                </button>
              )}
            </div>
          </div>
        )}

        {/* Desktop Table View */}
        {!loading && filteredEmployees.length > 0 && (
          <>
            <div className="d-none d-lg-block">
              <div className="card border-0 rounded-4 shadow-lg overflow-hidden" style={{ background: 'white' }}>
                <div className="table-responsive">
                  <table className="table table-hover mb-0">
                    <thead>
                      <tr style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
                        <th className="border-0 text-white ps-4 py-3">#</th>
                        <th className="border-0 text-white py-3">Employee</th>
                        <th className="border-0 text-white py-3">Email</th>
                        <th className="border-0 text-white py-3">Employee Code</th>
                        <th className="border-0 text-white py-3">Gender</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredEmployees.map((emp, index) => (
                        <tr key={emp._id} style={{ transition: 'all 0.3s' }} onMouseEnter={(e) => e.currentTarget.style.background = '#f8f9fa'}>
                          <td className="ps-4 fw-bold text-muted">{index + 1}</td>
                          <td>
                            <div className="fw-semibold">{emp.name || 'N/A'}</div>
                            {emp.phone && <small className="text-muted">{emp.phone}</small>}
                          </td>
                          <td>
                            <span className="text-primary">{emp.email || 'N/A'}</span>
                          </td>
                          <td>
                            <code className="bg-light px-2 py-1 rounded">{emp.employeeCode || 'N/A'}</code>
                          </td>
                          <td>
                            <span className={`badge px-3 py-2 rounded-pill ${
                              emp.gender === 'Male' ? 'bg-info' : 'bg-danger'
                            }`} style={{ opacity: 0.9 }}>
                              {emp.gender === 'Male' ? '👨 Male' : '👩 Female'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Mobile/Tablet Card View */}
            <div className="d-lg-none">
              <div className="row g-3">
                {filteredEmployees.map((emp, index) => (
                  <div key={emp._id} className="col-12 col-md-6">
                    <div className="card border-0 rounded-4 shadow-lg h-100" style={{ 
                      background: 'white',
                      transition: 'transform 0.2s',
                      cursor: 'pointer'
                    }} onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-3px)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0px)'}>
                      <div className="card-body p-3 p-md-4">
                        <div className="d-flex justify-content-between align-items-start mb-3">
                          <div className="flex-grow-1" style={{ paddingRight: '8px' }}>
                            <div className="d-flex align-items-center gap-2 mb-1">
                              <h6 className="fw-bold mb-0" style={{ fontSize: 'clamp(0.9rem, 4vw, 1rem)' }}>
                                {emp.name || 'N/A'}
                              </h6>
                              <span className="badge bg-secondary rounded-pill" style={{ fontSize: 'clamp(0.65rem, 2.5vw, 0.7rem)' }}>
                                #{index + 1}
                              </span>
                            </div>
                            {emp.phone && (
                              <small className="text-muted d-block" style={{ fontSize: 'clamp(0.7rem, 3vw, 0.75rem)' }}>
                                📱 {emp.phone}
                              </small>
                            )}
                          </div>
                          <span className={`badge px-2 px-md-3 py-1 py-md-2 rounded-pill shadow-sm ${
                            emp.gender === 'Male' ? 'bg-info' : 'bg-danger'
                          }`} style={{ fontSize: 'clamp(0.7rem, 3vw, 0.75rem)' }}>
                            {emp.gender === 'Male' ? '👨 Male' : '👩 Female'}
                          </span>
                        </div>
                        
                        <hr className="my-2 my-md-3" />
                        
                        <div className="d-flex flex-column gap-2">
                          <div className="d-flex align-items-center gap-2">
                            <span style={{ fontSize: 'clamp(0.9rem, 4vw, 1rem)' }}>📧</span>
                            <div>
                              <div className="fw-semibold" style={{ fontSize: 'clamp(0.8rem, 3.5vw, 0.85rem)' }}>
                                {emp.email || 'N/A'}
                              </div>
                              <small className="text-muted" style={{ fontSize: 'clamp(0.6rem, 2.5vw, 0.65rem)' }}>
                                Email Address
                              </small>
                            </div>
                          </div>
                          
                          <div className="d-flex align-items-center gap-2">
                            <span style={{ fontSize: 'clamp(0.9rem, 4vw, 1rem)' }}>🆔</span>
                            <div>
                              <div className="fw-semibold" style={{ fontSize: 'clamp(0.8rem, 3.5vw, 0.85rem)' }}>
                                <code>{emp.employeeCode || 'N/A'}</code>
                              </div>
                              <small className="text-muted" style={{ fontSize: 'clamp(0.6rem, 2.5vw, 0.65rem)' }}>
                                Employee Code
                              </small>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Footer */}
        {!loading && employees.length > 0 && (
          <div className="mt-4 pt-3 text-center">
            <div className="text-muted" style={{ fontSize: 'clamp(0.65rem, 2.5vw, 0.75rem)' }}>
              ⚡ Last updated: {new Date().toLocaleString()}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}