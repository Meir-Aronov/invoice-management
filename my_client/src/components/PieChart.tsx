import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
ChartJS.register(ArcElement, Title, Tooltip, Legend);


type AggregatedDataItem = {
  invoice_status: string;
  total_amount: string;
};

type AggregatedPieChartProps = {
  data: AggregatedDataItem[];
};

export default function PieChart({ data }: AggregatedPieChartProps) {
  if (data.length === 0) {
    return <p className="text-center text-red-500 my-64">No data available to display the chart.</p>;
  }
  const pieData = {
    labels: data.map(({ invoice_status }) => invoice_status),
    datasets: [
      {
        data: data.map(({ total_amount }) => parseFloat(total_amount)),
        backgroundColor: ["#bccad6", "#8d9db6", "#667292", "#f1e3dd"],
      },
    ],
  };
  return (
    <div className="inset-0 w-[100%] h-[100%]">
      <h2 className="flex p-11 justify-center text-[#667292]" >Invoice Status Distribution</h2>
      <div >
        <Pie
          data={pieData}
          options={{
            maintainAspectRatio: false,
          }}
          style={{ width: "100%", height: "100%" }}
        />
      </div>
    </div>
  );
};