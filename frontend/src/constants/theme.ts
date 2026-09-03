export const THEME = {
  colors: {
    primary: { 50: '#f0fdf4', 100: '#dcfce7', 500: '#22c55e', 600: '#16a34a', 700: '#15803d' },
    forest: { deep: '#0a1f14', dark: '#122b1d', medium: '#1e4d2b', light: '#2c6f52', accent: '#3d9970' },
  },
  spacing: { xs: '0.25rem', sm: '0.5rem', md: '1rem', lg: '1.5rem', xl: '2rem' },
  shadows: { glass: '0 8px 32px rgba(16, 29, 21, 0.12)', md: '0 4px 6px -1px rgba(0,0,0,0.1)' },
} as const;
export const BREAKPOINTS = { sm: '640px', md: '768px', lg: '1024px', xl: '1280px' } as const;
export const Z_INDEX = { dropdown: 10, sticky: 20, overlay: 30, modal: 40, toast: 50, tooltip: 60 } as const;
