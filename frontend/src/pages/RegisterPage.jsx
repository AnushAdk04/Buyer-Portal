import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { FiHome, FiMail, FiLock, FiUser, FiEye, FiEyeOff } from 'react-icons/fi';
import { motion } from 'framer-motion';

const RegisterPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  // Password strength
  const strength = form.password.length === 0 ? 0 : form.password.length < 6 ? 1 : form.password.length < 10 ? 2 : 3;
  const strengthLabel = ['', 'Weak', 'Good', 'Strong'][strength];
  const strengthColor = ['', 'bg-red-500', 'bg-amber-500', 'bg-emerald-500'][strength];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password.length < 6) { toast.error('Password must be at least 6 characters'); return; }
    setLoading(true);
    try {
      const { data } = await axiosClient.post('/auth/register', form);
      login(data.user, data.token);
      toast.success(`Account created! Welcome, ${data.user.name}!`);
      navigate('/dashboard');
    } catch (err) { toast.error(err.response?.data?.message || 'Registration failed.'); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left panel — illustration */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-700 items-center justify-center p-12 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-32 right-20 w-80 h-80 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-10 left-10 w-64 h-64 bg-purple-300 rounded-full blur-3xl" />
        </div>
        <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7 }} className="relative z-10 text-white max-w-md">
          <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-8">
            <FiHome className="text-white text-3xl" />
          </div>
          <h2 className="text-4xl font-bold font-heading mb-4 leading-tight">Start your property journey today.</h2>
          <p className="text-purple-100 text-lg leading-relaxed">Create a free account to browse listings, save favourites, and connect with sellers across Nepal.</p>
          <div className="mt-10 space-y-4">
            {['Browse verified property listings', 'Save favourites & get alerts', 'Connect directly with sellers'].map((t, i) => (
              <div key={i} className="flex items-center gap-3 text-white/90">
                <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold">{i + 1}</div>
                <span className="text-sm">{t}</span>
              </div>
            ))}
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
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center mb-4 lg:hidden">
              <FiHome className="text-white text-xl" />
            </div>
            <h1 className="text-3xl font-bold font-heading text-slate-900 dark:text-white">Create your account</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-2">Join the buyer portal — it's free</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Full Name</label>
              <div className="relative">
                <FiUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input name="name" type="text" value={form.name} onChange={handleChange} placeholder="John Doe" required
                  className="w-full pl-10 pr-4 py-3 border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#151515] text-slate-800 dark:text-slate-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow" />
              </div>
            </div>
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
                <input name="password" type={showPassword ? 'text' : 'password'} value={form.password} onChange={handleChange} placeholder="Min 6 characters" required
                  className="w-full pl-10 pr-11 py-3 border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#151515] text-slate-800 dark:text-slate-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow" />
                <button type="button" onClick={() => setShowPassword(p => !p)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                  {showPassword ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
                </button>
              </div>
              {form.password.length > 0 && (
                <div className="mt-2 flex items-center gap-2">
                  <div className="flex-1 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full transition-all ${strengthColor}`} style={{ width: `${(strength / 3) * 100}%` }} />
                  </div>
                  <span className="text-xs font-medium text-slate-500 dark:text-slate-400">{strengthLabel}</span>
                </div>
              )}
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400">Admin access is assigned only by an existing admin from the admin panel.</p>

            <button type="submit" disabled={loading}
              className="w-full py-3 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition-all disabled:opacity-60 shadow-lg shadow-blue-600/25 hover:shadow-blue-600/40 mt-2">
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Creating account...
                </span>
              ) : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-8">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-600 font-semibold hover:underline">Sign in</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default RegisterPage;