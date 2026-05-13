import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiMail, FiArrowLeft, FiCheckCircle } from 'react-icons/fi';
import axiosClient from '../api/axiosClient';
import toast from 'react-hot-toast';
import { useTheme } from '../context/ThemeContext';
import { FiMoon, FiSun, FiHome } from 'react-icons/fi';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { theme, setDarkMode } = useTheme();
  const isDark = theme === 'dark';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return toast.error('Please enter your email');
    
    setLoading(true);
    try {
      await axiosClient.post('/auth/forgot-password', { email });
      setSubmitted(true);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send reset link');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0f0f0f] flex flex-col font-sans transition-colors duration-300">
      {/* Mini Header */}
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
          
          {!submitted ? (
            <>
              <div className="mb-8 text-center">
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Forgot Password?</h1>
                <p className="text-sm text-slate-500 dark:text-slate-400">No worries, we'll send you reset instructions.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Email Address</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                      <FiMail className="text-lg" />
                    </div>
                    <input
                      id="email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="block w-full pl-11 pr-4 py-3.5 bg-slate-50 dark:bg-[#0f0f0f] border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white dark:focus:bg-[#1a1a1a] transition-all"
                      placeholder="Enter your email"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-lg shadow-lg shadow-blue-600/30 transition-all disabled:opacity-70 flex justify-center items-center"
                >
                  {loading ? <span className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" /> : 'Reset Password'}
                </button>
              </form>
            </>
          ) : (
            <div className="text-center py-6">
              <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <FiCheckCircle className="text-3xl" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">Check your email</h2>
              <p className="text-slate-500 dark:text-slate-400 mb-8 leading-relaxed">
                We sent a password reset link to <br/>
                <span className="font-semibold text-slate-700 dark:text-slate-300">{email}</span>
              </p>
              
              <button onClick={() => setSubmitted(false)} className="text-blue-600 dark:text-blue-400 text-sm font-semibold hover:underline">
                Didn't receive the email? Click to resend
              </button>
            </div>
          )}

          <div className="mt-8 text-center">
            <Link to="/login" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
              <FiArrowLeft /> Back to log in
            </Link>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default ForgotPasswordPage;
