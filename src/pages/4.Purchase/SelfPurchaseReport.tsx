import React from "react";

import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { DashboardHeader } from "@/components/DashboardHeader";

const SelfPurchase_Report = () => {
  // Dummy data for the purchase history
  const purchaseHistory = [
    { id: 1, date: "2023-10-15", package: "PLUS CARD", amount: "INR 2950" },
    { id: 2, date: "2023-10-10", package: "PREMIUM PACK", amount: "INR 5000" },
    { id: 3, date: "2023-10-05", package: "BASIC PACK", amount: "INR 1500" },
    { id: 4, date: "2023-09-28", package: "PLUS CARD", amount: "INR 2950" },
    { id: 5, date: "2023-09-20", package: "PREMIUM PACK", amount: "INR 5000" },
  ];

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-lg border border-gray-100">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Purchase History
      </h1>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr className="bg-blue-600">
              {" "}
              {/* Changed from bg-gray-50 to blue */}
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider"
              >
                Sl No.
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider"
              >
                Date
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider"
              >
                Package
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider"
              >
                Amount
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {purchaseHistory.map((purchase, index) => (
              <tr key={purchase.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {index + 1}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {purchase.date}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {purchase.package}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {purchase.amount}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination remains unchanged */}
      <div className="mt-4 flex justify-between items-center text-sm text-gray-500">
        <div>
          Showing 1 to {purchaseHistory.length} of {purchaseHistory.length}{" "}
          entries
        </div>
        <div className="flex space-x-2">
          <button className="px-3 py-1 border rounded-md bg-gray-50 hover:bg-gray-100">
            Previous
          </button>
          <button className="px-3 py-1 border rounded-md bg-gray-50 hover:bg-gray-100">
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

const SelfPurchaseReport = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <DashboardHeader />
          <main className="flex-1 p-6">
            <SelfPurchase_Report />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default SelfPurchaseReport;
