"use client"

import { useEffect, useRef, useState } from "react"
import { Calendar, CheckCircle2, Users, Building2, User, Clock, Activity, TrendingUp } from "lucide-react"
import { getUser } from "@/hooks/getUser"
import { callAPIWithEnc } from "@/lib/commonApi"

const styles = `
  @keyframes slideIn {
    0% { transform: translateX(-20px); opacity: 0; }
    100% { transform: translateX(0); opacity: 1; }
  }
  table {
    border-collapse: separate;
    border-spacing: 0;
  }
  tr {
    page-break-inside: avoid;
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
  const [user, setUser] = useState<any>(null)
  const [assignPanelCandidates, setAssignPanelCandidates] = useState<PanelCandidate[]>([])
  const [queueCandidates, setQueueCandidates] = useState<QueueCandidate[]>([])
  const [currentTime, setCurrentTime] = useState(new Date())
  const [rotatingIndex, setRotatingIndex] = useState(0)
  const [dashboard, setDashboard] = useState<{ active_inter_view_panel: number; total_pending: number | null; total_ongoing_interview: number | null; total_completed_interview: number | null }>({ active_inter_view_panel: 0, total_pending: null, total_ongoing_interview: null, total_completed_interview: null })

    const pollRef = useRef<any>(null)

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  // stop blinking: remove rotate timer

  useEffect(() => {
    ;(async () => {
      const u = await getUser()
      setUser(u)
      if (!u) return
      await fetchPreInterviewData(u)
      await fetchDashboard(u)
    })()
  }, [])

  useEffect(() => {
    if (!user) return
    if (pollRef.current) clearInterval(pollRef.current)
    pollRef.current = setInterval(async () => {
      await fetchPreInterviewData(user)
      await fetchDashboard(user)
    }, 10000)
    return () => {
      if (pollRef.current) clearInterval(pollRef.current)
    }
  }, [user])

  const fetchPreInterviewData = async (u: any) => {
    const res = await callAPIWithEnc("/admin/getPreInterviewCandidateDetails", "POST", {
      user_id: u?.user_id || 0,
      user_type_id: u?.user_type_id || 0,
      schedule_id: u?.schedule_id || 0,
    })
    if (res?.status === 0 && res?.data) {
      const nextAssign = res.data.assignPanelCandidateList || []
      const nextQueue = res.data.queueCandidateList || []
      const currAssign = assignPanelCandidates
      const currQueue = queueCandidates
      const sameAssign = JSON.stringify(currAssign) === JSON.stringify(nextAssign)
      const sameQueue = JSON.stringify(currQueue) === JSON.stringify(nextQueue)
      if (!sameAssign) setAssignPanelCandidates(nextAssign)
      if (!sameQueue) setQueueCandidates(nextQueue)
    } else {
      if (assignPanelCandidates.length) setAssignPanelCandidates([])
      if (queueCandidates.length) setQueueCandidates([])
    }
  }

  const fetchDashboard = async (u: any) => {
    const res = await callAPIWithEnc("/admin/getPreinterviewerDashBardDetails", "POST", {
      schedule_id: u?.schedule_id || 0,
      user_id: u?.user_id || 0,
      user_type_id: u?.user_type_id || 0,
    })
    const d = res?.status === 0 ? res?.data : null
    const next = {
      active_inter_view_panel: Number(d?.active_inter_view_panel ?? 0),
      total_pending: d?.total_pending ?? null,
      total_ongoing_interview: d?.total_ongoing_interview ?? null,
      total_completed_interview: d?.total_completed_interview ?? null,
    }
    if (JSON.stringify(dashboard) !== JSON.stringify(next)) setDashboard(next)
  }

  const completedCount = assignPanelCandidates.filter(c => c.interview_status === "Interview Complete").length
  const activeCount = assignPanelCandidates.length - completedCount

    const formatTime = (date: Date) => {
        return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true })
    }

    const formatDate = (date: Date) => {
        return date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })
    }

    const getStatusBg = (s?: string) => {
        if (s === "Interview Complete") return "bg-green-500"
        if (s === "Panel Assigned") return "bg-amber-500"
        return "bg-blue-500"
    }

    return (
        <>
            <style>{styles}</style>
            <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-100 to-indigo-100">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 shadow-lg">
                    <div className="px-6 py-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-white/30 rounded-xl">
                                    <TrendingUp className="h-10 w-10 text-white" />
                                </div>
                                <div>
                                    <h1 className="text-4xl font-black text-white">INTERVIEW DASHBOARD</h1>
                                    <p className="text-sm text-white/95 font-bold mt-1">Real-Time Monitoring System</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="text-3xl font-black text-white">{formatTime(currentTime)}</div>
                                <div className="text-sm text-white/95 font-bold">{formatDate(currentTime)}</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stats Bar */}
                <div className="bg-white border-b-2 border-indigo-300 shadow-md">
                    <div className="px-6 py-3">
                        <div className="grid grid-cols-4 gap-6">
                            <div className="text-center">
                                <div className="text-4xl font-black text-blue-600 mb-1">{dashboard.active_inter_view_panel || assignPanelCandidates.length}</div>
                                <div className="text-sm font-black text-gray-700">TOTAL PANELS</div>
                            </div>
                            <div className="text-center border-l-2 border-gray-300">
                                <div className="text-4xl font-black text-amber-600 mb-1">{dashboard.total_ongoing_interview ?? activeCount}</div>
                                <div className="text-sm font-black text-gray-700">IN PROGRESS</div>
                            </div>
                            <div className="text-center border-l-2 border-gray-300">
                                <div className="text-4xl font-black text-green-600 mb-1">{dashboard.total_completed_interview ?? completedCount}</div>
                                <div className="text-sm font-black text-gray-700">COMPLETED</div>
                            </div>
                            <div className="text-center border-l-2 border-gray-300">
                                <div className="text-4xl font-black text-purple-600 mb-1">{dashboard.total_pending ?? queueCandidates.length}</div>
                                <div className="text-sm font-black text-gray-700">IN QUEUE</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Two Column Layout - Tables */}
                <div className="px-6 py-4">
                    <div className="grid grid-cols-2 gap-6">
                        {/* Left - Active Panels Table */}
                        <div>
                            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2 mb-3">
                                <h2 className="text-2xl font-black text-white">ACTIVE PANELS ({assignPanelCandidates.length})</h2>
                            </div>

                            {assignPanelCandidates.length > 0 ? (
                                <table className="w-full">
                                    <thead>
                                        <tr className="bg-blue-200">
                                            <th className="px-3 py-2 text-left text-sm font-black text-gray-900 border-b-2 border-blue-400">ROOM</th>
                                            <th className="px-3 py-2 text-left text-sm font-black text-gray-900 border-b-2 border-blue-400">CANDIDATE</th>
                                            <th className="px-3 py-2 text-left text-sm font-black text-gray-900 border-b-2 border-blue-400">EXAM / POST</th>
                                            <th className="px-3 py-2 text-left text-sm font-black text-gray-900 border-b-2 border-blue-400">INTERVIEWER</th>
                                            <th className="px-3 py-2 text-center text-sm font-black text-gray-900 border-b-2 border-blue-400">STATUS</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {assignPanelCandidates.map((c, idx) => (
                                            <tr
                                                key={idx}
                                                className={`${idx % 2 === 0 ? 'bg-white' : 'bg-blue-50'} border-b border-blue-200`}
                                                style={{ animationDelay: `${idx * 0.05}s` }}
                                            >
                                                <td className="px-3 py-3">
                                                    <div className="text-2xl font-black text-blue-600">{c.room_number || "??"}</div>
                                                </td>
                                                <td className="px-3 py-3">
                                                    <div className="text-base font-black text-gray-900">{c.candidaten_name || c.candidate_name || "Candidate"}</div>
                                                </td>
                                                <td className="px-3 py-3">
                                                    <div className="text-sm font-bold text-gray-700">{c.examname || "Exam"}</div>
                                                    <div className="text-sm font-bold text-gray-600">{c.post || "Post"}</div>
                                                </td>
                                                <td className="px-3 py-3">
                                                    <div className="text-sm font-bold text-gray-700">{c.inter_viewer_name || "Not assigned"}</div>
                                                </td>
                                                <td className="px-3 py-3 text-center">
                                                    <div className={`inline-block px-3 py-1 rounded-lg ${getStatusBg(c.interview_status)} text-white text-xs font-black`}>
                                                        {c.interview_status === "Interview Complete" ? "DONE" : "ACTIVE"}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : (
                                <div className="text-center py-12 bg-white">
                                    <div className="text-2xl font-bold text-gray-400">No Active Panels</div>
                                </div>
                            )}
                        </div>

                        {/* Right - Queue Table */}
                        <div>
                            <div className="bg-gradient-to-r from-purple-600 to-pink-600 px-4 py-2 mb-3">
                                <h2 className="text-2xl font-black text-white">WAITING QUEUE ({queueCandidates.length})</h2>
                            </div>

                            {queueCandidates.length > 0 ? (
                                <table className="w-full">
                                    <thead>
                                        <tr className="bg-purple-200">
                                            <th className="px-3 py-2 text-center text-sm font-black text-gray-900 border-b-2 border-purple-400">#</th>
                                            <th className="px-3 py-2 text-left text-sm font-black text-gray-900 border-b-2 border-purple-400">ROLL NO</th>
                                            <th className="px-3 py-2 text-left text-sm font-black text-gray-900 border-b-2 border-purple-400">CANDIDATE</th>
                                            <th className="px-3 py-2 text-left text-sm font-black text-gray-900 border-b-2 border-purple-400">EXAM / POST</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {queueCandidates.map((c, idx) => (
                                            <tr
                                                key={idx}
                                                className={`${idx % 2 === 0 ? 'bg-white' : 'bg-purple-50'} border-b border-purple-200`}
                                                style={{ animationDelay: `${idx * 0.05}s` }}
                                            >
                                                <td className="px-3 py-3 text-center">
                                                    <div className="inline-flex items-center justify-center w-8 h-8 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full">
                                                        <span className="text-base font-black text-white">{idx + 1}</span>
                                                    </div>
                                                </td>
                                                <td className="px-3 py-3">
                                                    <div className="text-sm font-mono font-black text-purple-900">{c.candidate_roll}</div>
                                                </td>
                                                <td className="px-3 py-3">
                                                    <div className="text-base font-black text-gray-900">{c.candidate_name}</div>
                                                </td>
                                                <td className="px-3 py-3">
                                                    <div className="text-sm font-bold text-gray-700">{c.examname}</div>
                                                    <div className="text-sm font-bold text-gray-600">{c.post}</div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : (
                                <div className="text-center py-12 bg-white">
                                    <div className="text-2xl font-bold text-gray-400">Queue is Empty</div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}