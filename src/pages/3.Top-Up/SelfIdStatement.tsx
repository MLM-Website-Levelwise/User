// import { SidebarProvider } from "@/components/ui/sidebar";
// import { AppSidebar } from "@/components/AppSidebar";
// import { DashboardHeader } from "@/components/DashboardHeader";
// import React from "react";
// import { Package, DollarSign, Calendar, CheckCircle } from "lucide-react";
// import { useEffect, useState } from "react";

// const Self_Statement: React.FC = () => {
//   const [activations, setActivations] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

//   useEffect(() => {
//     const fetchActivationReport = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         const response = await fetch(`${API_BASE_URL}/self-activation-report`, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });

//         if (!response.ok) {
//           throw new Error("Failed to fetch activation report");
//         }

//         const data = await response.json();
//          console.log("API Response:", data);
//         if (data.success) {
//           setActivations(data.transactions);
//         }
//       } catch (error) {
//         console.error("Error fetching activation report:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchActivationReport();
//   }, []);

//   const formatDate = (dateString: string) => {
//     const date = new Date(dateString);
//     return date.toLocaleDateString("en-IN", {
//       day: "2-digit",
//       month: "short",
//       year: "numeric",
//       hour: "2-digit",
//       minute: "2-digit",
//     });
//   };

//   if (loading) {
//     return <div>Loading activation report...</div>;
//   }

//   return (
//     <SidebarProvider>
//       <div className="min-h-screen flex w-full bg-gray-50">
//         <AppSidebar />
//         <div className="flex-1 flex flex-col overflow-x-hidden">
//           <DashboardHeader />
//           <main className="flex-1 p-2 md:p-2 lg:p-8 xl:p-2 overflow-x-hidden">
//             <div className="max-w-7xl mx-auto">
//               <div className="text-center mb-2 md:mb-2 py-3 md:py-4 border-gray-200">
//                 <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-800">
//                   Self Activation Report
//                 </h1>
//               </div>

//               <div className="bg-white shadow-sm overflow-hidden">
//                 <div className="overflow-x-auto">
//                   <div className="min-w-[800px] md:w-full">
//                     <table className="w-full">
//                       <thead>
//                         <tr className="bg-blue-600 text-white">
//                           <th className="px-3 md:px-6 py-2 md:py-3 text-left text-xs md:text-sm font-medium uppercase tracking-wider whitespace-nowrap">
//                             SL No.
//                           </th>
//                           <th className="px-3 md:px-6 py-2 md:py-3 text-left text-xs md:text-sm font-medium uppercase tracking-wider whitespace-nowrap">
//                             Date
//                           </th>
//                           <th className="px-3 md:px-6 py-2 md:py-3 text-left text-xs md:text-sm font-medium uppercase tracking-wider whitespace-nowrap">
//                             Transaction Type
//                           </th>
//                           <th className="px-3 md:px-6 py-2 md:py-3 text-left text-xs md:text-sm font-medium uppercase tracking-wider whitespace-nowrap">
//                             Plan
//                           </th>
//                           <th className="px-3 md:px-6 py-2 md:py-3 text-left text-xs md:text-sm font-medium uppercase tracking-wider whitespace-nowrap">
//                             Package
//                           </th>
//                           <th className="px-3 md:px-6 py-2 md:py-3 text-left text-xs md:text-sm font-medium uppercase tracking-wider whitespace-nowrap">
//                             Amount
//                           </th>
//                           <th className="px-3 md:px-6 py-2 md:py-3 text-left text-xs md:text-sm font-medium uppercase tracking-wider whitespace-nowrap">
//                             Status
//                           </th>
//                         </tr>
//                       </thead>
//                       <tbody className="divide-y divide-gray-200">
//                         {activations.map((activation) => (
//                           <tr key={activation.id}>
//                             <td className="px-3 md:px-6 py-3 md:py-4 whitespace-nowrap text-sm md:text-base text-gray-900">
//                               {activation.slNo}
//                             </td>
//                             <td className="px-3 md:px-6 py-3 md:py-4 whitespace-nowrap text-sm md:text-base text-gray-900">
//                               {formatDate(activation.date)}
//                             </td>
//                             <td className="px-3 md:px-6 py-3 md:py-4 whitespace-nowrap text-sm md:text-base text-gray-900">
//                               {activation.transactionType}
//                             </td>
//                             <td className="px-3 md:px-6 py-3 md:py-4 whitespace-nowrap text-sm md:text-base text-gray-900">
//                               {activation.plan}
//                             </td>
//                             <td className="px-3 md:px-6 py-3 md:py-4 whitespace-nowrap text-sm md:text-base text-gray-900">
//                               {activation.package}
//                             </td>
//                             <td className="px-3 md:px-6 py-3 md:py-4 whitespace-nowrap text-sm md:text-base text-gray-900">
//                               ${activation.amount}
//                             </td>
//                             <td className="px-3 md:px-6 py-3 md:py-4 whitespace-nowrap text-sm md:text-base text-gray-900">
//                               <div className="flex items-center">
//                                 <CheckCircle className="h-3 w-3 md:h-4 md:w-4 text-green-500 mr-1 md:mr-2" />
//                                 <span className="text-green-600">
//                                   {activation.status}
//                                 </span>
//                               </div>
//                             </td>
//                           </tr>
//                         ))}
//                       </tbody>
//                     </table>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </main>
//         </div>
//       </div>
//     </SidebarProvider>
//   );
// };

