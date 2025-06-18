import { useState } from "react";
import { FileSpreadsheet, FileText, Printer } from "lucide-react";

import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { DashboardHeader } from "@/components/DashboardHeader";

const LevelTeam = () => {
  // Dummy data with hierarchical structure
  const allTeamData = [
    {
      id: 1,
      memberId: "100001",
      member: "John Admin",
      sponsorCode: "000000",
      sponsorName: "Root",
      doj: "01/01/2020",
      status: "Active",
      level: 1,
    },
    {
      id: 2,
      memberId: "100002",
      member: "Sarah Manager",
      sponsorCode: "100001",
      sponsorName: "John Admin",
      doj: "15/02/2020",
      status: "Active",
      level: 2,
    },
    {
      id: 3,
      memberId: "100003",
      member: "Mike Johnson",
      sponsorCode: "100001",
      sponsorName: "John Admin",
      doj: "20/03/2020",
      status: "Active",
      level: 2,
    },
    {
      id: 4,
      memberId: "100004",
      member: "Emma Wilson",
      sponsorCode: "100002",
      sponsorName: "Sarah Manager",
      doj: "10/04/2020",
      status: "Active",
      level: 3,
    },
    {
      id: 5,
      memberId: "100005",
      member: "David Brown",
      sponsorCode: "100002",
      sponsorName: "Sarah Manager",
      doj: "25/04/2020",
      status: "InActive",
      level: 3,
    },
    {
      id: 6,
      memberId: "100006",
      member: "Lisa Davis",
      sponsorCode: "100003",
      sponsorName: "Mike Johnson",
      doj: "05/05/2020",
      status: "Active",
      level: 3,
    },
    {
      id: 7,
      memberId: "100007",
      member: "Tom Anderson",
      sponsorCode: "100004",
      sponsorName: "Emma Wilson",
      doj: "15/06/2020",
      status: "Active",
      level: 4,
    },
    {
      id: 8,
      memberId: "100008",
      member: "Anna Taylor",
      sponsorCode: "100004",
      sponsorName: "Emma Wilson",
      doj: "20/06/2020",
      status: "InActive",
      level: 4,
    },
    {
      id: 9,
      memberId: "100009",
      member: "Chris Martin",
      sponsorCode: "100005",
      sponsorName: "David Brown",
      doj: "01/07/2020",
      status: "Active",
      level: 4,
    },
    {
      id: 10,
      memberId: "100010",
      member: "Jessica Lee",
      sponsorCode: "100006",
      sponsorName: "Lisa Davis",
      doj: "10/07/2020",
      status: "Active",
      level: 4,
    },
    {
      id: 11,
      memberId: "100011",
      member: "Robert Clark",
      sponsorCode: "100007",
      sponsorName: "Tom Anderson",
      doj: "15/08/2020",
      status: "Active",
      level: 5,
    },
    {
      id: 12,
      memberId: "100012",
      member: "Maria Garcia",
      sponsorCode: "100008",
      sponsorName: "Anna Taylor",
      doj: "20/08/2020",
      status: "InActive",
      level: 5,
    },
    {
      id: 13,
      memberId: "100013",
      member: "James Wilson",
      sponsorCode: "100009",
      sponsorName: "Chris Martin",
      doj: "25/08/2020",
      status: "Active",
      level: 5,
    },
    {
      id: 14,
      memberId: "100014",
      member: "Linda Moore",
      sponsorCode: "100010",
      sponsorName: "Jessica Lee",
      doj: "30/08/2020",
      status: "Active",
      level: 5,
    },
    {
      id: 15,
      memberId: "100015",
      member: "Kevin White",
      sponsorCode: "100011",
      sponsorName: "Robert Clark",
      doj: "05/09/2020",
      status: "InActive",
      level: 6,
    },
  ];

  const [filteredData, setFilteredData] = useState(allTeamData);
  const [filters, setFilters] = useState({
    // memberCode: "",
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
  };

  const handleSubmit = () => {
    let filtered = allTeamData;

    // Filter by member code
    // if (filters.memberCode.trim()) {
    //   filtered = filtered.filter(
    //     (item) =>
    //       item.memberId
    //         .toLowerCase()
    //         .includes(filters.memberCode.toLowerCase()) ||
    //       item.member.toLowerCase().includes(filters.memberCode.toLowerCase())
    //   );
    // }

    // Filter by date range
    if (filters.dateFrom) {
      filtered = filtered.filter((item) => {
        const itemDate = new Date(item.doj.split("/").reverse().join("-"));
        const fromDate = new Date(filters.dateFrom);
        return itemDate >= fromDate;
      });
    }

    if (filters.dateTo) {
      filtered = filtered.filter((item) => {
        const itemDate = new Date(item.doj.split("/").reverse().join("-"));
        const toDate = new Date(filters.dateTo);
        return itemDate <= toDate;
      });
    }

    // Filter by level
    if (filters.levelNo !== "All") {
      filtered = filtered.filter(
        (item) => item.level === parseInt(filters.levelNo)
      );
    }

    setFilteredData(filtered);
  };

  const handleExport = (format) => {
    console.log(`Exporting data in ${format} format`);
    // Export functionality would be implemented here
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-gray-600 text-white p-4 rounded-t-lg">
          <h1 className="text-xl font-semibold">
            List of Levelwise Team Member(s)
          </h1>
        </div>

        {/* Filter Section */}
        <div className="bg-white p-6 border-l border-r border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
            {/* <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Member Code
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter member code"
                value={filters.memberCode}
                onChange={(e) =>
                  handleFilterChange("memberCode", e.target.value)
                }
              />
            </div> */}

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
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
                <option value="6">6</option>
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
        <div className="bg-white px-6 py-4 border-l border-r border-gray-200 flex justify-between items-center">
          <div>
            <span className="text-gray-700 font-medium">
              Total Team Member ({filteredData.length})
            </span>
          </div>

          <div className="flex items-center space-x-4">
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
            <table className="w-full">
              <thead className="bg-gray-600 text-white">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium">
                    S No
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium">
                    Member Id
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium">
                    Member
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium">
                    Sponsor Code
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium">
                    Sponsor Name
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium">
                    D O J
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
                {filteredData.slice(0, entriesPerPage).map((member, index) => (
                  <tr key={member.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {index + 1}.
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {member.memberId}
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
                      {member.doj}
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
  );
};

const LevelView = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <DashboardHeader />
          <main className="flex-1 p-6">
            <LevelTeam />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default LevelView;
