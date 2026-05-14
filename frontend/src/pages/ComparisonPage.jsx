import { useCompare } from '../context/CompareContext';
import { Navigate, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { FiArrowLeft, FiX, FiCheck } from 'react-icons/fi';

const ComparisonPage = () => {
  const { compareItems, removeFromCompare } = useCompare();
  const navigate = useNavigate();

  if (compareItems.length < 2) {
    return <Navigate to="/dashboard" replace />;
  }

  const formatPrice = (price) => new Intl.NumberFormat('en-NP', { style: 'currency', currency: 'NPR', maximumFractionDigits: 0 }).format(price);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0f0f0f]">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <button onClick={() => navigate('/dashboard')} className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-blue-600 transition-colors">
          <FiArrowLeft /> Back to Dashboard
        </button>

        <h1 className="text-3xl font-bold font-heading text-slate-900 dark:text-white mb-8">Compare Properties</h1>

        <div className="overflow-x-auto pb-4">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr>
                <th className="p-4 border-b-2 border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0f0f0f] sticky left-0 z-10 w-48 min-w-[150px]">
                  <span className="text-xs uppercase tracking-wider text-slate-500 font-bold">Features</span>
                </th>
                {compareItems.map(p => (
                  <th key={p.id} className="p-4 border-b-2 border-slate-200 dark:border-slate-800 min-w-[250px] align-top relative group">
                    <button onClick={() => removeFromCompare(p.id)} className="absolute top-4 right-4 w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-500 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-100 hover:text-red-600">
                      <FiX />
                    </button>
                    <img src={p.image_url} alt={p.title} className="w-full h-40 object-cover rounded-xl mb-4" />
                    <h3 className="font-bold text-lg text-slate-900 dark:text-white line-clamp-2">{p.title}</h3>
                    <p className="text-blue-600 dark:text-blue-400 font-bold mt-2 text-xl">{formatPrice(p.price)}</p>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="text-sm">
              <tr className="hover:bg-slate-100/50 dark:hover:bg-slate-800/30 transition-colors">
                <td className="p-4 border-b border-slate-200 dark:border-slate-800 font-semibold text-slate-700 dark:text-slate-300 sticky left-0 bg-slate-50 dark:bg-[#0f0f0f] z-10">Location</td>
                {compareItems.map(p => <td key={p.id} className="p-4 border-b border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400">{p.location || '-'}</td>)}
              </tr>
              <tr className="hover:bg-slate-100/50 dark:hover:bg-slate-800/30 transition-colors">
                <td className="p-4 border-b border-slate-200 dark:border-slate-800 font-semibold text-slate-700 dark:text-slate-300 sticky left-0 bg-slate-50 dark:bg-[#0f0f0f] z-10">Type</td>
                {compareItems.map(p => <td key={p.id} className="p-4 border-b border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 capitalize">{p.property_type || '-'}</td>)}
              </tr>
              <tr className="hover:bg-slate-100/50 dark:hover:bg-slate-800/30 transition-colors">
                <td className="p-4 border-b border-slate-200 dark:border-slate-800 font-semibold text-slate-700 dark:text-slate-300 sticky left-0 bg-slate-50 dark:bg-[#0f0f0f] z-10">Status</td>
                {compareItems.map(p => <td key={p.id} className="p-4 border-b border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 capitalize">{p.status?.replace('_', ' ') || '-'}</td>)}
              </tr>
              <tr className="hover:bg-slate-100/50 dark:hover:bg-slate-800/30 transition-colors">
                <td className="p-4 border-b border-slate-200 dark:border-slate-800 font-semibold text-slate-700 dark:text-slate-300 sticky left-0 bg-slate-50 dark:bg-[#0f0f0f] z-10">Bedrooms</td>
                {compareItems.map(p => <td key={p.id} className="p-4 border-b border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400">{p.bedrooms || '-'}</td>)}
              </tr>
              <tr className="hover:bg-slate-100/50 dark:hover:bg-slate-800/30 transition-colors">
                <td className="p-4 border-b border-slate-200 dark:border-slate-800 font-semibold text-slate-700 dark:text-slate-300 sticky left-0 bg-slate-50 dark:bg-[#0f0f0f] z-10">Bathrooms</td>
                {compareItems.map(p => <td key={p.id} className="p-4 border-b border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400">{p.bathrooms || '-'}</td>)}
              </tr>
              <tr className="hover:bg-slate-100/50 dark:hover:bg-slate-800/30 transition-colors">
                <td className="p-4 border-b border-slate-200 dark:border-slate-800 font-semibold text-slate-700 dark:text-slate-300 sticky left-0 bg-slate-50 dark:bg-[#0f0f0f] z-10">Area (sqft)</td>
                {compareItems.map(p => <td key={p.id} className="p-4 border-b border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400">{p.area_sqft ? Number(p.area_sqft).toLocaleString() : '-'}</td>)}
              </tr>
              <tr className="hover:bg-slate-100/50 dark:hover:bg-slate-800/30 transition-colors">
                <td className="p-4 border-b border-slate-200 dark:border-slate-800 font-semibold text-slate-700 dark:text-slate-300 sticky left-0 bg-slate-50 dark:bg-[#0f0f0f] z-10">Parking</td>
                {compareItems.map(p => <td key={p.id} className="p-4 border-b border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400">{p.parking_spaces > 0 ? <span className="flex items-center gap-1 text-emerald-600"><FiCheck /> Yes ({p.parking_spaces})</span> : '-'}</td>)}
              </tr>
              <tr>
                <td className="p-4 font-semibold text-slate-700 dark:text-slate-300 sticky left-0 bg-slate-50 dark:bg-[#0f0f0f] z-10">Action</td>
                {compareItems.map(p => (
                  <td key={p.id} className="p-4">
                    <button onClick={() => navigate(`/properties/${p.id}`)} className="w-full px-4 py-2 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors">
                      View Details
                    </button>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default ComparisonPage;
