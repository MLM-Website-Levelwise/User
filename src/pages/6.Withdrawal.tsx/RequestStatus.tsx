import React, { useState } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { DashboardHeader } from "@/components/DashboardHeader";
import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";

interface Request {
  id: number;
  amount: number;
  date: string;
  status: "Pending" | "Approved" | "Rejected";
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
];

const Request_Status = () => {
  const [entriesPerPage, setEntriesPerPage] = useState(5); // Reduced default for mobile
  const [currentPage, setCurrentPage] = useState(1);

  const startIndex = (currentPage - 1) * entriesPerPage;
  const endIndex = startIndex + entriesPerPage;
  const paginatedData = dummyData.slice(startIndex, endIndex);
  const totalPages = Math.ceil(dummyData.length / entriesPerPage);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Approved":
        return "bg-green-100 text-green-800";
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      case "Rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="w-full bg-white rounded-lg shadow-sm border border-gray-200 mx-auto max-w-screen-2xl">
      {/* Header */}
      <div className="bg-gray-800 text-white px-4 sm:px-6 py-4 border-b border-gray-700 flex justify-center">
        <h2 className="text-lg sm:text-xl font-bold text-center">
          Withdrawal History
        </h2>
      </div>

      {/* Table Controls */}
      <div className="px-3 sm:px-6 py-3 border-b border-gray-200 bg-gray-50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center">
          <span className="text-xs sm:text-sm text-black mr-2">Show</span>
          <div className="relative">
            <select
              value={entriesPerPage}
              onChange={(e) => {
                setEntriesPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="appearance-none block w-16 sm:w-20 pl-2 sm:pl-3 pr-6 sm:pr-8 py-1 sm:py-2 border border-gray-300 rounded-md bg-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
            >
              {[5, 10, 25, 50].map((num) => (
                <option key={num} value={num}>
                  {num}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-1 sm:pr-2 pointer-events-none">
              <ChevronDown className="h-3 w-3 sm:h-4 sm:w-4 text-gray-600" />
            </div>
          </div>
          <span className="ml-2 text-xs sm:text-sm text-black">entries</span>
        </div>

        <div className="text-xs sm:text-sm text-black">
          Showing {startIndex + 1} to {Math.min(endIndex, dummyData.length)} of{" "}
          {dummyData.length} entries
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <div className="inline-block min-w-full align-middle">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-blue-600">
              <tr>
                <th
                  scope="col"
                  className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-white uppercase tracking-wider"
                >
                  #
                </th>
                <th
                  scope="col"
                  className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-white uppercase tracking-wider"
                >
                  Amount
                </th>
                <th
                  scope="col"
                  className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-white uppercase tracking-wider"
                >
                  Date
                </th>
                <th
                  scope="col"
                  className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-white uppercase tracking-wider"
                >
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedData.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="px-3 sm:px-6 py-4 text-center text-xs sm:text-sm text-black"
                  >
                    No withdrawal requests found
                  </td>
                </tr>
              ) : (
                paginatedData.map((item, index) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-3 sm:px-6 py-3 whitespace-nowrap text-xs sm:text-sm font-medium text-black">
                      {startIndex + index + 1}
                    </td>
                    <td className="px-3 sm:px-6 py-3 whitespace-nowrap text-xs sm:text-sm text-black">
                      ₹{item.amount.toLocaleString()}
                    </td>
                    <td className="px-3 sm:px-6 py-3 whitespace-nowrap text-xs sm:text-sm text-black">
                      {new Date(item.date).toLocaleDateString()}
                    </td>
                    <td className="px-3 sm:px-6 py-3 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 inline-flex text-xs leading-4 font-semibold rounded-full ${getStatusColor(
                          item.status
                        )}`}
                      >
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="px-3 sm:px-6 py-3 border-t border-gray-200 bg-gray-50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="text-xs sm:text-sm text-black">
          Page {currentPage} of {totalPages || 1}
        </div>
        <div className="flex space-x-1 sm:space-x-2">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => prev - 1)}
            className="relative inline-flex items-center px-2 sm:px-3 py-1 border border-gray-300 text-xs sm:text-sm font-medium rounded-md text-black bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="h-3 w-3 sm:h-4 sm:w-4 mr-0.5 sm:mr-1" />
            <span className="hidden sm:inline">Previous</span>
            <span className="sm:hidden">Prev</span>
          </button>
          <button
            disabled={currentPage === totalPages || totalPages === 0}
            onClick={() => setCurrentPage((prev) => prev + 1)}
            className="relative inline-flex items-center px-2 sm:px-3 py-1 border border-gray-300 text-xs sm:text-sm font-medium rounded-md text-black bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="hidden sm:inline">Next</span>
            <span className="sm:hidden">Next</span>
            <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4 ml-0.5 sm:ml-1" />
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
        <div className="flex-1 flex flex-col overflow-x-hidden">
          <DashboardHeader />
          <main className="flex-1 p-2 sm:p-4 md:p-6">
            <Request_Status />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default RequestStatus;
