import React, { useEffect, useState } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { DashboardHeader } from "@/components/DashboardHeader";
import {
  Search,
  Calendar,
  Package,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

interface TopUpEntry {
  "sl no": number;
  "mem id": string;
  "mem name": string;
  "top up date": string;
  plan: string;
  amt: number;
  status: string;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const ITEMS_PER_PAGE = 20; // Number of items to show per page

const TopUp_Statement: React.FC = () => {
  const [topUpHistory, setTopUpHistory] = useState<TopUpEntry[]>([]);
  const [filteredHistory, setFilteredHistory] = useState<TopUpEntry[]>([]);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [packageFilter, setPackageFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchTopUpHistory = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/topup-statement`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to fetch data");
        }

        const data = await response.json();
        setTopUpHistory(data);
        setFilteredHistory(data);
      } catch (err) {
        console.error("Error fetching top-up history:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTopUpHistory();
  }, []);

  useEffect(() => {
    let filtered = [...topUpHistory];

    if (fromDate) {
      filtered = filtered.filter(
        (entry) => new Date(entry["top up date"]) >= new Date(fromDate)
      );
    }

    if (toDate) {
      filtered = filtered.filter(
        (entry) => new Date(entry["top up date"]) <= new Date(toDate)
      );
    }

    if (packageFilter.trim() !== "") {
      filtered = filtered.filter((entry) =>
        entry["plan"].toLowerCase().includes(packageFilter.toLowerCase())
      );
    }

    setFilteredHistory(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  }, [fromDate, toDate, packageFilter, topUpHistory]);

  // Calculate pagination variables
  const totalItems = filteredHistory.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, totalItems);
  const currentItems = filteredHistory.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">Loading...</div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64 text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-2 sm:p-4 lg:p-6">
      {/* Header */}
      <div className="bg-gray-800 text-white px-4 sm:px-6 py-4 border-b border-gray-700 flex justify-center">
        <h2 className="text-lg sm:text-xl font-bold text-center">
          Member Report
        </h2>
      </div>

      {/* Mobile Filter Toggle Button */}
      <div className="sm:hidden mt-2 mb-3">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="w-full flex items-center justify-between bg-gray-100 text-blue-700 p-3 rounded-lg"
        >
          <span className="flex items-center gap-2">
            <Search className="w-4 h-4" />
            Filter Transactions
          </span>
          {showFilters ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
      </div>

      {/* Filters */}
      <div
        className={`${
          showFilters ? "block" : "hidden"
        } sm:block bg-gray-200 p-3 sm:p-4 rounded-lg mb-3 mt-3`}
      >
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
              <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
              From Date
            </label>
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-200 text-xs sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
              <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
              To Date
            </label>
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-200 text-xs sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
              <Package className="w-3 h-3 sm:w-4 sm:h-4" />
              Package
            </label>
            <input
              type="text"
              value={packageFilter}
              onChange={(e) => setPackageFilter(e.target.value)}
              placeholder="e.g. Basic, Premium"
              className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-200 text-xs sm:text-sm"
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr className="bg-blue-600 text-white">
                <th className="px-3 py-2 sm:px-4 sm:py-3 text-left text-xs sm:text-sm font-medium whitespace-nowrap">
                  Sl No.
                </th>
                <th className="px-3 py-2 sm:px-4 sm:py-3 text-left text-xs sm:text-sm font-medium whitespace-nowrap">
                  Date
                </th>
                <th className="px-3 py-2 sm:px-4 sm:py-3 text-left text-xs sm:text-sm font-medium whitespace-nowrap">
                  Member ID
                </th>
                <th className="px-3 py-2 sm:px-4 sm:py-3 text-left text-xs sm:text-sm font-medium whitespace-nowrap">
                  Name
                </th>
                <th className="px-3 py-2 sm:px-4 sm:py-3 text-left text-xs sm:text-sm font-medium whitespace-nowrap">
                  Package
                </th>
                <th className="px-3 py-2 sm:px-4 sm:py-3 text-left text-xs sm:text-sm font-medium whitespace-nowrap">
                  Amount
                </th>
                <th className="px-3 py-2 sm:px-4 sm:py-3 text-left text-xs sm:text-sm font-medium whitespace-nowrap">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentItems.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-6 text-center text-gray-500"
                  >
                    <div className="flex flex-col items-center justify-center">
                      <Search className="w-8 h-8 text-gray-300 mb-2" />
                      <p className="text-gray-400">No transactions found</p>
                      <p className="text-xs text-gray-400 mt-1">
                        Try adjusting your filters
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                currentItems.map((entry, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-3 py-2 sm:px-4 sm:py-3 whitespace-nowrap text-xs sm:text-sm text-gray-500">
                      {filteredHistory.length - startIndex - index}
                    </td>
                    <td className="px-3 py-2 sm:px-4 sm:py-3 whitespace-nowrap text-xs sm:text-sm text-gray-500">
                      {new Date(entry["top up date"]).toLocaleDateString(
                        "en-IN",
                        {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        }
                      )}
                    </td>
                    <td className="px-3 py-2 sm:px-4 sm:py-3 whitespace-nowrap">
                      <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded-md text-xs sm:text-sm font-medium">
                        {entry["mem id"]}
                      </span>
                    </td>
                    <td className="px-3 py-2 sm:px-4 sm:py-3 whitespace-nowrap text-xs sm:text-sm text-gray-900">
                      {entry["mem name"]}
                    </td>
                    <td className="px-3 py-2 sm:px-4 sm:py-3 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 rounded-full text-xs sm:text-sm ${
                          entry["plan"].includes("Premium")
                            ? "bg-purple-100 text-purple-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {entry["plan"]}
                      </span>
                    </td>
                    <td className="px-3 py-2 sm:px-4 sm:py-3 whitespace-nowrap text-xs sm:text-sm font-semibold text-gray-900">
                      ${entry["amt"]}
                    </td>
                    <td className="px-3 py-2 sm:px-4 sm:py-3 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 rounded-md text-xs sm:text-sm ${
                          entry["status"] === "completed"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {entry["status"]}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
            <div className="flex flex-1 justify-between sm:hidden">
              <button
                onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className={`relative inline-flex items-center rounded-md border border-gray-300 px-4 py-2 text-sm font-medium ${
                  currentPage === 1
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-white text-gray-700 hover:bg-gray-50"
                }`}
              >
                Previous
              </button>
              <button
                onClick={() =>
                  handlePageChange(Math.min(totalPages, currentPage + 1))
                }
                disabled={currentPage === totalPages}
                className={`relative ml-3 inline-flex items-center rounded-md border border-gray-300 px-4 py-2 text-sm font-medium ${
                  currentPage === totalPages
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-white text-gray-700 hover:bg-gray-50"
                }`}
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing <span className="font-medium">{startIndex + 1}</span>{" "}
                  to <span className="font-medium">{endIndex}</span> of{" "}
                  <span className="font-medium">{totalItems}</span> results
                </p>
              </div>
              <div>
                <nav
                  className="isolate inline-flex -space-x-px rounded-md shadow-sm"
                  aria-label="Pagination"
                >
                  <button
                    onClick={() =>
                      handlePageChange(Math.max(1, currentPage - 1))
                    }
                    disabled={currentPage === 1}
                    className={`relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 ${
                      currentPage === 1 ? "cursor-not-allowed opacity-50" : ""
                    }`}
                  >
                    <span className="sr-only">Previous</span>
                    <ChevronLeft className="h-5 w-5" aria-hidden="true" />
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                          currentPage === page
                            ? "bg-blue-600 text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                            : "text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                        }`}
                      >
                        {page}
                      </button>
                    )
                  )}
                  <button
                    onClick={() =>
                      handlePageChange(Math.min(totalPages, currentPage + 1))
                    }
                    disabled={currentPage === totalPages}
                    className={`relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 ${
                      currentPage === totalPages
                        ? "cursor-not-allowed opacity-50"
                        : ""
                    }`}
                  >
                    <span className="sr-only">Next</span>
                    <ChevronRight className="h-5 w-5" aria-hidden="true" />
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const TopUpStatement = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        <AppSidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <DashboardHeader />
          <main className="flex-1 overflow-y-auto p-2 sm:p-4">
            <TopUp_Statement />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default TopUpStatement;
