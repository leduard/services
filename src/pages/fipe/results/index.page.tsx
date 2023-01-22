import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { Container } from "@mui/material";
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

    return (
        <>
            <Head>
                <title>Resultado consulta</title>
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
                <h1>xd</h1>
                <ResultChart data={chartData} />
            </Container>
        </>
    );
}
