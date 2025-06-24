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
import { Users, Activity, UserPlus, Shield, Wallet, RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface DashboardData {
  member: {
    status: string;
  };
  counts: {
    downline: number;
    active_members: number;
    sponsor: number;
  };
  business: {
    left: number;
    right: number;
    difference: number;
  };
  balances: {
    fund: number;
    working: number;
  };
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }

        const response = await axios.get(`${API_BASE_URL}/member-dashboard`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        setDashboardData(response.data);
      } catch (err) {
        console.error("Failed to fetch dashboard data:", err);
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

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <DashboardHeader />
          <main className="flex-1 p-4 md:p-6">
            <div className="space-y-4">
              {/* Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Total Members Card */}
                <Card className="border-0 shadow-md bg-gradient-to-br from-blue-700 to-blue-800 text-white">
                  <CardHeader className="flex flex-row items-center justify-between p-4">
                    <CardTitle className="text-sm font-medium">
                      Total Members
                    </CardTitle>
                    <Users className="w-5 h-5" />
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <div className="text-2xl font-bold">
                      {dashboardData?.counts.downline || 0}
                    </div>
                    <p className="text-xs opacity-80 mt-1">
                      Your complete network strength
                    </p>
                  </CardContent>
                </Card>

                {/* Active Members Card */}
                <Card className="border-0 shadow-md bg-gradient-to-br from-green-700 to-green-800 text-white">
                  <CardHeader className="flex flex-row items-center justify-between p-4">
                    <CardTitle className="text-sm font-medium">
                      Active Members
                    </CardTitle>
                    <Activity className="w-5 h-5" />
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <div className="text-2xl font-bold">
                      {dashboardData?.counts.active_members || 0}
                    </div>
                    <p className="text-xs opacity-80 mt-1">
                      Currently active in your network
                    </p>
                  </CardContent>
                </Card>

                {/* Direct Members Card */}
                <Card className="border-0 shadow-md bg-gradient-to-br from-purple-700 to-purple-800 text-white">
                  <CardHeader className="flex flex-row items-center justify-between p-4">
                    <CardTitle className="text-sm font-medium">
                      Direct Active Members
                    </CardTitle>
                    <UserPlus className="w-5 h-5" />
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <div className="text-2xl font-bold">
                      {dashboardData?.counts.sponsor || 0}
                    </div>
                    <p className="text-xs opacity-80 mt-1">
                      Members directly sponsored by you
                    </p>
                  </CardContent>
                </Card>

                {/* Status Card */}
                <Card className={`border-0 shadow-md ${
                  dashboardData?.member.status === 'ACTIVE'
                    ? 'bg-gradient-to-br from-emerald-700 to-emerald-800'
                    : 'bg-gradient-to-br from-rose-700 to-rose-800'
                } text-white`}>
                  <CardHeader className="flex flex-row items-center justify-between p-4">
                    <CardTitle className="text-sm font-medium">
                      Your Status
                    </CardTitle>
                    <Shield className="w-5 h-5" />
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <div className="text-2xl font-bold">
                      {dashboardData?.member.status || 'INACTIVE'}
                    </div>
                    <p className="text-xs opacity-80 mt-1">
                      {dashboardData?.member.status === 'ACTIVE'
                        ? 'Active Member'
                        : 'Inactive Member'}
                    </p>
                    <p>Top up date - Amount - pkg</p>
                  </CardContent>
                </Card>
              </div>


              {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4"> */}
                {/* Main Wallet Card */}
                {/* <Card className="border-0 shadow-md bg-gradient-to-br from-indigo-700 to-indigo-800 text-white">
                  <CardHeader className="flex flex-row items-center justify-between p-4">
                    <CardTitle className="text-sm font-medium">
                      Main Wallet Balance
                    </CardTitle>
                    <Wallet className="w-5 h-5" />
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <div className="text-2xl font-bold">
                      ${dashboardData?.balances.fund?.toFixed(2) || '0.00'}
                    </div>
                    <p className="text-xs opacity-80 mt-1">
                      Available funds for withdrawals
                    </p>
                  </CardContent>
                </Card> */}

                {/* Re-Topup Wallet Card */}
                {/* <Card className="border-0 shadow-md bg-gradient-to-br from-cyan-700 to-cyan-800 text-white">
                  <CardHeader className="flex flex-row items-center justify-between p-4">
                    <CardTitle className="text-sm font-medium">
                      Re-Topup Wallet
                    </CardTitle>
                    <RefreshCw className="w-5 h-5" />
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <div className="text-2xl font-bold">
                      ${'0.00'}
                    </div>
                    <p className="text-xs opacity-80 mt-1">
                      Funds available for reinvestment
                    </p>
                  </CardContent>
                </Card> */}
              {/* </div> */}
              
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Dashboard;