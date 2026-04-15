import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FiHome, FiUser, FiShield, FiLogOut } from 'react-icons/fi';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/85 backdrop-blur-xl border-b border-slate-200 px-4 sm:px-6 py-3.5 shadow-[0_8px_24px_-16px_rgba(15,23,42,0.35)]">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200/70">
            <FiHome className="text-white text-lg" />
          </div>
          <div>
            <span className="text-lg font-semibold tracking-tight text-slate-800">BuyerPortal</span>
            <p className="text-xs text-slate-500 -mt-0.5">Smart Property Finder</p>
          </div>
        </div>

        <div className="flex items-center gap-3 sm:gap-4">
          <div className="hidden sm:flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-3 py-2 shadow-sm">
            <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600">
              <FiUser className="text-base" />
            </div>
            <div className="text-left leading-tight">
              <p className="text-sm font-semibold text-slate-800">{user?.name}</p>
              <p className="text-xs text-blue-700 capitalize inline-flex items-center gap-1">
                <FiShield className="text-xs" />
                {user?.role}
              </p>
            </div>
          </div>

          <div className="sm:hidden w-9 h-9 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600">
            <FiUser className="text-base" />
          </div>

          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-2 text-sm px-3.5 sm:px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-700 hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all shadow-sm"
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