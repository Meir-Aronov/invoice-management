import { useEffect, useState } from "react";
import PieChart from "../components/PieChart";
import LineChart from "../components/LineChart";
import BarChart from "../components/BarChart";
import axios from "axios";
import HorizontalBarChart from "../components/HorizontalBarChart";
import { buttonStyle } from "../styles/savedStyles";

export default function DashboardPage() {
  const [currentGraph, setCurrentGraph] = useState(0);

  const [aggregatedData, setAggregatedData] = useState([]);
  const [overdueTrend, setOverdueTrend] = useState([]);
  const [monthlySummary, setMonthlySummary] = useState([]);
  const [nameByCompany, setByCompany] = useState([]);

  const [companyName, setCompanyName] = useState("");

  const handleCustomerSelect = (customerName: string) => {
    setCompanyName(customerName);
  };

  // Fetch data from the server
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [aggregatedRes, overdueRes, monthlyRes, byCompany] = await Promise.all([
          axios.get("http://localhost:3010/invoices/aggregated-by-status"),
          axios.get("http://localhost:3010/invoices/overdue-invoices"),
          axios.get("http://localhost:3010/invoices/monthly-summary"),
          axios.get("http://localhost:3010/invoices/aggregated-by-company_name", { params: {name: companyName}}),
        ]);

        setAggregatedData(aggregatedRes.data);
        setOverdueTrend(overdueRes.data);
        setMonthlySummary(monthlyRes.data);
        setByCompany(byCompany.data)
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [companyName]);

  const graphs = [
    <PieChart data={aggregatedData} />,
    <LineChart data={overdueTrend} />,
    <BarChart data={monthlySummary} />,
    <HorizontalBarChart data={nameByCompany} onCustomerSelect={handleCustomerSelect}/>,
  ];

  const nextGraph = () => setCurrentGraph((prev) => (prev + 1) % graphs.length);
  const prevGraph = () =>
    setCurrentGraph((prev) => (prev - 1 + graphs.length) % graphs.length);
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <div className="flex items-center justify-between">
        <button
          className={buttonStyle}
          onClick={prevGraph}
        >
          ⬅
        </button>
        <div className="w-4/5">{graphs[currentGraph]}</div>
        <button
          className={buttonStyle}
          onClick={nextGraph}
        >
          ➡
        </button>
      </div>
    </div>
  );
}

