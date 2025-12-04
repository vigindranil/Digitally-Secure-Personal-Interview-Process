"use client"

import { useEffect, useState } from "react"
import { Calendar, CheckCircle2, AlertCircle, Users, Building2, User } from "lucide-react"
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

    useEffect(() => {
        ; (async () => {
            const u = await getUser()
            setUser(u)
            if (u) {
                await fetchPreInterviewData(u)
            }
        })()
    }, [])

    const fetchPreInterviewData = async (u: any) => {
        try {
            setLoading(true)
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
            setLoading(false)
        }
    }

    const statusColor = (s?: string) => {
        if (s === "Interview Complete") return "bg-green-50 text-green-700 border-green-200"
        if (s === "Panel Assigned") return "bg-yellow-50 text-yellow-700 border-yellow-200"
        return "bg-slate-50 text-slate-700 border-slate-200"
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
                        <div className="text-center py-12 text-blue-700 font-semibold">Loading...</div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                            {assignPanelCandidates.map((c, idx) => (
                                <div key={idx} className="bg-white rounded-2xl border border-gray-200 shadow-xl hover:shadow-2xl hover:-translate-y-0.5 transition-all p-6">
                                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 text-blue-700 font-bold mb-4 border border-blue-200">
                                        <Building2 className="h-4 w-4" />
                                        {c.room_number || "Room"}
                                    </div>
                                    <div className="flex items-center justify-between mb-3">
                                        <h3 className="text-xl sm:text-2xl font-semibold text-gray-900">{c.candidaten_name || c.candidate_name || "Candidate"}</h3>
                                        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-semibold border ${statusColor(c.interview_status)}`}>
                                            {c.interview_status === "Interview Complete" ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
                                            {c.interview_status}
                                        </span>
                                    </div>
                                    <p className="text-sm sm:text-base text-gray-700 mb-4">{c.examname || "Exam"} • {c.post || "Post"}</p>
                                    <div className="flex items-center gap-2 text-sm sm:text-base text-gray-600 mb-4">
                                        <Calendar className="h-5 w-5" />
                                        <span>{c.examdate || c.exam_date || "—"}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-gray-700">
                                        <User className="h-4 w-4 text-gray-500" />
                                        <span>Interviewer: <span className="font-medium">{c.inter_viewer_name || "—"}</span></span>
                                    </div>
                                </div>
                            ))}
                            {assignPanelCandidates.length === 0 && (
                                <div className="col-span-full text-center py-12 text-gray-500">No assigned panels</div>
                            )}
                        </div>
                    )}
                </div>

                <div className="space-y-4">
                    <h2 className="text-2xl font-bold text-gray-900">Queue Candidates</h2>
                    <div className="bg-white rounded-2xl border border-gray-200 shadow-xl">
                        <div className="p-6">
                            <DataTable<QueueCandidate> data={queueCandidates} columns={queueColumns} isLoading={loading} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}