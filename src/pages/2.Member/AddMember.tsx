import React, { useState, useEffect } from "react";
import { Eye, EyeOff, Loader } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { DashboardHeader } from "@/components/DashboardHeader";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const AddMember = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    dateOfJoining: new Date().toISOString().split("T")[0],
    mobileNo: "",
    emailId: "",
    sponsorCode: "",
    sponsorName: "",
    position: "",
    password: "123456",
    confirmPassword: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isFetchingSponsor, setIsFetchingSponsor] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkActivationStatus = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }

        const response = await axios.get(
          `${API_BASE_URL}/check-activation-status`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setIsActive(response.data.isActive);
      } catch (error) {
        console.error("Error checking activation status:", error);
        toast({
          title: "Error",
          description: "Failed to check activation status",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    checkActivationStatus();
  }, [navigate, toast]);

  // Fetch sponsor name from backend
  const fetchSponsorName = async (memberId: string): Promise<string> => {
    setIsFetchingSponsor(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return "";
      }

      const response = await axios.get(
        `${API_BASE_URL}/members/check-sponsor?member_id=${memberId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data.name || "";
    } catch (error) {
      console.error("Error fetching sponsor:", error);
      toast({
        title: "Error",
        description:
          error.response?.data?.error ||
          "You can only view your own information or your direct referrals",
        variant: "destructive",
      });
      return "";
    } finally {
      setIsFetchingSponsor(false);
    }
  };

  const handleInputChange = async (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Fetch sponsor name when sponsor code changes and has at least 4 characters
    if (name === "sponsorCode" && value.length >= 4) {
      try {
        const sponsorName = await fetchSponsorName(value);
        setFormData((prev) => ({
          ...prev,
          sponsorName,
        }));
      } catch (error) {
        setFormData((prev) => ({
          ...prev,
          sponsorName: "",
        }));
      }
    }
  };

  const validateForm = () => {
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match!",
        variant: "destructive",
      });
      return false;
    }

    if (
      !formData.name ||
      !formData.mobileNo ||
      !formData.sponsorCode ||
      !formData.sponsorName ||
      !formData.password
    ) {
      toast({
        title: "Error",
        description: "Please fill all required fields",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setShowConfirmation(true);
  };

  const confirmSubmission = async () => {
    setShowConfirmation(false);
    setIsSubmitting(true);

    try {
      const response = await fetch(`${API_BASE_URL}/members`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          name: formData.name,
          phone_number: formData.mobileNo,
          email: formData.emailId || null,
          sponsor_code: formData.sponsorCode,
          sponsor_name: formData.sponsorName,
          package: "N/A",
          position: formData.position,
          password: formData.password,
          date_of_joining: formData.dateOfJoining,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to add member");
      }

      toast({
        title: "Success",
        description: "Member added successfully",
      });

      navigate("/member/member-memberlist");
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const cancelSubmission = () => {
    setShowConfirmation(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "F2") {
      e.preventDefault();
      handleSubmit(e as any);
    }
  };

  if (isLoading) {
    return (
      <SidebarProvider>
        <div className="min-h-screen flex w-full bg-gray-50">
          <AppSidebar />
          <div className="flex-1 flex flex-col">
            <DashboardHeader />
            <main className="flex-1 flex items-center justify-center">
              <Loader className="w-8 h-8 animate-spin text-blue-600" />
            </main>
          </div>
        </div>
      </SidebarProvider>
    );
  }

  if (!isActive) {
    return (
      <SidebarProvider>
        <div className="min-h-screen flex w-full bg-gray-50">
          <AppSidebar />
          <div className="flex-1 flex flex-col">
            <DashboardHeader />
            <main className="flex-1">
              <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-300 py-1 px-2">
                <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-lg border border-gray-200 relative">
                  <div className="absolute inset-0 bg-white bg-opacity-90 flex items-center justify-center z-10">
                    <div className="text-center p-8 bg-red-100 rounded-lg border border-red-300 shadow-lg">
                      <h2 className="text-2xl font-bold text-red-600 mb-4">
                        Account Inactive
                      </h2>
                      <p className="text-lg text-gray-700 mb-6">
                        You need to activate your account before you can add new
                        members.
                      </p>
                      <p className="text-gray-600">
                        Please contact your sponsor or administrator to activate
                        your account.
                      </p>
                    </div>
                  </div>

                  {/* The rest of your form (rendered in the background) */}
                  <div className="opacity-30">
                    <div className="bg-blue-900 text-white px-6 py-4">
                      <h1 className="text-2xl font-semibold text-center">
                        Membership Form
                      </h1>
                    </div>

                    <form
                      onSubmit={handleSubmit}
                      onKeyDown={handleKeyPress}
                      className="p-6 space-y-6"
                    >
                      {/* Joining Details */}
                      <div>
                        <h2 className="text-xl font-semibold text-red-600 mb-4">
                          Joining Details
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-sm font-medium mb-1">
                              Sponsor Code *
                            </label>
                            <input
                              type="text"
                              name="sponsorCode"
                              value={formData.sponsorCode}
                              onChange={handleInputChange}
                              className="w-full px-4 py-2 border rounded-md border-gray-300 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                              required
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium mb-1">
                              Sponsor Name *
                            </label>
                            <div className="relative">
                              <input
                                type="text"
                                name="sponsorName"
                                value={formData.sponsorName}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 border rounded-md border-gray-300 focus:ring-2 focus:ring-purple-500 focus:outline-none bg-gray-50"
                                required
                                readOnly
                              />
                              {isFetchingSponsor && (
                                <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                                  <Loader className="w-4 h-4 animate-spin text-purple-600" />
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Personal Details */}
                      <div>
                        <h2 className="text-xl font-semibold text-blue-600 mb-4">
                          Personal Details
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-sm font-medium mb-1">
                              Name *
                            </label>
                            <input
                              type="text"
                              name="name"
                              value={formData.name}
                              onChange={handleInputChange}
                              className="w-full px-4 py-2 border rounded-md border-gray-300 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                              required
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium mb-1">
                              Date of Joining *
                            </label>
                            <input
                              type="date"
                              name="dateOfJoining"
                              value={formData.dateOfJoining}
                              onChange={handleInputChange}
                              min={new Date().toISOString().split("T")[0]}
                              max={new Date().toISOString().split("T")[0]}
                              className="w-full px-4 py-2 border rounded-md border-gray-300 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                              required
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium mb-1">
                              Mobile No *
                            </label>
                            <input
                              type="tel"
                              name="mobileNo"
                              value={formData.mobileNo}
                              onChange={handleInputChange}
                              className="w-full px-4 py-2 border rounded-md border-gray-300 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                              required
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium mb-1">
                              Email ID
                            </label>
                            <input
                              type="email"
                              name="emailId"
                              value={formData.emailId}
                              onChange={handleInputChange}
                              className="w-full px-4 py-2 border rounded-md border-gray-300 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Password Section */}
                      <div>
                        <h2 className="text-xl font-semibold text-purple-700 mb-4">
                          Account Security
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="relative">
                            <label className="block text-sm font-medium mb-1">
                              Password *
                            </label>
                            <input
                              type={showPassword ? "text" : "password"}
                              name="password"
                              value={formData.password}
                              onChange={handleInputChange}
                              className="w-full px-4 py-2 border rounded-md border-gray-300 pr-10 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                              required
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute top-9 right-3 text-gray-600"
                            >
                              {showPassword ? (
                                <EyeOff size={20} />
                              ) : (
                                <Eye size={20} />
                              )}
                            </button>
                          </div>

                          <div className="relative">
                            <label className="block text-sm font-medium mb-1">
                              Confirm Password *
                            </label>
                            <input
                              type={showConfirmPassword ? "text" : "password"}
                              name="confirmPassword"
                              value={formData.confirmPassword}
                              onChange={handleInputChange}
                              className="w-full px-4 py-2 border rounded-md border-gray-300 pr-10 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                              required
                            />
                            <button
                              type="button"
                              onClick={() =>
                                setShowConfirmPassword(!showConfirmPassword)
                              }
                              className="absolute top-9 right-3 text-gray-600"
                            >
                              {showConfirmPassword ? (
                                <EyeOff size={20} />
                              ) : (
                                <Eye size={20} />
                              )}
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Submit Button */}
                      <div className="text-center pt-6">
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className={`bg-purple-600 hover:bg-blue-700 text-white font-medium px-8 py-3 rounded-lg shadow-lg transition ${
                            isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                          }`}
                        >
                          {isSubmitting ? "Processing..." : "Submit (F2)"}
                        </button>
                      </div>
                    </form>
                  </div>
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
            {/* Confirmation Dialog */}
            {showConfirmation && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
                  <h3 className="text-xl font-semibold mb-4">
                    Confirm Submission
                  </h3>
                  <p className="mb-6">
                    Are you sure you want to submit this member information?
                  </p>
                  <div className="flex justify-end space-x-4">
                    <button
                      onClick={cancelSubmission}
                      className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={confirmSubmission}
                      disabled={isSubmitting}
                      className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50"
                    >
                      {isSubmitting ? "Submitting..." : "Confirm"}
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-300 py-1 px-2">
              <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-lg border border-gray-200">
                <div className="bg-blue-900 text-white px-6 py-4">
                  <h1 className="text-2xl font-semibold text-center">
                    Membership Form
                  </h1>
                </div>

                <form
                  onSubmit={handleSubmit}
                  onKeyDown={handleKeyPress}
                  className="p-6 space-y-6"
                >
                  {/* Joining Details */}
                  <div>
                    <h2 className="text-xl font-semibold text-red-600 mb-4">
                      Joining Details
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Sponsor Code *
                        </label>
                        <input
                          type="text"
                          name="sponsorCode"
                          value={formData.sponsorCode}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border rounded-md border-gray-300 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Sponsor Name *
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            name="sponsorName"
                            value={formData.sponsorName}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border rounded-md border-gray-300 focus:ring-2 focus:ring-purple-500 focus:outline-none bg-gray-50"
                            required
                            readOnly
                          />
                          {isFetchingSponsor && (
                            <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                              <Loader className="w-4 h-4 animate-spin text-purple-600" />
                            </div>
                          )}
                        </div>
                      </div>

                      <div>
              <label className="block text-sm font-medium mb-1">
                Position *
              </label>
              <select
                name="position"
                value={formData.position}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-md border-gray-300 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                required
              >
                <option value="">Select Position</option>
                <option value="Left">Left</option>
                <option value="Right">Right</option>
              </select>
            </div>
                    </div>
                  </div>

                  {/* Personal Details */}
                  <div>
                    <h2 className="text-xl font-semibold text-blue-600 mb-4">
                      Personal Details
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Name *
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border rounded-md border-gray-300 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Date of Joining *
                        </label>
                        <input
                          type="date"
                          name="dateOfJoining"
                          value={formData.dateOfJoining}
                          onChange={handleInputChange}
                          min={new Date().toISOString().split("T")[0]}
                          max={new Date().toISOString().split("T")[0]}
                          className="w-full px-4 py-2 border rounded-md border-gray-300 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Mobile No *
                        </label>
                        <input
                          type="tel"
                          name="mobileNo"
                          value={formData.mobileNo}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border rounded-md border-gray-300 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Email ID
                        </label>
                        <input
                          type="email"
                          name="emailId"
                          value={formData.emailId}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border rounded-md border-gray-300 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Password Section */}
                  <div>
                    <h2 className="text-xl font-semibold text-purple-700 mb-4">
                      Account Security
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="relative">
                        <label className="block text-sm font-medium mb-1">
                          Password *
                        </label>
                        <input
                          type={showPassword ? "text" : "password"}
                          name="password"
                          value={formData.password}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border rounded-md border-gray-300 pr-10 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute top-9 right-3 text-gray-600"
                        >
                          {showPassword ? (
                            <EyeOff size={20} />
                          ) : (
                            <Eye size={20} />
                          )}
                        </button>
                      </div>

                      <div className="relative">
                        <label className="block text-sm font-medium mb-1">
                          Confirm Password *
                        </label>
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border rounded-md border-gray-300 pr-10 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                          required
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                          className="absolute top-9 right-3 text-gray-600"
                        >
                          {showConfirmPassword ? (
                            <EyeOff size={20} />
                          ) : (
                            <Eye size={20} />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="text-center pt-6">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={`bg-blue-600 hover:bg-blue-800 text-white font-medium px-8 py-3 rounded-lg shadow-lg transition ${
                        isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                    >
                      {isSubmitting ? "Processing..." : "Submit (F2)"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default AddMember;
