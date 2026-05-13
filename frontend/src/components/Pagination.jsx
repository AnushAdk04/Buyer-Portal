import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const Pagination = ({ page, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  const pages = [];
  const maxVisible = 5;
  let start = Math.max(1, page - Math.floor(maxVisible / 2));
  let end = Math.min(totalPages, start + maxVisible - 1);
  if (end - start + 1 < maxVisible) start = Math.max(1, end - maxVisible + 1);

  for (let i = start; i <= end; i++) pages.push(i);

  const btn = 'w-9 h-9 rounded-lg text-sm font-medium flex items-center justify-center transition-colors';

  return (
    <div className="flex items-center justify-center gap-1.5 mt-10">
      <button onClick={() => onPageChange(page - 1)} disabled={page <= 1}
        className={`${btn} border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40`}>
        <FiChevronLeft />
      </button>
      {start > 1 && <>
        <button onClick={() => onPageChange(1)} className={`${btn} border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800`}>1</button>
        {start > 2 && <span className="text-slate-400 px-1">…</span>}
      </>}
      {pages.map((p) => (
        <button key={p} onClick={() => onPageChange(p)}
          className={`${btn} ${p === page ? 'bg-blue-600 text-white border-blue-600' : 'border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'}`}>
          {p}
        </button>
      ))}
      {end < totalPages && <>
        {end < totalPages - 1 && <span className="text-slate-400 px-1">…</span>}
        <button onClick={() => onPageChange(totalPages)} className={`${btn} border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800`}>{totalPages}</button>
      </>}
      <button onClick={() => onPageChange(page + 1)} disabled={page >= totalPages}
        className={`${btn} border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40`}>
        <FiChevronRight />
      </button>
    </div>
  );
};

export default Pagination;
