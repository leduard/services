import { useFipe } from "@/context/Fipe";
import {
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    SelectChangeEvent,
} from "@mui/material";
import { useCallback } from "react";

export const VehicleYearField: React.FC = () => {
    const { userChoice, vehicleYearsList } = useFipe();

    const handleChange = useCallback(
        (event: SelectChangeEvent) => {
            const selectedValue = event.target.value;
            const Year = vehicleYearsList.find(
                (year) => year.id === selectedValue
            )!;

            userChoice.setVehicleYear(Year);
        },
        [userChoice, vehicleYearsList]
    );

    return (
        <FormControl fullWidth>
            <InputLabel id="vehicle-year-label">Ano do veículo</InputLabel>
            <Select
                labelId="vehicle-year-label"
                id="vehicle-year-select"
                label="Marca do veículo"
                value={userChoice.vehicleYear.id}
                onChange={handleChange}
            >
                {vehicleYearsList.map(({ id, name }, index) => (
                    <MenuItem key={index} value={id}>
                        {name}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
};
