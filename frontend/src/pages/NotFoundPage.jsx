import { Link } from 'react-router-dom';
import { FiHome } from 'react-icons/fi';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { motion } from 'framer-motion';

const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0f0f0f] font-sans flex flex-col">
      <Navbar />
      
      <main className="flex-1 flex items-center justify-center p-6 text-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="max-w-md w-full"
        >
          <img 
            src="/assets/404.png" 
            alt="Page not found" 
            className="w-64 h-64 mx-auto mb-8 object-contain drop-shadow-2xl" 
          />
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">Oops! You're lost.</h1>
          <p className="text-slate-600 dark:text-slate-400 mb-8">
            The page you're looking for doesn't exist or has been moved to another location.
          </p>
          <Link
            to="/"
            aria-label="Back to Homepage"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-all shadow-lg shadow-blue-600/30 w-full sm:w-auto"
          >
            <FiHome className="text-lg" />
            Back to Home
          </Link>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
};

export default NotFoundPage;
