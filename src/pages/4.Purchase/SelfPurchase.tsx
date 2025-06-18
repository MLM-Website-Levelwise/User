import React, { useState } from "react";

import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { DashboardHeader } from "@/components/DashboardHeader";

const Self_Purchase = () => {
  const [selectedPackage, setSelectedPackage] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const packages = [
    { id: "plus_card", name: "PLUS CARD :: INR 2950" },
    { id: "premium", name: "PREMIUM PACK :: INR 5000" },
    { id: "basic", name: "BASIC PACK :: INR 1500" },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPackage) return alert("Please select a package");
    setIsSubmitting(true);
    console.log("Selected Package:", selectedPackage);
    setTimeout(() => setIsSubmitting(false), 1500);
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-xl shadow-lg border border-gray-100">
      <h1 className="text-2xl font-bold text-gray-800 mb-2">Purchase</h1>
      <p className="text-gray-600 mb-6">Purchase Yourself</p>

      <form onSubmit={handleSubmit}>
        {/* Fixed Purchase Type (non-editable) */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Type*
          </label>
          <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 text-gray-700">
            Purchase (Re-Top Up)
          </div>
        </div>

        {/* Package Dropdown */}
        <div className="mb-6">
          <label
            htmlFor="package"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Select Package*
          </label>
          <select
            id="package"
            value={selectedPackage}
            onChange={(e) => setSelectedPackage(e.target.value)}
            className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          >
            <option value="" disabled>
              Choose a package
            </option>
            {packages.map((pkg) => (
              <option key={pkg.id} value={pkg.id}>
                {pkg.name}
              </option>
            ))}
          </select>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full py-3 px-4 rounded-lg text-white font-semibold ${
            isSubmitting ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"
          } transition-colors`}
        >
          {isSubmitting ? "Processing..." : "Submit"}
        </button>
      </form>
    </div>
  );
};

const SelfPurchase = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <DashboardHeader />
          <main className="flex-1 p-6">
            <Self_Purchase />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default SelfPurchase;
