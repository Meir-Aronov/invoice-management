import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  //   ChartData,
} from "chart.js";
ChartJS.register(ArcElement, Title, Tooltip, Legend);

// Typing the props
type AggregatedDataItem = {
  invoice_status: string;
  total_amount: string;
};

type AggregatedPieChartProps = {
  data: AggregatedDataItem[];
};

const PieChart = ({ data }: AggregatedPieChartProps) => {
  const pieData = {
    labels: data.map((item) => item.invoice_status),
    datasets: [
      {
        data: data.map((item) => parseFloat(item.total_amount)),
        backgroundColor: [
            "#bccad6",
            "#8d9db6",
            "#667292",
            "#f1e3dd",
        ],
      },
    ],
  };
  return (
    <div className="inset-0 w-[100%] h-[100%]">
      <h2 className="flex p-11 justify-center " >Invoice Status Distribution</h2>
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

export default PieChart;

// style={{ inset: 0, width: "100%", height: "100%" }}

        //   "rgb(255, 127, 80)",
        //   "rgb(233, 150, 122)",
        //   "rgb(189, 183, 107)",
        //   "rgb(143, 188, 143)",