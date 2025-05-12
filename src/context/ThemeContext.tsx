
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

type ThemeColors = {
  backgroundColor: string;
  textColor: string;
};

interface ThemeContextType {
  colors: ThemeColors;
  updateStatusBarColor: (color: string) => void;
}

const defaultTheme: ThemeColors = {
  backgroundColor: '#FFFFFF',
  textColor: '#1A1F2C',
};

const ThemeContext = createContext<ThemeContextType>({
  colors: defaultTheme,
  updateStatusBarColor: () => {},
});

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [colors, setColors] = useState<ThemeColors>(defaultTheme);
  const location = useLocation();

  const updateStatusBarColor = (color: string) => {
    // Update meta tags for iOS
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    const metaAppleStatusBar = document.querySelector('meta[name="apple-mobile-web-app-status-bar-style"]');
    
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', color);
    }
    
    if (metaAppleStatusBar) {
      metaAppleStatusBar.setAttribute('content', color);
    }
    
    setColors({
      ...colors,
      backgroundColor: color,
    });
  };

  // Route-based theme configuration
  useEffect(() => {
    if (location.pathname === '/insights') {
      updateStatusBarColor('#9b87f5'); // Purple for Unique+ (Insights) page
    } else {
      updateStatusBarColor('#FFFFFF'); // Default white for other pages
    }
  }, [location.pathname]);

  return (
    <ThemeContext.Provider value={{ colors, updateStatusBarColor }}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;
