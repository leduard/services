import FipeService, { Vehicles, VehicleType } from "@/utils/api/FipeService";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<VehicleModel[] | ErrorResponse>
) {
    const { vehicleType, referenceTableId, brandId, modelId } =
        req.query as Record<string, string>;

    if (!vehicleType || !referenceTableId || !brandId || !modelId) {
        res.status(400).json({ error: "Missing parameters" });
        return;
    }

    if (!Vehicles.includes(vehicleType as any)) {
        res.status(400).json({ error: "Invalid vehicle type" });
        return;
    }

    const data = await FipeService.getVehicleModelYears(
        vehicleType as VehicleType,
        referenceTableId,
        brandId,
        modelId
    );

    if (!data) {
        res.status(500).json({ error: "Internal server error" });
        return;
    }

    res.status(200).json(parseModels(data));
}

function parseModels(models: FipeVehicleModelYear[]): VehicleModelYear[] {
    return models.map((model) => ({
        id: model.Value,
        name: model.Label,
    }));
}
