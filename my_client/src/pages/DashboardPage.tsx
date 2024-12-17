
import { useEffect, useState, useMemo } from "react";
import PieChart from "../components/PieChart";
import LineChart from "../components/LineChart";
import BarChart from "../components/BarChart";
import HorizontalBarChart from "../components/HorizontalBarChart";
import axios from "axios";
import { buttonStyle } from "../styles/savedStyles";

type AggregatedStatusData = {
  invoice_status: string;
  total_amount: string;
}

type OverdueInvoice = {
  overdue_count: string;
  details: {
    invoice_original_id: string;
    invoice_due_date: string;
    invoice_cost: string;
    invoice_currency: string;
  }[];
}

type MonthlySummaryData = {
  month: string;
  year: string;
  total_amount: string;
}

type AggregatedByCompanyData = {
  supplier_company_name: string;
  total_cost_ils: string;
}

export default function DashboardPage() {
  const [currentGraph, setCurrentGraph] = useState(0);  //represents the current graph number
  const [aggregatedData, setAggregatedData] = useState<AggregatedStatusData[]>([]);
  const [overdueTrend, setOverdueTrend] = useState<OverdueInvoice[]>([]);
  const [monthlySummary, setMonthlySummary] = useState<MonthlySummaryData[]>([]);
  const [nameByCompany, setByCompany] = useState<AggregatedByCompanyData[]>([]);

  const [companyName, setCompanyName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleNameSelect = (customerName: string) => {
    setCompanyName(customerName);
  };

  const fetchAggregatedData = async () => {
    const response = await axios.get<AggregatedStatusData[]>("http://localhost:3010/invoices/aggregated-by-status");
    setAggregatedData(response.data);
  };

  const fetchOverdueTrend = async () => {
    const response = await axios.get<OverdueInvoice[]>("http://localhost:3010/invoices/overdue-invoices");
    setOverdueTrend(response.data);
  };

  const fetchMonthlySummary = async () => {
    const response = await axios.get<MonthlySummaryData[]>("http://localhost:3010/invoices/monthly-summary");
    setMonthlySummary(response.data);
  };

  const fetchByCompany = async (name: string) => {
    const response = await axios.get<AggregatedByCompanyData[]>("http://localhost:3010/invoices/aggregated-by-company_name", {
      params: { name },
    });
    setByCompany(response.data);
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        fetchAggregatedData(),
        fetchOverdueTrend(),
        fetchMonthlySummary(),
        fetchByCompany(companyName),
      ]);
    } catch (err) {
      console.error("Error fetching data:", err);
      alert("Failed to fetch data. The data you entered appears to be incorrect.")
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [companyName]);

  //the useMemo ensures that processing is only performed if the data changes
  const processedAggregatedData: AggregatedStatusData[] = useMemo(() => 
    aggregatedData.map(item => ({
      invoice_status: item.invoice_status,
      total_amount: item.total_amount,
    })), 
    [aggregatedData]
  );

  const processedOverdueData: OverdueInvoice[] = useMemo(() => 
    overdueTrend.map(item => ({
      overdue_count: item.overdue_count,
      details: item.details.map(detail => ({
        invoice_original_id: detail.invoice_original_id,
        invoice_due_date: detail.invoice_due_date,
        invoice_cost: detail.invoice_cost,
        invoice_currency: detail.invoice_currency,
      })),
    })), 
    [overdueTrend]
  );

  const processedMonthlySummary: MonthlySummaryData[] = useMemo(() =>
    monthlySummary.map(item => ({
      month: item.month,
      year: item.year,
      total_amount: item.total_amount,
    })),
    [monthlySummary]
  );

  const processedNameByCompany: AggregatedByCompanyData[] = useMemo(() =>
    nameByCompany.map(item => ({
      supplier_company_name: item.supplier_company_name,
      total_cost_ils: item.total_cost_ils,
    })),
    [nameByCompany]
  );  
  
  const graphs = useMemo(() => [
    <PieChart data={processedAggregatedData} />,
    <LineChart data={processedOverdueData} />,
    <BarChart data={processedMonthlySummary} />,
    <HorizontalBarChart data={processedNameByCompany} onNameSelect={handleNameSelect} />,
  ], [processedAggregatedData, processedOverdueData, processedMonthlySummary, processedNameByCompany]);

  const nextGraph = () => setCurrentGraph((prev) => (prev + 1) % graphs.length);
  const prevGraph = () => setCurrentGraph((prev) => (prev - 1 + graphs.length) % graphs.length);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      {loading && <div>Loading data...</div>}
      {!loading && (
        <div className="flex items-center justify-between">
          <button className={buttonStyle} onClick={prevGraph}>
            ⬅
          </button>
          <div className="w-4/5">{graphs[currentGraph]}</div>
          <button className={buttonStyle} onClick={nextGraph}>
            ➡
          </button>
        </div>
      )}
    </div>
  );
}
