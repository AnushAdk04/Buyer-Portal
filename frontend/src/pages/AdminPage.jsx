import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { 
  FiUsers, FiHome, FiHeart, FiTrendingUp, FiTrash2, FiEdit3, 
  FiBarChart2, FiActivity, FiSettings, FiSearch, FiFilter,
  FiChevronRight, FiGrid, FiList, FiPieChart
} from 'react-icons/fi';
import Navbar from '../components/Navbar';
import axiosClient from '../api/axiosClient';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell
} from 'recharts';

const AdminPage = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [userGrowth, setUserGrowth] = useState([]);
  const [propertyGrowth, setPropertyGrowth] = useState([]);
  const [topFavourited, setTopFavourited] = useState([]);
  const [priceDistribution, setPriceDistribution] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [allProperties, setAllProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedUser, setSelectedUser] = useState(null);
  const [userRoleForm, setUserRoleForm] = useState({ userId: null, newRole: 'buyer' });
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Chart colors matching theme
  const chartColors = ['#2563eb', '#7c3aed', '#ec4899', '#f59e0b', '#10b981'];
  const lightCardBg = 'bg-slate-50 dark:bg-slate-800';
  const lightBorder = 'border-slate-200 dark:border-slate-700';
  const priceBuckets = [
    'Under 5M',
    '5M - 10M',
    '10M - 20M',
    '20M - 35M',
    'Above 35M',
  ];

  const normalizedPriceDistribution = priceBuckets.map((bucket) => {
    const match = priceDistribution.find((item) => item.range === bucket);
    return {
      range: bucket,
      count: Number(match?.count || 0),
    };
  });

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      const [statsRes, userGrowthRes, propertyGrowthRes, topFavRes, priceDistRes, activityRes, allUsersRes, allPropsRes] = await Promise.all([
        axiosClient.get('/admin/stats'),
        axiosClient.get('/admin/users/growth'),
        axiosClient.get('/admin/properties/growth'),
        axiosClient.get('/admin/properties/top-favourited'),
        axiosClient.get('/admin/properties/price-distribution'),
        axiosClient.get('/admin/activity'),
        axiosClient.get('/admin/users'),
        axiosClient.get('/admin/properties'),
      ]);

      setStats(statsRes.data || {});
      setUserGrowth((userGrowthRes.data?.data || []).map((item) => ({ ...item, count: Number(item.count || 0) })));
      setPropertyGrowth((propertyGrowthRes.data?.data || []).map((item) => ({ ...item, count: Number(item.count || 0) })));
      setTopFavourited((topFavRes.data?.data || []).map((item) => ({ ...item, favourite_count: Number(item.favourite_count || 0) })));
      setPriceDistribution(priceDistRes.data?.data || []);
      setRecentActivity(activityRes.data?.activity || []);
      setAllUsers((allUsersRes.data?.users || []).map((item) => ({
        ...item,
        property_count: Number(item.property_count || 0),
        favourite_count: Number(item.favourite_count || 0),
      })));
      setAllProperties((allPropsRes.data?.properties || []).map((item) => ({
        ...item,
        favourite_count: Number(item.favourite_count || 0),
      })));
    } catch (error) {
      console.error('Failed to fetch admin data:', error);
      toast.error('Failed to load admin dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      await axiosClient.delete(`/admin/users/${userId}`);
      toast.success('User deleted successfully');
      setAllUsers(allUsers.filter(u => u.id !== userId));
      setDeleteConfirm(null);
      await fetchAllData();
    } catch (error) {
      console.error('Delete user error:', error);
      toast.error(error.response?.data?.message || 'Failed to delete user');
    }
  };

  const handleDeleteProperty = async (propertyId) => {
    try {
      await axiosClient.delete(`/admin/properties/${propertyId}`);
      toast.success('Property deleted successfully');
      setAllProperties(allProperties.filter(p => p.id !== propertyId));
      setDeleteConfirm(null);
      await fetchAllData();
    } catch (error) {
      console.error('Delete property error:', error);
      toast.error(error.response?.data?.message || 'Failed to delete property');
    }
  };

  const handleUpdateUserRole = async (userId, newRole) => {
    try {
      await axiosClient.patch(`/admin/users/${userId}/role`, { role: newRole });
      toast.success(`User role updated to ${newRole}`);
      setAllUsers(allUsers.map(u => u.id === userId ? { ...u, role: newRole } : u));
      setUserRoleForm({ userId: null, newRole: 'buyer' });
      await fetchAllData();
    } catch (error) {
      console.error('Update role error:', error);
      toast.error(error.response?.data?.message || 'Failed to update role');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#0a0a0a]">
        <Navbar />
        <div className="flex items-center justify-center h-[calc(100vh-80px)]">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  const filteredUsers = allUsers.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredProperties = allProperties.filter(p => 
    p.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0a0a0a] text-slate-900 dark:text-slate-100 font-sans">
      <Navbar />
      
      <div className="flex max-w-[1600px] mx-auto min-h-[calc(100vh-73px)]">
        {/* Sidebar */}
        <aside className="hidden lg:flex w-72 flex-col border-r border-slate-200 dark:border-slate-800 p-6 bg-white/50 dark:bg-[#0a0a0a]/50 backdrop-blur-sm">
          <div className="mb-10">
            <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-6">Management</h2>
            <nav className="space-y-2">
              {[
                { id: 'overview', label: 'Overview', icon: <FiBarChart2 /> },
                { id: 'users', label: 'Users', icon: <FiUsers /> },
                { id: 'properties', label: 'Properties', icon: <FiHome /> },
                { id: 'activity', label: 'Activity', icon: <FiActivity /> },
              ].map(item => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                    activeTab === item.id 
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' 
                    : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <span className="text-lg">{item.icon}</span>
                  {item.label}
                </button>
              ))}
            </nav>
          </div>
          
          <div className="mt-auto p-4 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white">
            <p className="text-xs font-medium opacity-80 mb-1">System Status</p>
            <p className="text-lg font-bold mb-3">All systems operational</p>
            <div className="w-full h-1.5 bg-white/20 rounded-full overflow-hidden">
              <div className="w-full h-full bg-white rounded-full" />
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 lg:p-10 overflow-hidden">
          {/* Header */}
          <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
            <div>
              <motion.h1 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-3xl lg:text-4xl font-black font-heading text-slate-900 dark:text-white tracking-tight"
              >
                {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
              </motion.h1>
              <p className="text-slate-500 dark:text-slate-400 mt-1">Control center for BuyerPortal platform</p>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Search..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-blue-500 outline-none w-full md:w-64 transition-all"
                />
              </div>
              <button className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                <FiSettings className="text-xl" />
              </button>
            </div>
          </header>

          <AnimatePresence mode="wait">
            {activeTab === 'overview' && (
              <motion.div
                key="overview"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-10">
                  <StatCard label="Total Users" value={stats.users?.total_users} subValue={`${stats.users?.new_users_this_week} new this week`} icon={<FiUsers />} color="blue" />
                  <StatCard label="Total Properties" value={stats.properties?.total_properties} subValue={`${stats.properties?.new_properties_this_week} new this week`} icon={<FiHome />} color="emerald" />
                  <StatCard label="Favourites" value={stats.favourites?.total_favourites} subValue="User engagement" icon={<FiHeart />} color="rose" />
                  <StatCard label="Avg Price" value={`₹${(Number(stats.properties?.avg_price || 0) / 1000000).toFixed(1)}M`} subValue="Market average" icon={<FiTrendingUp />} color="violet" />
                </div>

                {/* Charts Area */}
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                  <ChartContainer title="User Growth (30 Days)" icon={<FiActivity />}>
                    <ResponsiveContainer width="100%" height={300}>
                      <AreaChart data={userGrowth}>
                        <defs>
                          <linearGradient id="userGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <XAxis dataKey="date" hide />
                        <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                        <Area type="monotone" dataKey="count" stroke="#2563eb" strokeWidth={3} fill="url(#userGrad)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </ChartContainer>

                  <ChartContainer title="Property Volume" icon={<FiHome />}>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={propertyGrowth}>
                        <XAxis dataKey="date" hide />
                        <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                        <Bar dataKey="count" fill="#10b981" radius={[6, 6, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>

                  <ChartContainer title="Price Distribution" icon={<FiPieChart />}>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie data={normalizedPriceDistribution} dataKey="count" nameKey="range" cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={5}>
                          {normalizedPriceDistribution.map((_, i) => <Cell key={i} fill={chartColors[i % chartColors.length]} />)}
                        </Pie>
                        <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                        <Legend verticalAlign="bottom" height={36}/>
                      </PieChart>
                    </ResponsiveContainer>
                  </ChartContainer>

                  <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
                    <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                      <FiHeart className="text-rose-500" /> Hot Properties
                    </h3>
                    <div className="space-y-4">
                      {topFavourited.slice(0, 5).map(prop => (
                        <div key={prop.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                          <div>
                            <p className="font-bold text-sm text-slate-900 dark:text-white">{prop.title}</p>
                            <p className="text-xs text-slate-500">{prop.location}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-sm text-blue-600">₹{(prop.price / 1000000).toFixed(1)}M</p>
                            <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">{prop.favourite_count} saves</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'users' && (
              <motion.div
                key="users"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm"
              >
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 dark:bg-slate-800/50">
                        <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">User</th>
                        <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Role</th>
                        <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 text-center">Properties</th>
                        <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 text-center">Favourites</th>
                        <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                      {filteredUsers.map(user => (
                        <tr key={user.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 font-bold">
                                {user.name.charAt(0)}
                              </div>
                              <div>
                                <p className="font-bold text-slate-900 dark:text-white">{user.name}</p>
                                <p className="text-xs text-slate-500">{user.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                              user.role === 'admin' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                            }`}>
                              {user.role}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-center font-bold text-slate-600 dark:text-slate-400">{user.property_count}</td>
                          <td className="px-6 py-4 text-center font-bold text-slate-600 dark:text-slate-400">{user.favourite_count}</td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              {userRoleForm.userId === user.id ? (
                                <div className="flex gap-1 animate-in fade-in slide-in-from-right-2">
                                  <select value={userRoleForm.newRole} onChange={(e) => setUserRoleForm({ ...userRoleForm, newRole: e.target.value })}
                                    className="px-2 py-1 text-xs rounded-lg border dark:bg-slate-800 dark:border-slate-700 outline-none">
                                    <option value="buyer">Buyer</option>
                                    <option value="admin">Admin</option>
                                  </select>
                                  <button onClick={() => handleUpdateUserRole(user.id, userRoleForm.newRole)} className="p-1.5 bg-emerald-600 text-white rounded-lg"><FiActivity /></button>
                                  <button onClick={() => setUserRoleForm({ userId: null, newRole: 'buyer' })} className="p-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg text-slate-600 dark:text-white">×</button>
                                </div>
                              ) : (
                                <>
                                  <button onClick={() => setUserRoleForm({ userId: user.id, newRole: user.role })} className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-xl transition-all" title="Edit Role"><FiEdit3 /></button>
                                  <button onClick={() => setDeleteConfirm({ type: 'user', id: user.id, name: user.name })} className="p-2 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/30 rounded-xl transition-all" title="Delete User"><FiTrash2 /></button>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}

            {activeTab === 'properties' && (
              <motion.div
                key="properties"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm"
              >
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 dark:bg-slate-800/50">
                        <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Property</th>
                        <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Location</th>
                        <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Price</th>
                        <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Seller</th>
                        <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                      {filteredProperties.map(prop => (
                        <tr key={prop.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <img src={prop.image_url} alt="" className="w-12 h-12 rounded-xl object-cover border border-slate-200 dark:border-slate-800" />
                              <p className="font-bold text-slate-900 dark:text-white max-w-[200px] truncate">{prop.title}</p>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-slate-500">{prop.location}</td>
                          <td className="px-6 py-4 font-bold text-blue-600">₹{(prop.price / 1000000).toFixed(1)}M</td>
                          <td className="px-6 py-4">
                            <p className="text-sm font-medium text-slate-900 dark:text-white">{prop.uploaded_by_name || 'System'}</p>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <button onClick={() => setDeleteConfirm({ type: 'property', id: prop.id, name: prop.title })} className="p-2 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/30 rounded-xl transition-all" title="Delete Property"><FiTrash2 /></button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}

            {activeTab === 'activity' && (
              <motion.div
                key="activity"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="max-w-3xl mx-auto space-y-4"
              >
                {recentActivity.map((activity, idx) => (
                  <div key={idx} className="flex items-start gap-4 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-blue-500/30 transition-all group">
                    <div className={`p-3 rounded-xl ${activity.type === 'user_joined' ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/30' : 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30'} group-hover:scale-110 transition-transform`}>
                      {activity.type === 'user_joined' ? <FiUsers /> : <FiHome />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <p className="font-bold text-slate-900 dark:text-white truncate">{activity.title}</p>
                        <span className="shrink-0 text-[10px] font-bold text-slate-400 uppercase tracking-widest">{new Date(activity.created_at).toLocaleDateString()}</span>
                      </div>
                      <p className="text-sm text-slate-500 dark:text-slate-400">{activity.subtitle}</p>
                    </div>
                    <FiChevronRight className="text-slate-300 group-hover:text-blue-500 transition-colors" />
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>

      {/* Delete Modal */}
      <AnimatePresence>
        {deleteConfirm && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setDeleteConfirm(null)} className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} className="relative w-full max-w-sm bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-2xl border border-slate-200 dark:border-slate-800">
              <div className="w-16 h-16 bg-rose-100 dark:bg-rose-900/30 text-rose-600 rounded-2xl flex items-center justify-center text-3xl mb-6 mx-auto">
                <FiTrash2 />
              </div>
              <h3 className="text-2xl font-bold text-center mb-2">Are you sure?</h3>
              <p className="text-slate-500 text-center mb-8 text-sm">Deleting <span className="text-slate-900 dark:text-white font-bold">{deleteConfirm.name}</span> is permanent and cannot be undone.</p>
              <div className="flex gap-3">
                <button onClick={() => setDeleteConfirm(null)} className="flex-1 py-3 rounded-xl border border-slate-200 dark:border-slate-800 font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">Cancel</button>
                <button onClick={() => { deleteConfirm.type === 'user' ? handleDeleteUser(deleteConfirm.id) : handleDeleteProperty(deleteConfirm.id); }} className="flex-1 py-3 rounded-xl bg-rose-600 text-white font-bold hover:bg-rose-700 transition-colors shadow-lg shadow-rose-600/20">Delete</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Helper Components
const StatCard = ({ label, value, subValue, icon, color }) => {
  const colors = {
    blue: 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
    emerald: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400',
    rose: 'bg-rose-50 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400',
    violet: 'bg-violet-50 text-violet-600 dark:bg-violet-900/30 dark:text-violet-400',
  };
  
  return (
    <motion.div whileHover={{ y: -5 }} className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm transition-all">
      <div className="flex items-center justify-between mb-4">
        <span className={`p-3 rounded-2xl ${colors[color]}`}>{icon}</span>
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{label}</span>
      </div>
      <p className="text-3xl font-black tracking-tight">{value || 0}</p>
      <p className="text-xs text-slate-500 mt-1">{subValue}</p>
    </motion.div>
  );
};

const ChartContainer = ({ title, icon, children }) => (
  <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
    <div className="flex items-center gap-2 mb-6 text-slate-900 dark:text-white font-bold">
      <span className="text-blue-600">{icon}</span>
      <h3>{title}</h3>
    </div>
    {children}
  </div>
);

export default AdminPage;

