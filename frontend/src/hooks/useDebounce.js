import { useState, useEffect } from 'react';

/**
 * Debounce a value by the given delay (ms).
 * Returns the debounced value.
 */
export default function useDebounce(value, delay = 400) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}
