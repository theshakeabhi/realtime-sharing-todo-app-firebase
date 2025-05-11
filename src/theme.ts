import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
    palette: {
        primary: {
            main: '#FF6B6B',
            light: '#FF9B9B',
            dark: '#E64545',
            contrastText: '#FFFFFF',
        },
        secondary: {
            main: '#2C3E50',
            light: '#4A6278',
            dark: '#1A252F',
            contrastText: '#FFFFFF',
        },
        error: {
            main: '#F44336',
        },
        warning: {
            main: '#FF9800',
        },
        success: {
            main: '#4CAF50',
        },
        info: {
            main: '#67E8B4',
        },
        background: {
            default: '#F9FAFB',
            paper: '#FFFFFF',
        },
        text: {
            primary: '#111827',
            secondary: '#6B7280',
        },
    },
    typography: {
        fontFamily: 'Inter, sans-serif',
        h1: {
            fontSize: '2.5rem',
            fontWeight: 700,
            lineHeight: 1.2,
        },
        h2: {
            fontSize: '2rem',
            fontWeight: 700,
            lineHeight: 1.2,
        },
        h3: {
            fontSize: '1.5rem',
            fontWeight: 700,
            lineHeight: 1.2,
        },
        h4: {
            fontSize: '1.25rem',
            fontWeight: 500,
            lineHeight: 1.2,
        },
        h5: {
            fontSize: '1.125rem',
            fontWeight: 500,
            lineHeight: 1.2,
        },
        h6: {
            fontSize: '1rem',
            fontWeight: 500,
            lineHeight: 1.2,
        },
        body1: {
            fontSize: '1rem',
            lineHeight: 1.5,
        },
        body2: {
            fontSize: '0.875rem',
            lineHeight: 1.5,
        },
        button: {
            textTransform: 'none',
            fontWeight: 500,
        },
    },
    shape: {
        borderRadius: 8,
    },
    shadows: [
        'none',
        '0px 2px 4px rgba(0, 0, 0, 0.05)',
        '0px 4px 6px rgba(0, 0, 0, 0.05)',
        '0px 6px 8px rgba(0, 0, 0, 0.05)',
        '0px 8px 12px rgba(0, 0, 0, 0.05)',
        '0px 12px 16px rgba(0, 0, 0, 0.05)',
        '0px 16px 24px rgba(0, 0, 0, 0.05)',
        '0px 20px 28px rgba(0, 0, 0, 0.05)',
        '0px 24px 32px rgba(0, 0, 0, 0.05)',
        '0px 28px 36px rgba(0, 0, 0, 0.05)',
        '0px 32px 40px rgba(0, 0, 0, 0.05)',
        '0px 36px 44px rgba(0, 0, 0, 0.05)',
        '0px 40px 48px rgba(0, 0, 0, 0.05)',
        '0px 44px 52px rgba(0, 0, 0, 0.05)',
        '0px 48px 56px rgba(0, 0, 0, 0.05)',
        '0px 52px 60px rgba(0, 0, 0, 0.05)',
        '0px 56px 64px rgba(0, 0, 0, 0.05)',
        '0px 60px 68px rgba(0, 0, 0, 0.05)',
        '0px 64px 72px rgba(0, 0, 0, 0.05)',
        '0px 68px 76px rgba(0, 0, 0, 0.05)',
        '0px 72px 80px rgba(0, 0, 0, 0.05)',
        '0px 76px 84px rgba(0, 0, 0, 0.05)',
        '0px 80px 88px rgba(0, 0, 0, 0.05)',
        '0px 84px 92px rgba(0, 0, 0, 0.05)',
        '0px 88px 96px rgba(0, 0, 0, 0.05)',
    ],
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 8,
                    padding: '10px 16px',
                    fontWeight: 500,
                    boxShadow: 'none',
                    '&:hover': {
                        boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
                    },
                },
                containedPrimary: {
                    '&:hover': {
                        backgroundColor: '#E64545',
                    },
                },
                containedSecondary: {
                    '&:hover': {
                        backgroundColor: '#1A252F',
                    },
                },
            },
        },
        MuiTextField: {
            styleOverrides: {
                root: {
                    '& .MuiOutlinedInput-root': {
                        borderRadius: 8,
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#FF6B6B',
                        },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#FF6B6B',
                            borderWidth: 2,
                        },
                    },
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: 12,
                    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.05)',
                    overflow: 'hidden',
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                rounded: {
                    borderRadius: 12,
                },
            },
        },
    },
});