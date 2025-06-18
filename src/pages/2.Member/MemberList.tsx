import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { DashboardHeader } from "@/components/DashboardHeader";

import React, { useState, useMemo } from "react";
import {
  Search,
  Filter,
  Download,
  FileText,
  Plus,
  Edit,
  Ban,
  UserCheck,
} from "lucide-react";

const ViewMember = () => {
  // Sample data - replace with your actual data
  const [members] = useState([
    {
      id: 1,
      memberId: "245037",
      name: "Vipul bhai",
      sponsorCode: "100001",
      sponsorName: "Company 1",
      package: "Premium",
      phoneNumber: "9913023612",
      password: "123456",
      doj: "2025-05-13",
      activeStatus: "Inactive",
    },
    {
      id: 2,
      memberId: "949317",
      name: "Raju Maity",
      sponsorCode: "100001",
      sponsorName: "Company 1",
      package: "Gold",
      phoneNumber: "7896720951",
      password: "123456",
      doj: "2025-03-01",
      activeStatus: "Active",
    },
    {
      id: 3,
      memberId: "421098",
      name: "Tapas Sett",
      sponsorCode: "100001",
      sponsorName: "Company 1",
      package: "Silver",
      phoneNumber: "8240229481",
      password: "123456",
      doj: "2023-09-29",
      activeStatus: "Active",
    },
    {
      id: 4,
      memberId: "568189",
      name: "Goutam Singh",
      sponsorCode: "100001",
      sponsorName: "Company 1",
      package: "Premium",
      phoneNumber: "9875584653",
      password: "123456",
      doj: "2023-09-29",
      activeStatus: "Active",
    },
    {
      id: 5,
      memberId: "243752",
      name: "mangal",
      sponsorCode: "100001",
      sponsorName: "Company 1",
      package: "Basic",
      phoneNumber: "1598753215",
      password: "3897",
      doj: "2023-09-29",
      activeStatus: "Active",
    },
    {
      id: 6,
      memberId: "731542",
      name: "amit",
      sponsorCode: "100001",
      sponsorName: "Company 1",
      package: "Gold",
      phoneNumber: "988989898",
      password: "123456",
      doj: "2023-09-29",
      activeStatus: "Active",
    },
    {
      id: 7,
      memberId: "876376",
      name: "bipul",
      sponsorCode: "100001",
      sponsorName: "Company 1",
      package: "Silver",
      phoneNumber: "987456344",
      password: "123456",
      doj: "2023-09-29",
      activeStatus: "Active",
    },
    {
      id: 8,
      memberId: "122977",
      name: "biru",
      sponsorCode: "100001",
      sponsorName: "Company 1",
      package: "Premium",
      phoneNumber: "8617414838",
      password: "123456",
      doj: "2023-09-29",
      activeStatus: "Active",
    },
    {
      id: 9,
      memberId: "148018",
      name: "biru",
      sponsorCode: "100001",
      sponsorName: "Company 1",
      package: "Basic",
      phoneNumber: "8617414838",
      password: "123456",
      doj: "2023-09-29",
      activeStatus: "Active",
    },
    {
      id: 10,
      memberId: "922924",
      name: "Wazir",
      sponsorCode: "100001",
      sponsorName: "Company 1",
      package: "Gold",
      phoneNumber: "7017127812",
      password: "123456",
      doj: "2023-09-19",
      activeStatus: "Active",
    },
    {
      id: 11,
      memberId: "891832",
      name: "Abc",
      sponsorCode: "100001",
      sponsorName: "Company 1",
      package: "Silver",
      phoneNumber: "0000000000",
      password: "1783",
      doj: "2022-07-23",
      activeStatus: "Active",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  // Filter states
  const [filters, setFilters] = useState({
    dateFrom: "",
    dateTo: "",
    package: "",
    memberCode: "",
    memberName: "",
    activeStatus: "",
  });

  // Filter and search logic
  const filteredMembers = useMemo(() => {
    return members.filter((member) => {
      const matchesSearch =
        member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.memberId.includes(searchTerm) ||
        member.phoneNumber.includes(searchTerm) ||
        member.sponsorName.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesDateFrom =
        !filters.dateFrom || member.doj >= filters.dateFrom;
      const matchesDateTo = !filters.dateTo || member.doj <= filters.dateTo;
      const matchesPackage =
        !filters.package || member.package === filters.package;
      const matchesMemberCode =
        !filters.memberCode || member.memberId.includes(filters.memberCode);
      const matchesMemberName =
        !filters.memberName ||
        member.name.toLowerCase().includes(filters.memberName.toLowerCase());
      const matchesActiveStatus =
        !filters.activeStatus || member.activeStatus === filters.activeStatus;

      return (
        matchesSearch &&
        matchesDateFrom &&
        matchesDateTo &&
        matchesPackage &&
        matchesMemberCode &&
        matchesMemberName &&
        matchesActiveStatus
      );
    });
  }, [members, searchTerm, filters]);

  // Pagination logic
  const totalPages = Math.ceil(filteredMembers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedMembers = filteredMembers.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setFilters({
      dateFrom: "",
      dateTo: "",
      package: "",
      memberCode: "",
      memberName: "",
      activeStatus: "",
    });
    setCurrentPage(1);
  };

  const handleExport = (type) => {
    alert(`Exporting to ${type.toUpperCase()}...`);
  };

  const handleAction = (action, member) => {
    alert(`${action} action for member: ${member.name}`);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-lg shadow-sm">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            View Members
          </h1>

          {/* Top Controls */}
          <div className="flex flex-wrap gap-4 items-center justify-between mb-4">
            {/* Search */}
            <div className="relative flex-1 min-w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search members..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <button
                onClick={() => handleAction("Add", {})}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add
              </button>
              <button
                onClick={() => handleExport("excel")}
                className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 flex items-center gap-2"
              >
                <FileText className="w-4 h-4" />
                Excel
              </button>
              <button
                onClick={() => handleExport("pdf")}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                PDF
              </button>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
              >
                <Filter className="w-4 h-4" />
                Filter
              </button>
            </div>
          </div>

          {/* Items per page */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Show</span>
            <select
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="border border-gray-300 rounded px-2 py-1 text-sm"
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
            <span className="text-sm text-gray-600">entries</span>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg border">
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date From
                  </label>
                  <input
                    type="date"
                    value={filters.dateFrom}
                    onChange={(e) =>
                      handleFilterChange("dateFrom", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date To
                  </label>
                  <input
                    type="date"
                    value={filters.dateTo}
                    onChange={(e) =>
                      handleFilterChange("dateTo", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Package
                  </label>
                  <select
                    value={filters.package}
                    onChange={(e) =>
                      handleFilterChange("package", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">All Packages</option>
                    <option value="Basic">Basic</option>
                    <option value="Silver">Silver</option>
                    <option value="Gold">Gold</option>
                    <option value="Premium">Premium</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Member Code
                  </label>
                  <input
                    type="text"
                    value={filters.memberCode}
                    onChange={(e) =>
                      handleFilterChange("memberCode", e.target.value)
                    }
                    placeholder="Enter member code"
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Member Name
                  </label>
                  <input
                    type="text"
                    value={filters.memberName}
                    onChange={(e) =>
                      handleFilterChange("memberName", e.target.value)
                    }
                    placeholder="Enter member name"
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    value={filters.activeStatus}
                    onChange={(e) =>
                      handleFilterChange("activeStatus", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">All Status</option>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>
              <div className="mt-4">
                <button
                  onClick={clearFilters}
                  className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-600 text-white">
                <th className="px-4 py-3 text-left text-sm font-medium">
                  Sl No.
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium">
                  Member Id
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium">
                  Name
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium">
                  Sponsor Code
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium">
                  Sponsor Name
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium">
                  Package
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium">
                  Phone Number
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium">
                  Password
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium">DOJ</th>
                <th className="px-4 py-3 text-left text-sm font-medium">
                  Active Status
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium">
                  Position
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedMembers.map((member, index) => (
                <tr
                  key={member.id}
                  className="border-b border-gray-200 hover:bg-gray-50"
                >
                  <td className="px-4 py-3 text-sm text-gray-900">
                    {startIndex + index + 1}
                  </td>
                  <td className="px-4 py-3 text-sm text-blue-600 font-medium">
                    {member.memberId}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">
                    {member.name}
                  </td>
                  <td className="px-4 py-3 text-sm text-blue-600">
                    {member.sponsorCode}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">
                    {member.sponsorName}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        member.package === "Premium"
                          ? "bg-purple-100 text-purple-800"
                          : member.package === "Gold"
                          ? "bg-yellow-100 text-yellow-800"
                          : member.package === "Silver"
                          ? "bg-gray-100 text-gray-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {member.package}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">
                    {member.phoneNumber}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">
                    {member.password}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">
                    {new Date(member.doj).toLocaleDateString("en-GB")}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        member.activeStatus === "Active"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {member.activeStatus}
                    </span>
                  </td>
                  {/* <td className="px-4 py-3 text-sm">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleAction("Update", member)}
                        className="text-blue-600 hover:text-blue-800 p-1 rounded"
                        title="Update"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() =>
                          handleAction(
                            member.activeStatus === "Active"
                              ? "Block"
                              : "Unblock",
                            member
                          )
                        }
                        className={`p-1 rounded ${
                          member.activeStatus === "Active"
                            ? "text-red-600 hover:text-red-800"
                            : "text-green-600 hover:text-green-800"
                        }`}
                        title={
                          member.activeStatus === "Active" ? "Block" : "Unblock"
                        }
                      >
                        {member.activeStatus === "Active" ? (
                          <Ban className="w-4 h-4" />
                        ) : (
                          <UserCheck className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </td> */}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Showing {startIndex + 1} to{" "}
            {Math.min(startIndex + itemsPerPage, filteredMembers.length)} of{" "}
            {filteredMembers.length} entries
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-1 border rounded text-sm ${
                  currentPage === page
                    ? "bg-blue-600 text-white border-blue-600"
                    : "border-gray-300 hover:bg-gray-50"
                }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const MemberList = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <DashboardHeader />
          <main className="flex-1 p-6">
            <ViewMember />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default MemberList;
