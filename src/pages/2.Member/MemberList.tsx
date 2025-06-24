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
      <div className="bg-purple-900 text-white px-6 py-4 w-full text-center">
        <h1 className="text-xl font-medium text-white">
          {localStorage.getItem("memberId")
            ? "My Downline Members"
            : "View Members"}
        </h1>
      </div>

      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6 border-b border-gray-200">
          {/* Top Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
            <div className="relative w-full sm:max-w-xs">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search members..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex flex-wrap justify-end gap-2">
              <button
                onClick={() => handleAction("Add", {})}
                className="bg-green-600 hover:bg-green-700 text-white p-2 rounded flex items-center gap-1"
                title="Add Member"
              >
                <Plus size={16} />
                <span className="hidden sm:inline">Add</span>
              </button>
              <button
                onClick={() => handleExport("excel")}
                className="bg-emerald-600 hover:bg-emerald-700 text-white p-2 rounded flex items-center gap-1"
                title="Export to Excel"
              >
                <FileText size={16} />
                <span className="hidden sm:inline">Excel</span>
              </button>
              <button
                onClick={() => handleExport("pdf")}
                className="bg-red-600 hover:bg-red-700 text-white p-2 rounded flex items-center gap-1"
                title="Export to PDF"
              >
                <Download size={16} />
                <span className="hidden sm:inline">PDF</span>
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

        {/* Updated Table Design */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-purple-700 text-white">
              <tr>
                <th className="sticky left-0 px-3 py-2 text-left text-xs sm:text-sm font-medium bg-purple-700">Sl No.</th>
                <th className="px-3 py-2 text-left text-xs sm:text-sm font-medium">DOJ</th>
                <th className="sticky left-12 px-3 py-2 text-left text-xs sm:text-sm font-medium bg-purple-700">Member ID</th>
                <th className="px-3 py-2 text-left text-xs sm:text-sm font-medium">Name</th>
                <th className="px-3 py-2 text-left text-xs sm:text-sm font-medium">Sponsor Code</th>
                <th className="px-3 py-2 text-left text-xs sm:text-sm font-medium">Sponsor Name</th>
                <th className="px-3 py-2 text-left text-xs sm:text-sm font-medium">Topup Date</th>
                <th className="px-3 py-2 text-left text-xs sm:text-sm font-medium">Topup Amount</th>
                <th className="px-3 py-2 text-center text-xs sm:text-sm font-medium">Package</th>
                <th className="px-3 py-2 text-center text-xs sm:text-sm font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {paginatedMembers.length === 0 ? (
                <tr>
                  <td colSpan={10} className="px-4 py-4 text-center text-gray-500 text-sm">
                    No members found
                  </td>
                </tr>
              ) : (
                paginatedMembers.map((member, index) => (
                  <tr key={member.id} className="border-b border-gray-200 hover:bg-gray-50">
                    {/* Sticky columns */}
                    <td className="sticky left-0 px-3 py-3 text-xs sm:text-sm text-gray-900 bg-white">
                      {startIndex + index + 1}
                    </td>
                    <td className="px-3 py-3 text-xs sm:text-sm text-gray-900">
                      {new Date(member.date_of_joining).toLocaleDateString("en-GB")}
                    </td>
                    <td className="sticky left-12 px-3 py-3 text-xs sm:text-sm text-blue-600 font-medium bg-white">
                      {member.member_id}
                    </td>
                    
                    {/* Regular columns */}
                    <td className="px-3 py-3 text-xs sm:text-sm text-gray-900">
                      {member.name}
                    </td>
                    <td className="px-3 py-3 text-xs sm:text-sm text-blue-600">
                      {member.sponsor_code}
                    </td>
                    <td className="px-3 py-3 text-xs sm:text-sm text-gray-900">
                      {member.sponsor_name}
                    </td>
                    
                    <td className="px-3 py-3 text-xs sm:text-sm text-gray-900">
                      {member.topup_date
                        ? new Date(member.topup_date).toLocaleDateString("en-GB")
                        : "N/A"}
                    </td>
                    <td className="px-3 py-3 text-xs sm:text-sm text-gray-900">
                      ${member.topup_amount || "0"}
                    </td>
                    <td className="px-3 py-3 text-center">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        member.package === "Premium" ? "bg-purple-100 text-purple-800" :
                        member.package === "Gold" ? "bg-yellow-100 text-yellow-800" :
                        member.package === "Silver" ? "bg-gray-100 text-gray-800" : 
                        "bg-blue-100 text-blue-800"
                      }`}>
                        {member.package}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-center">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        member.active_status ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                      }`}>
                        {member.active_status ? "Active" : "Inactive"}
                      </span>
                    </td>
                  </tr>
                ))
              )}
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