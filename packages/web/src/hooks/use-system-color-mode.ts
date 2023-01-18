import { useMediaQuery } from '@mui/material'

export const useSystemColorMode = () => {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)')
  return prefersDarkMode ? 'dark' : 'light'
}
