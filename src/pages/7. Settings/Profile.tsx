import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { DashboardHeader } from "@/components/DashboardHeader";
import { useState, useEffect } from "react";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const Profile = () => {
  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    email: "",
    dob: "",
    gender: "",
    location: "",
    pincode: "",
  });
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/profile`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        setFormData({
          name: response.data.name,
          mobile: response.data.mobile,
          email: response.data.email,
          dob: response.data.dob,
          gender: response.data.gender,
          location: response.data.location,
          pincode: response.data.pincode
        });
      } catch (err) {
        console.error("Error fetching profile:", err);
        setError("Failed to load profile data");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear any previous errors/success
    if (error) setError("");
    if (success) setSuccess("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsSubmitting(true);
  setError("");
  setSuccess("");

  try {
    const response = await axios.post(
      `${API_BASE_URL}/api/profile`,
      formData,
      {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      }
    );

    if (response.data?.success) {
      setSuccess(response.data.message || "Profile updated successfully!");
      // Optionally refetch profile data to ensure consistency
      const profileResponse = await axios.get(`${API_BASE_URL}/api/profile`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      setFormData({
        name: profileResponse.data.name,
        mobile: profileResponse.data.mobile,
        email: profileResponse.data.email,
        dob: profileResponse.data.dob,
        gender: profileResponse.data.gender,
        location: profileResponse.data.location,
        pincode: profileResponse.data.pincode
      });
    } else {
      setError(response.data?.error || "Update failed, please try again");
    }
  } catch (error: any) {
    console.error("Error updating profile:", error);
    
    let errorMessage = "An error occurred while updating profile";
    if (error.response) {
      errorMessage = error.response.data?.error || 
                    error.response.data?.details || 
                    "Failed to update profile";
    } else if (error.request) {
      errorMessage = "Network error - please check your connection";
    }
    
    setError(errorMessage);
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
              <div className="text-center">Loading profile data...</div>
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
          <main className="flex-1 p-4 md:p-6">
            <div className="max-w-4xl mx-auto">
              <div className="bg-gradient-to-r from-blue-600 to-blue-500 p-4">
                <h2 className="text-xl font-semibold text-white">
                  Profile Information
                </h2>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                {error && (
                  <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg border border-red-200">
                    {error}
                  </div>
                )}
                {success && (
                  <div className="mb-4 p-3 bg-green-50 text-green-700 rounded-lg border border-green-200">
                    {success}
                  </div>
                )}
                
                <form onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Name */}
                    <div className="space-y-2">
                      <label
                        htmlFor="name"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Full Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>

                    {/* Mobile */}
                    <div className="space-y-2">
                      <label
                        htmlFor="mobile"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Mobile Number
                      </label>
                      <input
                        type="tel"
                        id="mobile"
                        name="mobile"
                        value={formData.mobile}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>

                    {/* Email */}
                    <div className="space-y-2 md:col-span-2">
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Email Address
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>

                    {/* DOB */}
                    <div className="space-y-2">
                      <label
                        htmlFor="dob"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Date of Birth
                      </label>
                      <input
                        type="date"
                        id="dob"
                        name="dob"
                        value={formData.dob}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    {/* Gender */}
                    <div className="space-y-2">
                      <label
                        htmlFor="gender"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Gender
                      </label>
                      <select
                        id="gender"
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Select Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                        <option value="prefer-not-to-say">
                          Prefer not to say
                        </option>
                      </select>
                    </div>

                    {/* Location */}
                    <div className="space-y-2">
                      <label
                        htmlFor="location"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Location
                      </label>
                      <input
                        type="text"
                        id="location"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    {/* Pincode */}
                    <div className="space-y-2">
                      <label
                        htmlFor="pincode"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Pincode
                      </label>
                      <input
                        type="text"
                        id="pincode"
                        name="pincode"
                        value={formData.pincode}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  {/* Update Button */}
                  <div className="mt-8 flex justify-center">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={`px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors ${
                        isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                      }`}
                    >
                      {isSubmitting ? 'Updating...' : 'Update Profile'}
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

export default Profile;