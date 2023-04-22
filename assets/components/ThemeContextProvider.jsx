import React, { createContext, useState } from 'react';
import { createTheme, ThemeProvider } from '@mui/material';

const breakpoints = {
  values: {
    xs: 0,
    sm: 600,
    md: 960,
    lg: 1280,
    xl: 1920,
  },
};

const baseTheme = createTheme({
  breakpoints,
});

const themeWhite = createTheme({}, baseTheme);

const themeDark = createTheme({
  breakpoints,
  palette: {
    mode: 'dark',
  },
});

const ThemeContext = createContext();

// eslint-disable-next-line react/prop-types
function ThemeContextProvider({ children }) {
  const [theme, setTheme] = useState(sessionStorage.getItem('theme') ?? 'white');

  const getTheme = () => {
    switch (theme) {
      case 'white':
        return themeWhite;
      case 'dark':
        return themeDark;
      default:
        throw new Error(`Theme '${theme}' not defined.`);
    }
  };

  const updateTheme = (value) => {
    sessionStorage.setItem('theme', value);
    setTheme(value);
  };

  return (
  // eslint-disable-next-line react/jsx-no-constructed-context-values
    <ThemeContext.Provider value={{ theme, updateTheme }}>
      <ThemeProvider theme={getTheme()}>
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
}

export { ThemeContext, ThemeContextProvider, baseTheme };
