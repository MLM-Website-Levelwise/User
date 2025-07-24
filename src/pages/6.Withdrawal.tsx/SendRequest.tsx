import React, { useState } from "react";

// Import your predefined components
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { DashboardHeader } from "@/components/DashboardHeader";

const Membership_Card = () => {
  const [selectedWallet, setSelectedWallet] = useState("");
  const [requestAmount, setRequestAmount] = useState("");

  // Wallet data with different balances
  const wallets = {
    "": { name: "Select Wallet", balance: 0 },
    profit: { name: "Profit Sharing Wallet", balance: 52740.0 },
    working: { name: "Working Wallet", balance: 18250.0 },
    growth: { name: "Growth Wallet", balance: 35480.0 },
  };

  const currentBalance = wallets[selectedWallet]?.balance || 0;

  return (
    <div className="w-full max-w-md mx-auto bg-gradient-to-br from-yellow-50 to-red-50 p-4 sm:p-6 rounded-md shadow-md border border-gray-200">
      <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4">
        Withdraw Request
      </h2>

      {/* Wallet Selection Dropdown */}
      <div className="mb-4">
        <label className="block font-semibold text-gray-700 mb-1 text-sm sm:text-base">
          Choose Wallet
        </label>
        <select
          value={selectedWallet}
          onChange={(e) => setSelectedWallet(e.target.value)}
          className="w-full border border-gray-300 bg-white text-gray-800 rounded-md px-3 sm:px-4 py-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select Wallet</option>
          <option value="profit">Profit Sharing Wallet</option>
          <option value="working">Working Wallet</option>
          <option value="growth">Growth Wallet</option>
        </select>
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
              ? `₹${currentBalance.toLocaleString("en-IN", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}`
              : "₹0.00"
          }
          readOnly
          className="w-full border border-gray-300 bg-gray-100 text-gray-700 rounded-md px-3 sm:px-4 py-2 text-sm sm:text-base font-semibold"
        />
      </div>

      {/* Request Amount */}
      <div className="mb-4">
        <label className="block font-semibold text-gray-700 mb-1 text-sm sm:text-base">
          Request Balance
        </label>
        <input
          type="number"
          placeholder="Enter request amount"
          value={requestAmount}
          onChange={(e) => setRequestAmount(e.target.value)}
          className="w-full border border-gray-300 bg-white text-gray-800 rounded-md px-3 sm:px-4 py-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={!selectedWallet}
          min="1"
          step="0.01"
        />
        {!selectedWallet && (
          <p className="text-xs text-gray-500 mt-1">
            Please select a wallet first
          </p>
        )}
      </div>
    </div>
  );
};

const Send_Request = () => {
  const [selectedWallet, setSelectedWallet] = useState("");
  const [requestAmount, setRequestAmount] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Wallet data with different balances
  const wallets = {
    "": { name: "Select Wallet", balance: 0 },
    profit: { name: "Profit Sharing Wallet", balance: 52740.0 },
    working: { name: "Working Wallet", balance: 18250.0 },
    growth: { name: "Growth Wallet", balance: 35480.0 },
  };

  const currentBalance = wallets[selectedWallet]?.balance || 0;

  const handleSubmit = async () => {
    if (!selectedWallet) {
      alert("Please select a wallet first");
      return;
    }

    if (!requestAmount || parseFloat(requestAmount) <= 0) {
      alert("Please enter a valid amount");
      return;
    }

    if (parseFloat(requestAmount) > currentBalance) {
      alert(
        `Insufficient balance. Available balance: ₹${currentBalance.toLocaleString(
          "en-IN",
          { minimumFractionDigits: 2 }
        )}`
      );
      return;
    }

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setSuccessMessage(
        `₹${parseFloat(requestAmount).toLocaleString("en-IN", {
          minimumFractionDigits: 2,
        })} withdrawal request submitted successfully from ${
          wallets[selectedWallet].name
        }`
      );
      setRequestAmount("");
      setIsLoading(false);
    }, 1500);
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

      {/* Wallet Selection Dropdown */}
      <div className="mb-4">
        <label className="block font-semibold text-gray-700 mb-1 text-sm sm:text-base">
          Choose Wallet
        </label>
        <select
          value={selectedWallet}
          onChange={(e) => {
            setSelectedWallet(e.target.value);
            setSuccessMessage(""); // Clear success message when wallet changes
            setRequestAmount(""); // Clear amount when wallet changes
          }}
          className="w-full border border-gray-300 bg-white text-gray-800 rounded-md px-3 sm:px-4 py-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
          disabled={isLoading}
        >
          <option value="">Select Wallet</option>
          <option value="profit">Profit Sharing Wallet</option>
          <option value="working">Working Wallet</option>
          <option value="growth">Growth Wallet</option>
        </select>
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
              ? `₹${currentBalance.toLocaleString("en-IN", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}`
              : "₹0.00"
          }
          readOnly
          className="w-full border border-gray-300 bg-gray-100 text-gray-700 rounded-md px-3 sm:px-4 py-2 text-sm sm:text-base font-semibold"
        />
      </div>

      {/* Request Amount */}
      <div className="mb-6">
        <label className="block font-semibold text-gray-700 mb-1 text-sm sm:text-base">
          Request Balance
        </label>
        <input
          type="number"
          placeholder="Enter request amount"
          value={requestAmount}
          onChange={(e) => {
            setRequestAmount(e.target.value);
            setSuccessMessage(""); // Clear success message when amount changes
          }}
          className="w-full border border-gray-300 bg-white text-gray-800 rounded-md px-3 sm:px-4 py-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
          disabled={!selectedWallet || isLoading}
          min="1"
          step="0.01"
        />
        {!selectedWallet && (
          <p className="text-xs text-gray-500 mt-1">
            Please select a wallet first
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
          parseFloat(requestAmount) > currentBalance
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

      {/* Wallet Info Display */}
      {selectedWallet && (
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
          <h3 className="text-sm font-semibold text-blue-800 mb-1">
            Selected: {wallets[selectedWallet].name}
          </h3>
          <p className="text-xs text-blue-600">
            Available: ₹
            {currentBalance.toLocaleString("en-IN", {
              minimumFractionDigits: 2,
            })}
          </p>
        </div>
      )}
    </div>
  );
};

const SendRequest = () => {
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
                <Send_Request />

                {/* Additional Info Panel - Hidden on laptop/desktop screens (lg and up) */}
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
                        Minimum withdrawal amount is 5$ - ROI
                      </p>
                      <p className="text-gray-600 text-xs">
                        Minimum withdrawal amount is 6$ - Working
                      </p>
                    </div>

                    {/* <div className="border-l-4 border-yellow-500 pl-4">
                      <h4 className="font-semibold text-gray-700 text-sm">
                        Transaction Fees
                      </h4>
                      <p className="text-gray-600 text-xs">
                        No additional fees for standard withdrawals
                      </p>
                    </div> */}
                  </div>

                  {/* <div className="mt-6 p-3 bg-gray-50 rounded-md">
                    <h4 className="font-semibold text-gray-700 text-sm mb-2">
                      Need Help?
                    </h4>
                    <p className="text-gray-600 text-xs">
                      Contact our support team for any withdrawal-related
                      queries.
                    </p>
                    <button className="mt-2 text-blue-600 hover:text-blue-800 text-xs underline">
                      Contact Support
                    </button>
                  </div> */}
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default SendRequest;
