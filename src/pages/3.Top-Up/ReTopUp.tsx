import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { DashboardHeader } from "@/components/DashboardHeader";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { Wallet, ChevronDown, FileText, Loader } from "lucide-react";

interface Invoice {
  invoiceId: string;
  memberName: string;
  memberId: string;
  planType: "growth" | "profit-sharing";
  amount: number;
  date: string;
  remainingBalance: number;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

type PlanType = "growth" | "profit-sharing";

const ReTopUp = () => {
  const [selectedPlan, setSelectedPlan] = useState<PlanType | null>(null);
  const [walletBalance, setWalletBalance] = useState<number>(0);
  const [profitSharingAmount, setProfitSharingAmount] = useState<number>(75);
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [member, setMember] = useState({
    id: "",
    name: ""
  });

  // Profit Sharing amount options (multiples of 75 up to 4500)
  const profitSharingAmounts = Array.from(
    { length: 60 },
    (_, i) => (i + 1) * 75
  );

  // Fetch member data and wallet balance
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem("token");
        const memberData = JSON.parse(localStorage.getItem("member") || "{}");
        
        setMember({
          id: memberData.member_id || "N/A",
          name: memberData.name || "N/A"
        });

        // Fetch Re-Top Up wallet balance
        const response = await axios.get(`${API_BASE_URL}/re-top-up-wallet-balance`, {
          headers: { Authorization: `Bearer ${token}` },
          params: { member_id: memberData.member_id }
        });

        if (response.data.success) {
          setWalletBalance(response.data.balance);
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
        toast.error("Failed to load wallet data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Reset form when plan changes
  useEffect(() => {
    setInvoice(null);
  }, [selectedPlan]);

  const handleReTopUp = async () => {
  try {
    
    const token = localStorage.getItem("token");
    const memberData = JSON.parse(localStorage.getItem("member") || "{}");
    const amount = getReTopUpAmount();

    // Force all IDs to strings
    const response = await axios.post(
      `${API_BASE_URL}/re-top-up`,
      {
        memberId: String(memberData.member_id), // Force string
        planType: selectedPlan,
        amount: amount
      },
      {
        headers: { 
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json" 
        }
      }
    );
    

    if (response.data.success) {
      setWalletBalance(response.data.newBalance);
      setInvoice({
        invoiceId: response.data.transactionId,
        memberName: memberData.name,
        memberId: String(memberData.member_id), // Force string
        planType: selectedPlan,
        amount: amount,
        date: new Date().toLocaleDateString(),
        remainingBalance: response.data.newBalance
      });
      toast.success("Re-Top Up Successful!");
    }
  } catch (error) {
    toast.error(error.response?.data?.error || "Failed to process Re-Top Up");
  }
};

  const getReTopUpAmount = () => {
    if (selectedPlan === "growth") {
      return 25; // Fixed amount for Growth Re Top-up
    } else if (selectedPlan === "profit-sharing") {
      return profitSharingAmount;
    }
    return 0;
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
                {/* Header with Wallet */}
                <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-purple-700 text-white">
                  <div className="px-8 py-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="bg-white bg-opacity-20 p-3 rounded-full flex items-center justify-center">
                          <Wallet className="w-6 h-6" />
                        </div>
                        <div>
                          <h1 className="text-2xl font-bold tracking-tight">
                            RE-TOP UP WALLET
                          </h1>
                          <p className="text-blue-100 text-sm opacity-90">
                            Re-Top Up member accounts using your wallet balance
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
                                RE-TOP UP WALLET BALANCE
                              </p>
                              <p className="text-xl font-bold tracking-wide">
                                ${(walletBalance || 0).toFixed(2)}
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
                        <Wallet className="w-5 h-5 text-blue-600" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-800">
                        Re-Top Up Information
                      </h3>
                    </div>

                    <div className="space-y-5">
                      {/* Row 1: Member ID + Name */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="space-y-1">
                          <label className="block text-sm font-medium text-gray-700">
                            Member ID
                          </label>
                          <div className="flex items-center gap-3 bg-gray-50 px-4 py-3 rounded-lg border border-gray-300">
                            <Wallet className="w-5 h-5 text-gray-500" />
                            <p className="font-medium text-gray-800">
                              {member.id}
                            </p>
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="block text-sm font-medium text-gray-700">
                            Member Name
                          </label>
                          <div className="flex items-center gap-3 bg-gray-50 px-4 py-3 rounded-lg border border-gray-300">
                            <Wallet className="w-5 h-5 text-gray-500" />
                            <p className="font-medium text-gray-800">
                              {member.name}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Row 2: Plan + Wallet After */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="space-y-1">
                          <label className="block text-sm font-medium text-gray-700">
                            Select Plan
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                              <Wallet className="w-5 h-5 text-gray-400" />
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
                              <option value="growth">Growth Re Top-up</option>
                              <option value="profit-sharing">
                                Profit Sharing Re Top-up
                              </option>
                            </select>
                            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                              <ChevronDown className="w-5 h-5 text-gray-400" />
                            </div>
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="block text-sm font-medium text-gray-700">
                            Wallet After Re-Top Up
                          </label>
                          <div className="flex items-center gap-3 bg-blue-50 px-4 py-3 rounded-lg border border-blue-200">
                            <Wallet className="w-5 h-5 text-blue-500" />
                            <p className="font-medium text-blue-800">
                              ${(walletBalance - getReTopUpAmount()).toFixed(2)}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Conditional Fields */}
                      {selectedPlan === "growth" && (
                        <div className="space-y-1">
                          <label className="block text-sm font-medium text-gray-700">
                            Growth Re Top-up Package
                          </label>
                          <div className="flex items-center gap-3 bg-green-50 px-4 py-3 rounded-lg border border-green-200">
                            <Wallet className="w-5 h-5 text-green-500" />
                            <p className="font-medium text-green-800">
                              $25.00 (Fixed Amount)
                            </p>
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
                          <p className="text-xs text-gray-500 mt-1">
                            Minimum: $75.00 | Maximum: $4,500.00
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Re-Top Up Button */}
                  <div className="text-center mb-6">
                    <button
                      onClick={handleReTopUp}
                      disabled={
                        isLoading ||
                        !selectedPlan ||
                        walletBalance < getReTopUpAmount()
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
                          <Wallet className="w-5 h-5" />
                          PROCESS RE-TOP UP
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
                            RE-TOP UP INVOICE
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
                          </div>
                        </div>

                        <div>
                          <h3 className="text-lg font-bold text-gray-700 mb-4 border-b pb-2">
                            {invoice.planType === "growth"
                              ? "Growth Re-Top Up Details"
                              : "Profit Sharing Re-Top Up Details"}
                          </h3>
                          <div className="space-y-3">
                            <div className="flex justify-between">
                              <span className="font-medium text-gray-600">
                                Plan Type:
                              </span>
                              <span className="font-bold">
                                {invoice.planType === "growth"
                                  ? "Growth Re-Top Up"
                                  : "Profit Sharing Re-Top Up"}
                              </span>
                            </div>
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
                                Date:
                              </span>
                              <span className="font-bold">{invoice.date}</span>
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
                          🎉 RE-TOP UP SUCCESSFUL! 🎉
                        </div>
                        <div className="text-sm text-gray-600">
                          Re-Top Up processed successfully! Keep this invoice
                          for records.
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

export default ReTopUp;