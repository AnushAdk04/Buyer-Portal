import { Link } from 'react-router-dom';
import { FiHome } from 'react-icons/fi';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0f0f0f] font-sans flex flex-col">
      <Navbar />
      
      <main className="flex-1 flex items-center justify-center p-6 text-center">
        <div className="max-w-md w-full">
          <h1 className="text-9xl font-bold font-heading text-slate-200 dark:text-slate-800">404</h1>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mt-4 mb-2">Page not found</h2>
          <p className="text-slate-600 dark:text-slate-400 mb-8">
            Sorry, we couldn't find the page you're looking for. It might have been moved or doesn't exist.
          </p>
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-all w-full sm:w-auto"
          >
            <FiHome className="text-lg" />
            Back to Home
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default NotFoundPage;
