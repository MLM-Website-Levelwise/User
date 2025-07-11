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
import {
  Users,
  Activity,
  UserPlus,
  Shield,
  Wallet,
  RefreshCw,
} from "lucide-react";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface DashboardData {
  member: {
    status: string;
    topup_info?: {
      date: string;
      amount: number;
      package: string;
    };
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
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null
  );
   const [levelIncomeTotal, setLevelIncomeTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

   useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }

        // Fetch dashboard data
        const dashboardRes = await axios.get(`${API_BASE_URL}/member-dashboard`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setDashboardData(dashboardRes.data);

        // Fetch level income total separately
        const levelIncomeRes = await axios.get(`${API_BASE_URL}/level-income`, {
          headers: { Authorization: `Bearer ${token}` },
          params: { date: new Date().toISOString().split('T')[0] }
        });
        
        setLevelIncomeTotal(levelIncomeRes.data.summary.totalIncome);
        
      } catch (err) {
        console.error("Failed to fetch data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
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
                <Card className="border-0 shadow-md bg-gradient-to-r from-pink-500 to-pink-700 text-white">
                  <CardHeader className="flex flex-row items-center justify-between p-4">
                    <CardTitle className="text-xl font-medium">
                      Total Members
                    </CardTitle>
                    <Users className="w-5 h-5" />
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <div className="text-2xl font-bold">
                      {dashboardData?.counts.downline || 0}
                    </div>
                  </CardContent>
                </Card>

                {/* Active Members Card */}
                <Card className="border-0 shadow-md bg-gradient-to-r from-yellow-600 to-yellow-800 text-white">
                  <CardHeader className="flex flex-row items-center justify-between p-4">
                    <CardTitle className="text-xl font-medium">
                      Active Members
                    </CardTitle>
                    <Activity className="w-5 h-5" />
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <div className="text-2xl font-bold">
                      {dashboardData?.counts.active_members || 0}
                    </div>
                  </CardContent>
                </Card>

                {/* Direct Members Card */}
                <Card className="border-0 shadow-md bg-gradient-to-r from-purple-600 to-purple-800 text-white">
                  <CardHeader className="flex flex-row items-center justify-between p-4">
                    <CardTitle className="text-xl font-medium">
                      Direct Active Members
                    </CardTitle>
                    <UserPlus className="w-5 h-5" />
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <div className="text-2xl font-bold">
                      {dashboardData?.counts.sponsor || 0}
                    </div>
                  </CardContent>
                </Card>

                {/* Status Card */}
                <Card
                  className={`border-0 shadow-md ${
                    dashboardData?.member.status === "ACTIVE"
                      ? "bg-gradient-to-br from-emerald-600 to-emerald-800"
                      : "bg-gradient-to-br from-rose-600 to-rose-800"
                  } text-white`}
                >
                  <CardHeader className="flex flex-row items-center justify-between p-4">
                    <CardTitle className="text-sm font-medium">
                      Your Status
                    </CardTitle>
                    <Shield className="w-5 h-5" />
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <div className="text-2xl font-bold flex items-center gap-2">
                      {dashboardData?.member.status || "INACTIVE"}
                      {dashboardData?.member.topup_info && (
                        <>
                          <span className="text-2xl">
                            - ${dashboardData.member.topup_info.amount}
                          </span>
                        </>
                      )}
                    </div>
                    {/* <p className="text-xs opacity-80 mt-1">
                      {dashboardData?.member.status === "ACTIVE"
                        ? "Active Member"
                        : "Inactive Member"}
                    </p> */}
                    {dashboardData?.member.topup_info && (
                      <>
                        <p className="text-base mt-2">
                          Top up:{" "}
                          {new Date(
                            dashboardData.member.topup_info.date
                          ).toLocaleDateString()}
                        </p>
                        <p className="text-base">
                          Package: {dashboardData.member.topup_info.package}
                        </p>
                      </>
                    )}
                  </CardContent>
                </Card>

                {/* Profit Sharing Wallet Card */}
<Card className="border-0 shadow-md bg-gradient-to-br from-indigo-500 to-indigo-700 text-white">
  <CardHeader className="flex flex-row items-center justify-between p-4">
    <CardTitle className="text-xl font-medium">
      Profit Sharing Wallet
    </CardTitle>
    <Wallet className="w-5 h-5" />
  </CardHeader>
  <CardContent className="p-4 pt-0">
    <div className="text-2xl font-bold">
      ${dashboardData?.balances.fund?.toFixed(3) || "0.000"}
    </div>
    <p className="text-sm opacity-80 mt-1">
      Total earnings from profit sharing
    </p>
  </CardContent>
</Card>

                {/* Growth Wallet Card */}
                <Card className="border-0 shadow-md bg-gradient-to-br from-cyan-600 to-cyan-800 text-white">
                  <CardHeader className="flex flex-row items-center justify-between p-4">
                    <CardTitle className="text-xl font-medium">
                      Growth Wallet Balance
                    </CardTitle>
                    <RefreshCw className="w-5 h-5" />
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <div className="text-2xl font-bold">${"0.00"}</div>
                  </CardContent>
                </Card>
                <Card className="border-0 shadow-md bg-gradient-to-br from-cyan-600 to-cyan-800 text-white">
      <CardHeader className="flex flex-row items-center justify-between p-4">
        <CardTitle className="text-xl font-medium">
          Working Wallet
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="text-2xl font-bold">
          ${levelIncomeTotal.toFixed(3)}
        </div>
        <p className="text-sm opacity-80 mt-1">
          Total earnings from level income
        </p>
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
