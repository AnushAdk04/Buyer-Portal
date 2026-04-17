import { FiEdit2, FiX } from 'react-icons/fi';

const EditPropertyModal = ({
  isOpen,
  onClose,
  form,
  onFormChange,
  onImageChange,
  onSubmit,
  saving,
  imageFile,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[85] bg-black/65 flex items-center justify-center px-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0f0f0f] p-5 sm:p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Edit Property</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">Update your listing details.</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-10 h-10 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center justify-center"
            aria-label="Close edit dialog"
          >
            <FiX className="text-lg" />
          </button>
        </div>

        <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            name="title"
            value={form.title}
            onChange={onFormChange}
            placeholder="Property title"
            className="w-full px-4 py-2.5 border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0f0f0f] text-slate-800 dark:text-slate-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <input
            name="location"
            value={form.location}
            onChange={onFormChange}
            placeholder="Location"
            className="w-full px-4 py-2.5 border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0f0f0f] text-slate-800 dark:text-slate-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <input
            name="price"
            type="number"
            min="1"
            value={form.price}
            onChange={onFormChange}
            placeholder="Price (NPR)"
            className="w-full px-4 py-2.5 border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0f0f0f] text-slate-800 dark:text-slate-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />

          <div className="space-y-2">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => onImageChange?.(e.target.files?.[0] || null)}
              className="w-full px-4 py-2.5 border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0f0f0f] text-slate-600 dark:text-slate-300 rounded-xl text-sm file:mr-3 file:border-0 file:bg-blue-50 file:text-blue-700 file:px-3 file:py-1.5 file:rounded-lg"
            />
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {imageFile ? `New image: ${imageFile.name}` : 'Leave blank to keep existing image'}
            </p>
          </div>

          <div className="md:col-span-2">
            <textarea
              name="description"
              value={form.description}
              onChange={onFormChange}
              placeholder="Description (optional)"
              rows={3}
              className="w-full px-4 py-2.5 border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0f0f0f] text-slate-800 dark:text-slate-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>

          <div className="md:col-span-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0f0f0f] text-slate-700 dark:text-slate-200 text-sm font-medium hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors disabled:opacity-60"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors disabled:opacity-60"
            >
              {saving ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <FiEdit2 className="text-base" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditPropertyModal;
