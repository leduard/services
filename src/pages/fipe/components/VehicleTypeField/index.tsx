import { useFipe } from "@/context/Fipe";
import { VehicleType } from "@/utils/api/FipeService";
import {
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    SelectChangeEvent,
} from "@mui/material";
import { useCallback } from "react";

interface VehicleTypeFieldProps {
    brands: {
        car: VehicleBrand[];
        motorcycle: VehicleBrand[];
        truck: VehicleBrand[];
    };
}

export const VehicleTypeField: React.FC<VehicleTypeFieldProps> = ({
    brands,
}) => {
    const { userChoice, setVehicleBrandsList } = useFipe();

    const handleChange = useCallback(
        (event: SelectChangeEvent) => {
            const selectedValue = event.target.value as VehicleType;

            userChoice.setVehicleType(selectedValue);
            setVehicleBrandsList(brands[selectedValue]);
        },
        [brands, setVehicleBrandsList, userChoice]
    );

    return (
        <FormControl fullWidth>
            <InputLabel id="vehicle-type-label">Tipo de veículo</InputLabel>
            <Select
                labelId="vehicle-type-label"
                id="vehicle-type-select"
                label="Tipo de veículo"
                value={userChoice.vehicleType}
                onChange={handleChange}
            >
                <MenuItem value={"car"}>Carro</MenuItem>
                <MenuItem value={"motorcycle"}>Moto</MenuItem>
                <MenuItem value={"truck"}>Caminhão</MenuItem>
            </Select>
        </FormControl>
    );
};
