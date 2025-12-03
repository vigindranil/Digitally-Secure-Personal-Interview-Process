"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"
import { getUser } from "@/hooks/getUser"
import { Clock, User, Hash, CalendarDays, ClipboardList, GraduationCap, CheckCircle2, XCircle, X, MessageSquare, Brain } from "lucide-react"
import { callAPIWithEnc } from "@/lib/commonApi"

type CurrentCandidate = {
  candidate_id: number
  candidate_roll_no: string
  exam_name: string
  post_name: string
  candidate_full_name: string
  candidate_gender: string
  candidate_dob: string
}

export default function InterviewPage() {
  const [currentCandidate, setCurrentCandidate] = useState<CurrentCandidate | null>(null)
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [verificationStatusId, setVerificationStatusId] = useState<number | null>(null)
  const { toast } = useToast()
  const [tech, setTech] = useState(8.5)
  const [comms, setComms] = useState(7)
  const [analytical, setAnalytical] = useState(9)
  const [hr, setHr] = useState(8)
  const totalScore = tech + comms + analytical + hr
  const [ratingDialogOpen, setRatingDialogOpen] = useState(false)
  const [ratingCandidate, setRatingCandidate] = useState<any>(null)
  const ratingTopics = [
    { id: "tech", label: "Technical Knowledge", icon: <GraduationCap className="h-4 w-4 text-slate-500" /> },
    { id: "comms", label: "Communication Skills", icon: <MessageSquare className="h-4 w-4 text-slate-500" /> },
    { id: "analytical", label: "Analytical Ability", icon: <Brain className="h-4 w-4 text-slate-500" /> },
    { id: "hr", label: "Behavioral / HR", icon: <User className="h-4 w-4 text-slate-500" /> },
  ]
  const [ratingValues, setRatingValues] = useState<Record<string, number>>({ tech: 9, comms: 7, analytical: 9, hr: 8 })
  const handleRatingChange = (id: string, val: number) => setRatingValues((prev) => ({ ...prev, [id]: val }))
  const handleOpenRatings = () => {
    if (currentCandidate) {
      setRatingCandidate({
        name: currentCandidate.candidate_full_name,
        rollNo: currentCandidate.candidate_roll_no,
        photo: "/placeholder.svg",
      })
      setRatingDialogOpen(true)
    }
  }
  const handleSaveRatings = () => {
    setRatingDialogOpen(false)
    setRatingCandidate(null)
    toast({ title: "Evaluation submitted", description: "Ratings saved successfully." })
  }

  useEffect(() => {
    (async () => {
      const u = await getUser()
      setUser(u)
      if (u) {
        fetchCurrentCandidate(u)
      }
    })()
  }, [])
  const fetchCurrentCandidate = (u: any) => {
    (async () => {
      try {
        const response = await callAPIWithEnc("/admin/getCandidateByInterviewer", "POST", {
          schedule_id: u?.schedule_id || 0,
          status_id: 40,
          user_id: u?.user_id || 0,
        })
        const raw = response?.status === 0 ? response?.data : response
        const d = Array.isArray(raw) ? raw[0] : raw
        if (d && d.candidate_id) {
          setCurrentCandidate({
            candidate_id: Number(d.candidate_id ?? 0),
            candidate_roll_no: String(d.candidate_roll_no ?? ""),
            exam_name: String(d.exam_name ?? ""),
            post_name: String(d.post_name ?? ""),
            candidate_full_name: String(d.candidate_full_name ?? ""),
            candidate_gender: String(d.candidate_gender ?? ""),
            candidate_dob: String(d.candidate_dob ?? ""),
          })
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

  const mapStatusText = (id?: number | null) => {
    if (id === 42) return "Verified"
    if (id === 46) return "Not Approved"
    return "Pending"
  }

  const updateCandidateVerifyStatus = async (candidateId: number, statusId: number, r?: string) => {
    try {
      const response = await callAPIWithEnc(
        "/admin/updateCandidateVerifyStatus",
        "POST",
        {
          candidate_id: Number(candidateId),
          status_id: statusId,
          user_id: user?.user_id || 0,
          user_type_id: user?.user_type_id || 0,
          remarks: r || "",
          schedule_id: user?.schedule_id || 0,
        }
      )

      if (response?.status === 0) {
        setVerificationStatusId(statusId)
        if (statusId === 42) {
          toast({ title: "Candidate Verified", description: "Marked as verified successfully." })
        } else if (statusId === 46) {
          toast({ title: "Not Approved", description: "Candidate marked as not approved.", variant: "destructive" })
        } else {
          toast({ title: "Status Updated", description: "Candidate status updated." })
        }
      } else {
        toast({ title: "Error", description: "Failed to update candidate status.", variant: "destructive" })
      }
    } catch (e: any) {
      toast({ title: "Error", description: e?.message || "Something went wrong.", variant: "destructive" })
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Interview Panel #102</h1>
          <p className="text-sm text-muted-foreground">Session ID: INT-2025-8821</p>
        </div>
      </div>
      <div className="lg:col-span-3">
        <Card>
          <CardHeader className="bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-t-xl">
            <div className="flex items-center justify-between">
              <CardTitle className="text-white">Current Candidate</CardTitle>
              {currentCandidate && (
                <div className="flex items-center gap-2">
                  <Badge className="bg-white/20 text-white border-white/30">{currentCandidate.exam_name}</Badge>
                  <Badge className="bg-white/20 text-white border-white/30">{currentCandidate.post_name}</Badge>
                  <Badge className="bg-white/20 text-white border-white/30">
                    {mapStatusText(verificationStatusId)}
                  </Badge>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            {loading ? (
              <div className="flex flex-col items-center gap-4">
                <div className="h-24 w-24 rounded-full bg-slate-200 animate-pulse" />
                <div className="h-5 w-40 rounded bg-slate-200 animate-pulse" />
                <div className="h-4 w-24 rounded bg-slate-200 animate-pulse" />
              </div>
            ) : currentCandidate ? (
              <>
                <div className="flex flex-col items-center space-y-4">
                  <div className="relative h-28 w-28 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 text-white flex items-center justify-center text-3xl font-bold shadow-lg">
                    {(currentCandidate.candidate_full_name || "").charAt(0).toUpperCase()}
                  </div>
                  <div className="text-center space-y-1">
                    <h3 className="text-xl font-bold text-slate-900">{currentCandidate.candidate_full_name}</h3>
                    <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                      <Hash className="h-4 w-4" />
                      {currentCandidate.candidate_roll_no}
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
                      <p className="text-sm font-semibold text-slate-900">{currentCandidate.candidate_dob}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <GraduationCap className="h-5 w-5 text-slate-500" />
                    <div>
                      <p className="text-xs text-muted-foreground">Exam</p>
                      <p className="text-sm font-semibold text-slate-900">{currentCandidate.exam_name}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <ClipboardList className="h-5 w-5 text-slate-500" />
                    <div>
                      <p className="text-xs text-muted-foreground">Post</p>
                      <p className="text-sm font-semibold text-slate-900">{currentCandidate.post_name}</p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <Button
                    onClick={() => updateCandidateVerifyStatus(currentCandidate.candidate_id, 20)}
                    className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 shadow-sm"
                    aria-label="Verify candidate"
                  >
                    Verify Candidate
                  </Button>
                  <Button
                    onClick={() => updateCandidateVerifyStatus(currentCandidate.candidate_id, 46)}
                    variant="outline"
                    className="w-full sm:w-auto border-rose-200 text-rose-700 hover:bg-rose-50"
                    aria-label="Mark not approved"
                  >
                    Not Approved
                  </Button>
                </div>
              </>
            ) : (
              <div className="text-center text-sm text-muted-foreground">No candidate assigned</div>
            )}
          </CardContent>
        </Card>
      </div>
      <div className="lg:col-span-2 space-y-6 order-2">
        <Card>
          <CardHeader>
            <CardTitle>Evaluation Form</CardTitle>
            <CardDescription>Rate the candidate on the following criteria (1-10).</CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-base">Technical Knowledge</Label>
                <span className="font-mono font-bold">{tech.toFixed(1)}</span>
              </div>
              <Slider value={[tech]} onValueChange={(v) => setTech(v[0])} max={10} step={0.5} className="w-full" />
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-base">Communication Skills</Label>
                <span className="font-mono font-bold">{comms.toFixed(1)}</span>
              </div>
              <Slider value={[comms]} onValueChange={(v) => setComms(v[0])} max={10} step={0.5} className="w-full" />
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-base">Analytical Ability</Label>
                <span className="font-mono font-bold">{analytical.toFixed(1)}</span>
              </div>
              <Slider value={[analytical]} onValueChange={(v) => setAnalytical(v[0])} max={10} step={0.5} className="w-full" />
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-base">Behavioral / HR</Label>
                <span className="font-mono font-bold">{hr.toFixed(1)}</span>
              </div>
              <Slider value={[hr]} onValueChange={(v) => setHr(v[0])} max={10} step={0.5} className="w-full" />
            </div>

            <div className="space-y-2">
              <Label>Panel Remarks</Label>
              <Textarea placeholder="Enter detailed observations..." className="min-h-[100px]" />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between border-t px-6 py-4">
            <div className="text-sm text-muted-foreground">
              Total Score: <span className="font-bold text-foreground">{totalScore.toFixed(1)} / 40</span>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={handleOpenRatings}>Open Evaluation</Button>
              <Button size="lg" className="bg-green-600 hover:bg-green-700">
              Submit Evaluation
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>

      <div className="space-y-6 order-3">
        {/* <Card>
          <CardHeader className="bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-t-xl">
            <div className="flex items-center justify-between">
              <CardTitle className="text-white">Current Candidate</CardTitle>
              {currentCandidate && (
                <div className="flex items-center gap-2">
                  <Badge className="bg-white/20 text-white border-white/30">{currentCandidate.exam_name}</Badge>
                  <Badge className="bg-white/20 text-white border-white/30">{currentCandidate.post_name}</Badge>
                  <Badge className="bg-white/20 text-white border-white/30">
                    {mapStatusText(verificationStatusId)}
                  </Badge>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            {loading ? (
              <div className="flex flex-col items-center gap-4">
                <div className="h-24 w-24 rounded-full bg-slate-200 animate-pulse" />
                <div className="h-5 w-40 rounded bg-slate-200 animate-pulse" />
                <div className="h-4 w-24 rounded bg-slate-200 animate-pulse" />
              </div>
            ) : currentCandidate ? (
              <>
                <div className="flex flex-col items-center space-y-4">
                  <div className="relative h-28 w-28 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 text-white flex items-center justify-center text-3xl font-bold shadow-lg">
                    {(currentCandidate.candidate_full_name || "").charAt(0).toUpperCase()}
                  </div>
                  <div className="text-center space-y-1">
                    <h3 className="text-xl font-bold text-slate-900">{currentCandidate.candidate_full_name}</h3>
                    <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                      <Hash className="h-4 w-4" />
                      {currentCandidate.candidate_roll_no}
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
                      <p className="text-sm font-semibold text-slate-900">{currentCandidate.candidate_dob}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <GraduationCap className="h-5 w-5 text-slate-500" />
                    <div>
                      <p className="text-xs text-muted-foreground">Exam</p>
                      <p className="text-sm font-semibold text-slate-900">{currentCandidate.exam_name}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <ClipboardList className="h-5 w-5 text-slate-500" />
                    <div>
                      <p className="text-xs text-muted-foreground">Post</p>
                      <p className="text-sm font-semibold text-slate-900">{currentCandidate.post_name}</p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <Button
                    onClick={() => updateCandidateVerifyStatus(currentCandidate.candidate_id, 20)}
                    className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 shadow-sm"
                    aria-label="Verify candidate"
                  >
                    <CheckCircle2 className="h-4 w-4 mr-2" /> Verify Candidate
                  </Button>
                  <Button
                    onClick={() => updateCandidateVerifyStatus(currentCandidate.candidate_id, 46)}
                    variant="outline"
                    className="w-full sm:w-auto border-rose-200 text-rose-700 hover:bg-rose-50"
                    aria-label="Mark not approved"
                  >
                    <XCircle className="h-4 w-4 mr-2" /> Not Approved
                  </Button>
                </div>
              </>
            ) : (
              <div className="text-center text-sm text-muted-foreground">No candidate assigned</div>
            )}
          </CardContent>
        </Card> */}

        <Card>
          <CardHeader>
            <CardTitle>Queue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-3 rounded-lg border p-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-xs font-medium">
                    {i}
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <p className="truncate text-sm font-medium">Waiting Candidate {i}</p>
                    <p className="text-xs text-muted-foreground">Roll-2025-0{50 + i}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {ratingDialogOpen && ratingCandidate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setRatingDialogOpen(false)} />
          <div className="relative w-full max-w-xl bg-white rounded-xl shadow-2xl border border-slate-200 flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Evaluation</h2>
                <p className="text-sm text-slate-500 mt-1">Rate the candidate on key competencies.</p>
              </div>
              <button onClick={() => setRatingDialogOpen(false)} className="p-2 text-slate-400 hover:bg-slate-100 rounded-full transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="overflow-y-auto p-6 space-y-6">
              <div className="flex items-center gap-4 p-4 rounded-lg bg-slate-50 border border-slate-100">
                <img src={ratingCandidate.photo} alt={ratingCandidate.name} className="w-12 h-12 rounded-full object-cover border border-slate-200" />
                <div>
                  <p className="font-bold text-slate-900">{ratingCandidate.name}</p>
                  <p className="text-xs text-slate-500 font-mono">Roll: {ratingCandidate.rollNo}</p>
                </div>
                <div className="ml-auto text-right">
                  <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">Current Avg</p>
                  <p className="text-lg font-bold text-blue-600">
                    {(Object.values(ratingValues).reduce((sum, val) => sum + val, 0) / ratingTopics.length).toFixed(1)}
                    <span className="text-sm text-slate-400 font-normal">/10</span>
                  </p>
                </div>
              </div>
              <div className="space-y-6">
                {ratingTopics.map((topic) => (
                  <div key={topic.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                        <span>{topic.icon}</span> {topic.label}
                      </label>
                      <span className="text-sm font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded">{ratingValues[topic.id]}</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="10"
                      step="1"
                      value={ratingValues[topic.id]}
                      onChange={(e) => handleRatingChange(topic.id, parseInt(e.target.value))}
                      className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                    />
                    <div className="flex justify-between text-[10px] font-medium text-slate-400 uppercase tracking-wider">
                      <span>Poor</span>
                      <span>Excellent</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="p-6 border-t border-slate-100 flex justify-end gap-3 bg-slate-50/50 rounded-b-xl">
              <button
                onClick={() => {
                  setRatingDialogOpen(false)
                  setRatingCandidate(null)
                }}
                className="px-4 py-2 rounded-lg font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveRatings}
                className="px-4 py-2 rounded-lg font-medium text-white bg-blue-600 hover:bg-blue-700 shadow-sm shadow-blue-200 transition-all"
              >
                Submit Evaluation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
