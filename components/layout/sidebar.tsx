"use client"
import {
  LayoutDashboard, Users, FileCheck, ClipboardList,
  Settings, ShieldCheck, LogOut, ChevronRight, UserCheck
} from "lucide-react"
import { usePathname, useRouter } from "next/navigation"
import Cookies from "js-cookie"
import { useState } from "react"

// Icon mapping
const ICON_MAP = {
  LayoutDashboard,
  Users,
  FileCheck,
  ClipboardList,
  Settings,
  ShieldCheck,
  UserCheck,
}

// Menu configuration with role-based access
const ALL_MENU_ITEMS = [
  {
    name: "Dashboard",
    href: "/",
    icon: "LayoutDashboard",
    allowedRoleIds: [1, 2, 3, 4, 5],
    color: "blue"
  },
  {
    name: "Candidates",
    href: "/candidates",
    icon: "Users",
    allowedRoleIds: [1, 4, 5],
    color: "emerald"
  },
  {
    name: "Interviewers",
    href: "/interviewers",
    icon: "UserCheck",
    allowedRoleIds: [1, 5],
    color: "cyan"
  },
  {
    name: "Biometric Verification",
    href: "/verification/biometric",
    icon: "ShieldCheck",
    allowedRoleIds: [1, 2],
    color: "amber"
  },
  {
    name: "Document Verification",
    href: "/verification/document",
    icon: "FileCheck",
    allowedRoleIds: [1, 3],
    color: "violet"
  },
  {
    name: "Pre-Interview",
    href: "/pre-interview",
    icon: "ClipboardList",
    allowedRoleIds: [1, 4],
    color: "indigo"
  },
  {
    name: "Interviews",
    href: "/interviews",
    icon: "ClipboardList",
    allowedRoleIds: [1, 5],
    color: "violet"
  },
  {
    name: "Reports",
    href: "/reports",
    icon: "FileCheck",
    allowedRoleIds: [1],
    color: "indigo"
  },
  {
    name: "Settings",
    href: "/settings",
    icon: "Settings",
    allowedRoleIds: [1],
    color: "slate"
  },
]

// Role names for display
const ROLE_NAMES = {
  1: "System Administrator",
  2: "Biometric Verifier",
  3: "Document Verifier",
  4: "Pre-Interview Examiner",
  5: "Panel Member",
}

// Filter function
function getFilteredMenuItems(userRoleId) {
  return ALL_MENU_ITEMS.filter(item =>
    item.allowedRoleIds.includes(userRoleId)
  )
}

export default function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()

  // Demo: You can change this to test different roles (1-5)
  const [userRoleId, setUserRoleId] = useState(1)

  const logout = () => {
    Cookies.remove("access_token")
    router.push("/")
  }

  // Filter menu items based on user role
  const filteredNavigation = getFilteredMenuItems(userRoleId)

  const getColorClasses = (color, isActive) => {
    const colors = {
      blue: {
        bg: isActive ? "bg-gradient-to-r from-blue-500 to-blue-600" : "",
        hover: "hover:bg-blue-50",
        icon: isActive ? "text-white" : "text-blue-600"
      },
      emerald: {
        bg: isActive ? "bg-gradient-to-r from-emerald-500 to-emerald-600" : "",
        hover: "hover:bg-emerald-50",
        icon: isActive ? "text-white" : "text-emerald-600"
      },
      cyan: {
        bg: isActive ? "bg-gradient-to-r from-cyan-500 to-cyan-600" : "",
        hover: "hover:bg-cyan-50",
        icon: isActive ? "text-white" : "text-cyan-600"
      },
      amber: {
        bg: isActive ? "bg-gradient-to-r from-amber-500 to-amber-600" : "",
        hover: "hover:bg-amber-50",
        icon: isActive ? "text-white" : "text-amber-600"
      },
      violet: {
        bg: isActive ? "bg-gradient-to-r from-violet-500 to-violet-600" : "",
        hover: "hover:bg-violet-50",
        icon: isActive ? "text-white" : "text-violet-600"
      },
      indigo: {
        bg: isActive ? "bg-gradient-to-r from-indigo-500 to-indigo-600" : "",
        hover: "hover:bg-indigo-50",
        icon: isActive ? "text-white" : "text-indigo-600"
      },
      slate: {
        bg: isActive ? "bg-gradient-to-r from-slate-600 to-slate-700" : "",
        hover: "hover:bg-slate-50",
        icon: isActive ? "text-white" : "text-slate-600"
      },
    }
    return colors[color] || colors.blue
  }

  return (
    <div className="flex h-screen w-64 flex-col bg-white border-r border-slate-200 shadow-lg">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-slate-200 px-6 py-5">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white font-bold text-lg shadow-md">
          I
        </div>
        <div className="flex-1">
          <h1 className="text-lg font-bold text-slate-800">IMS Portal</h1>
          <p className="text-xs text-slate-500">Interview Management</p>
        </div>
      </div>

      {/* Role Selector (Demo purposes - remove in production) */}
      <div className="px-4 py-3 bg-slate-50 border-b border-slate-200">
        <label className="text-xs font-semibold text-slate-600 mb-1 block">
          Demo: Select Role
        </label>
        <select
          value={userRoleId}
          onChange={(e) => setUserRoleId(Number(e.target.value))}
          className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {Object.entries(ROLE_NAMES).map(([id, name]) => (
            <option key={id} value={id}>
              {name}
            </option>
          ))}
        </select>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {filteredNavigation.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)
          const colors = getColorClasses(item.color, isActive)
          const Icon = ICON_MAP[item.icon]

          return (
            <button
              key={item.name}
              onClick={() => router.push(item.href)}
              className={`group relative w-full flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-200 ${isActive
                ? `${colors.bg} text-white shadow-lg`
                : `text-slate-700 ${colors.hover}`
                }`}
            >
              <Icon className={`h-5 w-5 ${colors.icon}`} />
              <span className="flex-1 text-left">{item.name}</span>
              {isActive && (
                <ChevronRight className="h-4 w-4 text-white" />
              )}
            </button>
          )
        })}
      </nav>

      {/* Quick Stats */}
      {/* <div className="border-t border-slate-200 px-4 py-4">
        <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
          Today's Activity
        </h3>
        <div className="space-y-2">
          {[
            { label: "Active Panels", value: "12" },
            { label: "Completed", value: "48" },
            { label: "Pending", value: "23" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2"
            >
              <span className="text-xs text-slate-600">{stat.label}</span>
              <span className="text-sm font-bold text-slate-800">{stat.value}</span>
            </div>
          ))}
        </div>
      </div> */}

      {/* User Profile Section */}
      {/* <div className="border-t border-slate-200 p-4">
        <div className="flex items-center gap-3 rounded-lg bg-slate-50 p-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-white font-semibold text-sm">
            U
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-slate-800 truncate">User</p>
            <p className="text-xs text-slate-500">{ROLE_NAMES[userRoleId]}</p>
          </div>
        </div>

        <button
          onClick={logout}
          className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-600 transition-colors hover:bg-red-100"
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </button>
      </div> */}
    </div>
  )
}