import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import axios from "axios";

const Login = () => {
  const [credentials, setCredentials] = useState({ member_id: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    try {
      const response = await axios.post("https://user-qn5p.onrender.com/member-login", {
        member_id: credentials.member_id,
        password: credentials.password
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
    <div className="min-h-screen bg-gradient-to-br from-primary to-purple-800 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">P</span>
            </div>
            <span className="text-xl font-bold text-primary">Prime Networks Inc</span>
          </div>
          <CardTitle className="text-2xl">Member Login</CardTitle>
          <CardDescription>Enter your credentials to access your dashboard</CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-4 p-2 bg-red-100 text-red-700 rounded text-sm">
              {error}
            </div>
          )}
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="member_id">Member ID</Label>
              <Input
                id="member_id"
                type="text"
                value={credentials.member_id}
                onChange={(e) => setCredentials({ ...credentials, member_id: e.target.value })}
                placeholder="Enter your member ID"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={credentials.password}
                onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                placeholder="Enter your password"
                required
              />
            </div>
            <Button type="submit" className="w-full bg-primary hover:bg-primary/90">
              Login to Dashboard
            </Button>
          </form>
          <div className="mt-4 text-center">
            <a href="#" className="text-sm text-primary hover:underline">
              Forgot Password?
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;