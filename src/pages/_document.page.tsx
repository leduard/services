import { Container } from "@mui/material";
import Document, { Html, Head, Main, NextScript } from "next/document";
import theme, { MavenPro } from "@/styles/theme";
import createEmotionServer from "@emotion/server/create-instance";
import createEmotionCache from "@/utils/createEmotionCache";

export default class AppDocument extends Document {
    render() {
        return (
            <Html lang="en" className={MavenPro.className}>
                <Head>
                    <link rel="icon" href="/favicon.ico" />
                    <meta name="emotion-insertion-point" content="" />
                    <meta
                        name="theme-color"
                        content={theme.palette.primary.main}
                    />
                    {(this.props as any).emotionStyleTags}
                </Head>

                <body>
                    <Container maxWidth="md" sx={{ height: "100vh" }}>
                        <Main />
                        <NextScript />
                    </Container>
                </body>
            </Html>
        );
    }
}

AppDocument.getInitialProps = async (ctx) => {
    const originalRenderPage = ctx.renderPage;

    // You can consider sharing the same Emotion cache between all the SSR requests to speed up performance.
    // However, be aware that it can have global side effects.
    const cache = createEmotionCache();
    const { extractCriticalToChunks } = createEmotionServer(cache);

    ctx.renderPage = () =>
        originalRenderPage({
            enhanceApp: (App: any) =>
                function EnhanceApp(props) {
                    return <App emotionCache={cache} {...props} />;
                },
        });

    const initialProps = await Document.getInitialProps(ctx);
    // This is important. It prevents Emotion to render invalid HTML.
    // See https://github.com/mui/material-ui/issues/26561#issuecomment-855286153
    const emotionStyles = extractCriticalToChunks(initialProps.html);
    const emotionStyleTags = emotionStyles.styles.map((style) => (
        <style
            data-emotion={`${style.key} ${style.ids.join(" ")}`}
            key={style.key}
            // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={{ __html: style.css }}
        />
    ));

    return {
        ...initialProps,
        emotionStyleTags,
    };
};
