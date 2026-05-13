import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiSend, FiMessageCircle } from 'react-icons/fi';
import axiosClient from '../api/axiosClient';
import toast from 'react-hot-toast';

const ContactSellerModal = ({ isOpen, onClose, property }) => {
  const [message, setMessage] = useState(`Hi, I am interested in your property "${property?.title}". Please let me know when we can connect to discuss further.`);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) {
      toast.error('Message cannot be empty');
      return;
    }

    setLoading(true);
    try {
      await axiosClient.post('/inquiries', {
        propertyId: property.id,
        message: message.trim()
      });
      toast.success('Inquiry sent successfully!');
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not send inquiry');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={!loading ? onClose : undefined}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-lg bg-white dark:bg-[#151515] rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden"
          >
            {/* Header */}
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-[#1a1a1a]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 text-blue-600 flex items-center justify-center">
                  <FiMessageCircle className="text-lg" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white">Contact Seller</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Send an inquiry about this property</p>
                </div>
              </div>
              <button
                onClick={onClose}
                disabled={loading}
                className="p-2 rounded-xl text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors disabled:opacity-50"
              >
                <FiX className="text-xl" />
              </button>
            </div>

            {/* Content */}
            <form onSubmit={handleSubmit} className="p-6">
              <div className="mb-6 p-4 rounded-xl bg-slate-50 dark:bg-[#0f0f0f] border border-slate-200 dark:border-slate-800 flex items-center gap-4">
                <img src={property?.image_url} alt="" className="w-16 h-16 rounded-lg object-cover" />
                <div>
                  <p className="font-semibold text-slate-900 dark:text-white line-clamp-1">{property?.title}</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-1">Listed by {property?.uploaded_by_name}</p>
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Your Message
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  disabled={loading}
                  rows={5}
                  className="w-full px-4 py-3 border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#1a1a1a] text-slate-800 dark:text-slate-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow resize-none"
                  placeholder="Type your message here..."
                />
              </div>

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={loading}
                  className="px-5 py-2.5 rounded-xl font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-700 transition-colors disabled:opacity-60 shadow-lg shadow-blue-600/20"
                >
                  {loading ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      Send Inquiry <FiSend />
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ContactSellerModal;
