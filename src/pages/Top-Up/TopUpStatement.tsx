import React, { useEffect, useState } from "react";

import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { DashboardHeader } from "@/components/DashboardHeader";

interface TopUpEntry {
  id: string;
  name: string;
  packageName: string;
  amount: number;
  date: string; // should be ISO format ideally (e.g., "2025-06-15T14:30:00")
}

const TopUp_Statement: React.FC = () => {
  const [topUpHistory, setTopUpHistory] = useState<TopUpEntry[]>([]);
  const [filteredHistory, setFilteredHistory] = useState<TopUpEntry[]>([]);

  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [memberId, setMemberId] = useState("");
  const [packageName, setPackageName] = useState("");

  useEffect(() => {
    const dummyData: TopUpEntry[] = [
      {
        id: "MEM001",
        name: "John Doe",
        packageName: "Basic Package",
        amount: 299,
        date: "2025-06-15T14:30:00",
      },
      {
        id: "MEM002",
        name: "Alice Smith",
        packageName: "Premium Package",
        amount: 699,
        date: "2025-06-16T10:15:00",
      },
      {
        id: "MEM003",
        name: "Bob Brown",
        packageName: "Basic Package",
        amount: 299,
        date: "2025-06-17T09:00:00",
      },
    ];

    setTopUpHistory(dummyData);
    setFilteredHistory(dummyData);
  }, []);

  // Filter logic
  useEffect(() => {
    let filtered = [...topUpHistory];

    if (fromDate) {
      filtered = filtered.filter(
        (entry) => new Date(entry.date) >= new Date(fromDate)
      );
    }

    if (toDate) {
      filtered = filtered.filter(
        (entry) => new Date(entry.date) <= new Date(toDate)
      );
    }

    if (memberId.trim() !== "") {
      filtered = filtered.filter((entry) =>
        entry.id.toLowerCase().includes(memberId.toLowerCase())
      );
    }

    if (packageName.trim() !== "") {
      filtered = filtered.filter((entry) =>
        entry.packageName.toLowerCase().includes(packageName.toLowerCase())
      );
    }

    setFilteredHistory(filtered);
  }, [fromDate, toDate, memberId, packageName, topUpHistory]);

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6 text-center">Top-Up Statement</h2>

      {/* Filters */}
      <div className="bg-white p-4 rounded shadow mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">From Date</label>
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="w-full border px-3 py-2 rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">To Date</label>
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="w-full border px-3 py-2 rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Member ID</label>
          <input
            type="text"
            value={memberId}
            onChange={(e) => setMemberId(e.target.value)}
            placeholder="e.g. MEM001"
            className="w-full border px-3 py-2 rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Package</label>
          <input
            type="text"
            value={packageName}
            onChange={(e) => setPackageName(e.target.value)}
            placeholder="e.g. Basic"
            className="w-full border px-3 py-2 rounded"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded shadow">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="px-4 py-2 text-left">Sl No.</th>
              <th className="px-4 py-2 text-left">Top-up ID</th>
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-left">Package</th>
              <th className="px-4 py-2 text-left">Amount</th>
              <th className="px-4 py-2 text-left">Date</th>
            </tr>
          </thead>
          <tbody>
            {filteredHistory.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="text-center py-6 text-gray-500 font-medium"
                >
                  No records found.
                </td>
              </tr>
            ) : (
              filteredHistory.map((entry, index) => (
                <tr
                  key={index}
                  className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}
                >
                  <td className="px-4 py-2">{index + 1}</td>
                  <td className="px-4 py-2">{entry.id}</td>
                  <td className="px-4 py-2">{entry.name}</td>
                  <td className="px-4 py-2">{entry.packageName}</td>
                  <td className="px-4 py-2">₹{entry.amount}</td>
                  <td className="px-4 py-2">
                    {new Date(entry.date).toLocaleString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
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
