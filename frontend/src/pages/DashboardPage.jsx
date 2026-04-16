import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import PropertyCard from '../components/PropertyCard';
import toast from 'react-hot-toast';

const DashboardPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const [activeTab, setActiveTab] = useState('all');
  const [loadingProps, setLoadingProps] = useState(true);
  const [toggleLoading, setToggleLoading] = useState(null);

  const fetchProperties = useCallback(async () => {
    try {
      const { data } = await axiosClient.get('/favourites/properties');
      setProperties(data.properties);
    } catch {
      toast.error('Failed to load properties. Please refresh.');
    } finally {
      setLoadingProps(false);
    }
  }, []);

  useEffect(() => { fetchProperties(); }, [fetchProperties]);

  const handleToggleFavourite = async (propertyId, isFav) => {
    setToggleLoading(propertyId);
    const toastId = toast.loading(isFav ? 'Removing from favourites...' : 'Adding to favourites...');
    try {
      if (isFav) {
        await axiosClient.delete(`/favourites/${propertyId}`);
        toast.success('Removed from favourites', { id: toastId });
      } else {
        await axiosClient.post('/favourites', { propertyId });
        toast.success('Added to favourites ♥', { id: toastId });
      }
      setProperties(prev =>
        prev.map(p => p.id === propertyId ? { ...p, isFavourite: !isFav } : p)
      );
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong', { id: toastId });
    } finally {
      setToggleLoading(null);
    }
  };

  const displayed = activeTab === 'favourites'
    ? properties.filter(p => p.isFavourite)
    : properties;

  const favouriteCount = properties.filter(p => p.isFavourite).length;

  const openPropertyDetails = (property) => {
    navigate(`/dashboard/properties/${property.id}`, { state: { property } });
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Navbar />

      <main className="max-w-6xl mx-auto px-6 py-8">
        <div className="bg-slate-900 rounded-3xl px-8 py-7 mb-8 text-white flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between shadow-xl shadow-slate-200/60 dark:shadow-none border border-slate-800">
          <div>
            <p className="text-blue-300 text-sm uppercase tracking-[0.24em] font-semibold mb-2">Property dashboard</p>
            <h2 className="text-2xl md:text-3xl font-semibold mb-2">Welcome back, {user?.name}</h2>
            <p className="text-slate-300 text-sm max-w-2xl">Browse listings, open a property for a full detail view, and manage favourites from one place.</p>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:min-w-[260px]">
            <div className="rounded-2xl bg-white/10 border border-white/10 px-4 py-3 backdrop-blur-sm">
              <p className="text-2xl font-semibold">{properties.length}</p>
              <p className="text-slate-300 text-sm">Available</p>
            </div>
            <div className="rounded-2xl bg-white/10 border border-white/10 px-4 py-3 backdrop-blur-sm">
              <p className="text-2xl font-semibold">{favouriteCount}</p>
              <p className="text-slate-300 text-sm">Saved</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition-colors
              ${activeTab === 'all' ? 'bg-blue-600 text-white' : 'bg-white dark:bg-slate-900 text-gray-600 dark:text-slate-300 border border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-800'}`}
          >
            All Properties ({properties.length})
          </button>
          <button
            onClick={() => setActiveTab('favourites')}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition-colors
              ${activeTab === 'favourites' ? 'bg-blue-600 text-white' : 'bg-white dark:bg-slate-900 text-gray-600 dark:text-slate-300 border border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-800'}`}
          >
            My Favourites ({favouriteCount})
          </button>
        </div>

        {/* Grid */}
        {loadingProps ? (
          <div className="flex items-center justify-center py-24">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : displayed.length === 0 ? (
          <div className="text-center py-24 text-gray-400 dark:text-slate-500">
            <p className="text-5xl mb-4">♥</p>
            <p className="text-lg font-medium">No properties here yet</p>
            <p className="text-sm mt-1">
              {activeTab === 'favourites' ? 'Click the heart on any property to save it' : 'No properties available'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {displayed.map(property => (
              <PropertyCard
                key={property.id}
                property={property}
                onOpen={openPropertyDetails}
                onToggleFavourite={handleToggleFavourite}
                loading={toggleLoading}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default DashboardPage;