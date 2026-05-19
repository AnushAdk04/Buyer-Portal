import { FiUploadCloud, FiX } from 'react-icons/fi';
import LocationSelector from './LocationSelector';

const UploadPropertyModal = ({
  isOpen,
  onClose,
  form,
  onFormChange,
  onImageChange,
  onSubmit,
  uploading,
  imageFiles,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[80] bg-black/65 flex items-start justify-center px-4 overflow-y-auto py-10"
      onClick={onClose}
    >
      <div
        className="w-full max-w-3xl rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0f0f0f] p-5 sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">Upload Property</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Add comprehensive details for your new listing.</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-10 h-10 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center justify-center"
            aria-label="Close upload dialog"
          >
            <FiX className="text-lg" />
          </button>
        </div>

        <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Basic Info */}
          <div className="md:col-span-2 text-sm font-semibold text-slate-900 dark:text-white uppercase tracking-wider">Basic Information</div>
          <input
            name="title"
            value={form.title}
            onChange={onFormChange}
            placeholder="Property title (e.g. Modern Villa in Kathmandu)"
            className="md:col-span-2 w-full px-4 py-3 border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-[#141414] text-slate-800 dark:text-slate-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <input
            name="location"
            value={form.location}
            onChange={onFormChange}
            placeholder="Location (e.g. Baneshwor, Kathmandu)"
            className="w-full px-4 py-3 border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-[#141414] text-slate-800 dark:text-slate-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <input
            name="price"
            type="number"
            min="1"
            value={form.price}
            onChange={onFormChange}
            placeholder="Price (NPR)"
            className="w-full px-4 py-3 border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-[#141414] text-slate-800 dark:text-slate-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />

          <select
            name="propertyType"
            value={form.propertyType}
            onChange={onFormChange}
            className="w-full px-4 py-3 border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-[#141414] text-slate-800 dark:text-slate-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="house">House</option>
            <option value="apartment">Apartment</option>
            <option value="land">Land</option>
            <option value="commercial">Commercial</option>
            <option value="villa">Villa</option>
            <option value="condo">Condo</option>
          </select>
          <select
            name="status"
            value={form.status}
            onChange={onFormChange}
            className="w-full px-4 py-3 border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-[#141414] text-slate-800 dark:text-slate-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="for_sale">For Sale</option>
            <option value="for_rent">For Rent</option>
          </select>

          {/* Details */}
          <div className="md:col-span-2 text-sm font-semibold text-slate-900 dark:text-white uppercase tracking-wider mt-4">Property Details</div>
          
          <input
            name="bedrooms"
            type="number"
            min="0"
            value={form.bedrooms}
            onChange={onFormChange}
            placeholder="Bedrooms"
            className="w-full px-4 py-3 border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-[#141414] text-slate-800 dark:text-slate-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            name="bathrooms"
            type="number"
            min="0"
            value={form.bathrooms}
            onChange={onFormChange}
            placeholder="Bathrooms"
            className="w-full px-4 py-3 border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-[#141414] text-slate-800 dark:text-slate-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            name="areaSqft"
            type="number"
            min="0"
            value={form.areaSqft}
            onChange={onFormChange}
            placeholder="Area (SqFt)"
            className="w-full px-4 py-3 border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-[#141414] text-slate-800 dark:text-slate-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            name="parkingSpaces"
            type="number"
            min="0"
            value={form.parkingSpaces}
            onChange={onFormChange}
            placeholder="Parking Spaces"
            className="w-full px-4 py-3 border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-[#141414] text-slate-800 dark:text-slate-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <textarea
            name="description"
            value={form.description}
            onChange={onFormChange}
            placeholder="Detailed description..."
            rows={4}
            className="md:col-span-2 w-full px-4 py-3 border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-[#141414] text-slate-800 dark:text-slate-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />

          <div className="md:col-span-2 mt-2">
            <div className="text-sm font-semibold text-slate-900 dark:text-white uppercase tracking-wider mb-2">Map Location</div>
            <LocationSelector 
              lat={form.latitude} 
              lng={form.longitude} 
              onLocationSelect={({ lat, lng }) => {
                onFormChange({ target: { name: 'latitude', value: lat } });
                onFormChange({ target: { name: 'longitude', value: lng } });
              }} 
            />
          </div>

          <div className="md:col-span-2 space-y-2 mt-4">
            <div className="text-sm font-semibold text-slate-900 dark:text-white uppercase tracking-wider mb-2">Images (Max 10)</div>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => onImageChange(Array.from(e.target.files))}
              className="w-full px-4 py-3 border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-[#141414] text-slate-600 dark:text-slate-300 rounded-xl text-sm file:mr-3 file:border-0 file:bg-blue-600 file:text-white file:px-4 file:py-2 file:rounded-lg file:cursor-pointer hover:file:bg-blue-700 transition-colors"
              required
            />
            {imageFiles && imageFiles.length > 0 && (
              <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">Selected {imageFiles.length} image(s)</p>
            )}
          </div>

          <div className="md:col-span-2 flex justify-end gap-3 mt-6 border-t border-slate-100 dark:border-slate-800 pt-6">
            <button
              type="button"
              onClick={onClose}
              disabled={uploading}
              className="px-6 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0f0f0f] text-slate-700 dark:text-slate-200 text-sm font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors disabled:opacity-60"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={uploading}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 transition-colors disabled:opacity-60 shadow-lg shadow-blue-600/30"
            >
              {uploading ? (
                <>
                  <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <FiUploadCloud className="text-lg" />
                  Publish Property
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UploadPropertyModal;
