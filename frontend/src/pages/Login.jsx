import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { 
  LogIn, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  UserPlus, 
  Building,
  Key,
  AlertCircle,
  CheckCircle
} from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!email || !password) {
      toast.error("Please fill in all fields", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post("https://modernhrmsbyritik.onrender.com/api/auth/login", {
        email,
        password,
      });

      // Show success notification
      toast.success(`Welcome back, ${res.data.name}!`, {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        icon: <CheckCircle size={24} />,
      });

      // Store user data
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.role);
      localStorage.setItem("userName", res.data.name);
      localStorage.setItem("email", email);
      
      // Store remember me preference
      if (rememberMe) {
        localStorage.setItem("rememberEmail", email);
      } else {
        localStorage.removeItem("rememberEmail");
      }

      // Wait 2 seconds then navigate to dashboard
      setTimeout(() => {
        navigate("/dashboard");
      }, 2000);

    } catch (err) {
      // Show error notification
      const errorMessage = err.response?.data?.message || "Login failed. Please check your credentials.";
      
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        icon: <AlertCircle size={24} />,
      });
      
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Load remembered email
  useState(() => {
    const rememberedEmail = localStorage.getItem("rememberEmail");
    if (rememberedEmail) {
      setEmail(rememberedEmail);
      setRememberMe(true);
    }
  }, []);

  return (
    <div className="login-container">
      {/* Toast Container */}
      <ToastContainer 
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      
      {/* Background Animation */}
      <div className="background-animation">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
        <div className="shape shape-3"></div>
        <div className="shape shape-4"></div>
      </div>

      <div className="login-wrapper">
        {/* Left Panel - Brand & Info */}
        <div className="login-left-panel">
          <div className="brand-section">
            <div className="brand-icon">
              <Building size={48} />
            </div>
            <h1 className="brand-title">
              HR<span>Pro</span>
            </h1>
            <p className="brand-subtitle">Human Resource Management System</p>
          </div>

          <div className="features-list">
            <div className="feature-item">
              <div className="feature-icon">
                <CheckCircle size={20} />
              </div>
              <div className="feature-text">Secure employee management</div>
            </div>
            <div className="feature-item">
              <div className="feature-icon">
                <CheckCircle size={20} />
              </div>
              <div className="feature-text">Real-time attendance tracking</div>
            </div>
            <div className="feature-item">
              <div className="feature-icon">
                <CheckCircle size={20} />
              </div>
              <div className="feature-text">Leave management system</div>
            </div>
            <div className="feature-item">
              <div className="feature-icon">
                <CheckCircle size={20} />
              </div>
              <div className="feature-text">Advanced analytics & reports</div>
            </div>
          </div>

          <div className="testimonial">
            <p className="testimonial-text">
              "The best HR management platform we've ever used. Increased our productivity by 40%."
            </p>
            <p className="testimonial-author">- Sarah Johnson, HR Director</p>
          </div>
        </div>

        {/* Right Panel - Login Form */}
        <div className="login-right-panel">
          <div className="form-container">
            <div className="form-header">
              <div className="header-icon">
                <LogIn size={32} />
              </div>
              <h2>Welcome Back</h2>
              <p className="form-subtitle">Sign in to your account to continue</p>
            </div>

            <form onSubmit={handleSubmit} className="login-form">
              {/* Email Field */}
              <div className="form-group">
                <label className="form-label">
                  <Mail size={18} />
                  <span>Email Address</span>
                </label>
                <div className="input-wrapper">
                  <input
                    type="email"
                    className="form-input"
                    placeholder="you@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                    required
                  />
                  <div className="input-focus-line"></div>
                </div>
              </div>

              {/* Password Field */}
              <div className="form-group">
                <label className="form-label">
                  <Lock size={18} />
                  <span>Password</span>
                </label>
                <div className="input-wrapper">
                  <input
                    type={showPassword ? "text" : "password"}
                    className="form-input"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                    required
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                  <div className="input-focus-line"></div>
                </div>
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="form-options">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="checkbox-input"
                  />
                  <span className="checkbox-custom"></span>
                  <span className="checkbox-text">Remember me</span>
                </label>
                
                <Link to="/forgot-password" className="forgot-password">
                  <Key size={16} />
                  <span>Forgot Password?</span>
                </Link>
              </div>

              {/* Submit Button */}
              <button 
                className="login-button"
                type="submit"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="button-spinner"></div>
                    <span>Authenticating...</span>
                  </>
                ) : (
                  <>
                    <LogIn size={20} />
                    <span>Sign In</span>
                  </>
                )}
              </button>

              {/* Demo Credentials */}
              <div className="demo-credentials">
                <p className="demo-title">Demo Credentials:</p>
                <div className="demo-grid">
                  <div className="demo-item">
                    <span className="demo-label">Admin:</span>
                    <span className="demo-value">admin@hr.com</span>
                  </div>
                  <div className="demo-item">
                    <span className="demo-label">HR:</span>
                    <span className="demo-value">hr@hr.com</span>
                  </div>
                  <div className="demo-item">
                    <span className="demo-label">Password:</span>
                    <span className="demo-value">password123</span>
                  </div>
                </div>
              </div>

              {/* Divider */}
              <div className="divider">
                <span className="divider-text">Or continue with</span>
              </div>

              {/* Social Login Options */}
              <div className="social-login">
                <button type="button" className="social-button google">
                  <img src="https://www.google.com/favicon.ico" alt="Google" />
                  <span>Google</span>
                </button>
                <button type="button" className="social-button microsoft">
                  <img src="https://www.microsoft.com/favicon.ico" alt="Microsoft" />
                  <span>Microsoft</span>
                </button>
              </div>
            </form>

            {/* Register Link */}
            <div className="register-link">
              <p>Don't have an account?</p>
              <Link to="/register" className="register-button">
                <UserPlus size={18} />
                <span>Create Account</span>
              </Link>
            </div>
          </div>

          {/* Footer */}
          <div className="form-footer">
            <p className="footer-text">
              © {new Date().getFullYear()} HRPro System. All rights reserved.
            </p>
            <div className="footer-links">
              <Link to="/privacy">Privacy Policy</Link>
              <span className="footer-divider">•</span>
              <Link to="/terms">Terms of Service</Link>
              <span className="footer-divider">•</span>
              <Link to="/contact">Contact Support</Link>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced CSS */}
      <style jsx>{`
        .login-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          position: relative;
          overflow: hidden;
          padding: 20px;
        }

        /* Background Animation */
        .background-animation {
          position: absolute;
          width: 100%;
          height: 100%;
          top: 0;
          left: 0;
          z-index: 1;
        }

        .shape {
          position: absolute;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.1);
          animation: float 20s infinite linear;
        }

        .shape-1 {
          width: 300px;
          height: 300px;
          top: -150px;
          left: -150px;
          animation-delay: 0s;
        }

        .shape-2 {
          width: 200px;
          height: 200px;
          bottom: -100px;
          right: 10%;
          animation-delay: 5s;
          animation-duration: 15s;
        }

        .shape-3 {
          width: 150px;
          height: 150px;
          top: 20%;
          right: 15%;
          animation-delay: 10s;
          animation-duration: 12s;
        }

        .shape-4 {
          width: 100px;
          height: 100px;
          bottom: 30%;
          left: 10%;
          animation-delay: 15s;
          animation-duration: 18s;
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0) rotate(0deg);
          }
          25% {
            transform: translateY(-20px) rotate(90deg);
          }
          50% {
            transform: translateY(0) rotate(180deg);
          }
          75% {
            transform: translateY(20px) rotate(270deg);
          }
        }

        /* Login Wrapper */
        .login-wrapper {
          display: flex;
          max-width: 1200px;
          width: 100%;
          background: white;
          border-radius: 24px;
          overflow: hidden;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
          position: relative;
          z-index: 2;
        }

        @media (max-width: 968px) {
          .login-wrapper {
            flex-direction: column;
            max-width: 500px;
          }
        }

        /* Left Panel */
        .login-left-panel {
          flex: 1;
          background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
          color: white;
          padding: 60px 40px;
          display: flex;
          flex-direction: column;
        }

        .brand-section {
          text-align: center;
          margin-bottom: 60px;
        }

        .brand-icon {
          width: 80px;
          height: 80px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 20px;
        }

        .brand-title {
          font-size: 36px;
          font-weight: 800;
          margin: 0 0 10px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .brand-title span {
          color: white;
        }

        .brand-subtitle {
          color: #94a3b8;
          font-size: 14px;
          margin: 0;
        }

        .features-list {
          flex: 1;
          margin-bottom: 40px;
        }

        .feature-item {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 20px;
        }

        .feature-icon {
          color: #10b981;
          flex-shrink: 0;
        }

        .feature-text {
          color: #e2e8f0;
          font-size: 15px;
        }

        .testimonial {
          background: rgba(255, 255, 255, 0.05);
          padding: 24px;
          border-radius: 12px;
          border-left: 4px solid #667eea;
        }

        .testimonial-text {
          font-style: italic;
          color: #cbd5e1;
          margin: 0 0 10px;
          line-height: 1.6;
        }

        .testimonial-author {
          color: #94a3b8;
          font-size: 14px;
          margin: 0;
        }

        /* Right Panel */
        .login-right-panel {
          flex: 1;
          padding: 60px 40px;
          display: flex;
          flex-direction: column;
        }

        @media (max-width: 768px) {
          .login-left-panel,
          .login-right-panel {
            padding: 40px 24px;
          }
        }

        .form-container {
          flex: 1;
          max-width: 400px;
          margin: 0 auto;
          width: 100%;
        }

        .form-header {
          text-align: center;
          margin-bottom: 40px;
        }

        .header-icon {
          width: 60px;
          height: 60px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 15px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          margin: 0 auto 20px;
        }

        .form-header h2 {
          font-size: 32px;
          font-weight: 700;
          color: #1e293b;
          margin: 0 0 10px;
        }

        .form-subtitle {
          color: #64748b;
          font-size: 15px;
          margin: 0;
        }

        /* Form Styles */
        .login-form {
          margin-bottom: 40px;
        }

        .form-group {
          margin-bottom: 24px;
        }

        .form-label {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 8px;
          font-weight: 600;
          color: #475569;
          font-size: 14px;
        }

        .form-label svg {
          color: #667eea;
        }

        .input-wrapper {
          position: relative;
        }

        .form-input {
          width: 100%;
          padding: 16px;
          border: 2px solid #e2e8f0;
          border-radius: 10px;
          font-size: 15px;
          transition: all 0.3s ease;
          background: #f8fafc;
          outline: none;
        }

        .form-input:focus {
          border-color: #667eea;
          background: white;
          box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1);
        }

        .form-input::placeholder {
          color: #94a3b8;
        }

        .input-focus-line {
          position: absolute;
          bottom: 0;
          left: 50%;
          width: 0;
          height: 2px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          transition: all 0.3s ease;
          transform: translateX(-50%);
        }

        .form-input:focus ~ .input-focus-line {
          width: 100%;
        }

        .password-toggle {
          position: absolute;
          right: 16px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          color: #94a3b8;
          cursor: pointer;
          padding: 4px;
          border-radius: 4px;
          transition: all 0.3s ease;
        }

        .password-toggle:hover {
          color: #64748b;
          background: #f1f5f9;
        }

        /* Form Options */
        .form-options {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 30px;
        }

        .checkbox-label {
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          user-select: none;
        }

        .checkbox-input {
          display: none;
        }

        .checkbox-custom {
          width: 18px;
          height: 18px;
          border: 2px solid #cbd5e1;
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
        }

        .checkbox-input:checked + .checkbox-custom {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-color: transparent;
        }

        .checkbox-input:checked + .checkbox-custom::after {
          content: '';
          width: 10px;
          height: 10px;
          background: white;
          border-radius: 2px;
        }

        .checkbox-text {
          font-size: 14px;
          color: #475569;
        }

        .forgot-password {
          display: flex;
          align-items: center;
          gap: 6px;
          color: #667eea;
          text-decoration: none;
          font-size: 14px;
          font-weight: 600;
          transition: all 0.3s ease;
        }

        .forgot-password:hover {
          color: #764ba2;
          transform: translateX(4px);
        }

        /* Login Button */
        .login-button {
          width: 100%;
          padding: 18px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          border-radius: 10px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          transition: all 0.3s ease;
          margin-bottom: 30px;
          box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
        }

        .login-button:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
        }

        .login-button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .button-spinner {
          width: 20px;
          height: 20px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        /* Demo Credentials */
        .demo-credentials {
          background: #f1f5f9;
          border-radius: 10px;
          padding: 16px;
          margin-bottom: 30px;
          border: 1px solid #e2e8f0;
        }

        .demo-title {
          font-size: 12px;
          color: #64748b;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin: 0 0 12px;
        }

        .demo-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
          gap: 8px;
        }

        .demo-item {
          display: flex;
          flex-direction: column;
        }

        .demo-label {
          font-size: 11px;
          color: #94a3b8;
          margin-bottom: 2px;
        }

        .demo-value {
          font-size: 12px;
          color: #475569;
          font-family: monospace;
          font-weight: 600;
        }

        /* Divider */
        .divider {
          position: relative;
          text-align: center;
          margin: 30px 0;
        }

        .divider::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 0;
          right: 0;
          height: 1px;
          background: #e2e8f0;
        }

        .divider-text {
          position: relative;
          display: inline-block;
          padding: 0 20px;
          background: white;
          color: #64748b;
          font-size: 14px;
        }

        /* Social Login */
        .social-login {
          display: flex;
          gap: 12px;
          margin-bottom: 40px;
        }

        .social-button {
          flex: 1;
          padding: 14px;
          border: 2px solid #e2e8f0;
          border-radius: 10px;
          background: white;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          cursor: pointer;
          transition: all 0.3s ease;
          font-weight: 600;
          color: #475569;
        }

        .social-button:hover {
          border-color: #cbd5e1;
          background: #f8fafc;
          transform: translateY(-2px);
        }

        .social-button img {
          width: 20px;
          height: 20px;
        }

        /* Register Link */
        .register-link {
          text-align: center;
          margin-bottom: 40px;
        }

        .register-link p {
          color: #64748b;
          margin: 0 0 16px;
        }

        .register-button {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 14px 28px;
          background: white;
          color: #667eea;
          border: 2px solid #667eea;
          border-radius: 10px;
          font-weight: 600;
          text-decoration: none;
          transition: all 0.3s ease;
        }

        .register-button:hover {
          background: #667eea;
          color: white;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
        }

        /* Footer */
        .form-footer {
          text-align: center;
          margin-top: auto;
        }

        .footer-text {
          color: #94a3b8;
          font-size: 12px;
          margin: 0 0 10px;
        }

        .footer-links {
          display: flex;
          justify-content: center;
          gap: 12px;
          align-items: center;
        }

        .footer-links a {
          color: #667eea;
          text-decoration: none;
          font-size: 12px;
          transition: color 0.3s ease;
        }

        .footer-links a:hover {
          color: #764ba2;
        }

        .footer-divider {
          color: #cbd5e1;
          font-size: 12px;
        }

        /* Toast Customization */
        :global(.Toastify__toast) {
          border-radius: 10px !important;
          font-family: inherit;
        }

        :global(.Toastify__toast--success) {
          background: linear-gradient(135deg, #10b981 0%, #059669 100%) !important;
        }

        :global(.Toastify__toast--error) {
          background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%) !important;
        }

        /* Responsive Design */
        @media (max-width: 968px) {
          .login-wrapper {
            flex-direction: column;
          }
          
          .login-left-panel {
            padding: 40px 24px;
          }
          
          .login-right-panel {
            padding: 40px 24px;
          }
        }

        @media (max-width: 480px) {
          .login-container {
            padding: 10px;
          }
          
          .social-login {
            flex-direction: column;
          }
          
          .demo-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}