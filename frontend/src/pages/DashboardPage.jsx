import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import { useAuth } from '../context/AuthContext';
import useDebounce from '../hooks/useDebounce';
import Navbar from '../components/Navbar';
import PropertyCard from '../components/PropertyCard';
import FilterSidebar from '../components/FilterSidebar';
import Pagination from '../components/Pagination';
import UploadPropertyModal from '../components/UploadPropertyModal';
import ConfirmDialog from '../components/ConfirmDialog';
import EditPropertyModal from '../components/EditPropertyModal';
import toast from 'react-hot-toast';
import { FiUploadCloud, FiSearch, FiFilter, FiGrid, FiList, FiX } from 'react-icons/fi';

const EMPTY_FORM = { title: '', location: '', price: '', description: '', propertyType: 'house', status: 'for_sale', bedrooms: '', bathrooms: '', areaSqft: '', parkingSpaces: '' };
const EMPTY_FILTERS = { type: '', status: '', minPrice: '', maxPrice: '', bedrooms: '', bathrooms: '', minArea: '', sort: 'newest' };

const DashboardPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // Search & filters from URL
  const [searchText, setSearchText] = useState(searchParams.get('q') || '');
  const debouncedSearch = useDebounce(searchText, 400);
  const [filters, setFilters] = useState(() => {
    const f = { ...EMPTY_FILTERS };
    for (const key of Object.keys(f)) { const v = searchParams.get(key); if (v) f[key] = v; }
    return f;
  });
  const [page, setPage] = useState(Number(searchParams.get('page')) || 1);

  // Data
  const [properties, setProperties] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, totalPages: 1 });
  const [myProperties, setMyProperties] = useState([]);
  const [favouriteIds, setFavouriteIds] = useState(new Set());

  // UI state
  const [activeTab, setActiveTab] = useState('all');
  const [viewMode, setViewMode] = useState('grid');
  const [loadingProps, setLoadingProps] = useState(true);
  const [toggleLoading, setToggleLoading] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);

  // Forms
  const [form, setForm] = useState({ ...EMPTY_FORM });
  const [imageFiles, setImageFiles] = useState([]);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingPropertyId, setEditingPropertyId] = useState(null);
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({ ...EMPTY_FORM });
  const [editImageFiles, setEditImageFiles] = useState([]);

  // Sync filters to URL
  useEffect(() => {
    const params = new URLSearchParams();
    if (debouncedSearch) params.set('q', debouncedSearch);
    Object.entries(filters).forEach(([k, v]) => { if (v && v !== EMPTY_FILTERS[k]) params.set(k, v); });
    if (page > 1) params.set('page', page);
    setSearchParams(params, { replace: true });
  }, [debouncedSearch, filters, page, setSearchParams]);

  // Fetch search results
  const fetchSearch = useCallback(async () => {
    setLoadingProps(true);
    try {
      const params = new URLSearchParams();
      if (debouncedSearch) params.set('q', debouncedSearch);
      Object.entries(filters).forEach(([k, v]) => { if (v) params.set(k, v); });
      params.set('page', page);
      params.set('limit', 12);

      const { data } = await axiosClient.get(`/search?${params.toString()}`);
      setProperties(data.properties || []);
      setPagination(data.pagination || { total: 0, totalPages: 1 });
    } catch { toast.error('Failed to load properties.'); }
    finally { setLoadingProps(false); }
  }, [debouncedSearch, filters, page]);

  // Fetch favourites & my properties
  const fetchSideData = useCallback(async () => {
    try {
      const [{ data: favData }, { data: mineData }] = await Promise.all([
        axiosClient.get('/favourites/properties'),
        axiosClient.get('/properties/my'),
      ]);
      const allProps = favData.properties || [];
      setFavouriteIds(new Set(allProps.filter(p => p.isFavourite).map(p => p.id)));
      setMyProperties(mineData.properties || []);
    } catch { /* silent */ }
  }, []);

  useEffect(() => { fetchSearch(); }, [fetchSearch]);
  useEffect(() => { fetchSideData(); }, [fetchSideData]);

  // Reset page when filters change
  useEffect(() => { setPage(1); }, [debouncedSearch, filters]);

  // Merge favourite status into search results
  const mergedProperties = properties.map(p => ({ ...p, isFavourite: favouriteIds.has(p.id) }));
  const displayed = activeTab === 'favourites'
    ? mergedProperties.filter(p => p.isFavourite)
    : activeTab === 'mine'
      ? myProperties.map(p => ({ ...p, isFavourite: favouriteIds.has(p.id) }))
      : mergedProperties;

  const favouriteCount = mergedProperties.filter(p => p.isFavourite).length;
  const myCount = myProperties.length;

  // Active filter chips
  const activeFilterChips = [];
  if (filters.type) filters.type.split(',').forEach(t => activeFilterChips.push({ key: 'type', value: t, label: t }));
  if (filters.status) activeFilterChips.push({ key: 'status', value: filters.status, label: filters.status.replace('_', ' ') });
  if (filters.minPrice) activeFilterChips.push({ key: 'minPrice', value: filters.minPrice, label: `Min ₨${Number(filters.minPrice).toLocaleString()}` });
  if (filters.maxPrice) activeFilterChips.push({ key: 'maxPrice', value: filters.maxPrice, label: `Max ₨${Number(filters.maxPrice).toLocaleString()}` });
  if (filters.bedrooms) activeFilterChips.push({ key: 'bedrooms', value: filters.bedrooms, label: `${filters.bedrooms}+ Beds` });
  if (filters.bathrooms) activeFilterChips.push({ key: 'bathrooms', value: filters.bathrooms, label: `${filters.bathrooms}+ Baths` });

  const removeChip = (chip) => {
    if (chip.key === 'type') {
      const cur = filters.type.split(',').filter(t => t !== chip.value);
      setFilters(f => ({ ...f, type: cur.join(',') }));
    } else {
      setFilters(f => ({ ...f, [chip.key]: '' }));
    }
  };

  const clearFilters = () => { setFilters({ ...EMPTY_FILTERS }); setSearchText(''); };

  // Handlers
  const handleFormChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  const handleEditFormChange = (e) => setEditForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  const openPropertyDetails = (property) => navigate(`/dashboard/properties/${property.id}`, { state: { property } });

  const handleUploadProperty = async (e) => {
    e.preventDefault();
    if (!form.title || !form.location || !form.price) { toast.error('Title, location and price are required'); return; }
    if (!imageFiles || imageFiles.length === 0) { toast.error('Please upload at least one image'); return; }
    const payload = new FormData();
    Object.keys(form).forEach(k => { if (form[k] !== '') payload.append(k, typeof form[k] === 'string' ? form[k].trim() : form[k]); });
    imageFiles.forEach(f => payload.append('images', f));
    setUploading(true);
    const tid = toast.loading('Uploading property...');
    try {
      await axiosClient.post('/properties', payload, { headers: { 'Content-Type': 'multipart/form-data' } });
      setForm({ ...EMPTY_FORM }); setImageFiles([]); setIsUploadOpen(false);
      await Promise.all([fetchSearch(), fetchSideData()]);
      toast.success('Property uploaded successfully', { id: tid });
    } catch (err) { toast.error(err.response?.data?.message || 'Could not upload', { id: tid }); }
    finally { setUploading(false); }
  };

  const handleToggleFavourite = async (propertyId, isFav) => {
    setToggleLoading(propertyId);
    const tid = toast.loading(isFav ? 'Removing...' : 'Adding...');
    try {
      if (isFav) { await axiosClient.delete(`/favourites/${propertyId}`); toast.success('Removed', { id: tid }); }
      else { await axiosClient.post('/favourites', { propertyId }); toast.success('Added ♥', { id: tid }); }
      setFavouriteIds(prev => { const s = new Set(prev); isFav ? s.delete(propertyId) : s.add(propertyId); return s; });
    } catch (err) { toast.error(err.response?.data?.message || 'Error', { id: tid }); }
    finally { setToggleLoading(null); }
  };

  const handleRequestDelete = (id) => setPendingDeleteId(id);
  const handleConfirmDelete = async () => {
    if (!pendingDeleteId) return;
    setDeleteLoading(pendingDeleteId);
    const tid = toast.loading('Deleting...');
    try {
      await axiosClient.delete(`/properties/${pendingDeleteId}`);
      toast.success('Deleted', { id: tid }); setPendingDeleteId(null);
      await Promise.all([fetchSearch(), fetchSideData()]);
    } catch (err) { toast.error(err.response?.data?.message || 'Error', { id: tid }); }
    finally { setDeleteLoading(null); }
  };

  const handleOpenEdit = (property) => {
    setEditingPropertyId(property.id); setEditImageFiles([]);
    setEditForm({ title: property.title || '', location: property.location || '', price: property.price ?? '', description: property.description || '', propertyType: property.property_type || 'house', status: property.status || 'for_sale', bedrooms: property.bedrooms || '', bathrooms: property.bathrooms || '', areaSqft: property.area_sqft || '', parkingSpaces: property.parking_spaces || '' });
    setIsEditOpen(true);
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!editingPropertyId) return;
    if (!editForm.title || !editForm.location || !editForm.price) { toast.error('Title, location and price are required'); return; }
    setEditing(true);
    const tid = toast.loading('Updating...');
    try {
      const payload = new FormData();
      Object.keys(editForm).forEach(k => { if (editForm[k] !== '') payload.append(k, typeof editForm[k] === 'string' ? editForm[k].trim() : editForm[k]); });
      if (editImageFiles.length > 0) editImageFiles.forEach(f => payload.append('images', f));
      await axiosClient.put(`/properties/${editingPropertyId}`, payload, { headers: { 'Content-Type': 'multipart/form-data' } });
      setIsEditOpen(false); setEditingPropertyId(null); setEditImageFiles([]);
      toast.success('Updated', { id: tid });
      await Promise.all([fetchSearch(), fetchSideData()]);
    } catch (err) { toast.error(err.response?.data?.message || 'Error', { id: tid }); }
    finally { setEditing(false); }
  };

  // Skeleton loader
  const SkeletonCard = () => (
    <div className="bg-white dark:bg-[#151515] rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-pulse">
      <div className="w-full h-52 bg-slate-200 dark:bg-slate-800" />
      <div className="p-4 space-y-3">
        <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-1/3" />
        <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-3/4" />
        <div className="flex gap-3"><div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-12" /><div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-12" /></div>
        <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/2 mt-2" />
      </div>
    </div>
  );

  const gridCols = viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5' : 'grid grid-cols-1 gap-4';

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0f0f0f]">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Hero */}
        <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 dark:from-[#121212] dark:via-[#171717] dark:to-[#121212] rounded-3xl px-6 sm:px-8 py-7 mb-8 text-white flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between border border-slate-800">
          <div>
            <p className="text-blue-300 text-sm uppercase tracking-[0.24em] font-semibold mb-2">Property Dashboard</p>
            <h2 className="text-2xl md:text-3xl font-bold font-heading mb-2">Welcome back, {user?.name}</h2>
            <p className="text-slate-300 text-sm max-w-2xl">Search, filter, and discover properties. Manage your listings and favourites.</p>
          </div>
          <div className="grid grid-cols-3 gap-3 sm:min-w-[340px]">
            <div className="rounded-2xl bg-white/10 border border-white/10 px-4 py-3 text-center">
              <p className="text-2xl font-bold">{pagination.total}</p><p className="text-slate-300 text-xs">Available</p>
            </div>
            <div className="rounded-2xl bg-white/10 border border-white/10 px-4 py-3 text-center">
              <p className="text-2xl font-bold">{favouriteIds.size}</p><p className="text-slate-300 text-xs">Favourites</p>
            </div>
            <div className="rounded-2xl bg-white/10 border border-white/10 px-4 py-3 text-center">
              <p className="text-2xl font-bold">{myCount}</p><p className="text-slate-300 text-xs">My Listings</p>
            </div>
          </div>
        </div>

        {/* Search bar + controls */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-5">
          <div className="relative flex-1">
            <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input type="text" placeholder="Search by title, location..." value={searchText} onChange={(e) => setSearchText(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#151515] text-slate-800 dark:text-slate-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            {searchText && <button onClick={() => setSearchText('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"><FiX /></button>}
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setFilterOpen(true)} className="lg:hidden inline-flex items-center gap-2 px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#151515] text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800">
              <FiFilter /> Filters
            </button>
            <div className="hidden sm:flex items-center border border-slate-300 dark:border-slate-700 rounded-xl overflow-hidden">
              <button onClick={() => setViewMode('grid')} className={`p-2.5 ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'bg-white dark:bg-[#151515] text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800'}`}><FiGrid /></button>
              <button onClick={() => setViewMode('list')} className={`p-2.5 ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'bg-white dark:bg-[#151515] text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800'}`}><FiList /></button>
            </div>
            <button onClick={() => setIsUploadOpen(true)} className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20">
              <FiUploadCloud /> Upload
            </button>
          </div>
        </div>

        {/* Active filter chips */}
        {activeFilterChips.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 mb-5">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Active filters:</span>
            {activeFilterChips.map((c, i) => (
              <button key={i} onClick={() => removeChip(c)} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-xs font-medium hover:bg-blue-200 dark:hover:bg-blue-900/60">
                {c.label} <FiX className="text-[10px]" />
              </button>
            ))}
            <button onClick={clearFilters} className="text-xs text-red-500 hover:underline ml-1">Clear all</button>
          </div>
        )}

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {[
            { key: 'all', label: `All (${pagination.total})` },
            { key: 'favourites', label: `Favourites (${favouriteIds.size})` },
            { key: 'mine', label: `My Properties (${myCount})` },
          ].map(tab => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)}
              className={`px-5 py-2 rounded-xl text-sm font-medium transition-colors ${activeTab === tab.key ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20' : 'bg-white dark:bg-[#151515] text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'}`}>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Results count */}
        {activeTab === 'all' && !loadingProps && (
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
            Showing {displayed.length} of {pagination.total} properties
          </p>
        )}

        {/* Main content with sidebar */}
        <div className="flex gap-6">
          <FilterSidebar filters={filters} onChange={setFilters} onClear={clearFilters} isOpen={filterOpen} onClose={() => setFilterOpen(false)} />

          <div className="flex-1 min-w-0">
            {loadingProps ? (
              <div className={gridCols}>{Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}</div>
            ) : displayed.length === 0 ? (
              <div className="text-center py-20 text-slate-400 dark:text-slate-500">
                <p className="text-5xl mb-4">🏠</p>
                <p className="text-lg font-medium">No properties found</p>
                <p className="text-sm mt-1">{activeTab === 'all' ? 'Try adjusting your search or filters' : activeTab === 'favourites' ? 'Heart a property to save it here' : 'Upload your first listing'}</p>
                {activeTab === 'all' && activeFilterChips.length > 0 && (
                  <button onClick={clearFilters} className="mt-4 px-4 py-2 rounded-xl bg-blue-600 text-white text-sm font-medium hover:bg-blue-700">Clear Filters</button>
                )}
              </div>
            ) : (
              <div className={gridCols}>
                {displayed.map(property => (
                  <PropertyCard key={property.id} property={property} onOpen={openPropertyDetails} onToggleFavourite={handleToggleFavourite} loading={toggleLoading}
                    canDelete={Number(property.uploaded_by) === Number(user?.id)} canEdit={Number(property.uploaded_by) === Number(user?.id)}
                    onEdit={handleOpenEdit} onDelete={handleRequestDelete} deleting={deleteLoading} />
                ))}
              </div>
            )}
            {activeTab === 'all' && <Pagination page={page} totalPages={pagination.totalPages} onPageChange={setPage} />}
          </div>
        </div>

        <UploadPropertyModal isOpen={isUploadOpen} onClose={() => { if (!uploading) setIsUploadOpen(false); }} form={form} onFormChange={handleFormChange} onImageChange={setImageFiles} onSubmit={handleUploadProperty} uploading={uploading} imageFiles={imageFiles} />
        <ConfirmDialog isOpen={Boolean(pendingDeleteId)} title="Delete Property" message="Are you sure? This cannot be undone." confirmText="Delete" cancelText="Cancel" onConfirm={handleConfirmDelete} onCancel={() => { if (!deleteLoading) setPendingDeleteId(null); }} loading={deleteLoading === pendingDeleteId} />
        <EditPropertyModal isOpen={isEditOpen} onClose={() => { if (!editing) { setIsEditOpen(false); setEditingPropertyId(null); setEditImageFiles([]); } }} form={editForm} onFormChange={handleEditFormChange} onImageChange={setEditImageFiles} onSubmit={handleSaveEdit} saving={editing} imageFiles={editImageFiles} />
      </main>
    </div>
  );
};

export default DashboardPage;