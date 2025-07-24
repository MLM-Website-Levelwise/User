import React, { useState, useEffect } from "react";
import { CheckCircle, XCircle, ArrowRight, Wallet } from "lucide-react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { DashboardHeader } from "@/components/DashboardHeader";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const Wallet_Transfer = () => {
  const navigate = useNavigate();
  const [isFetchingMember, setIsFetchingMember] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // State for form
  const [formData, setFormData] = useState({
    walletType: "Main Wallet",
    memberId: "",
    memberName: "",
    amount: "",
  });

  const [currentBalance, setCurrentBalance] = useState(0);
  const [walletBalances, setWalletBalances] = useState({
    "Main Wallet": 0,
    "Re Top-up Wallet": 0,
  });

  const [status, setStatus] = useState<{
    message: string;
    type: "success" | "error" | null;
  }>({ message: "", type: null });

  // Fetch current user's wallet balances on component mount
  // Update the balance fetching useEffect
useEffect(() => {
  const fetchBalances = async () => {
    try {
      // Get member data from localStorage (same as MemberActivation)
      const memberDataString = localStorage.getItem("member");
      const memberData = memberDataString ? JSON.parse(memberDataString) : {};
      const member_id = memberData.member_id;

      const token = localStorage.getItem("token");
      
      if (!token || !member_id) {
        navigate("/login");
        return;
      }

      // Fetch main wallet balance
      const mainBalanceResponse = await axios.get(
        `${API_BASE_URL}/member-wallet-balance`,
        {
          headers: { Authorization: `Bearer ${token}` },
          params: { member_id }  // Using same parameter name as MemberActivation
        }
      );

      // Fetch re-topup wallet balance
      const reTopupBalanceResponse = await axios.get(
        `${API_BASE_URL}/re-top-up-wallet-balance`,
        {
          headers: { Authorization: `Bearer ${token}` },
          params: { member_id }  // Using same parameter name as MemberActivation
        }
      );

      // Add success checks like MemberActivation
      if (mainBalanceResponse.data.success && reTopupBalanceResponse.data.success) {
        setWalletBalances({
          "Main Wallet": mainBalanceResponse.data.balance || 0,
          "Re Top-up Wallet": reTopupBalanceResponse.data.balance || 0,
        });
        setCurrentBalance(mainBalanceResponse.data.balance || 0);
      }
    } catch (error) {
      console.error("Error fetching balances:", {
        error: error.response?.data || error.message
      });
      // toast.error("Failed to load wallet balances");
    }
  };

  fetchBalances();
}, [navigate]);

  // Update balance when wallet type changes
  useEffect(() => {
    setCurrentBalance(
      walletBalances[formData.walletType as keyof typeof walletBalances]
    );
  }, [formData.walletType, walletBalances]);

  // Fetch member name when ID changes
  useEffect(() => {
    const fetchMember = async () => {
      if (formData.memberId) {
        const name = await fetchMemberName(formData.memberId);
        setFormData(prev => ({ ...prev, memberName: name }));
      } else {
        setFormData(prev => ({ ...prev, memberName: "" }));
      }
    };
    
    fetchMember();
  }, [formData.memberId]);

  const fetchMemberName = async (memberId: string): Promise<string> => {
    setIsFetchingMember(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return "";
      }

      const response = await axios.get(`${API_BASE_URL}/members?member_id=${memberId}`, {
        headers: { Authorization: `Bearer ${token}` }
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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
  // Validation
  if (!formData.memberId) {
    setStatus({ message: "Please enter Member ID", type: "error" });
    return;
  }

  if (!formData.memberName) {
    setStatus({ message: "Invalid Member ID", type: "error" });
    return;
  }

  if (!formData.amount || isNaN(Number(formData.amount))) {
    setStatus({ message: "Please enter a valid amount", type: "error" });
    return;
  }

  const transferAmount = Number(formData.amount);
  if (transferAmount > currentBalance) {
    setStatus({ message: "Insufficient balance", type: "error" });
    return;
  }

  if (transferAmount <= 0) {
    setStatus({ message: "Amount must be greater than 0", type: "error" });
    return;
  }

  setIsSubmitting(true);
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    // Get sender info from localStorage
    const memberDataString = localStorage.getItem("member");
    const memberData = memberDataString ? JSON.parse(memberDataString) : {};

    const response = await axios.post(
  `${API_BASE_URL}/member-wallet-transfer`,
  {
    member_id: formData.memberId,
    transfer_type: formData.walletType,
    amount: transferAmount,
    sender_member_id: memberData.member_id, // This should match your member_id format
    sender_member_name: memberData.name
  },
  { 
    headers: { 
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    } 
  }
);

    setStatus({
      message: `Successfully transferred $${formData.amount} from ${formData.walletType} to ${formData.memberName}`,
      type: "success",
    });

    // Update balances after successful transfer
    const updatedBalances = { ...walletBalances };
    updatedBalances[formData.walletType as keyof typeof walletBalances] -= transferAmount;
    setWalletBalances(updatedBalances);
    setCurrentBalance(updatedBalances[formData.walletType as keyof typeof walletBalances]);

    // Reset form
    setFormData({
      walletType: formData.walletType,
      memberId: "",
      memberName: "",
      amount: "",
    });
  } catch (error: any) {
    console.error("Transfer error details:", {
      response: error.response?.data,
      config: error.config
    });
    setStatus({
      message: error.response?.data?.error || "Failed to process transfer",
      type: "error",
    });
  } finally {
    setIsSubmitting(false);
  }
};

  return (
    <div className="min-h-screen bg-gray-50 py-4 px-2 sm:py-2">
      <div className="max-w-md lg:max-w-2xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        {/* Header */}
        <div className="bg-blue-600 px-4 py-4 sm:px-6">
          <h1 className="text-lg sm:text-xl font-semibold text-white">
            Wallet Transfer
          </h1>
        </div>

        {/* Form */}
        <div className="p-4 sm:p-6 bg-gradient-to-br from-yellow-50 to-yellow-50 rounded-md shadow-md border border-gray-200">
          {/* Wallet Type and Balance */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Wallet Type Selection */}
            <div>
              <label
                htmlFor="walletType"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Choose Wallet
              </label>
              <select
                id="walletType"
                name="walletType"
                value={formData.walletType}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="Main Wallet">Main Wallet</option>
                <option value="Re Top-up Wallet">Re Top-up Wallet</option>
              </select>
            </div>

            {/* Available Balance Display */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Available Balance
              </label>
              <div className="px-3 py-2 bg-green-50 border border-green-200 rounded-md">
                <div className="flex items-center">
                  <Wallet className="h-4 w-4 text-green-600 mr-2" />
                  <span className="text-green-800 font-semibold">
                    $
                    {currentBalance.toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Member ID and Name */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Member ID */}
            <div>
              <label
                htmlFor="memberId"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Member ID
              </label>
              <input
                type="text"
                id="memberId"
                name="memberId"
                value={formData.memberId}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter Member ID"
                autoComplete="off"
              />
            </div>

            {/* Member Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Member Name
              </label>
              <div className="px-3 py-2 bg-gray-100 rounded-md min-h-[40px] flex items-center">
                {isFetchingMember ? (
                  <span className="text-gray-400">Loading...</span>
                ) : formData.memberName ? (
                  formData.memberName
                ) : (
                  <span className="text-gray-400">
                    Will auto-fill when Member ID is entered
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Transfer Amount */}
          <div className="mb-6">
            <label
              htmlFor="amount"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Transfer Amount ($)
            </label>
            <input
              type="number"
              id="amount"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="0.00"
              min="0"
              step="0.01"
              max={currentBalance}
            />
            {formData.amount && Number(formData.amount) > currentBalance && (
              <p className="text-red-600 text-xs mt-1">
                Amount exceeds available balance
              </p>
            )}
          </div>

          {/* Status Message */}
          {status.message && (
            <div
              className={`mb-4 p-3 rounded-md ${
                status.type === "success"
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              <div className="flex items-center">
                {status.type === "success" ? (
                  <CheckCircle className="h-5 w-5 mr-2 flex-shrink-0" />
                ) : (
                  <XCircle className="h-5 w-5 mr-2 flex-shrink-0" />
                )}
                <span className="text-sm">{status.message}</span>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div className="flex justify-center">
            <button
              type="button"
              onClick={handleSubmit}
              disabled={
                isSubmitting ||
                isFetchingMember ||
                !formData.memberId ||
                !formData.memberName ||
                !formData.amount ||
                Number(formData.amount) > currentBalance
              }
              className="w-full lg:w-auto lg:px-8 flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200"
            >
              {isSubmitting ? "Processing..." : "Transfer Fund"}
              {!isSubmitting && <ArrowRight className="ml-2 h-4 w-4" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const WalletTransfer = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <DashboardHeader />
          <main className="flex-1 p-1 sm:p-1">
            <Wallet_Transfer />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default WalletTransfer;