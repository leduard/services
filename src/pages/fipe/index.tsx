import { useCallback, useState } from "react";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import Head from "next/head";
import FipeService, { VehicleType } from "@/utils/api/FipeService";
import {
    Container,
    Box,
    FormControl,
    InputLabel,
    Link,
    Select,
    MenuItem,
    SelectChangeEvent,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";

import { Title, Description, Form } from "@/styles/components/fipe";
import api from "@/utils/api";

type ServerSidePropsData = {
    tables: ReferenceTable[];
    currentYearTable: ReferenceTable;
    brands: {
        car: VehicleBrand[];
        motorcycle: VehicleBrand[];
        truck: VehicleBrand[];
    };
};

export const getServerSideProps: GetServerSideProps<
    ServerSidePropsData
> = async (_context) => {
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
            tables,
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
    tables,
    brands,
    currentYearTable,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
    const theme = useTheme();

    const [vehicleBrands, setVehicleBrands] = useState<VehicleBrand[]>([]);
    const [vehicleModels, setVehicleModels] = useState<VehicleModel[]>([]);
    const [vehicleYears, setVehicleYears] = useState<VehicleModelYear[]>([]);

    const [vehicleType, setVehicleType] = useState<VehicleType>("" as any);
    const [vehicleBrand, setVehicleBrand] = useState<VehicleBrand>({
        name: "",
        id: "",
    });
    const [vehicleModel, setVehicleModel] = useState<VehicleBrand>({
        name: "",
        id: "",
    });
    const [vehicleYear, setVehicleYear] = useState<VehicleModelYear>({
        name: "",
        id: "",
    });

    const handleVehicleTypeSelect = useCallback(
        (event: SelectChangeEvent) => {
            const selectedType = event.target
                .value as keyof ServerSidePropsData["brands"];

            setVehicleType(selectedType);
            setVehicleBrands(brands[selectedType]);
        },
        [brands]
    );

    const handleVehicleBrandSelect = useCallback(
        async (event: SelectChangeEvent) => {
            const selectedValue = event.target.value;
            const brand = vehicleBrands.find(
                (brand) => brand.id === selectedValue
            )!;

            setVehicleBrand(brand);

            const vehicleModelsResponse = await api.get<VehicleModel[]>(
                "/fipe/models",
                {
                    params: {
                        vehicleType,
                        referenceTableId: currentYearTable.Codigo,
                        brandId: brand.id,
                    },
                }
            );

            setVehicleModels(vehicleModelsResponse.data);
        },
        [currentYearTable.Codigo, vehicleBrands, vehicleType]
    );

    const handleVehicleModelSelect = useCallback(
        async (event: SelectChangeEvent) => {
            const selectedValue = event.target.value;
            const model = vehicleModels.find(
                (model) => model.id === selectedValue
            )!;

            setVehicleModel(model);

            const vehicleModelYearsResponse = await api.get<VehicleModelYear[]>(
                "/fipe/model-years",
                {
                    params: {
                        vehicleType,
                        referenceTableId: currentYearTable.Codigo,
                        brandId: vehicleBrand.id,
                        modelId: model.id,
                    },
                }
            );

            setVehicleYears(vehicleModelYearsResponse.data);
        },
        [currentYearTable.Codigo, vehicleBrand.id, vehicleModels, vehicleType]
    );

    const handleVehicleYearSelect = useCallback(
        async (event: SelectChangeEvent) => {
            const selectedValue = event.target.value;
            const year = vehicleYears.find(
                (year) => year.id === selectedValue
            )!;

            setVehicleYear(year);

            console.log(
                FipeService.filterReferenceTablesByModelYear(tables, year)
            );

            const res = await api.post<VehicleModelYear[]>(
                "/fipe/history",
                {
                    referenceTables:
                        FipeService.filterReferenceTablesByModelYear(
                            tables,
                            year
                        ),
                },
                {
                    params: {
                        vehicleType,
                        referenceTableId: currentYearTable.Codigo,
                        brandId: vehicleBrand.id,
                        modelId: vehicleModel.id,
                        yearString: year.id,
                    },
                }
            );

            console.log(res);
        },
        [
            currentYearTable.Codigo,
            tables,
            vehicleBrand.id,
            vehicleModel.id,
            vehicleType,
            vehicleYears,
        ]
    );

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
                    <FormControl fullWidth>
                        <InputLabel id="vehicle-type-label">
                            Tipo de veículo
                        </InputLabel>
                        <Select
                            labelId="vehicle-type-label"
                            id="vehicle-type-select"
                            label="Tipo de veículo"
                            value={vehicleType}
                            onChange={handleVehicleTypeSelect}
                        >
                            <MenuItem value={"car"}>Carro</MenuItem>
                            <MenuItem value={"motorcycle"}>Moto</MenuItem>
                            <MenuItem value={"truck"}>Caminhão</MenuItem>
                        </Select>
                    </FormControl>

                    <FormControl fullWidth>
                        <InputLabel id="vehicle-brand-label">
                            Marca do veículo
                        </InputLabel>
                        <Select
                            labelId="vehicle-brand-label"
                            id="vehicle-brand-select"
                            label="Marca do veículo"
                            value={vehicleBrand.id}
                            onChange={handleVehicleBrandSelect}
                        >
                            {vehicleBrands.map(({ id, name }, index) => (
                                <MenuItem key={index} value={id}>
                                    {name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <FormControl fullWidth>
                        <InputLabel id="vehicle-model-label">
                            Modelo do veículo
                        </InputLabel>
                        <Select
                            labelId="vehicle-model-label"
                            id="vehicle-model-select"
                            label="Modelo do veículo"
                            value={vehicleModel.id}
                            onChange={handleVehicleModelSelect}
                        >
                            {vehicleModels &&
                                vehicleModels.map(({ id, name }, index) => (
                                    <MenuItem key={index} value={id}>
                                        {name}
                                    </MenuItem>
                                ))}
                        </Select>
                    </FormControl>

                    <FormControl fullWidth>
                        <InputLabel id="vehicle-year-label">
                            Ano do veículo
                        </InputLabel>
                        <Select
                            labelId="vehicle-year-label"
                            id="vehicle-year-select"
                            label="Ano do veículo"
                            value={vehicleYear.id}
                            onChange={handleVehicleYearSelect}
                        >
                            {vehicleYears &&
                                vehicleYears.map(({ id, name }, index) => (
                                    <MenuItem key={index} value={id}>
                                        {name}
                                    </MenuItem>
                                ))}
                        </Select>
                    </FormControl>
                </Form>
            </Container>
        </>
    );
}
