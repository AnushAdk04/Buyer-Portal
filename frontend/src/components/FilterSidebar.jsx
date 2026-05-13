import { FiX, FiChevronDown } from 'react-icons/fi';
import { useState } from 'react';

const TYPES = [
  { value: 'house', label: 'House' },
  { value: 'apartment', label: 'Apartment' },
  { value: 'land', label: 'Land' },
  { value: 'commercial', label: 'Commercial' },
  { value: 'villa', label: 'Villa' },
  { value: 'condo', label: 'Condo' },
];

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'oldest', label: 'Oldest First' },
  { value: 'price_asc', label: 'Price: Low → High' },
  { value: 'price_desc', label: 'Price: High → Low' },
];

const FilterSidebar = ({ filters, onChange, onClear, isOpen, onClose }) => {
  const [openSection, setOpenSection] = useState({ type: true, price: true, specs: false });
  const toggle = (s) => setOpenSection((p) => ({ ...p, [s]: !p[s] }));

  const set = (key, val) => onChange({ ...filters, [key]: val });

  const toggleType = (t) => {
    const cur = filters.type ? filters.type.split(',') : [];
    const next = cur.includes(t) ? cur.filter((x) => x !== t) : [...cur, t];
    set('type', next.join(','));
  };

  const activeTypes = filters.type ? filters.type.split(',') : [];

  const inputCls = 'w-full px-3 py-2 border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#141414] text-slate-800 dark:text-slate-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500';

  return (
    <>
      {isOpen && <div className="fixed inset-0 bg-black/40 z-40 lg:hidden" onClick={onClose} />}
      <aside className={`fixed lg:static top-0 right-0 h-full lg:h-auto w-80 lg:w-64 xl:w-72 bg-white dark:bg-[#151515] border-l lg:border border-slate-200 dark:border-slate-800 lg:rounded-2xl z-50 lg:z-auto overflow-y-auto transition-transform lg:transform-none ${isOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}`}>
        <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800 lg:hidden">
          <h3 className="font-bold text-slate-900 dark:text-white">Filters</h3>
          <button onClick={onClose} className="p-1"><FiX className="text-lg" /></button>
        </div>
        <div className="p-4 space-y-4">
          <div className="hidden lg:flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white uppercase tracking-wider">Filters</h3>
            <button onClick={onClear} className="text-xs text-blue-600 hover:underline">Clear All</button>
          </div>

          {/* Sort */}
          <div>
            <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5 block">Sort By</label>
            <select value={filters.sort || 'newest'} onChange={(e) => set('sort', e.target.value)} className={inputCls}>
              {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>

          {/* Status */}
          <div>
            <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5 block">Status</label>
            <select value={filters.status || ''} onChange={(e) => set('status', e.target.value)} className={inputCls}>
              <option value="">All Statuses</option>
              <option value="for_sale">For Sale</option>
              <option value="for_rent">For Rent</option>
              <option value="sold">Sold</option>
              <option value="under_contract">Under Contract</option>
            </select>
          </div>

          {/* Property Type */}
          <div>
            <button onClick={() => toggle('type')} className="w-full flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
              Property Type <FiChevronDown className={`transition-transform ${openSection.type ? 'rotate-180' : ''}`} />
            </button>
            {openSection.type && (
              <div className="grid grid-cols-2 gap-1.5">
                {TYPES.map((t) => (
                  <button key={t.value} onClick={() => toggleType(t.value)}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${activeTypes.includes(t.value) ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'}`}>
                    {t.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Price Range */}
          <div>
            <button onClick={() => toggle('price')} className="w-full flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
              Price Range <FiChevronDown className={`transition-transform ${openSection.price ? 'rotate-180' : ''}`} />
            </button>
            {openSection.price && (
              <div className="flex gap-2">
                <input type="number" placeholder="Min" value={filters.minPrice || ''} onChange={(e) => set('minPrice', e.target.value)} className={inputCls} />
                <input type="number" placeholder="Max" value={filters.maxPrice || ''} onChange={(e) => set('maxPrice', e.target.value)} className={inputCls} />
              </div>
            )}
          </div>

          {/* Specs */}
          <div>
            <button onClick={() => toggle('specs')} className="w-full flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
              Specifications <FiChevronDown className={`transition-transform ${openSection.specs ? 'rotate-180' : ''}`} />
            </button>
            {openSection.specs && (
              <div className="space-y-2">
                <input type="number" placeholder="Min Bedrooms" min="0" value={filters.bedrooms || ''} onChange={(e) => set('bedrooms', e.target.value)} className={inputCls} />
                <input type="number" placeholder="Min Bathrooms" min="0" value={filters.bathrooms || ''} onChange={(e) => set('bathrooms', e.target.value)} className={inputCls} />
                <input type="number" placeholder="Min Area (sqft)" min="0" value={filters.minArea || ''} onChange={(e) => set('minArea', e.target.value)} className={inputCls} />
              </div>
            )}
          </div>

          <button onClick={onClear} className="w-full lg:hidden py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800">
            Clear All Filters
          </button>
        </div>
      </aside>
    </>
  );
};

export default FilterSidebar;
