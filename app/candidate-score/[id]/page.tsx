"use client"
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { getUser } from "@/hooks/getUser";
import { useToast } from "@/hooks/use-toast";
import { callAPIWithEnc } from "@/lib/commonApi";
import { Slider } from "@radix-ui/react-slider";
import { CloudCog } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";


type CurrentCandidate = {
    candidate_id: number
    candidate_roll_no: string
    interview_id: string
    exam_name: string
    post_name: string
    candidate_full_name: string
    candidate_gender: string
    candidate_dob: string
}


const CandidateScorePage = () => {
    const [currentCandidate, setCurrentCandidate] = useState<CurrentCandidate | null>(null)
    const [user, setUser] = useState<any>(null)
    const { toast } = useToast()
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
        const fetchUser = async () => {
            const userData = await getUser()
            setUser(userData)
        }
        fetchUser()
    }, [])



    const scoreBadge = (s: number) => (s >= 7 ? "bg-emerald-100 text-emerald-700" : s >= 4 ? "bg-amber-100 text-amber-700" : "bg-rose-100 text-rose-700")
    const statusBadgeClass = (id?: number | null) => {
        if (id === 42) return "bg-green-500/20 text-green-700 border-green-500/30"
        if (id === 46) return "bg-rose-500/20 text-rose-700 border-rose-500/30"
        return "bg-slate-100 text-slate-700 border-slate-200"
    }


    const updateCandidateVerifyStatus = async () => {
        console.log("Updating candidate verify status for log in ID:", user?.user_id);
        try {
            const response = await callAPIWithEnc(
                "/admin/getCandidateInfoByID",
                "POST",
                {
                    candidate_id: Number(candidateId),
                    // status_id: statusId,
                    loginuser_id: user?.user_id || 0,
                    // interview_id: interviewId
                }
            )

            if (response?.status === 0) {
                // console.log(response.data);

                toast({ title: "Candidate Verified", description: "Marked as verified successfully." })
                setCurrentCandidate(response?.data.candidate_id || null)
            } else {
                toast({ title: "Error", description: "Failed to update candidate status.", variant: "destructive" })
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
                interview_id: Number(currentCandidate.interview_id || 0),
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
            } else {
                toast({ title: "Error", description: "Failed to submit interviewer approval.", variant: "destructive" })
            }
        } catch (e: any) {
            toast({ title: "Error", description: e?.message || "Something went wrong.", variant: "destructive" })
        } finally {
            setSubmitting(false)
        }
    }




    useEffect(() => {
        updateCandidateVerifyStatus()
    }, [])




    return (<div className="lg:col-span-3">
        <Card className="border border-slate-200 shadow-xl rounded-xl overflow-hidden">
            <CardHeader>
                <CardTitle>Evaluation Form</CardTitle>
                <CardDescription>Rate the candidate on the following criteria (1-10).</CardDescription>
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