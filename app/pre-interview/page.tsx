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
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div className="flex items-center gap-2">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-blue-50 border border-blue-100 text-blue-700 text-xs font-semibold">
                            <Users className="h-4 w-4" />
                            Pre-Interview
                        </div>
                        <span className="text-xs text-gray-500">Assigned panels and candidate queue</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-white border border-gray-200">
                            <Building2 className="h-4 w-4 text-gray-600" />
                            <span className="text-xs font-semibold text-gray-700">{assignPanelCandidates.length} Panels</span>
                        </div>
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-white border border-gray-200">
                            <Users className="h-4 w-4 text-gray-600" />
                            <span className="text-xs font-semibold text-gray-700">{queueCandidates.length} In Queue</span>
                        </div>
                    </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-2">
                    <div className="space-y-3">
                        <h2 className="text-base font-bold text-gray-900">Assigned Panels</h2>
                        {loading ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {Array.from({ length: 3 }).map((_, i) => (
                                    <div key={i} className="bg-white rounded-xl border border-gray-200 shadow p-4">
                                        <div className="h-5 w-24 rounded-full bg-slate-200 animate-pulse mb-3" />
                                        <div className="h-4 w-40 rounded bg-slate-200 animate-pulse mb-3" />
                                        <div className="h-4 w-48 rounded bg-slate-200 animate-pulse mb-3" />
                                        <div className="h-4 w-36 rounded bg-slate-200 animate-pulse" />
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {assignPanelCandidates.map((c, idx) => (
                                    <div key={idx} className="bg-white rounded-xl border border-gray-200 shadow-md hover:shadow-lg transition-all p-5 flex flex-col gap-3">
                                        <div className="flex items-center justify-between">
                                            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-blue-600 text-white text-sm font-semibold">
                                                <Building2 className="h-4 w-4" />
                                                <span className="truncate">{c.room_number || "Room"}</span>
                                            </div>
                                            <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-bold ${statusColor(c.interview_status)}`}>
                                                {c.interview_status === "Interview Complete" ? <CheckCircle2 className="h-3 w-3" /> : <Clock className="h-3 w-3" />}
                                                <span className="truncate">{c.interview_status || "Started"}</span>
                                            </span>
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold text-gray-900 truncate">{c.candidaten_name || c.candidate_name || "Candidate"}</h3>
                                            <div className="mt-1 rounded-md bg-gray-50 border border-gray-100 px-3 py-2">
                                                <p className="text-sm font-semibold text-gray-900 truncate">{c.examname || "Exam"}</p>
                                                <p className="text-xs text-gray-600 truncate">{c.post || "Post"}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-md bg-blue-100 flex items-center justify-center">
                                                <Calendar className="h-4 w-4 text-blue-600" />
                                            </div>
                                            <span className="text-sm text-gray-900 font-semibold truncate flex-1">{c.examdate || c.exam_date || "Date not set"}</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-md bg-purple-100 flex items-center justify-center">
                                                <User className="h-4 w-4 text-purple-600" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-xs text-gray-500">Interviewer</p>
                                                <p className="text-sm text-gray-900 font-semibold truncate">{c.inter_viewer_name || "Not assigned"}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                {assignPanelCandidates.length === 0 && (
                                    <div className="col-span-full flex flex-col items-center justify-center py-10">
                                        <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center mb-2">
                                            <Building2 className="h-7 w-7 text-gray-400" />
                                        </div>
                                        <p className="text-gray-500 text-sm font-semibold">No assigned panels</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                    <div className="space-y-3">
                        <h2 className="text-base font-bold text-gray-900">Queue Candidates</h2>
                        <div className="bg-white rounded-xl border border-gray-200 shadow-md">
                            <div className="p-5 overflow-x-auto">
                                <DataTable<QueueCandidate> data={queueCandidates} columns={queueColumns} isLoading={loading} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}