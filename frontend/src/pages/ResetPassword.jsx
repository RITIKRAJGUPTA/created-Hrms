import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import {
  Lock,
  Key,
  CheckCircle,
  Eye,
  EyeOff,
  Shield,
  ArrowLeft,
  Sparkles,
  Loader2,
  AlertCircle,
  RefreshCw,
  Zap,
  LockKeyhole
} from "lucide-react";

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [success, setSuccess] = useState(false);
  const [validation, setValidation] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false
  });

  const checkPasswordStrength = (pass) => {
    const validations = {
      length: pass.length >= 8,
      uppercase: /[A-Z]/.test(pass),
      lowercase: /[a-z]/.test(pass),
      number: /[0-9]/.test(pass),
      special: /[^A-Za-z0-9]/.test(pass)
    };

    setValidation(validations);
    
    const strength = Object.values(validations).filter(Boolean).length;
    setPasswordStrength(strength);
    
    return strength;
  };

  const getStrengthColor = (strength) => {
    if (strength === 0) return "#e2e8f0";
    if (strength <= 2) return "#ef4444";
    if (strength <= 3) return "#f59e0b";
    if (strength <= 4) return "#3b82f6";
    return "#10b981";
  };

  const getStrengthText = (strength) => {
    if (strength === 0) return "No password";
    if (strength <= 2) return "Weak";
    if (strength <= 3) return "Fair";
    if (strength <= 4) return "Good";
    return "Strong";
  };

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    checkPasswordStrength(newPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    
    if (!password) {
      setError("Please enter a new password");
      return;
    }
    
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    
    if (passwordStrength < 3) {
      setError("Please choose a stronger password (at least 3 requirements met)");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post(`https://modernhrmsbyritik.onrender.com/api/auth/reset-password/${token}`, {
        password,
      });
      setMsg(res.data.message);
      setSuccess(true);
      
      // Auto redirect after 3 seconds
      setTimeout(() => {
        navigate("/");
      }, 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to reset password. The link may have expired.");
      setSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  const styles = {
    container: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      position: 'relative',
      overflow: 'hidden'
    },
    backgroundPattern: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundImage: 'url("data:image/svg+xml,%3Csvg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"%3E%3Cpath d="M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z" fill="%23ffffff" fill-opacity="0.05" fill-rule="evenodd"/%3E%3C/svg%3E")'
    },
    card: {
      background: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(10px)',
      borderRadius: '24px',
      padding: '40px',
      width: '100%',
      maxWidth: '480px',
      boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
      position: 'relative',
      zIndex: 2,
      overflow: 'hidden',
      border: '1px solid rgba(255, 255, 255, 0.2)'
    },
    cardHeader: {
      textAlign: 'center',
      marginBottom: '32px'
    },
    iconWrapper: {
      width: '80px',
      height: '80px',
      margin: '0 auto 20px',
      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative'
    },
    iconGlow: {
      position: 'absolute',
      top: '-10px',
      left: '-10px',
      right: '-10px',
      bottom: '-10px',
      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
      borderRadius: '50%',
      filter: 'blur(20px)',
      opacity: 0.3
    },
    title: {
      fontSize: '32px',
      fontWeight: '700',
      color: '#1e293b',
      margin: '0 0 8px 0',
      background: 'linear-gradient(135deg, #1e293b 0%, #475569 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text'
    },
    subtitle: {
      fontSize: '16px',
      color: '#64748b',
      margin: '0',
      lineHeight: '1.5'
    },
    form: {
      marginBottom: '24px'
    },
    inputGroup: {
      position: 'relative',
      marginBottom: '20px'
    },
    inputIcon: {
      position: 'absolute',
      left: '16px',
      top: '50%',
      transform: 'translateY(-50%)',
      color: '#94a3b8',
      zIndex: 1
    },
    input: {
      width: '100%',
      padding: '16px 20px 16px 52px',
      fontSize: '16px',
      border: '2px solid #e2e8f0',
      borderRadius: '12px',
      background: '#f8fafc',
      color: '#1e293b',
      transition: 'all 0.3s ease',
      fontFamily: 'monospace'
    },
    passwordToggle: {
      position: 'absolute',
      right: '16px',
      top: '50%',
      transform: 'translateY(-50%)',
      background: 'none',
      border: 'none',
      color: '#94a3b8',
      cursor: 'pointer',
      padding: '4px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    strengthIndicator: {
      marginBottom: '24px'
    },
    strengthBar: {
      height: '6px',
      background: '#e2e8f0',
      borderRadius: '3px',
      overflow: 'hidden',
      marginBottom: '8px'
    },
    strengthFill: {
      height: '100%',
      borderRadius: '3px',
      transition: 'all 0.3s ease',
      background: getStrengthColor(passwordStrength)
    },
    strengthText: {
      fontSize: '14px',
      color: '#64748b',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    requirements: {
      marginBottom: '24px',
      padding: '16px',
      background: '#f8fafc',
      borderRadius: '12px',
      border: '1px solid #e2e8f0'
    },
    requirementItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      marginBottom: '8px',
      fontSize: '14px',
      color: '#64748b'
    },
    requirementIcon: {
      width: '16px',
      height: '16px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    submitButton: {
      width: '100%',
      padding: '16px 24px',
      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
      color: 'white',
      border: 'none',
      borderRadius: '12px',
      fontSize: '16px',
      fontWeight: '600',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '10px',
      transition: 'all 0.3s ease',
      position: 'relative',
      overflow: 'hidden'
    },
    submitButtonDisabled: {
      opacity: 0.7,
      cursor: 'not-allowed'
    },
    messageContainer: {
      padding: '20px',
      borderRadius: '12px',
      marginTop: '24px',
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      animation: 'slideIn 0.3s ease'
    },
    successMessage: {
      background: '#d1fae5',
      color: '#065f46',
      border: '1px solid #a7f3d0'
    },
    errorMessage: {
      background: '#fee2e2',
      color: '#dc2626',
      border: '1px solid #fecaca'
    },
    infoMessage: {
      background: '#dbeafe',
      color: '#1e40af',
      border: '1px solid #bfdbfe'
    },
    successAnimation: {
      textAlign: 'center',
      padding: '32px 0'
    },
    successIcon: {
      width: '80px',
      height: '80px',
      color: '#10b981',
      margin: '0 auto 24px',
      animation: 'scaleIn 0.5s ease, float 2s ease-in-out infinite'
    },
    redirectCountdown: {
      fontSize: '14px',
      color: '#64748b',
      marginTop: '16px'
    },
    footer: {
      textAlign: 'center',
      marginTop: '32px',
      paddingTop: '24px',
      borderTop: '1px solid #e2e8f0'
    },
    footerLink: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
      color: '#64748b',
      textDecoration: 'none',
      fontSize: '14px',
      transition: 'all 0.2s ease'
    },
    securityBadge: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      padding: '12px 16px',
      background: '#fef3c7',
      color: '#92400e',
      borderRadius: '12px',
      marginBottom: '24px',
      fontSize: '14px'
    }
  };

  const createRipple = (event) => {
    const button = event.currentTarget;
    const circle = document.createElement("span");
    const diameter = Math.max(button.clientWidth, button.clientHeight);
    const radius = diameter / 2;

    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left = `${event.clientX - button.getBoundingClientRect().left - radius}px`;
    circle.style.top = `${event.clientY - button.getBoundingClientRect().top - radius}px`;
    circle.classList.add("ripple");

    const ripple = button.getElementsByClassName("ripple")[0];
    if (ripple) ripple.remove();

    button.appendChild(circle);
  };

  if (success) {
    return (
      <div style={styles.container}>
        <div style={styles.backgroundPattern} />
        
        <div style={styles.card}>
          <div style={styles.successAnimation}>
            <div style={styles.iconWrapper}>
              <div style={styles.iconGlow} />
              <CheckCircle size={32} color="white" />
            </div>
            
            <h2 style={styles.title}>Password Reset Successfully!</h2>
            <p style={styles.subtitle}>
              Your password has been updated successfully. You can now log in with your new password.
            </p>
            
            <CheckCircle style={styles.successIcon} />
            
            {msg && (
              <div style={{...styles.messageContainer, ...styles.successMessage}}>
                <CheckCircle size={20} />
                <span>{msg}</span>
              </div>
            )}
            
            <div style={styles.redirectCountdown}>
              <Loader2 size={16} className="spin" style={{ marginRight: '8px' }} />
              Redirecting to login in 3 seconds...
            </div>
            
            <Link to="/" style={{ textDecoration: 'none', marginTop: '24px', display: 'block' }}>
              <button style={{
                ...styles.submitButton,
                background: 'linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)',
                width: '100%'
              }}>
                <LockKeyhole size={20} />
                Go to Login
              </button>
            </Link>
          </div>
        </div>

        <style jsx>{`
          @keyframes scaleIn {
            0% { transform: scale(0); opacity: 0; }
            70% { transform: scale(1.2); opacity: 1; }
            100% { transform: scale(1); opacity: 1; }
          }
          
          @keyframes float {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-10px); }
          }
          
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          
          .spin {
            animation: spin 1s linear infinite;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.backgroundPattern} />
      
      <div style={styles.card}>
        {/* Back to Login */}
        <Link to="/" style={styles.footerLink}>
          <ArrowLeft size={16} />
          Back to Login
        </Link>

        {/* Card Header */}
        <div style={styles.cardHeader}>
          <div style={styles.iconWrapper}>
            <div style={styles.iconGlow} />
            <RefreshCw size={32} color="white" />
          </div>
          <h2 style={styles.title}>Reset Password</h2>
          <p style={styles.subtitle}>
            Create a strong new password for your account
          </p>
        </div>

        {/* Security Badge */}
        <div style={styles.securityBadge}>
          <Shield size={16} />
          <span>Creating a strong password helps protect your account</span>
        </div>

        {/* Error Message */}
        {error && (
          <div style={{...styles.messageContainer, ...styles.errorMessage}}>
            <AlertCircle size={20} />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} style={styles.form}>
          {/* New Password */}
          <div style={styles.inputGroup}>
            <Lock size={20} style={styles.inputIcon} />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="New Password"
              value={password}
              onChange={handlePasswordChange}
              onFocus={(e) => e.target.style = {...styles.input, ...styles.inputFocus}}
              onBlur={(e) => e.target.style = styles.input}
              style={styles.input}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={styles.passwordToggle}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {/* Confirm Password */}
          <div style={styles.inputGroup}>
            <Key size={20} style={styles.inputIcon} />
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm New Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              onFocus={(e) => e.target.style = {...styles.input, ...styles.inputFocus}}
              onBlur={(e) => e.target.style = styles.input}
              style={styles.input}
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              style={styles.passwordToggle}
            >
              {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {/* Password Strength Indicator */}
          {password && (
            <div style={styles.strengthIndicator}>
              <div style={styles.strengthBar}>
                <div style={{
                  ...styles.strengthFill,
                  width: `${(passwordStrength / 5) * 100}%`
                }}></div>
              </div>
              <div style={styles.strengthText}>
                <span>Password Strength:</span>
                <span style={{ color: getStrengthColor(passwordStrength), fontWeight: '600' }}>
                  {getStrengthText(passwordStrength)}
                </span>
              </div>
            </div>
          )}

          {/* Password Requirements */}
          <div style={styles.requirements}>
            <div style={{ fontSize: '14px', fontWeight: '600', color: '#1e293b', marginBottom: '12px' }}>
              Password Requirements:
            </div>
            <div style={styles.requirementItem}>
              <div style={styles.requirementIcon}>
                {validation.length ? 
                  <CheckCircle size={14} color="#10b981" /> : 
                  <AlertCircle size={14} color="#94a3b8" />
                }
              </div>
              <span style={{ color: validation.length ? '#10b981' : '#64748b' }}>
                At least 8 characters long
              </span>
            </div>
            <div style={styles.requirementItem}>
              <div style={styles.requirementIcon}>
                {validation.uppercase ? 
                  <CheckCircle size={14} color="#10b981" /> : 
                  <AlertCircle size={14} color="#94a3b8" />
                }
              </div>
              <span style={{ color: validation.uppercase ? '#10b981' : '#64748b' }}>
                Contains uppercase letter (A-Z)
              </span>
            </div>
            <div style={styles.requirementItem}>
              <div style={styles.requirementIcon}>
                {validation.lowercase ? 
                  <CheckCircle size={14} color="#10b981" /> : 
                  <AlertCircle size={14} color="#94a3b8" />
                }
              </div>
              <span style={{ color: validation.lowercase ? '#10b981' : '#64748b' }}>
                Contains lowercase letter (a-z)
              </span>
            </div>
            <div style={styles.requirementItem}>
              <div style={styles.requirementIcon}>
                {validation.number ? 
                  <CheckCircle size={14} color="#10b981" /> : 
                  <AlertCircle size={14} color="#94a3b8" />
                }
              </div>
              <span style={{ color: validation.number ? '#10b981' : '#64748b' }}>
                Contains number (0-9)
              </span>
            </div>
            <div style={styles.requirementItem}>
              <div style={styles.requirementIcon}>
                {validation.special ? 
                  <CheckCircle size={14} color="#10b981" /> : 
                  <AlertCircle size={14} color="#94a3b8" />
                }
              </div>
              <span style={{ color: validation.special ? '#10b981' : '#64748b' }}>
                Contains special character (!@#$%^&*)
              </span>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || passwordStrength < 3 || password !== confirmPassword}
            onClick={createRipple}
            style={{
              ...styles.submitButton,
              ...((loading || passwordStrength < 3 || password !== confirmPassword) ? styles.submitButtonDisabled : {}),
              ':hover': !loading && passwordStrength >= 3 && password === confirmPassword ? styles.submitButtonHover : {}
            }}
          >
            {loading ? (
              <>
                <Loader2 size={20} className="spin" />
                Updating Password...
              </>
            ) : (
              <>
                <Zap size={20} />
                Reset Password
              </>
            )}
          </button>
        </form>

        {/* Info Message */}
        <div style={{...styles.messageContainer, ...styles.infoMessage}}>
          <Shield size={20} />
          <span>
            <strong>Important:</strong> This password reset link can only be used once and expires in 1 hour.
          </span>
        </div>

        {/* Footer */}
        <div style={styles.footer}>
          <Link to="/forgot-password" style={styles.footerLink}>
            <Sparkles size={14} />
            Need another reset link?
          </Link>
        </div>
      </div>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes ripple {
          to {
            transform: scale(4);
            opacity: 0;
          }
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .spin {
          animation: spin 1s linear infinite;
        }
        
        .ripple {
          position: absolute;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.5);
          transform: scale(0);
          animation: ripple 0.6s linear;
        }
        
        input:focus {
          outline: none;
          border-color: #10b981;
          box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
          background: white;
        }
        
        button:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(16, 185, 129, 0.4);
        }
        
        a:hover {
          color: #10b981;
        }
      `}</style>
    </div>
  );
}