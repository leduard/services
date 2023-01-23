import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Router from "next/router";
import { Button, Container, Typography } from "@mui/material";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";

import FipeService from "@/utils/api/FipeService";
import api from "@/utils/api";
import ResultChart from "./components/ResultChart";

type ServerSidePropsData = {
    results: VehicleData[];
    error?: {
        message: string;
    };
};

export const getServerSideProps: GetServerSideProps<
    ServerSidePropsData
> = async (context) => {
    const { query } = context;
    const { vehicleType, vehicleBrand, vehicleModel, vehicleYear } = query;

    if (!vehicleType || !vehicleBrand || !vehicleModel || !vehicleYear) {
        return {
            props: {
                results: [],
                error: {
                    message:
                        "Não foi possível fazer a busca por falta de parâmetros, verifique a requisição e tente novamente.",
                },
            },
        };
    }

    const tables = await FipeService.getReferenceTables();
    const tablesFromYear = FipeService.filterReferenceTablesByModelYear(
        tables,
        vehicleYear as string
    );

    try {
        const url = context.req.headers["host"];
        const res = await api.post<VehicleData[]>(
            `http://${url}/api/fipe/history`,
            { referenceTables: tablesFromYear },
            {
                params: {
                    vehicleType,
                    brandId: vehicleBrand,
                    modelId: vehicleModel,
                    yearString: vehicleYear,
                },
            }
        );

        return {
            props: {
                results: res.data || [],
            },
        };
    } catch (err: any) {
        return {
            props: {
                results: [],
                error: {
                    message: err.message,
                },
            },
        };
    }
};

export default function Results({
    results,
    error,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
    const chartData = results.filter((r) => r.referenceDate.date);
    const vehicleData = chartData[0];
    const latestVehicleData = chartData[chartData.length - 1] || {};
    const latestVehicleDataPrice = latestVehicleData?.price?.toLocaleString(
        "pt-BR",
        { minimumFractionDigits: 2, maximumFractionDigits: 2 }
    );

    const hasError = (error && error.message) || !chartData.length;
    const pageTitle = hasError
        ? "Resultado consulta"
        : `Resultado consulta - ${vehicleData.model} - ${vehicleData.year}`;
    const pageDescription = hasError
        ? "Consulta de dados da table FIPE"
        : `Consulta de dados da table FIPE - ${vehicleData.model} - ${vehicleData.year}.\nValor no ultimo mês: R$ ${latestVehicleDataPrice}`;

    return (
        <>
            <Head>
                <title>{pageTitle}</title>
                <meta name="description" content={pageDescription} />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1"
                />
            </Head>
            <Container
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    height: "100vh",
                }}
            >
                {hasError ? (
                    <>
                        <Typography
                            variant="h5"
                            component="h3"
                            fontWeight="bold"
                            align="center"
                        >
                            {error?.message ||
                                "Não foi possível encontrar os dados"}
                        </Typography>
                        <Button
                            variant="contained"
                            size="large"
                            onClick={() => Router.push("/fipe")}
                            sx={{ marginTop: 3 }}
                        >
                            Voltar para página de busca
                        </Button>
                    </>
                ) : (
                    <>
                        <Typography
                            variant="h3"
                            component="h1"
                            fontWeight="bold"
                            align="center"
                        >
                            Resultado consulta FIPE
                        </Typography>

                        <Typography
                            variant="subtitle1"
                            fontWeight="light"
                            align="center"
                            lineHeight={1.3}
                            marginTop={2}
                        >
                            {vehicleData.brand} {vehicleData.model} - Ano{" "}
                            {vehicleData.year}
                        </Typography>
                        <Typography
                            variant="subtitle1"
                            fontWeight="light"
                            align="center"
                            lineHeight={1.3}
                        >
                            Valor no ultimo mês: R${" "}
                            {latestVehicleData?.price.toLocaleString("pt-BR", {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                            })}
                        </Typography>
                        <Container sx={{ marginTop: 3, height: "475px" }}>
                            <ResultChart data={chartData} />
                        </Container>

                        <Typography
                            variant="subtitle2"
                            fontWeight="light"
                            align="center"
                        >
                            Dados coletados em:{" "}
                            {new Date(
                                vehicleData.searchDate
                            ).toLocaleDateString()}
                        </Typography>
                    </>
                )}
            </Container>
        </>
    );
}
