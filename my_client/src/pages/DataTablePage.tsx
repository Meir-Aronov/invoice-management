export default function DataTablePage() {
  const data = [
    { id: 1, client: "Client A", status: "Paid", date: "2024-01-01" },
    { id: 2, client: "Client B", status: "Unpaid", date: "2024-02-15" },
  ];
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Data Table</h1>
      <table className="min-w-full border-collapse border border-gray-400">
        <thead>
          <tr>
            <th className="border border-gray-400 px-4 py-2">ID</th>
            <th className="border border-gray-400 px-4 py-2">Client</th>
            <th className="border border-gray-400 px-4 py-2">Status</th>
            <th className="border border-gray-400 px-4 py-2">Date</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row.id}>
              <td className="border border-gray-400 px-4 py-2">{row.id}</td>
              <td className="border border-gray-400 px-4 py-2">{row.client}</td>
              <td className="border border-gray-400 px-4 py-2">{row.status}</td>
              <td className="border border-gray-400 px-4 py-2">{row.date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
