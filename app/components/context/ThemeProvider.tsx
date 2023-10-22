import {createContext, useContext, useState} from 'react';
import type {Dispatch, ReactNode, SetStateAction} from 'react';

enum Theme {
  DARK = 'dark',
  LIGHT = 'light',
}

type ThemeContextType = [Theme | null, Dispatch<SetStateAction<Theme | null>>];

const defaultContext = {
  theme: Theme.LIGHT,
  setTheme: () => {},
  navVisible: false,
  setNavVisible: () => {},
};

const ThemeContext = createContext(defaultContext);

function ThemeProvider({children}: {children: ReactNode}) {
  const [theme, setTheme] = useState<Theme | null>(Theme.LIGHT);
  const [navVisible, setNavVisible] = useState<boolean>(false);

  return (
    <ThemeContext.Provider value={[theme, setTheme, navVisible, setNavVisible]}>
      {children}
    </ThemeContext.Provider>
  );
}

function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

export {Theme, ThemeProvider, useTheme};
