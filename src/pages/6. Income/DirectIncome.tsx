

import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { DashboardHeader } from "@/components/DashboardHeader";
import { useState, useMemo } from "react";
import {
  Search,
  Filter,
  Calendar,
  DollarSign,
  Users,
  TrendingUp,
} from "lucide-react";

const DirectIncome = () => {
  // Sample data for direct income
  const [incomeData] = useState([
    {
      id: 1,
      date: "2024-06-25",
      memberId: "MLM001234",
      name: "John Smith",
      transactionType: "Activation",
      package: "Tour Package",
      packageAmount: 5000,
      income: 500,
    },
    {
      id: 2,
      date: "2024-06-24",
      memberId: "MLM001235",
      name: "Sarah Johnson",
      transactionType: "Re-top up",
      package: "Growth",
      packageAmount: 2000,
      income: 200,
    },
    {
      id: 3,
      date: "2024-06-23",
      memberId: "MLM001236",
      name: "Mike Wilson",
      transactionType: "Re-top up",
      package: "Growth",
      packageAmount: 10000,
      income: 1000,
    },
    {
      id: 4,
      date: "2024-06-22",
      memberId: "MLM001237",
      name: "Emma Davis",
      transactionType: "Re-top up",
      package: "Growth",
      packageAmount: 3000,
      income: 300,
    },
    {
      id: 5,
      date: "2024-06-21",
      memberId: "MLM001238",
      name: "Robert Brown",
      transactionType: "Re-top up",
      package: "Growth",
      packageAmount: 2500,
      income: 250,
    },
    {
      id: 6,
      date: "2024-06-20",
      memberId: "MLM001239",
      name: "Lisa Anderson",
      transactionType: "Re-top up",
      package: "Growth",
      packageAmount: 10000,
      income: 1000,
    },
    {
      id: 7,
      date: "2024-06-19",
      memberId: "MLM001240",
      name: "David Miller",
      transactionType: "Re-top up",
      package: "Growth",
      packageAmount: 4000,
      income: 400,
    },
    {
      id: 8,
      date: "2024-06-18",
      memberId: "MLM001241",
      name: "Jennifer Garcia",
      transactionType: "Re-top up",
      package: "Growth",
      packageAmount: 2500,
      income: 250,
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Filter data based on search and date filters
  const filteredData = useMemo(() => {
    return incomeData.filter((item) => {
      const matchesSearch =
        item.memberId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.name.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesDateFrom = !dateFrom || item.date >= dateFrom;
      const matchesDateTo = !dateTo || item.date <= dateTo;

      return matchesSearch && matchesDateFrom && matchesDateTo;
    });
  }, [incomeData, searchTerm, dateFrom, dateTo]);

  // Pagination
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  // Calculate totals
  const totalIncome = filteredData.reduce((sum, item) => sum + item.income, 0);
  const totalMembers = filteredData.length;
  const avgIncome = totalMembers > 0 ? totalIncome / totalMembers : 0;

  const clearFilters = () => {
    setSearchTerm("");
    setDateFrom("");
    setDateTo("");
    setCurrentPage(1);
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        <AppSidebar />
        <div className="flex-1 flex flex-col overflow-x-hidden">
          <DashboardHeader />
          <main className="flex-1 p-4 md:p-6 bg-gray-50">
            <div className="max-w-7xl mx-auto">
              {/* Summary Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-6">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs md:text-sm font-medium text-gray-600">
                        Total Direct Income
                      </p>
                      <p className="text-xl md:text-3xl font-bold text-green-600">
                        ${totalIncome.toLocaleString()}
                      </p>
                    </div>
                    <div className="bg-green-100 p-2 md:p-3 rounded-full">
                      <DollarSign className="h-5 w-5 md:h-6 md:w-6 text-green-600" />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs md:text-sm font-medium text-gray-600">
                        Total Referrals
                      </p>
                      <p className="text-xl md:text-3xl font-bold text-blue-600">
                        {totalMembers}
                      </p>
                    </div>
                    <div className="bg-blue-100 p-2 md:p-3 rounded-full">
                      <Users className="h-5 w-5 md:h-6 md:w-6 text-blue-600" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Filters */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-6 mb-4 md:mb-6">
                <div className="flex flex-col gap-4">
                  <div className="w-full">
                    <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1 md:mb-2">
                      Search by Member ID or Name
                    </label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Enter Member ID or Name..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm md:text-base"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1 md:mb-2">
                        Date From
                      </label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                          type="date"
                          value={dateFrom}
                          onChange={(e) => setDateFrom(e.target.value)}
                          className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm md:text-base"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1 md:mb-2">
                        Date To
                      </label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                          type="date"
                          value={dateTo}
                          onChange={(e) => setDateTo(e.target.value)}
                          className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm md:text-base"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      onClick={clearFilters}
                      className="px-3 py-1 md:px-4 md:py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200 flex items-center gap-1 md:gap-2 text-sm md:text-base"
                    >
                      <Filter className="h-3 w-3 md:h-4 md:w-4" />
                      Clear Filters
                    </button>
                  </div>
                </div>
              </div>

              {/* Income Table */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-blue-700">
                      <tr>
                        <th className="px-3 py-2 md:px-6 md:py-3 text-left text-xs md:text-sm font-medium text-white uppercase tracking-wider">
                          Sl No
                        </th>
                        <th className="px-3 py-2 md:px-6 md:py-3 text-left text-xs md:text-sm font-medium text-white uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-3 py-2 md:px-6 md:py-3 text-left text-xs md:text-sm font-medium text-white uppercase tracking-wider">
                          Member ID
                        </th>
                        <th className="px-3 py-2 md:px-6 md:py-3 text-left text-xs md:text-sm font-medium text-white uppercase tracking-wider">
                          Name
                        </th>
                        <th className="px-3 py-2 md:px-6 md:py-3 text-left text-xs md:text-sm font-medium text-white uppercase tracking-wider">
                          Type
                        </th>
                        <th className="px-3 py-2 md:px-6 md:py-3 text-left text-xs md:text-sm font-medium text-white uppercase tracking-wider">
                          Package
                        </th>
                        <th className="px-3 py-2 md:px-6 md:py-3 text-left text-xs md:text-sm font-medium text-white uppercase tracking-wider">
                          Amount
                        </th>
                        <th className="px-3 py-2 md:px-6 md:py-3 text-left text-xs md:text-sm font-medium text-white uppercase tracking-wider">
                          Income
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {paginatedData.length > 0 ? (
                        paginatedData.map((item, index) => (
                          <tr
                            key={item.id}
                            className="hover:bg-gray-50 transition-colors duration-150"
                          >
                            <td className="px-3 py-2 md:px-6 md:py-4 whitespace-nowrap text-xs md:text-base text-gray-900">
                              {startIndex + index + 1}
                            </td>
                            <td className="px-3 py-2 md:px-6 md:py-4 whitespace-nowrap text-xs md:text-base text-gray-900">
                              {new Date(item.date).toLocaleDateString()}
                            </td>
                            <td className="px-3 py-2 md:px-6 md:py-4 whitespace-nowrap text-xs md:text-sm font-medium text-blue-600">
                              {item.memberId}
                            </td>
                            <td className="px-3 py-2 md:px-6 md:py-4 whitespace-nowrap text-xs md:text-base text-gray-900">
                              {item.name}
                            </td>
                            <td className="px-3 py-2 md:px-6 md:py-4 whitespace-nowrap">
                              <span
                                className={`inline-flex px-1 py-0.5 md:px-2 md:py-1 text-xs md:text-sm font-semibold rounded-full ${
                                  item.transactionType === "Activation"
                                    ? "bg-green-100 text-green-800"
                                    : "bg-blue-100 text-blue-800"
                                }`}
                              >
                                {item.transactionType}
                              </span>
                            </td>
                            <td className="px-3 py-2 md:px-6 md:py-4 whitespace-nowrap">
                              <span
                                className={`inline-flex px-1 py-0.5 md:px-2 md:py-1 text-xs md:text-sm font-semibold rounded-full ${
                                  item.package === "Tour Package"
                                    ? "bg-purple-100 text-purple-800"
                                    : item.package === "Growth"
                                    ? "bg-orange-100 text-orange-800"
                                    : "bg-gray-100 text-gray-800"
                                }`}
                              >
                                {item.package}
                              </span>
                            </td>
                            <td className="px-3 py-2 md:px-6 md:py-4 whitespace-nowrap text-xs md:text-base font-semibold text-gray-900">
                              ${item.packageAmount.toLocaleString()}
                            </td>
                            <td className="px-3 py-2 md:px-6 md:py-4 whitespace-nowrap text-xs md:text-base font-semibold text-gray-900">
                              ${item.income.toLocaleString()}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td
                            colSpan={8}
                            className="px-6 py-8 text-center text-gray-500 text-sm md:text-base"
                          >
                            No income records found matching your criteria.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="bg-white px-2 md:px-4 py-2 md:py-3 border-t border-gray-200 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 flex justify-between sm:hidden">
                        <button
                          onClick={() =>
                            setCurrentPage(Math.max(1, currentPage - 1))
                          }
                          disabled={currentPage === 1}
                          className="relative inline-flex items-center px-3 py-1 border border-gray-300 text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Prev
                        </button>
                        <button
                          onClick={() =>
                            setCurrentPage(
                              Math.min(totalPages, currentPage + 1)
                            )
                          }
                          disabled={currentPage === totalPages}
                          className="ml-2 relative inline-flex items-center px-3 py-1 border border-gray-300 text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Next
                        </button>
                      </div>
                      <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                        <div>
                          <p className="text-xs md:text-sm text-gray-700">
                            Showing{" "}
                            <span className="font-medium">
                              {startIndex + 1}
                            </span>{" "}
                            to{" "}
                            <span className="font-medium">
                              {Math.min(
                                startIndex + itemsPerPage,
                                filteredData.length
                              )}
                            </span>{" "}
                            of{" "}
                            <span className="font-medium">
                              {filteredData.length}
                            </span>{" "}
                            results
                          </p>
                        </div>
                        <div>
                          <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                            <button
                              onClick={() =>
                                setCurrentPage(Math.max(1, currentPage - 1))
                              }
                              disabled={currentPage === 1}
                              className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-xs md:text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              Previous
                            </button>
                            {Array.from(
                              { length: Math.min(5, totalPages) },
                              (_, i) => {
                                if (totalPages <= 5) return i + 1;
                                if (currentPage <= 3) return i + 1;
                                if (currentPage >= totalPages - 2)
                                  return totalPages - 4 + i;
                                return currentPage - 2 + i;
                              }
                            ).map((page) => (
                              <button
                                key={page}
                                onClick={() => setCurrentPage(page)}
                                className={`relative inline-flex items-center px-3 py-1 md:px-4 md:py-2 border text-xs md:text-sm font-medium ${
                                  page === currentPage
                                    ? "z-10 bg-blue-50 border-blue-500 text-blue-600"
                                    : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                                }`}
                              >
                                {page}
                              </button>
                            ))}
                            {totalPages > 5 && currentPage < totalPages - 2 && (
                              <span className="relative inline-flex items-center px-3 py-1 md:px-4 md:py-2 border border-gray-300 bg-white text-xs md:text-sm font-medium text-gray-700">
                                ...
                              </span>
                            )}
                            {totalPages > 5 && currentPage < totalPages - 2 && (
                              <button
                                onClick={() => setCurrentPage(totalPages)}
                                className={`relative inline-flex items-center px-3 py-1 md:px-4 md:py-2 border text-xs md:text-sm font-medium ${
                                  totalPages === currentPage
                                    ? "z-10 bg-blue-50 border-blue-500 text-blue-600"
                                    : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                                }`}
                              >
                                {totalPages}
                              </button>
                            )}
                            <button
                              onClick={() =>
                                setCurrentPage(
                                  Math.min(totalPages, currentPage + 1)
                                )
                              }
                              disabled={currentPage === totalPages}
                              className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-xs md:text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              Next
                            </button>
                          </nav>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default DirectIncome;
