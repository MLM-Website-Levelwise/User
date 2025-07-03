import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { DashboardHeader } from "@/components/DashboardHeader";
import { useState, useEffect } from "react";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const BankDetails = () => {
  const [formData, setFormData] = useState({
    accountHolderName: "",
    bankName: "",
    branchName: "",
    ifscCode: "",
    accountNumber: "",
    accountType: "",
    panNumber: "",
  });
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const accountTypes = [
    { value: "", label: "Select Account Type" },
    { value: "savings", label: "Savings Account" },
    { value: "current", label: "Current Account" },
    { value: "salary", label: "Salary Account" },
    { value: "fd", label: "Fixed Deposit" },
    { value: "rd", label: "Recurring Deposit" },
  ];

  useEffect(() => {
    const fetchBankDetails = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/bank-details`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (response.data.bank_details) {
          setFormData({
            accountHolderName: response.data.member_name,
            bankName: response.data.bank_details.bank_name,
            branchName: response.data.bank_details.branch_name,
            ifscCode: response.data.bank_details.ifsc_code,
            accountNumber: response.data.bank_details.account_number,
            accountType: response.data.bank_details.account_type,
            panNumber: response.data.bank_details.pan_number,
          });
          setIsSubmitted(true); // Mark as submitted if details exist
        } else {
          setFormData(prev => ({
            ...prev,
            accountHolderName: response.data.member_name
          }));
        }
      } catch (error) {
        console.error("Error fetching bank details:", error);
        setError("Failed to load bank details");
      } finally {
        setLoading(false);
      }
    };

    fetchBankDetails();
  }, []);

  const handleInputChange = (e) => {
    if (isSubmitted) return; // Prevent changes if already submitted
    
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'ifscCode' || name === 'panNumber' ? value.toUpperCase() : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitted) return; // Prevent submission if already submitted
    
    setIsSubmitting(true);
    setError("");

    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/bank-details`,
        formData,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      
      console.log("Bank details saved:", response.data);
      setIsSubmitted(true); // Mark as submitted after successful save
      alert("Bank details saved successfully!");
    } catch (error) {
      console.error("Error saving bank details:", error);
      setError(error.response?.data?.error || "Failed to save bank details");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <SidebarProvider>
        <div className="min-h-screen flex w-full bg-gray-50">
          <AppSidebar />
          <div className="flex-1 flex flex-col overflow-x-hidden">
            <DashboardHeader />
            <main className="flex-1 p-4 md:p-6 bg-gray-50 flex items-center justify-center">
              <div className="text-center">Loading bank details...</div>
            </main>
          </div>
        </div>
      </SidebarProvider>
    );
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-gray-50 to-gray-100">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <DashboardHeader />
          <main className="flex-1 p-4 md:p-6 bg-yellow-50">
            <div className="max-w-4xl mx-auto">
              <div className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg">
                <div className={`p-4 ${isSubmitted ? 'bg-green-600' : 'bg-gradient-to-r from-blue-600 to-blue-500'}`}>
                  <h2 className="text-xl font-semibold text-white">
                    {isSubmitted ? 'Bank Details (View Only)' : 'Account Information'}
                  </h2>
                </div>

                <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">
                  {/* Account Holder Name (always read-only) */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Account Holder Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="accountHolderName"
                      value={formData.accountHolderName}
                      readOnly
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
                      required
                    />
                  </div>

                  {/* Bank Name and Branch Name */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Bank Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="bankName"
                        value={formData.bankName}
                        onChange={handleInputChange}
                        readOnly={isSubmitted}
                        className={`w-full px-4 py-3 border border-gray-300 rounded-lg ${
                          isSubmitted ? 'bg-gray-100 cursor-not-allowed' : 'focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                        }`}
                        placeholder="State Bank of India"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Branch Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="branchName"
                        value={formData.branchName}
                        onChange={handleInputChange}
                        readOnly={isSubmitted}
                        className={`w-full px-4 py-3 border border-gray-300 rounded-lg ${
                          isSubmitted ? 'bg-gray-100 cursor-not-allowed' : 'focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                        }`}
                        placeholder="Main Branch"
                        required
                      />
                    </div>
                  </div>

                  {/* IFSC Code and Account Number */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        IFSC Code <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="ifscCode"
                        value={formData.ifscCode}
                        onChange={handleInputChange}
                        readOnly={isSubmitted}
                        className={`w-full px-4 py-3 border border-gray-300 rounded-lg uppercase ${
                          isSubmitted ? 'bg-gray-100 cursor-not-allowed' : 'focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                        }`}
                        placeholder="SBIN0001234"
                        maxLength={11}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Account Number <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="accountNumber"
                        value={formData.accountNumber}
                        onChange={handleInputChange}
                        readOnly={isSubmitted}
                        className={`w-full px-4 py-3 border border-gray-300 rounded-lg ${
                          isSubmitted ? 'bg-gray-100 cursor-not-allowed' : 'focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                        }`}
                        placeholder="1234567890"
                        required
                      />
                    </div>
                  </div>

                  {/* Account Type and PAN Number */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Account Type <span className="text-red-500">*</span>
                      </label>
                      {isSubmitted ? (
                        <input
                          type="text"
                          value={accountTypes.find(t => t.value === formData.accountType)?.label || formData.accountType}
                          readOnly
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
                        />
                      ) : (
                        <select
                          name="accountType"
                          value={formData.accountType}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 appearance-none bg-white"
                          required
                        >
                          {accountTypes.map((type) => (
                            <option key={type.value} value={type.value}>
                              {type.label}
                            </option>
                          ))}
                        </select>
                      )}
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        PAN Number <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="panNumber"
                        value={formData.panNumber}
                        onChange={handleInputChange}
                        readOnly={isSubmitted}
                        className={`w-full px-4 py-3 border border-gray-300 rounded-lg uppercase ${
                          isSubmitted ? 'bg-gray-100 cursor-not-allowed' : 'focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                        }`}
                        placeholder="ABCDE1234F"
                        maxLength={10}
                        required
                      />
                    </div>
                  </div>

                  {/* Error message */}
                  {error && (
                    <div className="p-3 bg-red-50 text-red-700 rounded-lg">
                      {error}
                    </div>
                  )}

                  {/* Submit Buttons - Only show if not submitted */}
                  {!isSubmitted && (
                    <div className="pt-4">
                      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className={`flex-1 sm:flex-none sm:px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white font-medium rounded-lg hover:from-blue-700 hover:to-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-300 shadow-md hover:shadow-lg ${
                            isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                          }`}
                        >
                          {isSubmitting ? 'Saving...' : 'Save Bank Details'}
                        </button>
                        <button
                          type="button"
                          className="flex-1 sm:flex-none sm:px-8 py-3 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-300"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}

                  {/* View Only Message */}
                  {isSubmitted && (
                    <div className="pt-4">
                      <div className="p-3 bg-green-50 text-green-700 rounded-lg border border-green-200">
                        Your bank details have been successfully submitted and cannot be modified.
                      </div>
                    </div>
                  )}
                </form>
              </div>

              {/* Information Card */}
              <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6">
                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <div className="bg-blue-100 p-2 rounded-full">
                      <svg
                        className="h-6 w-6 text-blue-600"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-blue-800">
                      Important Information
                    </h3>
                    <div className="mt-3 space-y-2 text-sm text-blue-700">
                      <p className="flex items-start">
                        <span className="mr-2">•</span>
                        <span>
                          Bank details cannot be modified once submitted
                        </span>
                      </p>
                      <p className="flex items-start">
                        <span className="mr-2">•</span>
                        <span>
                          Contact support if you need to update your bank details
                        </span>
                      </p>
                      <p className="flex items-start">
                        <span className="mr-2">•</span>
                        <span>
                          The account holder name must match your registered name
                        </span>
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

export default BankDetails;