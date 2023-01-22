import FipeService, { Vehicles, VehicleType } from "@/utils/api/FipeService";
import { MonthString, MonthStringToNumber } from "@/utils/monthMapping";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<VehicleData[] | ErrorResponse>
) {
    const { referenceTables }: { referenceTables: ReferenceTable[] } = req.body;
    const { vehicleType, brandId, modelId, yearString } = req.query as Record<
        string,
        string
    >;

    if (!vehicleType || !brandId || !modelId) {
        res.status(400).json({ error: "Missing parameters" });
        return;
    }

    if (!Vehicles.includes(vehicleType as any)) {
        res.status(400).json({ error: "Invalid vehicle type" });
        return;
    }

    const referenceTablesChunks = splitReferenceTableInChunks(referenceTables);
    const vehicleData: FipeVehicleData[] = [];

    for await (const referenceTablesChunk of referenceTablesChunks) {
        const dataPromises = referenceTablesChunk.map((referenceTable) =>
            FipeService.getVehicleData(
                vehicleType as VehicleType,
                String(referenceTable.Codigo),
                brandId,
                modelId,
                yearString
            )
        );

        const responses = await Promise.all(dataPromises);

        for (const response of responses) {
            vehicleData.push(response);
        }
    }

    const parsedData = parseData(vehicleData);
    res.status(200).json(parsedData);
}

function splitReferenceTableInChunks(
    referenceTables: ReferenceTable[],
    chunkSize: number = 20
): ReferenceTable[][] {
    const chunks: ReferenceTable[][] = [];

    for (let i = 0; i < referenceTables.length; i += chunkSize) {
        chunks.push(referenceTables.slice(i, i + chunkSize));
    }

    return chunks;
}

function parseData(data: FipeVehicleData[]): VehicleData[] {
    const parsedData: VehicleData[] = [];

    for (const vehicle of data) {
        if (!vehicle.Valor) continue;
        const price = vehicle.Valor.replace(/\,/i, ".")
            .replace(/R\$/i, "")
            .replace(/\./, "")
            .trim();
        const monthString =
            vehicle.MesReferencia.match(/^[A-zÀ-ú]+/i)?.find(Boolean);
        const yearString = vehicle.MesReferencia.match(/\d+/i)?.find(Boolean);
        const referenceDateMonth = monthString || "";
        const referenceDateYear = Number(yearString || "");

        const mappedMonth =
            MonthStringToNumber[referenceDateMonth as MonthString];

        const vehicleData: VehicleData = {
            id: vehicle.Autenticacao,
            price: Number(price),
            brand: vehicle.Marca,
            model: vehicle.Modelo,
            year: vehicle.AnoModelo,
            fuelType: vehicle.Combustivel,
            fipeCode: vehicle.CodigoFipe,
            referenceDate: {
                month: referenceDateMonth,
                year: referenceDateYear,
                date:
                    referenceDateMonth && referenceDateYear && mappedMonth
                        ? new Date(referenceDateYear, mappedMonth - 1)
                        : undefined,
            },
            authentication: vehicle.Autenticacao,
            vehicleType: vehicle.TipoVeiculo,
            fuelTypeShort: vehicle.SiglaCombustivel,
            searchDate: new Date(),
        };

        parsedData.push(vehicleData);
    }

    return parsedData.sort((_a, _b) => {
        const a = _a.referenceDate?.date!;
        const b = _b.referenceDate?.date!;
        const dateA = new Date(a).getTime();
        const dateB = new Date(b).getTime();
        return dateA - dateB;
    });
}
