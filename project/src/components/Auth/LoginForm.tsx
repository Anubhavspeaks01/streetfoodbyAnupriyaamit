import React, { useState } from 'react';
import { Phone, Mail, ArrowRight, Loader } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';

const LoginForm: React.FC = () => {
  const [loginMethod, setLoginMethod] = useState<'phone' | 'email'>('phone');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [showOTP, setShowOTP] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [generatedOTP, setGeneratedOTP] = useState('');
  const [otpTimer, setOtpTimer] = useState(0);
  const [canResendOTP, setCanResendOTP] = useState(true);
  const { login } = useAuth();

  // Timer effect for OTP resend
  React.useEffect(() => {
    let interval: NodeJS.Timeout;
    if (otpTimer > 0) {
      interval = setInterval(() => {
        setOtpTimer((prev) => {
          if (prev <= 1) {
            setCanResendOTP(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [otpTimer]);

  const generateOTP = () => {
    // Generate a 6-digit OTP
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  const handleSendOTP = async () => {
    if (loginMethod === 'phone' && !phone) {
      toast.error('Please enter your phone number');
      return;
    }
    if (loginMethod === 'phone' && !/^\+91\s?\d{10}$/.test(phone.replace(/\s/g, ''))) {
      toast.error('Please enter a valid Indian phone number');
      return;
    }
    if (loginMethod === 'email' && !email) {
      toast.error('Please enter your email');
      return;
    }
    if (loginMethod === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    setCanResendOTP(false);
    
    // Simulate OTP send
    const newOTP = generateOTP();
    setGeneratedOTP(newOTP);
    
    setTimeout(() => {
      setShowOTP(true);
      setIsLoading(false);
      setOtpTimer(30); // 30 second timer
      toast.success(`OTP sent successfully! Demo OTP: ${newOTP}`, {
        duration: 8000, // Show for 8 seconds so user can see the OTP
      });
    }, 1000);
  };

  const handleResendOTP = () => {
    if (!canResendOTP) return;
    handleSendOTP();
  };

  const handleLogin = async () => {
    if (!otp) {
      toast.error('Please enter the OTP');
      return;
    }
    
    if (otp !== generatedOTP) {
      toast.error('Invalid OTP. Please try again.');
      return;
    }

    setIsLoading(true);
    try {
      await login(loginMethod === 'phone' ? phone : email, otp);
      toast.success('Login successful!');
    } catch (error) {
      toast.error('Login failed. Please try again.');
      setIsLoading(false);
    }
  };

  const handleBackToInput = () => {
    setShowOTP(false);
    setOtp('');
    setGeneratedOTP('');
    setOtpTimer(0);
    setCanResendOTP(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-400 via-red-500 to-pink-500 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8">
        <div className="text-center mb-8">
          <div className="h-16 w-16 bg-gradient-to-r from-orange-500 to-red-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-2xl">A2P</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Welcome to A2P Bazaar</h1>
          <p className="text-gray-600 mt-2">Group buying platform for street food vendors</p>
        </div>

        <div className="space-y-6">
          {/* Login Method Toggle */}
          {!showOTP && (
            <div className="flex bg-gray-100 rounded-xl p-1">
            <button
              onClick={() => setLoginMethod('phone')}
              className={`flex-1 flex items-center justify-center space-x-2 py-3 rounded-lg transition-all ${
                loginMethod === 'phone'
                  ? 'bg-white text-orange-600 shadow-sm'
                  : 'text-gray-600'
              }`}
            >
              <Phone className="h-4 w-4" />
              <span className="font-medium">Phone</span>
            </button>
            <button
              onClick={() => setLoginMethod('email')}
              className={`flex-1 flex items-center justify-center space-x-2 py-3 rounded-lg transition-all ${
                loginMethod === 'email'
                  ? 'bg-white text-orange-600 shadow-sm'
                  : 'text-gray-600'
              }`}
            >
              <Mail className="h-4 w-4" />
              <span className="font-medium">Email</span>
            </button>
          </div>
          )}

          {/* Input Fields */}
          {!showOTP ? (
            <div className="space-y-4">
              {loginMethod === 'phone' ? (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 9876543210"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Enter your 10-digit mobile number
                  </p>
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="vendor@example.com"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
              )}

              <button
                onClick={handleSendOTP}
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-orange-500 to-red-600 text-white py-3 rounded-xl font-semibold flex items-center justify-center space-x-2 hover:from-orange-600 hover:to-red-700 transition-all disabled:opacity-50"
              >
                {isLoading ? (
                  <Loader className="h-5 w-5 animate-spin" />
                ) : (
                  <>
                    <span>Send OTP</span>
                    <ArrowRight className="h-5 w-5" />
                  </>
                )}
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="text-center mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Verify OTP</h2>
                <p className="text-sm text-gray-600 mt-1">
                  We've sent a 6-digit code to
                </p>
                <p className="text-sm font-medium text-gray-900">
                  {loginMethod === 'phone' ? phone : email}
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Enter OTP
                </label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="Enter 6-digit OTP"
                  maxLength={6}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent text-center text-2xl tracking-widest"
                />
                
                <div className="flex justify-between items-center mt-3">
                  <p className="text-xs text-gray-500">
                    Demo OTP is shown in the success message above
                  </p>
                  {otpTimer > 0 ? (
                    <p className="text-xs text-gray-500">
                      Resend in {otpTimer}s
                    </p>
                  ) : (
                    <button
                      onClick={handleResendOTP}
                      disabled={!canResendOTP}
                      className="text-xs text-orange-600 hover:text-orange-700 font-medium"
                    >
                      Resend OTP
                    </button>
                  )}
                </div>
              </div>

              <button
                onClick={handleLogin}
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-orange-500 to-red-600 text-white py-3 rounded-xl font-semibold flex items-center justify-center space-x-2 hover:from-orange-600 hover:to-red-700 transition-all disabled:opacity-50"
              >
                {isLoading ? (
                  <Loader className="h-5 w-5 animate-spin" />
                ) : (
                  <>
                    <span>Verify & Login</span>
                    <ArrowRight className="h-5 w-5" />
                  </>
                )}
              </button>

              <button
                onClick={handleBackToInput}
                className="w-full text-gray-600 py-2 text-sm hover:text-gray-800"
              >
                ← Change {loginMethod === 'phone' ? 'phone number' : 'email'}
              </button>
            </div>
          )}

          {/* Demo Login */}
          {!showOTP && (
            <div className="border-t border-gray-200 pt-6">
            <p className="text-center text-sm text-gray-500 mb-4">Demo Login</p>
            <button
              onClick={() => login('+91 9876543210', '123456')}
              className="w-full border border-gray-300 text-gray-700 py-3 rounded-xl font-medium hover:bg-gray-50 transition-all"
            >
              Login as Demo Vendor
            </button>
          </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginForm;