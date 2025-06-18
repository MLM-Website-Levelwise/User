import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { DashboardHeader } from "@/components/DashboardHeader";

import React, { useState } from "react";

const Membership_Card = () => {
  const availableBalance = 52740.0;
  const [requestAmount, setRequestAmount] = useState("");

  return (
    <div className="max-w-md mx-auto bg-gradient-to-br from-yellow-50 to-red-50 p-6 rounded-md shadow-md border border-gray-200">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Withdraw Request
      </h2>

      <div className="mb-4">
        <label className="block font-semibold text-gray-700 mb-1">
          Available Balance
        </label>
        <input
          type="text"
          value={availableBalance.toFixed(2)}
          readOnly
          className="w-full border border-gray-300 bg-gray-100 text-gray-700 rounded-md px-4 py-2"
        />
      </div>

      <div className="mb-4">
        <label className="block font-semibold text-gray-700 mb-1">
          Request balance
        </label>
        <input
          type="number"
          placeholder="request amount"
          value={requestAmount}
          onChange={(e) => setRequestAmount(e.target.value)}
          className="w-full border border-gray-300 bg-white text-gray-800 rounded-md px-4 py-2"
        />
      </div>
    </div>
  );
};

const Send_Request = () => {
  const availableBalance = 52740.0;
  const [requestAmount, setRequestAmount] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (requestAmount) {
      setSuccessMessage(`${requestAmount}rs request generated`);
      // Clear input after submit (optional)
      setRequestAmount("");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto bg-gradient-to-br from-yellow-50 to-red-50 p-6 rounded-md shadow-md border border-gray-200"
    >
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Withdraw Request
      </h2>

      <div className="mb-4">
        <label className="block font-semibold text-gray-700 mb-1">
          Available Balance
        </label>
        <input
          type="text"
          value={availableBalance.toFixed(2)}
          readOnly
          className="w-full border border-gray-300 bg-gray-100 text-gray-700 rounded-md px-4 py-2"
        />
      </div>

      <div className="mb-4">
        <label className="block font-semibold text-gray-700 mb-1">
          Request balance
        </label>
        <input
          type="number"
          placeholder="request amount"
          value={requestAmount}
          onChange={(e) => setRequestAmount(e.target.value)}
          className="w-full border border-gray-300 bg-white text-gray-800 rounded-md px-4 py-2"
          required
        />
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition duration-200"
      >
        Submit Withdraw Request
      </button>

      {successMessage && (
        <p className="mt-4 text-green-600 font-semibold text-center">
          {successMessage}
        </p>
      )}
    </form>
  );
};

const SendRequest = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <DashboardHeader />
          <main className="flex-1 p-6">
            <Send_Request />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default SendRequest;
