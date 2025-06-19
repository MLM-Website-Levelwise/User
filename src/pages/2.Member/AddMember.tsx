import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { DashboardHeader } from "@/components/DashboardHeader";

const AddMember = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    dateOfJoining: new Date().toISOString().split('T')[0],
    mobileNo: '',
    emailId: '',
    sponsorCode: '',
    sponsorName: '',
    position: 'Left', // Default to Left position
    password: '123456', // Default password
    confirmPassword: '' // Added confirmPassword
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match!",
        variant: "destructive",
      });
      return;
    }

    if (!formData.name || !formData.mobileNo || !formData.sponsorCode || !formData.sponsorName || !formData.position || !formData.password) {
      toast({
        title: "Error",
        description: "Please fill all required fields",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('http://localhost:5000/members', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          name: formData.name,
          phone_number: formData.mobileNo,
          email: formData.emailId || null,
          sponsor_code: formData.sponsorCode,
          sponsor_name: formData.sponsorName,
          package: 'Basic', // Hardcoded as Basic
          position: formData.position,
          password: formData.password,
          date_of_joining: formData.dateOfJoining
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to add member');
      }

      toast({
        title: "Success",
        description: "Member added successfully",
      });
      
      // Redirect to view members after successful addition
      navigate('/member/member-memberlist');
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

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'F2') {
      e.preventDefault();
      handleSubmit(e as any);
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <DashboardHeader />
          <main className="flex-1 p-6">
            <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-300 py-10 px-4">
              <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg border border-gray-200">
                <div className="bg-purple-600 text-white px-6 py-5 rounded-t-xl">
                  <h1 className="text-2xl font-semibold">Membership Registration</h1>
                </div>

                <form onSubmit={handleSubmit} onKeyDown={handleKeyPress} className="p-6 space-y-6">
                  {/* Personal Details */}
                  <div>
                    <h2 className="text-xl font-semibold text-blue-600 mb-4">Personal Details</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium mb-1">Name *</label>
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
                        <label className="block text-sm font-medium mb-1">Date of Joining *</label>
                        <input
                          type="date"
                          name="dateOfJoining"
                          value={formData.dateOfJoining}
                          onChange={handleInputChange}
                          min={new Date().toISOString().split('T')[0]}
                          max={new Date().toISOString().split('T')[0]}
                          className="w-full px-4 py-2 border rounded-md border-gray-300 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-1">Mobile No *</label>
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
                        <label className="block text-sm font-medium mb-1">Email ID</label>
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

                  {/* Joining Details */}
                  <div>
                    <h2 className="text-xl font-semibold text-red-600 mb-4">Joining Details</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium mb-1">Sponsor Code *</label>
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
                        <label className="block text-sm font-medium mb-1">Sponsor Name *</label>
                        <input
                          type="text"
                          name="sponsorName"
                          value={formData.sponsorName}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border rounded-md border-gray-300 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-1">Position *</label>
                        <select
                          name="position"
                          value={formData.position}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border rounded-md border-gray-300 bg-white focus:ring-2 focus:ring-purple-500 focus:outline-none"
                          required
                        >
                          <option value="Left">Left</option>
                          <option value="Right">Right</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Password Section */}
                  <div>
                    <h2 className="text-xl font-semibold text-purple-700 mb-4">Account Security</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="relative">
                        <label className="block text-sm font-medium mb-1">Password *</label>
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
                          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                      </div>

                      <div className="relative">
                        <label className="block text-sm font-medium mb-1">Confirm Password *</label>
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
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute top-9 right-3 text-gray-600"
                        >
                          {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="text-center pt-6">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={`bg-purple-600 hover:bg-purple-700 text-white font-medium px-8 py-3 rounded-lg shadow-lg transition ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
                    >
                      {isSubmitting ? 'Processing...' : 'Submit (F2)'}
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