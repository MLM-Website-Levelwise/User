import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { DashboardHeader } from "@/components/DashboardHeader";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
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

const SelfActivation = () => {
  const [selectedPlan, setSelectedPlan] = useState<PlanType | null>(null);
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);
  const [profitSharingAmount, setProfitSharingAmount] = useState<number>(75);
  const [walletBalance, setWalletBalance] = useState<number>(0);
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [isAlreadyActive, setIsAlreadyActive] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Get member data from localStorage
  // Get member data from localStorage safely
const memberDataString = localStorage.getItem("member");
const memberData = memberDataString ? JSON.parse(memberDataString) : {};
const currentUser = {
  id: memberData.member_id || "PRN000000",
  name: memberData.name || "Member",
  package: memberData.package || "",
  active_status: memberData.active_status || false
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

  // Fetch wallet balance and activation status
  useEffect(() => {
    const fetchData = async () => {
  try {
    setIsLoading(true);
    const token = localStorage.getItem("token");
    
    // Get member_id directly from your UI component (currentUser.id)
    const member_id = currentUser.id; // This comes from your shown div
    
    // Debug: Verify we have the correct member_id
    console.log("Fetching balance for member:", member_id);

    const response = await axios.get(
      "https://user-qn5p.onrender.com/member-wallet-balance",
      {
        headers: { Authorization: `Bearer ${token}` },
        params: { member_id } // Send the member_id from UI
      }
    );

    // Debug: Check the full API response
    console.log("API Response:", response.data);

    if (!response.data.success) {
      throw new Error(response.data.error || "Failed to fetch balance");
    }

    // This will now show ONLY Main Wallet transactions
    setWalletBalance(response.data.balance);

     if (currentUser.active_status) {
        setIsAlreadyActive(true);
      }
    
    // Debug: Confirm the balance being set
    console.log("Set wallet balance to:", response.data.balance);
    
  } catch (error) {
    console.error("Error fetching balance:", error);
    toast.error(error.message || "Failed to load wallet balance");
    setWalletBalance(0); // Fallback to 0 if error
  } finally {
    setIsLoading(false);
  }
};

    fetchData();
  }, []);

  // Reset package when plan changes
  useEffect(() => {
    setSelectedPackage(null);
    setInvoice(null);
  }, [selectedPlan]);

  const handlePackageSelect = (packageId: string) => {
    const pkg = growthPackages.find((p) => p.id === packageId) || null;
    setSelectedPackage(pkg);
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
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No authentication token");

    const response = await axios.post(
      'https://user-qn5p.onrender.com/self-activate',
      {
        planType: selectedPlan,
        packageName: selectedPlan === 'growth' ? selectedPackage?.name : null,
        amount: getActivationAmount()
      },
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );

    if (!response.data.success) {
      throw new Error(response.data.error || "Activation failed");
    }

    // Update local state
    const updatedMember = {
      ...memberData,
      active_status: true,
      package: selectedPlan === "growth" ? selectedPackage?.name : selectedPlan
    };
    localStorage.setItem("member", JSON.stringify(updatedMember));

    setWalletBalance(response.data.newBalance);
    setIsAlreadyActive(true);
    
    // Create invoice
    const newInvoice: Invoice = {
      invoiceId: "INV" + Date.now().toString().slice(-8),
      memberName: currentUser.name,
      memberId: currentUser.id,
      topUpBy: `${currentUser.name} (${currentUser.id})`,
      planType: selectedPlan,
      amount: getActivationAmount(),
      activationDate: new Date().toLocaleDateString(),
      remainingBalance: response.data.newBalance,
    };

    if (selectedPlan === "growth" && selectedPackage) {
      newInvoice.packageName = selectedPackage.name;
    }

    setInvoice(newInvoice);
    toast.success("Account activated successfully!");

  } catch (error) {
    console.error("Activation error details:", {
      message: error.message,
      response: error.response?.data
    });
    toast.error(error.response?.data?.error || error.message || "Activation failed");
  } finally {
    setIsLoading(false);
  }
};

  // If already active, show different view
  if (isAlreadyActive) {
    return (
      <SidebarProvider>
        <div className="min-h-screen flex w-full bg-gray-50">
          <AppSidebar />
          <div className="flex-1 flex flex-col">
            <DashboardHeader />
            <main className="flex-1 flex items-center justify-center">
              <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
                <div className="bg-green-100 p-4 rounded-full inline-flex mb-4">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  Account Already Active
                </h2>
                <p className="text-gray-600 mb-6">
                  Your account is already activated. Self activation is a one-time procedure.
                </p>
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <p className="font-medium text-blue-800">
                    Current Package: {currentUser.package}
                  </p>
                </div>
              </div>
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
                            SELF ACTIVATION
                          </h1>
                          <p className="text-blue-100 text-sm opacity-90">
                            Activate your account using your wallet balance
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
                        Your Account Details
                      </h3>
                    </div>

                    <div className="space-y-5">
                      {/* Your Account Info */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="space-y-1">
                          <label className="block text-sm font-medium text-gray-700">
                            Your ID
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
                            Your Name
                          </label>
                          <div className="flex items-center gap-3 bg-gray-50 px-4 py-3 rounded-lg border border-gray-300">
                            <User className="w-5 h-5 text-gray-500" />
                            <p className="font-medium text-gray-800">
                              {currentUser.name}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Plan Selection */}
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
                              {(walletBalance - getActivationAmount()).toFixed(
                                2
                              )}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Conditional Fields */}
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
                              onChange={(e) =>
                                handlePackageSelect(e.target.value)
                              }
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
                    </div>
                  </div>

                  {/* Activate Button */}
                  <div className="text-center mb-6">
                    <button
  onClick={handleActivation}
  disabled={
    isLoading ||
    !selectedPlan ||
    (selectedPlan === "growth" && !selectedPackage) ||
    walletBalance < getActivationAmount() ||
    isAlreadyActive // Add this condition
  }
  className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-8 rounded-lg font-bold text-lg hover:from-blue-700 hover:to-blue-800 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-3 shadow-lg mx-auto"
>
  {isLoading ? (
    <>
      <Loader className="w-5 h-5 animate-spin" />
      PROCESSING...
    </>
  ) : isAlreadyActive ? ( // Add this condition
    <>
      <CheckCircle className="w-5 h-5" />
      ACCOUNT ACTIVATED
    </>
  ) : (
    <>
      <UserPlus className="w-5 h-5" />
      ACTIVATE ACCOUNT
    </>
  )}
</button>
                  </div>

                  {/* Invoice Display */}
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
                            Account Information
                          </h3>
                          <div className="space-y-3">
                            <div className="flex justify-between">
                              <span className="font-medium text-gray-600">
                                Name:
                              </span>
                              <span className="font-bold">
                                {invoice.memberName}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="font-medium text-gray-600">
                                ID:
                              </span>
                              <span className="font-bold">
                                {invoice.memberId}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="font-medium text-gray-600">
                                Top Up By:
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
                          🎉{" "}
                          {invoice.planType === "growth"
                            ? "PACKAGE"
                            : "INVESTMENT"}{" "}
                          ACTIVATION SUCCESSFUL! 🎉
                        </div>
                        <div className="text-sm text-gray-600">
                          {invoice.planType === "growth"
                            ? "Your package has been successfully activated!"
                            : "Your investment has been successfully processed!"}
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

export default SelfActivation;