"use client"

import { useEffect, useState } from "react"
import { Bell, Search, Menu, ChevronDown, Settings, User, LogOut } from "lucide-react"
import { useRouter } from "next/navigation"
import Cookies from "js-cookie"
import { getUser } from "@/hooks/getUser"

// user role indicators removed

export default function Header({ onToggleSidebar }: { onToggleSidebar?: () => void }) {
  const [showNotifications, setShowNotifications] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [searchFocused, setSearchFocused] = useState(false)
  const [user, setUser] = useState<any>(null)
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

  const roleName = (code?: number) => {
    const map: Record<number, string> = {
      1: "superadmin",
      2: "admin",
      3: "interviewer",
      4: "preinterview examiner",
      5: "biometric",
      6: "physical document",
    }
    return (code && map[code]) || "user"
  }

  const roleColor = (code?: number) => {
    const map: Record<number, string> = {
      1: "from-blue-500 to-blue-600",
      2: "from-slate-500 to-slate-600",
      3: "from-violet-500 to-violet-600",
      4: "from-indigo-500 to-indigo-600",
      5: "from-emerald-500 to-emerald-600",
      6: "from-amber-500 to-amber-600",
    }
    return (code && map[code]) || "from-slate-500 to-slate-600"
  }

  const notifications = [
    { id: 1, text: "New candidate registered", time: "2m ago", unread: true },
    { id: 2, text: "Interview completed for Roll-2025-001", time: "15m ago", unread: true },
    { id: 3, text: "Biometric verification failed", time: "1h ago", unread: false },
  ]

  const unreadCount = notifications.filter(n => n.unread).length

  return (
    <header className="sticky top-0 z-50 flex h-16 items-center gap-4 border-b border-slate-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 px-6 shadow-sm">
      {/* Left section - Search */}
      <div className="flex flex-1 items-center gap-4">
        <button
          onClick={() => onToggleSidebar?.()}
          className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          aria-label="Toggle menu"
        >
          <Menu className="h-5 w-5 text-slate-600" />
        </button>
      </div>

      {/* Right section */}
      <div className="flex items-center gap-3">
        {/* Role Badge */}
        {/* {user?.user_type_id && (
          <div className={`hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gradient-to-r ${roleColor(user.user_type_id)} text-white shadow-md`}>
            <span className="text-xs font-semibold">{user.user_full_name}</span>
          </div>
        )} */}

        {/* Divider */}
        <div className="h-8 w-px bg-slate-200" />

        {/* User Profile */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-3 px-3 py-2 hover:bg-slate-100 rounded-xl transition-all duration-200 group"
          >
            <div className="relative">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 overflow-hidden border-2 border-white shadow-md">
                {/* Avatar placeholder */}
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 bg-emerald-500 border-2 border-white rounded-full" />
            </div>
            <div className="hidden md:block text-left">
              <p className="text-sm font-semibold text-slate-900">{user?.user_full_name || "User"}</p>
              <p className="text-xs text-slate-500">{user?.user_contact_number || "Signed in"}</p>
            </div>
            <ChevronDown className="hidden md:block h-4 w-4 text-slate-400 group-hover:text-slate-600 transition-colors" />
          </button>

          {/* User Menu Dropdown */}
          {showUserMenu && (
            <>
              <div 
                className="fixed inset-0 z-40" 
                onClick={() => setShowUserMenu(false)}
              />
              <div className="absolute right-0 mt-2 w-56 rounded-xl border border-slate-200 bg-white shadow-2xl z-50 overflow-hidden">
                <div className="border-b border-slate-200 bg-gradient-to-r from-slate-50 to-white px-4 py-3">
                  <p className="font-semibold text-slate-900 text-sm">{user?.user_full_name || "User"}</p>
                  <p className="text-xs text-slate-500">{user?.user_type_name}</p>
                </div>
                {/* <div className="py-2">
                  <button className="flex items-center gap-3 w-full px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors">
                    <User className="h-4 w-4 text-slate-500" />
                    Profile Settings
                  </button>
                  <button className="flex items-center gap-3 w-full px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors">
                    <Settings className="h-4 w-4 text-slate-500" />
                    Preferences
                  </button>
                </div> */}
                <div className="border-t border-slate-200 py-2">
                  <button 
                    onClick={() => {
                      setShowUserMenu(false)
                      logout()
                    }}
                    className="flex items-center gap-3 w-full px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 transition-colors font-medium"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  )
}