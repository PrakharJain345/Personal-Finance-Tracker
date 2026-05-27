"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { TrendingUp, Eye, EyeOff, ShieldCheck, PieChart, Zap, BarChart2, SlidersHorizontal, RefreshCcw, Lock, LayoutDashboard } from "lucide-react";
import { motion } from "framer-motion";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState<"login" | "signup">("login");
  const router = useRouter();
  const authSectionRef = useRef<HTMLDivElement>(null);

  const scrollToAuth = (mode: "login" | "signup") => {
    setTab(mode);
    authSectionRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Welcome back!");
      router.push("/dashboard");
      router.refresh();
    }
    setLoading(false);
  };

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
      setTab("login");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0B0F19] via-[#0A0D14] to-[#0D0914] bg-dot-pattern relative text-[#F9FAFB] overflow-x-hidden">
      {/* Premium Aurora Background Glows */}
      <div className="absolute top-[-10%] left-[10%] w-[500px] h-[500px] bg-[#4C6EF5] rounded-full blur-[130px] opacity-15 pointer-events-none animate-pulse" style={{ animationDuration: "12s" }} />
      <div className="absolute top-[20%] right-[5%] w-[600px] h-[600px] bg-[#8B5CF6] rounded-full blur-[150px] opacity-[0.12] pointer-events-none animate-pulse" style={{ animationDuration: "18s" }} />
      <div className="absolute top-[40%] left-[20%] w-[450px] h-[450px] bg-[#2DD4BF] rounded-full blur-[120px] opacity-10 pointer-events-none" />
      <div className="absolute bottom-[10%] right-[15%] w-[700px] h-[700px] bg-[#10B981] rounded-full blur-[160px] opacity-10 pointer-events-none" />

      {/* Navbar */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 sm:px-14 py-5 bg-[#0A0D14]/85 backdrop-blur-xl border-b border-[#1F2A3D]/60"
      >
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#4C6EF5] to-[#2DD4BF] flex items-center justify-center shadow-lg shadow-[#4C6EF540]">
            <TrendingUp className="w-5 h-5 text-white" />
          </div>
          <span className="text-[1.1rem] font-bold tracking-tight text-white">FinTrack</span>
        </div>

        {/* Nav Links - Perfectly Centered */}
        <div className="hidden md:flex items-center gap-1 absolute left-1/2 -translate-x-1/2">
          <a
            href="#features"
            className="px-4 py-2 rounded-lg text-[0.9rem] font-medium text-[#9CA3AF] hover:text-white hover:bg-white/5 transition-all duration-150"
          >
            Features
          </a>
          <a
            href="#how-it-works"
            className="px-4 py-2 rounded-lg text-[0.9rem] font-medium text-[#9CA3AF] hover:text-white hover:bg-white/5 transition-all duration-150"
          >
            How it works
          </a>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2">
          <a
            href="https://github.com/PrakharJain345/Personal-Finance-Tracker"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#6B7280] hover:text-white transition-colors flex items-center justify-center w-9 h-9 rounded-lg hover:bg-white/5"
            aria-label="GitHub Repository"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-[18px] h-[18px]">
              <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
            </svg>
          </a>
          <div className="w-px h-5 bg-[#1F2A3D] mx-1" />
          <button
            onClick={() => scrollToAuth("login")}
            className="hidden sm:block px-4 py-2 rounded-lg text-[0.9rem] font-medium text-[#9CA3AF] hover:text-white hover:bg-white/5 transition-all duration-150"
          >
            Sign In
          </button>
          <button
            onClick={() => scrollToAuth("signup")}
            className="px-4 py-2 rounded-lg text-[0.9rem] font-semibold bg-white text-[#0A0D14] hover:bg-gray-100 transition-colors"
          >
            Get Started
          </button>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <div className="relative pt-32 pb-20 sm:pt-48 sm:pb-32 px-4 flex flex-col items-center justify-center text-center min-h-[85vh]">
        <div className="max-w-4xl mx-auto flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1F2A3D] border border-[#374151] text-sm text-[#9CA3AF] mb-8"
          >
            <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
            FinTrack 2.0 is live — free forever
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-5xl sm:text-7xl font-extrabold tracking-tight leading-[1.15] mb-6"
          >
            Never lose track of <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2DD4BF] via-[#4C6EF5] to-[#8B5CF6]">
              where your money goes.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-lg sm:text-xl text-[#9CA3AF] max-w-2xl mb-10 leading-relaxed"
          >
            FinTrack captures your expenses instantly — so you always know your balance, stay on budget, and hit your savings goals effortlessly.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <Button
              onClick={() => scrollToAuth("signup")}
              className="rounded-full px-8 py-6 text-lg bg-white text-black hover:bg-gray-200 hover:scale-105 transition-transform"
            >
              Start tracking free
            </Button>
            <p className="text-xs text-[#4B5563] mt-4 uppercase tracking-widest font-semibold">
              No credit card required
            </p>
          </motion.div>
        </div>

        {/* Feature Pills */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="absolute bottom-10 left-0 right-0 flex justify-center gap-4 flex-wrap px-4"
        >
          {[
            { icon: ShieldCheck, label: "Bank-level Security" },
            { icon: PieChart, label: "Visual Insights" },
            { icon: Zap, label: "Lightning Fast" },
          ].map((Feature, i) => (
            <div key={i} className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#111827]/50 border border-[#1F2A3D] backdrop-blur-sm text-sm text-[#9CA3AF]">
              <Feature.icon className="w-4 h-4 text-[#4C6EF5]" />
              {Feature.label}
            </div>
          ))}
        </motion.div>
      </div>

      {/* ─── FEATURES SECTION ─── */}
      <section id="features" className="py-28 px-4 relative z-10">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <span className="inline-block text-xs uppercase tracking-[0.2em] font-semibold text-[#4C6EF5] mb-4">Features</span>
            <h2 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
              Everything you need to{" "}
              <span className="text-[#9CA3AF] font-normal">master your money</span>
            </h2>
            <p className="text-[#6B7280] max-w-xl mx-auto">
              Built for students and young professionals who want clarity over their cash — no spreadsheets, no complexity.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-[#1F2A3D] rounded-2xl overflow-hidden border border-[#1F2A3D]">
            {[
              {
                Icon: TrendingUp,
                title: "Income & Expense Tracking",
                desc: "Log every transaction in seconds — amount, category, date, description. Both income and expenses covered.",
                accent: "#10B981",
              },
              {
                Icon: BarChart2,
                title: "Visual Dashboard",
                desc: "See your net balance, monthly cashflow, and a spending breakdown by category — updated in real time.",
                accent: "#4C6EF5",
              },
              {
                Icon: SlidersHorizontal,
                title: "Smart Filters",
                desc: "Filter by keyword, type, category, or any date range. Stack them all at once or clear in one click.",
                accent: "#F59E0B",
              },
              {
                Icon: RefreshCcw,
                title: "Instant Updates",
                desc: "Changes reflect immediately before the server confirms. No spinners, no waiting — it just works.",
                accent: "#8B5CF6",
              },
              {
                Icon: Lock,
                title: "Your Data, Only Yours",
                desc: "Row Level Security on every table means no other user can ever read or write your transactions.",
                accent: "#EF4444",
              },
              {
                Icon: LayoutDashboard,
                title: "Works on Any Device",
                desc: "Sidebar on desktop, icon rail on tablet, bottom tabs on mobile — the layout adapts to wherever you are.",
                accent: "#2DD4BF",
              },
            ].map(({ Icon, title, desc, accent }, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.45, delay: i * 0.06 }}
                className="bg-[#0A0D14] p-8 group hover:bg-[#0f1520] transition-colors duration-200"
              >
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center mb-5"
                  style={{ background: `${accent}18` }}
                >
                  <Icon className="w-[18px] h-[18px]" style={{ color: accent }} strokeWidth={1.8} />
                </div>
                <h3 className="font-semibold text-[#F9FAFB] mb-2 leading-snug">{title}</h3>
                <p className="text-[#6B7280] text-sm leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS SECTION ─── */}
      <section id="how-it-works" className="py-28 px-4 relative z-10">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <span className="inline-block text-xs uppercase tracking-[0.2em] font-semibold text-[#2DD4BF] mb-4">How it works</span>
            <h2 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
              Up and running in{" "}
              <span className="text-[#9CA3AF] font-normal">under 60 seconds</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[
              {
                step: 1,
                title: "Create your free account",
                desc: "Sign up with just your email and password. No credit card, no phone number — you're in immediately.",
              },
              {
                step: 2,
                title: "Add your first transaction",
                desc: "Pick income or expense, select a category, enter an amount and date. The whole thing takes about five seconds.",
              },
              {
                step: 3,
                title: "Watch your dashboard update",
                desc: "Your balance, charts, and recent transactions reflect every entry the moment you save it.",
              },
              {
                step: 4,
                title: "Filter and understand your spending",
                desc: "Drill into any period or category to see exactly where your money is going and spot patterns quickly.",
              },
            ].map(({ step, title, desc }, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.45, delay: i * 0.08 }}
                className="flex gap-5 items-start bg-[#111827] border border-[#1F2A3D] rounded-2xl p-6 hover:border-[#2a3a56] transition-colors"
              >
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#1F2A3D] flex items-center justify-center text-sm font-bold text-[#4C6EF5] mt-0.5">
                  {step}
                </div>
                <div>
                  <h3 className="font-semibold text-[#F9FAFB] mb-1.5">{title}</h3>
                  <p className="text-[#6B7280] text-sm leading-relaxed">{desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>


      {/* ─── AUTH SECTION ─── */}
      <div ref={authSectionRef} className="py-24 px-4 flex items-center justify-center relative z-10 min-h-screen">
        <div className="absolute inset-0 bg-[#0A0D14] z-[-1] [mask-image:linear-gradient(to_bottom,transparent,black_20%,black_80%,transparent)]" />
        
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="w-full max-w-lg md:max-w-xl mx-auto"
        >
          <div className="flex flex-col items-center mb-10 text-center">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-3 text-white">
              {tab === "login" ? "Welcome back" : "Create your account"}
            </h2>
            <p className="text-[#9CA3AF] text-base sm:text-lg max-w-md leading-relaxed">
              {tab === "login" ? "Enter your details to access your dashboard" : "Join thousands mastering their money"}
            </p>
          </div>

          <div className="bg-[#111827]/80 backdrop-blur-xl border border-[#1F2A3D] rounded-2xl shadow-2xl overflow-hidden relative">
            {/* Top border glow */}
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#4C6EF5] to-transparent opacity-50" />

            {/* Tab switcher */}
            <div className="flex border-b border-[#1F2A3D]">
              {(["login", "signup"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={`flex-1 py-5 text-base sm:text-lg font-semibold capitalize transition-all duration-200 relative ${
                    tab === t
                      ? "text-white"
                      : "text-[#9CA3AF] hover:text-[#F9FAFB]"
                  }`}
                >
                  {t === "login" ? "Sign In" : "Sign Up"}
                  {tab === t && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#4C6EF5]"
                    />
                  )}
                </button>
              ))}
            </div>

            {/* Form */}
            <form
              onSubmit={tab === "login" ? handleLogin : handleSignup}
              className="p-8 sm:p-10 space-y-6"
            >
              <div>
                <label className="block text-sm sm:text-base font-semibold text-[#9CA3AF] mb-2">
                  Email Address
                </label>
                <Input
                  type="email"
                  placeholder="example@fintrack.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#0A0D14]/50 border-[#1F2A3D] focus:border-[#4C6EF5] transition-colors py-4 px-5 text-base sm:text-lg rounded-xl h-14"
                  autoComplete="email"
                />
              </div>

              <div>
                <label className="block text-sm sm:text-base font-semibold text-[#9CA3AF] mb-2">
                  Password
                </label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pr-14 bg-[#0A0D14]/50 border-[#1F2A3D] focus:border-[#4C6EF5] transition-colors py-4 px-5 text-base sm:text-lg rounded-xl h-14"
                    autoComplete={tab === "login" ? "current-password" : "new-password"}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#4B5563] hover:text-[#9CA3AF] transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-6 h-6" /> : <Eye className="w-6 h-6" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full mt-6 py-4 text-base sm:text-lg font-bold shadow-lg shadow-[#4C6EF520] h-14 rounded-xl"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    {tab === "login" ? "Authenticating..." : "Creating Account..."}
                  </span>
                ) : tab === "login" ? "Sign In to Dashboard" : "Create Free Account"}
              </Button>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
