"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { TrendingUp, Eye, EyeOff } from "lucide-react";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Account created! Check your email to confirm.");
      router.push("/login");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#0A0D14] flex items-center justify-center relative overflow-hidden">
      <div className="orb" style={{ top: "-200px", left: "-200px" }} />
      <div
        className="orb"
        style={{
          bottom: "-200px",
          right: "-200px",
          animationDelay: "-4s",
          background: "radial-gradient(circle, #6B8AF720 0%, transparent 70%)",
        }}
      />
      <div className="relative z-10 w-full max-w-md mx-4">
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-[#4C6EF5] flex items-center justify-center mb-4 shadow-lg shadow-[#4C6EF540]">
            <TrendingUp className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-[#F9FAFB] tracking-tight">FinTrack</h1>
          <p className="text-[#9CA3AF] text-sm mt-1">Create your account</p>
        </div>
        <div className="bg-[#111827] border border-[#1F2A3D] rounded-2xl shadow-2xl p-7 space-y-4">
          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <label htmlFor="signup-email" className="block text-sm font-medium text-[#9CA3AF] mb-1.5">
                Email Address
              </label>
              <Input
                id="signup-email"
                type="email"
                placeholder="example@fintrack.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full"
              />
            </div>
            <div>
              <label htmlFor="signup-password" className="block text-sm font-medium text-[#9CA3AF] mb-1.5">
                Password
              </label>
              <div className="relative">
                <Input
                  id="signup-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#4B5563] hover:text-[#9CA3AF] transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
            <Button type="submit" disabled={loading} className="w-full mt-2 py-3 text-base">
              {loading ? "Creating Account..." : "Create Account"}
            </Button>
            <p className="text-center text-sm text-[#4B5563]">
              Already have an account?{" "}
              <a href="/login" className="text-[#4C6EF5] hover:text-[#6B8AF7] font-medium transition-colors">
                Sign In
              </a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
