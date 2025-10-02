import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import { lightTheme } from '../theme/light';
// import { lightTheme } from '../theme/light';
// import { darkTheme } from '../theme/dark';
import { lightTheme } from '../Themes/light';
import { darkTheme } from '../Themes/dark';
const ThemeContext = createContext();
const STORAGE_KEY = 'APP_THEME';

export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTheme = async () => {
      try {
        const storedTheme = await AsyncStorage.getItem(STORAGE_KEY);
        if (storedTheme === 'dark') setIsDark(true);
      } catch (e) {
        console.log('Failed to load theme', e);
      } finally {
        setLoading(false);
      }
    };
    loadTheme();
  }, []);

  const toggleTheme = async () => {
    try {
      const newValue = !isDark;
      setIsDark(newValue);
      await AsyncStorage.setItem(STORAGE_KEY, newValue ? 'dark' : 'light');
    } catch (e) {
      console.log('Failed to toggle theme', e);
    }
  };

  const theme = isDark ? darkTheme : lightTheme;

  if (loading) return null; // Or show SplashScreen/Loader

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme, theme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
