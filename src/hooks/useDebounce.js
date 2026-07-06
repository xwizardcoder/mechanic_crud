import { useState, useEffect, useRef } from 'react';

/**
 * Custom hook: debounces a value by delayMs.
 * Prevents excessive API calls during rapid user input.
 */
export function useDebounce(value, delayMs = 350) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delayMs);
    return () => clearTimeout(timer);
  }, [value, delayMs]);

  return debouncedValue;
}

/**
 * Custom hook: tracks previous value (useful for comparing props/state changes)
 */
export function usePrevious(value) {
  const ref = useRef();
  useEffect(() => { ref.current = value; });
  return ref.current;
}

/**
 * Custom hook: returns true after an initial delay (prevents layout flash)
 */
export function useDelayedMount(delayMs = 100) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), delayMs);
    return () => clearTimeout(timer);
  }, [delayMs]);
  return mounted;
}
