import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import Navbar from '../components/Navbar';
import toast from 'react-hot-toast';
import { FiMessageCircle, FiTrash2, FiExternalLink, FiClock, FiCheck } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

const InquiriesPage = () => {
  const [inquiries, setInquiries] = useState({ received: [], sent: [] });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('received');
  const navigate = useNavigate();

  useEffect(() => {
    fetchInquiries();
  }, []);

  const fetchInquiries = async () => {
    try {
      const { data } = await axiosClient.get('/inquiries');
      setInquiries({ received: data.received || [], sent: data.sent || [] });
    } catch (err) {
      toast.error('Failed to load inquiries');
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id) => {
    try {
      await axiosClient.put(`/inquiries/${id}/read`);
      setInquiries(prev => ({
        ...prev,
        received: prev.received.map(i => i.id === id ? { ...i, is_read: true } : i)
      }));
    } catch (err) {
      toast.error('Could not update status');
    }
  };

  const deleteInquiry = async (id) => {
    if (!window.confirm('Are you sure you want to delete this inquiry?')) return;
    try {
      await axiosClient.delete(`/inquiries/${id}`);
      setInquiries(prev => ({
        received: prev.received.filter(i => i.id !== id),
        sent: prev.sent.filter(i => i.id !== id)
      }));
      toast.success('Inquiry deleted');
    } catch (err) {
      toast.error('Could not delete inquiry');
    }
  };

  const formatDate = (dateString) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
    }).format(new Date(dateString));
  };

  const activeList = inquiries[activeTab];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0f0f0f]">
      <Navbar />
      <main className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white font-heading flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 text-blue-600 flex items-center justify-center">
                <FiMessageCircle className="text-xl" />
              </div>
              Inquiries
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-2">Manage your property conversations</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-slate-200 dark:border-slate-800 pb-px">
          <button
            onClick={() => setActiveTab('received')}
            className={`px-4 py-2.5 text-sm font-semibold transition-colors border-b-2 relative top-px ${activeTab === 'received' ? 'border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400' : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'}`}
          >
            Received ({inquiries.received.length})
          </button>
          <button
            onClick={() => setActiveTab('sent')}
            className={`px-4 py-2.5 text-sm font-semibold transition-colors border-b-2 relative top-px ${activeTab === 'sent' ? 'border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400' : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'}`}
          >
            Sent ({inquiries.sent.length})
          </button>
        </div>

        {/* List */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-32 bg-slate-200 dark:bg-slate-800 rounded-2xl shimmer" />
            ))}
          </div>
        ) : activeList.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-[#151515] rounded-2xl border border-slate-200 dark:border-slate-800">
            <FiMessageCircle className="mx-auto text-4xl text-slate-300 dark:text-slate-600 mb-4" />
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">No inquiries yet</h3>
            <p className="text-slate-500 mt-2">You haven't {activeTab === 'received' ? 'received any inquiries on your properties.' : 'sent any inquiries.'}</p>
          </div>
        ) : (
          <div className="space-y-4">
            <AnimatePresence>
              {activeList.map(inq => (
                <motion.div
                  key={inq.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className={`bg-white dark:bg-[#151515] p-5 rounded-2xl border transition-all ${!inq.is_read && activeTab === 'received' ? 'border-blue-500 shadow-md shadow-blue-500/10' : 'border-slate-200 dark:border-slate-800'}`}
                >
                  <div className="flex flex-col sm:flex-row gap-5">
                    {/* Property Thumbnail */}
                    <div 
                      className="w-full sm:w-32 h-24 rounded-xl overflow-hidden shrink-0 cursor-pointer relative group"
                      onClick={() => navigate(`/dashboard/properties/${inq.property_id}`)}
                    >
                      <img src={inq.property_image} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <FiExternalLink className="text-white text-xl" />
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                            {activeTab === 'received' && !inq.is_read && <span className="w-2 h-2 rounded-full bg-blue-500" />}
                            {inq.property_title}
                          </h3>
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 flex items-center gap-1">
                            <FiClock /> {formatDate(inq.created_at)}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          {activeTab === 'received' && !inq.is_read && (
                            <button onClick={() => markAsRead(inq.id)} className="p-2 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors" title="Mark as read">
                              <FiCheck />
                            </button>
                          )}
                          <button onClick={() => deleteInquiry(inq.id)} className="p-2 text-red-500 bg-red-50 dark:bg-red-500/10 hover:bg-red-100 dark:hover:bg-red-500/20 rounded-lg transition-colors" title="Delete inquiry">
                            <FiTrash2 />
                          </button>
                        </div>
                      </div>

                      {/* Contact Info */}
                      <div className="mb-3 inline-flex flex-wrap items-center gap-x-4 gap-y-1 text-sm bg-slate-50 dark:bg-[#0f0f0f] px-3 py-2 rounded-lg border border-slate-100 dark:border-slate-800">
                        <span className="font-medium text-slate-700 dark:text-slate-300">
                          {activeTab === 'received' ? 'From: ' : 'To: '} 
                          {activeTab === 'received' ? inq.sender_name : inq.receiver_name}
                        </span>
                        <span className="text-slate-500 select-all">{activeTab === 'received' ? inq.sender_email : inq.receiver_email}</span>
                        {((activeTab === 'received' && inq.sender_phone) || (activeTab === 'sent' && inq.receiver_phone)) && (
                          <span className="text-slate-500 select-all border-l border-slate-300 dark:border-slate-700 pl-4">
                            {activeTab === 'received' ? inq.sender_phone : inq.receiver_phone}
                          </span>
                        )}
                      </div>

                      <p className="text-sm text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-[#1a1a1a] p-3 rounded-xl whitespace-pre-wrap">
                        {inq.message}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </main>
    </div>
  );
};

export default InquiriesPage;
