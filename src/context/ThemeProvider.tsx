'use client'

import React, { createContext, useContext, useMemo } from 'react'
import useLocalStorage from '../hooks/useLocalStorage'

type Theme = 'sunset' | 'nord'

interface ThemeContextType {
   theme: Theme
   setTheme: (theme: Theme) => void
   toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
   children,
}) => {
   const [theme, setTheme] = useLocalStorage<Theme>('theme', 'sunset')

   const toggleTheme = () => {
      setTheme(theme === 'sunset' ? 'nord' : 'sunset')
   }

   const value = useMemo(
      () => ({
         theme,
         setTheme,
         toggleTheme,
      }),
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [theme]
   )

   return (
      <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
   )
}

export const useTheme = (): ThemeContextType => {
   const context = useContext(ThemeContext)
   if (!context) {
      throw new Error('useTheme must be used within a ThemeProvider')
   }
   return context
}
