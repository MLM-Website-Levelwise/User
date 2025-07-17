import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { DashboardHeader } from "@/components/DashboardHeader";
import React, { useState, useEffect, useMemo } from "react";
import {
  Search,
  Filter,
  Download,
  FileText,
  Calendar,
  User,
  UserCheck,
} from "lucide-react";
import axios from "axios";

interface Member {
  member_id: string;
  member_name: string;
  position: string;
  date_of_joining: string;
  topup_date: string | null;
  topup_amount: number | null;
  package: string;
  status: "Active" | "Inactive";
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

interface Filters {
  dateFrom: string;
  dateTo: string;
  sponsorId: string;
  status: string;
  position: string;
}

const DirectMember: React.FC = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Filter states
  const [filters, setFilters] = useState<Filters>({
    dateFrom: "",
    dateTo: "",
    sponsorId: "",
    status: "",
    position: "",
  });

  useEffect(() => {
    const fetchDirectReferrals = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        if (!token) {
          setError("Unauthorized: No token found");
          return;
        }

        const response = await axios.get(`${API_BASE_URL}/direct-referrals`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setMembers(response.data.members || []);
      } catch (err) {
        setError(
          err.response?.data?.error || "Failed to fetch direct referrals"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDirectReferrals();
  }, []);

  // Filter logic
  const filteredMembers = useMemo(() => {
    return members.filter((member) => {
      const matchesDateFrom =
        !filters.dateFrom || member.date_of_joining >= filters.dateFrom;
      const matchesDateTo =
        !filters.dateTo || member.date_of_joining <= filters.dateTo;
      const matchesSponsorId =
        !filters.sponsorId ||
        member.member_id
          .toLowerCase()
          .includes(filters.sponsorId.toLowerCase());
      const matchesStatus = !filters.status || member.status === filters.status;
      const matchesPosition =
        !filters.position || member.position === filters.position;

      return (
        matchesDateFrom &&
        matchesDateTo &&
        matchesSponsorId &&
        matchesStatus &&
        matchesPosition
      );
    });
  }, [members, filters]);

  // Pagination logic
  const totalPages = Math.ceil(filteredMembers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedMembers = filteredMembers.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const handleFilterChange = (key: keyof Filters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setFilters({
      dateFrom: "",
      dateTo: "",
      sponsorId: "",
      status: "",
      position: "",
    });
    setCurrentPage(1);
  };

  const handleExport = (type: "excel" | "pdf") => {
    alert(`Exporting to ${type.toUpperCase()}...`);
  };

  // Get unique sponsor IDs for filter dropdown (using member_id as sponsorId)
  const uniqueSponsorIds = [
    ...new Set(members.map((member) => member.member_id)),
  ].sort();

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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-purple-900 text-white px-4 py-3 sm:px-6 sm:py-4">
        <h1 className="text-lg sm:text-xl font-semibold text-center">
          Direct Member List
        </h1>
      </div>

      <div className="bg-white rounded-lg shadow-sm mx-2 sm:mx-0">
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-gray-200">
          {/* Top Controls */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-4">
            {/* Stats - Stack vertically on mobile */}
            <div className="flex justify-between gap-2 sm:gap-4 mb-4">
              {/* Total Members Card */}
              <div className="flex-1 bg-gradient-to-br from-blue-200/80 to-blue-300/90 rounded-lg p-2 border border-blue-200 shadow-xs">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-white/50 rounded-md">
                    <User className="w-4 h-4 text-blue-700" />
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-[10px] sm:text-xs font-medium text-blue-900/80 truncate">
                      Total
                    </p>
                    <p className="text-sm sm:text-base font-bold text-blue-900 truncate">
                      {filteredMembers.length.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Active Members Card */}
              <div className="flex-1 bg-gradient-to-br from-green-200/80 to-green-300/90 rounded-lg p-2 border border-green-200 shadow-xs">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-white/50 rounded-md">
                    <UserCheck className="w-4 h-4 text-green-700" />
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-[10px] sm:text-xs font-medium text-green-900/80 truncate">
                      Active
                    </p>
                    <p className="text-sm sm:text-base font-bold text-green-900 truncate">
                      {filteredMembers
                        .filter((m) => m.status === "Active")
                        .length.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Inactive Members Card */}
              <div className="flex-1 bg-gradient-to-br from-red-200/80 to-red-300/90 rounded-lg p-2 border border-red-200 shadow-xs">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-white/50 rounded-md">
                    <div className="w-4 h-4 flex items-center justify-center">
                      <div className="w-2.5 h-2.5 rounded-full bg-red-700"></div>
                    </div>
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-[10px] sm:text-xs font-medium text-red-900/80 truncate">
                      Inactive
                    </p>
                    <p className="text-sm sm:text-base font-bold text-red-900 truncate">
                      {filteredMembers
                        .filter((m) => m.status === "Inactive")
                        .length.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons - Wrap on mobile */}
            <div className="flex flex-wrap justify-start sm:justify-end gap-2">
              <button
                onClick={() => handleExport("excel")}
                className="bg-emerald-600 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg hover:bg-emerald-700 flex items-center gap-1 text-xs sm:text-sm"
              >
                <FileText className="w-3 h-3 sm:w-4 sm:h-4" />
                Excel
              </button>
              <button
                onClick={() => handleExport("pdf")}
                className="bg-red-600 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg hover:bg-red-700 flex items-center gap-1 text-xs sm:text-sm"
              >
                <Download className="w-3 h-3 sm:w-4 sm:h-4" />
                PDF
              </button>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="bg-blue-600 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg hover:bg-blue-700 flex items-center gap-1 text-xs sm:text-sm"
              >
                <Filter className="w-3 h-3 sm:w-4 sm:h-4" />
                {showFilters ? "Hide" : "Filters"}
              </button>
            </div>
          </div>

          {/* Items per page */}
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xs sm:text-sm text-gray-600">Show</span>
            <select
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="border border-gray-300 rounded px-2 py-1 text-xs sm:text-sm"
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
            <span className="text-xs sm:text-sm text-gray-600">entries</span>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <div className="mt-4 p-3 sm:p-4 bg-gray-50 rounded-lg border">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                    <Calendar className="inline w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                    Date From
                  </label>
                  <input
                    type="date"
                    value={filters.dateFrom}
                    onChange={(e) =>
                      handleFilterChange("dateFrom", e.target.value)
                    }
                    className="w-full px-2 py-1.5 sm:px-3 sm:py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent text-xs sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                    <Calendar className="inline w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                    Date To
                  </label>
                  <input
                    type="date"
                    value={filters.dateTo}
                    onChange={(e) =>
                      handleFilterChange("dateTo", e.target.value)
                    }
                    className="w-full px-2 py-1.5 sm:px-3 sm:py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent text-xs sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                    <User className="inline w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                    Member ID
                  </label>
                  <select
                    value={filters.sponsorId}
                    onChange={(e) =>
                      handleFilterChange("sponsorId", e.target.value)
                    }
                    className="w-full px-2 py-1.5 sm:px-3 sm:py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent text-xs sm:text-sm"
                  >
                    <option value="">All Members</option>
                    {uniqueSponsorIds.map((memberId) => (
                      <option key={memberId} value={memberId}>
                        {memberId}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                    <UserCheck className="inline w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                    Status
                  </label>
                  <select
                    value={filters.status}
                    onChange={(e) =>
                      handleFilterChange("status", e.target.value)
                    }
                    className="w-full px-2 py-1.5 sm:px-3 sm:py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent text-xs sm:text-sm"
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
              <div className="mt-3 sm:mt-4 flex flex-col sm:flex-row gap-2">
                <button
                  onClick={clearFilters}
                  className="bg-gray-600 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg hover:bg-gray-700 text-xs sm:text-sm"
                >
                  Clear Filters
                </button>
                <div className="text-xs sm:text-sm text-gray-600 flex items-center">
                  Showing {filteredMembers.length} of {members.length} members
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Table with horizontal scrolling */}
        <div className="overflow-x-auto">
          <div className="min-w-[800px] sm:min-w-0">
            <table className="w-full">
              <thead className="bg-purple-700 text-white">
                <tr>
                  <th className="px-2 py-1.5 sm:px-3 sm:py-2 text-left text-xs sm:text-sm font-medium bg-purple-700">
                    Sl No.
                  </th>
                  <th className="px-2 py-1.5 sm:px-3 sm:py-2 text-left text-xs sm:text-sm font-medium">
                    DOJ
                  </th>
                  <th className="px-2 py-1.5 sm:px-3 sm:py-2 text-left text-xs sm:text-sm font-medium bg-purple-700">
                    Member ID
                  </th>
                  <th className="px-2 py-1.5 sm:px-3 sm:py-2 text-left text-xs sm:text-sm font-medium">
                    Name
                  </th>
                  <th className="px-2 py-1.5 sm:px-3 sm:py-2 text-center text-xs sm:text-sm font-medium">
                    Position
                  </th>
                  <th className="px-2 py-1.5 sm:px-3 sm:py-2 text-left text-xs sm:text-sm font-medium">
                    Topup Date
                  </th>
                  <th className="px-2 py-1.5 sm:px-3 sm:py-2 text-left text-xs sm:text-sm font-medium">
                    Amount
                  </th>
                  <th className="px-2 py-1.5 sm:px-3 sm:py-2 text-center text-xs sm:text-sm font-medium">
                    Package
                  </th>
                  <th className="px-2 py-1.5 sm:px-3 sm:py-2 text-center text-xs sm:text-sm font-medium">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginatedMembers.length === 0 ? (
                  <tr>
                    <td
                      colSpan={9}
                      className="px-4 py-4 text-center text-gray-500 text-xs sm:text-sm"
                    >
                      No members found
                    </td>
                  </tr>
                ) : (
                  paginatedMembers.map((member, index) => (
                    <tr
                      key={member.member_id}
                      className="border-b border-gray-200 hover:bg-gray-50"
                    >
                      {/* Sticky columns for mobile */}
                      <td className="px-2 py-1.5 sm:px-3 sm:py-3 text-xs sm:text-sm text-gray-900 bg-white">
                        {startIndex + index + 1}
                      </td>
                      <td className="px-2 py-1.5 sm:px-3 sm:py-3 text-xs sm:text-sm text-gray-900">
                        {new Date(member.date_of_joining).toLocaleDateString(
                          "en-GB"
                        )}
                      </td>
                      <td className="px-2 py-1.5 sm:px-3 sm:py-3 text-xs sm:text-sm text-blue-600 font-medium bg-white">
                        {member.member_id}
                      </td>

                      {/* Regular columns */}
                      <td className="px-2 py-1.5 sm:px-3 sm:py-3 text-xs sm:text-sm text-gray-900">
                        {member.member_name}
                      </td>
                      <td className="px-2 py-1.5 sm:px-3 sm:py-3 text-xs sm:text-sm text-gray-900">
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

                      <td className="px-2 py-1.5 sm:px-3 sm:py-3 text-xs sm:text-sm text-gray-900">
                        {member.topup_date
                          ? new Date(member.topup_date)
                              .toISOString()
                              .split("T")[0]
                          : "N/A"}
                      </td>
                      <td className="px-2 py-1.5 sm:px-3 sm:py-3 text-xs sm:text-sm text-gray-900">
                        ${member.topup_amount || "N/A"}
                      </td>
                      <td className="px-2 py-1.5 sm:px-3 sm:py-3 text-xs sm:text-sm text-center">
                        {member.package}
                      </td>
                      <td className="px-2 py-1.5 sm:px-3 sm:py-3 text-center">
                        <span
                          className={`px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full text-xs sm:text-xs ${
                            member.status === "Active"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {member.status}
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
        {totalPages > 1 && (
          <div className="px-4 py-3 sm:px-6 sm:py-4 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="text-xs sm:text-sm text-gray-600">
              Showing {startIndex + 1} to{" "}
              {Math.min(startIndex + itemsPerPage, filteredMembers.length)} of{" "}
              {filteredMembers.length} entries
            </div>
            <div className="flex gap-1 sm:gap-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-2 py-1 sm:px-3 sm:py-1 border border-gray-300 rounded text-xs sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Previous
              </button>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const pageNum = i + 1;
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`px-2 py-1 sm:px-3 sm:py-1 border rounded text-xs sm:text-sm ${
                      currentPage === pageNum
                        ? "bg-blue-600 text-white border-blue-600"
                        : "border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
              {totalPages > 5 && (
                <>
                  <span className="px-1 sm:px-2 text-gray-500">...</span>
                  <button
                    onClick={() => setCurrentPage(totalPages)}
                    className={`px-2 py-1 sm:px-3 sm:py-1 border rounded text-xs sm:text-sm ${
                      currentPage === totalPages
                        ? "bg-blue-600 text-white border-blue-600"
                        : "border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    {totalPages}
                  </button>
                </>
              )}
              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="px-2 py-1 sm:px-3 sm:py-1 border border-gray-300 rounded text-xs sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const DirectMembers = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        <AppSidebar />
        <div className="flex-1 flex flex-col overflow-x-hidden">
          <DashboardHeader />
          <main className="flex-1 p-2 sm:p-2 md:p-2 overflow-x-hidden">
            <DirectMember />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default DirectMembers;
