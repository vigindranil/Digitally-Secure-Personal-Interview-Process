// export const dynamic = 'force-dynamic';
"use client"

import { Users, ShieldCheck, ClipboardList, Activity, TrendingUp, Clock, CheckCircle2, AlertCircle, Calendar, FileText, Briefcase, Users as UsersIcon, UserPlus } from "lucide-react"
import AdminMenu from "@/components/layout/admin-menu"


const stats = {
  totalCandidates: 1247,
  biometricVerified: 892,
  documentVerified: 1156,
  interviewsCompleted: 423,
  panelsActive: 8,
  totalActiveInterviews: 12,
  panelsAllocated: 8,
  waitingInQueue: 34
}

export default function Dashboard() {
  console.log("Dashboard rendered")
  return (
    <div className="min-h-screen p-4 sm:p-6 relative">
      <div className="absolute inset-0 -z-10">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1600&q=60')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-white/85 via-white/70 to-white/40 backdrop-blur-sm" />
      </div>
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-white/80 backdrop-blur-sm border border-sky-200/50 shadow">
              <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-sky-600" />
              <span className="text-xs font-semibold text-slate-700">Real-time Monitoring</span>
            </div>
            <h1 className="mt-2 sm:mt-3 text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 tracking-tight">Dashboard Overview</h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">Live analytics across panels, verifications, and interviews</p>
          </div>
          <div className="flex items-center gap-2 sm:gap-3 px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl bg-white/90 backdrop-blur border border-slate-200 shadow-sm">
            <div className="relative flex h-2 w-2 sm:h-2.5 sm:w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 sm:h-2.5 sm:w-2.5 bg-emerald-500"></span>
            </div>
            <span className="text-xs sm:text-sm font-medium text-slate-700">System Operational</span>
          </div>
        </div>

        {/* Admin Menu */}
        <div className="flex justify-between items-center">
          <AdminMenu />
        </div>



        {/* Charts Section */}
        <div className="grid gap-4 sm:gap-6 lg:grid-cols-2">
          {/* Interview Statistics Chart */}
          <div className="bg-white/90 backdrop-blur rounded-2xl border border-slate-200 shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Interview Statistics</h3>
                <p className="text-sm text-slate-600">Completion rates overview</p>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-100">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                <span className="text-sm font-semibold text-emerald-700">85% Success Rate</span>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 rounded-xl bg-gradient-to-br from-violet-50 to-purple-50 border border-violet-100">
                <div className="text-2xl font-bold text-violet-600 mb-1">{stats.interviewsCompleted}</div>
                <div className="text-sm text-violet-700 font-medium">Completed</div>
              </div>
              <div className="text-center p-4 rounded-xl bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-100">
                <div className="text-2xl font-bold text-blue-600 mb-1">{stats.totalActiveInterviews}</div>
                <div className="text-sm text-blue-700 font-medium">Active</div>
              </div>
              <div className="text-center p-4 rounded-xl bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-100">
                <div className="text-2xl font-bold text-amber-600 mb-1">{stats.waitingInQueue}</div>
                <div className="text-sm text-amber-700 font-medium">In Queue</div>
              </div>
            </div>
            <div className="mt-6 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-700">Interview Progress</span>
                <span className="text-sm font-bold text-slate-900">{Math.round((stats.interviewsCompleted / (stats.interviewsCompleted + stats.totalActiveInterviews + stats.waitingInQueue)) * 100)}%</span>
              </div>
              <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-violet-500 to-purple-500 rounded-full transition-all duration-700"
                  style={{ width: `${Math.round((stats.interviewsCompleted / (stats.interviewsCompleted + stats.totalActiveInterviews + stats.waitingInQueue)) * 100)}%` }}
                />
              </div>
            </div>
          </div>

          {/* Verification Status Chart */}
          <div className="bg-white/90 backdrop-blur rounded-2xl border border-slate-200 shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Verification Status</h3>
                <p className="text-sm text-slate-600">Document & Biometric progress</p>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-50 border border-blue-100">
                <ShieldCheck className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-semibold text-blue-700">Secure Process</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="text-center p-4 rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 border border-green-100">
                <div className="text-2xl font-bold text-green-600 mb-1">{stats.documentVerified}</div>
                <div className="text-sm text-green-700 font-medium">Documents Verified</div>
                <div className="text-xs text-green-600 mt-1">{Math.round((stats.documentVerified / stats.totalCandidates) * 100)}% Complete</div>
              </div>
              <div className="text-center p-4 rounded-xl bg-gradient-to-br from-indigo-50 to-blue-50 border border-indigo-100">
                <div className="text-2xl font-bold text-indigo-600 mb-1">{stats.biometricVerified}</div>
                <div className="text-sm text-indigo-700 font-medium">Biometric Verified</div>
                <div className="text-xs text-indigo-600 mt-1">{Math.round((stats.biometricVerified / stats.totalCandidates) * 100)}% Complete</div>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-700">Document Verification</span>
                <span className="text-sm font-bold text-slate-900">{Math.round((stats.documentVerified / stats.totalCandidates) * 100)}%</span>
              </div>
              <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full transition-all duration-700"
                  style={{ width: `${Math.round((stats.documentVerified / stats.totalCandidates) * 100)}%` }}
                />
              </div>
              <div className="flex items-center justify-between mt-3">
                <span className="text-sm font-medium text-slate-700">Biometric Verification</span>
                <span className="text-sm font-bold text-slate-900">{Math.round((stats.biometricVerified / stats.totalCandidates) * 100)}%</span>
              </div>
              <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-indigo-500 to-blue-500 rounded-full transition-all duration-700"
                  style={{ width: `${Math.round((stats.biometricVerified / stats.totalCandidates) * 100)}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 sm:gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {[
            {
              title: "Total Interview Completed",
              value: stats.interviewsCompleted.toLocaleString(),
              change: "+45 from yesterday",
              icon: ClipboardList,
              color: "violet",
              gradient: "from-violet-500 to-purple-500"
            },
            {
              title: "Total Active Interview",
              value: stats.totalActiveInterviews.toLocaleString(),
              change: "Currently running",
              icon: Activity,
              color: "blue",
              gradient: "from-blue-500 to-cyan-500"
            },
            {
              title: "Total Candidates",
              value: stats.totalCandidates.toLocaleString(),
              change: "+180 from last hour",
              icon: Users,
              color: "emerald",
              gradient: "from-emerald-500 to-teal-500"
            },
            {
              title: "Document Verification Done",
              value: stats.documentVerified.toLocaleString(),
              change: "92.7% completion rate",
              icon: CheckCircle2,
              color: "green",
              gradient: "from-green-500 to-emerald-500"
            },
            {
              title: "Biometric Verification Done",
              value: stats.biometricVerified.toLocaleString(),
              change: "71.5% completion rate",
              icon: ShieldCheck,
              color: "indigo",
              gradient: "from-indigo-500 to-blue-500"
            },
            {
              title: "Panel Allocated",
              value: stats.panelsAllocated.toLocaleString(),
              change: "All panels active",
              icon: TrendingUp,
              color: "purple",
              gradient: "from-purple-500 to-pink-500"
            },
            {
              title: "Waiting in Queue",
              value: stats.waitingInQueue.toLocaleString(),
              change: "Ready for interview",
              icon: Clock,
              color: "amber",
              gradient: "from-amber-500 to-orange-500"
            },
            {
              title: "Pending Verification",
              value: (stats.totalCandidates - stats.documentVerified).toLocaleString(),
              change: "Requires attention",
              icon: AlertCircle,
              color: "rose",
              gradient: "from-rose-500 to-pink-500"
            },
          ].map((stat, i) => {
            const Icon = stat.icon
            return (
              <div key={i} className="group relative overflow-hidden bg-white/90 backdrop-blur rounded-xl sm:rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg transition-all duration-300">
                <div className="absolute top-0 right-0 w-24 h-24 sm:w-32 sm:h-32 -mr-6 sm:-mr-8 -mt-6 sm:-mt-8 opacity-5">
                  <Icon className="w-full h-full" />
                </div>
                <div className="relative p-4 sm:p-6 space-y-3 sm:space-y-4">
                  <div className="flex items-center justify-between">
                    <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl ring-2 ring-white/60 bg-gradient-to-br ${stat.gradient} flex items-center justify-center shadow-lg`}>
                      <Icon className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                    </div>
                    <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-emerald-500" />
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm font-medium text-slate-600 mb-1">{stat.title}</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 tracking-tight">{stat.value}</p>
                    <p className="text-xs text-slate-500 mt-1 sm:mt-2 flex items-center gap-1">
                      <span className="inline-block w-1 h-1 rounded-full bg-slate-400"></span>
                      {stat.change}
                    </p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Main Content Grid */}
        <div className="grid gap-4 sm:gap-5 lg:grid-cols-3">

          {/* Live Queue Status */}
          <div className="lg:col-span-2 bg-white/90 backdrop-blur rounded-xl sm:rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="border-b border-slate-200 bg-gradient-to-r from-slate-50 to-white px-4 sm:px-6 py-3 sm:py-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-slate-900">Live Queue Status</h2>
                  <p className="text-xs text-slate-600 mt-0.5">Active interview panels and next candidates</p>
                </div>
                <div className="flex items-center gap-2 px-2.5 py-1.5 sm:px-3 sm:py-1.5 rounded-lg bg-blue-50 border border-blue-100">
                  <Clock className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-blue-600" />
                  <span className="text-xs sm:text-sm font-semibold text-blue-700">Real-time</span>
                </div>
              </div>
            </div>
            <div className="p-4 sm:p-6">
              <div className="space-y-4">
                {[
                  { panel: 101, status: "In Progress", time: "15m remaining", next: "2025-021", progress: 65 },
                  { panel: 102, status: "In Progress", time: "8m remaining", next: "2025-022", progress: 85 },
                  { panel: 103, status: "Starting", time: "Just started", next: "2025-023", progress: 10 },
                  { panel: 104, status: "In Progress", time: "22m remaining", next: "2025-024", progress: 45 },
                ].map((item, i) => (
                  <div key={i} className="group flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-3 sm:p-4 rounded-lg sm:rounded-xl border border-slate-200 hover:border-slate-300 hover:shadow-md transition-all duration-200 bg-white">
                    <div className="flex items-center gap-3 sm:gap-4">
                      <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl ring-2 ring-white/60 bg-gradient-to-br from-indigo-500 to-purple-500 shadow-lg">
                        <span className="text-base sm:text-lg font-bold text-white">{i + 1}</span>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-bold text-slate-900">Panel {item.panel}</p>
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-blue-50 border border-blue-100">
                            <span className="inline-block w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                            <span className="text-xs font-medium text-blue-700">{item.status}</span>
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {item.time}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <div className="w-24 sm:w-32 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-[width] duration-700"
                              style={{ width: `${item.progress}%` }}
                            />
                          </div>
                          <span className="text-xs font-medium text-slate-500">{item.progress}%</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg bg-slate-100 border border-slate-200">
                      <span className="text-xs font-medium text-slate-600">Next:</span>
                      <span className="text-sm font-bold text-slate-900 font-mono">{item.next}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white/90 backdrop-blur rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="border-b border-slate-200 bg-gradient-to-r from-slate-50 to-white px-6 py-4">
              <h2 className="text-lg font-bold text-slate-900">Recent Activity</h2>
              <p className="text-xs text-slate-600 mt-0.5">Latest system events</p>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {[
                  {
                    text: "Candidate 2025-001 completed interview",
                    time: "2m ago",
                    type: "success",
                    icon: CheckCircle2
                  },
                  {
                    text: "Biometric verification failed for 2025-005",
                    time: "5m ago",
                    type: "error",
                    icon: AlertCircle
                  },
                  {
                    text: "Panel 103 started new session",
                    time: "12m ago",
                    type: "info",
                    icon: Activity
                  },
                  {
                    text: "Batch B-04 uploaded successfully",
                    time: "1h ago",
                    type: "info",
                    icon: CheckCircle2
                  },
                ].map((item, i) => {
                  const Icon = item.icon
                  return (
                    <div key={i} className="flex items-start gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors">
                      <div className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${item.type === "success" ? "bg-emerald-50 border border-emerald-200" :
                        item.type === "error" ? "bg-rose-50 border border-rose-200" :
                          "bg-blue-50 border border-blue-200"
                        }`}>
                        <Icon className={`h-4 w-4 ${item.type === "success" ? "text-emerald-600" :
                          item.type === "error" ? "text-rose-600" :
                            "text-blue-600"
                          }`} />
                      </div>
                      <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium text-slate-900 leading-snug">{item.text}</p>
                        <p className="text-xs text-slate-500">{item.time}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
            <div className="border-t border-slate-200 bg-slate-50 px-6 py-3">
              <button className="text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors">
                View all activity →
              </button>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid gap-4 md:grid-cols-3">
          {[
            { label: "Export Reports", sublabel: "Download analytics", color: "blue" },
            { label: "Manage Panels", sublabel: "Configure settings", color: "violet" },
            { label: "System Settings", sublabel: "Administration", color: "slate" },
          ].map((action, i) => (
            <button
              key={i}
              className={`group p-5 rounded-xl border-2 border-dashed bg-white/70 backdrop-blur text-left transition-all duration-200 ${action.color === 'blue' ? 'border-blue-200 hover:border-blue-400 hover:bg-blue-50' :
                action.color === 'violet' ? 'border-violet-200 hover:border-violet-400 hover:bg-violet-50' :
                  'border-slate-200 hover:border-slate-400 hover:bg-slate-50'
                }`}
            >
              <p className="font-semibold text-slate-900 mb-1">{action.label}</p>
              <p className="text-sm text-slate-600">{action.sublabel}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}