// export default Self_Statement;



import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { DashboardHeader } from "@/components/DashboardHeader";
import React from "react";
import {
  Package,
  DollarSign,
  Calendar,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useEffect, useState } from "react";

const ITEMS_PER_PAGE = 5; // Number of items to show per page

const Self_Statement: React.FC = () => {
  const [activations, setActivations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

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

  // Calculate pagination variables
  const totalItems = activations.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, totalItems);
  const currentItems = activations.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

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
              <div className="text-center mb-2 md:mb-2 py-3 md:py-4 bg-gray-800 text-white border-gray-200">
                <h1 className="text-lg sm:text-xl font-bold text-center">
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
                        {currentItems.length === 0 ? (
                          <tr>
                            <td
                              colSpan={7}
                              className="px-4 py-6 text-center text-gray-500"
                            >
                              No activation records found
                            </td>
                          </tr>
                        ) : (
                          currentItems.map((activation, index) => (
                            <tr key={activation.id}>
                              <td className="px-3 md:px-6 py-3 md:py-4 whitespace-nowrap text-sm md:text-base text-gray-900">
                                {startIndex + index + 1}
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
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
                    <div className="flex flex-1 justify-between sm:hidden">
                      <button
                        onClick={() =>
                          handlePageChange(Math.max(1, currentPage - 1))
                        }
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
                          handlePageChange(
                            Math.min(totalPages, currentPage + 1)
                          )
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
                          Showing{" "}
                          <span className="font-medium">{startIndex + 1}</span>{" "}
                          to <span className="font-medium">{endIndex}</span> of{" "}
                          <span className="font-medium">{totalItems}</span>{" "}
                          results
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
                              currentPage === 1
                                ? "cursor-not-allowed opacity-50"
                                : ""
                            }`}
                          >
                            <span className="sr-only">Previous</span>
                            <ChevronLeft
                              className="h-5 w-5"
                              aria-hidden="true"
                            />
                          </button>
                          {Array.from(
                            { length: totalPages },
                            (_, i) => i + 1
                          ).map((page) => (
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
                          ))}
                          <button
                            onClick={() =>
                              handlePageChange(
                                Math.min(totalPages, currentPage + 1)
                              )
                            }
                            disabled={currentPage === totalPages}
                            className={`relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 ${
                              currentPage === totalPages
                                ? "cursor-not-allowed opacity-50"
                                : ""
                            }`}
                          >
                            <span className="sr-only">Next</span>
                            <ChevronRight
                              className="h-5 w-5"
                              aria-hidden="true"
                            />
                          </button>
                        </nav>
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

export default Self_Statement;
