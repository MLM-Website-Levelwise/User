import React, { useState } from "react";

import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { DashboardHeader } from "@/components/DashboardHeader";

interface Request {
  id: number;
  amount: number;
  date: string;
  status: string;
}

const dummyData: Request[] = [
  { id: 1, amount: 100, date: "2025-06-10", status: "Pending" },
  { id: 2, amount: 250, date: "2025-06-11", status: "Approved" },
  { id: 3, amount: 300, date: "2025-06-12", status: "Rejected" },
  { id: 4, amount: 150, date: "2025-06-13", status: "Pending" },
  { id: 5, amount: 500, date: "2025-06-14", status: "Approved" },
  { id: 6, amount: 450, date: "2025-06-15", status: "Approved" },
  { id: 7, amount: 200, date: "2025-06-16", status: "Pending" },
  { id: 8, amount: 100, date: "2025-06-17", status: "Rejected" },
  { id: 9, amount: 350, date: "2025-06-18", status: "Pending" },
  { id: 10, amount: 275, date: "2025-06-19", status: "Approved" },
]; // Add entries here when needed

const Request_Status = () => {
  const [search, setSearch] = useState("");
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const filteredData = dummyData.filter(
    (item) =>
      item.amount.toString().includes(search) ||
      item.date.includes(search) ||
      item.status.toLowerCase().includes(search.toLowerCase())
  );

  const startIndex = (currentPage - 1) * entriesPerPage;
  const endIndex = startIndex + entriesPerPage;
  const paginatedData = filteredData.slice(startIndex, endIndex);

  const totalPages = Math.ceil(filteredData.length / entriesPerPage);

  return (
    <div className="max-w-full mx-auto bg-gradient-to-br from-yellow-50 to-red-50 p-6 rounded-md shadow-md border border-gray-200 overflow-x-auto">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Withdraw History
      </h2>

      <div className="flex justify-between items-center mb-4">
        <div>
          <label className="text-sm mr-2">Show</label>
          <select
            value={entriesPerPage}
            onChange={(e) => {
              setEntriesPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="border border-gray-300 rounded px-2 py-1 text-sm"
          >
            {[10, 25, 50, 100].map((num) => (
              <option key={num} value={num}>
                {num}
              </option>
            ))}
          </select>
          <span className="ml-2 text-sm">entries</span>
        </div>

        <div>
          <label className="text-sm mr-2">Search:</label>
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="border border-gray-300 rounded px-2 py-1 text-sm"
            placeholder="Search..."
          />
        </div>
      </div>

      <table className="min-w-full border border-gray-300 text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2 border">Sl No</th>
            <th className="px-4 py-2 border">Amount</th>
            <th className="px-4 py-2 border">Date</th>
            <th className="px-4 py-2 border">Status</th>
          </tr>
        </thead>
        <tbody>
          {paginatedData.length === 0 ? (
            <tr>
              <td colSpan={4} className="text-center py-4">
                No data available in table
              </td>
            </tr>
          ) : (
            paginatedData.map((item, index) => (
              <tr key={item.id} className="text-center">
                <td className="px-4 py-2 border">{startIndex + index + 1}</td>
                <td className="px-4 py-2 border">{item.amount} rs</td>
                <td className="px-4 py-2 border">{item.date}</td>
                <td className="px-4 py-2 border">{item.status}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <div className="flex justify-between items-center mt-4 text-sm">
        <span>
          Showing {startIndex + 1} to {Math.min(endIndex, filteredData.length)}{" "}
          of {filteredData.length} entries
        </span>
        <div>
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => prev - 1)}
            className="px-3 py-1 border border-gray-300 rounded mr-2 disabled:opacity-50"
          >
            Previous
          </button>
          <button
            disabled={currentPage === totalPages || totalPages === 0}
            onClick={() => setCurrentPage((prev) => prev + 1)}
            className="px-3 py-1 border border-gray-300 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};
const RequestStatus = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <DashboardHeader />
          <main className="flex-1 p-6">
            <Request_Status />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default RequestStatus;
