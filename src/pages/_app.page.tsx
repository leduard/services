import type { AppProps } from "next/app";
import { ThemeProvider } from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";
import { CacheProvider, EmotionCache } from "@emotion/react";
import themeOptions from "@/styles/theme";
import createEmotionCache from "@/utils/createEmotionCache";
import Head from "next/head";
import { FipeProvider } from "@/context/Fipe";

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

interface Props extends AppProps {
    emotionCache?: EmotionCache;
}

export default function App(props: Props) {
    const {
        Component,
        emotionCache = clientSideEmotionCache,
        pageProps,
    } = props;

    return (
        <CacheProvider value={emotionCache}>
            <Head>
                <meta
                    name="viewport"
                    content="initial-scale=1, width=device-width"
                />
            </Head>
            <ThemeProvider theme={themeOptions}>
                {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
                <CssBaseline />
                <FipeProvider>
                    <Component {...pageProps} />
                </FipeProvider>
            </ThemeProvider>
        </CacheProvider>
    );
}
