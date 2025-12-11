"use client"

import { useState } from "react"
import { Calendar, FileText, Briefcase, Users, UserPlus, ChevronDown, Menu, X } from "lucide-react"
import { useRouter, usePathname } from "next/navigation"

interface AdminMenuItem {
  name: string
  href: string
  icon: any
  color: string
  description: string
}

const adminMenuItems: AdminMenuItem[] = [
  {
    name: "Schedule Interview",
    href: "/schedule-interview",
    icon: Calendar,
    color: "blue",
    description: "Schedule new interview sessions"
  },
  {
    name: "Add Post Details",
    href: "/add-post",
    icon: FileText,
    color: "indigo",
    description: "Create new job postings"
  },
  {
    name: "Add Designation Details",
    href: "/add-designation",
    icon: Briefcase,
    color: "emerald",
    description: "Manage designations and roles"
  },
  {
    name: "Add Panel",
    href: "/add-panel",
    icon: Users,
    color: "purple",
    description: "Create interview panels"
  },
  {
    name: "Add Panel Member",
    href: "/add-panel-member",
    icon: UserPlus,
    color: "violet",
    description: "Assign members to panels"
  }
]

export default function AdminMenu() {
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  const getColorClasses = (color: string, isActive: boolean) => {
    const colors = {
      blue: {
        bg: isActive ? "bg-gradient-to-r from-blue-500 to-blue-600" : "",
        hover: "hover:bg-blue-50",
        border: "border-blue-200",
        text: isActive ? "text-white" : "text-blue-600"
      },
      indigo: {
        bg: isActive ? "bg-gradient-to-r from-indigo-500 to-indigo-600" : "",
        hover: "hover:bg-indigo-50",
        border: "border-indigo-200",
        text: isActive ? "text-white" : "text-indigo-600"
      },
      emerald: {
        bg: isActive ? "bg-gradient-to-r from-emerald-500 to-emerald-600" : "",
        hover: "hover:bg-emerald-50",
        border: "border-emerald-200",
        text: isActive ? "text-white" : "text-emerald-600"
      },
      purple: {
        bg: isActive ? "bg-gradient-to-r from-purple-500 to-purple-600" : "",
        hover: "hover:bg-purple-50",
        border: "border-purple-200",
        text: isActive ? "text-white" : "text-purple-600"
      },
      violet: {
        bg: isActive ? "bg-gradient-to-r from-violet-500 to-violet-600" : "",
        hover: "hover:bg-violet-50",
        border: "border-violet-200",
        text: isActive ? "text-white" : "text-violet-600"
      }
    }
    return colors[color as keyof typeof colors] || colors.blue
  }

  const handleMenuClick = (href: string) => {
    router.push(href)
    setIsOpen(false)
  }

  return (
    <div className="relative">
      {/* Desktop Menu - Horizontal */}
      <div className="hidden lg:flex items-center gap-2">
        {adminMenuItems.map((item) => {
          const isActive = pathname === item.href
          const colors = getColorClasses(item.color, isActive)
          const Icon = item.icon

          return (
            <button
              key={item.name}
              onClick={() => handleMenuClick(item.href)}
              className={`group relative flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 ${
                isActive 
                  ? `${colors.bg} text-white shadow-lg` 
                  : `bg-white text-slate-700 border ${colors.border} ${colors.hover} hover:shadow-md`
              }`}
            >
              <Icon className={`h-4 w-4 ${isActive ? "text-white" : colors.text}`} />
              <span>{item.name}</span>
            </button>
          )
        })}
      </div>

      {/* Mobile Menu Button */}
      <div className="lg:hidden">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 rounded-lg bg-white px-3 py-2 text-sm font-medium text-slate-700 border border-slate-200 hover:bg-slate-50 transition-all duration-200"
        >
          <Menu className="h-4 w-4" />
          <span>Admin Menu</span>
          <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden" 
            onClick={() => setIsOpen(false)} 
          />
          
          {/* Menu Panel */}
          <div className="absolute top-full left-0 right-0 mt-2 rounded-xl bg-white border border-slate-200 shadow-2xl z-50 lg:hidden min-w-[280px]">
            <div className="p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-slate-900">Admin Menu</h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 rounded hover:bg-slate-100"
                >
                  <X className="h-4 w-4 text-slate-500" />
                </button>
              </div>
              
              <div className="space-y-1">
                {adminMenuItems.map((item) => {
                  const isActive = pathname === item.href
                  const colors = getColorClasses(item.color, isActive)
                  const Icon = item.icon

                  return (
                    <button
                      key={item.name}
                      onClick={() => handleMenuClick(item.href)}
                      className={`w-full flex items-center gap-3 rounded-lg px-3 py-3 text-left transition-all duration-200 ${
                        isActive 
                          ? `${colors.bg} text-white shadow-md` 
                          : `text-slate-700 ${colors.hover} hover:shadow-sm`
                      }`}
                    >
                      <Icon className={`h-5 w-5 flex-shrink-0 ${isActive ? "text-white" : colors.text}`} />
                      <div className="flex-1 min-w-0">
                        <div className={`text-sm font-medium ${isActive ? "text-white" : "text-slate-900"}`}>
                          {item.name}
                        </div>
                        <div className={`text-xs mt-0.5 ${isActive ? "text-white/80" : "text-slate-500"}`}>
                          {item.description}
                        </div>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}