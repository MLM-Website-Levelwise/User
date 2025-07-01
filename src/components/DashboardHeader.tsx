import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Menu } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface MemberData {
  id: number;
  member_id: string;
  name: string;
  sponsor_code: string;
  package: string;
}
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
export function DashboardHeader() {
  const [memberData, setMemberData] = useState<MemberData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMemberData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }

        const response = await axios.get(`${API_BASE_URL}/member-details`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setMemberData(response.data);
      } catch (err) {
        console.error("Failed to fetch member data:", err);
        setError("Failed to load member data");
        // Optionally redirect to login if unauthorized
        if (axios.isAxiosError(err) && err.response?.status === 401) {
          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchMemberData();
  }, [navigate]);

  // Generate avatar initials from name
  const getAvatarInitials = (name: string) => {
    if (!name) return "US";
    const names = name.split(" ");
    return names.length > 1
      ? `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase()
      : names[0].substring(0, 2).toUpperCase();
  };

  if (loading) {
    return (
      <header className="bg-white border-b border-gray-200 px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <SidebarTrigger />
            <h1 className="text-2xl font-bold text-gray-900">Prime Next</h1>
          </div>
          <div className="animate-pulse">Loading...</div>
        </div>
      </header>
    );
  }

  if (error) {
    return (
      <header className="bg-white border-b border-gray-200 px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <SidebarTrigger />
            <h1 className="text-2xl font-bold text-gray-900">Prime Next</h1>
          </div>
          <div className="text-red-500">{error}</div>
        </div>
      </header>
    );
  }

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-3">
      <div className="flex items-center justify-between">
        {/* Left: Title & Hamburger */}
        <div className="flex items-center space-x-4">
          {/* Hamburger for mobile */}
          <button
            className="md:hidden block bg-blue-800 p-2 rounded-lg text-white shadow-md"
            onClick={() => {
              document.dispatchEvent(new CustomEvent("toggle-sidebar"));
            }}
          >
            <Menu size={20} />
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Prime Next</h1>
        </div>

        {/* Right: User Info */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 ml-5">
            <Avatar className="w-8 h-8">
              <AvatarImage src="./userimg.png" />
              <AvatarFallback className="bg-primary text-white text-sm">
                {memberData ? getAvatarInitials(memberData.name) : "US"}
              </AvatarFallback>
            </Avatar>
            <div className="text-sm">
              <div className="font-semibold text-gray-900">
                {memberData?.name || "Member"}
              </div>
              <div className="text-gray-500">
                {memberData?.member_id || "000000"}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
