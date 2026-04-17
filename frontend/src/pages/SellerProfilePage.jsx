import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FiArrowLeft, FiMail, FiPhone, FiUser } from 'react-icons/fi';
import axiosClient from '../api/axiosClient';
import Navbar from '../components/Navbar';

const SellerProfilePage = () => {
  const navigate = useNavigate();
  const { sellerId } = useParams();
  const [loading, setLoading] = useState(true);
  const [seller, setSeller] = useState(null);

  const initials = useMemo(() => {
    const source = (seller?.name || '').trim();
    if (!source) return 'S';
    const parts = source.split(' ').filter(Boolean);
    if (parts.length === 1) return parts[0][0].toUpperCase();
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }, [seller?.name]);

  useEffect(() => {
    const loadSeller = async () => {
      setLoading(true);
      try {
        const { data } = await axiosClient.get(`/users/public/${sellerId}`);
        setSeller(data.user || null);
      } catch (err) {
        toast.error(err.response?.data?.message || 'Could not load seller profile');
        navigate('/dashboard', { replace: true });
      } finally {
        setLoading(false);
      }
    };

    loadSeller();
  }, [navigate, sellerId]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0f0f0f]">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors mb-6"
        >
          <FiArrowLeft />
          Back
        </button>

        {loading ? (
          <div className="min-h-[50vh] flex items-center justify-center">
            <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : seller ? (
          <section className="rounded-3xl bg-white dark:bg-[#0f0f0f] border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div className="px-6 sm:px-8 py-7 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 dark:from-[#121212] dark:via-[#171717] dark:to-[#121212]">
              <p className="text-slate-300 uppercase tracking-[0.24em] text-xs font-semibold mb-2">Seller Profile</p>
              <h1 className="text-white text-2xl sm:text-3xl font-semibold">{seller.name}</h1>
              <p className="text-slate-300 text-sm mt-2">View-only seller information for property inquiries.</p>
            </div>

            <div className="px-6 sm:px-8 py-7 grid grid-cols-1 md:grid-cols-[220px_1fr] gap-8 items-start">
              <div className="flex flex-col items-center text-center">
                {seller.avatar_url ? (
                  <img
                    src={seller.avatar_url}
                    alt={`${seller.name} avatar`}
                    className="w-36 h-36 rounded-3xl object-cover border border-slate-200 dark:border-slate-700"
                  />
                ) : (
                  <div className="w-36 h-36 rounded-3xl bg-slate-200 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 flex items-center justify-center text-4xl font-semibold text-slate-700 dark:text-slate-200">
                    {initials}
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <div className="rounded-2xl bg-slate-50 dark:bg-[#141414] border border-slate-200 dark:border-slate-800 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400 mb-2">Name</p>
                  <p className="text-slate-900 dark:text-slate-100 font-medium inline-flex items-center gap-2">
                    <FiUser className="text-slate-500" />
                    {seller.name}
                  </p>
                </div>

                <div className="rounded-2xl bg-slate-50 dark:bg-[#141414] border border-slate-200 dark:border-slate-800 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400 mb-2">Email</p>
                  <p className="text-slate-900 dark:text-slate-100 font-medium inline-flex items-center gap-2 break-all">
                    <FiMail className="text-slate-500" />
                    {seller.email}
                  </p>
                </div>

                <div className="rounded-2xl bg-slate-50 dark:bg-[#141414] border border-slate-200 dark:border-slate-800 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400 mb-2">Phone</p>
                  <p className="text-slate-900 dark:text-slate-100 font-medium inline-flex items-center gap-2">
                    <FiPhone className="text-slate-500" />
                    {seller.phone || 'Not provided'}
                  </p>
                </div>

                <div className="rounded-2xl bg-slate-50 dark:bg-[#141414] border border-slate-200 dark:border-slate-800 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400 mb-2">Bio</p>
                  <p className="text-slate-700 dark:text-slate-300 leading-7">
                    {seller.bio || 'Seller has not added a bio yet.'}
                  </p>
                </div>
              </div>
            </div>
          </section>
        ) : null}
      </main>
    </div>
  );
};

export default SellerProfilePage;