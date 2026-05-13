import { useEffect, useRef, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useNavigate } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import toast from 'react-hot-toast';
import { FiChevronDown, FiHome, FiUser, FiShield, FiLogOut, FiMoon, FiSun, FiBarChart2, FiBell, FiMessageCircle } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { theme, setDarkMode } = useTheme();
  const navigate = useNavigate();
  
  const menuRef = useRef(null);
  const notifRef = useRef(null);
  
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  
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
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setIsNotifOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (user) {
      fetchNotifications();
    }
  }, [user]);

  const fetchNotifications = async () => {
    try {
      const { data } = await axiosClient.get('/notifications');
      setNotifications(data.notifications || []);
      setUnreadCount(data.unreadCount || 0);
    } catch (err) {
      console.error('Failed to fetch notifications');
    }
  };

  const markAsRead = async (id) => {
    try {
      await axiosClient.put(`/notifications/${id}/read`);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      console.error('Failed to mark notification as read');
    }
  };

  const markAllAsRead = async () => {
    try {
      await axiosClient.put('/notifications/read-all');
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error('Failed to mark all as read');
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/80 dark:bg-[#0f0f0f]/80 backdrop-blur-xl border-b border-slate-200/80 dark:border-slate-800/80 px-4 sm:px-6 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-6">
          <button
            type="button"
            onClick={() => navigate(user ? '/dashboard' : '/')}
            className="group flex items-center gap-3 text-left cursor-pointer"
            aria-label="Go to homepage"
          >
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center transition-transform duration-200 group-hover:scale-105">
              <FiHome className="text-white text-lg" />
            </div>
            <div>
              <span className="text-lg font-bold tracking-tight text-slate-800 dark:text-slate-100 font-heading">BuyerPortal</span>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 -mt-0.5">Smart Property Finder</p>
            </div>
          </button>

          <div className="hidden md:flex items-center gap-1">
            <button onClick={() => navigate('/dashboard')} className="px-3 py-1.5 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">Browse</button>
            <button onClick={() => navigate('/about')} className="px-3 py-1.5 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">About</button>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          <label className="group hidden sm:inline-flex cursor-pointer items-center gap-2 rounded-full bg-slate-100 dark:bg-[#0f0f0f] px-2.5 py-2 text-slate-700 dark:text-slate-200 transition-colors hover:bg-slate-200 dark:hover:bg-slate-800">
            <input type="checkbox" role="switch" aria-label="Toggle dark mode" checked={isDark} onChange={(e) => setDarkMode(e.target.checked)} className="peer sr-only" />
            <span className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 ${isDark ? 'bg-blue-600' : 'bg-slate-300'}`}>
              <span className={`inline-block h-5 w-5 rounded-full bg-white shadow-sm transition-transform duration-300 ${isDark ? 'translate-x-5' : 'translate-x-0.5'}`} />
            </span>
          </label>

          {user && (
            <div ref={notifRef} className="relative">
              <button
                onClick={() => setIsNotifOpen(!isNotifOpen)}
                className="relative p-2 rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <FiBell className="text-xl" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white dark:border-[#0f0f0f]" />
                )}
              </button>

              <AnimatePresence>
                {isNotifOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-3 w-80 overflow-hidden rounded-2xl bg-white dark:bg-[#151515] shadow-2xl shadow-slate-300/40 dark:shadow-black/40 ring-1 ring-black/5 dark:ring-white/10"
                  >
                    <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-[#1a1a1a]">
                      <h3 className="font-semibold text-slate-900 dark:text-white">Notifications</h3>
                      {unreadCount > 0 && (
                        <button onClick={markAllAsRead} className="text-xs text-blue-600 hover:underline">Mark all read</button>
                      )}
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <div className="p-6 text-center text-slate-500 dark:text-slate-400 text-sm">No notifications</div>
                      ) : (
                        notifications.map(n => (
                          <div
                            key={n.id}
                            onClick={() => {
                              if (!n.is_read) markAsRead(n.id);
                              if (n.link) {
                                setIsNotifOpen(false);
                                navigate(n.link);
                              }
                            }}
                            className={`p-4 border-b border-slate-100 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-[#1a1a1a] transition-colors cursor-pointer ${!n.is_read ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''}`}
                          >
                            <div className="flex items-start gap-3">
                              <div className={`w-2 h-2 mt-1.5 rounded-full shrink-0 ${!n.is_read ? 'bg-blue-500' : 'bg-transparent'}`} />
                              <div>
                                <p className="text-sm font-semibold text-slate-900 dark:text-white mb-0.5">{n.title}</p>
                                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{n.message}</p>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          <div ref={menuRef} className="relative">
            <button
              type="button"
              onClick={() => setIsMenuOpen((open) => !open)}
              className="inline-flex items-center gap-3 rounded-full bg-slate-100 dark:bg-slate-800 px-2.5 sm:px-3 py-2 text-slate-800 dark:text-slate-100 transition-colors hover:bg-slate-200 dark:hover:bg-slate-700 cursor-pointer"
            >
              {user?.avatar_url ? (
                <img src={user.avatar_url} alt="Profile" className="w-9 h-9 rounded-full object-cover border border-slate-200 dark:border-slate-700" />
              ) : (
                <span className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white"><FiUser className="text-base" /></span>
              )}
              <span className="hidden sm:flex flex-col items-start leading-tight min-w-0">
                <span className="text-sm font-semibold truncate max-w-[140px]">{user?.name || 'Guest User'}</span>
                <span className="text-xs text-slate-500 dark:text-slate-400 capitalize inline-flex items-center gap-1"><FiShield className="text-[11px]" /> {user?.role || 'member'}</span>
              </span>
              <FiChevronDown className={`text-sm transition-transform duration-200 ${isMenuOpen ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
              {isMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-3 w-56 overflow-hidden rounded-2xl bg-white dark:bg-[#151515] shadow-2xl shadow-slate-300/40 dark:shadow-black/40 ring-1 ring-black/5 dark:ring-white/10"
                >
                  <div className="border-b border-slate-100 dark:border-slate-800 px-4 py-3">
                    <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate">{user?.name || 'Guest User'}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 capitalize inline-flex items-center gap-1 mt-1">
                      <FiShield className="text-[11px]" /> {user?.role || 'member'}
                    </p>
                  </div>

                  {user && (
                    <button onClick={() => { setIsMenuOpen(false); navigate('/dashboard/inquiries'); }} className="w-full flex items-center gap-3 px-4 py-3 text-sm text-left text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-[#1a1a1a] transition-colors">
                      <span className="w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 dark:text-blue-400"><FiMessageCircle /></span>
                      <span>Inquiries</span>
                    </button>
                  )}

                  <button onClick={() => { setIsMenuOpen(false); navigate('/dashboard/profile'); }} className="w-full flex items-center gap-3 px-4 py-3 text-sm text-left text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-[#1a1a1a] transition-colors border-t border-slate-100 dark:border-slate-800">
                    <span className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300"><FiUser /></span>
                    <span>View profile</span>
                  </button>

                  {user?.role === 'admin' && (
                    <button onClick={() => { setIsMenuOpen(false); navigate('/admin'); }} className="w-full flex items-center gap-3 px-4 py-3 text-sm text-left text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-[#1a1a1a] transition-colors border-t border-slate-100 dark:border-slate-800">
                      <span className="w-8 h-8 rounded-full bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center text-purple-600 dark:text-purple-400"><FiBarChart2 /></span>
                      <span>Admin Dashboard</span>
                    </button>
                  )}

                  <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 text-sm text-left text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors border-t border-slate-100 dark:border-slate-800">
                    <span className="w-8 h-8 rounded-full bg-red-50 dark:bg-red-900/20 flex items-center justify-center"><FiLogOut className="text-base" /></span>
                    <span>Logout</span>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;