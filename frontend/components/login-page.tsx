"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { signIn } from "@/lib/auth"
import { Radio, ShieldCheck, BarChart3, Truck } from "lucide-react"
import Image from "next/image"

const features = [
  { icon: Radio, label: "Fleet monitoring" },
  { icon: ShieldCheck, label: "Driver compliance" },
  { icon: BarChart3, label: "Fuel efficiency" },
  { icon: Truck, label: "Automated alerts" },
]

export function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [errors, setErrors] = useState<{ email?: string; password?: string; general?: string }>({})
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log("SUBMIT FIRED", email, password)
    const newErrors: { email?: string; password?: string } = {}
    if (!email) newErrors.email = "Email is required"
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = "Invalid email format"
    if (!password) newErrors.password = "Password is required"
    else if (password.length < 4) newErrors.password = "Password must be at least 4 characters"
    setErrors(newErrors)
    if (Object.keys(newErrors).length > 0) return

    setLoading(true)
    try {
      console.log("CALLING API...")
      await signIn(email, password)
      console.log("LOGIN SUCCESS")
      window.location.href = "/"
    } catch (err: any) {
      console.log("LOGIN ERROR", err)
      setErrors({ general: err.response?.data?.error || "Invalid email or password." })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen">
      <div className="hidden lg:flex w-1/2 bg-[#0a0a0a] flex-col justify-center px-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a0a] via-[#111] to-[#1a1a0f]" />
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-10">
            <Image src="/images/logistix-logo.png" alt="LogistiX logo" width={36} height={36} className="rounded-xl" />
            <span className="text-2xl font-bold text-white tracking-tight">LogistiX</span>
          </div>
          <h1 className="text-4xl font-bold text-white leading-tight mb-3">
            Operational Intelligence for Modern Logistics
          </h1>
          <p className="text-[#9ca3af] text-base mb-10 max-w-md leading-relaxed">
            Unified fleet management platform for enterprises that move goods at scale.
          </p>
          <div className="flex flex-col gap-4">
            {features.map((f) => (
              <div key={f.label} className="flex items-center gap-3">
                <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-[#1a1a1a] border border-[#2a2a2a]">
                  <f.icon className="w-4 h-4 text-[#f59e0b]" />
                </div>
                <span className="text-[#d1d5db] text-sm font-medium">{f.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center bg-[#f7f8fa] px-6">
        <div className="w-full max-w-md">
          <div className="flex items-center gap-3 mb-8 lg:hidden">
            <Image src="/images/logistix-logo.png" alt="LogistiX logo" width={32} height={32} className="rounded-xl" />
            <span className="text-xl font-bold text-[#111] tracking-tight">LogistiX</span>
          </div>

          <div className="bg-white rounded-2xl shadow-[0_2px_20px_rgba(0,0,0,0.06)] p-8 border border-[#f0f0f0]">
            <h2 className="text-xl font-semibold text-[#111] mb-1">Welcome back</h2>
            <p className="text-sm text-[#6b7280] mb-6">Sign in to your logistics dashboard</p>

            {errors.general && (
              <div className="mb-4 px-3 py-2 rounded-lg bg-[#fef2f2] border border-[#fecaca] text-sm text-[#ef4444]">
                {errors.general}
              </div>
            )}

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

              <button
                type="submit"
                disabled={loading}
                className="w-full h-10 mt-2 bg-[#111] text-white text-sm font-medium rounded-lg hover:bg-[#222] hover:shadow-lg hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? "Signing in..." : "Sign In"}
              </button>
            </form>
          </div>
          <p className="text-xs text-[#9ca3af] text-center mt-5">
            LogistiX — Fleet Intelligence Platform
          </p>
        </div>
      </div>
    </div>
  )
}