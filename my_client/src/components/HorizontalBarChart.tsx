import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
} from "chart.js";
import { useState } from "react";
import { buttonStyle, inputStyle } from "../styles/savedStyles";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

type MonthlySummaryItem = {
  supplier_company_name: string;
  total_cost_ils: string;
};

type MonthlyBarChartProps = {
  data: MonthlySummaryItem[];
  onCustomerSelect: (customerName: string) => void;
};

export default function HorizontalBarChart({
  data,
  onCustomerSelect,
}: MonthlyBarChartProps) {
  const [supplierCompanyName, setsupplierCompanyName] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setsupplierCompanyName(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onCustomerSelect(supplierCompanyName);
  };

  const barData = {
    labels: data.map((item) => `${item.supplier_company_name}`),
    datasets: [
      {
        label: "Total Invoice Amount",
        data: data.map((item) => parseFloat(item.total_cost_ils)),
        backgroundColor: "#8d9db6",
        borderWidth: 1,
      },
    ],
  };
  const options: ChartOptions<"bar"> = {
    indexAxis: "y",
  };
  return (
    <div>
      <h2 className="flex p-7 justify-center ">Monthly Invoice Summary</h2>
      <form onSubmit={handleSubmit} className="flex mr-2 justify-center">
        <div className="relative">
          <input
            type="text"
            onChange={handleChange}
            className={inputStyle + " pr-12 rounded-full w-96 h-auto "} // מוסיף padding מימין כדי לפנות מקום לכפתור
          />
          <button
            type="submit"
            className={buttonStyle + " absolute right-1 top-1 bottom-1 px-4"}
          >
            Submit
          </button>
        </div>
      </form>
      <Bar data={barData} options={options} />
    </div>
  );
}
