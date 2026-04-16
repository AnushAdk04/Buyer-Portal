import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import {
  FaArrowLeft,
  FaHeart,
  FaMapMarkerAlt,
  FaRupeeSign,
  FaRegCheckCircle,
  FaRegStar,
  FaHome,
} from 'react-icons/fa';

const PropertyDetailsPage = () => {
  const { user } = useAuth();
  const { propertyId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [property, setProperty] = useState(location.state?.property || null);
  const [loading, setLoading] = useState(!location.state?.property);
  const [saving, setSaving] = useState(false);

  const formatPrice = (price) =>
    new Intl.NumberFormat('en-NP', { style: 'currency', currency: 'NPR', maximumFractionDigits: 0 }).format(price);

  useEffect(() => {
    const loadProperty = async () => {
      if (property?.id === Number(propertyId)) {
        return;
      }

      setLoading(true);
      try {
        const { data } = await axiosClient.get('/favourites/properties');
        const found = data.properties.find((item) => item.id === Number(propertyId));

        if (!found) {
          toast.error('Property not found');
          navigate('/dashboard', { replace: true });
          return;
        }

        setProperty(found);
      } catch {
        toast.error('Failed to load property details');
        navigate('/dashboard', { replace: true });
      } finally {
        setLoading(false);
      }
    };

    loadProperty();
  }, [navigate, property?.id, propertyId]);

  const handleToggleFavourite = async () => {
    if (!property) return;

    setSaving(true);
    const toastId = toast.loading(property.isFavourite ? 'Removing from favourites...' : 'Adding to favourites...');

    try {
      if (property.isFavourite) {
        await axiosClient.delete(`/favourites/${property.id}`);
        toast.success('Removed from favourites', { id: toastId });
      } else {
        await axiosClient.post('/favourites', { propertyId: property.id });
        toast.success('Added to favourites', { id: toastId });
      }

      setProperty((current) => current ? { ...current, isFavourite: !current.isFavourite } : current);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not update favourite', { id: toastId });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
        <button
          onClick={() => navigate('/dashboard')}
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors mb-6"
        >
          <FaArrowLeft />
          Back to properties
        </button>

        {loading ? (
          <div className="min-h-[60vh] flex items-center justify-center">
            <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : property ? (
          <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_0.85fr] gap-8 items-start">
            <section className="relative">
              <div className="relative overflow-hidden rounded-[2rem] shadow-2xl shadow-slate-300/60 bg-slate-900">
                <img
                  src={property.image_url}
                  alt={property.title}
                  className="w-full h-[360px] sm:h-[460px] object-cover"
                  onError={(e) => {
                    e.target.src = 'https://placehold.co/1200x800?text=No+Image';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-slate-950/50 via-transparent to-transparent" />
                <div className="absolute left-5 top-5 inline-flex items-center gap-2 rounded-full bg-white/90 backdrop-blur px-4 py-2 text-sm font-semibold text-slate-800">
                  <FaHome className="text-blue-600" />
                  {user?.role === 'admin' ? 'Admin view' : 'Property view'}
                </div>
                <div className="absolute left-5 bottom-5 right-5 flex flex-wrap gap-3">
                  <span className="inline-flex items-center gap-2 rounded-full bg-slate-950/80 text-white px-4 py-2 text-sm backdrop-blur">
                    <FaMapMarkerAlt className="text-blue-300" />
                    {property.location || 'Location unavailable'}
                  </span>
                  <span className="inline-flex items-center gap-2 rounded-full bg-slate-950/80 text-white px-4 py-2 text-sm backdrop-blur">
                    <FaRegStar className="text-amber-300" />
                    Premium listing
                  </span>
                </div>
              </div>
            </section>

            <aside className="bg-white/85 dark:bg-slate-900/90 backdrop-blur-xl rounded-[2rem] border border-white dark:border-slate-800 shadow-xl shadow-slate-200/60 dark:shadow-slate-950/70 p-6 sm:p-8 lg:sticky lg:top-6">
              <div className="flex items-start justify-between gap-4 mb-6">
                <div>
                  <p className="text-xs uppercase tracking-[0.26em] text-blue-600 font-semibold mb-3">Property details</p>
                  <h1 className="text-2xl sm:text-3xl font-semibold text-slate-950 dark:text-slate-100 leading-tight">{property.title}</h1>
                </div>
                <button
                  onClick={handleToggleFavourite}
                  disabled={saving}
                  className="shrink-0 w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors flex items-center justify-center disabled:opacity-50"
                  aria-label={property.isFavourite ? 'Remove from favourites' : 'Add to favourites'}
                >
                  {saving ? (
                    <span className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <FaHeart className={property.isFavourite ? 'text-red-500 text-lg' : 'text-slate-300 text-lg'} />
                  )}
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <div className="rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-4">
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-2 flex items-center gap-2"><FaMapMarkerAlt className="text-blue-500" /> Location</p>
                  <p className="text-slate-900 dark:text-slate-100 font-medium">{property.location || 'Not specified'}</p>
                </div>
                <div className="rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-4">
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-2 flex items-center gap-2"><FaRupeeSign className="text-blue-500" /> Asking price</p>
                  <p className="text-slate-900 dark:text-slate-100 font-semibold text-lg">{formatPrice(property.price)}</p>
                </div>
              </div>

              <div className="space-y-4 text-slate-600 dark:text-slate-300">
                <p className="leading-7">
                  {property.description || 'No description provided for this property.'}
                </p>

                <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-4 space-y-3">
                  <div className="flex items-center gap-3 text-slate-700 dark:text-slate-200">
                    <FaRegCheckCircle className="text-emerald-500" />
                    Quick property overview
                  </div>
                  <div className="flex items-center gap-3 text-slate-700 dark:text-slate-200">
                    <FaRegCheckCircle className="text-emerald-500" />
                    Tap the heart to save or remove from favourites
                  </div>
                  <div className="flex items-center gap-3 text-slate-700 dark:text-slate-200">
                    <FaRegCheckCircle className="text-emerald-500" />
                    Works directly from the dashboard without extra navigation setup
                  </div>
                </div>
              </div>
            </aside>
          </div>
        ) : null}
      </main>
    </div>
  );
};

export default PropertyDetailsPage;