import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { FiHome, FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
import { motion } from 'framer-motion';

const LoginPage = () => {
  const { login, updateUser } = useAuth();
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
      try {
        const profileResp = await axiosClient.get('/users/profile');
        const fullUser = profileResp.data.user;
        const clientUser = { ...fullUser, avatar_url: fullUser.avatar_url ? `${fullUser.avatar_url}${fullUser.avatar_url.includes('?') ? '&' : '?'}cb=${Date.now()}` : fullUser.avatar_url };
        updateUser(clientUser);
      } catch (profileErr) { console.warn('Could not fetch full profile after login', profileErr); }
      toast.success(`Welcome back, ${data.user.name}!`);
      navigate('/dashboard');
    } catch (err) {
      const status = err.response?.status;
      toast.error(err.response?.data?.message || (status === 401 ? 'Invalid credentials' : 'Login failed.'));
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left panel — illustration */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-blue-600 via-indigo-600 to-blue-800 items-center justify-center p-12 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-72 h-72 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-indigo-400 rounded-full blur-3xl" />
        </div>
        <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7 }} className="relative z-10 text-white max-w-md">
          <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-8">
            <FiHome className="text-white text-3xl" />
          </div>
          <h2 className="text-4xl font-bold font-heading mb-4 leading-tight">Your dream property is just a search away.</h2>
          <p className="text-blue-100 text-lg leading-relaxed">Join thousands of buyers and sellers on Nepal's most trusted real estate platform.</p>
          <div className="mt-10 flex items-center gap-6">
            <div><p className="text-3xl font-bold">500+</p><p className="text-blue-200 text-sm">Listings</p></div>
            <div className="w-px h-10 bg-white/30" />
            <div><p className="text-3xl font-bold">2K+</p><p className="text-blue-200 text-sm">Users</p></div>
            <div className="w-px h-10 bg-white/30" />
            <div><p className="text-3xl font-bold">15+</p><p className="text-blue-200 text-sm">Cities</p></div>
          </div>
        </motion.div>
      </div>

      {/* Right panel — form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12 bg-slate-50 dark:bg-[#0f0f0f]">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="w-full max-w-md">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 mb-8 transition-colors">
            ← Back to home
          </Link>

          <div className="mb-8">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center mb-4 lg:hidden">
              <FiHome className="text-white text-xl" />
            </div>
            <h1 className="text-3xl font-bold font-heading text-slate-900 dark:text-white">Welcome back</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-2">Sign in to your account to continue</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Email</label>
              <div className="relative">
                <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="you@example.com" required
                  className="w-full pl-10 pr-4 py-3 border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#151515] text-slate-800 dark:text-slate-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Password</label>
              <div className="relative">
                <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input name="password" type={showPassword ? 'text' : 'password'} value={form.password} onChange={handleChange} placeholder="Your password" required
                  className="w-full pl-10 pr-11 py-3 border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#151515] text-slate-800 dark:text-slate-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow" />
                <button type="button" onClick={() => setShowPassword(p => !p)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                  {showPassword ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-end mt-2">
              <Link to="/forgot-password" className="text-sm font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors">
                Forgot password?
              </Link>
            </div>

            <button type="submit" disabled={loading}
              className="w-full py-3 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition-all disabled:opacity-60 shadow-lg shadow-blue-600/25 hover:shadow-blue-600/40 mt-2">
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Signing in...
                </span>
              ) : 'Sign In'}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-8">
            Don't have an account?{' '}
            <Link to="/register" className="text-blue-600 font-semibold hover:underline">Create one</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default LoginPage;