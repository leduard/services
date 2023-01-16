import FipeService, { Vehicles, VehicleType } from "@/utils/api/FipeService";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<any>
) {
    const { referenceTables }: { referenceTables: ReferenceTable[] } = req.body;
    const { vehicleType, referenceTableId, brandId, modelId, yearString } =
        req.query as Record<string, string>;

    if (!vehicleType || !referenceTableId || !brandId || !modelId) {
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

    res.status(200).json(vehicleData);
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
