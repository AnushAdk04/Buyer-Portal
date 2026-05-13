import { FaHeart, FaMapMarkerAlt, FaArrowRight, FaRupeeSign } from 'react-icons/fa';
import { FiTrash2, FiEdit2 } from 'react-icons/fi';
import { IoBedOutline, IoWaterOutline } from 'react-icons/io5';
import { TbRulerMeasure } from 'react-icons/tb';

const TYPE_LABELS = {
  house: 'House',
  apartment: 'Apartment',
  land: 'Land',
  commercial: 'Commercial',
  villa: 'Villa',
  condo: 'Condo',
};

const STATUS_COLORS = {
  for_sale: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400',
  for_rent: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400',
  sold: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400',
  under_contract: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400',
};

const STATUS_LABELS = {
  for_sale: 'For Sale',
  for_rent: 'For Rent',
  sold: 'Sold',
  under_contract: 'Under Contract',
};

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

  const statusKey = property.status || 'for_sale';
  const typeLabel = TYPE_LABELS[property.property_type] || 'Property';

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
      className="group bg-white dark:bg-[#151515] rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden transition-all duration-300 cursor-pointer hover:shadow-xl hover:shadow-slate-200/50 dark:hover:shadow-black/30 hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-[#0f0f0f]"
    >
      <div className="relative overflow-hidden">
        <img
          src={property.image_url}
          alt={property.title}
          className="w-full h-52 object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => { e.target.src = 'https://placehold.co/400x200?text=No+Image'; }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/50 via-transparent to-transparent" />

        {/* Status badge */}
        <span className={`absolute top-3 left-3 inline-flex items-center px-2.5 py-1 rounded-lg text-[11px] font-bold uppercase tracking-wide ${STATUS_COLORS[statusKey]}`}>
          {STATUS_LABELS[statusKey]}
        </span>

        {/* Type pill on image */}
        <div className="absolute left-3 bottom-3 inline-flex items-center gap-1.5 rounded-full bg-white/90 dark:bg-black/70 backdrop-blur-sm px-2.5 py-1 text-xs font-semibold text-slate-700 dark:text-slate-200">
          <FaMapMarkerAlt className="text-blue-600 text-[10px]" />
          {property.location || 'Location unavailable'}
        </div>

        {/* Favourite button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavourite(property.id, property.isFavourite);
          }}
          disabled={loading === property.id}
          className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 dark:bg-black/70 backdrop-blur-sm flex items-center justify-center hover:scale-110 transition-transform disabled:opacity-50"
        >
          {loading === property.id ? (
            <span className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          ) : (
            <FaHeart className={property.isFavourite ? 'text-red-500 text-base' : 'text-slate-300 text-base'} />
          )}
        </button>

        {/* Edit / Delete */}
        {canDelete && (
          <div className="absolute top-3 left-[calc(100%-3rem-4.5rem)] flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
            {canEdit && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit?.(property);
                }}
                className="h-8 w-8 rounded-full bg-white/90 dark:bg-black/70 backdrop-blur-sm flex items-center justify-center text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors"
              >
                <FiEdit2 className="text-sm" />
              </button>
            )}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete?.(property.id);
              }}
              disabled={deleting === property.id}
              className="h-8 w-8 rounded-full bg-white/90 dark:bg-black/70 backdrop-blur-sm flex items-center justify-center text-red-600 hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors disabled:opacity-50"
            >
              {deleting === property.id ? (
                <span className="w-3.5 h-3.5 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
              ) : (
                <FiTrash2 className="text-sm" />
              )}
            </button>
          </div>
        )}
      </div>

      <div className="p-4 space-y-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{typeLabel}</span>
          </div>
          <h3 className="font-semibold text-slate-900 dark:text-slate-100 text-[15px] leading-snug line-clamp-1 group-hover:text-blue-600 transition-colors">{property.title}</h3>
        </div>

        {/* Specs row */}
        {(property.bedrooms > 0 || property.bathrooms > 0 || property.area_sqft > 0) && (
          <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
            {property.bedrooms > 0 && (
              <span className="inline-flex items-center gap-1">
                <IoBedOutline className="text-sm" />
                {property.bedrooms} Bed{property.bedrooms > 1 ? 's' : ''}
              </span>
            )}
            {property.bathrooms > 0 && (
              <span className="inline-flex items-center gap-1">
                <IoWaterOutline className="text-sm" />
                {property.bathrooms} Bath{property.bathrooms > 1 ? 's' : ''}
              </span>
            )}
            {property.area_sqft > 0 && (
              <span className="inline-flex items-center gap-1">
                <TbRulerMeasure className="text-sm" />
                {Number(property.area_sqft).toLocaleString()} sqft
              </span>
            )}
          </div>
        )}

        <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
          <p className="flex items-center gap-1 text-blue-700 dark:text-blue-400 font-bold text-sm">
            <FaRupeeSign className="text-xs" />
            {formatPrice(property.price)}
          </p>
          <span className="inline-flex items-center gap-1 leading-none text-xs font-medium text-slate-400 group-hover:text-blue-600 transition-colors">
            Details
            <FaArrowRight className="text-[10px]" />
          </span>
        </div>
      </div>
    </article>
  );
};

export default PropertyCard;