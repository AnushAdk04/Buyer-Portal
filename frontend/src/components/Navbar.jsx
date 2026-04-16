import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FiHome, FiUser, FiShield, FiLogOut, FiMoon, FiSun } from 'react-icons/fi';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { theme, setDarkMode } = useTheme();
  const navigate = useNavigate();
  const isDark = theme === 'dark';

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/85 dark:bg-slate-900/85 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 px-4 sm:px-6 py-3.5 shadow-[0_8px_24px_-16px_rgba(15,23,42,0.35)] dark:shadow-[0_8px_24px_-16px_rgba(2,6,23,0.7)]">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200/70 dark:shadow-none">
            <FiHome className="text-white text-lg" />
          </div>
          <div>
            <span className="text-lg font-semibold tracking-tight text-slate-800 dark:text-slate-100">BuyerPortal</span>
            <p className="text-xs text-slate-500 dark:text-slate-400 -mt-0.5">Smart Property Finder</p>
          </div>
        </div>

        <div className="flex items-center gap-3 sm:gap-4">
          <label className="group inline-flex cursor-pointer items-center gap-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-2.5 py-2 text-slate-700 dark:text-slate-200 transition-colors shadow-sm">
            <input
              type="checkbox"
              role="switch"
              aria-label="Toggle dark mode"
              checked={isDark}
              onChange={(e) => setDarkMode(e.target.checked)}
              className="peer sr-only"
            />
            <span className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 ${isDark ? 'bg-blue-600' : 'bg-slate-300'}`}>
              <span className={`inline-block h-5 w-5 rounded-full bg-white shadow transition-transform duration-300 ${isDark ? 'translate-x-5' : 'translate-x-0.5'}`} />
            </span>
            <span className="hidden sm:inline-flex items-center gap-1.5 text-sm font-medium">
              {isDark ? <FiMoon className="text-sm" /> : <FiSun className="text-sm" />}
              {isDark ? 'Dark' : 'Light'}
            </span>
          </label>

          <div className="hidden sm:flex items-center gap-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 shadow-sm">
            <div className="w-9 h-9 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300">
              <FiUser className="text-base" />
            </div>
            <div className="text-left leading-tight">
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">{user?.name}</p>
              <p className="text-xs text-blue-700 capitalize inline-flex items-center gap-1">
                <FiShield className="text-xs" />
                {user?.role}
              </p>
            </div>
          </div>

          <div className="sm:hidden w-9 h-9 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300">
            <FiUser className="text-base" />
          </div>

          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-2 text-sm px-3.5 sm:px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-slate-900 hover:text-white dark:hover:bg-slate-800 hover:border-slate-900 dark:hover:border-slate-700 transition-all shadow-sm"
          >
            <FiLogOut className="text-base" />
            <span className="hidden sm:inline">Logout</span>
            <span className="sm:hidden">Exit</span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;