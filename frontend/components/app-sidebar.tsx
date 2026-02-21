"use client"

import { useApp } from "@/lib/app-context"
import {
  LayoutDashboard,
  Truck,
  Route,
  Users,
  Wrench,
  BarChart3,
  LogOut,
  Menu,
  X,
} from "lucide-react"
import { useState } from "react"
import Image from "next/image"

const allMenuItems = [
  { label: "Command Center", icon: LayoutDashboard },
  { label: "Vehicle Registry", icon: Truck },
  { label: "Trip Dispatcher", icon: Route },
  { label: "Driver Profiles", icon: Users },
  { label: "Maintenance & Fuel", icon: Wrench },
  { label: "Analytics & Reports", icon: BarChart3 },
]

export function AppSidebar() {
  const { user, logout, permissions, activePage, setActivePage } = useApp()
  const [mobileOpen, setMobileOpen] = useState(false)

  if (!user || !permissions) return null

  const visibleItems = allMenuItems.filter(item =>
    permissions.sidebarItems.includes(item.label)
  )

  const sidebarContent = (
    <div className="flex flex-col h-full bg-[#0a0a0a] text-[#e5e7eb]">
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 h-16 border-b border-[#1f1f1f] shrink-0">
        <Image
          src="/images/logistix-logo.png"
          alt="LogistiX logo"
          width={32}
          height={32}
          className="rounded-lg"
        />
        <span className="text-base font-bold text-white tracking-tight">LogistiX</span>
      </div>

      {/* Nav items */}
      <nav className="flex-1 px-3 py-4 flex flex-col gap-0.5 overflow-y-auto">
        {visibleItems.map(item => {
          const isActive = activePage === item.label
          return (
            <button
              key={item.label}
              onClick={() => { setActivePage(item.label); setMobileOpen(false) }}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                isActive
                  ? "bg-[#f59e0b] text-[#111]"
                  : "text-[#9ca3af] hover:bg-[#1a1a1a] hover:text-white"
              }`}
            >
              <item.icon className="w-4 h-4 shrink-0" />
              {item.label}
            </button>
          )
        })}
      </nav>

      {/* User info */}
      <div className="px-4 py-4 border-t border-[#1f1f1f] shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#1f1f1f] flex items-center justify-center text-xs font-semibold text-[#f59e0b]">
            {user.email.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">{user.email.split("@")[0]}</p>
            <p className="text-xs text-[#6b7280] truncate">{user.role}</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="flex items-center gap-2 mt-3 px-3 py-2 rounded-lg text-xs font-medium text-[#6b7280] hover:bg-[#1a1a1a] hover:text-[#ef4444] w-full transition-all"
        >
          <LogOut className="w-3.5 h-3.5" />
          Sign out
        </button>
      </div>
    </div>
  )

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-[#0a0a0a] text-white shadow-lg"
        aria-label="Open menu"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
          <div className="relative w-64 h-full">
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute top-4 right-4 text-[#6b7280] hover:text-white z-10"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
            {sidebarContent}
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <aside className="hidden lg:block w-60 h-screen fixed left-0 top-0 z-40 shrink-0">
        {sidebarContent}
      </aside>
    </>
  )
}
