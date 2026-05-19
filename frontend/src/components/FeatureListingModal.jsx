import React from 'react';
import { FiX, FiInfo } from 'react-icons/fi';
import { FaCrown, FaCheck } from 'react-icons/fa';

const FeatureListingModal = ({ isOpen, onClose, onChooseGateway, loading }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/60 dark:bg-black/85 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-md bg-white dark:bg-[#121212] rounded-3xl border border-slate-100 dark:border-slate-800 shadow-2xl p-6 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Decorative ambient background glow */}
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-48 h-48 bg-blue-500/10 dark:bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
        >
          <FiX className="text-lg" />
        </button>

        {/* Title Block */}
        <div className="flex flex-col items-center text-center mt-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-400 to-yellow-500 flex items-center justify-center text-white shadow-lg shadow-amber-500/20 mb-3 animate-bounce">
            <FaCrown className="text-xl" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-50 font-outfit">
            Promote to Featured ⭐
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-[280px]">
            Double your inquiries and pin your listing at the very top of all search queries.
          </p>
        </div>

        {/* Info list */}
        <div className="space-y-2 mb-6 bg-slate-50 dark:bg-slate-800/40 rounded-2xl p-4">
          <div className="flex items-center gap-2.5 text-xs text-slate-600 dark:text-slate-300">
            <span className="w-4 h-4 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center text-[10px] font-bold"><FaCheck /></span>
            <span>Pinned to the top of all searches & results</span>
          </div>
          <div className="flex items-center gap-2.5 text-xs text-slate-600 dark:text-slate-300">
            <span className="w-4 h-4 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center text-[10px] font-bold"><FaCheck /></span>
            <span>Highlighted with a golden dynamic premium badge</span>
          </div>
          <div className="flex items-center gap-2.5 text-xs text-slate-600 dark:text-slate-300">
            <span className="w-4 h-4 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center text-[10px] font-bold"><FaCheck /></span>
            <span>Increases clicks and views by over 200%</span>
          </div>
        </div>

        {/* Pricing tag */}
        <div className="text-center mb-6">
          <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Total Promotion Charge</span>
          <div className="text-3xl font-extrabold text-blue-600 dark:text-blue-400 mt-1 font-outfit">
            ₨ 500.00 <span className="text-sm font-semibold text-slate-400">/ one-time</span>
          </div>
        </div>

        {/* Gateways Selector */}
        <div className="space-y-3">
          {/* eSewa Checkout */}
          <button
            onClick={() => onChooseGateway('esewa')}
            disabled={loading}
            className="group relative w-full p-4 rounded-2xl border-2 border-emerald-500/20 dark:border-emerald-500/10 bg-gradient-to-r from-emerald-500/5 to-green-500/5 hover:from-emerald-500/10 hover:to-green-500/10 text-slate-800 dark:text-slate-100 font-bold flex items-center justify-between transition-all duration-300 active:scale-[0.99] disabled:opacity-50 disabled:pointer-events-none hover:border-emerald-500 hover:shadow-lg hover:shadow-emerald-500/10"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-green-600 flex items-center justify-center text-white font-extrabold text-sm tracking-wide shadow-md shadow-emerald-500/20">
                eS
              </div>
              <div className="text-left">
                <span className="block text-sm font-extrabold text-slate-900 dark:text-white leading-tight">Pay via eSewa</span>
                <span className="block text-[10px] text-emerald-600 dark:text-emerald-400 font-medium mt-0.5">Instant secure wallet transfer</span>
              </div>
            </div>
            <div className="w-6 h-6 rounded-full border-2 border-emerald-500/30 group-hover:border-emerald-500 flex items-center justify-center transition-colors">
              <div className="w-3.5 h-3.5 rounded-full bg-emerald-500 scale-0 group-hover:scale-100 transition-transform duration-200" />
            </div>
          </button>

          {/* Khalti Checkout */}
          <button
            onClick={() => onChooseGateway('khalti')}
            disabled={loading}
            className="group relative w-full p-4 rounded-2xl border-2 border-purple-500/20 dark:border-purple-500/10 bg-gradient-to-r from-purple-500/5 to-indigo-500/5 hover:from-purple-500/10 hover:to-indigo-500/10 text-slate-800 dark:text-slate-100 font-bold flex items-center justify-between transition-all duration-300 active:scale-[0.99] disabled:opacity-50 disabled:pointer-events-none hover:border-purple-500 hover:shadow-lg hover:shadow-purple-500/10"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-700 flex items-center justify-center text-white font-extrabold text-xs tracking-wider shadow-md shadow-purple-500/20 uppercase">
                Kh
              </div>
              <div className="text-left">
                <span className="block text-sm font-extrabold text-slate-900 dark:text-white leading-tight">Pay via Khalti</span>
                <span className="block text-[10px] text-purple-600 dark:text-purple-400 font-medium mt-0.5">Viber, Mobile Wallet, or Banking</span>
              </div>
            </div>
            <div className="w-6 h-6 rounded-full border-2 border-purple-500/30 group-hover:border-purple-500 flex items-center justify-center transition-colors">
              <div className="w-3.5 h-3.5 rounded-full bg-purple-600 scale-0 group-hover:scale-100 transition-transform duration-200" />
            </div>
          </button>
        </div>

        {/* Footer info */}
        <div className="mt-5 flex items-center justify-center gap-1.5 text-[10px] text-slate-400 font-medium">
          <FiInfo className="text-xs" />
          <span>Transactions are 256-bit cryptographically secured</span>
        </div>
      </div>
    </div>
  );
};

export default FeatureListingModal;
