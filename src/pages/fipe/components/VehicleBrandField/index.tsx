import { useFipe } from "@/context/Fipe";
import {
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    SelectChangeEvent,
} from "@mui/material";
import { useCallback } from "react";

export const VehicleBrandField: React.FC = () => {
    const { userChoice, vehicleBrandsList } = useFipe();

    const handleChange = useCallback(
        (event: SelectChangeEvent) => {
            const selectedValue = event.target.value;
            const brand = vehicleBrandsList.find(
                (brand) => brand.id === selectedValue
            )!;

            userChoice.setVehicleBrand(brand);
        },
        [userChoice, vehicleBrandsList]
    );

    return (
        <FormControl fullWidth>
            <InputLabel id="vehicle-brand-label">Marca do veículo</InputLabel>
            <Select
                labelId="vehicle-brand-label"
                id="vehicle-brand-select"
                label="Marca do veículo"
                value={userChoice.vehicleBrand.id}
                onChange={handleChange}
            >
                {vehicleBrandsList.map(({ id, name }, index) => (
                    <MenuItem key={index} value={id}>
                        {name}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
};
