import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { DashboardHeader } from "@/components/DashboardHeader";
import React, { useState, useEffect, useMemo } from "react";

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
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const ViewMember = () => {
  const navigate = useNavigate();
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter and pagination states
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
    position: "",
  });

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const memberId = localStorage.getItem("memberId"); // For dynamic title
        if (!token) {
          navigate("/login");
          return;
        }

        const response = await axios.get(`${API_BASE_URL}/my-member`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setMembers(response.data.members || []);
      } catch (err) {
        setError(err.response?.data?.error || "Failed to fetch members");
        toast.error(err.response?.data?.error || "Failed to fetch members");
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, [navigate]);

  // Filter and search logic
  const filteredMembers = useMemo(() => {
    return members.filter((member) => {
      const matchesSearch =
        member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.member_id.includes(searchTerm) ||
        member.sponsor_name.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesDateFrom =
        !filters.dateFrom || member.date_of_joining >= filters.dateFrom;
      const matchesDateTo =
        !filters.dateTo || member.date_of_joining <= filters.dateTo;
      const matchesPackage =
        !filters.package || member.package === filters.package;
      const matchesMemberCode =
        !filters.memberCode || member.member_id.includes(filters.memberCode);
      const matchesMemberName =
        !filters.memberName ||
        member.name.toLowerCase().includes(filters.memberName.toLowerCase());
      const matchesActiveStatus =
        !filters.activeStatus ||
        (filters.activeStatus === "Active"
          ? member.active_status
          : !member.active_status);
      const matchesPosition =
        !filters.position || member.position === filters.position;

      return (
        matchesSearch &&
        matchesDateFrom &&
        matchesDateTo &&
        matchesPackage &&
        matchesMemberCode &&
        matchesMemberName &&
        matchesActiveStatus &&
        matchesPosition
      );
    });
  }, [members, searchTerm, filters]);

  // Calculate total PV based on filtered members
  const totalPV = useMemo(() => {
    return filteredMembers.reduce((sum, member) => sum + (parseFloat(member.pv)) || 0, 0);
  }, [filteredMembers]);

  // Calculate left and right PV totals
  const leftRightPV = useMemo(() => {
    return filteredMembers.reduce((acc, member) => {
      const pv = parseFloat(member.pv) || 0;
      if (member.position === "Left") {
        acc.left += pv;
      } else if (member.position === "Right") {
        acc.right += pv;
      }
      return acc;
    }, { left: 0, right: 0 });
  }, [filteredMembers]);

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
      position: "",
    });
    setCurrentPage(1);
  };

  const handleExport = (type) => {
    alert(`Exporting to ${type.toUpperCase()}...`);
  };

  const handleAction = (action, member) => {
    alert(`${action} action for member: ${member.name}`);
  };

  if (loading) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading members...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>Error: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-purple-900 text-white px-4 py-3 w-full text-center">
        <h1 className="text-lg md:text-xl font-medium text-white">
          {localStorage.getItem("memberId")
            ? "My Downline Members"
            : "View Members"}
        </h1>
      </div>

      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-4 md:p-6 border-b border-gray-200">
          {/* PV Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            {/* Total PV Card */}
            <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-blue-800">Total PV</h3>
                <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                  All
                </span>
              </div>
              <p className="text-2xl font-bold text-blue-600 mt-1">
                {totalPV.toFixed(2)}
              </p>
            </div>

            {/* Left PV Card */}
            <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-100">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-yellow-800">Left PV</h3>
                <span className="text-xs px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full">
                  Left
                </span>
              </div>
              <p className="text-2xl font-bold text-yellow-600 mt-1">
                {leftRightPV.left.toFixed(2)}
              </p>
            </div>

            {/* Right PV Card */}
            <div className="bg-green-50 p-3 rounded-lg border border-green-100">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-green-800">Right PV</h3>
                <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full">
                  Right
                </span>
              </div>
              <p className="text-2xl font-bold text-green-600 mt-1">
                {leftRightPV.right.toFixed(2)}
              </p>
            </div>
          </div>

          {/* Top Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
            <div className="relative w-full sm:max-w-xs">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search members..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm md:text-base"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Changed to justify-start on mobile */}
            <div className="flex flex-wrap justify-start sm:justify-end gap-2">
              <button
                onClick={() => navigate("/member/add-member")}
                className="bg-green-600 hover:bg-green-700 text-white p-2 rounded flex items-center gap-1 text-xs md:text-sm"
                title="Add Member"
              >
                <Plus size={16} />
                <span className="hidden sm:inline">Add</span>
              </button>
              <button
                onClick={() => handleExport("excel")}
                className="bg-emerald-600 hover:bg-emerald-700 text-white p-2 rounded flex items-center gap-1 text-xs md:text-sm"
                title="Export to Excel"
              >
                <FileText size={16} />
                <span className="hidden sm:inline">Excel</span>
              </button>
              <button
                onClick={() => handleExport("pdf")}
                className="bg-red-600 hover:bg-red-700 text-white p-2 rounded flex items-center gap-1 text-xs md:text-sm"
                title="Export to PDF"
              >
                <Download size={16} />
                <span className="hidden sm:inline">PDF</span>
              </button>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2 text-xs md:text-sm"
              >
                <Filter className="w-4 h-4" />
                <span>Filter</span>
              </button>
            </div>
          </div>

          {/* Items per page */}
          <div className="flex items-center gap-2 text-xs md:text-sm">
            <span className="text-gray-600">Show</span>
            <select
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="border border-gray-300 rounded px-2 py-1"
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
            <span className="text-gray-600">entries</span>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <div className="mt-4 p-3 md:p-4 bg-gray-50 rounded-lg border">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
                <div>
                  <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">
                    Date From
                  </label>
                  <input
                    type="date"
                    value={filters.dateFrom}
                    onChange={(e) =>
                      handleFilterChange("dateFrom", e.target.value)
                    }
                    className="w-full px-2 py-1 md:px-3 md:py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent text-xs md:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">
                    Date To
                  </label>
                  <input
                    type="date"
                    value={filters.dateTo}
                    onChange={(e) =>
                      handleFilterChange("dateTo", e.target.value)
                    }
                    className="w-full px-2 py-1 md:px-3 md:py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent text-xs md:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">
                    Package
                  </label>
                  <select
                    value={filters.package}
                    onChange={(e) =>
                      handleFilterChange("package", e.target.value)
                    }
                    className="w-full px-2 py-1 md:px-3 md:py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent text-xs md:text-sm"
                  >
                    {/* <option value="">All Packages</option>
                    <option value="Basic">Basic</option>
                    <option value="Silver">Silver</option>
                    <option value="Gold">Gold</option>
                    <option value="Premium">Premium</option> */}
                  </select>
                </div>
                <div>
                  <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">
                    Member Code
                  </label>
                  <input
                    type="text"
                    value={filters.memberCode}
                    onChange={(e) =>
                      handleFilterChange("memberCode", e.target.value)
                    }
                    placeholder="Enter member code"
                    className="w-full px-2 py-1 md:px-3 md:py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent text-xs md:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    value={filters.activeStatus}
                    onChange={(e) =>
                      handleFilterChange("activeStatus", e.target.value)
                    }
                    className="w-full px-2 py-1 md:px-3 md:py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent text-xs md:text-sm"
                  >
                    <option value="">All Status</option>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">
                    Position
                  </label>
                  <select
                    value={filters.position}
                    onChange={(e) =>
                      handleFilterChange("position", e.target.value)
                    }
                    className="w-full px-2 py-1 md:px-3 md:py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent text-xs md:text-sm"
                  >
                    <option value="">All Positions</option>
                    <option value="Left">Left</option>
                    <option value="Right">Right</option>
                  </select>
                </div>
              </div>

              <div className="mt-3 md:mt-4">
                <button
                  onClick={clearFilters}
                  className="bg-gray-600 text-white px-3 py-1 md:px-4 md:py-2 rounded-lg hover:bg-gray-700 text-xs md:text-sm"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <div className="min-w-[1000px] md:w-full">
            <table className="w-full">
              <thead className="bg-purple-700 text-white">
                <tr>
                  <th className="px-3 py-3 text-left text-xs md:text-sm font-medium">
                    Sl No.
                  </th>
                  <th className="px-3 py-3 text-left text-xs md:text-sm font-medium">
                    DOJ
                  </th>
                  <th className="px-3 py-3 text-left text-xs md:text-sm font-medium">
                    Member ID
                  </th>
                  <th className="px-3 py-3 text-left text-xs md:text-sm font-medium">
                    Name
                  </th>
                  <th className="px-3 py-3 text-left text-xs md:text-sm font-medium">
                    Sponsor Code
                  </th>
                  <th className="px-3 py-3 text-left text-xs md:text-sm font-medium">
                    Sponsor Name
                  </th>
                  <th className="px-3 py-3 text-left text-xs md:text-sm font-medium">
                    Position
                  </th>
                  <th className="px-3 py-3 text-left text-xs md:text-sm font-medium">
                    Topup Date
                  </th>
                  <th className="px-3 py-3 text-left text-xs md:text-sm font-medium">
                    Topup Amount
                  </th>
                  <th className="px-3 py-3 text-left text-xs md:text-sm font-medium">
                    P.V.
                  </th>
                  <th className="px-3 py-3 text-left text-xs md:text-sm font-medium">
                    Package
                  </th>
                  <th className="px-3 py-3 text-left text-xs md:text-sm font-medium">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginatedMembers.length === 0 ? (
                  <tr>
                    <td
                      colSpan={11}
                      className="px-4 py-6 text-center text-gray-500 text-xs md:text-sm"
                    >
                      No members found
                    </td>
                  </tr>
                ) : (
                  paginatedMembers.map((member, index) => (
                    <tr
                      key={member.id}
                      className="border-b border-gray-200 hover:bg-gray-50 h-14"
                    >
                      <td className="px-3 py-4 text-xs md:text-sm text-gray-900 bg-white">
                        {startIndex + index + 1}
                      </td>
                     <td className="px-3 py-4 text-xs md:text-sm text-gray-900">
  <div className="flex flex-col">
    <span>
      {new Date(member.date_of_joining).toLocaleDateString("en-GB")}
    </span>
    <span className="text-xs text-gray-500">
      {member.join_time || 'N/A'}
    </span>
  </div>
</td>
                      <td className="px-3 py-4 text-xs md:text-sm text-blue-600 font-medium bg-white">
                        {member.member_id}
                      </td>
                      <td className="px-3 py-4 text-xs md:text-sm text-gray-900">
                        {member.name}
                      </td>
                      <td className="px-3 py-4 text-xs md:text-sm text-gray-900">
                        {member.sponsor_code}
                      </td>
                      <td className="px-3 py-4 text-xs md:text-sm text-gray-900">
                        {member.sponsor_name}
                      </td>
                      <td className="px-3 py-4 text-center">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            member.position === "Left"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {member.position}
                        </span>
                      </td>
                      <td className="px-3 py-4 text-xs md:text-sm text-gray-900">
                        {member.topup_date
                          ? new Date(member.topup_date).toLocaleDateString(
                              "en-GB"
                            )
                          : "N/A"}
                      </td>
                      <td className="px-3 py-4 text-xs md:text-sm text-gray-900">
                        ${member.topup_amount || "0"}
                      </td>
                      <td className="px-3 py-4 text-xs md:text-sm text-gray-900">
                        {member.pv || "0"}
                      </td>
                      <td className="px-3 py-4 text-xs md:text-sm whitespace-nowrap text-gray-900">
                        {member.package}
                      </td>
                      <td className="px-3 py-4 text-xs md:text-sm text-gray-900">
                        <span
                          className={`px-1 py-0.5 md:px-2 md:py-1 rounded-full text-xxs md:text-xs ${
                            member.active_status
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {member.active_status ? "Active" : "Inactive"}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        <div className="px-4 py-3 md:px-6 md:py-4 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs md:text-sm text-gray-600">
            Showing {startIndex + 1} to{" "}
            {Math.min(startIndex + itemsPerPage, filteredMembers.length)} of{" "}
            {filteredMembers.length} entries
          </div>
          <div className="flex flex-wrap gap-1 md:gap-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-2 py-1 md:px-3 md:py-1 border border-gray-300 rounded text-xs md:text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Previous
            </button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              if (totalPages <= 5) return i + 1;
              if (currentPage <= 3) return i + 1;
              if (currentPage >= totalPages - 2) return totalPages - 4 + i;
              return currentPage - 2 + i;
            }).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-2 py-1 md:px-3 md:py-1 border rounded text-xs md:text-sm ${
                  currentPage === page
                    ? "bg-blue-600 text-white border-blue-600"
                    : "border-gray-300 hover:bg-gray-50"
                }`}
              >
                {page}
              </button>
            ))}
            {totalPages > 5 && currentPage < totalPages - 2 && (
              <span className="px-2 py-1">...</span>
            )}
            {totalPages > 5 && currentPage < totalPages - 2 && (
              <button
                onClick={() => setCurrentPage(totalPages)}
                className={`px-2 py-1 md:px-3 md:py-1 border rounded text-xs md:text-sm ${
                  currentPage === totalPages
                    ? "bg-blue-600 text-white border-blue-600"
                    : "border-gray-300 hover:bg-gray-50"
                }`}
              >
                {totalPages}
              </button>
            )}
            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className="px-2 py-1 md:px-3 md:py-1 border border-gray-300 rounded text-xs md:text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
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
        <div className="flex-1 flex flex-col overflow-x-hidden">
          <DashboardHeader />
          <main className="flex-1 p-2 md:p-3 overflow-x-hidden">
            <ViewMember />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default MemberList;