import { FaHeart, FaMapMarkerAlt, FaArrowRight, FaRupeeSign, FaEye } from 'react-icons/fa';
import { FiTrash2, FiEdit2, FiMessageCircle } from 'react-icons/fi';
import { IoBedOutline, IoWaterOutline } from 'react-icons/io5';
import { TbRulerMeasure } from 'react-icons/tb';
import { useCompare } from '../context/CompareContext';

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
  onFeature,
  isFeatureLoading,
}) => {
  const { compareItems, toggleCompare } = useCompare();
  const formatPrice = (price) =>
    new Intl.NumberFormat('en-NP', { style: 'currency', currency: 'NPR', maximumFractionDigits: 0 }).format(price);

  const getOptimizedUrl = (url) => {
    if (!url || !url.includes('cloudinary.com')) return url;
    return url.replace('/upload/', '/upload/f_auto,q_auto,w_400/');
  };

  const statusKey = property.status || 'for_sale';
  const typeLabel = TYPE_LABELS[property.property_type] || 'Property';
  const isCompared = compareItems.some((p) => p.id === property.id);

  // Dynamic badge positioning logic to avoid overlapping
  const hasFeatured = !!property.is_featured;
  const hasPopular = Number(property.views_count) > 10;

  let popularLeft = 'left-3';
  if (hasFeatured) {
    popularLeft = 'left-[98px]';
  }

  let statusLeft = 'left-3';
  if (hasFeatured && hasPopular) {
    statusLeft = 'left-[188px]';
  } else if (hasFeatured || hasPopular) {
    statusLeft = 'left-[98px]';
  }

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
          src={getOptimizedUrl(property.image_url)}
          alt={property.title}
          loading="lazy"
          className="w-full h-52 object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => { e.target.src = 'https://placehold.co/400x200?text=No+Image'; }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/50 via-transparent to-transparent" />

        {/* Featured Badge */}
        {hasFeatured && (
          <span className="absolute top-3 left-3 px-2.5 py-1 rounded-lg text-[10px] font-bold text-white uppercase tracking-wider bg-gradient-to-r from-amber-500 to-yellow-500 shadow-md shadow-amber-500/20 z-10 animate-pulse">
            ⭐ Featured
          </span>
        )}

        {/* Most Viewed Badge */}
        {hasPopular && (
          <span className={`absolute top-3 ${popularLeft} px-2.5 py-1 rounded-lg text-[10px] font-bold text-white uppercase tracking-wider bg-orange-500 shadow-md shadow-orange-500/20 z-10`}>
            🔥 Popular
          </span>
        )}

        {/* Status badge */}
        <span className={`absolute top-3 ${statusLeft} inline-flex items-center px-2.5 py-1 rounded-lg text-[11px] font-bold uppercase tracking-wide ${STATUS_COLORS[statusKey]}`}>
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
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{typeLabel}</span>
            <label className="flex items-center gap-1.5 cursor-pointer text-[10px] uppercase font-bold text-slate-500 hover:text-blue-600 transition-colors" onClick={(e) => e.stopPropagation()}>
              <input type="checkbox" checked={isCompared} onChange={() => toggleCompare(property)} className="w-3.5 h-3.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer" />
              Compare
            </label>
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

        {canDelete && (property.views_count !== undefined) && (
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 grid grid-cols-3 gap-2 text-center mt-2 bg-slate-50 dark:bg-slate-800/50 rounded-lg p-2">
            <div className="flex flex-col items-center">
              <span className="flex items-center gap-1 text-[10px] text-slate-500 font-bold uppercase"><FaEye className="text-slate-400" /> Views</span>
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">{property.views_count || 0}</span>
            </div>
            <div className="flex flex-col items-center border-l border-r border-slate-200 dark:border-slate-700">
              <span className="flex items-center gap-1 text-[10px] text-slate-500 font-bold uppercase"><FaHeart className="text-slate-400" /> Favs</span>
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">{property.favourites_count || 0}</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="flex items-center gap-1 text-[10px] text-slate-500 font-bold uppercase"><FiMessageCircle className="text-slate-400" /> Inquiries</span>
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">{property.inquiries_count || 0}</span>
            </div>
          </div>
        )}

        {canDelete && !property.is_featured && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onFeature?.(property.id);
            }}
            disabled={isFeatureLoading === property.id}
            className="w-full mt-3 py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-md shadow-amber-500/10 active:scale-[0.98] disabled:opacity-60 disabled:pointer-events-none"
          >
            {isFeatureLoading === property.id ? (
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>⭐ Promote / Feature (₨ 500)</span>
              </>
            )}
          </button>
        )}
      </div>
    </article>
  );
};

export default PropertyCard;