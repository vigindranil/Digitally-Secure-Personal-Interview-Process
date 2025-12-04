"use client"
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Slider } from "@/components/ui/slider"
import { getUser } from "@/hooks/getUser";
import { useToast } from "@/components/ui/use-toast";
import { callAPIWithEnc } from "@/lib/commonApi";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";


type CurrentCandidate = {
    candidate_id: number
    candidate_full_name: string
    roll_number: string
    category: string
    date_of_birth: string
    applied_for: string
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
    const [tech, setTech] = useState(8.5)
    const [comms, setComms] = useState(7)
    const [analytical, setAnalytical] = useState(9)
    const [hr, setHr] = useState(8)
    const [remarks, setRemarks] = useState("")
    const totalScore = tech + comms + analytical + hr
    const [submitting, setSubmitting] = useState(false)

    const params = useParams()
    const candidateId = params.candidateId || params.id


    useEffect(() => {
        (async () => {
            const u = await getUser()
            setUser(u)
            try {
                const s = sessionStorage.getItem("candidateScoreContext")
                if (s) setCtx(JSON.parse(s))
            } catch {}
            if (u) {
                getCandidateInfo(u)
            }
        })()
    }, [])


    useEffect(() => {
        console.log("get user:", user);
    }, [user])



    const scoreBadge = (s: number) => (s >= 7 ? "bg-emerald-100 text-emerald-700" : s >= 4 ? "bg-amber-100 text-amber-700" : "bg-rose-100 text-rose-700")



    const getCandidateInfo = async (u: any) => {
        try {
            const response = await callAPIWithEnc(
                "/admin/getCandidateByInterviewer",
                "POST",
                {
                    candidate_id: Number(candidateId),
                    loginuser_id: u?.user_id || 0,
                }
            )
            if (response?.status === 0 && response?.data) {
                const d = response.data
                setCurrentCandidate({
                    candidate_id: Number(d.candidate_id ?? 0),
                    candidate_full_name: String(d.candidate_name ?? ""),
                    roll_number: String(d.roll_number ?? ""),
                    category: String(d.category ?? ""),
                    date_of_birth: String(d.date_of_birth ?? ""),
                    applied_for: String(d.applied_for ?? ""),
                    email: String(d.email ?? ""),
                    phone: String(d.phone ?? ""),
                    image_url: d.image_url ?? null,
                    verify_status: Number(d.verify_status ?? 0),
                })
            } else {
                toast({ title: "Error", description: "Failed to load candidate info.", variant: "destructive" })
            }
        } catch (e: any) {
            toast({ title: "Error", description: e?.message || "Something went wrong.", variant: "destructive" })
        }
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
                interview_id: Number(ctx?.interview_id || 0),
                interviewer_user_id: Number(user?.user_id || 0),
                schedule_id: Number(ctx?.schedule_id || user?.schedule_id || 0),
                candidate_id: Number(currentCandidate.candidate_id || 0),
                approval_id: Number(ctx?.approval_id || 1),
                remarks,
                lstScore: [
                    { categoryid: 1, score: Number(tech) },
                    { categoryid: 2, score: Number(comms) },
                    { categoryid: 3, score: Number(analytical) },
                    { categoryid: 4, score: Number(hr) },
                ],
            }

            const response = await callAPIWithEnc("/admin/UpdateInterviewerApproval", "POST", payload)
            if (response?.status === 0) {
                toast({ title: "Evaluation Submitted", description: "Interviewer approval saved successfully." })
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
                        <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium border ${getStatusColor(currentCandidate.verify_status)}`}>
                            {mapStatusText(currentCandidate.verify_status)}
                        </div>
                    )}
                </div>
                {currentCandidate && (
                    <CardDescription className="text-indigo-50">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
                            <div className="text-xs">
                                <div className="font-semibold">{currentCandidate.candidate_full_name}</div>
                                <div className="font-mono">{currentCandidate.roll_number}</div>
                                <div className="text-indigo-100">{currentCandidate.category}</div>
                            </div>
                            <div className="text-xs">
                                <div>DOB: {currentCandidate.date_of_birth}</div>
                                <div>Applied For: {currentCandidate.applied_for}</div>
                                <div>Email: {currentCandidate.email}</div>
                                <div>Phone: {currentCandidate.phone}</div>
                            </div>
                        </div>
                    </CardDescription>
                )}
            </CardHeader>
            <CardContent className="space-y-8">
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
