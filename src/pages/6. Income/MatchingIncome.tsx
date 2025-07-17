import React, { useState, useEffect } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { DashboardHeader } from "@/components/DashboardHeader";
import axios from "axios";

interface IncomeRecord {
  date: string;
  memberId: string;
  leftCount: number;
  rightCount: number;
  matches: number;
  income: number;
  matchingPV: number;
}
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const MatchingIncomePage = () => {
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [incomeData, setIncomeData] = useState<IncomeRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchIncomeData();
  }, []);

  const fetchIncomeData = async () => {
  try {
    setIsLoading(true);
    setError("");
    const token = localStorage.getItem("token");
    const response = await axios.get(`${API_BASE_URL}/matching-income`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    console.log("Full API response:", response.data); // Debug
    
    if (response.data.success) {
      setIncomeData(response.data.data);
      
      if (response.data.data.length === 0) {
        setError(`No matching income calculated. 
          Your team PV: Left=${response.data.userPV?.left || 0}, 
          Right=${response.data.userPV?.right || 0}`);
      }
    } else {
      setError(response.data.error || "Failed to fetch matching income");
    }
  } catch (err) {
    setError(err.response?.data?.error || "Network error while fetching data");
    console.error("API Error:", err);
  } finally {
    setIsLoading(false);
  }
};

  const handleFilter = async () => {
    try {
      setIsLoading(true);
      setError("");
      const token = localStorage.getItem("token");
      const params = new URLSearchParams();
      
      if (fromDate) params.append('fromDate', fromDate);
      if (toDate) params.append('toDate', toDate);
      
      const response = await axios.get(`/matching-income?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        setIncomeData(response.data.data);
      }
    } catch (err) {
      setError("Failed to filter income data");
      console.error("Error filtering income data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setFromDate("");
    setToDate("");
    fetchIncomeData();
  };

  // Transform data for table display
  const tableData = incomeData.map((record, index) => ({
    slNo: index + 1,
    date: record.date,
    prevLeft: 0, // Not tracked in this implementation
    prevRight: 0,
    currentLeft: record.leftCount,
    currentRight: record.rightCount,
    totalLeft: record.leftCount,
    totalRight: record.rightCount,
    matchingPV: record.matchingPV,
    income: record.income
  }));

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        <AppSidebar />
        <div className="flex-1 flex flex-col overflow-x-hidden">
          <DashboardHeader />
          <main className="flex-1 overflow-x-hidden p-4">
            <div className="bg-white rounded-lg shadow-md p-4">
              {/* Filter Section */}
              <div className="mb-6 p-4 bg-gray-100 rounded-lg">
                <h3 className="text-lg font-semibold mb-4 text-gray-700">
                  Filter Matching Income
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
                  <div className="md:col-span-2 grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">
                        From Date
                      </label>
                      <input
                        type="date"
                        value={fromDate}
                        onChange={(e) => setFromDate(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">
                        To Date
                      </label>
                      <input
                        type="date"
                        value={toDate}
                        onChange={(e) => setToDate(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      />
                    </div>
                  </div>
                  <div className="md:col-span-3 flex gap-3">
                    <button
                      onClick={handleFilter}
                      disabled={isLoading}
                      className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm disabled:opacity-50"
                    >
                      {isLoading ? 'Processing...' : 'Filter'}
                    </button>
                    <button
                      onClick={handleReset}
                      disabled={isLoading}
                      className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors text-sm disabled:opacity-50"
                    >
                      Reset
                    </button>
                  </div>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
                  {error}
                </div>
              )}

              {/* Income Table */}
              <div className="overflow-x-auto">
                <table className="w-full border-separate border-spacing-0">
                  <thead>
                    <tr className="bg-blue-700 text-white">
                      <th className="p-3 text-left text-sm font-medium">Sl No</th>
                      <th className="p-3 text-left text-sm font-medium">Date</th>
                      <th className="p-3 text-left text-sm font-medium">Left PV</th>
                      <th className="p-3 text-left text-sm font-medium">Right PV</th>
                      <th className="p-3 text-left text-sm font-medium">Matching PV</th>
                      <th className="p-3 text-left text-sm font-medium">Income ($)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {isLoading ? (
                      <tr>
                        <td colSpan={6} className="p-4 text-center">
                          <div className="flex justify-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-700"></div>
                          </div>
                        </td>
                      </tr>
                    ) : tableData.length > 0 ? (
                      tableData.map((item, index) => (
                        <tr
                          key={index}
                          className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}
                        >
                          <td className="p-3 text-sm border-b border-gray-200">{item.slNo}</td>
                          <td className="p-3 text-sm border-b border-gray-200">{item.date}</td>
                          <td className="p-3 text-sm border-b border-gray-200">
                            {item.currentLeft.toLocaleString()}
                          </td>
                          <td className="p-3 text-sm border-b border-gray-200">
                            {item.currentRight.toLocaleString()}
                          </td>
                          <td className="p-3 text-sm font-semibold text-green-600 border-b border-gray-200">
                            {item.matchingPV.toLocaleString()}
                          </td>
                          <td className="p-3 text-sm font-semibold text-blue-600 border-b border-gray-200">
                            ${item.income.toLocaleString()}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="p-4 text-center text-gray-500">
                          No matching income records found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default MatchingIncomePage;