import { createContext, useContext, useEffect } from 'react'

const ThemeContext = createContext(null)

export function ThemeProvider({ children }) {
  useEffect(() => {
    const root = document.documentElement
    root.classList.add('dark')
    root.classList.remove('light')
  }, [])

  return (
    <ThemeContext.Provider value={{ theme: 'dark' }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be inside ThemeProvider')
  return ctx
}
