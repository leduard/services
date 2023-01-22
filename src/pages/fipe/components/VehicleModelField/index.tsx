import { useFipe } from "@/context/Fipe";
import {
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    SelectChangeEvent,
} from "@mui/material";
import { useCallback } from "react";

export const VehicleModelField: React.FC = () => {
    const { userChoice, vehicleModelsList } = useFipe();

    const handleChange = useCallback(
        (event: SelectChangeEvent) => {
            const selectedValue = event.target.value;
            const Model = vehicleModelsList.find(
                (model) => model.id === selectedValue
            )!;

            userChoice.setVehicleModel(Model);
        },
        [userChoice, vehicleModelsList]
    );

    return (
        <FormControl fullWidth>
            <InputLabel id="vehicle-model-label">Modelo do veículo</InputLabel>
            <Select
                labelId="vehicle-model-label"
                id="vehicle-model-select"
                label="Marca do veículo"
                value={userChoice.vehicleModel.id}
                onChange={handleChange}
            >
                {vehicleModelsList.map(({ id, name }, index) => (
                    <MenuItem key={index} value={id}>
                        {name}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
};
