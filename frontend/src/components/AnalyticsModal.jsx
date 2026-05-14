import { useState, useEffect } from 'react';
import { FiX, FiTrendingUp } from 'react-icons/fi';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import axiosClient from '../api/axiosClient';

const AnalyticsModal = ({ isOpen, onClose }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      const fetchAnalytics = async () => {
        setLoading(true);
        try {
          const res = await axiosClient.get('/user/analytics');
          // Format date for chart
          const formattedData = (res.data.viewsOverTime || []).map(item => ({
            date: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            views: parseInt(item.views, 10)
          }));
          setData(formattedData);
        } catch (err) {
          console.error('Failed to fetch analytics');
        } finally {
          setLoading(false);
        }
      };
      fetchAnalytics();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[80] bg-black/65 flex items-center justify-center px-4" onClick={onClose}>
      <div className="w-full max-w-2xl rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0f0f0f] p-5 sm:p-8" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <FiTrendingUp className="text-blue-600" /> Property Analytics
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Views on your properties over the last 7 days.</p>
          </div>
          <button onClick={onClose} className="w-10 h-10 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center justify-center">
            <FiX className="text-lg" />
          </button>
        </div>

        <div className="h-[300px] w-full">
          {loading ? (
            <div className="w-full h-full flex items-center justify-center">
              <span className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : data.length === 0 ? (
            <div className="w-full h-full flex items-center justify-center text-slate-500">
              No views recorded in the last 7 days.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.2} />
                <XAxis dataKey="date" stroke="#64748b" fontSize={12} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} allowDecimals={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }}
                  itemStyle={{ color: '#60a5fa' }}
                />
                <Line type="monotone" dataKey="views" stroke="#3b82f6" strokeWidth={3} dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnalyticsModal;
