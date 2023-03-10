import { useTheme } from "@mui/material";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    ChartOptions,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
    Legend
);

interface ResultChartProps {
    data: VehicleData[];
}

export default function ResultChart({ data }: ResultChartProps) {
    const theme = useTheme();

    const options: ChartOptions<"line"> = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { position: "bottom" as const },
        },
    };

    const labels = data.map((d) => {
        const date = new Date(d.referenceDate.date!);
        return date.toLocaleDateString().slice(3);
    });

    return (
        <Line
            options={options}
            data={{
                labels,
                datasets: [
                    {
                        label: data[0].model,
                        data: labels.map((_, index) => data[index].price),
                        borderColor: theme.palette.secondary.dark,
                        backgroundColor: theme.palette.secondary.dark,
                    },
                ],
            }}
        />
    );
}
