import { ThemeProvider } from '@emotion/react'
import {
  BottomNavigation,
  BottomNavigationAction,
  Box,
  Drawer,
  Paper,
} from '@mui/material'
import CssBaseline from '@mui/material/CssBaseline'
import React, { useState } from 'react'
import { useSystemColorMode } from './hooks/use-system-color-mode'
import AppMap from './map'
import createSystemColorTheme from './theme'
import RestoreIcon from '@mui/icons-material/Restore'
import FavoriteIcon from '@mui/icons-material/Favorite'
import ArchiveIcon from '@mui/icons-material/Archive'

const App = () => {
  const colorMode = useSystemColorMode()

  const theme = React.useMemo(
    () => createSystemColorTheme(colorMode),
    [colorMode],
  )

  const [activeTab, setActiveTab] = useState<unknown>()

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      <Box sx={{ width: '100%', height: '100%' }}>
        <Drawer variant="permanent" elevation={2}>
          Coucou
        </Drawer>

        <AppMap />
        {/* <Paper
          sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }}
          elevation={3}
        >
          <BottomNavigation
            showLabels
            value={activeTab}
            onChange={(event, newValue) => {
              setActiveTab(newValue)
            }}
          >
            <BottomNavigationAction label="Recents" icon={<RestoreIcon />} />
            <BottomNavigationAction label="Favorites" icon={<FavoriteIcon />} />
            <BottomNavigationAction label="Archive" icon={<ArchiveIcon />} />
          </BottomNavigation>
        </Paper> */}
      </Box>
    </ThemeProvider>
  )
}

export default App
