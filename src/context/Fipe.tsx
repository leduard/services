import { createContext, useContext, useEffect, useState } from "react";
import { VehicleType } from "@/utils/api/FipeService";
import api from "@/utils/api";

export interface FipeContextState {
    vehicleBrandsList: VehicleBrand[];
    setVehicleBrandsList: (brands: VehicleBrand[]) => void;
    vehicleModelsList: VehicleModel[];
    setVehicleModelsList: (models: VehicleModel[]) => void;
    vehicleYearsList: VehicleModelYear[];
    setVehicleYearsList: (years: VehicleModelYear[]) => void;

    table: ReferenceTable;
    setTable: (table: ReferenceTable) => void;

    userChoice: {
        vehicleType: VehicleType;
        setVehicleType: (type: VehicleType) => void;
        vehicleBrand: VehicleBrand;
        setVehicleBrand: (brand: VehicleBrand) => void;
        vehicleModel: VehicleModel;
        setVehicleModel: (model: VehicleModel) => void;
        vehicleYear: VehicleModelYear;
        setVehicleYear: (year: VehicleModelYear) => void;
    };
}

const FipeContext = createContext<FipeContextState>({} as FipeContextState);

export const FipeProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const [brandsList, setBrandsList] = useState<VehicleBrand[]>([]);
    const [modelsList, setModelsList] = useState<VehicleModel[]>([]);
    const [yearsList, setYearsList] = useState<VehicleModelYear[]>([]);

    const [vehicleType, setVehicleType] = useState<VehicleType>("" as any);
    const [brand, setBrand] = useState<VehicleBrand>({ name: "", id: "" });
    const [model, setModel] = useState<VehicleModel>({ name: "", id: "" });
    const [year, setYear] = useState<VehicleModelYear>({ name: "", id: "" });

    const [table, setTable] = useState<ReferenceTable>({ Codigo: 0, Mes: "" });

    // every time theres a change on the brand we need to
    // fetch the models for that brand and update the state
    useEffect(() => {
        async function fetchAndSetBrands() {
            const vehicleModelsResponse = await api.get<VehicleModel[]>(
                "/fipe/models",
                {
                    params: {
                        vehicleType,
                        referenceTableId: table.Codigo,
                        brandId: brand.id,
                    },
                }
            );

            setModelsList(vehicleModelsResponse.data);
        }

        if (brand.id) fetchAndSetBrands();
    }, [brand]); // eslint-disable-line react-hooks/exhaustive-deps

    // for the model too, when it changes we need to fetch the years
    useEffect(() => {
        async function fetchAndSetYears() {
            const vehicleModelYearsResponse = await api.get<VehicleModelYear[]>(
                "/fipe/model-years",
                {
                    params: {
                        vehicleType,
                        referenceTableId: table.Codigo,
                        brandId: brand.id,
                        modelId: model.id,
                    },
                }
            );

            setYearsList(vehicleModelYearsResponse.data);
        }

        if (model.id) fetchAndSetYears();
    }, [model]); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <FipeContext.Provider
            value={{
                table,
                setTable,
                vehicleBrandsList: brandsList,
                setVehicleBrandsList: setBrandsList,
                vehicleModelsList: modelsList,
                setVehicleModelsList: setModelsList,
                vehicleYearsList: yearsList,
                setVehicleYearsList: setYearsList,
                userChoice: {
                    vehicleType,
                    setVehicleType,
                    vehicleBrand: brand,
                    setVehicleBrand: setBrand,
                    vehicleModel: model,
                    setVehicleModel: setModel,
                    vehicleYear: year,
                    setVehicleYear: setYear,
                },
            }}
        >
            {children}
        </FipeContext.Provider>
    );
};

export function useFipe(): FipeContextState {
    const context = useContext(FipeContext);

    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }

    return context;
}
