import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import axios from "axios";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const Login = () => {
  const [credentials, setCredentials] = useState({
    member_id: "",
    password: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axios.post(`${API_BASE_URL}/member-login`, {
        member_id: credentials.member_id,
        password: credentials.password,
      });

      if (response.data.token) {
        // Store token and member data
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("member", JSON.stringify(response.data.member));
        navigate("/dashboard");
      }
    } catch (err) {
      setError("Invalid member ID or password");
      console.error("Login error:", err);
    }
  };

  return (
    <div
      className="min-h-screen relative overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg, #2563eb 0%, #1d4ed8 25%, #3b82f6 50%, #6366f1 75%, #8b5cf6 100%)",
      }}
    >
      {/* Navbar - Consistent with Home Page */}
      <nav className="navbar fixed top-0 w-full bg-[rgba(2,21,61,0.95)] backdrop-blur z-[1000] py-3 transition-all duration-300">
        <div className="nav-container max-w-[1200px] mx-auto flex justify-between items-center px-8">
          {/* Logo */}
          <a
            href="/"
            className="logo text-yellow-400 font-bold text-xl hidden md:inline-block"
          >
            Prime Next
          </a>

          {/* Back to Home Link */}
          <a
            href="/"
            className="text-white hover:text-yellow-400 font-medium transition-colors duration-200 flex items-center"
          >
            <svg
              className="w-5 h-5 mr-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to Home
          </a>
        </div>
      </nav>
      {/* Floating circles background */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Large circles */}
        <div className="absolute w-64 h-64 bg-white bg-opacity-5 rounded-full -top-32 -left-32 animate-pulse"></div>
        {/* <div
          className="absolute w-96 h-96 bg-white bg-opacity-3 rounded-full -top-48 -right-48 animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div> */}
        {/* <div
          className="absolute w-80 h-80 bg-white bg-opacity-4 rounded-full -bottom-40 -left-40 animate-pulse"
          style={{ animationDelay: "4s" }}
        ></div>
        <div
          className="absolute w-72 h-72 bg-white bg-opacity-3 rounded-full -bottom-36 -right-36 animate-pulse"
          style={{ animationDelay: "6s" }}
        ></div> */}
        <div className="absolute w-64 h-64 bg-white bg-opacity-5 rounded-full -bottom-36 -right-36 animate-pulse"></div>

        {/* Small floating circles */}
        <div
          className="absolute w-8 h-8 bg-white bg-opacity-20 rounded-full top-20 left-20 animate-bounce"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute w-6 h-6 bg-white bg-opacity-15 rounded-full top-40 right-32 animate-bounce"
          style={{ animationDelay: "3s" }}
        ></div>
        <div
          className="absolute w-4 h-4 bg-white bg-opacity-25 rounded-full top-60 left-1/4 animate-bounce"
          style={{ animationDelay: "5s" }}
        ></div>
        <div
          className="absolute w-10 h-10 bg-white bg-opacity-10 rounded-full bottom-40 right-20 animate-bounce"
          style={{ animationDelay: "7s" }}
        ></div>
        <div
          className="absolute w-5 h-5 bg-white bg-opacity-20 rounded-full bottom-60 left-1/3 animate-bounce"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute w-7 h-7 bg-white bg-opacity-15 rounded-full top-1/3 right-1/4 animate-bounce"
          style={{ animationDelay: "4s" }}
        ></div>
        <div
          className="absolute w-3 h-3 bg-white bg-opacity-30 rounded-full top-1/2 left-16 animate-bounce"
          style={{ animationDelay: "6s" }}
        ></div>
      </div>

      {/* Main content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen p-4 mt-10">
        <div className="w-full max-w-md">
          {/* Login card */}
          {/* Login card */}
          {/* <div className="bg-white bg-opacity-90 backdrop-blur-lg rounded-3xl border border-gray-200 border-opacity-50 p-8 shadow-2xl">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-light text-gray-800 mb-2">
                Welcome Back
              </h1>
              <p className="text-gray-600 text-lg">
                Enter your credentials to access your dashboard
              </p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-500 bg-opacity-20 text-red-800 rounded-2xl text-sm border border-red-400 border-opacity-50">
                {error}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <label
                  htmlFor="member_id"
                  className="block text-gray-700 text-lg font-medium"
                >
                  Member ID
                </label>
                <input
                  id="member_id"
                  type="text"
                  value={credentials.member_id}
                  onChange={(e) =>
                    setCredentials({
                      ...credentials,
                      member_id: e.target.value,
                    })
                  }
                  placeholder="Enter your member ID"
                  required
                  className="w-full px-6 py-4 bg-white bg-opacity-100 border border-gray-300 rounded-2xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="password"
                  className="block text-gray-700 text-lg font-medium"
                >
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={credentials.password}
                  onChange={(e) =>
                    setCredentials({ ...credentials, password: e.target.value })
                  }
                  placeholder="Enter your password"
                  required
                  className="w-full px-6 py-4 bg-white bg-opacity-100 border border-gray-300 rounded-2xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-6 rounded-2xl transition-all duration-300 text-lg shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
              >
                Login to Dashboard
              </button>
            </form>

            <div className="mt-6 text-center">
              <a
                href="#"
                className="text-gray-600 hover:text-gray-800 text-sm hover:underline transition-all duration-300"
              >
                Forgot Password?
              </a>
            </div>
          </div> */}
          {/* Login card */}
          <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl border border-gray-100 p-8 shadow-2xl shadow-blue-500/20">
            {/* Logo inside card */}
            {/* <div className="flex items-center justify-center mb-6">
              <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center shadow-md">
                <span className="text-white font-bold text-xl">PN</span>
              </div>
              <span className="ml-3 text-xl font-bold text-gray-800">
                Prime Next
              </span>
            </div> */}
            <div className="flex items-center justify-center mb-8 space-x-3">
              <div className="relative">
                <div className="w-14 h-14 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-2xl">PN</span>
                </div>
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-blue-400 rounded-full border-2 border-white"></div>
              </div>
              <div>
                <span className="block text-2xl font-bold text-gray-800 leading-tight">
                  Prime Next
                </span>
                <span className="block text-base text-blue-600 font-medium tracking-widest">
                  Earn, Grow, Lead
                </span>
              </div>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl text-sm border border-red-100">
                {error}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-3">
                <label
                  htmlFor="member_id"
                  className="block text-sm font-medium text-gray-700 uppercase tracking-wider"
                >
                  Member ID
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg
                      className="h-5 w-5 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </div>
                  <input
                    id="member_id"
                    type="text"
                    value={credentials.member_id}
                    onChange={(e) =>
                      setCredentials({
                        ...credentials,
                        member_id: e.target.value,
                      })
                    }
                    placeholder="Enter your member ID"
                    required
                    className="w-full pl-10 pr-6 py-3 bg-white border border-gray-200 rounded-xl text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg transition-all duration-200"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 uppercase tracking-wider"
                >
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg
                      className="h-5 w-5 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
                  </div>
                  <input
                    id="password"
                    type="password"
                    value={credentials.password}
                    onChange={(e) =>
                      setCredentials({
                        ...credentials,
                        password: e.target.value,
                      })
                    }
                    placeholder="Enter your password"
                    required
                    className="w-full pl-10 pr-6 py-3 bg-white border border-gray-200 rounded-xl text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg transition-all duration-200"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor="remember-me"
                    className="ml-2 block text-sm text-gray-700"
                  >
                    Remember me
                  </label>
                </div>

                <div className="text-sm">
                  <a
                    href="#"
                    className="font-medium text-blue-600 hover:text-blue-500"
                  >
                    Forgot password?
                  </a>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 text-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 active:translate-y-0"
              >
                Login to Dashboard
                <svg
                  className="w-5 h-5 ml-2 inline"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  ></path>
                </svg>
              </button>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">
                    New to Prime Networks?
                  </span>
                </div>
              </div>

              <div className="mt-4">
                <button
                  type="button"
                  className="w-full bg-white border border-gray-200 text-gray-700 font-medium py-3 px-6 rounded-xl hover:bg-gray-50 transition-all duration-300 text-lg shadow-sm hover:shadow-md"
                >
                  Create an account
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
