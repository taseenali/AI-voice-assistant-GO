import { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark';
type Density = 'comfortable' | 'compact';

interface ThemeContextValue {
  theme: Theme;
  density: Density;
  toggleTheme: () => void;
  toggleDensity: () => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: 'light',
  density: 'comfortable',
  toggleTheme: () => {},
  toggleDensity: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => {
    return (localStorage.getItem('mvair-theme') as Theme) ?? 'light';
  });
  const [density, setDensity] = useState<Density>(() => {
    return (localStorage.getItem('mvair-density') as Density) ?? 'comfortable';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('mvair-theme', theme);
  }, [theme]);

  useEffect(() => {
    document.documentElement.setAttribute('data-density', density);
    localStorage.setItem('mvair-density', density);
  }, [density]);

  const toggleTheme = () => setTheme((t) => (t === 'light' ? 'dark' : 'light'));
  const toggleDensity = () => setDensity((d) => (d === 'comfortable' ? 'compact' : 'comfortable'));

  return (
    <ThemeContext.Provider value={{ theme, density, toggleTheme, toggleDensity }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
