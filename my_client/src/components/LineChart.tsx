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
import { _limitValue } from "chart.js/helpers";
import { useState } from "react";

ChartJS.register(
  TimeScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

type OverdueDataItem = {
  overdue_count: string; // או number, אם תרצה להמיר לוגית
  details: [
    {
      invoice_original_id: string;
      invoice_due_date: string;
      invoice_cost: string;
      invoice_currency: string;
    }
  ];
};

type OverdueLineChartProps = {
  data: OverdueDataItem[];
};

export default function LineChart({ data }: OverdueLineChartProps) {
  const today = new Date();
  const end = today;
  const start = new Date(today);
  start.setFullYear(today.getFullYear() - 1);

  // הגדרת state לתאריכים
  const [startDate, setStartDate] = useState(start);
  const [endDate, setEndDate] = useState(end);

  // פונקציות לעדכון התאריכים
  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStartDate(new Date(e.target.value));
  };

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEndDate(new Date(e.target.value));
  };

  // מיון הנתונים לפי תאריך
  const sortedData = data[0].details
    .map((item) => ({
      ...item,
      invoice_due_date: new Date(item.invoice_due_date),
    }))
    .sort(
      (a, b) => a.invoice_due_date.getTime() - b.invoice_due_date.getTime()
    );

  // סינון הנתונים כדי לכלול רק את אלו שנמצאים בטווח התאריכים
  const filteredData = sortedData.filter(
    (item) =>
      item.invoice_due_date >= startDate && item.invoice_due_date <= endDate
  );

  const lineData = {
    labels: filteredData.map((item) => item.invoice_due_date),
    datasets: [
      {
        label: "Overdue Invoices",

        data: filteredData.map((item) => parseFloat(item.invoice_cost)),
        borderColor: "#667292",
        backgroundColor: "#8d9db6",
        fill: false,
        tension: 0.5,
      },
    ],
  };

  const myOption: ChartOptions<"line"> = {
    responsive: true,
    scales: {
      x: {
        type: "time", // ציר זמן
        time: {
          unit: "day", // יחידות זמן
        },
        title: {
          display: true,
          text: "Date",
        },
      },
      y: {
        title: {
          display: true,
          text: "Overdue Invoices cost",
        },
      },
    },
  };
  return (
    <div>
      <h2 className="flex p-7 justify-center ">Overdue Invoice Trend</h2>

      {/* קלטים לתאריכים */}
      <div className="flex justify-center mb-4">
        <input
          type="date"
          value={startDate.toISOString().split("T")[0]} // המרה לפורמט תאריך
          onChange={handleStartDateChange}
          className="mr-2 border-4 border-[#bccad6]"
        />
        <input
          type="date"
          value={endDate.toISOString().split("T")[0]} // המרה לפורמט תאריך
          onChange={handleEndDateChange}
          className="ml-2 border-4 border-[#bccad6]"
        />
      </div>
      <Line data={lineData} options={myOption} />
    </div>
  );
}