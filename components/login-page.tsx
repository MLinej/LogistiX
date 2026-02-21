"use client"

import { useState } from "react"
import { useApp } from "@/lib/app-context"
import type { Role } from "@/lib/mock-data"
import { Radio, ShieldCheck, BarChart3, Truck, ChevronDown } from "lucide-react"
import Image from "next/image"

const roles: Role[] = ["Fleet Manager", "Dispatcher", "Safety Officer", "Financial Analyst"]

const features = [
  { icon: Radio, label: "Fleet monitoring" },
  { icon: ShieldCheck, label: "Driver compliance" },
  { icon: BarChart3, label: "Fuel efficiency" },
  { icon: Truck, label: "Automated alerts" },
]

export function LoginPage() {
  const { login } = useApp()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState<Role>("Fleet Manager")
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({})
  const [roleOpen, setRoleOpen] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newErrors: { email?: string; password?: string } = {}
    if (!email) newErrors.email = "Email is required"
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = "Invalid email format"
    if (!password) newErrors.password = "Password is required"
    else if (password.length < 4) newErrors.password = "Password must be at least 4 characters"
    setErrors(newErrors)
    if (Object.keys(newErrors).length === 0) {
      login(email, role)
    }
  }

  return (
    <div className="flex min-h-screen">
      {/* Left panel */}
      <div className="hidden lg:flex w-1/2 bg-[#0a0a0a] flex-col justify-center px-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a0a] via-[#111] to-[#1a1a0f] opacity-100" />
        <div className="relative z-10 animate-fade-in-up">
          <div className="flex items-center gap-3 mb-10">
            <Image
              src="/images/logistix-logo.png"
              alt="LogistiX logo"
              width={36}
              height={36}
              className="rounded-xl"
            />
            <span className="text-2xl font-bold text-white tracking-tight">LogistiX</span>
          </div>
          <h1 className="text-4xl font-bold text-white leading-tight mb-3 text-balance">
            Operational Intelligence for Modern Logistics
          </h1>
          <p className="text-[#9ca3af] text-base mb-10 max-w-md leading-relaxed">
            Unified fleet management platform for enterprises that move goods at scale.
          </p>
          <div className="flex flex-col gap-4">
            {features.map((f, i) => (
              <div
                key={f.label}
                className={`flex items-center gap-3 animate-fade-in-up-delay-${i + 1}`}
              >
                <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-[#1a1a1a] border border-[#2a2a2a]">
                  <f.icon className="w-4 h-4 text-[#f59e0b]" />
                </div>
                <span className="text-[#d1d5db] text-sm font-medium">{f.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center bg-[#f7f8fa] px-6">
        <div className="w-full max-w-md animate-fade-in-up">
          {/* Mobile logo */}
          <div className="flex items-center gap-3 mb-8 lg:hidden">
            <Image
              src="/images/logistix-logo.png"
              alt="LogistiX logo"
              width={32}
              height={32}
              className="rounded-xl"
            />
            <span className="text-xl font-bold text-[#111] tracking-tight">LogistiX</span>
          </div>

          <div className="bg-white rounded-2xl shadow-[0_2px_20px_rgba(0,0,0,0.06)] p-8 border border-[#f0f0f0]">
            <h2 className="text-xl font-semibold text-[#111] mb-1">Welcome back</h2>
            <p className="text-sm text-[#6b7280] mb-6">Sign in to your logistics dashboard</p>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-[#111] mb-1.5">Email</label>
                <input
                  id="email"
                  type="email"
                  placeholder="name@company.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full h-10 px-3 rounded-lg border border-[#e5e7eb] bg-white text-sm text-[#111] placeholder:text-[#9ca3af] focus:border-[#f59e0b] focus:ring-2 focus:ring-[#f59e0b]/20 outline-none transition-all"
                />
                {errors.email && <p className="text-xs text-[#ef4444] mt-1">{errors.email}</p>}
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-[#111] mb-1.5">Password</label>
                <input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full h-10 px-3 rounded-lg border border-[#e5e7eb] bg-white text-sm text-[#111] placeholder:text-[#9ca3af] focus:border-[#f59e0b] focus:ring-2 focus:ring-[#f59e0b]/20 outline-none transition-all"
                />
                {errors.password && <p className="text-xs text-[#ef4444] mt-1">{errors.password}</p>}
              </div>

              <div className="relative">
                <label htmlFor="role" className="block text-sm font-medium text-[#111] mb-1.5">Role</label>
                <button
                  type="button"
                  id="role"
                  onClick={() => setRoleOpen(!roleOpen)}
                  className="w-full h-10 px-3 rounded-lg border border-[#e5e7eb] bg-white text-sm text-[#111] flex items-center justify-between focus:border-[#f59e0b] focus:ring-2 focus:ring-[#f59e0b]/20 outline-none transition-all"
                >
                  {role}
                  <ChevronDown className={`w-4 h-4 text-[#6b7280] transition-transform ${roleOpen ? "rotate-180" : ""}`} />
                </button>
                {roleOpen && (
                  <div className="absolute top-full left-0 w-full mt-1 bg-white rounded-lg border border-[#e5e7eb] shadow-lg z-50 overflow-hidden">
                    {roles.map(r => (
                      <button
                        key={r}
                        type="button"
                        onClick={() => { setRole(r); setRoleOpen(false) }}
                        className={`w-full px-3 py-2.5 text-sm text-left hover:bg-[#f7f8fa] transition-colors ${r === role ? "bg-[#f7f8fa] text-[#f59e0b] font-medium" : "text-[#111]"}`}
                      >
                        {r}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <button
                type="submit"
                className="w-full h-10 mt-2 bg-[#111] text-white text-sm font-medium rounded-lg hover:bg-[#222] hover:shadow-lg hover:scale-[1.01] active:scale-[0.99] transition-all"
              >
                Sign In
              </button>
            </form>
          </div>
          <p className="text-xs text-[#9ca3af] text-center mt-5">
            {"Demo mode — select any role to explore the dashboard"}
          </p>
        </div>
      </div>
    </div>
  )
}
