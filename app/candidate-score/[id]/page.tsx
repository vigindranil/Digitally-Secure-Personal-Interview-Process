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
import { User, Hash, CalendarDays, ClipboardList, GraduationCap, Mail, Phone as PhoneIcon } from "lucide-react";
import { useEffect, useState } from "react";


type CurrentCandidate = {
    candidate_id: number
    interview_id: number
    candidate_full_name: string
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


    useEffect(() => {
        console.log("get user:", user);
    }, [user])



    const scoreBadge = (s: number) => (s >= 7 ? "bg-emerald-100 text-emerald-700" : s >= 4 ? "bg-amber-100 text-amber-700" : "bg-rose-100 text-rose-700")
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
                        candidate_full_name: String(d.candidate_full_name ?? d.candidate_name ?? ""),
                        roll_number: String(d.roll_number ?? ""),
                        candidate_roll_no: String(d.candidate_roll_no ?? d.roll_number ?? ""),
                        category: String(d.category ?? ""),
                        date_of_birth: String(d.date_of_birth ?? ""),
                        applied_for: String(d.applied_for ?? ""),
                        exam_name: String(d.exam_name ?? d.applied_for ?? ""),
                        post_name: String(d.post_name ?? d.applied_for ?? ""),
                        candidate_gender: String(d.candidate_gender ?? ""),
                        email: String(d.email ?? ""),
                        phone: String(d.phone ?? ""),
                        image_url: d.image_url ?? null,
                        verify_status: Number(d.verify_status ?? 0),
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
    useEffect(() => {
        console.log("Current Candidate:", currentCandidate);
    }, [currentCandidate])
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
        if (id === 42) return "bg-green-50 text-green-700 border-green-200"
        if (id === 46) return "bg-rose-50 text-rose-700 border-rose-200"
        return "bg-amber-50 text-amber-700 border-amber-200"
    }
    return (<div className="mx-auto max-w-4xl w-full px-4">
        <Card className="border border-slate-200 shadow-xl rounded-xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-t-xl">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-white">Candidate Score</CardTitle>
                    {currentCandidate && (
                        <div className="flex items-center gap-2">
                            <Badge className="bg-white/20 text-white border-white/30">{currentCandidate.exam_name}</Badge>
                            <Badge className="bg-white/20 text-white border-white/30">{currentCandidate.post_name}</Badge>
                            <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium border ${getStatusColor(currentCandidate.verify_status)}`}>
                                {mapStatusText(currentCandidate.verify_status)}
                            </div>
                        </div>
                    )}
                </div>
            </CardHeader>
            <CardContent className="space-y-8 pt-6">
                {currentCandidate && (
                    <>
                        <div className="flex flex-col items-center space-y-4">
                            <div className="relative h-28 w-28 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 text-white flex items-center justify-center text-3xl font-bold shadow-lg">
                                {(currentCandidate.candidate_full_name || "").charAt(0).toUpperCase()}
                            </div>
                            <div className="text-center space-y-1">
                                <h3 className="text-xl font-bold text-slate-900">{currentCandidate.candidate_full_name}</h3>
                                <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                                    <Hash className="h-4 w-4" />
                                    {currentCandidate.candidate_roll_no || currentCandidate.roll_number}
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
                            <div className="flex items-center gap-3">
                                <User className="h-5 w-5 text-slate-500" />
                                <div>
                                    <p className="text-xs text-muted-foreground">Gender</p>
                                    <p className="text-sm font-semibold text-slate-900">{currentCandidate.candidate_gender}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <CalendarDays className="h-5 w-5 text-slate-500" />
                                <div>
                                    <p className="text-xs text-muted-foreground">DOB</p>
                                    <p className="text-sm font-semibold text-slate-900">{currentCandidate.date_of_birth}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <Mail className="h-5 w-5 text-slate-500" />
                                <div>
                                    <p className="text-xs text-muted-foreground">Email</p>
                                    <p className="text-sm font-semibold text-slate-900">{currentCandidate.email}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <PhoneIcon className="h-5 w-5 text-slate-500" />
                                <div>
                                    <p className="text-xs text-muted-foreground">Phone</p>
                                    <p className="text-sm font-semibold text-slate-900">{currentCandidate.phone}</p>
                                </div>
                            </div>
                        </div>
                    </>
                )}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <Label className="text-base">Technical Knowledge</Label>
                        <span className={`font-mono font-bold px-2 py-0.5 rounded-full text-xs ${scoreBadge(tech)}`}>{Math.round(tech)}</span>
                    </div>
                    <Slider value={[tech]} onValueChange={(v) => setTech(Math.round(v[0]))} min={1} max={10} step={1} className="w-full" />
                    <div className="flex justify-between text-[10px] font-medium text-slate-400 uppercase tracking-wider"><span>Poor</span><span>Excellent</span></div>
                </div>

                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <Label className="text-base">Communication Skills</Label>
                        <span className={`font-mono font-bold px-2 py-0.5 rounded-full text-xs ${scoreBadge(comms)}`}>{Math.round(comms)}</span>
                    </div>
                    <Slider value={[comms]} onValueChange={(v) => setComms(Math.round(v[0]))} min={1} max={10} step={1} className="w-full" />
                    <div className="flex justify-between text-[10px] font-medium text-slate-400 uppercase tracking-wider"><span>Poor</span><span>Excellent</span></div>
                </div>

                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <Label className="text-base">Analytical Ability</Label>
                        <span className={`font-mono font-bold px-2 py-0.5 rounded-full text-xs ${scoreBadge(analytical)}`}>{Math.round(analytical)}</span>
                    </div>
                    <Slider value={[analytical]} onValueChange={(v) => setAnalytical(Math.round(v[0]))} min={1} max={10} step={1} className="w-full" />
                    <div className="flex justify-between text-[10px] font-medium text-slate-400 uppercase tracking-wider"><span>Poor</span><span>Excellent</span></div>
                </div>

                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <Label className="text-base">Behavioral / HR</Label>
                        <span className={`font-mono font-bold px-2 py-0.5 rounded-full text-xs ${scoreBadge(hr)}`}>{Math.round(hr)}</span>
                    </div>
                    <Slider value={[hr]} onValueChange={(v) => setHr(Math.round(v[0]))} min={1} max={10} step={1} className="w-full" />
                    <div className="flex justify-between text-[10px] font-medium text-slate-400 uppercase tracking-wider"><span>Poor</span><span>Excellent</span></div>
                </div>

                <div className="space-y-2">
                    <Label>Panel Remarks</Label>
                    <Textarea value={remarks} onChange={(e) => setRemarks(e.target.value)} placeholder="Enter detailed observations..." className="min-h-[100px]" />
                </div>
            </CardContent>
            <CardFooter className="flex justify-between border-t px-6 py-4">
                <div className="text-sm text-muted-foreground">
                    Total Score: <span className="font-bold text-foreground">{totalScore.toFixed(1)} / 40</span>
                </div>
                <div className="flex items-center gap-2">
                    <Button size="lg" className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white shadow-lg hover:shadow-xl transition-all hover:scale-[1.02] focus:ring-4 focus:ring-violet-200" onClick={submitInterviewerApproval} disabled={submitting || !currentCandidate} aria-label="Submit evaluation">
                        {submitting ? "Submitting..." : "Submit Evaluation"}
                    </Button>
                </div>
            </CardFooter>
        </Card>
    </div>)
        ;
}
export default CandidateScorePage
