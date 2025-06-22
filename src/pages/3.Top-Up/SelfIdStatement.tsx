import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { DashboardHeader } from "@/components/DashboardHeader";
import React from "react";
import { Package, DollarSign, Calendar, CheckCircle } from "lucide-react";

const Self_Statement: React.FC = () => {
  // Sample activation records with different plans and packages
  const activations = [
    {
      id: 1,
      date: "2025-06-15T14:30:00",
      userId: "PRN676277",
      name: "Samima Bibi",
      plan: "Growth Plan",
      package: "30$",
      amount: 30,
      status: "Completed",
    },
    {
      id: 2,
      date: "2025-06-10T11:20:00",
      userId: "PRN676277",
      name: "Samima Bibi",
      plan: "Growth Plan",
      package: "45$",
      amount: 45,
      status: "Completed",
    },
    {
      id: 3,
      date: "2025-05-28T09:15:00",
      userId: "PRN676277",
      name: "Samima Bibi",
      plan: "Profit Sharing Plan",
      package: "75$",
      amount: 75,
      status: "Completed",
    },
    {
      id: 4,
      date: "2025-05-20T16:45:00",
      userId: "PRN676277",
      name: "Samima Bibi",
      plan: "Growth Re Topup",
      package: "25$",
      amount: 25,
      status: "Completed",
    },
    {
      id: 5,
      date: "2025-05-05T13:10:00",
      userId: "PRN676277",
      name: "Samima Bibi",
      plan: "Profit Sharing Re Topup",
      package: "75$",
      amount: 75,
      status: "Completed",
    },
  ];

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
                        Member ID
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider">
                        Member Name
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
                          {activation.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-base text-gray-900">
                          {formatDate(activation.date)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-base text-gray-900">
                          {activation.userId}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-base text-gray-900">
                          {activation.name}
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