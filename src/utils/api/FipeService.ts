import axios from "axios";

const FipeAPI = axios.create({
    baseURL: "https://veiculos.fipe.org.br/api/veiculos/",
});

export const Vehicles = ["car", "motorcycle", "truck"] as const;
export type VehicleType = typeof Vehicles[number];

export default class FipeService {
    static parseVehicleType(vehicleType: VehicleType): number {
        if (vehicleType === "car") return 1;
        if (vehicleType === "motorcycle") return 2;
        if (vehicleType === "truck") return 3;
        return 1;
    }

    static async getReferenceTables(): Promise<ReferenceTable[]> {
        const path = "/ConsultarTabelaDeReferencia";

        try {
            const response = await FipeAPI.post<ReferenceTable[]>(path);

            return response.data;
        } catch (err) {
            console.log(err);
            return [];
        }
    }

    static filterReferenceTablesByModelYear(
        referenceTables: ReferenceTable[],
        modelYearID: string
    ): ReferenceTable[] {
        const modelYear = Number(modelYearID.split("-")[0]);

        const filteredReferenceTables = referenceTables.filter(
            (referenceTable) => {
                const referenceTableYear = Number(
                    referenceTable.Mes.split("/")[1]
                );

                return referenceTableYear >= modelYear;
            }
        );

        return filteredReferenceTables;
    }

    static async getVehicleBrands(
        vehicleType: VehicleType,
        referenceTableId: number
    ): Promise<VehicleBrand[]> {
        const path = "/ConsultarMarcas";

        try {
            const response = await FipeAPI.post<FipeVehicleBrand[]>(path, {
                codigoTabelaReferencia: referenceTableId,
                codigoTipoVeiculo: this.parseVehicleType(vehicleType),
            });

            const parsedData = response.data.map((brand) => ({
                id: brand.Value,
                name: brand.Label,
            }));

            return parsedData;
        } catch (err) {
            console.log(err);
            return [];
        }
    }

    static async getVehicleModels(
        vehicleType: VehicleType,
        referenceTableId: string,
        brandId: string
    ): Promise<FipeVehicleModels> {
        const path = "/ConsultarModelos";

        try {
            const response = await FipeAPI.post(path, {
                codigoTipoVeiculo: this.parseVehicleType(vehicleType),
                codigoTabelaReferencia: referenceTableId,
                codigoMarca: brandId,
            });

            return response.data;
        } catch (err) {
            console.log(err);
            return { Modelos: [], Anos: [] };
        }
    }

    static async getVehicleModelYears(
        vehicleType: VehicleType,
        referenceTableId: string,
        brandId: string,
        modelId: string
    ): Promise<FipeVehicleModelYear[]> {
        const path = "/ConsultarAnoModelo";

        try {
            const response = await FipeAPI.post(path, {
                codigoTipoVeiculo: this.parseVehicleType(vehicleType),
                codigoTabelaReferencia: referenceTableId,
                codigoMarca: brandId,
                codigoModelo: modelId,
            });

            return response.data;
        } catch (err) {
            console.log(err);
            return [];
        }
    }

    static async getVehicleData(
        vehicleType: VehicleType,
        referenceTableId: string,
        brandId: string,
        modelId: string,
        yearResponse: string
    ): Promise<FipeVehicleData> {
        const path = "/ConsultarValorComTodosParametros";
        const year = yearResponse.split("-").find(Boolean);

        try {
            const response = await FipeAPI.post(path, {
                codigoTipoVeiculo: this.parseVehicleType(vehicleType),
                codigoTabelaReferencia: referenceTableId,
                codigoMarca: brandId,
                codigoModelo: modelId,
                anoModelo: year,
                codigoTipoCombustivel: 1,
                tipoConsulta: "tradicional",
            });

            return response.data;
        } catch (err) {
            console.log(err);
            return {} as FipeVehicleData;
        }
    }
}
