import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { DashboardHeader } from "@/components/DashboardHeader";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import {
  UserPlus,
  FileText,
  User,
  Package as PackageIcon,
  Wallet,
  ChevronDown,
  Gift,
  PieChart,
  CheckCircle,
  Loader,
} from "lucide-react";

interface Package {
  id: string;
  name: string;
  amount: number;
  description: string;
  type: "shopping" | "tour";
}

interface Invoice {
  invoiceId: string;
  memberName: string;
  memberId: string;
  topUpBy: string;
  planType: "growth" | "profit-sharing";
  packageName?: string;
  amount: number;
  activationDate: string;
  remainingBalance: number;
}

type PlanType = "growth" | "profit-sharing";

const MemberActivation = () => {
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState<PlanType | null>(null);
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);
  const [profitSharingAmount, setProfitSharingAmount] = useState<number>(75);
  const [walletBalance, setWalletBalance] = useState<number>(0);
  const [memberId, setMemberId] = useState<string>("");
  const [memberName, setMemberName] = useState<string>("");
  const [isFetchingMember, setIsFetchingMember] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [invoice, setInvoice] = useState<Invoice | null>(null);

  // Current logged-in user data
  const memberDataString = localStorage.getItem("member");
  const memberData = memberDataString ? JSON.parse(memberDataString) : {};
  const currentUser = {
    id: memberData.member_id || "PRN000000",
    name: memberData.name || "Admin User",
  };

  // Package data for Growth Plan
  const growthPackages: Package[] = [
    {
      id: "PKG001",
      name: "Shopping Wallet Package",
      amount: 30.0,
      description: "Basic shopping wallet package",
      type: "shopping",
    },
    {
      id: "PKG002",
      name: "Tour Package",
      amount: 45.0,
      description: "Elite tour package",
      type: "tour",
    },
  ];

  // Profit Sharing amount options (multiples of 75 up to 4500)
  const profitSharingAmounts = Array.from(
    { length: 60 },
    (_, i) => (i + 1) * 75
  );

  // Fetch wallet balance on component mount
  useEffect(() => {
    const fetchWalletBalance = async () => {
      try {
        const member_id = currentUser.id;
        const token = localStorage.getItem("token");
        const response = await axios.get(
          "http://localhost:5000/member-wallet-balance",
          {
            headers: { Authorization: `Bearer ${token}` },
            params: { member_id }
          }
        );
        if (response.data.success) {
          setWalletBalance(response.data.balance);
        }
      } catch (error) {
        console.error("Failed to fetch wallet balance:", error);
        toast.error("Failed to load wallet balance");
      }
    };

    fetchWalletBalance();
  }, []);

  // Reset package when plan changes
  useEffect(() => {
    setSelectedPackage(null);
    setInvoice(null);
  }, [selectedPlan]);

  const fetchMemberName = async (memberId: string): Promise<string> => {
    setIsFetchingMember(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return "";
      }

      const response = await axios.get(`http://localhost:5000/members?member_id=${memberId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.data.members && response.data.members.length > 0) {
        return response.data.members[0].name;
      }
      return "";
    } catch (error) {
      console.error("Error fetching member:", error);
      return "";
    } finally {
      setIsFetchingMember(false);
    }
  };

  const handleMemberIdChange = async (value: string) => {
    setMemberId(value);
    if (value.trim().length >= 3) {
      const name = await fetchMemberName(value.trim());
      setMemberName(name);
    } else {
      setMemberName("");
    }
  };

  const getActivationAmount = () => {
    if (selectedPlan === "growth" && selectedPackage) {
      return selectedPackage.amount;
    } else if (selectedPlan === "profit-sharing") {
      return profitSharingAmount;
    }
    return 0;
  };

  const handleActivation = async () => {
  try {
    setIsLoading(true);
    const activationAmount = getActivationAmount();
    const token = localStorage.getItem("token");

    // 1. Get current balance before activation
    const balanceResponse = await axios.get('http://localhost:5000/member-wallet-balance', {
      headers: { Authorization: `Bearer ${token}` },
      params: { member_id: currentUser.id }
    });
    const currentBalance = balanceResponse.data.balance;

    // 2. Send activation request
    const response = await axios.post(
      "http://localhost:5000/activate-member",
      {
        memberId: memberId.toString(),
        planType: selectedPlan,
        amount: activationAmount
      },
      {
        headers: { 
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json" 
        }
      }
    );

    if (response.data.success) {
      // 3. Update UI with PRECISE balance
      setWalletBalance(response.data.newBalance);
      
      // 4. Show success
      setInvoice({
        invoiceId: `INV${Date.now().toString().slice(-8)}`,
        memberName,
        memberId,
        topUpBy: `${currentUser.name} (${currentUser.id})`,
        planType: selectedPlan!,
        amount: activationAmount,
        activationDate: new Date().toLocaleDateString(),
        remainingBalance: response.data.newBalance,
        ...(selectedPlan === 'growth' && { packageName: selectedPackage?.name })
      });

      toast.success('🎉 ACTIVATION SUCCESSFUL! 🎉');
    }
  } catch (error) {
    toast.error(error.response?.data?.error || 'Activation failed');
  } finally {
    setIsLoading(false);
  }
};

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <DashboardHeader />
          <main className="flex-1">
            <div className="w-full min-h-full">
              <div className="w-full bg-white shadow-lg overflow-hidden">
                <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-purple-700 text-white">
                  <div className="px-8 py-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="bg-white bg-opacity-20 p-3 rounded-full flex items-center justify-center">
                          <UserPlus className="w-6 h-6" />
                        </div>
                        <div>
                          <h1 className="text-2xl font-bold tracking-tight">
                            MEMBER ACTIVATION
                          </h1>
                          <p className="text-blue-100 text-sm opacity-90">
                            Activate member accounts using your wallet balance
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-4 border border-white border-opacity-20 shadow-lg">
                          <div className="flex items-center gap-3">
                            <div className="bg-white bg-opacity-20 p-2 rounded-full">
                              <Wallet className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <p className="text-xs font-medium text-blue-100 opacity-90">
                                MAIN WALLET BALANCE
                              </p>
                              <p className="text-xl font-bold tracking-wide">
                                ${walletBalance.toFixed(2)}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm mb-6">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="bg-blue-100 p-2 rounded-full">
                        <User className="w-5 h-5 text-blue-600" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-800">
                        Member Information
                      </h3>
                    </div>

                    <div className="space-y-5">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="space-y-1">
                          <label className="block text-sm font-medium text-gray-700">
                            Member ID
                          </label>
                          <div className="relative">
                            <input
                              type="text"
                              value={memberId}
                              onChange={(e) => handleMemberIdChange(e.target.value)}
                              placeholder="Enter member ID"
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            />
                            {isLoading && (
                              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                                <Loader className="w-5 h-5 animate-spin" />
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="block text-sm font-medium text-gray-700">
                            Member Name
                          </label>
                          <input
                            type="text"
                            value={memberName}
                            readOnly
                            placeholder="Will auto-fill from member ID"
                            className={`w-full px-4 py-3 border rounded-lg transition-all ${
                              memberName
                                ? "bg-green-50 border-green-200 text-green-900 font-medium"
                                : "bg-gray-50 border-gray-300 text-gray-500"
                            }`}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="space-y-1">
                          <label className="block text-sm font-medium text-gray-700">
                            Select Plan
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                              {selectedPlan === "growth" ? (
                                <Gift className="w-5 h-5 text-gray-400" />
                              ) : (
                                <PieChart className="w-5 h-5 text-gray-400" />
                              )}
                            </div>
                            <select
                              value={selectedPlan || ""}
                              onChange={(e) =>
                                setSelectedPlan(e.target.value as PlanType)
                              }
                              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white appearance-none"
                              disabled={isLoading}
                            >
                              <option value="">Select a plan</option>
                              <option value="growth">Growth Package</option>
                              <option value="profit-sharing">
                                Profit Sharing Package
                              </option>
                            </select>
                            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                              <ChevronDown className="w-5 h-5 text-gray-400" />
                            </div>
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="block text-sm font-medium text-gray-700">
                            Wallet After Activation
                          </label>
                          <div className="flex items-center gap-3 bg-blue-50 px-4 py-3 rounded-lg border border-blue-200">
                            <Wallet className="w-5 h-5 text-blue-500" />
                            <p className="font-medium text-blue-800">
                              $
                              {(walletBalance - getActivationAmount()).toFixed(2)}
                            </p>
                          </div>
                        </div>
                      </div>

                      {selectedPlan === "growth" && (
                        <div className="space-y-1">
                          <label className="block text-sm font-medium text-gray-700">
                            Activation Package
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                              <PackageIcon className="w-5 h-5 text-gray-400" />
                            </div>
                            <select
                              value={selectedPackage?.id || ""}
                              onChange={(e) => {
                                const pkg = growthPackages.find((p) => p.id === e.target.value) || null;
                                setSelectedPackage(pkg);
                              }}
                              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white appearance-none"
                              disabled={isLoading}
                            >
                              <option value="">Select a package</option>
                              {growthPackages.map((pkg) => (
                                <option key={pkg.id} value={pkg.id}>
                                  {pkg.name} - ${pkg.amount.toFixed(2)}
                                </option>
                              ))}
                            </select>
                            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                              <ChevronDown className="w-5 h-5 text-gray-400" />
                            </div>
                          </div>
                        </div>
                      )}

                      {selectedPlan === "profit-sharing" && (
                        <div className="space-y-1">
                          <label className="block text-sm font-medium text-gray-700">
                            Investment Amount (Multiples of $75)
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                              <Wallet className="w-5 h-5 text-gray-400" />
                            </div>
                            <select
                              value={profitSharingAmount}
                              onChange={(e) =>
                                setProfitSharingAmount(Number(e.target.value))
                              }
                              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white appearance-none"
                              disabled={isLoading}
                            >
                              {profitSharingAmounts.map((amount) => (
                                <option key={amount} value={amount}>
                                  ${amount.toFixed(2)}
                                </option>
                              ))}
                            </select>
                            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                              <ChevronDown className="w-5 h-5 text-gray-400" />
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="space-y-1">
                          <label className="block text-sm font-medium text-gray-700">
                            Activated By ID
                          </label>
                          <div className="flex items-center gap-3 bg-gray-50 px-4 py-3 rounded-lg border border-gray-300">
                            <User className="w-5 h-5 text-gray-500" />
                            <p className="font-medium text-gray-800">
                              {currentUser.id}
                            </p>
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="block text-sm font-medium text-gray-700">
                            Activated By Name
                          </label>
                          <div className="flex items-center gap-3 bg-gray-50 px-4 py-3 rounded-lg border border-gray-300">
                            <User className="w-5 h-5 text-gray-500" />
                            <p className="font-medium text-gray-800">
                              {currentUser.name}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="text-center mb-6">
                    <button
                      onClick={handleActivation}
                      disabled={
                        isLoading ||
                        !selectedPlan ||
                        (selectedPlan === "growth" && !selectedPackage) ||
                        !memberId ||
                        !memberName ||
                        walletBalance < getActivationAmount()
                      }
                      className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-8 rounded-lg font-bold text-lg hover:from-blue-700 hover:to-blue-800 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-3 shadow-lg mx-auto"
                    >
                      {isLoading ? (
                        <>
                          <Loader className="w-5 h-5 animate-spin" />
                          PROCESSING...
                        </>
                      ) : (
                        <>
                          <UserPlus className="w-5 h-5" />
                          ACTIVATE MEMBER
                        </>
                      )}
                    </button>
                  </div>

                  {invoice && (
                    <div className="bg-white border-2 border-blue-300 rounded-lg p-6 shadow-xl">
                      <div className="text-center mb-6">
                        <div className="flex items-center justify-center gap-3 mb-2">
                          <FileText className="w-8 h-8 text-blue-600" />
                          <h2 className="text-3xl font-bold text-gray-800">
                            ACTIVATION INVOICE
                          </h2>
                        </div>
                        <div className="text-blue-600 font-semibold">
                          Invoice ID: {invoice.invoiceId}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                          <h3 className="text-lg font-bold text-gray-700 mb-4 border-b pb-2">
                            Member Information
                          </h3>
                          <div className="space-y-3">
                            <div className="flex justify-between">
                              <span className="font-medium text-gray-600">
                                Member Name:
                              </span>
                              <span className="font-bold">
                                {invoice.memberName}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="font-medium text-gray-600">
                                Member ID:
                              </span>
                              <span className="font-bold">
                                {invoice.memberId}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="font-medium text-gray-600">
                                Activated By:
                              </span>
                              <span className="font-bold">
                                {invoice.topUpBy}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div>
                          <h3 className="text-lg font-bold text-gray-700 mb-4 border-b pb-2">
                            {invoice.planType === "growth"
                              ? "Package Details"
                              : "Investment Details"}
                          </h3>
                          <div className="space-y-3">
                            <div className="flex justify-between">
                              <span className="font-medium text-gray-600">
                                Plan Type:
                              </span>
                              <span className="font-bold">
                                {invoice.planType === "growth"
                                  ? "Growth Package"
                                  : "Profit Sharing"}
                              </span>
                            </div>
                            {invoice.planType === "growth" &&
                              invoice.packageName && (
                                <div className="flex justify-between">
                                  <span className="font-medium text-gray-600">
                                    Package:
                                  </span>
                                  <span className="font-bold">
                                    {invoice.packageName}
                                  </span>
                                </div>
                              )}
                            <div className="flex justify-between">
                              <span className="font-medium text-gray-600">
                                Amount:
                              </span>
                              <span className="font-bold text-green-600">
                                ${invoice.amount.toFixed(2)}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="font-medium text-gray-600">
                                Activation Date:
                              </span>
                              <span className="font-bold">
                                {invoice.activationDate}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="mt-8 pt-6 border-t-2 border-gray-200">
                        <div className="flex justify-between items-center">
                          <span className="text-2xl font-bold text-gray-800">
                            Remaining Wallet Balance:
                          </span>
                          <span className="text-4xl font-bold text-green-600">
                            ${invoice.remainingBalance.toFixed(2)}
                          </span>
                        </div>
                      </div>

                      <div className="mt-6 text-center bg-gradient-to-r from-blue-50 to-green-50 p-4 rounded-lg">
                        <div className="text-lg font-bold text-green-700 mb-1">
                          🎉 MEMBER ACTIVATION SUCCESSFUL! 🎉
                        </div>
                        <div className="text-sm text-gray-600">
                          New member successfully activated! Keep this invoice for records.
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default MemberActivation;