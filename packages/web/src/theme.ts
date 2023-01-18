import { createTheme, PaletteMode, responsiveFontSizes } from "@mui/material";

const createSystemColorTheme = (mode: PaletteMode) => {
  const _theme = createTheme({
    palette: {
      mode
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          html: {
            display: 'flex',
            'flexDirection': 'column',
            height: '100%',
          },
          body: {
            flex: 1
          },
          '#root': {
            height: '100%'
          }
        }
      }
    }
  })

  const theme = responsiveFontSizes(_theme)

  return theme
}

export default createSystemColorTheme
