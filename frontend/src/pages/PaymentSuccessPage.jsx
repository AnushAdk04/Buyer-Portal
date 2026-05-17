import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { FiCheckCircle, FiAlertTriangle, FiArrowRight, FiLoader } from 'react-icons/fi';
import axiosClient from '../api/axiosClient';
import Navbar from '../components/Navbar';
import SEO from '../components/SEO';
import toast from 'react-hot-toast';

const PaymentSuccessPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [txDetails, setTxDetails] = useState(null);

  useEffect(() => {
    const verifyPayment = async () => {
      const dataParam = searchParams.get('data');
      if (!dataParam) {
        setError('Missing transaction payload from eSewa.');
        setLoading(false);
        return;
      }

      try {
        const { data } = await axiosClient.post('/payments/verify-esewa', { data: dataParam });
        if (data.success) {
          setTxDetails(data);
          toast.success('Listing featured successfully!');
        } else {
          setError(data.message || 'Payment verification failed.');
        }
      } catch (err) {
        console.error('Verification error:', err);
        setError(err.response?.data?.message || 'Cryptographic signature verification failed.');
      } finally {
        setLoading(false);
      }
    };

    verifyPayment();
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0f0f0f]">
      <SEO title="Payment Success" description="Your property listing promotion status" />
      <Navbar />

      <main className="max-w-md mx-auto px-4 py-16 sm:py-24">
        {loading ? (
          <div className="rounded-3xl bg-white dark:bg-[#151515] border border-slate-200 dark:border-slate-800 p-8 text-center shadow-xl">
            <div className="flex flex-col items-center gap-4">
              <FiLoader className="w-12 h-12 text-blue-600 animate-spin" />
              <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">Verifying Payment</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Confirming transaction authenticity and updating listing status. Please do not close or reload this page...
              </p>
            </div>
          </div>
        ) : error ? (
          <div className="rounded-3xl bg-white dark:bg-[#151515] border border-red-100 dark:border-red-950/30 p-8 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-red-500" />
            <div className="flex flex-col items-center text-center gap-4">
              <div className="w-16 h-16 rounded-full bg-red-50 dark:bg-red-950/20 flex items-center justify-center text-red-600">
                <FiAlertTriangle className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Verification Failed</h2>
              <p className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/20 px-4 py-2.5 rounded-xl font-medium">
                {error}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                If the amount was deducted from your eSewa account, please contact our support desk with your eSewa reference.
              </p>
              <button
                onClick={() => navigate('/dashboard')}
                className="mt-4 inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-sm font-semibold hover:bg-slate-800 transition-all shadow-md active:scale-95"
              >
                Go to Dashboard
              </button>
            </div>
          </div>
        ) : (
          <div className="rounded-3xl bg-white dark:bg-[#151515] border border-slate-200 dark:border-slate-800 p-8 shadow-2xl relative overflow-hidden text-center">
            <div className="absolute -top-24 -right-24 h-48 w-48 rounded-full bg-emerald-500/10 blur-3xl" />
            <div className="absolute -bottom-24 -left-24 h-48 w-48 rounded-full bg-teal-500/10 blur-3xl" />
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-500 to-green-500" />

            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-emerald-50 dark:bg-emerald-950/20 flex items-center justify-center text-emerald-500">
                <FiCheckCircle className="w-10 h-10" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Promotion Successful!</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Congratulations! Your payment has been verified cryptographically. Your property listing is now featured and pinned to the top of all search results.
              </p>

              <div className="w-full bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 rounded-2xl p-4 my-2 text-left space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400 font-medium">Gateway:</span>
                  <span className="text-slate-800 dark:text-slate-200 font-bold uppercase">eSewa epay</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400 font-medium">Amount Paid:</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">₨ 500.00 NPR</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400 font-medium">Status:</span>
                  <span className="text-white bg-emerald-500 px-2 py-0.5 rounded-full font-bold uppercase text-[9px]">COMPLETE</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400 font-medium">Verification Method:</span>
                  <span className="text-blue-500 dark:text-blue-400 font-semibold">HMAC-SHA256</span>
                </div>
              </div>

              <div className="flex flex-col w-full gap-2 mt-4">
                {txDetails?.propertyId && (
                  <button
                    onClick={() => navigate(`/dashboard/properties/${txDetails.propertyId}`)}
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white text-sm font-semibold transition-all shadow-lg shadow-emerald-500/10 active:scale-95 animate-bounce"
                  >
                    View Featured Listing <FiArrowRight />
                  </button>
                )}
                <button
                  onClick={() => navigate('/dashboard')}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#151515] text-slate-700 dark:text-slate-300 text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-all active:scale-95"
                >
                  Back to Dashboard
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default PaymentSuccessPage;
