import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FiUsers, FiHome, FiHeart, FiTrendingUp, FiTrash2, FiEdit3 } from 'react-icons/fi';
import Navbar from '../components/Navbar';
import axiosClient from '../api/axiosClient';
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
  const [selectedUser, setSelectedUser] = useState(null);
  const [userRoleForm, setUserRoleForm] = useState({ userId: null, newRole: 'buyer' });
  const [deleteConfirm, setDeleteConfirm] = useState(null);

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
      <div className="min-h-screen bg-white dark:bg-slate-950">
        <Navbar />
        <div className="flex items-center justify-center h-screen">
          <div className="text-xl text-slate-600 dark:text-slate-400">Loading admin dashboard...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      <Navbar />
      <div className="p-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">Admin Dashboard</h1>
          <p className="text-slate-600 dark:text-slate-400">Platform overview and management</p>
        </div>

        {/* Top Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Total Users Card */}
            <div className={`p-6 rounded-xl border ${lightBorder} ${lightCardBg} hover:shadow-lg transition-shadow`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">Total Users</p>
                  <p className="text-3xl font-bold text-slate-900 dark:text-white mt-2">{stats.users?.total_users ?? 0}</p>
                  <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">{stats.users?.new_users_this_week ?? 0} new this week</p>
                </div>
                <div className="p-4 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <FiUsers className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>

            {/* Total Properties Card */}
            <div className={`p-6 rounded-xl border ${lightBorder} ${lightCardBg} hover:shadow-lg transition-shadow`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">Total Properties</p>
                  <p className="text-3xl font-bold text-slate-900 dark:text-white mt-2">{stats.properties?.total_properties ?? 0}</p>
                  <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1">{stats.properties?.new_properties_this_week ?? 0} new this week</p>
                </div>
                <div className="p-4 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
                  <FiHome className="w-6 h-6 text-emerald-600" />
                </div>
              </div>
            </div>

            {/* Total Favourites Card */}
            <div className={`p-6 rounded-xl border ${lightBorder} ${lightCardBg} hover:shadow-lg transition-shadow`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">Total Favourites</p>
                  <p className="text-3xl font-bold text-slate-900 dark:text-white mt-2">{stats.favourites?.total_favourites ?? 0}</p>
                  <p className="text-xs text-rose-600 dark:text-rose-400 mt-1">Engagement metric</p>
                </div>
                <div className="p-4 bg-rose-100 dark:bg-rose-900/30 rounded-lg">
                  <FiHeart className="w-6 h-6 text-rose-600" />
                </div>
              </div>
            </div>

            {/* Avg Price Card */}
            <div className={`p-6 rounded-xl border ${lightBorder} ${lightCardBg} hover:shadow-lg transition-shadow`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">Average Price</p>
                  <p className="text-3xl font-bold text-slate-900 dark:text-white mt-2">₹{Number(stats.properties?.avg_price || 0) > 0 ? (Number(stats.properties.avg_price) / 1000000).toFixed(1) : '0.0'}M</p>
                  <p className="text-xs text-violet-600 dark:text-violet-400 mt-1">Market average</p>
                </div>
                <div className="p-4 bg-violet-100 dark:bg-violet-900/30 rounded-lg">
                  <FiTrendingUp className="w-6 h-6 text-violet-600" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* User Growth Line Chart */}
          <div className={`p-6 rounded-xl border ${lightBorder} ${lightCardBg}`}>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">User Growth (30 Days)</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={userGrowth}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" className="dark:stroke-slate-700" />
                <XAxis dataKey="date" stroke="#94a3b8" className="dark:stroke-slate-600" />
                <YAxis stroke="#94a3b8" className="dark:stroke-slate-600" />
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }} />
                <Line type="monotone" dataKey="count" stroke="#2563eb" strokeWidth={2} dot={{ fill: '#2563eb', r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Property Growth Bar Chart */}
          <div className={`p-6 rounded-xl border ${lightBorder} ${lightCardBg}`}>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Property Growth (30 Days)</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={propertyGrowth}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" className="dark:stroke-slate-700" />
                <XAxis dataKey="date" stroke="#94a3b8" className="dark:stroke-slate-600" />
                <YAxis stroke="#94a3b8" className="dark:stroke-slate-600" />
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }} />
                <Bar dataKey="count" fill="#10b981" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Price Distribution Pie Chart */}
          <div className={`p-6 rounded-xl border ${lightBorder} ${lightCardBg}`}>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Price Distribution</h3>
            {normalizedPriceDistribution.some((item) => item.count > 0) ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={normalizedPriceDistribution}
                    dataKey="count"
                    nameKey="range"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label
                  >
                    {normalizedPriceDistribution.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={chartColors[index % chartColors.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-sm text-slate-500 dark:text-slate-400">
                No price data available yet.
              </div>
            )}
          </div>

          {/* Property Volume Area Chart */}
          <div className={`p-6 rounded-xl border ${lightBorder} ${lightCardBg}`}>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Cumulative Properties</h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={propertyGrowth}>
                <defs>
                  <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#7c3aed" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" className="dark:stroke-slate-700" />
                <XAxis dataKey="date" stroke="#94a3b8" className="dark:stroke-slate-600" />
                <YAxis stroke="#94a3b8" className="dark:stroke-slate-600" />
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }} />
                <Area type="monotone" dataKey="count" stroke="#7c3aed" fillOpacity={1} fill="url(#colorCount)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Favourited Properties */}
        {topFavourited.length > 0 && (
          <div className={`p-6 rounded-xl border ${lightBorder} ${lightCardBg} mb-8`}>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Top Favourited Properties</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-700">
                    <th className="text-left py-3 px-4 text-slate-600 dark:text-slate-400 font-medium">Title</th>
                    <th className="text-left py-3 px-4 text-slate-600 dark:text-slate-400 font-medium">Location</th>
                    <th className="text-left py-3 px-4 text-slate-600 dark:text-slate-400 font-medium">Price</th>
                    <th className="text-left py-3 px-4 text-slate-600 dark:text-slate-400 font-medium">Favourites</th>
                  </tr>
                </thead>
                <tbody>
                  {topFavourited.map((prop) => (
                    <tr key={prop.id} className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900/50">
                      <td className="py-3 px-4 text-slate-900 dark:text-white">{prop.title}</td>
                      <td className="py-3 px-4 text-slate-600 dark:text-slate-400">{prop.location}</td>
                      <td className="py-3 px-4 text-slate-900 dark:text-white">₹{(prop.price / 1000000).toFixed(1)}M</td>
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400 rounded-full text-xs font-medium">
                          <FiHeart className="w-3 h-3" /> {prop.favourite_count}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Recent Activity */}
        {recentActivity.length > 0 && (
          <div className={`p-6 rounded-xl border ${lightBorder} ${lightCardBg} mb-8`}>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Recent Activity</h3>
            <div className="space-y-3">
              {recentActivity.map((activity, idx) => (
                <div key={idx} className="flex items-center gap-4 p-3 rounded-lg bg-slate-100 dark:bg-slate-900/30">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                    {activity.type === 'user_joined' ? <FiUsers className="w-5 h-5 text-blue-600" /> : <FiHome className="w-5 h-5 text-blue-600" />}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-900 dark:text-white">{activity.title}</p>
                    <p className="text-xs text-slate-600 dark:text-slate-400">{activity.subtitle}</p>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-500">{new Date(activity.created_at).toLocaleDateString()}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Users Management */}
        <div className={`p-6 rounded-xl border ${lightBorder} ${lightCardBg} mb-8`}>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Users Management</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700">
                  <th className="text-left py-3 px-4 text-slate-600 dark:text-slate-400 font-medium">Name</th>
                  <th className="text-left py-3 px-4 text-slate-600 dark:text-slate-400 font-medium">Email</th>
                  <th className="text-left py-3 px-4 text-slate-600 dark:text-slate-400 font-medium">Role</th>
                  <th className="text-left py-3 px-4 text-slate-600 dark:text-slate-400 font-medium">Properties</th>
                  <th className="text-left py-3 px-4 text-slate-600 dark:text-slate-400 font-medium">Favourites</th>
                  <th className="text-left py-3 px-4 text-slate-600 dark:text-slate-400 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {allUsers.map((user) => (
                  <tr key={user.id} className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900/50">
                    <td className="py-3 px-4 text-slate-900 dark:text-white font-medium">{user.name}</td>
                    <td className="py-3 px-4 text-slate-600 dark:text-slate-400">{user.email}</td>
                    <td className="py-3 px-4">
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${user.role === 'admin' ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400' : 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-900 dark:text-white">{user.property_count}</td>
                    <td className="py-3 px-4 text-slate-900 dark:text-white">{user.favourite_count}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        {userRoleForm.userId === user.id ? (
                          <div className="flex gap-2">
                            <select
                              value={userRoleForm.newRole}
                              onChange={(e) => setUserRoleForm({ ...userRoleForm, newRole: e.target.value })}
                              className="px-2 py-1 text-xs rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                            >
                              <option value="buyer">Buyer</option>
                              <option value="admin">Admin</option>
                            </select>
                            <button
                              onClick={() => handleUpdateUserRole(user.id, userRoleForm.newRole)}
                              className="px-2 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                            >
                              Save
                            </button>
                            <button
                              onClick={() => setUserRoleForm({ userId: null, newRole: 'buyer' })}
                              className="px-2 py-1 text-xs bg-slate-400 text-white rounded hover:bg-slate-500 transition-colors"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <>
                            <button
                              onClick={() => setUserRoleForm({ userId: user.id, newRole: user.role })}
                              className="p-1 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded transition-colors"
                              title="Edit role"
                            >
                              <FiEdit3 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setDeleteConfirm({ type: 'user', id: user.id, name: user.name })}
                              className="p-1 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 rounded transition-colors"
                              title="Delete user"
                            >
                              <FiTrash2 className="w-4 h-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Properties Management */}
        <div className={`p-6 rounded-xl border ${lightBorder} ${lightCardBg}`}>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Properties Management</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700">
                  <th className="text-left py-3 px-4 text-slate-600 dark:text-slate-400 font-medium">Title</th>
                  <th className="text-left py-3 px-4 text-slate-600 dark:text-slate-400 font-medium">Location</th>
                  <th className="text-left py-3 px-4 text-slate-600 dark:text-slate-400 font-medium">Price</th>
                  <th className="text-left py-3 px-4 text-slate-600 dark:text-slate-400 font-medium">Uploader</th>
                  <th className="text-left py-3 px-4 text-slate-600 dark:text-slate-400 font-medium">Favourites</th>
                  <th className="text-left py-3 px-4 text-slate-600 dark:text-slate-400 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {allProperties.map((prop) => (
                  <tr key={prop.id} className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900/50">
                    <td className="py-3 px-4 text-slate-900 dark:text-white font-medium">{prop.title}</td>
                    <td className="py-3 px-4 text-slate-600 dark:text-slate-400">{prop.location}</td>
                    <td className="py-3 px-4 text-slate-900 dark:text-white">₹{(prop.price / 1000000).toFixed(1)}M</td>
                    <td className="py-3 px-4 text-slate-600 dark:text-slate-400">{prop.uploaded_by_name || 'Unknown'}</td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400 rounded-full text-xs font-medium">
                        <FiHeart className="w-3 h-3" /> {prop.favourite_count}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => setDeleteConfirm({ type: 'property', id: prop.id, name: prop.title })}
                        className="p-1 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 rounded transition-colors"
                        title="Delete property"
                      >
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className={`bg-white dark:bg-slate-800 rounded-xl shadow-2xl max-w-sm w-full p-6 border ${lightBorder}`}>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">Confirm Delete</p>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
              Delete {deleteConfirm.type === 'user' ? 'User' : 'Property'}?
            </h3>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              Are you sure you want to delete <strong>{deleteConfirm.name}</strong>? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (deleteConfirm.type === 'user') {
                    handleDeleteUser(deleteConfirm.id);
                  } else {
                    handleDeleteProperty(deleteConfirm.id);
                  }
                }}
                className="flex-1 px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors font-medium"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPage;
