import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import {
  UserPlus,
  User,
  Mail,
  Phone,
  Lock,
  Shield,
  Check,
  AlertCircle,
  Eye,
  EyeOff,
  ArrowRight,
  Building,
  Users,
  Calendar,
  FileText
} from "lucide-react";

export default function Register() {
  const [data, setData] = useState({
    name: "",
    email: "",
    phone: "",
    gender: "",
    role: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const navigate = useNavigate();

  const totalSteps = 3;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData(prev => ({ ...prev, [name]: value }));
    
    // Check password strength
    if (name === "password") {
      calculatePasswordStrength(value);
    }
  };

  const calculatePasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 6) strength += 25;
    if (/[A-Z]/.test(password)) strength += 25;
    if (/[0-9]/.test(password)) strength += 25;
    if (/[^A-Za-z0-9]/.test(password)) strength += 25;
    setPasswordStrength(strength);
  };

  const getStrengthColor = (strength) => {
    if (strength < 50) return "#ef4444";
    if (strength < 75) return "#f59e0b";
    return "#10b981";
  };

  const validateCurrentStep = () => {
    switch (currentStep) {
      case 1:
        if (!data.name.trim()) {
          toast.error("Name is required");
          return false;
        }
        if (!data.email.trim()) {
          toast.error("Email is required");
          return false;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email)) {
          toast.error("Please enter a valid email address");
          return false;
        }
        return true;
      
      case 2:
        if (!data.phone.trim()) {
          toast.error("Phone number is required");
          return false;
        }
        const phoneRegex = /^\d{10}$/;
        if (!phoneRegex.test(data.phone)) {
          toast.error("Please enter a valid 10-digit phone number");
          return false;
        }
        if (!data.gender) {
          toast.error("Please select gender");
          return false;
        }
        return true;
      
      case 3:
        if (!data.role) {
          toast.error("Please select role");
          return false;
        }
        if (!data.password) {
          toast.error("Password is required");
          return false;
        }
        if (data.password.length < 6) {
          toast.error("Password must be at least 6 characters");
          return false;
        }
        return true;
      
      default:
        return false;
    }
  };

  const nextStep = () => {
    if (validateCurrentStep()) {
      setCurrentStep(prev => Math.min(prev + 1, totalSteps));
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const validateForm = () => {
    if (!data.name.trim()) {
      toast.error("Name is required");
      return false;
    }
    if (!data.email.trim()) {
      toast.error("Email is required");
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      toast.error("Please enter a valid email address");
      return false;
    }
    if (!data.phone.trim()) {
      toast.error("Phone number is required");
      return false;
    }
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(data.phone)) {
      toast.error("Please enter a valid 10-digit phone number");
      return false;
    }
    if (!data.gender) {
      toast.error("Please select gender");
      return false;
    }
    if (!data.role) {
      toast.error("Please select role");
      return false;
    }
    if (!data.password) {
      toast.error("Password is required");
      return false;
    }
    if (data.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const toastId = toast.loading(
        <div>
          <div className="toast-loading-content">
            <div className="toast-spinner"></div>
            <span>Creating your account...</span>
          </div>
        </div>, 
        {
          position: "top-right",
          autoClose: false,
        }
      );

      const res = await axios.post("https://modernhrmsbyritik.onrender.com/api/auth/register", data);
      
      toast.update(toastId, {
        render: (
          <div className="toast-success-content">
            <Check size={24} />
            <div>
              <div className="toast-title">Welcome {data.name}!</div>
              <div className="toast-message">Registration successful</div>
            </div>
          </div>
        ),
        type: "success",
        isLoading: false,
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
      });

      setTimeout(() => {
        toast.success("Redirecting to login page...", {
          position: "top-right",
          autoClose: 2000,
        });
        
        setTimeout(() => {
          navigate("/");
        }, 2000);
      }, 3000);

    } catch (err) {
      const errorMessage = err.response?.data?.message || "Registration failed. Please try again.";
      
      toast.error(
        <div className="toast-error-content">
          <AlertCircle size={20} />
          <span>{errorMessage}</span>
        </div>, 
        {
          position: "top-right",
          autoClose: 4000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
        }
      );
      
      console.error("Registration error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <div className="background-animation">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
        <div className="shape shape-3"></div>
        <div className="shape shape-4"></div>
      </div>

      <div className="register-wrapper">
        {/* Left Panel - Progress & Info */}
        <div className="register-left-panel">
          <div className="brand-section">
            <div className="brand-icon">
              <Building size={40} />
            </div>
            <h1 className="brand-title">
              Join <span>HRPro</span>
            </h1>
            <p className="brand-subtitle">Create your account in {totalSteps} simple steps</p>
          </div>

          {/* Progress Steps */}
          <div className="progress-steps">
            {[1, 2, 3].map((step) => (
              <div key={step} className={`step-item ${currentStep >= step ? 'active' : ''}`}>
                <div className="step-number">{step}</div>
                <div className="step-content">
                  <div className="step-title">
                    {step === 1 && "Personal Information"}
                    {step === 2 && "Contact Details"}
                    {step === 3 && "Account Setup"}
                  </div>
                  <div className="step-description">
                    {step === 1 && "Tell us about yourself"}
                    {step === 2 && "How can we reach you?"}
                    {step === 3 && "Set your credentials"}
                  </div>
                </div>
                {step < totalSteps && (
                  <div className="step-connector"></div>
                )}
              </div>
            ))}
          </div>

          {/* Benefits List */}
          <div className="benefits-list">
            <h3 className="benefits-title">Why Join Us?</h3>
            <div className="benefit-item">
              <Check size={20} className="benefit-icon" />
              <span>Secure employee management</span>
            </div>
            <div className="benefit-item">
              <Check size={20} className="benefit-icon" />
              <span>Real-time analytics dashboard</span>
            </div>
            <div className="benefit-item">
              <Check size={20} className="benefit-icon" />
              <span>24/7 customer support</span>
            </div>
            <div className="benefit-item">
              <Check size={20} className="benefit-icon" />
              <span>Mobile-friendly interface</span>
            </div>
          </div>

          <div className="testimonial-card">
            <div className="testimonial-header">
              <Users size={20} />
              <span>Trusted by 500+ Companies</span>
            </div>
            <p className="testimonial-text">
              "HRPro transformed our HR operations. The registration process was seamless!"
            </p>
          </div>
        </div>

        {/* Right Panel - Registration Form */}
        <div className="register-right-panel">
          <div className="form-container">
            <div className="form-header">
              <div className="header-icon">
                <UserPlus size={32} />
              </div>
              <h2>Create Account</h2>
              <p className="form-subtitle">Step {currentStep} of {totalSteps}</p>
            </div>

            <form onSubmit={handleSubmit} className="register-form">
              {/* Step 1: Personal Information */}
              {currentStep === 1 && (
                <div className="step-content">
                  <div className="form-group">
                    <label className="form-label">
                      <User size={18} />
                      <span>Full Name</span>
                    </label>
                    <div className="input-wrapper">
                      <input
                        className="form-input"
                        name="name"
                        placeholder="Enter your full name"
                        value={data.name}
                        onChange={handleChange}
                        disabled={loading}
                      />
                      <div className="input-focus-line"></div>
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      <Mail size={18} />
                      <span>Email Address</span>
                    </label>
                    <div className="input-wrapper">
                      <input
                        className="form-input"
                        name="email"
                        type="email"
                        placeholder="you@company.com"
                        value={data.email}
                        onChange={handleChange}
                        disabled={loading}
                      />
                      <div className="input-focus-line"></div>
                    </div>
                    <div className="input-hint">We'll never share your email with anyone else.</div>
                  </div>
                </div>
              )}

              {/* Step 2: Contact Details */}
              {currentStep === 2 && (
                <div className="step-content">
                  <div className="form-group">
                    <label className="form-label">
                      <Phone size={18} />
                      <span>Phone Number</span>
                    </label>
                    <div className="input-wrapper">
                      <input
                        className="form-input"
                        name="phone"
                        placeholder="10-digit phone number"
                        value={data.phone}
                        onChange={handleChange}
                        disabled={loading}
                      />
                      <div className="input-focus-line"></div>
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      <User size={18} />
                      <span>Gender</span>
                    </label>
                    <div className="gender-options">
                      {["Male", "Female", "Other"].map((gender) => (
                        <label key={gender} className="gender-option">
                          <input
                            type="radio"
                            name="gender"
                            value={gender}
                            checked={data.gender === gender}
                            onChange={handleChange}
                            className="gender-input"
                          />
                          <div className="gender-card">
                            <div className="gender-icon">
                              {gender === "Male" && <User size={20} />}
                              {gender === "Female" && <User size={20} />}
                              {gender === "Other" && <Users size={20} />}
                            </div>
                            <span className="gender-label">{gender}</span>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Account Setup */}
              {currentStep === 3 && (
                <div className="step-content">
                  <div className="form-group">
                    <label className="form-label">
                      <Shield size={18} />
                      <span>Account Role</span>
                    </label>
                    <div className="role-options">
                      {[
                        { value: "admin", label: "Administrator", icon: <Shield size={20} />, description: "Full system access" },
                        { value: "hr", label: "HR Manager", icon: <Users size={20} />, description: "Employee management" },
                      ].map((role) => (
                        <label key={role.value} className="role-option">
                          <input
                            type="radio"
                            name="role"
                            value={role.value}
                            checked={data.role === role.value}
                            onChange={handleChange}
                            className="role-input"
                          />
                          <div className="role-card">
                            <div className="role-icon">{role.icon}</div>
                            <div className="role-content">
                              <div className="role-label">{role.label}</div>
                              <div className="role-description">{role.description}</div>
                            </div>
                            <div className="role-check">
                              <Check size={16} />
                            </div>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      <Lock size={18} />
                      <span>Create Password</span>
                    </label>
                    <div className="input-wrapper">
                      <input
                        className="form-input"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Minimum 6 characters"
                        value={data.password}
                        onChange={handleChange}
                        disabled={loading}
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
                    
                    {/* Password Strength Meter */}
                    {data.password && (
                      <div className="password-strength">
                        <div className="strength-meter">
                          <div 
                            className="strength-bar"
                            style={{
                              width: `${passwordStrength}%`,
                              backgroundColor: getStrengthColor(passwordStrength)
                            }}
                          ></div>
                        </div>
                        <div className="strength-labels">
                          <span className={`strength-label ${passwordStrength >= 25 ? 'active' : ''}`}>
                            Length
                          </span>
                          <span className={`strength-label ${passwordStrength >= 50 ? 'active' : ''}`}>
                            Uppercase
                          </span>
                          <span className={`strength-label ${passwordStrength >= 75 ? 'active' : ''}`}>
                            Numbers
                          </span>
                          <span className={`strength-label ${passwordStrength >= 100 ? 'active' : ''}`}>
                            Special
                          </span>
                        </div>
                      </div>
                    )}

                    <div className="password-hints">
                      <div className={`hint-item ${data.password.length >= 6 ? 'valid' : ''}`}>
                        <Check size={14} />
                        <span>At least 6 characters</span>
                      </div>
                      <div className={`hint-item ${/[A-Z]/.test(data.password) ? 'valid' : ''}`}>
                        <Check size={14} />
                        <span>One uppercase letter</span>
                      </div>
                      <div className={`hint-item ${/[0-9]/.test(data.password) ? 'valid' : ''}`}>
                        <Check size={14} />
                        <span>One number</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="form-navigation">
                {currentStep > 1 && (
                  <button
                    type="button"
                    className="nav-button prev-button"
                    onClick={prevStep}
                    disabled={loading}
                  >
                    Back
                  </button>
                )}
                
                {currentStep < totalSteps ? (
                  <button
                    type="button"
                    className="nav-button next-button"
                    onClick={nextStep}
                    disabled={loading}
                  >
                    Continue
                    <ArrowRight size={18} />
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="nav-button submit-button"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <div className="button-spinner"></div>
                        Creating Account...
                      </>
                    ) : (
                      <>
                        <UserPlus size={18} />
                        Complete Registration
                      </>
                    )}
                  </button>
                )}
              </div>
            </form>

            {/* Login Link */}
            <div className="login-link">
              <p>Already have an account?</p>
              <Link to="/" className="login-button">
                Sign In Now
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>

          {/* Footer */}
          <div className="form-footer">
            <p className="footer-text">
              By registering, you agree to our{" "}
              <Link to="/terms" className="footer-link">Terms of Service</Link>
              {" "}and{" "}
              <Link to="/privacy" className="footer-link">Privacy Policy</Link>
            </p>
          </div>
        </div>
      </div>

      {/* Enhanced CSS */}
      <style jsx>{`
        .register-container {
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
          animation: float 25s infinite linear;
        }

        .shape-1 {
          width: 400px;
          height: 400px;
          top: -200px;
          right: -200px;
          animation-delay: 0s;
        }

        .shape-2 {
          width: 300px;
          height: 300px;
          bottom: -150px;
          left: -150px;
          animation-delay: 8s;
          animation-duration: 20s;
        }

        .shape-3 {
          width: 200px;
          height: 200px;
          top: 30%;
          left: 10%;
          animation-delay: 15s;
          animation-duration: 18s;
        }

        .shape-4 {
          width: 150px;
          height: 150px;
          bottom: 20%;
          right: 15%;
          animation-delay: 12s;
          animation-duration: 22s;
        }

        @keyframes float {
          0%, 100% {
            transform: translate(0, 0) rotate(0deg);
          }
          25% {
            transform: translate(30px, -20px) rotate(90deg);
          }
          50% {
            transform: translate(0, 30px) rotate(180deg);
          }
          75% {
            transform: translate(-30px, -10px) rotate(270deg);
          }
        }

        /* Register Wrapper */
        .register-wrapper {
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
          .register-wrapper {
            flex-direction: column;
            max-width: 500px;
          }
        }

        /* Left Panel */
        .register-left-panel {
          flex: 1;
          background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
          color: white;
          padding: 50px 40px;
          display: flex;
          flex-direction: column;
        }

        .brand-section {
          text-align: center;
          margin-bottom: 50px;
        }

        .brand-icon {
          width: 70px;
          height: 70px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 18px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 20px;
        }

        .brand-title {
          font-size: 32px;
          font-weight: 800;
          margin: 0 0 10px;
          color: white;
        }

        .brand-title span {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .brand-subtitle {
          color: #94a3b8;
          font-size: 14px;
          margin: 0;
        }

        /* Progress Steps */
        .progress-steps {
          margin-bottom: 50px;
        }

        .step-item {
          display: flex;
          align-items: center;
          margin-bottom: 30px;
          position: relative;
        }

        .step-item.active .step-number {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          transform: scale(1.1);
        }

        .step-number {
          width: 40px;
          height: 40px;
          border: 2px solid rgba(255, 255, 255, 0.2);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          margin-right: 16px;
          transition: all 0.3s ease;
          flex-shrink: 0;
          background: rgba(255, 255, 255, 0.1);
          color: #94a3b8;
        }

        .step-content {
          flex: 1;
        }

        .step-title {
          font-weight: 600;
          color: white;
          margin-bottom: 4px;
        }

        .step-description {
          font-size: 13px;
          color: #94a3b8;
        }

        .step-connector {
          position: absolute;
          left: 19px;
          top: 40px;
          bottom: -30px;
          width: 2px;
          background: rgba(255, 255, 255, 0.1);
        }

        /* Benefits List */
        .benefits-list {
          margin-bottom: 40px;
        }

        .benefits-title {
          font-size: 18px;
          margin: 0 0 20px;
          color: white;
        }

        .benefit-item {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 15px;
          color: #cbd5e1;
          font-size: 14px;
        }

        .benefit-icon {
          color: #10b981;
          flex-shrink: 0;
        }

        /* Testimonial Card */
        .testimonial-card {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 12px;
          padding: 20px;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .testimonial-header {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 12px;
          color: #667eea;
          font-size: 14px;
          font-weight: 600;
        }

        .testimonial-text {
          font-style: italic;
          color: #cbd5e1;
          margin: 0;
          font-size: 14px;
          line-height: 1.5;
        }

        /* Right Panel */
        .register-right-panel {
          flex: 1.5;
          padding: 50px 40px;
          display: flex;
          flex-direction: column;
        }

        .form-container {
          flex: 1;
          max-width: 500px;
          margin: 0 auto;
          width: 100%;
        }

        .form-header {
          text-align: center;
          margin-bottom: 40px;
        }

        .header-icon {
          width: 70px;
          height: 70px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 18px;
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
          margin: 0 0 8px;
        }

        .form-subtitle {
          color: #64748b;
          font-size: 15px;
          margin: 0;
        }

        /* Form Styles */
        .register-form {
          margin-bottom: 40px;
        }

        .step-content {
          animation: slideIn 0.3s ease;
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .form-group {
          margin-bottom: 30px;
        }

        .form-label {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 10px;
          font-weight: 600;
          color: #475569;
          font-size: 15px;
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

        .input-hint {
          font-size: 13px;
          color: #94a3b8;
          margin-top: 8px;
        }

        /* Gender Options */
        .gender-options {
          display: flex;
          gap: 12px;
        }

        .gender-option {
          flex: 1;
        }

        .gender-input {
          display: none;
        }

        .gender-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 20px 16px;
          border: 2px solid #e2e8f0;
          border-radius: 10px;
          cursor: pointer;
          transition: all 0.3s ease;
          background: #f8fafc;
        }

        .gender-card:hover {
          border-color: #cbd5e1;
          background: #f1f5f9;
        }

        .gender-input:checked + .gender-card {
          border-color: #667eea;
          background: rgba(102, 126, 234, 0.1);
          transform: translateY(-2px);
        }

        .gender-icon {
          width: 40px;
          height: 40px;
          background: #e2e8f0;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 10px;
          color: #64748b;
        }

        .gender-input:checked + .gender-card .gender-icon {
          background: #667eea;
          color: white;
        }

        .gender-label {
          font-weight: 600;
          color: #475569;
        }

        /* Role Options */
        .role-options {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .role-option {
          width: 100%;
        }

        .role-input {
          display: none;
        }

        .role-card {
          display: flex;
          align-items: center;
          padding: 20px;
          border: 2px solid #e2e8f0;
          border-radius: 10px;
          cursor: pointer;
          transition: all 0.3s ease;
          background: #f8fafc;
          position: relative;
        }

        .role-card:hover {
          border-color: #cbd5e1;
          background: #f1f5f9;
        }

        .role-input:checked + .role-card {
          border-color: #667eea;
          background: rgba(102, 126, 234, 0.1);
          transform: translateY(-2px);
        }

        .role-icon {
          width: 50px;
          height: 50px;
          background: #e2e8f0;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: 16px;
          color: #64748b;
          flex-shrink: 0;
        }

        .role-input:checked + .role-card .role-icon {
          background: #667eea;
          color: white;
        }

        .role-content {
          flex: 1;
        }

        .role-label {
          font-weight: 600;
          color: #475569;
          margin-bottom: 4px;
        }

        .role-description {
          font-size: 13px;
          color: #64748b;
        }

        .role-check {
          opacity: 0;
          color: #667eea;
          transition: opacity 0.3s ease;
        }

        .role-input:checked + .role-card .role-check {
          opacity: 1;
        }

        /* Password Toggle */
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

        /* Password Strength */
        .password-strength {
          margin-top: 16px;
        }

        .strength-meter {
          height: 4px;
          background: #e2e8f0;
          border-radius: 2px;
          overflow: hidden;
          margin-bottom: 8px;
        }

        .strength-bar {
          height: 100%;
          transition: width 0.3s ease, background-color 0.3s ease;
        }

        .strength-labels {
          display: flex;
          justify-content: space-between;
          margin-bottom: 16px;
        }

        .strength-label {
          font-size: 11px;
          color: #94a3b8;
          text-transform: uppercase;
          font-weight: 600;
          letter-spacing: 0.5px;
        }

        .strength-label.active {
          color: #475569;
        }

        .password-hints {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
        }

        .hint-item {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 13px;
          color: #94a3b8;
        }

        .hint-item.valid {
          color: #10b981;
        }

        .hint-item svg {
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .hint-item.valid svg {
          opacity: 1;
        }

        /* Navigation Buttons */
        .form-navigation {
          display: flex;
          justify-content: space-between;
          margin-top: 40px;
        }

        .nav-button {
          padding: 16px 32px;
          border-radius: 10px;
          font-weight: 600;
          font-size: 15px;
          cursor: pointer;
          transition: all 0.3s ease;
          border: 2px solid transparent;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
        }

        .prev-button {
          background: white;
          color: #64748b;
          border-color: #e2e8f0;
        }

        .prev-button:hover:not(:disabled) {
          background: #f1f5f9;
          border-color: #cbd5e1;
        }

        .next-button {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
        }

        .next-button:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
        }

        .submit-button {
          flex: 1;
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          color: white;
          box-shadow: 0 4px 15px rgba(16, 185, 129, 0.3);
        }

        .submit-button:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(16, 185, 129, 0.4);
        }

        .nav-button:disabled {
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

        /* Login Link */
        .login-link {
          text-align: center;
          margin-bottom: 40px;
        }

        .login-link p {
          color: #64748b;
          margin: 0 0 16px;
        }

        .login-button {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 14px 28px;
          background: white;
          color: #667eea;
          border: 2px solid #667eea;
          border-radius: 10px;
          font-weight: 600;
          text-decoration: none;
          transition: all 0.3s ease;
        }

        .login-button:hover {
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
          font-size: 13px;
          margin: 0;
        }

        .footer-link {
          color: #667eea;
          text-decoration: none;
          font-weight: 600;
        }

        .footer-link:hover {
          color: #764ba2;
        }

        /* Toast Customization */
        :global(.toast-loading-content) {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        :global(.toast-spinner) {
          width: 20px;
          height: 20px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        :global(.toast-success-content) {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        :global(.toast-title) {
          font-weight: 600;
          font-size: 14px;
        }

        :global(.toast-message) {
          font-size: 13px;
          opacity: 0.9;
        }

        :global(.toast-error-content) {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        /* Responsive Design */
        @media (max-width: 968px) {
          .register-wrapper {
            flex-direction: column;
          }
          
          .register-left-panel {
            padding: 40px 24px;
          }
          
          .register-right-panel {
            padding: 40px 24px;
          }
          
          .gender-options {
            flex-direction: column;
          }
        }

        @media (max-width: 480px) {
          .register-container {
            padding: 10px;
          }
          
          .form-navigation {
            flex-direction: column;
            gap: 12px;
          }
          
          .nav-button {
            width: 100%;
          }
          
          .benefit-item {
            font-size: 13px;
          }
        }
      `}</style>
    </div>
  );
}