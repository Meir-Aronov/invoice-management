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

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

type MonthlySummaryItem = {
  supplier_company_name: string;
  total_cost_ils: string;
};

type MonthlyBarChartProps = {
  data: MonthlySummaryItem[];
  onCustomerSelect: (customerName: string) => void;
};

export default function HorizontalBarChart({data, onCustomerSelect}: MonthlyBarChartProps) {
  if (data.length === 0) {
    return <p className="text-center text-red-500 my-64">No data available to display the chart.</p>;
  }
  const [supplierCompanyName, setSupplierCompanyName] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onCustomerSelect(supplierCompanyName);
  };

  const barData = {
    labels: data.map(({ supplier_company_name }) => supplier_company_name),
    datasets: [
      {
        label: "Total Invoice Amount",
        data: data.map(({ total_cost_ils }) => parseFloat(total_cost_ils)),
        backgroundColor: ["#bccad6", "#8d9db6", "#667292", "#f1e3dd"],
        borderWidth: 1,
      },
    ],
  };

  const options: ChartOptions<"bar"> = {
    indexAxis: "y",
  };

  return (
    <div>
      <h2 className="p-7 pb-5 text-center text-[#667292]">Customer analysis</h2>
      <form onSubmit={handleSubmit} className="flex justify-center">
        <div className="relative">
          <input
            type="text"
            value={supplierCompanyName}
            onChange={(e) => setSupplierCompanyName(e.target.value)}
            className={`${inputStyle} pr-12 rounded-full w-96 h-auto`}
            placeholder="Enter Supplier Name"
          />
          <button
            type="submit"
            className={`${buttonStyle} absolute right-1 top-1 bottom-1 px-4`}
          >
            Submit
          </button>
        </div>
      </form>
      <Bar data={barData} options={options} />
    </div>
  );
}
