import { Link, useNavigate } from 'react-router-dom';
import { FiShieldOff, FiArrowLeft, FiHome } from 'react-icons/fi';
import toast from 'react-hot-toast';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';

const NotAdminPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleBackToLogin = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#0f0f0f]">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 py-16 sm:py-20">
        <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40 p-8 sm:p-12 text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-100 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400">
            <FiShieldOff className="text-3xl" />
          </div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-rose-600 dark:text-rose-400">Access denied</p>
          <h1 className="mt-3 text-3xl font-bold text-slate-900 dark:text-white">You are not an admin</h1>
          <p className="mt-3 text-slate-600 dark:text-slate-400 leading-7">
            {user?.name ? `${user.name}, ` : ''}this area is reserved for admin users only. If you need admin access, it must be granted by an existing admin from the admin dashboard.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/dashboard"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-700"
            >
              <FiHome />
              Go to dashboard
            </Link>
            <button
              type="button"
              onClick={handleBackToLogin}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 dark:border-slate-700 px-5 py-3 text-sm font-medium text-slate-700 dark:text-slate-200 transition-colors hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <FiArrowLeft />
              Back to login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotAdminPage;