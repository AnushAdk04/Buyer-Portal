const PropertyCard = ({ property, onToggleFavourite, loading }) => {
  const formatPrice = (price) =>
    new Intl.NumberFormat('en-NP', { style: 'currency', currency: 'NPR', maximumFractionDigits: 0 }).format(price);

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <div className="relative">
        <img
          src={property.image_url}
          alt={property.title}
          className="w-full h-48 object-cover"
          onError={(e) => { e.target.src = 'https://placehold.co/400x200?text=No+Image'; }}
        />
        <button
          onClick={() => onToggleFavourite(property.id, property.isFavourite)}
          disabled={loading === property.id}
          className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white shadow flex items-center justify-center hover:scale-110 transition-transform disabled:opacity-50"
        >
          {loading === property.id ? (
            <span className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          ) : (
            <span className={`text-xl ${property.isFavourite ? 'text-red-500' : 'text-gray-300'}`}>
              ♥
            </span>
          )}
        </button>
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-gray-800 text-sm leading-snug mb-1">{property.title}</h3>
        <p className="text-xs text-gray-500 mb-2">📍 {property.location}</p>
        <p className="text-blue-600 font-bold text-sm">{formatPrice(property.price)}</p>
      </div>
    </div>
  );
};

export default PropertyCard;