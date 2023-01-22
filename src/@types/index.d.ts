interface ErrorResponse {
    error: string;
}

interface VehicleBrand {
    id: string;
    name: string;
}

interface VehicleModel {
    id: string;
    name: string;
}

interface VehicleModelYear {
    /** ("2014-1") */
    id: string;
    /** ("2018 Gasolina") */
    name: string;
}

interface VehicleData {
    id: string;
    price: number;
    brand: string;
    model: string;
    year: number;
    fuelType: string;
    fipeCode: string;
    referenceDate: {
        month: string;
        year: number;
        date?: Date;
    };
    authentication: string;
    vehicleType: number;
    fuelTypeShort: string;
    searchDate: Date;
}
