import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { FiHome } from 'react-icons/fi';

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axiosClient.post('/auth/login', form);
      login(data.user, data.token);
      toast.success(`Welcome back, ${data.user.name}!`);
      navigate('/dashboard');
    } catch (err) {
      const status = err.response?.status;
      const message = err.response?.data?.message || (status === 401 ? 'Invalid credentials' : 'Login failed. Please try again.');
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0f0f0f] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center mx-auto mb-4">
            <FiHome className="text-white text-xl" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-slate-100">Welcome back</h1>
          <p className="text-gray-500 dark:text-slate-400 text-sm mt-1">Sign in to your buyer portal</p>
        </div>

        <div className="bg-white dark:bg-[#0f0f0f] rounded-2xl border border-gray-200 dark:border-slate-800 p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Email</label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                required
                className="w-full px-4 py-2.5 border border-gray-300 dark:border-slate-700 bg-white dark:bg-[#0f0f0f] text-gray-800 dark:text-slate-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Password</label>
              <div className="relative">
                <input
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Your password"
                  required
                  className="w-full px-4 py-2.5 pr-11 border border-gray-300 dark:border-slate-700 bg-white dark:bg-[#0f0f0f] text-gray-800 dark:text-slate-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute inset-y-0 right-0 px-3 text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-200"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" aria-hidden="true">
                      <path d="M2 12s3.64-7 10-7 10 7 10 7-3.64 7-10 7-10-7-10-7z" stroke="currentColor" strokeWidth="2" />
                      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" />
                    </svg>
                  ) : (
                    <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" aria-hidden="true">
                      <path d="M3 3l18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                      <path d="M10.58 10.58a2 2 0 102.83 2.83" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                      <path d="M9.88 5.09A10.94 10.94 0 0112 5c5 0 9 4 10 7-0.36 1.1-1.05 2.33-2.03 3.45" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                      <path d="M6.61 6.61C4.62 7.9 3.35 9.79 2 12c1 3 5 7 10 7 2.21 0 4.2-.66 5.88-1.75" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed mt-2"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Signing in...
                </span>
              ) : 'Sign In'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 dark:text-slate-400 mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="text-blue-600 font-medium hover:underline">Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;