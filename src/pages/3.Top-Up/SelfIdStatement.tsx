import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { DashboardHeader } from "@/components/DashboardHeader";
import React from "react";
import { Package, DollarSign, Calendar, CheckCircle } from "lucide-react";

import { useEffect, useState } from "react";

const Self_Statement: React.FC = () => {
  const [activations, setActivations] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const fetchActivationReport = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE_URL}/self-activation-report`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch activation report');
        }
        
        const data = await response.json();
        if (data.success) {
          setActivations(data.transactions);
        }
      } catch (error) {
        console.error('Error fetching activation report:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchActivationReport();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return <div>Loading activation report...</div>;
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <DashboardHeader />
          <main className="flex-1 p-16">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-8 py-4 border-y border-gray-200">
                <h1 className="text-3xl font-bold text-gray-800">
                  Self Activation Report
                </h1>
              </div>

              <div className="bg-white shadow-sm rounded-lg overflow-hidden">
                <table className="min-w-full">
                  <thead>
                    <tr className="bg-blue-600 text-white">
                      <th className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider">
                        SL No.
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider">
                        Transaction Type
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider">
                        Plan
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider">
                        Package
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {activations.map((activation) => (
                      <tr key={activation.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-base text-gray-900">
                          {activation.slNo}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-base text-gray-900">
                          {formatDate(activation.date)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-base text-gray-900">
                          {activation.transactionType}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-base text-gray-900">
                          {activation.plan}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-base text-gray-900">
                          {activation.package}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-base text-gray-900">
                          ${activation.amount}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-base text-gray-900">
                          <div className="flex items-center">
                            <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                            <span className="text-green-600">
                              {activation.status}
                            </span>
                          </div>
                        </td>
                      </tr>
                    ))}
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

export default Self_Statement;