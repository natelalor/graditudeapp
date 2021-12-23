import { createTheme } from '@material-ui/core';

/**
 * The mui theme for the premicorr project. Any variables that change here should
 * alo be changed within premicorr-theme.scss.
 */
export const theme = createTheme({
    palette: {
        primary: {
            main: '#7092BF'
        },
        secondary: {
            main: '#70BABF'
        },
        background: {
            default: '#FAFAFA'
        }
    },

    components: {
        MuiAlert: {
            styleOverrides: {
                root: {
                    padding: '0 12px',
                    alignItems: 'center'
                },
                icon: {
                    padding: 0
                },
                action: {
                    padding: '0 0 0 8px',
                    alignItems: 'center'
                },
                standardSuccess: {
                    border: '1px solid #4CAF50'
                },
                standardError: {
                    border: '1px solid #D32F2F'
                }
            }
        },
        MuiDialog: {
            styleOverrides: {
                scrollPaper: {
                    alignItems: 'flex-start'
                }
            }
        },
        MuiDialogActions: {
            styleOverrides: {
                root: {
                    padding: '8px 24px 16px 24px'
                },
                spacing: {
                    '& > :not(:first-of-type)': {
                        marginLeft: 16
                    }
                }
            }
        },
        MuiLink: {
            defaultProps: {
                underline: 'hover'
            }
        },
        MuiIconButton: {
            styleOverrides: {
                // The default is -12px, which makes the icon misaligned...
                edgeEnd: { marginRight: -8 },
                edgeStart: { marginLeft: -8 }
            }
        },
        MuiTextField: {
            defaultProps: {
                variant: 'filled'
            }
        },
        MuiTooltip: {
            defaultProps: {
                enterDelay: 500,
                disableInteractive: true
            }
        },
        MuiTableRow: {
            styleOverrides: {
                root: {
                    ':last-child > td': {
                        border: 'none'
                    }
                }
            }
        },
        MuiRadio: {
            styleOverrides: {
                root: {
                    padding: '4px 8px'
                }
            }
        }
    }
});
