import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import PropertyCard from '../components/PropertyCard';
import UploadPropertyModal from '../components/UploadPropertyModal';
import ConfirmDialog from '../components/ConfirmDialog';
import EditPropertyModal from '../components/EditPropertyModal';
import toast from 'react-hot-toast';
import { FiUploadCloud } from 'react-icons/fi';

const DashboardPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const [myProperties, setMyProperties] = useState([]);
  const [activeTab, setActiveTab] = useState('all');
  const [loadingProps, setLoadingProps] = useState(true);
  const [toggleLoading, setToggleLoading] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({ title: '', location: '', price: '', description: '' });
  const [imageFile, setImageFile] = useState(null);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingPropertyId, setEditingPropertyId] = useState(null);
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({ title: '', location: '', price: '', description: '' });
  const [editImageFile, setEditImageFile] = useState(null);

  const fetchProperties = useCallback(async (showLoader = true) => {
    if (showLoader) setLoadingProps(true);

    try {
      const [{ data: allData }, { data: mineData }] = await Promise.all([
        axiosClient.get('/favourites/properties'),
        axiosClient.get('/properties/my'),
      ]);

      const allProperties = allData.properties || [];
      const favIds = new Set(allProperties.filter((p) => p.isFavourite).map((p) => p.id));

      setProperties(allProperties);
      setMyProperties((mineData.properties || []).map((property) => ({
        ...property,
        isFavourite: favIds.has(property.id),
      })));
    } catch {
      toast.error('Failed to load properties. Please refresh.');
    } finally {
      if (showLoader) setLoadingProps(false);
    }
  }, []);

  useEffect(() => { fetchProperties(true); }, [fetchProperties]);

  const handleFormChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleEditFormChange = (e) => {
    setEditForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleUploadProperty = async (e) => {
    e.preventDefault();

    if (!form.title || !form.location || !form.price) {
      toast.error('Title, location and price are required');
      return;
    }

    if (!imageFile) {
      toast.error('Please upload a property image');
      return;
    }

    const payload = new FormData();
    payload.append('title', form.title.trim());
    payload.append('location', form.location.trim());
    payload.append('price', form.price);
    payload.append('description', form.description.trim());
    payload.append('image', imageFile);

    setUploading(true);
    const toastId = toast.loading('Uploading property...');

    try {
      await axiosClient.post('/properties', payload, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setForm({ title: '', location: '', price: '', description: '' });
      setImageFile(null);
      setIsUploadOpen(false);
      await fetchProperties(false);
      toast.success('Property uploaded successfully', { id: toastId });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not upload property', { id: toastId });
    } finally {
      setUploading(false);
    }
  };

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
      setMyProperties(prev =>
        prev.map(p => p.id === propertyId ? { ...p, isFavourite: !isFav } : p)
      );
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong', { id: toastId });
    } finally {
      setToggleLoading(null);
    }
  };

  const handleRequestDelete = (propertyId) => {
    setPendingDeleteId(propertyId);
  };

  const handleOpenEdit = (property) => {
    setEditingPropertyId(property.id);
    setEditImageFile(null);
    setEditForm({
      title: property.title || '',
      location: property.location || '',
      price: property.price ?? '',
      description: property.description || '',
    });
    setIsEditOpen(true);
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();

    if (!editingPropertyId) return;

    if (!editForm.title || !editForm.location || !editForm.price) {
      toast.error('Title, location and price are required');
      return;
    }

    setEditing(true);
    const toastId = toast.loading('Updating property...');

    try {
      const payload = new FormData();
      payload.append('title', editForm.title.trim());
      payload.append('location', editForm.location.trim());
      payload.append('price', String(Number(editForm.price)));
      payload.append('description', editForm.description.trim());
      if (editImageFile) {
        payload.append('image', editImageFile);
      }

      const { data } = await axiosClient.put(`/properties/${editingPropertyId}`, payload, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const updated = data.property;

      setProperties((prev) => prev.map((property) => (
        property.id === updated.id
          ? { ...property, ...updated, isFavourite: property.isFavourite }
          : property
      )));

      setMyProperties((prev) => prev.map((property) => (
        property.id === updated.id
          ? { ...property, ...updated, isFavourite: property.isFavourite }
          : property
      )));

      setIsEditOpen(false);
      setEditingPropertyId(null);
      setEditImageFile(null);
      toast.success('Property updated successfully', { id: toastId });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not update property', { id: toastId });
    } finally {
      setEditing(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!pendingDeleteId) return;

    setDeleteLoading(pendingDeleteId);
    const toastId = toast.loading('Deleting property...');

    try {
      await axiosClient.delete(`/properties/${pendingDeleteId}`);
      setProperties((prev) => prev.filter((property) => property.id !== pendingDeleteId));
      setMyProperties((prev) => prev.filter((property) => property.id !== pendingDeleteId));
      toast.success('Property deleted successfully', { id: toastId });
      setPendingDeleteId(null);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not delete property', { id: toastId });
    } finally {
      setDeleteLoading(null);
    }
  };

  const displayed = activeTab === 'favourites'
    ? properties.filter(p => p.isFavourite)
    : activeTab === 'mine'
      ? myProperties
      : properties;

  const favouriteCount = properties.filter(p => p.isFavourite).length;
  const myCount = myProperties.length;

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
          <div className="grid grid-cols-3 gap-3 sm:min-w-[360px]">
            <div className="rounded-2xl bg-white/10 border border-white/10 px-4 py-3 backdrop-blur-sm">
              <p className="text-2xl font-semibold">{properties.length}</p>
              <p className="text-slate-300 text-sm">Available</p>
            </div>
            <div className="rounded-2xl bg-white/10 border border-white/10 px-4 py-3 backdrop-blur-sm">
              <p className="text-2xl font-semibold">{favouriteCount}</p>
              <p className="text-slate-300 text-sm">Favourites</p>
            </div>
            <div className="rounded-2xl bg-white/10 border border-white/10 px-4 py-3 backdrop-blur-sm">
              <p className="text-2xl font-semibold">{myCount}</p>
              <p className="text-slate-300 text-sm">Your Properties</p>
            </div>
          </div>
        </div>

        <div className="flex justify-end mb-6">
          <button
            type="button"
            onClick={() => setIsUploadOpen(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors"
          >
            <FiUploadCloud className="text-base" />
            Upload Property
          </button>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
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
          <button
            onClick={() => setActiveTab('mine')}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition-colors
              ${activeTab === 'mine' ? 'bg-blue-600 text-white' : 'bg-white dark:bg-slate-900 text-gray-600 dark:text-slate-300 border border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-800'}`}
          >
            My Properties ({myCount})
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
              {activeTab === 'favourites'
                ? 'Click the heart on any property to save it'
                : activeTab === 'mine'
                  ? 'Upload your first listing from the form above'
                  : 'No properties available'}
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
                canDelete={Number(property.uploaded_by) === Number(user?.id)}
                canEdit={Number(property.uploaded_by) === Number(user?.id)}
                onEdit={handleOpenEdit}
                onDelete={handleRequestDelete}
                deleting={deleteLoading}
              />
            ))}
          </div>
        )}

        <UploadPropertyModal
          isOpen={isUploadOpen}
          onClose={() => {
            if (!uploading) setIsUploadOpen(false);
          }}
          form={form}
          onFormChange={handleFormChange}
          onImageChange={setImageFile}
          onSubmit={handleUploadProperty}
          uploading={uploading}
          imageFile={imageFile}
        />

        <ConfirmDialog
          isOpen={Boolean(pendingDeleteId)}
          title="Delete Property"
          message="Are you sure you want to delete this property? This action cannot be undone."
          confirmText="Delete"
          cancelText="Cancel"
          onConfirm={handleConfirmDelete}
          onCancel={() => {
            if (!deleteLoading) setPendingDeleteId(null);
          }}
          loading={deleteLoading === pendingDeleteId}
        />

        <EditPropertyModal
          isOpen={isEditOpen}
          onClose={() => {
            if (!editing) {
              setIsEditOpen(false);
              setEditingPropertyId(null);
              setEditImageFile(null);
            }
          }}
          form={editForm}
          onFormChange={handleEditFormChange}
          onImageChange={setEditImageFile}
          onSubmit={handleSaveEdit}
          saving={editing}
          imageFile={editImageFile}
        />
      </main>
    </div>
  );
};

export default DashboardPage;