import { Maven_Pro } from "@next/font/google";
import { createTheme } from "@mui/material/styles";

export const MavenPro = Maven_Pro({
    weight: ["400", "500", "700", "800"],
    subsets: ["latin"],
    display: "swap",
    fallback: ["Helvetica", "Arial", "sans-serif"],
});

const colors = {
    primary: {
        main: "#8562d7",
        dark: "#5336a5",
        light: "#b890ff",
    },
    secondary: {
        main: "#f8e1ee",
        dark: "#c5afbc",
        light: "#ffffff",
    },
    background: {
        default: "#212121",
        paper: "#2f2f2f",
    },
};

const themeOptions = createTheme({
    palette: {
        mode: "dark",
        primary: {
            main: colors.primary.main,
            dark: colors.primary.dark,
            light: colors.primary.light,
        },
        secondary: {
            main: colors.secondary.main,
            dark: colors.secondary.dark,
            light: colors.secondary.light,
        },
        background: {
            default: colors.background.default,
            paper: colors.background.paper,
        },
    },
    typography: {
        fontFamily: MavenPro.style.fontFamily,
    },
    components: {
        MuiTooltip: {
            defaultProps: {
                arrow: true,
            },
        },
        MuiLink: {
            styleOverrides: {
                root: {
                    transition: "200ms",
                    "&:hover": {
                        color: colors.primary.dark,
                        transition: "200ms",
                    },
                },
            },
            defaultProps: {
                underline: "none",
            },
        },
    },
});

export default themeOptions;
