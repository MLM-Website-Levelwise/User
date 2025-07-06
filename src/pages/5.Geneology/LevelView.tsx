import { useState } from "react";
import { FileSpreadsheet, FileText, Printer, X } from "lucide-react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { DashboardHeader } from "@/components/DashboardHeader";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const LevelTeam = () => {
  const [teamData, setTeamData] = useState({
    currentMember: null,
    teamMembers: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [transactionDetails, setTransactionDetails] = useState({
    show: false,
    member: null,
    topups: [],
    retopups: [],
    loading: false,
  });
  const [levelIncome, setLevelIncome] = useState(0);
  const [levelBonus, setLevelBonus] = useState(0); // New state for bonus total
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTeamData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }

        const response = await axios.get(`${API_BASE_URL}/level-wise-team`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setTeamData(response.data);
      } catch (err) {
        console.error("Failed to fetch team data:", err);
        setError("Failed to load team data");
      } finally {
        setLoading(false);
      }
    };

    fetchTeamData();
  }, [navigate]);

  const fetchMemberTransactions = async (memberId, memberName) => {
    try {
      setTransactionDetails((prev) => ({
        ...prev,
        show: true,
        member: { id: memberId, name: memberName },
        loading: true,
      }));

      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${API_BASE_URL}/member-transactions/${memberId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setTransactionDetails((prev) => ({
        ...prev,
        topups: response.data.topups,
        retopups: response.data.retopups,
        loading: false,
      }));
    } catch (err) {
      console.error("Failed to fetch transactions:", err);
      setTransactionDetails((prev) => ({
        ...prev,
        loading: false,
        error: "Failed to load transaction details",
      }));
    }
  };

  const [filters, setFilters] = useState({
    dateFrom: "",
    dateTo: "",
    levelNo: "All",
  });

  const [entriesPerPage, setEntriesPerPage] = useState(20);
  const [exportFormat, setExportFormat] = useState("All");

  const handleFilterChange = (field, value) => {
  setFilters((prev) => ({
    ...prev,
    [field]: value,
  }));

  // Recalculate totals if level is selected
  if (filters.levelNo !== "All") {
    calculateLevelIncomeAndBonus(filters.levelNo);
  } else {
      setLevelIncome(0);
      setLevelBonus(0);
    }
  };

  const calculateLevelIncomeAndBonus = (level) => {
  // First filter by level
  const levelMembers = teamData.teamMembers.filter(
    (member) => member.level === parseInt(level)
  );

  // Then apply all other filters (date range, status etc.)
  const filteredMembers = levelMembers.filter(member => {
    // Date filter
    if (filters.dateFrom) {
      const memberDate = new Date(member.date_of_joining);
      const fromDate = new Date(filters.dateFrom);
      if (memberDate < fromDate) return false;
    }
    
    if (filters.dateTo) {
      const memberDate = new Date(member.date_of_joining);
      const toDate = new Date(filters.dateTo);
      if (memberDate > toDate) return false;
    }
    
    // Status filter
    if (exportFormat !== "All" && 
        member.active_status !== (exportFormat === "Active")) {
      return false;
    }
    
    return true;
  });

  const total = filteredMembers.reduce((sum, member) => {
    return sum + (member.total_business || 0);
  }, 0);

  const totalBonus = filteredMembers.reduce((sum, member) => {
    return sum + calculateProfitSharingBonus(member.total_business);
  }, 0);

  setLevelIncome(total);
  setLevelBonus(totalBonus);
};

  // Function to calculate profit sharing bonus
  const calculateProfitSharingBonus = (totalBusiness) => {
    if (!totalBusiness) return 0;
    return (totalBusiness * 0.06) / 20; // 6% divided by 20
  };

  const handleSubmit = () => {
    // Filtering will be done on the already loaded data
  };

  const handleExport = (format) => {
    console.log(`Exporting data in ${format} format`);
    // Export functionality would be implemented here
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div>Loading team data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  // Combine current member with team members for display
  const allTeamData = [
    ...teamData.teamMembers.map((member) => ({
      id: member.id,
      memberId: member.member_id,
      member: member.name,
      sponsorCode: member.sponsor_code,
      sponsorName: member.sponsor_name,
      doj: member.date_of_joining,
      topup_date: member.topup_date
        ? new Date(member.topup_date).toLocaleDateString("en-GB")
        : "N/A",
      topup_amount: member.topup_amount
        ? `$${member.topup_amount.toFixed(2)}`
        : "N/A",
      status: member.active_status ? "Active" : "InActive",
      level: member.level,
      totalretopup: member.total_retopup
        ? `$${member.total_retopup.toFixed(2)}`
        : "$0.00",
      total_business: member.total_business,
      profit_sharing_bonus: calculateProfitSharingBonus(member.total_business) // Add bonus calculation
    })),
  ];

  // Apply filters
  let filteredData = allTeamData;

  // Filter by date range
  if (filters.dateFrom) {
    filteredData = filteredData.filter((item) => {
      if (item.doj === "N/A") return true;
      const itemDate = new Date(item.doj.split("/").reverse().join("-"));
      const fromDate = new Date(filters.dateFrom);
      return itemDate >= fromDate;
    });
  }

  if (filters.dateTo) {
    filteredData = filteredData.filter((item) => {
      if (item.doj === "N/A") return true;
      const itemDate = new Date(item.doj.split("/").reverse().join("-"));
      const toDate = new Date(filters.dateTo);
      return itemDate <= toDate;
    });
  }

  // Filter by level
  if (filters.levelNo !== "All") {
    filteredData = filteredData.filter(
      (item) => item.level === parseInt(filters.levelNo)
    );
  }

  // Filter by status (Active/InActive)
  if (exportFormat !== "All") {
    filteredData = filteredData.filter((item) => item.status === exportFormat);
  }

  return (
    <div className="min-h-screen bg-gray-50 p-2 md:p-2">
      {/* Transaction Details Modal */}
      {transactionDetails.show && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white p-4 border-b flex justify-between items-center">
              <h3 className="text-lg font-semibold">
                Transaction Details for {transactionDetails.member?.name} (
                {transactionDetails.member?.id})
              </h3>
              <button
                onClick={() =>
                  setTransactionDetails((prev) => ({ ...prev, show: false }))
                }
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-4">
              {transactionDetails.loading ? (
                <div className="flex justify-center py-8">
                  <div>Loading transaction details...</div>
                </div>
              ) : (
                <>
                  <div className="mb-8">
                    <h4 className="text-md font-medium mb-2 text-blue-600">
                      Top-Up Transactions
                    </h4>
                    {transactionDetails.topups.length > 0 ? (
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-100">
                            <tr>
                              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                                Date
                              </th>
                              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                                Type
                              </th>
                              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                                Plan
                              </th>
                              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                                Amount
                              </th>
                              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                                Status
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {transactionDetails.topups.map((txn, index) => (
                              <tr key={`topup-${index}`}>
                                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                                  {new Date(
                                    txn.transaction_date
                                  ).toLocaleString()}
                                </td>
                                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                                  {txn.transaction_type}
                                </td>
                                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                                  {txn.plan_type}
                                </td>
                                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                                  ${txn.amount.toFixed(2)}
                                </td>
                                <td className="px-4 py-2 whitespace-nowrap text-sm">
                                  <span
                                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                                      txn.status === "completed"
                                        ? "bg-green-100 text-green-800"
                                        : "bg-yellow-100 text-yellow-800"
                                    }`}
                                  >
                                    {txn.status}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <div className="text-gray-500 py-4">
                        No top-up transactions found
                      </div>
                    )}
                  </div>

                  <div>
                    <h4 className="text-md font-medium mb-2 text-green-600">
                      Re-Top-Up Transactions
                    </h4>
                    {transactionDetails.retopups.length > 0 ? (
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-100">
                            <tr>
                              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                                Date
                              </th>
                              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                                Plan
                              </th>
                              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                                Amount
                              </th>
                              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                                Status
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {transactionDetails.retopups.map((txn, index) => (
                              <tr key={`retopup-${index}`}>
                                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                                  {new Date(
                                    txn.transaction_date
                                  ).toLocaleString()}
                                </td>
                                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                                  {txn.plan_type}
                                </td>
                                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                                  ${txn.amount.toFixed(2)}
                                </td>
                                <td className="px-4 py-2 whitespace-nowrap text-sm">
                                  <span
                                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                                      txn.status === "completed"
                                        ? "bg-green-100 text-green-800"
                                        : "bg-yellow-100 text-yellow-800"
                                    }`}
                                  >
                                    {txn.status}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <div className="text-gray-500 py-4">
                        No re-top-up transactions found
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-gray-600 text-white p-3 md:p-4 rounded-t-lg w-full overflow-hidden">
          <h1 className="text-lg md:text-xl font-semibold truncate">
            List of Levelwise Team Member(s)
          </h1>
          <p className="text-xs md:text-sm mt-1 truncate">
            Viewing team for: {teamData.currentMember.name} (
            {teamData.currentMember.member_id})
          </p>
        </div>

        {/* Filter Section */}
        <div className="bg-white p-3 md:p-6 border-l border-r border-gray-200 w-full overflow-hidden">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 items-end w-full">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date From
              </label>
              <input
                type="date"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={filters.dateFrom}
                onChange={(e) => handleFilterChange("dateFrom", e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                To Date
              </label>
              <input
                type="date"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={filters.dateTo}
                onChange={(e) => handleFilterChange("dateTo", e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Level No
              </label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={filters.levelNo}
                onChange={(e) => handleFilterChange("levelNo", e.target.value)}
              >
                <option value="All">All</option>
                <option value="0">You (0)</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
                <option value="6">6</option>
                <option value="7">7</option>
                <option value="8">8</option>
                <option value="9">9</option>
                <option value="10">10</option>
              </select>
            </div>

            <div>
              <button
                onClick={handleSubmit}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
              >
                Submit
              </button>
            </div>
          </div>
        </div>

        {/* Results Header */}
        <div className="bg-white px-3 md:px-6 py-2 md:py-4 border-l border-r border-gray-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-2 w-full overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-4">
            <span className="text-xs md:text-sm text-gray-700 font-medium">
              Total Team Members ({filteredData.length})
            </span>
            {filters.levelNo !== "All" && (
              <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-4">
                <span className="text-xs md:text-sm text-blue-600 font-medium">
                  Level {filters.levelNo}
                </span>
                <span className="text-xs md:text-sm text-blue-600 font-medium">
                  Total Business: ${levelIncome.toFixed(2)}
                </span>
                <span className="text-xs md:text-sm text-green-600 font-medium">
                  Total Bonus: ${levelBonus.toFixed(3)}
                </span>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-3 mb-5">
            {/* Export buttons */}
            <button
              onClick={() => handleExport("excel")}
              className="bg-green-600 hover:bg-green-700 text-white p-2 rounded"
              title="Export to Excel"
            >
              <FileSpreadsheet size={16} />
            </button>

            <button
              onClick={() => handleExport("pdf")}
              className="bg-red-600 hover:bg-red-700 text-white p-2 rounded"
              title="Export to PDF"
            >
              <FileText size={16} />
            </button>

            <button
              onClick={() => handleExport("print")}
              className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded"
              title="Print"
            >
              <Printer size={16} />
            </button>

            {/* Entries per page */}
            <select
              className="px-3 py-1 border border-gray-300 rounded"
              value={entriesPerPage}
              onChange={(e) => setEntriesPerPage(parseInt(e.target.value))}
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>

            <select
              className="px-3 py-1 border border-gray-300 rounded"
              value={exportFormat}
              onChange={(e) => setExportFormat(e.target.value)}
            >
              <option value="All">All</option>
              <option value="Active">Active</option>
              <option value="InActive">InActive</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white border border-gray-200 rounded-b-lg overflow-hidden">
          <div className="overflow-x-auto">
            <div className="min-w-[1024px] md:w-full">
              {" "}
              {/* Force minimum width on mobile */}
              <table className="w-full">
                <thead className="bg-gray-600 text-white">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium">
                      Sl.No
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium">
                      DOJ
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium">
                      Member Id
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium">
                      Member Name
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium">
                      Sponsor Code
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium">
                      Sponsor Name
                    </th>

                    <th className="px-4 py-3 text-left text-sm font-medium">
                      Topup Date
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium">
                      Topup Amount
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium">
                      Total Re Top up
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium">
                      Total Business
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium">
                      Profit Sharing Bonus
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium">
                      Level
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredData
                    .slice(0, entriesPerPage)
                    .map((member, index) => (
                      <tr key={member.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm text-gray-900">
                          {index + 1}.
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900">
                          {member.doj}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900">
                          <button
                            onClick={() =>
                              fetchMemberTransactions(
                                member.memberId,
                                member.member
                              )
                            }
                            className="text-blue-600 hover:text-blue-800 hover:underline"
                          >
                            {member.memberId}
                          </button>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900">
                          {member.member}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900">
                          {member.sponsorCode}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900">
                          {member.sponsorName}
                        </td>

                        <td className="px-4 py-3 text-sm text-gray-900">
                          {member.topup_date || "N/A"}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900">
                          {member.topup_amount || "N/A"}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900">
                          {member.totalretopup || "N/A"}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900">
                          {member.total_business
                            ? `$${member.total_business.toFixed(2)}`
                            : "$0.00"}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900">
                          {member.profit_sharing_bonus
                            ? `$${member.profit_sharing_bonus.toFixed(3)}`
                            : "$0.00"}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              member.status === "Active"
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {member.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900">
                          {member.level}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const LevelView = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        <AppSidebar />
        <div className="flex-1 flex flex-col overflow-x-hidden">
          <DashboardHeader />
          <main className="flex-1 p-2 md:p-2 overflow-x-hidden">
            <LevelTeam />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default LevelView;