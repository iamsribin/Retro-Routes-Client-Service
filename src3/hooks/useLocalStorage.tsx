import { useState } from "react";

function useLocalStorage<T>(key: string, initialValue: T) {
  const storedValue = localStorage.getItem(key);
  
  let parsedValue;
  try {
    parsedValue = storedValue ? JSON.parse(storedValue) : initialValue;
  } catch (error) {
    console.error("Error parsing localStorage key:", key, error);
    parsedValue = initialValue;
  }

  const [value, setValue] = useState<T>(parsedValue);

  const setStoredValue = (newValue: T) => {
    setValue(newValue);
    localStorage.setItem(key, JSON.stringify(newValue));
  };

  return [value, setStoredValue] as const;
}

export default useLocalStorage;
