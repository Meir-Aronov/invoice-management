import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

type MonthlySummaryItem = {
  month: string;
  year: string;
  total_amount: string;
};

type MonthlyBarChartProps = {
  data: MonthlySummaryItem[];
};

export default function BarChart({ data }: MonthlyBarChartProps) {
  if (data.length === 0) {
    return <p className="text-center text-red-500 my-64">No data available to display the chart.</p>;
  }
  const barData = {
    labels: data.map(({ month, year }) => `${month}/${year}`),
    datasets: [
      {
        label: "Total Invoice Amount",
        data: data.map(({ total_amount }) => parseFloat(total_amount)),
        backgroundColor: ["#bccad6", "#8d9db6", "#667292", "#f1e3dd"],
        borderWidth: 5,
      },
    ],
  };

  return (
    <div className="p-11">
      <h2 className="text-center text-[#667292] mb-8">Monthly Invoice Summary</h2>
      <Bar data={barData} />
    </div>
  );
}

