import { Link } from 'react-router-dom';
import { FiHome, FiTwitter, FiFacebook, FiInstagram, FiLinkedin } from 'react-icons/fi';

const Footer = () => {
  return (
    <footer className="bg-white dark:bg-[#0f0f0f] border-t border-slate-200 dark:border-slate-800 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-lg overflow-hidden flex items-center justify-center bg-white shadow-sm border border-slate-100 dark:border-slate-700">
                <img src="/logo.png" alt="BuyerPortal Logo" className="w-full h-full object-contain p-0.5" />
              </div>
              <span className="text-xl font-bold font-heading text-slate-900 dark:text-white">BuyerPortal</span>
            </Link>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-6">
              Making property search in Nepal seamless, transparent, and enjoyable. Find your dream home with us today.
            </p>
            <div className="flex items-center gap-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
              <a href="#" aria-label="Twitter"><FiTwitter className="text-xl hover:text-blue-400 cursor-pointer" /></a>
              <a href="#" aria-label="Facebook"><FiFacebook className="text-xl hover:text-blue-600 cursor-pointer" /></a>
              <a href="#" aria-label="Instagram"><FiInstagram className="text-xl hover:text-pink-600 cursor-pointer" /></a>
              <a href="#" aria-label="LinkedIn"><FiLinkedin className="text-xl hover:text-blue-700 cursor-pointer" /></a>
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white uppercase tracking-wider mb-6">Platform</h3>
            <ul className="space-y-4">
              <li><Link to="/dashboard" className="text-sm text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Browse Properties</Link></li>
              <li><Link to="/about" className="text-sm text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">About Us</Link></li>
              <li><a href="#" className="text-sm text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Pricing</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white uppercase tracking-wider mb-6">Support</h3>
            <ul className="space-y-4">
              <li><a href="#" className="text-sm text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Help Center</a></li>
              <li><Link to="/terms" className="text-sm text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Terms of Service</Link></li>
              <li><Link to="/privacy" className="text-sm text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white uppercase tracking-wider mb-6">Contact</h3>
            <ul className="space-y-4 text-sm text-slate-500 dark:text-slate-400">
              <li>Kathmandu, Nepal</li>
              <li>support@buyerportal.com</li>
              <li>+977 1-4000000</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-200 dark:border-slate-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            &copy; {new Date().getFullYear()} BuyerPortal. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-sm text-slate-500 dark:text-slate-400">
            <Link to="/terms" className="hover:text-slate-900 dark:hover:text-white transition-colors">Terms</Link>
            <Link to="/privacy" className="hover:text-slate-900 dark:hover:text-white transition-colors">Privacy</Link>
            <a href="#" className="hover:text-slate-900 dark:hover:text-white transition-colors">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
