import { createTheme } from '@mui/material/styles';
import { colors } from './styles';

const theme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: colors.bg,
      paper:   colors.surface,
    },
    primary: {
      main: colors.primary,
    },
    text: {
      primary:   colors.textMain,
      secondary: colors.textMuted,
    },
    divider: colors.border,
  },
  typography: {
    fontFamily: `'Inter', 'Roboto', sans-serif`,
  },
  components: {
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: colors.surface,
          borderRight: `0.5px solid ${colors.border}`,
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: colors.surface,
          borderBottom: `0.5px solid ${colors.border}`,
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          '&:hover': {
            backgroundColor: colors.surfaceHover,
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderColor: colors.borderLight,
          color: colors.textMuted,
        },
        head: {
          color: colors.textDisabled,
          backgroundColor: colors.surface,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: colors.surface,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          backgroundColor: colors.surfaceHover,
          color: colors.textMuted,
        },
      },
    },
  },
});

export default theme;
