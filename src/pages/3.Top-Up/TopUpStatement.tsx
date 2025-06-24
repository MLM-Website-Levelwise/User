import React, { useEffect, useState } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { DashboardHeader } from "@/components/DashboardHeader";
import { Search, Calendar, Package } from "lucide-react";

interface TopUpEntry {
  'sl no': number;
  'mem id': string;
  'mem name': string;
  'top up date': string;
  'plan': string;
  'amt': number;
  'status': string;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const TopUp_Statement: React.FC = () => {
  const [topUpHistory, setTopUpHistory] = useState<TopUpEntry[]>([]);
  const [filteredHistory, setFilteredHistory] = useState<TopUpEntry[]>([]);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [packageFilter, setPackageFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTopUpHistory = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/topup-statement`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to fetch data');
        }
        
        const data = await response.json();
        setTopUpHistory(data);
        setFilteredHistory(data);
      } catch (err) {
        console.error('Error fetching top-up history:', err);
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
        (entry) => new Date(entry['top up date']) >= new Date(fromDate)
      );
    }

    if (toDate) {
      filtered = filtered.filter(
        (entry) => new Date(entry['top up date']) <= new Date(toDate)
      );
    }

    if (packageFilter.trim() !== "") {
      filtered = filtered.filter((entry) =>
        entry['plan'].toLowerCase().includes(packageFilter.toLowerCase())
      );
    }

    setFilteredHistory(filtered);
  }, [fromDate, toDate, packageFilter, topUpHistory]);

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center h-64 text-red-500">{error}</div>;
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="text-center mb-8 py-4 border-y border-gray-200">
        <h1 className="text-2xl font-bold text-gray-800">Top-Up Statement</h1>
      </div>

      {/* Filters */}
      <div className="bg-gray-200 p-5 rounded-xl shadow-sm border border-gray-100 mb-8">
        <h3 className="font-medium text-gray-700 mb-4 flex items-center gap-2">
          <Search className="w-4 h-4" />
          Filter Transactions
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              From Date
            </label>
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="w-full border border-gray-200 px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              To Date
            </label>
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="w-full border border-gray-200 px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
              <Package className="w-4 h-4" />
              Package Name
            </label>
            <input
              type="text"
              value={packageFilter}
              onChange={(e) => setPackageFilter(e.target.value)}
              placeholder="e.g. Basic, Premium"
              className="w-full border border-gray-200 px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition-all"
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr className="bg-blue-600 text-white">
                <th className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider">Sl No.</th>
                <th className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider">Member ID</th>
                <th className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider">Member Name</th>
                <th className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider">Package</th>
                <th className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider">Amount</th>
                
                <th className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredHistory.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                    <div className="flex flex-col items-center justify-center">
                      <Search className="w-8 h-8 text-gray-300 mb-2" />
                      <p className="text-gray-400">No transactions found</p>
                      <p className="text-sm text-gray-400 mt-1">
                        Try adjusting your filters
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredHistory.map((entry, index) => (
                  <tr key={index} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-base text-gray-500">
                      {entry['sl no']}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-base text-gray-500">
                      {new Date(entry['top up date']).toLocaleString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,
                      })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded-md text-base font-medium">
                        {entry['mem id']}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {entry['mem name']}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-full text-sm font-medium ${
                        entry['plan'].includes("Premium")
                          ? "bg-purple-100 text-purple-800"
                          : "bg-blue-100 text-blue-800"
                      }`}>
                        {entry['plan']}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-base font-semibold text-gray-900">
                      ${entry['amt']}
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-md text-sm font-medium ${
                        entry['status'] === 'completed' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {entry['status']}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const TopUpStatement = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <DashboardHeader />
          <main className="flex-1 p-6">
            <TopUp_Statement />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default TopUpStatement;