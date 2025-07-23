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
        const token = localStorage.getItem("token");
        const response = await fetch(`${API_BASE_URL}/self-activation-report`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch activation report");
        }

        const data = await response.json();
         console.log("API Response:", data);
        if (data.success) {
          setActivations(data.transactions);
        }
      } catch (error) {
        console.error("Error fetching activation report:", error);
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
        <div className="flex-1 flex flex-col overflow-x-hidden">
          <DashboardHeader />
          <main className="flex-1 p-2 md:p-2 lg:p-8 xl:p-2 overflow-x-hidden">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-2 md:mb-2 py-3 md:py-4 border-gray-200">
                <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-800">
                  Self Activation Report
                </h1>
              </div>

              <div className="bg-white shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <div className="min-w-[800px] md:w-full">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-blue-600 text-white">
                          <th className="px-3 md:px-6 py-2 md:py-3 text-left text-xs md:text-sm font-medium uppercase tracking-wider whitespace-nowrap">
                            SL No.
                          </th>
                          <th className="px-3 md:px-6 py-2 md:py-3 text-left text-xs md:text-sm font-medium uppercase tracking-wider whitespace-nowrap">
                            Date
                          </th>
                          <th className="px-3 md:px-6 py-2 md:py-3 text-left text-xs md:text-sm font-medium uppercase tracking-wider whitespace-nowrap">
                            Transaction Type
                          </th>
                          <th className="px-3 md:px-6 py-2 md:py-3 text-left text-xs md:text-sm font-medium uppercase tracking-wider whitespace-nowrap">
                            Plan
                          </th>
                          <th className="px-3 md:px-6 py-2 md:py-3 text-left text-xs md:text-sm font-medium uppercase tracking-wider whitespace-nowrap">
                            Package
                          </th>
                          <th className="px-3 md:px-6 py-2 md:py-3 text-left text-xs md:text-sm font-medium uppercase tracking-wider whitespace-nowrap">
                            Amount
                          </th>
                          <th className="px-3 md:px-6 py-2 md:py-3 text-left text-xs md:text-sm font-medium uppercase tracking-wider whitespace-nowrap">
                            Status
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {activations.map((activation) => (
                          <tr key={activation.id}>
                            <td className="px-3 md:px-6 py-3 md:py-4 whitespace-nowrap text-sm md:text-base text-gray-900">
                              {activation.slNo}
                            </td>
                            <td className="px-3 md:px-6 py-3 md:py-4 whitespace-nowrap text-sm md:text-base text-gray-900">
                              {formatDate(activation.date)}
                            </td>
                            <td className="px-3 md:px-6 py-3 md:py-4 whitespace-nowrap text-sm md:text-base text-gray-900">
                              {activation.transactionType}
                            </td>
                            <td className="px-3 md:px-6 py-3 md:py-4 whitespace-nowrap text-sm md:text-base text-gray-900">
                              {activation.plan}
                            </td>
                            <td className="px-3 md:px-6 py-3 md:py-4 whitespace-nowrap text-sm md:text-base text-gray-900">
                              {activation.package}
                            </td>
                            <td className="px-3 md:px-6 py-3 md:py-4 whitespace-nowrap text-sm md:text-base text-gray-900">
                              ${activation.amount}
                            </td>
                            <td className="px-3 md:px-6 py-3 md:py-4 whitespace-nowrap text-sm md:text-base text-gray-900">
                              <div className="flex items-center">
                                <CheckCircle className="h-3 w-3 md:h-4 md:w-4 text-green-500 mr-1 md:mr-2" />
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
              </div>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Self_Statement;
