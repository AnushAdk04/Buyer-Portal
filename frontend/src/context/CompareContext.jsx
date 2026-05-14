import { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const CompareContext = createContext();

export const useCompare = () => useContext(CompareContext);

export const CompareProvider = ({ children }) => {
  const [compareItems, setCompareItems] = useState(() => {
    const saved = localStorage.getItem('compareItems');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('compareItems', JSON.stringify(compareItems));
  }, [compareItems]);

  const toggleCompare = (property) => {
    setCompareItems((prev) => {
      const exists = prev.find(p => p.id === property.id);
      if (exists) {
        return prev.filter(p => p.id !== property.id);
      }
      if (prev.length >= 3) {
        toast.error('You can only compare up to 3 properties');
        return prev;
      }
      return [...prev, property];
    });
  };

  const removeFromCompare = (id) => {
    setCompareItems((prev) => prev.filter(p => p.id !== id));
  };

  const clearCompare = () => {
    setCompareItems([]);
  };

  return (
    <CompareContext.Provider value={{ compareItems, toggleCompare, removeFromCompare, clearCompare }}>
      {children}
    </CompareContext.Provider>
  );
};
