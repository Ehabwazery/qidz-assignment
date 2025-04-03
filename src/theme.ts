const theme = {
  palette: {
    primary: '#4A6572',
    secondary: '#F9AA33',
    error: '#E53935',
    white: '#FFFFFF',
    black: '#000000',
    veryLightGray: '#F5F5F5',
    lightGray: '#E0E0E0',
    mediumGray: '#9E9E9E',
    darkGray: '#616161',
    background: {
      light: '#FFFFFF',
      dark: '#121212',
    },
    round: 1000,
    text: {
      primary: {
        light: '#212121',
        dark: '#F5F5F5',
      },
      secondary: {
        light: '#757575',
        dark: '#BBBBBB',
      },
    },
  },
  typography: {
    fontSize: {
      xs: 12,
      sm: 14,
      md: 16,
      lg: 18,
      xl: 20,
      xxl: 24,
      xxxl: 30,
    },
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    base: 16,
    lg: 20,
    xl: 24,
    xxl: 32,
    xxxl: 48,
  },
  borderRadius: {
    xs: 2,
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    xxl: 20,
    circular: 1000,
  },
  shadows: {
    light: {
      small: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 1,
      },
      medium: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
        elevation: 3,
      },
      large: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 5,
      },
    },
  },
};

export default theme;