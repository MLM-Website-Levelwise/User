import React, { useState, useEffect } from "react";
import axios from "axios";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { DashboardHeader } from "@/components/DashboardHeader";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const SendRequestPage = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex flex-col md:flex-row w-full bg-gray-50">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <DashboardHeader />
          <main className="flex-1 p-4 sm:p-6">
            <div className="max-w-4xl mx-auto">
              {/* Header */}
              <div className="bg-gray-800 text-white px-4 sm:px-6 py-4 border-b border-gray-700 flex justify-center mb-2">
                <h2 className="text-lg sm:text-xl font-bold text-center">
                  Withdrawal Request
                </h2>
              </div>

              {/* Main Form */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-6">
                <SendRequestComponent />

                {/* Additional Info Panel */}
                <div className="lg:hidden bg-white p-4 sm:p-6 rounded-md shadow-md border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    Withdrawal Information
                  </h3>
                  <div className="space-y-4">
                    <div className="border-l-4 border-blue-500 pl-4">
                      <h4 className="font-semibold text-gray-700 text-sm">
                        Processing Time
                      </h4>
                      <p className="text-gray-600 text-xs">
                        Withdrawals are processed within 24-48 hours
                      </p>
                    </div>
                    <div className="border-l-4 border-green-500 pl-4">
                      <h4 className="font-semibold text-gray-700 text-sm">
                        Minimum Amount
                      </h4>
                      <p className="text-gray-600 text-xs">
                        Minimum withdrawal amount is $5 for all wallets
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

const SendRequestComponent = () => {
  const [selectedWallet, setSelectedWallet] = useState("");
  const [requestAmount, setRequestAmount] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [walletBalances, setWalletBalances] = useState({
    profit: 0,
    working: 0,
    growth: 0
  });
  const [loadingBalances, setLoadingBalances] = useState(true);
  const [memberId, setMemberId] = useState("");
  const MIN_WITHDRAWAL = 5; // Minimum withdrawal amount in USD

  // Get member ID from localStorage
   const [withdrawalRules, setWithdrawalRules] = useState({
    profit: '',
    working: '',
    growth: ''
  });

  // Fetch withdrawal rules when component mounts
  useEffect(() => {
    const today = new Date();
    const dayOfWeek = today.getDay(); // 0-6 (Sunday-Saturday)
    
    setWithdrawalRules({
      profit: 'Available once per month from activation date',
      working: dayOfWeek === 1 ? 
        'Available today (Monday)' : 
        `Available only on Mondays (next: ${getNextMondayDate()})`,
      growth: 'Available anytime'
    });
  }, []);

  // Helper function to get next Monday's date
  const getNextMondayDate = () => {
    const today = new Date();
    const nextMonday = new Date(today);
    nextMonday.setDate(today.getDate() + ((1 + 7 - today.getDay()) % 7));
    return nextMonday.toLocaleDateString();
  };


  // Fetch wallet balances
  useEffect(() => {
    const fetchBalances = async () => {
  try {
    setLoadingBalances(true);
    const token = localStorage.getItem("token");
    
    if (!token) {
      console.error("No token found");
      return;
    }
    
    // Fetch both dashboard data and working wallet balance in parallel
    const [dashboardRes, workingWalletRes] = await Promise.all([
      axios.get(`${API_BASE_URL}/member-dashboard`, {
        headers: { Authorization: `Bearer ${token}` }
      }),
      axios.get(`${API_BASE_URL}/working-wallet-balance`, {
        headers: { Authorization: `Bearer ${token}` }
      })
    ]);

    // Extract profit sharing balance from dashboard
    const profitBalance = dashboardRes.data.balances.fund || 0;
    
    // Extract working wallet balance from dedicated endpoint
    const workingBalance = workingWalletRes.data.available_balance || 0;

    setWalletBalances({
      profit: profitBalance,
      working: workingBalance,
      growth: 0
    });

    // Debugging logs
    console.log("Dashboard Response:", dashboardRes.data);
    console.log("Working Wallet Response:", workingWalletRes.data);

  } catch (error) {
    console.error("Error fetching wallet balances:", error);
    if (axios.isAxiosError(error)) {
      console.error("Error details:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
    }
  } finally {
    setLoadingBalances(false);
  }
};

    fetchBalances();
  }, []);

  const wallets = {
    "": { name: "Select Wallet", balance: 0 },
    profit: { name: "Profit Sharing Wallet", balance: walletBalances.profit },
    working: { name: "Working Wallet", balance: walletBalances.working },
    growth: { name: "Growth Wallet", balance: walletBalances.growth },
  };

  const currentBalance = wallets[selectedWallet]?.balance || 0;

  const handleSubmit = async () => {
  if (!selectedWallet) {
    alert("Please select a wallet first");
    return;
  }

  const amount = parseFloat(requestAmount);
  
  if (isNaN(amount) || amount < MIN_WITHDRAWAL) {
    alert(`Minimum withdrawal amount is $${MIN_WITHDRAWAL}`);
    return;
  }

  if (amount > currentBalance) {
    alert(
      `Insufficient balance. Available balance: $${currentBalance.toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      })}`
    );
    return;
  }

  setIsLoading(true);

  try {
    const token = localStorage.getItem("token");
    const memberData = JSON.parse(localStorage.getItem("member") || "{}");
    
    if (!memberData.member_id) {
      throw new Error("Member information not found");
    }

    const response = await axios.post(
      `${API_BASE_URL}/withdraw`,
      {
        wallet_type: selectedWallet,
        amount: amount,
        memberId: String(memberData.member_id) // Using memberId (not member_id) to match your API
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      }
    );

    if (response.data.success) {
      setSuccessMessage(
        `$${amount.toLocaleString("en-US", {
          minimumFractionDigits: 2,
        })} withdrawal request submitted successfully from ${
          wallets[selectedWallet].name
        }`
      );
      setRequestAmount("");
      
      // Update local balance
      const newBalance = currentBalance - amount;
      setWalletBalances(prev => ({
        ...prev,
        [selectedWallet]: newBalance
      }));
    } else {
      throw new Error(response.data.error || "Withdrawal failed");
    }
  } catch (error) {
    console.error("Withdrawal error:", error);
    alert(error.message || "Failed to submit withdrawal request");
  } finally {
    setIsLoading(false);
  }
};

  const resetForm = () => {
    setSelectedWallet("");
    setRequestAmount("");
    setSuccessMessage("");
  };

  return (
    <div className="w-full max-w-md mx-auto bg-gradient-to-br from-yellow-50 to-red-50 p-4 sm:p-6 rounded-md shadow-md border border-gray-200">
      <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4">
        Withdraw Request
      </h2>

      {/* Wallet Selection */}
      <div className="mb-4">
        <label className="block font-semibold text-gray-700 mb-1 text-sm sm:text-base">
          Choose Wallet
        </label>
        <select
          value={selectedWallet}
          onChange={(e) => {
            setSelectedWallet(e.target.value);
            setSuccessMessage("");
            setRequestAmount("");
          }}
          className="w-full border border-gray-300 bg-white text-gray-800 rounded-md px-3 sm:px-4 py-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
          disabled={isLoading || loadingBalances}
        >
          <option value="">Select Wallet</option>
          <option value="profit">Profit Sharing Wallet</option>
          <option value="working">Working Wallet</option>
          <option value="growth">Growth Wallet</option>
        </select>
        {loadingBalances && (
          <p className="text-xs text-gray-500 mt-1">Loading wallet balances...</p>
        )}
      </div>

      {/* Available Balance */}
      <div className="mb-4">
        <label className="block font-semibold text-gray-700 mb-1 text-sm sm:text-base">
          Available Balance
        </label>
        <input
          type="text"
          value={
            selectedWallet
              ? `$${currentBalance.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}`
              : "$0.00"
          }
          readOnly
          className="w-full border border-gray-300 bg-gray-100 text-gray-700 rounded-md px-3 sm:px-4 py-2 text-sm sm:text-base font-semibold"
        />
      </div>

      {/* Request Amount */}
      <div className="mb-6">
        <label className="block font-semibold text-gray-700 mb-1 text-sm sm:text-base">
          Request Amount (Min: ${MIN_WITHDRAWAL})
        </label>
        <input
          type="number"
          placeholder={`Enter amount (min $${MIN_WITHDRAWAL})`}
          value={requestAmount}
          onChange={(e) => {
            setRequestAmount(e.target.value);
            setSuccessMessage("");
          }}
          className="w-full border border-gray-300 bg-white text-gray-800 rounded-md px-3 sm:px-4 py-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
          disabled={!selectedWallet || isLoading || loadingBalances}
          min={MIN_WITHDRAWAL}
          step="0.01"
        />
        {!selectedWallet && (
          <p className="text-xs text-gray-500 mt-1">
            Please select a wallet first
          </p>
        )}
        {selectedWallet && requestAmount && parseFloat(requestAmount) < MIN_WITHDRAWAL && (
          <p className="text-xs text-red-500 mt-1">
            Minimum withdrawal amount is ${MIN_WITHDRAWAL}
          </p>
        )}
        {selectedWallet &&
          requestAmount &&
          parseFloat(requestAmount) > currentBalance && (
            <p className="text-xs text-red-500 mt-1">
              Amount exceeds available balance
            </p>
          )}
      </div>

      {/* Submit Button */}
      <button
        onClick={handleSubmit}
        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-2 sm:py-3 px-4 rounded-md transition duration-200 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center justify-center"
        disabled={
          !selectedWallet ||
          !requestAmount ||
          isLoading ||
          parseFloat(requestAmount) < MIN_WITHDRAWAL ||
          parseFloat(requestAmount) > currentBalance ||
          loadingBalances
        }
      >
        {isLoading ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            Processing...
          </>
        ) : (
          "Submit Withdraw Request"
        )}
      </button>

      {/* Success Message */}
      {successMessage && (
        <div className="mt-4 p-3 bg-green-100 border border-green-300 rounded-md">
          <p className="text-green-700 font-semibold text-center text-sm sm:text-base">
            ✅ {successMessage}
          </p>
          <button
            onClick={resetForm}
            className="w-full mt-2 text-green-600 hover:text-green-800 text-sm underline"
          >
            Make Another Request
          </button>
        </div>
      )}

      {/* Wallet Info */}
      {selectedWallet && (
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
          <h3 className="text-sm font-semibold text-blue-800 mb-1">
            Selected: {withdrawalRules[selectedWallet].name}
          </h3>
          <p className="text-xs text-blue-600">
            Available: $
            {currentBalance.toLocaleString("en-US", {
              minimumFractionDigits: 2,
            })}
          </p>
        </div>
      )}
    </div>
  );
};

export default SendRequestPage;