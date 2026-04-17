import { useEffect, useRef, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FiChevronDown, FiHome, FiUser, FiShield, FiLogOut, FiMoon, FiSun } from 'react-icons/fi';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { theme, setDarkMode } = useTheme();
  const navigate = useNavigate();
  const menuRef = useRef(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isDark = theme === 'dark';

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
    toast.success('Logged out successfully');
    navigate('/login');
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav className="sticky top-0 z-50 bg-white/95 dark:bg-[#0f0f0f]/95 backdrop-blur-sm border-b border-slate-200 dark:border-slate-800 px-4 sm:px-6 py-3.5">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <button
          type="button"
          onClick={() => navigate('/dashboard')}
          className="group flex items-center gap-3 text-left cursor-pointer"
          aria-label="Go to homepage"
        >
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center transition-transform duration-200 group-hover:scale-[1.03]">
            <FiHome className="text-white text-lg" />
          </div>
          <div>
            <span className="text-lg font-semibold tracking-tight text-slate-800 dark:text-slate-100">BuyerPortal</span>
            <p className="text-xs text-slate-500 dark:text-slate-400 -mt-0.5">Smart Property Finder</p>
          </div>
        </button>

        <div className="flex items-center gap-2 sm:gap-4">
          <label className="group inline-flex cursor-pointer items-center gap-2 rounded-full bg-slate-100 dark:bg-[#0f0f0f] px-2.5 py-2 text-slate-700 dark:text-slate-200 transition-colors hover:bg-slate-200 dark:hover:bg-slate-800">
            <input
              type="checkbox"
              role="switch"
              aria-label="Toggle dark mode"
              checked={isDark}
              onChange={(e) => setDarkMode(e.target.checked)}
              className="peer sr-only"
            />
            <span className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 ${isDark ? 'bg-blue-600' : 'bg-slate-300'}`}>
              <span className={`inline-block h-5 w-5 rounded-full bg-white shadow-sm transition-transform duration-300 ${isDark ? 'translate-x-5' : 'translate-x-0.5'}`} />
            </span>
            <span className="hidden sm:inline-flex items-center gap-1.5 text-sm font-medium">
              {isDark ? <FiMoon className="text-sm" /> : <FiSun className="text-sm" />}
              {isDark ? 'Dark' : 'Light'}
            </span>
          </label>

          <div ref={menuRef} className="relative">
            <button
              type="button"
              onClick={() => setIsMenuOpen((open) => !open)}
              className="inline-flex items-center gap-3 rounded-full bg-slate-100 dark:bg-slate-800 px-2.5 sm:px-3 py-2 text-slate-800 dark:text-slate-100 transition-colors hover:bg-slate-200 dark:hover:bg-slate-700 cursor-pointer"
              aria-haspopup="menu"
              aria-expanded={isMenuOpen}
            >
              <span className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white">
                <FiUser className="text-base" />
              </span>
              <span className="hidden sm:flex flex-col items-start leading-tight min-w-0">
                <span className="text-sm font-semibold truncate max-w-[140px]">{user?.name || 'Guest User'}</span>
                <span className="text-xs text-slate-500 dark:text-slate-400 capitalize inline-flex items-center gap-1">
                  <FiShield className="text-[11px]" />
                  {user?.role || 'member'}
                </span>
              </span>
              <FiChevronDown className={`text-sm transition-transform duration-200 ${isMenuOpen ? 'rotate-180' : ''}`} />
            </button>

            {isMenuOpen && (
              <div className="absolute right-0 mt-3 w-56 overflow-hidden rounded-2xl bg-white dark:bg-[#0f0f0f] shadow-2xl shadow-slate-300/40 dark:shadow-black/40 ring-1 ring-black/5 dark:ring-white/10">
                <div className="border-b border-slate-100 dark:border-slate-800 px-4 py-3">
                  <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate">{user?.name || 'Guest User'}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 capitalize inline-flex items-center gap-1 mt-1">
                    <FiShield className="text-[11px]" />
                    {user?.role || 'member'}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setIsMenuOpen(false);
                    navigate('/dashboard');
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm text-left text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  <span className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300">
                    <FiUser />
                  </span>
                  <span>View profile</span>
                </button>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm text-left text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors cursor-pointer"
                >
                  <span className="w-8 h-8 rounded-full bg-red-50 dark:bg-red-950/40 flex items-center justify-center">
                    <FiLogOut className="text-base" />
                  </span>
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;