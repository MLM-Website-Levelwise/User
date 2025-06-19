import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { DashboardHeader } from "@/components/DashboardHeader";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, ShieldCheck } from "lucide-react";

import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// Add this interface at the top of your file
interface DashboardData {
  member: {
    id: number;
    member_id: string;
    name: string;
    status: string;
    package: string;
    sponsor_code: string;
  };
  counts: {
    sponsor: number;
    downline: number;
  };
  business: {
    left: number;
    right: number;
    difference: number;
  };
  investments: {
    self: number;
    team: number;
  };
  balances: {
    fund: number;
    working: number;
    prev_working: number;
  };
}

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }

        const response = await axios.get("http://localhost:5000/member-dashboard", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        setDashboardData(response.data);
      } catch (err) {
        console.error("Failed to fetch dashboard data:", err);
        setError("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [navigate]);


  
  if (loading) {
    return (
      <SidebarProvider>
        <div className="min-h-screen flex w-full bg-gray-50">
          <AppSidebar />
          <div className="flex-1 flex flex-col">
            <DashboardHeader />
            <main className="flex-1 p-6 flex items-center justify-center">
              <div>Loading dashboard data...</div>
            </main>
          </div>
        </div>
      </SidebarProvider>
    );
  }

  if (error) {
    return (
      <SidebarProvider>
        <div className="min-h-screen flex w-full bg-gray-50">
          <AppSidebar />
          <div className="flex-1 flex flex-col">
            <DashboardHeader />
            <main className="flex-1 p-6 flex items-center justify-center">
              <div className="text-red-500">{error}</div>
            </main>
          </div>
        </div>
      </SidebarProvider>
    );
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <DashboardHeader />
          <main className="flex-1 p-6">
            <div className="space-y-6">
              {/* Top Row */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Unlisted Share Card */}
                <Card className="bg-primary text-white">
                  <CardHeader>
                    <CardTitle className="text-white">Unlisted Share</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Button className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold">
                      Buy More
                    </Button>
                  </CardContent>
                </Card>

                {/* Status Card */}
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-gray-500">
                      Status
                    </CardTitle>
                    <ShieldCheck className="w-5 h-5 text-primary" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-gray-900">
                      {dashboardData?.member.status || 'LOADING'}
                    </div>
                    <div className="flex items-center space-x-2 mt-2">
                      <div className={`w-2 h-2 rounded-full ${
                        dashboardData?.member.status === 'ACTIVE' 
                          ? 'bg-green-500' 
                          : 'bg-red-500'
                      }`}></div>
                      <span className={`text-sm ${
                        dashboardData?.member.status === 'ACTIVE'
                          ? 'text-green-600'
                          : 'text-red-600'
                      }`}>
                        {dashboardData?.member.status === 'ACTIVE'
                          ? 'Active Status'
                          : 'Inactive Status'}
                      </span>
                    </div>
                  </CardContent>
                </Card>

                {/* News Board */}
                <Card>
                  <CardHeader>
                    <CardTitle>News Board</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>
                      Follow our telegram group for next update
                    </CardDescription>
                    <p className="text-xs text-gray-500 mt-2">01/01/2025</p>
                  </CardContent>
                </Card>
              </div>

              {/* Analytics Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Sponsor Count */}
                <Card className="bg-gradient-to-br from-purple-600 to-purple-800 text-white">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Sponsor Count
                    </CardTitle>
                    <MoreHorizontal className="w-4 h-4" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">
                      {dashboardData?.counts.sponsor || 0}
                    </div>
                    <div className="flex items-center space-x-2 mt-2">
                      <div className="w-3 h-3 bg-white rounded-full"></div>
                      <span className="text-sm opacity-90">Direct Count</span>
                    </div>
                  </CardContent>
                </Card>

                {/* Downline Count */}
                <Card className="bg-gradient-to-br from-purple-600 to-purple-800 text-white">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Downline Count
                    </CardTitle>
                    <MoreHorizontal className="w-4 h-4" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">
                      {dashboardData?.counts.downline || 0}
                    </div>
                    <div className="flex items-center space-x-2 mt-2">
                      <div className="w-3 h-3 bg-white rounded-full"></div>
                      <span className="text-sm opacity-90">Downline Count</span>
                    </div>
                  </CardContent>
                </Card>

                {/* Investment (Self) */}
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Investment (Self)
                    </CardTitle>
                    <MoreHorizontal className="w-4 h-4" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">
                      {dashboardData?.investments.self.toFixed(2) || '0.00'}
                    </div>
                    <div className="flex items-center space-x-2 mt-2">
                      <span className="text-sm text-green-600">
                        Rs. {dashboardData?.investments.self.toFixed(2) || '0.00'}
                      </span>
                      <span className="text-xs text-gray-500">
                        Investment (Self)
                      </span>
                    </div>
                  </CardContent>
                </Card>

                {/* Left Business */}
                <Card className="bg-gradient-to-br from-purple-600 to-purple-800 text-white">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Left Business
                    </CardTitle>
                    <MoreHorizontal className="w-4 h-4" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">
                      {dashboardData?.business.left || 0}
                    </div>
                    <div className="flex items-center space-x-2 mt-2">
                      <span className="text-sm bg-purple-500 px-2 py-1 rounded text-xs">
                        Rs. {dashboardData?.business.left || 0}
                      </span>
                      <span className="text-sm opacity-90">Left Business</span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Bottom Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Right Business */}
                <Card className="bg-gradient-to-br from-purple-600 to-purple-800 text-white">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Right Business
                    </CardTitle>
                    <MoreHorizontal className="w-4 h-4" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">1250</div>
                    <div className="flex items-center space-x-2 mt-2">
                      <span className="text-sm bg-purple-500 px-2 py-1 rounded text-xs">
                        Rs. 1250
                      </span>
                      <span className="text-sm opacity-90">Right Business</span>
                    </div>
                  </CardContent>
                </Card>

                {/* Investment (Team) */}
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Investment (Team)
                    </CardTitle>
                    <MoreHorizontal className="w-4 h-4" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">2500</div>
                    <div className="flex items-center space-x-2 mt-2">
                      <span className="text-sm text-green-600">Rs. 2500</span>
                      <span className="text-xs text-gray-500">
                        Investment (Team)
                      </span>
                    </div>
                  </CardContent>
                </Card>

                {/* Fund */}
                <Card className="bg-gradient-to-br from-purple-600 to-purple-800 text-white">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Fund</CardTitle>
                    <MoreHorizontal className="w-4 h-4" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">0.00</div>
                    <div className="flex items-center space-x-2 mt-2">
                      <span className="text-sm bg-red-500 px-2 py-1 rounded text-xs">
                        0.00
                      </span>
                      <span className="text-sm opacity-90">Fund Balance</span>
                    </div>
                  </CardContent>
                </Card>

                {/* Working */}
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Working
                    </CardTitle>
                    <MoreHorizontal className="w-4 h-4" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">28.200000</div>
                    <div className="flex items-center space-x-2 mt-2">
                      <span className="text-sm text-blue-600">28.200000</span>
                      <span className="text-xs text-gray-500">
                        Working Balance
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Prev Working */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-gradient-to-br from-purple-600 to-purple-800 text-white">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Prev Working
                    </CardTitle>
                    <MoreHorizontal className="w-4 h-4" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">0.00</div>
                    <div className="flex items-center space-x-2 mt-2">
                      <span className="text-sm bg-red-500 px-2 py-1 rounded text-xs">
                        0.00
                      </span>
                      <span className="text-sm opacity-90">Prev Working</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Dashboard;
