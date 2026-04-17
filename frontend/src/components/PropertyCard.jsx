import { FaHeart, FaMapMarkerAlt, FaArrowRight, FaRupeeSign } from 'react-icons/fa';
import { FiTrash2, FiEdit2 } from 'react-icons/fi';

const PropertyCard = ({
  property,
  onOpen,
  onToggleFavourite,
  loading,
  canDelete,
  canEdit,
  onEdit,
  onDelete,
  deleting,
}) => {
  const formatPrice = (price) =>
    new Intl.NumberFormat('en-NP', { style: 'currency', currency: 'NPR', maximumFractionDigits: 0 }).format(price);

  return (
    <article
      role="button"
      tabIndex={0}
      onClick={() => onOpen?.(property)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onOpen?.(property);
        }
      }}
      className="group bg-white dark:bg-[#0f0f0f] rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden transition-all duration-300 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-[#0f0f0f]"
    >
      <div className="relative overflow-hidden">
        <img
          src={property.image_url}
          alt={property.title}
          className="w-full h-52 object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => { e.target.src = 'https://placehold.co/400x200?text=No+Image'; }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/45 via-transparent to-transparent" />
        <div className="absolute left-4 bottom-4 inline-flex items-center gap-2 rounded-full bg-white dark:bg-[#0f0f0f] px-3 py-1.5 text-xs font-semibold text-slate-800 dark:text-slate-200">
          <FaMapMarkerAlt className="text-blue-600" />
          {property.location || 'Location unavailable'}
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavourite(property.id, property.isFavourite);
          }}
          disabled={loading === property.id}
          className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white dark:bg-[#0f0f0f] flex items-center justify-center hover:scale-110 transition-transform disabled:opacity-50"
        >
          {loading === property.id ? (
            <span className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          ) : (
            <FaHeart className={property.isFavourite ? 'text-red-500 text-lg' : 'text-slate-300 text-lg'} />
          )}
        </button>

        {canDelete && (
          <div className="absolute top-4 left-4 flex flex-col gap-2">
            {canEdit && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit?.(property);
                }}
                className="h-10 px-3 rounded-full bg-white dark:bg-[#0f0f0f] flex items-center gap-2 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-200/40 transition-colors"
              >
                <FiEdit2 className="text-sm" />
                <span className="text-xs font-semibold">Edit</span>
              </button>
            )}

            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete?.(property.id);
              }}
              disabled={deleting === property.id}
                className="h-10 px-3 rounded-full bg-white dark:bg-[#0f0f0f] flex items-center gap-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-200/40 transition-colors disabled:opacity-50"
            >
              {deleting === property.id ? (
                <span className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
              ) : (
                <FiTrash2 className="text-sm" />
              )}
              <span className="text-xs font-semibold">Delete</span>
            </button>
          </div>
        )}
      </div>

      <div className="p-5 space-y-3">
        <div>
          <h3 className="font-semibold text-slate-900 dark:text-slate-100 text-lg leading-snug mb-1 group-hover:text-blue-700 transition-colors">{property.title}</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-1 flex items-center gap-2">
            <FaMapMarkerAlt className="text-blue-500 shrink-0" />
            {property.location}
          </p>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
          <p className="flex items-center gap-1 text-blue-700 font-bold text-base">
            <FaRupeeSign className="text-sm" />
            {formatPrice(property.price)}
          </p>
          <span className="inline-flex items-center gap-1 leading-none text-sm font-medium text-slate-500 dark:text-slate-400 group-hover:text-blue-600 transition-colors">
            Details
            <FaArrowRight className="text-sm leading-none" />
          </span>
        </div>
      </div>
    </article>
  );
};

export default PropertyCard;