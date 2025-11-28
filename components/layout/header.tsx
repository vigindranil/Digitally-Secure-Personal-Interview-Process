"use client"

import { useState } from "react"
import { Bell, Search, Menu, ChevronDown, Settings, User, LogOut } from "lucide-react"
import { useRouter } from "next/navigation"
import Cookies from "js-cookie"

// user role indicators removed

export default function Header() {
  const [showNotifications, setShowNotifications] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [searchFocused, setSearchFocused] = useState(false)
  const router = useRouter()
  const logout = () => {
    Cookies.remove("access_token")
    Cookies.remove("user_info")
    router.push("/")
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
        <button className="lg:hidden p-2 hover:bg-slate-100 rounded-lg transition-colors">
          <Menu className="h-5 w-5 text-slate-600" />
        </button>
        
        <div className={`relative w-full max-w-md transition-all duration-200 ${searchFocused ? 'max-w-lg' : ''}`}>
          <Search className={`absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 transition-colors ${searchFocused ? 'text-blue-500' : 'text-slate-400'}`} />
          <input
            type="search"
            placeholder="Search candidates, roll numbers, panels..."
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            className={`w-full h-10 pl-10 pr-4 rounded-xl border-2 transition-all duration-200 text-sm bg-slate-50 text-slate-900 placeholder:text-slate-400 focus:outline-none ${
              searchFocused 
                ? 'border-blue-500 bg-white shadow-lg shadow-blue-100' 
                : 'border-slate-200 hover:border-slate-300'
            }`}
          />
        </div>
      </div>

      {/* Right section */}
      <div className="flex items-center gap-3">
        {/* Role Badge removed */}

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 hover:bg-slate-100 rounded-xl transition-all duration-200 group"
          >
            <Bell className="h-5 w-5 text-slate-600 group-hover:text-slate-900 transition-colors" />
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-br from-red-500 to-rose-500 text-[10px] font-bold text-white shadow-lg">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <>
              <div 
                className="fixed inset-0 z-40" 
                onClick={() => setShowNotifications(false)}
              />
              <div className="absolute right-0 mt-2 w-80 rounded-xl border border-slate-200 bg-white shadow-2xl z-50 overflow-hidden">
                <div className="border-b border-slate-200 bg-gradient-to-r from-slate-50 to-white px-4 py-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-slate-900">Notifications</h3>
                    {unreadCount > 0 && (
                      <span className="px-2 py-0.5 text-xs font-bold text-blue-700 bg-blue-50 rounded-full border border-blue-100">
                        {unreadCount} new
                      </span>
                    )}
                  </div>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications.map((notif) => (
                    <div
                      key={notif.id}
                      className={`px-4 py-3 hover:bg-slate-50 transition-colors border-b border-slate-100 last:border-0 ${
                        notif.unread ? 'bg-blue-50/50' : ''
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        {notif.unread && (
                          <div className="mt-2 h-2 w-2 rounded-full bg-blue-500 flex-shrink-0" />
                        )}
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm ${notif.unread ? 'font-semibold text-slate-900' : 'text-slate-600'}`}>
                            {notif.text}
                          </p>
                          <p className="text-xs text-slate-500 mt-1">{notif.time}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="border-t border-slate-200 bg-slate-50 px-4 py-2">
                  <button className="text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors">
                    View all notifications →
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

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
              <p className="text-sm font-semibold text-slate-900">User</p>
              <p className="text-xs text-slate-500">Signed in</p>
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
                  <p className="font-semibold text-slate-900 text-sm">User</p>
                  <p className="text-xs text-slate-500">Active session</p>
                </div>
                <div className="py-2">
                  <button className="flex items-center gap-3 w-full px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors">
                    <User className="h-4 w-4 text-slate-500" />
                    Profile Settings
                  </button>
                  <button className="flex items-center gap-3 w-full px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors">
                    <Settings className="h-4 w-4 text-slate-500" />
                    Preferences
                  </button>
                </div>
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