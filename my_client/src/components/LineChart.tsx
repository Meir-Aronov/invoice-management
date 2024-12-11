import "chartjs-adapter-date-fns";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  TimeScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
} from "chart.js";
import { useState } from "react";

ChartJS.register(TimeScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

type InvoiceDetail = {
  invoice_original_id: string;
  invoice_due_date: string;
  invoice_cost: string;
  invoice_currency: string;
};

type OverdueDataItem = {
  overdue_count: string;
  details: InvoiceDetail[];
};

type OverdueLineChartProps = {
  data: OverdueDataItem[];
};

export default function LineChart({ data }: OverdueLineChartProps) {
  if (data.length === 0) {
    return <p className="text-center text-red-500 my-64">No data available to display the chart.</p>;
  }
  const today = new Date();
  const [startDate, setStartDate] = useState(new Date(today.getFullYear() - 1, today.getMonth(), today.getDate()));
  const [endDate, setEndDate] = useState(today);

  // Sort the data by date
  const sortedData = data[0].details.map((item) => ({
    ...item,
    invoice_due_date: new Date(item.invoice_due_date),
  })).sort((a, b) => a.invoice_due_date.getTime() - b.invoice_due_date.getTime());

  //Filter the data to include only those within the date range
  const filteredData = sortedData.filter(
    ({ invoice_due_date }) => invoice_due_date >= startDate && invoice_due_date <= endDate
  );

  const lineData = {
    labels: filteredData.map(({ invoice_due_date }) => invoice_due_date),
    datasets: [
      {
        label: "Overdue Invoices",
        data: filteredData.map(({ invoice_cost }) => parseFloat(invoice_cost)),
        borderColor: ["#667292","#bccad6", "#8d9db6",  "#f1e3dd"],
        backgroundColor: ["#bccad6", "#8d9db6", "#667292", "#f1e3dd"],
        tension: 0.5,
      },
    ],
  };

  const options: ChartOptions<"line"> = {
    responsive: true,
    scales: {
      x: {
        type: "time",
        title: {
          display: true,
          text: "Date",
        },
      },
      y: {
        title: {
          display: true,
          text: "Overdue Invoice Cost",
        },
      },
    },
  };

  return (
    <div>
      <h2 className="p-7 text-center text-[#667292]">Overdue Invoice Trend</h2>
      <div className="flex justify-center mb-4">
        <input
          type="date"
          value={startDate.toISOString().split("T")[0]} // Convert to date format
          onChange={(e) => setStartDate(new Date(e.target.value))}
          className="mr-2 border-2 rounded"
        />
        <input
          type="date"
          value={endDate.toISOString().split("T")[0]}
          onChange={(e) => setEndDate(new Date(e.target.value))}
          className="ml-2 border-2 rounded"
        />
      </div>
      <Line data={lineData} options={options} />
    </div>
  );
}
