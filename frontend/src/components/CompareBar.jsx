import { useCompare } from '../context/CompareContext';
import { FiX } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

const CompareBar = () => {
  const { compareItems, removeFromCompare, clearCompare } = useCompare();
  const navigate = useNavigate();

  if (compareItems.length === 0) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[60] bg-white dark:bg-[#151515] border-t border-slate-200 dark:border-slate-800 shadow-[0_-10px_40px_-10px_rgba(0,0,0,0.1)] transform transition-transform duration-300 translate-y-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        
        <div className="flex items-center gap-4 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0 hide-scrollbar">
          {compareItems.map(property => (
            <div key={property.id} className="flex items-center gap-3 bg-slate-50 dark:bg-[#1a1a1a] p-2 rounded-xl border border-slate-200 dark:border-slate-800 shrink-0 min-w-[200px] relative">
              <img src={property.image_url} alt={property.title} className="w-12 h-12 rounded-lg object-cover" />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{property.title}</p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400">Rs. {property.price.toLocaleString()}</p>
              </div>
              <button onClick={() => removeFromCompare(property.id)} className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 shadow-md">
                <FiX className="text-[10px]" />
              </button>
            </div>
          ))}
          {compareItems.length < 3 && (
            <div className="flex items-center justify-center border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl h-[66px] w-[200px] shrink-0 text-xs text-slate-400 font-medium">
              Add up to {3 - compareItems.length} more
            </div>
          )}
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto shrink-0">
          <button onClick={clearCompare} className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
            Clear All
          </button>
          <button 
            onClick={() => navigate('/dashboard/compare')} 
            disabled={compareItems.length < 2}
            className="px-6 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-bold shadow-lg shadow-blue-600/30 hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:shadow-none"
          >
            Compare ({compareItems.length})
          </button>
        </div>

      </div>
    </div>
  );
};

export default CompareBar;
