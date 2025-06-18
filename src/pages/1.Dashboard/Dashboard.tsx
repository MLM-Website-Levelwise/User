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

const Dashboard = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <DashboardHeader />
          <main className="flex-1 p-6">
            {/* <DashboardContent /> */}
            <div className="space-y-6 ">
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
                      ACTIVE
                    </div>
                    <div className="flex items-center space-x-2 mt-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm text-green-600">
                        Active Status
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
                    <div className="text-3xl font-bold">2</div>
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
                    <div className="text-3xl font-bold">2</div>
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
                    <div className="text-3xl font-bold">1250.00</div>
                    <div className="flex items-center space-x-2 mt-2">
                      <span className="text-sm text-green-600">
                        Rs. 1250.00
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
                    <div className="text-3xl font-bold">1250</div>
                    <div className="flex items-center space-x-2 mt-2">
                      <span className="text-sm bg-purple-500 px-2 py-1 rounded text-xs">
                        Rs. 1250
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
