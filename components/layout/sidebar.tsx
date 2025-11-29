"use client"

import { useEffect, useState } from "react"
import { LayoutDashboard, Users, FileCheck, ClipboardList, Settings, ShieldCheck, LogOut, ChevronRight, UserCheck, X } from "lucide-react"
import { usePathname, useRouter } from "next/navigation"
import Cookies from "js-cookie"
import { getUser } from "@/hooks/getUser"

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard, allowed: [1,2,3,4,5,6], color: "blue" },
  { name: "Candidates", href: "/candidates", icon: Users, allowed: [2,3,4], color: "emerald" },
  { name: "Interviewers", href: "/interviewers", icon: UserCheck, allowed: [1,3], color: "cyan" },
  { name: "Biometric Verification", href: "/verification", icon: ShieldCheck, allowed: [5], color: "amber" },
  { name: "Document Verification", href: "/verification", icon: FileCheck, allowed: [6], color: "violet" },
  { name: "Pre-Interview", href: "/pre-interview", icon: ClipboardList, allowed: [4], color: "indigo" },
  { name: "Interviews", href: "/interviews", icon: ClipboardList, allowed: [3], color: "violet" },
  { name: "Reports", href: "/reports", icon: FileCheck, allowed: [1,2], color: "indigo" },
  { name: "Settings", href: "/settings", icon: Settings, allowed: [1,2], color: "slate" },
]

// role display helpers removed

export default function Sidebar({ mobileOpen = false, onClose }: { mobileOpen?: boolean; onClose?: () => void }) {
  const [user, setUser] = useState<any>(null)
  const pathname = usePathname()
  const router = useRouter()
  const logout = () => {
    Cookies.remove("access_token")
    Cookies.remove("user_info")
    router.push("/")
  }

  useEffect(() => {
    ;(async () => {
      const u = await getUser()
      setUser(u)
    })()
  }, [])


  

  const filteredNavigation = navigation.filter((item) => {
    const code = user?.user_type_id
    if (!code) return false
    return item.allowed.includes(code)
  })

  const getColorClasses = (color: string, isActive: boolean) => {
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
    return colors[color as keyof typeof colors] || colors.blue
  }

  return (
    <>
      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-black/40 md:hidden" onClick={onClose} />
      )}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-72 transform transition-transform duration-200 md:static md:translate-x-0 md:h-screen flex flex-col bg-white border-r border-slate-200 shadow-lg ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
      {/* Header */}
      <div className="flex h-20 items-center border-b border-slate-200 px-6 bg-gradient-to-r from-slate-50 to-white">
        <div className="flex items-center gap-3 flex-1">
          <div className="relative">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-lg">I</span>
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 bg-emerald-500 border-2 border-white rounded-full"></div>
          </div>
          <div>
            <span className="font-bold text-lg text-slate-900">IMS Portal</span>
            <p className="text-xs text-slate-500">Interview Management</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="md:hidden p-2 rounded-lg hover:bg-slate-100 text-slate-600"
          aria-label="Close sidebar"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-6">
        <nav className="space-y-1 px-4">
          {filteredNavigation.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)
            const colors = getColorClasses(item.color, isActive)
            const Icon = item.icon

            return (
              <button
                key={item.name}
                onClick={() => {
                  router.push(item.href)
                  onClose?.()
                }}
                className={`group relative w-full flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-200 ${isActive
                  ? `${colors.bg} text-white shadow-lg`
                  : `text-slate-700 ${colors.hover}`
                  }`}
              >
                <div className={`flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center transition-all ${isActive ? "bg-white/20" : "bg-slate-100 group-hover:bg-white"
                  }`}>
                  <Icon className={`h-5 w-5 ${isActive ? "text-white" : colors.icon}`} />
                </div>
                <span className="flex-1 text-left">{item.name}</span>
                {isActive && (
                  <ChevronRight className="h-4 w-4 text-white" />
                )}
              </button>
            )
          })}
        </nav>

        {/* Quick Stats */}
        <div className="mx-4 mt-6 p-4 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100">
          <p className="text-xs font-semibold text-slate-600 mb-3">Today's Activity</p>
          <div className="space-y-2">
            {[
              { label: "Active Panels", value: "12" },
              { label: "Completed", value: "48" },
              { label: "Pending", value: "23" },
            ].map((stat) => (
              <div key={stat.label} className="flex items-center justify-between">
                <span className="text-xs text-slate-600">{stat.label}</span>
                <span className="text-sm font-bold text-slate-900">{stat.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* User Profile Section */}
      <div className="border-t border-slate-200 bg-gradient-to-r from-slate-50 to-white">
        <div className="p-4 space-y-3">
          {/* User Info */}
          <div className="flex items-center gap-3 p-3 rounded-xl bg-white border border-slate-200 shadow-sm">
            <div className="relative flex-shrink-0">
              <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 overflow-hidden border-2 border-white shadow-md">
                {/* Avatar placeholder */}
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 bg-emerald-500 border-2 border-white rounded-full"></div>
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="font-semibold text-sm text-slate-900 truncate">{user?.user_full_name || "User"}</p>
              <p className="text-xs text-slate-500 truncate">{user?.department_name || "Active session"}</p>
            </div>
          </div>

          {/* Role Badge */}
          {user?.user_type_id && (
            <div className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-blue-50 border border-blue-100">
              <ShieldCheck className="h-3.5 w-3.5 text-blue-600" />
              <span className="text-xs font-semibold text-blue-700 uppercase">{(user.user_type_id===1&&"superadmin")||(user.user_type_id===2&&"admin")||(user.user_type_id===3&&"interviewer")||(user.user_type_id===4&&"preinterview examiner")||(user.user_type_id===5&&"biometric")||(user.user_type_id===6&&"physical document")||"user"}</span>
            </div>
          )}

          {/* Sign Out Button */}
          <button
            onClick={logout}
            className="flex w-full items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-all duration-200 border border-slate-200 hover:border-slate-300"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </button>
        </div>
      </div>
      </div>
    </>
  )
}