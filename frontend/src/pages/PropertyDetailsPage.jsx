import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import EditPropertyModal from '../components/EditPropertyModal';
import ConfirmDialog from '../components/ConfirmDialog';
import ContactSellerModal from '../components/ContactSellerModal';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { FaHeart, FaMapMarkerAlt, FaRupeeSign } from 'react-icons/fa';
import { IoBedOutline, IoWaterOutline, IoCarOutline } from 'react-icons/io5';
import { TbRulerMeasure } from 'react-icons/tb';
import { FiArrowLeft, FiEdit2, FiExternalLink, FiTrash2, FiChevronLeft, FiChevronRight, FiCalendar, FiMessageCircle, FiShare2 } from 'react-icons/fi';
import MapComponent from '../components/MapComponent';
import EmiCalculator from '../components/EmiCalculator';
import SEO from '../components/SEO';

const STATUS_LABELS = { for_sale: 'For Sale', for_rent: 'For Rent', sold: 'Sold', under_contract: 'Under Contract' };
const STATUS_COLORS = { for_sale: 'bg-emerald-500', for_rent: 'bg-blue-500', sold: 'bg-red-500', under_contract: 'bg-amber-500' };
const TYPE_LABELS = { house: 'House', apartment: 'Apartment', land: 'Land', commercial: 'Commercial', villa: 'Villa', condo: 'Condo' };

