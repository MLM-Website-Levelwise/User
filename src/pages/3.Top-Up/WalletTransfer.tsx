import React, { useState, useEffect } from "react";
import { CheckCircle, XCircle, ArrowRight } from "lucide-react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { DashboardHeader } from "@/components/DashboardHeader";

const Wallet_Transfer = () => {
  // Sample member data (in a real app, this would come from an API)
  const memberData = [
    { id: "PRN676277", name: "John Doe" },
    { id: "PRN676278", name: "Jane Smith" },
    { id: "PRN676279", name: "Robert Johnson" },
    { id: "PRN676280", name: "Emily Davis" },
    { id: "PRN676281", name: "Michael Wilson" },
  ];

  // State for form
  const [formData, setFormData] = useState({
    memberId: "",
    memberName: "",
    walletType: "Growth Wallet",
    amount: "",
  });

  const [status, setStatus] = useState<{
    message: string;
    type: "success" | "error" | null;
  }>({ message: "", type: null });

  // Auto-fill member name when ID changes
  useEffect(() => {
    if (formData.memberId) {
      const member = memberData.find(
        (m) => m.id === formData.memberId.toUpperCase()
      );
      setFormData((prev) => ({
        ...prev,
        memberName: member ? member.name : "",
      }));
    } else {
      setFormData((prev) => ({ ...prev, memberName: "" }));
    }
  }, [formData.memberId]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

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

    // In a real app, you would call an API here
    console.log("Transferring funds:", formData);

    // Simulate API call
    setTimeout(() => {
      setStatus({
        message: `Successfully transferred $${formData.amount} to ${formData.memberName}'s ${formData.walletType}`,
        type: "success",
      });
      // Reset form
      setFormData({
        memberId: "",
        memberName: "",
        walletType: "Growth Wallet",
        amount: "",
      });
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        {/* Header */}
        <div className="bg-blue-600 px-6 py-4">
          <h1 className="text-xl font-semibold text-white">Wallet Transfer</h1>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          {/* Member ID */}
          <div className="mb-6">
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

          {/* Member Name (auto-filled) */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Member Name
            </label>
            <div className="px-3 py-2 bg-gray-100 rounded-md">
              {formData.memberName || (
                <span className="text-gray-400">Will auto-fill</span>
              )}
            </div>
          </div>

          {/* Wallet Type and Amount */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label
                htmlFor="walletType"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Wallet Type
              </label>
              <select
                id="walletType"
                name="walletType"
                value={formData.walletType}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="Growth Wallet">Growth Wallet</option>
                <option value="Re Top-up Wallet">Re Top-up Wallet</option>
              </select>
            </div>
            <div>
              <label
                htmlFor="amount"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Amount ($)
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
              />
            </div>
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
                  <CheckCircle className="h-5 w-5 mr-2" />
                ) : (
                  <XCircle className="h-5 w-5 mr-2" />
                )}
                <span>{status.message}</span>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Transfer Funds <ArrowRight className="ml-2 h-4 w-4" />
          </button>
        </form>
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
          <main className="flex-1 p-6">
            <Wallet_Transfer />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default WalletTransfer;
