import Head from "next/head";

export default function Home() {
    return (
        <>
            <Head>
                <title>eduaard&apos;s services-api</title>
                <meta name="description" content="eduaard's services-api" />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1"
                />
            </Head>
            <main
                style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "6rem",
                    minHeight: "100vh",
                }}
            >
                <div
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        fontSize: "0.85rem",
                        width: "100%",
                    }}
                >
                    <p
                        style={{
                            position: "relative",
                            margin: "0",
                            padding: "1rem 6rem",
                            border: "1px solid rgba(255, 255, 255, 0.3)",
                            borderRadius: "5px",
                        }}
                    >
                        eduaard&apos;s services-api
                    </p>
                </div>
            </main>
        </>
    );
}
