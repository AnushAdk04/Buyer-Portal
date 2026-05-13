import { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiLock, FiEye, FiEyeOff, FiCheckCircle } from 'react-icons/fi';
import axiosClient from '../api/axiosClient';
import toast from 'react-hot-toast';
import { useTheme } from '../context/ThemeContext';
import { FiMoon, FiSun, FiHome } from 'react-icons/fi';

const ResetPasswordPage = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { theme, setDarkMode } = useTheme();
  const isDark = theme === 'dark';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password.length < 6) return toast.error('Password must be at least 6 characters');
    
    setLoading(true);
    try {
      await axiosClient.post(`/auth/reset-password/${token}`, { password });
      setSuccess(true);
      toast.success('Password reset successfully!');
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to reset password. Link may be expired.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0f0f0f] flex flex-col font-sans transition-colors duration-300">
      <header className="p-4 sm:p-6 flex justify-between items-center z-10 relative">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center transition-transform group-hover:scale-105">
            <FiHome className="text-white text-xl" />
          </div>
          <span className="text-xl font-bold font-heading text-slate-800 dark:text-slate-100 tracking-tight">BuyerPortal</span>
        </Link>
        <button onClick={() => setDarkMode(!isDark)} className="p-2.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors">
          {isDark ? <FiSun className="text-xl" /> : <FiMoon className="text-xl" />}
        </button>
      </header>

      <main className="flex-1 flex items-center justify-center p-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md bg-white dark:bg-[#151515] rounded-3xl shadow-xl border border-slate-200 dark:border-slate-800 p-8">
          
          {!success ? (
            <>
              <div className="mb-8 text-center">
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Set new password</h1>
                <p className="text-sm text-slate-500 dark:text-slate-400">Must be at least 6 characters.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="password" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">New Password</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                      <FiLock className="text-lg" />
                    </div>
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="block w-full pl-11 pr-12 py-3.5 bg-slate-50 dark:bg-[#0f0f0f] border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white dark:focus:bg-[#1a1a1a] transition-all"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                    >
                      {showPassword ? <FiEyeOff className="text-lg" /> : <FiEye className="text-lg" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-lg shadow-lg shadow-blue-600/30 transition-all disabled:opacity-70 flex justify-center items-center"
                >
                  {loading ? <span className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" /> : 'Reset password'}
                </button>
              </form>
            </>
          ) : (
            <div className="text-center py-6">
              <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <FiCheckCircle className="text-3xl" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">Password reset</h2>
              <p className="text-slate-500 dark:text-slate-400 mb-8">
                Your password has been successfully reset. Redirecting to login...
              </p>
              <Link to="/login" className="w-full py-3.5 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-all block">
                Continue to login
              </Link>
            </div>
          )}
        </motion.div>
      </main>
    </div>
  );
};

export default ResetPasswordPage;
