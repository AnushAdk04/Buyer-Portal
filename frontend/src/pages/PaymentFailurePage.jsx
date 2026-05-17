import { useNavigate } from 'react-router-dom';
import { FiXCircle, FiArrowLeft } from 'react-icons/fi';
import Navbar from '../components/Navbar';
import SEO from '../components/SEO';

const PaymentFailurePage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0f0f0f]">
      <SEO title="Payment Failed" description="Promotion transaction status was cancelled or failed" />
      <Navbar />

      <main className="max-w-md mx-auto px-4 py-16 sm:py-24">
        <div className="rounded-3xl bg-white dark:bg-[#151515] border border-slate-200 dark:border-slate-800 p-8 shadow-xl relative overflow-hidden text-center">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-red-500" />
          
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-red-50 dark:bg-red-950/20 flex items-center justify-center text-red-500">
              <FiXCircle className="w-10 h-10" />
            </div>
            
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Payment Cancelled</h2>
            
            <p className="text-sm text-slate-500 dark:text-slate-400">
              The eSewa checkout process was cancelled or the transaction was rejected. No charges have been made.
            </p>

            <p className="text-xs text-slate-400 dark:text-slate-500">
              You can return to the dashboard to retry promotion whenever you are ready.
            </p>

            <div className="flex flex-col w-full gap-2 mt-4">
              <button
                onClick={() => navigate('/dashboard')}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-sm font-semibold hover:bg-slate-800 dark:hover:bg-slate-100 transition-all shadow-md active:scale-95"
              >
                <FiArrowLeft /> Return to Dashboard
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PaymentFailurePage;
