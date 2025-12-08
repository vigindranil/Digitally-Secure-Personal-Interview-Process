"use client"

import { useEffect, useRef, useState } from "react"
import { Calendar, CheckCircle2, Users, Building2, User, Clock, Activity, Search, Filter, RefreshCw } from "lucide-react"
import DataTable, { ColumnDef } from "@/components/DataTable"
import { getUser } from "@/hooks/getUser"
import { callAPIWithEnc } from "@/lib/commonApi"

const styles = `
  @keyframes blob {
    0%, 100% { transform: translate(0, 0) scale(1); }
    33% { transform: translate(30px, -50px) scale(1.1); }
    66% { transform: translate(-20px, 20px) scale(0.9); }
  }
  .animate-blob {
    animation: blob 7s infinite;
  }
  .animation-delay-2000 {
    animation-delay: 2s;
  }
  .animation-delay-4000 {
    animation-delay: 4s;
  }
`

type PanelCandidate = {
    room_number?: string
    inter_viewer_name?: string
    candidate_roll?: string
    candidaten_name?: string
    candidate_name?: string
    examdate?: string
    exam_date?: string
    examname?: string
    post?: string
    interview_status?: string
}

type QueueCandidate = {
    candidate_roll: string
    candidate_name: string
    exam_date: string
    examname: string
    post: string
}

