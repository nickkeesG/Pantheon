export const saveToLocalStorage = (key: string, value: any) => {
  try {
    const serializedValue = JSON.stringify(value);
    localStorage.setItem(key, serializedValue);
  } catch (error) {
    console.error('Error saving to local storage', error);
  }
};

export const loadFromLocalStorage = (key: string, defaultValue: any) => {
  try {
    const serializedValue = localStorage.getItem(key);
    return serializedValue ? JSON.parse(serializedValue) : defaultValue;
  } catch (error) {
    console.error('Error loading from local storage', error);
    return defaultValue;
  }
};