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
