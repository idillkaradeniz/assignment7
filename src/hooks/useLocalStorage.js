import { useEffect, useState } from "react";

function readValue(key, initialValue) {
  try {
    const stored = localStorage.getItem(key);
    return stored !== null ? JSON.parse(stored) : initialValue;
  } catch {
    // missing or broken json in storage, fall back to the default
    return initialValue;
  }
}

// same shape as useState, but the value is saved in localStorage
export function useLocalStorage(key, initialValue) {
  // lazy initial state, so localStorage is only read on the first render
  const [value, setValue] = useState(() => readValue(key, initialValue));

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // storage can be full or blocked (private mode), the app still works
    }
  }, [key, value]);

  return [value, setValue];
}
