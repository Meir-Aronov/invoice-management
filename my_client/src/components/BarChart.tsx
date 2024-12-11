import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

type MonthlySummaryItem = {
  month: string;
  year: string;
  total_amount: string;
};

type MonthlyBarChartProps = {
  data: MonthlySummaryItem[];
};

export default function BarChart({ data }: MonthlyBarChartProps) {
  const barData = {
    labels: data.map((item) => `${item.month}/${item.year}`),
    datasets: [
      {
        label: "Total Invoice Amount",
        data: data.map((item) => parseFloat(item.total_amount)),
        backgroundColor: "#8d9db6",
        borderWidth: 1,
      },
    ],
  };
  return (
    <div>
      <h2 className="flex p-11 justify-center text-[#667292] " >Monthly Invoice Summary</h2>
      <Bar data={barData} />
    </div>
  );
}
