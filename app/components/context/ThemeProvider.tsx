import {createContext, useContext, useState} from 'react';
import type {Dispatch, ReactNode, SetStateAction} from 'react';

enum Theme {
  DARK = 'dark',
  LIGHT = 'light',
}

export interface ThemeContextType {
  theme: Theme;
  setTheme: Dispatch<SetStateAction<Theme>>;
  navVisible: boolean;
  setNavVisible: Dispatch<SetStateAction<boolean>>;
  plpVisible: boolean;
  setPlpVisible: Dispatch<SetStateAction<boolean>>;
}

const defaultContext = {
  theme: Theme.LIGHT,
  setTheme: (theme: Theme)=> {},
  navVisible: false,
  setNavVisible: (navVisible: boolean) => {},
  plpVisible: false,
  setPlpVisible: (plpVisible: boolean) => {},
};

const ThemeContext = createContext(defaultContext);

function ThemeProvider({children}: {children: ReactNode}) {
  const [theme, setTheme] = useState<Theme>(Theme.LIGHT);
  const [navVisible, setNavVisible] = useState<boolean>(false);
  const [plpVisible, setPlpVisible] = useState<boolean>(false);

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme,
        navVisible,
        setNavVisible,
        plpVisible,
        setPlpVisible,
      }}
    >
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
