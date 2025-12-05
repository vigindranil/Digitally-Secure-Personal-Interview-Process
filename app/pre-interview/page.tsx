"use client"

import { useEffect, useRef, useState } from "react"
import { Calendar, CheckCircle2, AlertCircle, Users, Building2, User, XCircle, Activity, Clock } from "lucide-react"
import DataTable, { ColumnDef } from "@/components/DataTable"
import { getUser } from "@/hooks/getUser"
import { callAPIWithEnc } from "@/lib/commonApi"

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
    const [loading, setLoading] = useState(false)
    const [assignPanelCandidates, setAssignPanelCandidates] = useState<PanelCandidate[]>([])
    const [queueCandidates, setQueueCandidates] = useState<QueueCandidate[]>([])

    const pollRef = useRef<any>(null)

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

    const statusColor = (s?: string) => {
        if (s === "Interview Complete") return "bg-green-50 text-green-700 border-green-200"
        if (s === "Panel Assigned") return "bg-yellow-50 text-yellow-700 border-yellow-200"
        return "bg-orange-50 text-orange-700 border-orange-200"
    }

    const queueColumns: ColumnDef<QueueCandidate>[] = [
        { header: "Roll No", accessorKey: "candidate_roll" },
        { header: "Name", accessorKey: "candidate_name" },
        { header: "Exam Date", accessorKey: "exam_date" },
        { header: "Exam", accessorKey: "examname" },
        { header: "Post", accessorKey: "post" },
    ]

    return (
        <div className="min-h-screen bg-white">
            <div className="mx-auto max-w-7xl px-8 py-8 space-y-10">
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 p-8 sm:p-12 text-white shadow-2xl">
                    <div className="flex items-start justify-between gap-6">
                        <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 ring-1 ring-white/20 text-xs font-semibold">
                                <Users className="h-4 w-4" />
                                Pre-Interview Station
                            </div>
                            <h1 className="mt-4 text-4xl sm:text-5xl font-bold tracking-tight">Pre-Interview</h1>
                            <p className="mt-2 text-sm sm:text-base text-white/80">Assigned panels and candidate queue</p>
                        </div>
                        <div className="hidden sm:flex items-center gap-4">
                            <div className="rounded-xl bg-white/10 ring-1 ring-white/20 px-5 py-4 text-center">
                                <div className="text-2xl font-bold">{assignPanelCandidates.length}</div>
                                <div className="text-xs font-medium text-white/80">Assigned Panels</div>
                            </div>
                            <div className="rounded-xl bg-white/10 ring-1 ring-white/20 px-5 py-4 text-center">
                                <div className="text-2xl font-bold">{queueCandidates.length}</div>
                                <div className="text-xs font-medium text-white/80">In Queue</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-3">
                    <h2 className="text-lg font-semibold text-gray-900">Assigned Panels</h2>
                    {loading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                            {Array.from({ length: 3 }).map((_, i) => (
                                <div key={i} className="bg-white rounded-2xl border border-gray-200 shadow-xl p-6">
                                    <div className="h-6 w-24 rounded-full bg-slate-200 animate-pulse mb-4" />
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="h-6 w-40 rounded bg-slate-200 animate-pulse" />
                                        <div className="h-6 w-28 rounded bg-slate-200 animate-pulse" />
                                    </div>
                                    <div className="h-4 w-48 rounded bg-slate-200 animate-pulse mb-4" />
                                    <div className="h-4 w-36 rounded bg-slate-200 animate-pulse mb-4" />
                                    <div className="h-4 w-44 rounded bg-slate-200 animate-pulse" />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                            {assignPanelCandidates.map((c, idx) => (
                                <div
                                    key={idx}
                                    className="bg-white rounded-lg border border-gray-200 shadow-md hover:shadow-lg transition-all duration-300 p-5 w-full h-[380px] flex flex-col overflow-hidden"
                                >
                                    {/* Room badge - LARGER */}
                                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-blue-600 text-white text-base font-bold mb-3 w-fit flex-shrink-0">
                                        <Building2 className="h-5 w-5 flex-shrink-0" />
                                        <span className="truncate">{c.room_number || "Room"}</span>
                                    </div>

                                    {/* Candidate name - LARGER */}
                                    <div className="mb-3 flex-shrink-0">
                                        <h3 className="text-2xl sm:text-4xl font-black text-gray-900 leading-tight break-words line-clamp-2">
                                            {c.candidaten_name || c.candidate_name || "Candidate"}
                                        </h3>
                                    </div>

                                    {/* Status badge - LARGER */}
                                    <div className="mb-3 flex-shrink-0">
                                        <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-bold ${statusColor(c.interview_status)}`}>
                                            {c.interview_status === "Interview Complete" ? (
                                                <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
                                            ) : (
                                                <Clock className="h-4 w-4 flex-shrink-0" />
                                            )}
                                            <span className="truncate">{c.interview_status || "Started"}</span>
                                        </span>
                                    </div>

                                    {/* Exam and Post - LARGER */}
                                    <div className="bg-gray-50 rounded-md p-3 mb-3 flex-shrink-0 border border-gray-100">
                                        <p className="text-base font-bold text-gray-900 mb-1 truncate">
                                            {c.examname || "Exam"}
                                        </p>
                                        <p className="text-sm text-gray-600 truncate">
                                            {c.post || "Post"}
                                        </p>
                                    </div>

                                    {/* Date - LARGER */}
                                    <div className="flex items-center gap-3 mb-3 flex-shrink-0">
                                        <div className="w-9 h-9 rounded-md bg-blue-100 flex items-center justify-center flex-shrink-0">
                                            <Calendar className="h-5 w-5 text-blue-600" />
                                        </div>
                                        <span className="text-base text-gray-900 font-semibold truncate flex-1 min-w-0">
                                            {c.examdate || c.exam_date || "Date not set"}
                                        </span>
                                    </div>

                                    {/* Interviewer - LARGER */}
                                    <div className="flex items-center gap-3 flex-shrink-0 mt-auto">
                                        <div className="w-9 h-9 rounded-md bg-purple-100 flex items-center justify-center flex-shrink-0">
                                            <User className="h-5 w-5 text-purple-600" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs text-gray-500 font-medium">Interviewer</p>
                                            <p className="text-base text-gray-900 font-bold truncate">
                                                {c.inter_viewer_name || "Not assigned"}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {assignPanelCandidates.length === 0 && (
                                <div className="col-span-full flex flex-col items-center justify-center py-12">
                                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                                        <Building2 className="h-8 w-8 text-gray-400" />
                                    </div>
                                    <p className="text-gray-500 text-base font-semibold">No assigned panels</p>
                                    <p className="text-gray-400 text-sm mt-1">Panels will appear here once assigned</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <div className="space-y-4">
                    <h2 className="text-2xl font-bold text-gray-900">Queue Candidates</h2>
                    <div className="bg-white rounded-2xl border border-gray-200 shadow-xl">
                        <div className="p-6 overflow-x-auto">
                            {/* <div className="flex items-center justify-between mb-4">
                                <div className="text-sm text-slate-500">{lastUpdated ? `Updated ${Math.max(0, Math.floor((Date.now()-lastUpdated)/1000))}s ago` : "Not updated yet"}</div>
                                {refreshing && <div className="text-xs px-2 py-1 rounded bg-slate-100 text-slate-700 border border-slate-200">Refreshing…</div>}
                            </div> */}
                            <DataTable<QueueCandidate> data={queueCandidates} columns={queueColumns} isLoading={loading} />
                        </div >
                    </div >
                </div >
            </div >
        </div >
    )
}