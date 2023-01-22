import { useEffect, useState } from "react";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import Head from "next/head";
import Router from "next/router";
import { Container, Box, Link } from "@mui/material";

import FipeService from "@/utils/api/FipeService";
import { useFipe } from "@/context/Fipe";

import { VehicleTypeField } from "./components/VehicleTypeField";
import { VehicleBrandField } from "./components/VehicleBrandField";
import { VehicleModelField } from "./components/VehicleModelField";
import { VehicleYearField } from "./components/VehicleYear";
import { Title, Description, Form } from "./components";
import { LoadingButton } from "@mui/lab";

type ServerSidePropsData = {
    currentYearTable: ReferenceTable;
    brands: {
        car: VehicleBrand[];
        motorcycle: VehicleBrand[];
        truck: VehicleBrand[];
    };
};

export const getServerSideProps: GetServerSideProps<
    ServerSidePropsData
> = async () => {
    const tables = await FipeService.getReferenceTables();
    const currentYearTable = tables
        .sort((a, b) => b.Codigo - a.Codigo)
        .find(Boolean)!;

    const [carBrands, motorcycleBrands, truckBrands] = await Promise.all([
        FipeService.getVehicleBrands("car", currentYearTable?.Codigo),
        FipeService.getVehicleBrands("motorcycle", currentYearTable?.Codigo),
        FipeService.getVehicleBrands("truck", currentYearTable?.Codigo),
    ]);

    return {
        props: {
            currentYearTable,
            brands: {
                car: carBrands,
                motorcycle: motorcycleBrands,
                truck: truckBrands,
            },
        },
    };
};

export default function Fipe({
    brands,
    currentYearTable,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
    const {
        setTable,
        userChoice: { vehicleType, vehicleBrand, vehicleModel, vehicleYear },
    } = useFipe();

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setTable(currentYearTable);
    }, [currentYearTable, setTable]);

    const buttonDisabled =
        !vehicleType ||
        !vehicleBrand?.id ||
        !vehicleModel?.id ||
        !vehicleYear?.id;

    return (
        <>
            <Head>
                <title>Consulta dados FIPE</title>
                <meta
                    name="description"
                    content="Consulta de dados da table FIPE"
                />
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
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <Title>Consulta dados FIPE</Title>
                    <Description>
                        Selecione a marca, o modelo e o ano do veículo para
                        consultar os dados da tabela FIPE. Os dados retornados
                        por esta aplicação são provenientes da API da{" "}
                        <Link
                            href="https://www.fipe.org.br/"
                            target={"_blank"}
                            rel="noreferrer"
                        >
                            FIPE
                        </Link>
                        .
                    </Description>
                </Box>

                <Form>
                    <VehicleTypeField brands={brands} />
                    <VehicleBrandField />
                    <VehicleModelField />
                    <VehicleYearField />

                    <LoadingButton
                        variant="contained"
                        size="large"
                        disableElevation
                        fullWidth
                        disabled={buttonDisabled}
                        loading={loading}
                        onClick={() => {
                            setLoading(true);
                            Router.push({
                                pathname: "/fipe/results",
                                query: {
                                    vehicleType: vehicleType,
                                    vehicleBrand: vehicleBrand?.id,
                                    vehicleModel: vehicleModel?.id,
                                    vehicleYear: vehicleYear?.id,
                                },
                            });
                        }}
                    >
                        Buscar
                    </LoadingButton>
                </Form>
            </Container>
        </>
    );
}
