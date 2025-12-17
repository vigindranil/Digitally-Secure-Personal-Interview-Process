"use client"
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Slider } from "@/components/ui/slider"
import { getUser } from "@/hooks/getUser";
import { useToast } from "@/components/ui/use-toast";
import { callAPIWithEnc } from "@/lib/commonApi";
import { useParams, useRouter } from "next/navigation";
import { User, Hash, CalendarDays, ClipboardList, GraduationCap, Mail, Phone, CheckCircle2, Award, TrendingUp, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";

type CurrentCandidate = {
    candidate_id: number
    interview_id: number
    candidate_name: string
    roll_number: string
    candidate_roll_no: string
    category: string
    date_of_birth: string
    applied_for: string
    exam_name: string
    post_name: string
    candidate_gender: string
    email: string
    phone: string
    image_url?: string | null
    verify_status?: number
}

const CandidateScorePage = () => {
    const [currentCandidate, setCurrentCandidate] = useState<CurrentCandidate | null>(null)
    const [user, setUser] = useState<any>(null)
    const { toast } = useToast()
    const [ctx, setCtx] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [verificationStatusId, setVerificationStatusId] = useState<number | null>(null)
    const [tech, setTech] = useState(0)
    const [comms, setComms] = useState(0)
    const [analytical, setAnalytical] = useState(0)
    const [hr, setHr] = useState(0)
    const [remarks, setRemarks] = useState("")
    const totalScore = tech + comms + analytical + hr
    const [submitting, setSubmitting] = useState(false)
    const router = useRouter()

    const params = useParams()
    const candidateId = params.candidateId || params.id

    useEffect(() => {
        (async () => {
            const u = await getUser()
            setUser(u)
            try {
                const s = sessionStorage.getItem("candidateScoreContext")
                if (s) setCtx(JSON.parse(s))
            } catch { }
            if (u) {
                fetchCurrentCandidate(u)
            }
        })()
    }, [])

    const scoreBadge = (s: number) => {
        if (s >= 7) return "bg-gradient-to-r from-emerald-500 to-green-500 text-white"
        if (s >= 4) return "bg-gradient-to-r from-amber-500 to-orange-500 text-white"
        return "bg-gradient-to-r from-rose-500 to-red-500 text-white"
    }

    const fetchCurrentCandidate = (u: any) => {
        (async () => {
            try {
                const response = await callAPIWithEnc("/admin/getCandidateByInterviewer", "POST", {
                    schedule_id: u?.schedule_id || 0,
                    status_id: 42,
                    user_id: u?.user_id || 0,
                })
                const raw = response?.status === 0 ? response?.data : response
                const d = Array.isArray(raw) ? raw[0] : raw
                if (d && d.candidate_id) {
                    setCurrentCandidate({
                        candidate_id: Number(d.candidate_id ?? 0),
                        interview_id: Number(d.interview_id ?? 0),
                        candidate_name: String(d.candidate_name ?? d.candidate_name ?? ""),
                        roll_number: String(d.roll_number ?? ""),
                        candidate_roll_no: String(d.candidate_roll_no ?? d.roll_number ?? ""),
                        category: String(d.category ?? ""),
                        date_of_birth: String(d.candidate_dob ?? ""),
                        applied_for: String(d.applied_for ?? ""),
                        exam_name: String(d.exam_name ?? d.applied_for ?? ""),
                        post_name: String(d.post_name ?? d.applied_for ?? ""),
                        candidate_gender: String(d.candidate_gender ?? ""),
                        email: String(d.email ?? ""),
                        phone: String(d.phone ?? ""),
                        image_url: d.image_url ?? null,
                        verify_status: Number(d.overall_verify_status ?? 0),
                    })
                    setVerificationStatusId(Number(d.verify_status ?? 0) || null)
                } else {
                    setCurrentCandidate(null)
                }
            } catch (e) {
                setCurrentCandidate(null)
            } finally {
                setLoading(false)
            }
        })()
    }

    const submitInterviewerApproval = async () => {
        try {
            setSubmitting(true)
            if (!currentCandidate || !user) {
                toast({ title: "Error", description: "Missing candidate or user context.", variant: "destructive" })
                return
            }

            const payload = {
                interview_id: Number(currentCandidate?.interview_id || 0),
                interviewer_user_id: Number(user?.user_id || 0),
                schedule_id: Number(user?.schedule_id || 0),
                candidate_id: Number(currentCandidate.candidate_id || 0),
                approval_id: 50,
                remarks,
                lstScore: [
                    { categoryid: 1, score: tech.toFixed(1) },
                    { categoryid: 2, score: comms.toFixed(1) },
                    { categoryid: 3, score: analytical.toFixed(1) },
                    { categoryid: 4, score: hr.toFixed(1) },
                ],
            }

            const response = await callAPIWithEnc("/admin/updateInterviewerApproval", "POST", payload)
            if (response?.status === 0) {
                toast({ title: "Evaluation Submitted", description: "Interviewer approval saved successfully." })
                router.push(`/interviews`)
            } else {
                toast({ title: "Error", description: "Failed to submit interviewer approval.", variant: "destructive" })
            }
        } catch (e: any) {
            toast({ title: "Error", description: e?.message || "Something went wrong.", variant: "destructive" })
        } finally {
            setSubmitting(false)
        }
    }

    const mapStatusText = (id?: number | null) => {
        if (id === 42) return "Verified"
        if (id === 46) return "Not Approved"
        return "Pending"
    }

    const getStatusColor = (id?: number | null) => {
        if (id === 42) return "bg-gradient-to-r from-emerald-500 to-green-500 text-white border-0"
        if (id === 46) return "bg-gradient-to-r from-rose-500 to-red-500 text-white border-0"
        return "bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0"
    }

    const getPerformanceLevel = (score: number) => {
        if (score >= 32) return { text: "Outstanding", color: "text-emerald-600" }
        if (score >= 24) return { text: "Good", color: "text-blue-600" }
        if (score >= 16) return { text: "Average", color: "text-amber-600" }
        return { text: "Below Average", color: "text-rose-600" }
    }

    const performance = getPerformanceLevel(totalScore)

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-4 px-3 sm:px-4 md:px-6">
            <div className="mx-auto max-w-6xl w-full">
                {/* Compact Header */}
                <div className="mb-4 flex items-center gap-2 sm:gap-3">
                    <div className="p-2 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg">
                        <Award className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                    </div>
                    <div>
                        <h1 className="text-lg sm:text-xl md:text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                            Candidate Evaluation
                        </h1>
                        <p className="text-xs sm:text-sm text-slate-500">Score and evaluate candidate performance</p>
                    </div>
                </div>

                <Card className="border-0 shadow-xl rounded-2xl overflow-hidden bg-white/90 backdrop-blur-sm">
                    <CardHeader className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 text-white py-4 px-4 sm:px-6">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                            <CardTitle className="text-white text-base sm:text-lg font-bold flex items-center gap-2">
                                <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5" />
                                Score Evaluation
                            </CardTitle>
                            {currentCandidate && (
                                <div className="flex flex-wrap items-center gap-2">
                                    <Badge className="bg-white/20 backdrop-blur-sm text-white border-white/30 px-2 py-1 text-[10px] sm:text-xs">
                                        {currentCandidate.exam_name}
                                    </Badge>
                                    <Badge className="bg-white/20 backdrop-blur-sm text-white border-white/30 px-2 py-1 text-[10px] sm:text-xs">
                                        {currentCandidate.post_name}
                                    </Badge>
                                    <Badge className={`${getStatusColor(currentCandidate.verify_status)} px-2 py-1 text-[10px] sm:text-xs flex items-center gap-1`}>
                                        <CheckCircle2 className="h-3 w-3" />
                                        {mapStatusText(currentCandidate.verify_status)}
                                    </Badge>
                                </div>
                            )}
                        </div>
                    </CardHeader>

                    <CardContent className="p-4 sm:p-5 md:p-6">
                        {currentCandidate && (
                            <div className="space-y-4 sm:space-y-5">
                                {/* Candidate Info Section - Compact */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {/* Profile */}
                                    <div className="md:col-span-1 flex flex-col items-center text-center space-y-2">
                                        <div className="relative group">
                                            <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl blur opacity-20 group-hover:opacity-30 transition"></div>
                                            <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden border-2 border-white shadow-lg bg-slate-100">
                                                {currentCandidate.image_url ? (
                                                    <img 
                                                        src={currentCandidate.image_url} 
                                                        alt={currentCandidate.candidate_name} 
                                                        className="w-full h-full object-cover" 
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center bg-slate-100">
                                                        <User className="h-10 w-10 sm:h-12 sm:w-12 text-slate-400" />
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <div className="space-y-1">
                                            <h3 className="text-sm sm:text-base font-bold text-slate-800 leading-tight">
                                                {currentCandidate.candidate_name}
                                            </h3>
                                            <div className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-2 py-0.5 border border-indigo-200">
                                                <Hash className="h-3 w-3 text-indigo-600" />
                                                <span className="text-xs font-semibold text-indigo-900">
                                                    {currentCandidate.candidate_roll_no || currentCandidate.roll_number}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Candidate Details */}
                                    <div className="md:col-span-2">
                                        <div className="bg-gradient-to-br from-slate-50 to-indigo-50 rounded-xl p-3 sm:p-4 border border-indigo-100">
                                            <div className="grid grid-cols-2 gap-3">
                                                {[
                                                    { icon: User, label: "Gender", value: currentCandidate.candidate_gender },
                                                    { icon: CalendarDays, label: "DOB", value: currentCandidate.date_of_birth },
                                                    { icon: Mail, label: "Email", value: currentCandidate.email },
                                                    { icon: Phone, label: "Phone", value: currentCandidate.phone },
                                                ].map((item, idx) => (
                                                    <div key={idx} className="flex items-start gap-2 bg-white rounded-lg p-2 shadow-sm">
                                                        <div className="p-1.5 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 shadow-sm mt-0.5">
                                                            <item.icon className="h-3 w-3 text-white" />
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">{item.label}</p>
                                                            <p className="text-xs font-semibold text-slate-800 break-words leading-tight">{item.value}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Score Section - Compact Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                                    {[
                                        { label: "Technical Knowledge", value: tech, setter: setTech, color: "blue" },
                                        { label: "Communication Skills", value: comms, setter: setComms, color: "purple" },
                                        { label: "Analytical Ability", value: analytical, setter: setAnalytical, color: "green" },
                                        { label: "Behavioral / HR", value: hr, setter: setHr, color: "pink" },
                                    ].map((item, idx) => (
                                        <div key={idx} className="bg-gradient-to-br from-slate-50 to-indigo-50 rounded-xl p-3 sm:p-4 border border-indigo-100">
                                            <div className="flex items-center justify-between mb-2">
                                                <Label className="text-xs sm:text-sm font-semibold text-slate-700">{item.label}</Label>
                                                <span className={`font-mono font-bold px-2 py-1 rounded-lg text-xs ${scoreBadge(item.value)} shadow-sm`}>
                                                    {Math.round(item.value)}
                                                </span>
                                            </div>
                                            <Slider 
                                                value={[item.value]} 
                                                onValueChange={(v) => item.setter(Math.round(v[0]))} 
                                                min={1} 
                                                max={10} 
                                                step={1} 
                                                className="w-full mb-1" 
                                            />
                                            <div className="flex justify-between text-[9px] sm:text-[10px] font-medium text-slate-400 uppercase tracking-wider">
                                                <span>Poor</span>
                                                <span>Excellent</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Remarks Section - Compact */}
                                <div className="bg-gradient-to-br from-slate-50 to-indigo-50 rounded-xl p-3 sm:p-4 border border-indigo-100">
                                    <Label className="text-xs sm:text-sm font-semibold text-slate-700 mb-2 block">Panel Remarks</Label>
                                    <Textarea 
                                        value={remarks} 
                                        onChange={(e) => setRemarks(e.target.value)} 
                                        placeholder="Enter detailed observations..." 
                                        className="min-h-[60px] sm:min-h-[80px] text-xs sm:text-sm" 
                                    />
                                </div>
                            </div>
                        )}
                    </CardContent>

                    <CardFooter className="flex flex-col sm:flex-row sm:justify-between items-stretch sm:items-center border-t px-4 sm:px-6 py-3 sm:py-4 gap-3 bg-slate-50">
                        <div className="flex items-center justify-between sm:justify-start gap-4">
                            <div className="text-xs sm:text-sm">
                                <span className="text-slate-600">Total Score:</span>
                                <span className="font-bold text-slate-900 ml-1 text-base sm:text-lg">
                                    {totalScore}
                                </span>
                                <span className="text-slate-500 text-xs"> / 40</span>
                            </div>
                            {/* <div className="flex items-center gap-2">
                                <Sparkles className={`h-4 w-4 ${performance.color}`} />
                                <span className={`text-xs sm:text-sm font-bold ${performance.color}`}>
                                    {performance.text}
                                </span>
                            </div> */}
                        </div>
                        <Button 
                            size="sm"
                            className="w-full sm:w-auto px-4 sm:px-6 py-2 text-xs sm:text-sm font-bold bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all hover:scale-105 rounded-lg" 
                            onClick={submitInterviewerApproval} 
                            disabled={submitting || !currentCandidate}
                        >
                            {submitting ? "Submitting..." : "Submit Evaluation"}
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
}

export default CandidateScorePage