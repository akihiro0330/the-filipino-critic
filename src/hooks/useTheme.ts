import { useEffect, useState } from 'react'

export type ThemeMode = 'light' | 'dark'

const STORAGE_KEY = 'tfc-theme'

function getInitialTheme(): ThemeMode {
  if (typeof window === 'undefined') {
    return 'light'
  }

  const storedTheme = localStorage.getItem(STORAGE_KEY)

  if (storedTheme === 'light' || storedTheme === 'dark') {
    return storedTheme
  }

  const prefersDark = window.matchMedia(
    '(prefers-color-scheme: dark)',
  ).matches

  return prefersDark ? 'dark' : 'light'
}

export function useTheme() {
  const [theme, setTheme] = useState<ThemeMode>(getInitialTheme)

  useEffect(() => {
    const root = document.documentElement

    root.classList.toggle('dark', theme === 'dark')

    localStorage.setItem(STORAGE_KEY, theme)
  }, [theme])

  function toggleTheme() {
    setTheme((current) =>
      current === 'light' ? 'dark' : 'light',
    )
  }

  return {
    theme,
    setTheme,
    toggleTheme,
  }
}