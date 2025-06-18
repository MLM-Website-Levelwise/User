import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { DashboardHeader } from "@/components/DashboardHeader";

import React, { useState, useMemo } from "react";
import {
  Search,
  Filter,
  Download,
  FileText,
  Calendar,
  User,
  UserCheck,
} from "lucide-react";

interface Member {
  id: number;
  sponsorId: string;
  sponsorName: string;
  memberId: string;
  memberName: string;
  position: "Left" | "Right";
  dateOfJoining: string;
  status: "Active" | "Inactive";
}

interface Filters {
  dateFrom: string;
  dateTo: string;
  sponsorId: string;
  status: string;
}

const DirectMember: React.FC = () => {
  // Dummy data - replace with actual data from backend
  const [members] = useState<Member[]>([
    {
      id: 1,
      sponsorId: "SPO001",
      sponsorName: "John Doe",
      memberId: "MEM001",
      memberName: "Alice Johnson",
      position: "Left",
      dateOfJoining: "2024-01-15",
      status: "Active",
    },
    {
      id: 2,
      sponsorId: "SPO001",
      sponsorName: "John Doe",
      memberId: "MEM002",
      memberName: "Bob Smith",
      position: "Right",
      dateOfJoining: "2024-01-20",
      status: "Active",
    },
    {
      id: 3,
      sponsorId: "SPO002",
      sponsorName: "Jane Wilson",
      memberId: "MEM003",
      memberName: "Charlie Brown",
      position: "Left",
      dateOfJoining: "2024-02-10",
      status: "Inactive",
    },
    {
      id: 4,
      sponsorId: "SPO002",
      sponsorName: "Jane Wilson",
      memberId: "MEM004",
      memberName: "Diana Prince",
      position: "Right",
      dateOfJoining: "2024-02-15",
      status: "Active",
    },
    {
      id: 5,
      sponsorId: "SPO003",
      sponsorName: "Mike Davis",
      memberId: "MEM005",
      memberName: "Eva Martinez",
      position: "Left",
      dateOfJoining: "2024-03-01",
      status: "Active",
    },
    {
      id: 6,
      sponsorId: "SPO003",
      sponsorName: "Mike Davis",
      memberId: "MEM006",
      memberName: "Frank Miller",
      position: "Right",
      dateOfJoining: "2024-03-05",
      status: "Inactive",
    },
    {
      id: 7,
      sponsorId: "SPO004",
      sponsorName: "Sarah Connor",
      memberId: "MEM007",
      memberName: "Grace Hopper",
      position: "Left",
      dateOfJoining: "2024-04-12",
      status: "Active",
    },
    {
      id: 8,
      sponsorId: "SPO004",
      sponsorName: "Sarah Connor",
      memberId: "MEM008",
      memberName: "Henry Ford",
      position: "Right",
      dateOfJoining: "2024-04-18",
      status: "Active",
    },
    {
      id: 9,
      sponsorId: "SPO005",
      sponsorName: "Tom Anderson",
      memberId: "MEM009",
      memberName: "Ivy League",
      position: "Left",
      dateOfJoining: "2024-05-02",
      status: "Inactive",
    },
    {
      id: 10,
      sponsorId: "SPO005",
      sponsorName: "Tom Anderson",
      memberId: "MEM010",
      memberName: "Jack Ryan",
      position: "Right",
      dateOfJoining: "2024-05-10",
      status: "Active",
    },
    {
      id: 11,
      sponsorId: "SPO001",
      sponsorName: "John Doe",
      memberId: "MEM011",
      memberName: "Kate Middleton",
      position: "Left",
      dateOfJoining: "2024-06-01",
      status: "Active",
    },
    {
      id: 12,
      sponsorId: "SPO006",
      sponsorName: "Lisa Park",
      memberId: "MEM012",
      memberName: "Leo Messi",
      position: "Right",
      dateOfJoining: "2024-06-05",
      status: "Active",
    },
  ]);

  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Filter states
  const [filters, setFilters] = useState<Filters>({
    dateFrom: "",
    dateTo: "",
    sponsorId: "",
    status: "",
  });

  // Filter logic
  const filteredMembers = useMemo(() => {
    return members.filter((member) => {
      const matchesDateFrom =
        !filters.dateFrom || member.dateOfJoining >= filters.dateFrom;
      const matchesDateTo =
        !filters.dateTo || member.dateOfJoining <= filters.dateTo;
      const matchesSponsorId =
        !filters.sponsorId ||
        member.sponsorId
          .toLowerCase()
          .includes(filters.sponsorId.toLowerCase());
      const matchesStatus = !filters.status || member.status === filters.status;

      return (
        matchesDateFrom && matchesDateTo && matchesSponsorId && matchesStatus
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
    });
    setCurrentPage(1);
  };

  const handleExport = (type: "excel" | "pdf") => {
    alert(`Exporting to ${type.toUpperCase()}...`);
  };

  // Get unique sponsor IDs for filter dropdown
  const uniqueSponsorIds = [
    ...new Set(members.map((member) => member.sponsorId)),
  ].sort();

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-lg shadow-sm">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            Direct Member List
          </h1>

          {/* Top Controls */}
          <div className="flex flex-wrap gap-4 items-center justify-between mb-4">
            {/* Stats */}
            <div className="flex gap-6 text-sm">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-blue-600" />
                <span className="text-gray-600">Total Members: </span>
                <span className="font-semibold text-blue-600">
                  {filteredMembers.length}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-green-600" />
                <span className="text-gray-600">Active: </span>
                <span className="font-semibold text-green-600">
                  {filteredMembers.filter((m) => m.status === "Active").length}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-red-500"></div>
                <span className="text-gray-600">Inactive: </span>
                <span className="font-semibold text-red-600">
                  {
                    filteredMembers.filter((m) => m.status === "Inactive")
                      .length
                  }
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
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
                {showFilters ? "Hide Filters" : "Show Filters"}
              </button>
            </div>
          </div>

          {/* Items per page */}
          <div className="flex items-center gap-2 mb-4">
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
              <option value={100}>100</option>
            </select>
            <span className="text-sm text-gray-600">entries</span>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg border">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <Calendar className="inline w-4 h-4 mr-1" />
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
                    <Calendar className="inline w-4 h-4 mr-1" />
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
                    <User className="inline w-4 h-4 mr-1" />
                    Sponsor ID
                  </label>
                  <select
                    value={filters.sponsorId}
                    onChange={(e) =>
                      handleFilterChange("sponsorId", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">All Sponsors</option>
                    {uniqueSponsorIds.map((sponsorId) => (
                      <option key={sponsorId} value={sponsorId}>
                        {sponsorId}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <UserCheck className="inline w-4 h-4 mr-1" />
                    Status
                  </label>
                  <select
                    value={filters.status}
                    onChange={(e) =>
                      handleFilterChange("status", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">All Status</option>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>
              <div className="mt-4 flex gap-2">
                <button
                  onClick={clearFilters}
                  className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
                >
                  Clear Filters
                </button>
                <div className="text-sm text-gray-600 flex items-center">
                  Showing {filteredMembers.length} of {members.length} members
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-700 text-white">
                <th className="px-4 py-3 text-left text-sm font-medium">
                  Sl No.
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium">
                  Sponsor ID
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium">
                  Sponsor Name
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium">
                  Member ID
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium">
                  Member Name
                </th>
                <th className="px-4 py-3 text-center text-sm font-medium">
                  Left/Right
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium">
                  Date of Joining
                </th>
                <th className="px-4 py-3 text-center text-sm font-medium">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedMembers.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className="px-4 py-8 text-center text-gray-500"
                  >
                    No members found matching your criteria
                  </td>
                </tr>
              ) : (
                paginatedMembers.map((member, index) => (
                  <tr
                    key={member.id}
                    className="border-b border-gray-200 hover:bg-gray-50"
                  >
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {startIndex + index + 1}
                    </td>
                    <td className="px-4 py-3 text-sm text-blue-600 font-medium">
                      {member.sponsorId}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {member.sponsorName}
                    </td>
                    <td className="px-4 py-3 text-sm text-blue-600 font-medium">
                      {member.memberId}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900 font-medium">
                      {member.memberName}
                    </td>
                    <td className="px-4 py-3 text-sm text-center">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          member.position === "Left"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-purple-100 text-purple-800"
                        }`}
                      >
                        {member.position}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {new Date(member.dateOfJoining).toLocaleDateString(
                        "en-GB"
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm text-center">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
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

        {/* Pagination */}
        {totalPages > 1 && (
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
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const pageNum = i + 1;
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`px-3 py-1 border rounded text-sm ${
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
                  <span className="px-2 text-gray-500">...</span>
                  <button
                    onClick={() => setCurrentPage(totalPages)}
                    className={`px-3 py-1 border rounded text-sm ${
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
                className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
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
        <div className="flex-1 flex flex-col">
          <DashboardHeader />
          <main className="flex-1 p-6">
            <DirectMember />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default DirectMembers;