const PropertyDetailsPage = () => {
  const { user } = useAuth();
  const { propertyId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [property, setProperty] = useState(location.state?.property || null);
  const [images, setImages] = useState([]);
  const [activeImg, setActiveImg] = useState(0);
  const [loading, setLoading] = useState(!location.state?.property);
  const [saving, setSaving] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editImageFiles, setEditImageFiles] = useState([]);
  const [editForm, setEditForm] = useState({ title: '', location: '', price: '', description: '', propertyType: 'house', status: 'for_sale', bedrooms: '', bathrooms: '', areaSqft: '', parkingSpaces: '' });
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isReadMore, setIsReadMore] = useState(false);

  const isOwner = Number(property?.uploaded_by) === Number(user?.id);
  const formatPrice = (price) => new Intl.NumberFormat('en-NP', { style: 'currency', currency: 'NPR', maximumFractionDigits: 0 }).format(price);

  const getOptimizedUrl = (url, width) => {
    if (!url || !url.includes('cloudinary.com')) return url;
    return url.replace('/upload/', `/upload/f_auto,q_auto,w_${width}/`);
  };

  useEffect(() => {
    const loadProperty = async () => {
      if (property?.id === Number(propertyId) && property?.uploaded_by_name && !loading) return;
      setLoading(true);
      try {
        const [{ data: propertyData }, { data: favData }] = await Promise.all([
          axiosClient.get(`/properties/${propertyId}`),
          axiosClient.get('/favourites/properties'),
        ]);
        const favoriteIds = new Set((favData.properties || []).map(i => i.id));
        const found = propertyData.property;
        if (!found) { toast.error('Property not found'); navigate('/dashboard', { replace: true }); return; }
        setProperty({ ...found, isFavourite: favoriteIds.has(found.id) });
        // Build images array: primary + additional
        const allImages = [found.image_url];
        if (found.images && found.images.length > 0) {
          found.images.forEach(img => allImages.push(img.image_url));
        }
        setImages(allImages);

        // Save to recently viewed
        const recent = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
        const updatedRecent = [{
          id: found.id,
          title: found.title,
          price: found.price,
          image_url: found.image_url,
          location: found.location,
          status: found.status,
          property_type: found.property_type,
          viewedAt: new Date().toISOString()
        }, ...recent.filter(p => p.id !== found.id)].slice(0, 20);
        localStorage.setItem('recentlyViewed', JSON.stringify(updatedRecent));
      } catch { toast.error('Failed to load property'); navigate('/dashboard', { replace: true }); }
      finally { setLoading(false); }
    };
    loadProperty();
  }, [navigate, propertyId]);

  // Set images when property is loaded from state
  useEffect(() => {
    if (property && images.length === 0 && property.image_url) {
      const allImages = [property.image_url];
      if (property.images && property.images.length > 0) {
        property.images.forEach(img => allImages.push(img.image_url));
      }
      setImages(allImages);
    }
  }, [property]);

  const handleToggleFavourite = async () => {
    if (!property) return;
    setSaving(true);
    const tid = toast.loading(property.isFavourite ? 'Removing...' : 'Adding...');
    try {
      if (property.isFavourite) { await axiosClient.delete(`/favourites/${property.id}`); toast.success('Removed', { id: tid }); }
      else { await axiosClient.post('/favourites', { propertyId: property.id }); toast.success('Added ♥', { id: tid }); }
      setProperty(c => c ? { ...c, isFavourite: !c.isFavourite } : c);
    } catch (err) { toast.error(err.response?.data?.message || 'Error', { id: tid }); }
    finally { setSaving(false); }
  };

  const handleOpenEdit = () => {
    if (!property) return;
    setEditImageFiles([]);
    setEditForm({ title: property.title || '', location: property.location || '', price: property.price ?? '', description: property.description || '', propertyType: property.property_type || 'house', status: property.status || 'for_sale', bedrooms: property.bedrooms || '', bathrooms: property.bathrooms || '', areaSqft: property.area_sqft || '', parkingSpaces: property.parking_spaces || '' });
    setIsEditOpen(true);
  };

  const handleEditFormChange = (e) => setEditForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!property) return;
    if (!editForm.title || !editForm.location || !editForm.price) { toast.error('Title, location and price are required'); return; }
    setEditing(true);
    const tid = toast.loading('Updating...');
    try {
      const payload = new FormData();
      Object.keys(editForm).forEach(k => { if (editForm[k] !== '') payload.append(k, typeof editForm[k] === 'string' ? editForm[k].trim() : editForm[k]); });
      if (editImageFiles.length > 0) editImageFiles.forEach(f => payload.append('images', f));
      const { data } = await axiosClient.put(`/properties/${property.id}`, payload, { headers: { 'Content-Type': 'multipart/form-data' } });
      setProperty(prev => prev ? { ...prev, ...data.property, isFavourite: prev.isFavourite } : prev);
      setIsEditOpen(false); setEditImageFiles([]);
      toast.success('Updated', { id: tid });
    } catch (err) { toast.error(err.response?.data?.message || 'Error', { id: tid }); }
    finally { setEditing(false); }
  };

  const handleConfirmDelete = async () => {
    if (!property) return;
    setDeleting(true);
    const tid = toast.loading('Deleting...');
    try {
      await axiosClient.delete(`/properties/${property.id}`);
      toast.success('Deleted', { id: tid });
      navigate('/dashboard', { replace: true });
    } catch (err) { toast.error(err.response?.data?.message || 'Error', { id: tid }); }
    finally { setDeleting(false); }
  };

  const prevImg = () => setActiveImg(i => (i - 1 + images.length) % images.length);
  const nextImg = () => setActiveImg(i => (i + 1) % images.length);

  const specs = [
    property?.bedrooms > 0 && { icon: IoBedOutline, label: 'Bedrooms', value: property.bedrooms },
    property?.bathrooms > 0 && { icon: IoWaterOutline, label: 'Bathrooms', value: property.bathrooms },
    property?.area_sqft > 0 && { icon: TbRulerMeasure, label: 'Area', value: `${Number(property.area_sqft).toLocaleString()} sqft` },
    property?.parking_spaces > 0 && { icon: IoCarOutline, label: 'Parking', value: property.parking_spaces },
    property?.year_built && { icon: FiCalendar, label: 'Built', value: property.year_built },
  ].filter(Boolean);

  const handleShare = async () => {
    if (!property) return;
    const shareData = {
      title: property.title,
      text: `Check out this property: ${property.title} in ${property.location} for ${formatPrice(property.price)}`,
      url: window.location.href
    };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast.success('Link copied to clipboard!');
      }
    } catch (err) {
      if (err.name !== 'AbortError') {
        toast.error('Could not share property');
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0f0f0f]">
      {property && (
        <SEO 
          title={property.title} 
          description={property.description?.substring(0, 160) || `View details for ${property.title}`} 
          image={property.image_url} 
          schema={{
            "@context": "https://schema.org",
            "@type": "Product",
            "name": property.title,
            "image": property.image_url,
            "description": property.description,
            "offers": {
              "@type": "Offer",
              "url": window.location.href,
              "priceCurrency": "NPR",
              "price": property.price,
              "availability": property.status === 'for_sale' ? "https://schema.org/InStock" : "https://schema.org/OutOfStock"
            }
          }}
        />
      )}
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
        <button onClick={() => navigate('/dashboard')} className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors mb-6">
          <FiArrowLeft /> Back to properties
        </button>

        {loading ? (
          <div className="min-h-[60vh] flex items-center justify-center">
            <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : property ? (
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-8 items-start">
            {/* Left — Image Gallery */}
            <section>
              <div className="relative overflow-hidden rounded-2xl bg-slate-900 group">
                <img src={getOptimizedUrl(images[activeImg] || property.image_url, 1200)} alt={property.title} className="w-full h-[360px] sm:h-[480px] object-cover transition-transform duration-500"
                  onError={(e) => { e.target.src = 'https://placehold.co/1200x800?text=No+Image'; }} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

                {/* Status badge */}
                <span className={`absolute top-4 left-4 px-3 py-1.5 rounded-lg text-xs font-bold text-white uppercase tracking-wider ${STATUS_COLORS[property.status] || 'bg-emerald-500'}`}>
                  {STATUS_LABELS[property.status] || 'For Sale'}
                </span>

                {/* Image nav arrows */}
                {images.length > 1 && (
                  <>
                    <button onClick={prevImg} className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"><FiChevronLeft className="text-lg" /></button>
                    <button onClick={nextImg} className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"><FiChevronRight className="text-lg" /></button>
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
                      {images.map((_, i) => (
                        <button key={i} onClick={() => setActiveImg(i)} className={`w-2 h-2 rounded-full transition-all ${i === activeImg ? 'bg-white w-5' : 'bg-white/50'}`} />
                      ))}
                    </div>
                  </>
                )}

                {/* Image counter */}
                {images.length > 1 && (
                  <span className="absolute top-4 right-4 px-2.5 py-1 rounded-lg bg-black/50 text-white text-xs font-medium">{activeImg + 1}/{images.length}</span>
                )}
              </div>

              {/* Thumbnail row */}
              {images.length > 1 && (
                <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
                  {images.map((url, i) => (
                    <button key={i} onClick={() => setActiveImg(i)} className={`flex-shrink-0 w-20 h-14 rounded-lg overflow-hidden border-2 transition-all ${i === activeImg ? 'border-blue-500 ring-2 ring-blue-500/30' : 'border-transparent opacity-60 hover:opacity-100'}`}>
                      <img src={getOptimizedUrl(url, 400)} alt="" loading="lazy" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
              
              {property.latitude && property.longitude && (
                <div className="mt-8">
                  <h3 className="text-xl font-bold font-heading text-slate-900 dark:text-white mb-4">Location Map</h3>
                  <div className="h-[300px] sm:h-[400px]">
                    <MapComponent properties={[property]} singleMode={true} />
                  </div>
                </div>
              )}

              {/* EMI Calculator */}
              <EmiCalculator propertyPrice={property.price} />
            </section>

            {/* Right — Details */}
            <aside className="bg-white dark:bg-[#151515] rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 lg:sticky lg:top-24">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{TYPE_LABELS[property.property_type] || 'Property'}</span>
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-bold font-heading text-slate-900 dark:text-white leading-tight">{property.title}</h1>
                  <p className="text-slate-500 dark:text-slate-400 text-sm mt-1 flex items-center gap-1.5"><FaMapMarkerAlt className="text-blue-500 text-xs" /> {property.location}</p>
                </div>
                <div className="flex flex-col gap-2 shrink-0">
                  <button onClick={handleToggleFavourite} disabled={saving}
                    className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors flex items-center justify-center disabled:opacity-50" title="Favourite">
                    {saving ? <span className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                    : <FaHeart className={`text-lg ${property.isFavourite ? 'text-red-500' : 'text-slate-300'}`} />}
                  </button>
                  <button onClick={handleShare} className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors flex items-center justify-center text-slate-600 dark:text-slate-300" title="Share">
                    <FiShare2 className="text-lg" />
                  </button>
                </div>
              </div>

              {/* Price */}
              <div className="flex items-center gap-2 mb-6">
                <p className="text-3xl font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1"><FaRupeeSign className="text-xl" />{formatPrice(property.price)}</p>
              </div>

              {/* Specs grid */}
              {specs.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
                  {specs.map((s, i) => (
                    <div key={i} className="rounded-xl bg-slate-50 dark:bg-[#1a1a1a] border border-slate-200 dark:border-slate-800 p-3 text-center">
                      <s.icon className="text-xl text-blue-500 mx-auto mb-1" />
                      <p className="text-sm font-bold text-slate-900 dark:text-white">{s.value}</p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">{s.label}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Seller info */}
              {property.uploaded_by_name && (
                <div className="rounded-xl bg-slate-50 dark:bg-[#1a1a1a] border border-slate-200 dark:border-slate-800 p-4 mb-6 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-0.5">Listed by</p>
                    <p className="font-semibold text-slate-900 dark:text-white text-sm">{property.uploaded_by_name}</p>
                  </div>
                  {!!property.uploaded_by && (
                    <button onClick={() => navigate(`/dashboard/sellers/${property.uploaded_by}`)}
                      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white dark:bg-[#151515] border border-slate-200 dark:border-slate-700 text-xs font-semibold text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors">
                      <FiExternalLink className="text-sm" /> View Profile
                    </button>
                  )}
                </div>
              )}

              {/* Owner actions */}
              {isOwner ? (
                <div className="flex gap-2 mb-6">
                  <button onClick={handleOpenEdit} className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors">
                    <FiEdit2 /> Edit
                  </button>
                  <button onClick={() => setIsDeleteOpen(true)} className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-red-600 text-white text-sm font-semibold hover:bg-red-700 transition-colors">
                    <FiTrash2 /> Delete
                  </button>
                </div>
              ) : (
                <button onClick={() => { if (!user) { toast.error('Please login to contact seller'); navigate('/login'); } else { setIsContactOpen(true); } }} 
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 mb-6 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg shadow-blue-600/20">
                  <FiMessageCircle className="text-xl" /> Contact Seller
                </button>
              )}

              {/* Description */}
              <div className="mb-6">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-3">Description</h3>
                <p className={`text-slate-600 dark:text-slate-300 leading-7 text-sm whitespace-pre-line ${!isReadMore && property.description?.length > 150 ? 'line-clamp-4' : ''}`}>
                  {property.description || 'No description provided.'}
                </p>
                {property.description?.length > 150 && (
                  <button onClick={() => setIsReadMore(!isReadMore)} className="text-blue-600 dark:text-blue-400 text-sm font-medium mt-2 hover:underline">
                    {isReadMore ? 'Read less' : 'Read more'}
                  </button>
                )}
              </div>
            </aside>
          </motion.div>
        ) : null}

        <EditPropertyModal isOpen={isEditOpen} onClose={() => { if (!editing) { setIsEditOpen(false); setEditImageFiles([]); } }} form={editForm} onFormChange={handleEditFormChange} onImageChange={setEditImageFiles} onSubmit={handleSaveEdit} saving={editing} imageFiles={editImageFiles} />
        <ConfirmDialog isOpen={isDeleteOpen} title="Delete Property" message="Are you sure? This cannot be undone." confirmText="Delete" cancelText="Cancel" onConfirm={handleConfirmDelete} onCancel={() => { if (!deleting) setIsDeleteOpen(false); }} loading={deleting} />
        <ContactSellerModal isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} property={property} />
      </main>
    </div>
  );
};

export default PropertyDetailsPage;