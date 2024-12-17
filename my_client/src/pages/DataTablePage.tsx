import { useState, useEffect } from "react";

export default function DataTablePage() {
  const [invoices, setInvoices] = useState<any[]>([]); 
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const response = await fetch("http://localhost:3010/invoices/getAll");
        const data = await response.json();
        setInvoices(data); //Update the status with invoice data
      } catch (error) {
        console.error("Error fetching invoices:", error);
      }
    };

    const fetchSuppliers = async () => {
      try {
        const response = await fetch("http://localhost:3010/suppliers/getAll");
        const data = await response.json();
        setSuppliers(data);
      } catch (error) {
        console.error("Error fetching suppliers:", error);
      }
    };

    
    //executes both calls (Invoices + Suppliers) in parallel
    // when both complete (either succeed or fail) ends the loading state
    Promise.all([fetchInvoices(), fetchSuppliers()]).finally(() => {
      setLoading(false); // Marks the end of charging
    });
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Data Table</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="min-w-full table-auto border-collapse border border-gray-400 text-sm">
          <thead>
            <tr>
              <th className="border border-gray-400 px-2 py-1">Invoice ID</th>
              <th className="border border-gray-400 px-2 py-1">Invoice Date</th>
              <th className="border border-gray-400 px-2 py-1">Invoice Due Date</th>
              <th className="border border-gray-400 px-2 py-1">Invoice Cost</th>
              <th className="border border-gray-400 px-2 py-1">Invoice Currency</th>
              <th className="border border-gray-400 px-2 py-1">Invoice Status</th>
              <th className="border border-gray-400 px-2 py-1">Supplier Name</th>
              <th className="border border-gray-400 px-2 py-1">Supplier Email</th>
              <th className="border border-gray-400 px-2 py-1">Supplier Address</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((invoice) => {
              // search by invoice_id
              const supplier = suppliers.find((s) => s.supplier_id === invoice.supplier_id);
              return (
                <tr key={invoice.invoice_id}>
                  <td className="border border-gray-400 px-2 py-1">{invoice.invoice_original_id}</td>
                  <td className="border border-gray-400 px-2 py-1">{invoice.invoice_date}</td>
                  <td className="border border-gray-400 px-2 py-1">{invoice.invoice_due_date}</td>
                  <td className="border border-gray-400 px-2 py-1">{invoice.invoice_cost}</td>
                  <td className="border border-gray-400 px-2 py-1">{invoice.invoice_currency}</td>
                  <td className="border border-gray-400 px-2 py-1">{invoice.invoice_status}</td>
                  <td className="border border-gray-400 px-2 py-1">{supplier ? supplier.supplier_company_name : "Unknown"}</td>
                  <td className="border border-gray-400 px-2 py-1">{supplier ? supplier.supplier_email : "Unknown"}</td>
                  <td className="border border-gray-400 px-2 py-1">{supplier ? supplier.supplier_address : "Unknown"}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}

