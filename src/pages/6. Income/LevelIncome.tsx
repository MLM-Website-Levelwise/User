import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { DashboardHeader } from "@/components/DashboardHeader";
import React, { useState, useEffect, useMemo } from "react";
import {
  Calendar,
  Filter,
  Users,
  TrendingUp,
  DollarSign,
  User,
  RefreshCw,
} from "lucide-react";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const Level_Income = () => {
  const today = new Date().toISOString().split('T')[0];
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [incomeData, setIncomeData] = useState([]);
  const [summaryValues, setSummaryValues] = useState({
    totalIncome: 0,
    todaysIncome: 0,
    activeLevels: 0,
    directMembers: 0,
  });
  const [selectedLevel, setSelectedLevel] = useState("all");
  const [selectedDate, setSelectedDate] = useState(today);
  const [maxAllowedDate, setMaxAllowedDate] = useState(today);

  // Fetch income data
  const fetchIncomeData = async (date) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) return;

      const response = await axios.get(`${API_BASE_URL}/level-income`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          date: date || today
        }
      });

      setIncomeData(response.data.incomeData);
      setSummaryValues({
        totalIncome: response.data.summary.totalIncome,
        todaysIncome: response.data.summary.todaysIncome,
        activeLevels: response.data.summary.activeLevels,
        directMembers: response.data.summary.directMembers,
      });
      setError("");
    } catch (err) {
      console.error("Failed to fetch income data:", err);
      setError(err.response?.data?.error || "Failed to load income data");
      setIncomeData([]);
      setSummaryValues({
        totalIncome: 0,
        todaysIncome: 0,
        activeLevels: 0,
        directMembers: 0,
      });
    } finally {
      setLoading(false);
    }
  };

  // Load data on component mount and when date changes
  useEffect(() => {
    fetchIncomeData(selectedDate);
  }, [selectedDate]);

  // Update max allowed date daily
  useEffect(() => {
    const interval = setInterval(() => {
      const newToday = new Date().toISOString().split('T')[0];
      if (newToday !== maxAllowedDate) {
        setMaxAllowedDate(newToday);
        if (selectedDate > newToday) {
          setSelectedDate(newToday);
        }
      }
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [maxAllowedDate, selectedDate]);

  // Filtered data based on selected filters
  const filteredData = useMemo(() => {
    return incomeData
      .filter((item) => {
        const levelMatch =
          selectedLevel === "all" || item.level === parseInt(selectedLevel);
        return levelMatch;
      })
      .sort((a, b) => a.level - b.level);
  }, [incomeData, selectedLevel]);

  const clearFilters = () => {
    setSelectedLevel("all");
    setSelectedDate(today);
  };

  const handleDateChange = (e) => {
    const newDate = e.target.value;
    if (newDate > maxAllowedDate) {
      setError("Future dates are not allowed");
      return;
    }
    setSelectedDate(newDate);
  };

  const refreshData = () => {
    fetchIncomeData(selectedDate);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div>Loading income data...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-2 md:px-4">
        {/* Filter Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 md:p-6 mb-6 w-full overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <Filter className="mr-2 text-blue-600" size={20} />
              <h2 className="text-xl md:text-xl font-semibold text-gray-800 truncate">
                Filter Options
              </h2>
            </div>
            <button
              onClick={refreshData}
              className="flex items-center text-blue-600 hover:text-blue-800"
              title="Refresh Data"
            >
              <RefreshCw size={18} className="mr-1" />
              <span className="text-sm">Refresh</span>
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="inline mr-1" size={16} />
                Date
              </label>
              <input
                type="date"
                value={selectedDate}
                max={maxAllowedDate}
                onChange={handleDateChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Users className="inline mr-1" size={16} />
                Level
              </label>
              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Levels</option>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((level) => (
                  <option key={level} value={level}>
                    Level {level}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-end">
              <button
                onClick={clearFilters}
                className="w-full bg-gray-500 hover:bg-gray-600 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 w-full overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-blue-700 rounded-xl shadow-lg p-4 md:p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">
                  Total Income
                </p>
                <p className="text-2xl md:text-3xl font-bold">
                  ${summaryValues.totalIncome.toFixed(2)}
                </p>
              </div>
              <DollarSign size={40} className="text-blue-100 md:size-10" />
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-500 to-green-700 rounded-xl shadow-lg p-4 md:p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm font-medium">
                  {selectedDate === today ? "Today's" : "Selected Date"} Income
                </p>
                <p className="text-2xl md:text-3xl font-bold">
                  ${summaryValues.todaysIncome.toFixed(2)}
                </p>
              </div>
              <DollarSign size={40} className="text-green-100 md:size-10" />
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-500 to-purple-700 rounded-xl shadow-lg p-4 md:p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm font-medium">
                  Active Levels
                </p>
                <p className="text-2xl md:text-3xl font-bold">
                  {summaryValues.activeLevels}
                </p>
              </div>
              <TrendingUp size={40} className="text-purple-100 md:size-10" />
            </div>
          </div>

          <div className="bg-gradient-to-r from-orange-500 to-orange-700 rounded-xl shadow-lg p-4 md:p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm font-medium">
                  Direct Members
                </p>
                <p className="text-2xl md:text-3xl font-bold">
                  {summaryValues.directMembers}
                </p>
              </div>
              <User size={40} className="text-orange-100 md:size-10" />
            </div>
          </div>
        </div>

        {/* Income Table */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <div className="min-w-[800px] md:w-full">
              <table className="w-full">
                <thead className="bg-blue-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-medium text-white uppercase tracking-wider">
                      Sl. No.
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-white uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-white uppercase tracking-wider">
                      Level
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-white uppercase tracking-wider">
                      Total Members
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-white uppercase tracking-wider">
                      Total Profit Bonus
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-white uppercase tracking-wider">
                      Perc. %
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-white uppercase tracking-wider">
                      Commission
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-white uppercase tracking-wider">
                      Criteria
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredData.length === 0 ? (
                    <tr>
                      <td
                        colSpan={8}
                        className="px-6 py-12 text-center text-gray-500"
                      >
                        No records found for the selected filters.
                      </td>
                    </tr>
                  ) : (
                    filteredData.map((item, index) => (
                      <tr
                        key={item.level}
                        className="hover:bg-gray-50 transition-colors duration-150"
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-base text-gray-900">
                          {index + 1}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-base text-gray-900">
                          {new Date(item.date).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex px-2 py-1 text-sm font-semibold rounded-full bg-indigo-100 text-indigo-800">
                            Level {item.level}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-base text-gray-900">
                          {item.totalMembers}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-base text-gray-900">
                          ${item.totalProfitBonus.toFixed(3)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-base text-gray-900">
                          {item.percentage}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-base text-gray-900">
                          ${item.commission.toFixed(3)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-sm font-semibold rounded-full ${
                            item.criteria === "Eligible" 
                              ? "bg-green-100 text-green-800" 
                              : "bg-gray-100 text-gray-800"
                          }`}>
                            {item.criteria}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {filteredData.length > 0 && (
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-700">
                  Showing {filteredData.length} record
                  {filteredData.length !== 1 ? "s" : ""}
                </span>
                <span className="text-sm text-gray-700">
                  Date: {new Date(selectedDate).toLocaleDateString()}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const LevelIncome = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        <AppSidebar />
        <div className="flex-1 flex flex-col overflow-x-hidden">
          <DashboardHeader />
          <main className="flex-1 p-1 md:p-4 overflow-x-hidden">
            <Level_Income />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default LevelIncome;