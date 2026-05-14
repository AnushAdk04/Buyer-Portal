import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaMapMarkerAlt, FaRupeeSign } from 'react-icons/fa';

const RecentlyViewed = () => {
  const [recentProps, setRecentProps] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const recent = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
    setRecentProps(recent);
  }, []);

  if (recentProps.length === 0) return null;

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold font-heading text-slate-900 dark:text-white">Recently Viewed</h2>
        {recentProps.length > 4 && (
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 bg-slate-200 dark:bg-slate-800 px-2 py-1 rounded-full">Scroll to see more</span>
        )}
      </div>
      
      <div className="flex gap-4 overflow-x-auto pb-4 hide-scrollbar snap-x">
        {recentProps.map((property) => (
          <div 
            key={property.id} 
            role="button"
            tabIndex={0}
            onClick={() => navigate(`/properties/${property.id}`)}
            onKeyDown={(e) => { if(e.key==='Enter') navigate(`/properties/${property.id}`) }}
            className="shrink-0 w-64 bg-white dark:bg-[#151515] rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden cursor-pointer group hover:-translate-y-1 hover:shadow-xl transition-all duration-300 snap-start"
          >
            <div className="relative h-36">
              <img 
                src={property.image_url} 
                alt={property.title} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                onError={(e) => { e.target.src = 'https://placehold.co/400x200?text=No+Image'; }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              <span className="absolute bottom-2 left-2 text-white font-bold text-sm tracking-wide">
                Rs. {Number(property.price).toLocaleString()}
              </span>
            </div>
            <div className="p-3">
              <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 line-clamp-1 mb-1 group-hover:text-blue-600 transition-colors">
                {property.title}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 line-clamp-1">
                <FaMapMarkerAlt className="text-blue-500" /> {property.location || 'Unknown'}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentlyViewed;