export default function PreInterviewPage() {
    const [user, setUser] = useState < any > (null)
    const [loading, setLoading] = useState(false)
    const [assignPanelCandidates, setAssignPanelCandidates] = useState < PanelCandidate[] > ([])
    const [queueCandidates, setQueueCandidates] = useState < QueueCandidate[] > ([])
    const [searchTerm, setSearchTerm] = useState("")
    const [filterStatus, setFilterStatus] = useState < string > ("all")

    const pollRef = useRef < any > (null)

    useEffect(() => {
        ; (async () => {
            const u = await getUser()
            setUser(u)
            if (u) {
                await fetchPreInterviewData(u, false)
                if (!pollRef.current) {
                    pollRef.current = setInterval(async () => {
                        await fetchPreInterviewData(u, true)
                    }, 10000)
                }
            }
        })()
        return () => {
            if (pollRef.current) {
                clearInterval(pollRef.current)
                pollRef.current = null
            }
        }
    }, [])

    const fetchPreInterviewData = async (u: any, background: boolean) => {
        try {
            if (!background) {
                setLoading(true)
            }
            const res = await callAPIWithEnc("/admin/getPreInterviewCandidateDetails", "POST", {
                user_id: u?.user_id || 0,
                user_type_id: u?.user_type_id || 0,
            })
            if (res?.status === 0 && res?.data) {
                setAssignPanelCandidates(res.data.assignPanelCandidateList || [])
                setQueueCandidates(res.data.queueCandidateList || [])
            } else {
                setAssignPanelCandidates([])
                setQueueCandidates([])
            }
        } finally {
            if (!background) {
                setLoading(false)
            }
        }
    }

    const statusConfig = (s?: string) => {
        if (s === "Interview Complete")
            return { bg: "bg-emerald-500", text: "text-white", icon: <CheckCircle2 className="h-4 w-4" />, label: "Completed" }
        if (s === "Panel Assigned")
            return { bg: "bg-amber-500", text: "text-white", icon: <Clock className="h-4 w-4" />, label: "In Progress" }
        return { bg: "bg-blue-500", text: "text-white", icon: <Activity className="h-4 w-4" />, label: "Active" }
    }

    const getPostColor = (post?: string) => {
        if (!post) return "bg-gray-400"
        // Generate consistent color based on post name using hash
        const hash = post.split('').reduce((acc, char) => char.charCodeAt(0) + ((acc << 5) - acc), 0)
        const colors = [
            "bg-blue-500", "bg-purple-500", "bg-pink-500", "bg-rose-500",
            "bg-orange-500", "bg-amber-500", "bg-yellow-500", "bg-lime-500",
            "bg-green-500", "bg-emerald-500", "bg-teal-500", "bg-cyan-500",
            "bg-sky-500", "bg-indigo-500", "bg-violet-500", "bg-fuchsia-500"
        ]
        return colors[Math.abs(hash) % colors.length]
    }

    const completedCount = assignPanelCandidates.filter(c => c.interview_status === "Interview Complete").length
    const activeCount = assignPanelCandidates.length - completedCount

    const filteredPanels = assignPanelCandidates.filter(c => {
        const matchesSearch = (c.candidaten_name || c.candidate_name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
            (c.room_number || "").toLowerCase().includes(searchTerm.toLowerCase())
        const matchesFilter = filterStatus === "all" || c.interview_status === filterStatus
        return matchesSearch && matchesFilter
    })

    const queueColumns: ColumnDef<QueueCandidate>[] = [
        { header: "Roll No", accessorKey: "candidate_roll" },
        { header: "Candidate Name", accessorKey: "candidate_name" },
        { header: "Exam Date", accessorKey: "exam_date" },
        { header: "Examination", accessorKey: "examname" },
        { header: "Post", accessorKey: "post" },
    ]

    return (
        <>
            <style>{styles}</style>
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 relative overflow-hidden">
                {/* Animated background pattern */}
                <div className="absolute inset-0 opacity-30">
                    <div className="absolute top-0 left-0 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
                    <div className="absolute top-0 right-0 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
                    <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
                </div>

                {/* Top Bar */}
                <div className="bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm sticky top-0 z-10">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-3 sm:py-4">
                        <div className="flex items-center justify-between gap-3">
                            <div className="flex items-center gap-2 sm:gap-4 min-w-0 flex-1">
                                <div className="p-2 sm:p-2.5 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg sm:rounded-xl shadow-lg flex-shrink-0">
                                    <Users className="h-4 w-4 sm:h-6 sm:w-6 text-white" />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <h1 className="text-base sm:text-2xl font-bold text-gray-900 truncate">Pre-Interview Dashboard</h1>
                                    <p className="text-xs sm:text-sm text-gray-500 hidden sm:block">Monitor panels and manage candidate queue</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 flex-shrink-0">
                                <button
                                    onClick={() => fetchPreInterviewData(user, false)}
                                    className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-4 py-1.5 sm:py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
                                >
                                    <RefreshCw className={`h-3.5 w-3.5 sm:h-4 sm:w-4 text-gray-600 ${loading ? 'animate-spin' : ''}`} />
                                    <span className="text-xs sm:text-sm font-medium text-gray-700 hidden sm:inline">Refresh</span>
                                </button>
                                <div className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 bg-green-50 border border-green-200 rounded-lg">
                                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-500 rounded-full animate-pulse"></div>
                                    <span className="text-xs sm:text-sm font-semibold text-green-700">Live</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mx-auto max-w-7xl px-4 sm:px-6 py-4 sm:py-6 space-y-4 sm:space-y-6 relative z-10">
                    {/* Stats Overview */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                        <div className="group bg-white/95 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-lg border border-white/60 p-4 sm:p-6 hover:shadow-xl hover:scale-105 transition-all duration-300">
                            <div className="flex items-center justify-between mb-3 sm:mb-4">
                                <div className="p-2 sm:p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg sm:rounded-xl shadow-lg group-hover:scale-110 transition-transform">
                                    <Building2 className="h-4 w-4 sm:h-6 sm:w-6 text-white" />
                                </div>
                                <div className="p-1.5 sm:p-2 bg-blue-50 rounded-md sm:rounded-lg">
                                    <div className="text-[10px] sm:text-xs font-bold text-blue-600">TOTAL</div>
                                </div>
                            </div>
                            <h3 className="text-2xl sm:text-4xl font-black text-gray-900 mb-1">{assignPanelCandidates.length}</h3>
                            <p className="text-xs sm:text-sm text-gray-600 font-semibold">Active Panels</p>
                            <div className="mt-2 sm:mt-3 pt-2 sm:pt-3 border-t border-gray-100">
                                <div className="flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs text-gray-500">
                                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-500 rounded-full animate-pulse"></div>
                                    <span>Live Monitoring</span>
                                </div>
                            </div>
                        </div>

                        <div className="group bg-white/95 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-lg border border-white/60 p-4 sm:p-6 hover:shadow-xl hover:scale-105 transition-all duration-300">
                            <div className="flex items-center justify-between mb-3 sm:mb-4">
                                <div className="p-2 sm:p-3 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg sm:rounded-xl shadow-lg group-hover:scale-110 transition-transform">
                                    <Activity className="h-4 w-4 sm:h-6 sm:w-6 text-white" />
                                </div>
                                <div className="p-1.5 sm:p-2 bg-amber-50 rounded-md sm:rounded-lg">
                                    <div className="text-[10px] sm:text-xs font-bold text-amber-600">ACTIVE</div>
                                </div>
                            </div>
                            <h3 className="text-2xl sm:text-4xl font-black text-gray-900 mb-1">{activeCount}</h3>
                            <p className="text-xs sm:text-sm text-gray-600 font-semibold">In Progress</p>
                            <div className="mt-2 sm:mt-3 pt-2 sm:pt-3 border-t border-gray-100">
                                <div className="flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs text-gray-500">
                                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-amber-500 rounded-full animate-pulse"></div>
                                    <span>Ongoing Interviews</span>
                                </div>
                            </div>
                        </div>

                        <div className="group bg-white/95 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-lg border border-white/60 p-4 sm:p-6 hover:shadow-xl hover:scale-105 transition-all duration-300">
                            <div className="flex items-center justify-between mb-3 sm:mb-4">
                                <div className="p-2 sm:p-3 bg-gradient-to-br from-emerald-500 to-green-600 rounded-lg sm:rounded-xl shadow-lg group-hover:scale-110 transition-transform">
                                    <CheckCircle2 className="h-4 w-4 sm:h-6 sm:w-6 text-white" />
                                </div>
                                <div className="p-1.5 sm:p-2 bg-emerald-50 rounded-md sm:rounded-lg">
                                    <div className="text-[10px] sm:text-xs font-bold text-emerald-600">DONE</div>
                                </div>
                            </div>
                            <h3 className="text-2xl sm:text-4xl font-black text-gray-900 mb-1">{completedCount}</h3>
                            <p className="text-xs sm:text-sm text-gray-600 font-semibold">Completed</p>
                            <div className="mt-2 sm:mt-3 pt-2 sm:pt-3 border-t border-gray-100">
                                <div className="flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs text-gray-500">
                                    <CheckCircle2 className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-emerald-500" />
                                    <span>Finished Today</span>
                                </div>
                            </div>
                        </div>

                        <div className="group bg-white/95 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-lg border border-white/60 p-4 sm:p-6 hover:shadow-xl hover:scale-105 transition-all duration-300">
                            <div className="flex items-center justify-between mb-3 sm:mb-4">
                                <div className="p-2 sm:p-3 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg sm:rounded-xl shadow-lg group-hover:scale-110 transition-transform">
                                    <Users className="h-4 w-4 sm:h-6 sm:w-6 text-white" />
                                </div>
                                <div className="p-1.5 sm:p-2 bg-purple-50 rounded-md sm:rounded-lg">
                                    <div className="text-[10px] sm:text-xs font-bold text-purple-600">QUEUE</div>
                                </div>
                            </div>
                            <h3 className="text-2xl sm:text-4xl font-black text-gray-900 mb-1">{queueCandidates.length}</h3>
                            <p className="text-xs sm:text-sm text-gray-600 font-semibold">Waiting</p>
                            <div className="mt-2 sm:mt-3 pt-2 sm:pt-3 border-t border-gray-100">
                                <div className="flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs text-gray-500">
                                    <Clock className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-purple-500" />
                                    <span>In Queue</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
                        {/* Left Panel - Active Panels */}
                        <div className="lg:col-span-2 space-y-4">
                            <div className="bg-white/95 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-xl border border-white/60 p-4 sm:p-6">
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0 mb-4 sm:mb-5">
                                    <div className="flex items-center gap-2 sm:gap-3">
                                        <div className="p-1.5 sm:p-2 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg sm:rounded-xl shadow-lg">
                                            <Building2 className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                                        </div>
                                        <div>
                                            <h2 className="text-base sm:text-xl font-bold text-gray-900">Active Interview Panels</h2>
                                            <p className="text-[10px] sm:text-xs text-gray-500">Real-time panel monitoring</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg sm:rounded-xl self-start sm:self-auto">
                                        <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-500 rounded-full animate-pulse"></div>
                                        <span className="text-xs sm:text-sm font-bold text-blue-700">{filteredPanels.length} Panels</span>
                                    </div>
                                </div>

                                {/* Search and Filter */}
                                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mb-4 sm:mb-5">
                                    <div className="flex-1 relative group">
                                        <Search className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 h-3.5 w-3.5 sm:h-4 sm:w-4 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                                        <input
                                            type="text"
                                            placeholder="Search by name or room..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="w-full pl-9 sm:pl-11 pr-3 sm:pr-4 py-2 sm:py-2.5 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-xs sm:text-sm bg-white/80 backdrop-blur-sm font-medium"
                                        />
                                    </div>
                                    <select
                                        value={filterStatus}
                                        onChange={(e) => setFilterStatus(e.target.value)}
                                        className="px-3 sm:px-5 py-2 sm:py-2.5 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-xs sm:text-sm font-semibold bg-white/80 backdrop-blur-sm cursor-pointer hover:border-blue-400 transition-colors"
                                    >
                                        <option value="all">All Status</option>
                                        <option value="Interview Complete">Completed</option>
                                        <option value="Panel Assigned">In Progress</option>
                                    </select>
                                </div>

                                {/* Panels List */}
                                {loading ? (
                                    <div className="space-y-2">
                                        {Array.from({ length: 3 }).map((_, i) => (
                                            <div key={i} className="border border-gray-200 rounded-lg p-2 bg-white/60">
                                                <div className="flex items-center justify-between mb-1.5">
                                                    <div className="h-5 w-16 rounded bg-slate-200 animate-pulse" />
                                                    <div className="h-5 w-20 rounded-full bg-slate-200 animate-pulse" />
                                                </div>
                                                <div className="h-3 w-32 rounded bg-slate-200 animate-pulse mb-1.5" />
                                                <div className="h-3 w-full rounded bg-slate-200 animate-pulse" />
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="space-y-2 max-h-[calc(100vh-380px)] sm:max-h-[calc(100vh-420px)] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
                                        {filteredPanels.map((c, idx) => {
                                            const status = statusConfig(c.interview_status)
                                            const postColor = getPostColor(c.post)
                                            return (
                                                <div key={idx} className="group relative border border-gray-200 rounded-lg overflow-hidden hover:border-blue-300 hover:shadow-md transition-all duration-300 bg-white/95 backdrop-blur-sm">
                                                    {/* Color band for post */}
                                                    <div className={`absolute left-0 top-0 bottom-0 w-0.5 sm:w-1 ${postColor} group-hover:w-1 sm:group-hover:w-1.5 transition-all duration-300`}></div>

                                                    <div className="p-2 pl-2.5 sm:pl-3">
                                                        <div className="flex items-center justify-between mb-1.5">
                                                            <div className="flex items-center gap-1 sm:gap-1.5 min-w-0 flex-1">
                                                                <div className="flex items-center gap-1 px-1.5 sm:px-2 py-0.5 sm:py-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded shadow-sm flex-shrink-0">
                                                                    <Building2 className="h-2.5 w-2.5 text-white" />
                                                                    <span className="text-[9px] sm:text-[10px] font-bold text-white">{c.room_number || "Room"}</span>
                                                                </div>
                                                                <div className={`w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full ${postColor} flex-shrink-0`}></div>
                                                            </div>
                                                            <div className={`flex items-center gap-1 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-[9px] sm:text-[10px] font-bold ${status.bg} ${status.text} flex-shrink-0`}>
                                                                <div className="h-2.5 w-2.5">
                                                                    {status.icon}
                                                                </div>
                                                                <span className="hidden sm:inline text-[9px]">{status.label}</span>
                                                            </div>
                                                        </div>

                                                        <div className="mb-1.5">
                                                            <h3 className="text-[11px] sm:text-xs font-bold text-gray-900 truncate group-hover:text-blue-600 transition-colors">{c.candidaten_name || c.candidate_name || "Candidate"}</h3>
                                                            <p className="text-[9px] sm:text-[10px] text-gray-600 truncate">{c.examname || "Exam"} - {c.post || "Post"}</p>
                                                        </div>

                                                        <div className="flex items-center justify-between gap-1.5 text-[9px] sm:text-[10px]">
                                                            <div className="flex items-center gap-1 text-gray-600 min-w-0 flex-1">
                                                                <Calendar className="h-2.5 w-2.5 flex-shrink-0" />
                                                                <span className="font-medium truncate">{c.examdate || c.exam_date || "Not set"}</span>
                                                            </div>
                                                            <div className="flex items-center gap-1 text-gray-600 min-w-0 flex-1">
                                                                <User className="h-2.5 w-2.5 flex-shrink-0" />
                                                                <span className="font-medium truncate">{c.inter_viewer_name || "Not assigned"}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        })}
                                        {filteredPanels.length === 0 && (
                                            <div className="text-center py-8">
                                                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-2">
                                                    <Building2 className="h-6 w-6 text-gray-400" />
                                                </div>
                                                <p className="text-gray-600 font-medium text-xs">No panels found</p>
                                                <p className="text-gray-500 text-[10px] mt-0.5">Try adjusting your filters</p>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Right Panel - Queue */}
                        <div className="space-y-3">
                            <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-xl border border-white/60 p-3 sm:p-4">
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
                                    <div className="flex items-center gap-2">
                                        <div className="p-1.5 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg shadow-lg">
                                            <Users className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-white" />
                                        </div>
                                        <div>
                                            <h2 className="text-sm sm:text-base font-bold text-gray-900">Candidate Queue</h2>
                                            <p className="text-[9px] sm:text-[10px] text-gray-500">Waiting list</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1.5 px-2.5 py-1 bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg self-start sm:self-auto">
                                        <Clock className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-purple-600" />
                                        <span className="text-[10px] sm:text-xs font-bold text-purple-700">{queueCandidates.length} Waiting</span>
                                    </div>
                                </div>

                                <div className="space-y-2 max-h-[calc(100vh-380px)] sm:max-h-[calc(100vh-300px)] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-purple-300 scrollbar-track-transparent">
                                    {loading ? (
                                        Array.from({ length: 5 }).map((_, i) => (
                                            <div key={i} className="border border-gray-200 rounded-lg p-2 bg-white/60">
                                                <div className="h-3 w-20 rounded bg-slate-200 animate-pulse mb-2" />
                                                <div className="h-2.5 w-28 rounded bg-slate-200 animate-pulse mb-1.5" />
                                                <div className="h-2.5 w-24 rounded bg-slate-200 animate-pulse" />
                                            </div>
                                        ))
                                    ) : (
                                        queueCandidates.map((c, idx) => (
                                            <div key={idx} className="group border border-gray-200 rounded-lg p-2 sm:p-2.5 hover:border-purple-300 hover:shadow-md transition-all duration-300 bg-white/95 backdrop-blur-sm">
                                                <div className="flex items-center justify-between mb-1.5">
                                                    <div className="flex items-center gap-1 sm:gap-1.5">
                                                        <div className="w-5 h-5 sm:w-6 sm:h-6 bg-gradient-to-br from-purple-600 to-pink-600 rounded flex items-center justify-center shadow-sm">
                                                            <span className="text-[9px] sm:text-[10px] font-black text-white">#{idx + 1}</span>
                                                        </div>
                                                        <div className="px-1.5 sm:px-2 py-0.5 bg-gradient-to-r from-gray-50 to-purple-50 border border-gray-200 rounded">
                                                            <span className="text-[9px] sm:text-[10px] font-mono font-bold text-gray-700">{c.candidate_roll}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <h4 className="font-bold text-gray-900 mb-1.5 text-[11px] sm:text-xs group-hover:text-purple-600 transition-colors">{c.candidate_name}</h4>
                                                <div className="space-y-1 bg-gradient-to-br from-gray-50 to-purple-50/30 rounded p-1.5 sm:p-2 border border-gray-100">
                                                    <div className="flex items-start gap-1">
                                                        <span className="text-[9px] font-bold text-gray-500 min-w-[35px] sm:min-w-[40px]">Exam:</span>
                                                        <span className="text-[9px] text-gray-700 font-semibold flex-1 line-clamp-1">{c.examname}</span>
                                                    </div>
                                                    <div className="flex items-start gap-1">
                                                        <span className="text-[9px] font-bold text-gray-500 min-w-[35px] sm:min-w-[40px]">Post:</span>
                                                        <span className="text-[9px] text-gray-700 font-semibold flex-1 line-clamp-1">{c.post}</span>
                                                    </div>
                                                    <div className="flex items-start gap-1">
                                                        <span className="text-[9px] font-bold text-gray-500 min-w-[35px] sm:min-w-[40px]">Date:</span>
                                                        <span className="text-[9px] text-gray-700 font-semibold flex-1">{c.exam_date}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                    {!loading && queueCandidates.length === 0 && (
                                        <div className="text-center py-8">
                                            <div className="w-12 h-12 bg-gradient-to-br from-gray-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-2 shadow-lg">
                                                <Users className="h-6 w-6 text-gray-400" />
                                            </div>
                                            <p className="text-gray-600 font-semibold text-xs">Queue is empty</p>
                                            <p className="text-gray-500 text-[10px] mt-0.5">No candidates waiting</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}