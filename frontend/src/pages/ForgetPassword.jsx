import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import {
  Mail,
  Key,
  ArrowLeft,
  Shield,
  Lock,
  Send,
  CheckCircle,
  AlertCircle,
  Loader2,
  Sparkles,
  Eye,
  EyeOff
} from "lucide-react";

export default function ForgetPassword() {
  const navigate = useNavigate(); // Add this line
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [step, setStep] = useState(1); // 1: email input, 2: success, 3: check email
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    try {
      setLoading(true);
      setError("");
      const res = await axios.post("https://modernhrmsbyritik.onrender.com/api/auth/forgot-password", { email });
      setMsg(res.data.message);
      setStep(3);
      setShowSuccessAnimation(true);
      
      // Reset animation after completion
      setTimeout(() => setShowSuccessAnimation(false), 2000);
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred. Please try again.");
      setStep(1);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setEmail("");
    setMsg("");
    setError("");
    setStep(1);
    setShowSuccessAnimation(false);
  };

  const styles = {
    container: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
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
      backgroundImage: 'url("data:image/svg+xml,%3Csvg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"%3E%3Cpath d="M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z" fill="%23ffffff" fill-opacity="0.1" fill-rule="evenodd"/%3E%3C/svg%3E")'
    },
    card: {
      background: 'white',
      borderRadius: '24px',
      padding: '40px',
      width: '100%',
      maxWidth: '480px',
      boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
      position: 'relative',
      zIndex: 2,
      overflow: 'hidden'
    },
    cardHeader: {
      textAlign: 'center',
      marginBottom: '32px'
    },
    iconWrapper: {
      width: '80px',
      height: '80px',
      margin: '0 auto 20px',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
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
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
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
      marginBottom: '24px'
    },
    inputIcon: {
      position: 'absolute',
      left: '16px',
      top: '50%',
      transform: 'translateY(-50%)',
      color: '#94a3b8'
    },
    input: {
      width: '100%',
      padding: '16px 20px 16px 52px',
      fontSize: '16px',
      border: '2px solid #e2e8f0',
      borderRadius: '12px',
      background: '#f8fafc',
      color: '#1e293b',
      transition: 'all 0.3s ease'
    },
    submitButton: {
      width: '100%',
      padding: '16px 24px',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
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
      gap: '12px'
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
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: '100px',
      height: '100px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 10
    },
    successIcon: {
      width: '80px',
      height: '80px',
      color: '#10b981',
      animation: 'scaleIn 0.5s ease, float 2s ease-in-out infinite'
    },
    checkEmailCard: {
      textAlign: 'center',
      padding: '20px'
    },
    emailIcon: {
      width: '100px',
      height: '100px',
      margin: '0 auto 24px',
      color: '#667eea',
      animation: 'float 3s ease-in-out infinite'
    },
    emailSentTo: {
      fontSize: '18px',
      fontWeight: '600',
      color: '#1e293b',
      marginBottom: '8px'
    },
    emailAddress: {
      fontSize: '16px',
      color: '#64748b',
      background: '#f1f5f9',
      padding: '12px 20px',
      borderRadius: '8px',
      display: 'inline-block',
      marginBottom: '24px'
    },
    instructions: {
      fontSize: '14px',
      color: '#64748b',
      lineHeight: '1.6',
      marginBottom: '24px'
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
    progressBar: {
      height: '4px',
      background: '#e2e8f0',
      borderRadius: '2px',
      marginBottom: '24px',
      overflow: 'hidden'
    },
    progressFill: {
      height: '100%',
      background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
      borderRadius: '2px',
      transition: 'width 0.3s ease',
      width: step === 1 ? '33%' : step === 2 ? '66%' : '100%'
    }
  };

  // Animation for button click
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

  return (
    <div style={styles.container}>
      <div style={styles.backgroundPattern} />
      
      <div style={styles.card}>
        {/* Back to Login */}
        <div style={{ marginBottom: '20px' }}>
          <Link to="/" style={styles.footerLink}>
            <ArrowLeft size={16} />
            Back to Login
          </Link>
        </div>

        {/* Progress Bar */}
        <div style={styles.progressBar}>
          <div style={styles.progressFill}></div>
        </div>

        {/* Success Animation */}
        {showSuccessAnimation && (
          <div style={styles.successAnimation}>
            <CheckCircle style={styles.successIcon} />
          </div>
        )}

        {step === 1 ? (
          <>
            {/* Card Header */}
            <div style={styles.cardHeader}>
              <div style={styles.iconWrapper}>
                <div style={styles.iconGlow} />
                <Key size={32} color="white" />
              </div>
              <h2 style={styles.title}>Reset Password</h2>
              <p style={styles.subtitle}>
                Enter your email address and we'll send you a link to reset your password
              </p>
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
              <div style={styles.inputGroup}>
                <Mail size={20} style={styles.inputIcon} />
                <input
                  type="email"
                  placeholder="Enter your registered email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={styles.input}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#667eea';
                    e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                    e.target.style.background = 'white';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#e2e8f0';
                    e.target.style.boxShadow = 'none';
                    e.target.style.background = '#f8fafc';
                  }}
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading || !email}
                onClick={createRipple}
                style={{
                  ...styles.submitButton,
                  ...(loading || !email ? styles.submitButtonDisabled : {})
                }}
              >
                {loading ? (
                  <>
                    <Loader2 size={20} className="spin" />
                    Sending Link...
                  </>
                ) : (
                  <>
                    <Send size={20} />
                    Send Reset Link
                  </>
                )}
              </button>
            </form>

            {/* Info Message */}
            <div style={{...styles.messageContainer, ...styles.infoMessage}}>
              <Shield size={20} />
              <span>
                <strong>Note:</strong> The reset link will expire in 1 hour for security reasons.
              </span>
            </div>
          </>
        ) : step === 3 ? (
          <div style={styles.checkEmailCard}>
            <div style={styles.iconWrapper}>
              <div style={styles.iconGlow} />
              <Mail size={32} color="white" />
            </div>
            
            <h2 style={styles.title}>Check Your Email</h2>
            
            <div style={{ margin: '32px 0' }}>
              <Mail size={80} style={styles.emailIcon} />
            </div>
            
            <p style={styles.emailSentTo}>We've sent a password reset link to:</p>
            <div style={styles.emailAddress}>{email}</div>
            
            <p style={styles.instructions}>
              Please check your inbox and click on the link to reset your password. 
              If you don't see the email, check your spam folder.
            </p>

            {/* Success Message */}
            {msg && (
              <div style={{...styles.messageContainer, ...styles.successMessage}}>
                <CheckCircle size={20} />
                <span>{msg}</span>
              </div>
            )}

            <button
              onClick={handleReset}
              style={{
                ...styles.submitButton,
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                marginTop: '24px'
              }}
            >
              <Send size={20} />
              Send Again
            </button>

            <button
              onClick={() => navigate('/')}
              style={{
                ...styles.submitButton,
                background: 'transparent',
                border: '2px solid #e2e8f0',
                color: '#64748b',
                marginTop: '12px'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = '#f8fafc';
                e.target.style.borderColor = '#cbd5e0';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'transparent';
                e.target.style.borderColor = '#e2e8f0';
              }}
            >
              <ArrowLeft size={20} />
              Back to Login
            </button>
          </div>
        ) : null}

        {/* Footer */}
        <div style={styles.footer}>
          <Link to="/register" style={styles.footerLink}>
            <Sparkles size={14} />
            Don't have an account? Sign up
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
        
        @keyframes scaleIn {
          0% { transform: scale(0); opacity: 0; }
          70% { transform: scale(1.2); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
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
        
        button:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(102, 126, 234, 0.4);
        }
        
        a:hover {
          color: #667eea !important;
        }
      `}</style>
    </div>
  );
}