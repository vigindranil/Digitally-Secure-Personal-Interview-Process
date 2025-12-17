"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"
 
import { getUser } from "@/hooks/getUser"
import { User, Hash, CalendarDays, ClipboardList, GraduationCap, Mail, Phone, CheckCircle2, XCircle, Clock, Sparkles } from "lucide-react"
import { callAPIWithEnc } from "@/lib/commonApi"

type CurrentCandidate = {
  candidate_id: number
  candidate_roll_no: string
  interview_id: string
  exam_name: string
  post_name: string
  candidate_name: string
  candidate_gender: string
  candidate_dob: string
  image_url?: string | null
  email?: string
  phone?: string
  category?: string | null
  roll_number?: string | null
}

type OngoingCandidate = {
  candidate_id: number
  candidate_roll: string
  candidaten_name: string
  candidate_verify_status: number
  exam_date: string
  exam_name: string
  post: string
  score: number | null
  category: string | null
}

export default function InterviewPage() {
  const router = useRouter()
  const [currentCandidate, setCurrentCandidate] = useState<CurrentCandidate | null>(null)
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [verificationStatusId, setVerificationStatusId] = useState<number | null>(null)
  const { toast } = useToast()
  const [overallStatusId, setOverallStatusId] = useState<number | null>(null)
  const [interviewerStatusId, setInterviewerStatusId] = useState<number | null>(null)

  const statusBadgeClass = (id?: number | null) => {
    if (id === 42) return "bg-gradient-to-r from-emerald-500 to-green-500 text-white border-0"
    if (id === 46) return "bg-gradient-to-r from-rose-500 to-red-500 text-white border-0"
    return "bg-gradient-to-r from-amber-400 to-orange-400 text-white border-0"
  }

  useEffect(() => {
    (async () => {
      const u = await getUser()
      setUser(u)
      if (u) {
        await fetchCurrentCandidate(u)
      }
    })()
  }, [])

  useEffect(() => {
    if (!user) return
    const intervalId = setInterval(() => {
      fetchCurrentCandidate(user)
    }, 5000)
    return () => clearInterval(intervalId)
  }, [user])

  const fetchCurrentCandidate = (u: any) => {
    const callAPI = async (statusId: number) => {
      const response = await callAPIWithEnc("/admin/getCandidateByInterviewer", "POST", {
        schedule_id: u?.schedule_id || 0,
        status_id: statusId,
        user_id: u?.user_id || 0,
      });

      const raw = response?.status === 0 ? response?.data : response;
      const d = Array.isArray(raw) ? raw[0] : raw;
      return d;
    };

    (async () => {
      try {
        let d = await callAPI(40);
        if (!d || !d.candidate_id) {
          d = await callAPI(42);
        }

        if (d && d.candidate_id) {
          setCurrentCandidate({
            candidate_id: Number(d.candidate_id ?? 0),
            candidate_roll_no: String(d.candidate_roll_no ?? d.roll_number ?? ""),
            interview_id: String(d.interview_id ?? ""),
            exam_name: String(d.exam_name ?? d.applied_for ?? ""),
            post_name: String(d.post_name ?? d.applied_for ?? ""),
            candidate_name: String(d.candidate_name ?? ""),
            candidate_gender: String(d.candidate_gender ?? ""),
            candidate_dob: String(d.date_of_birth ?? d.candidate_dob ?? ""),
            image_url: d.image_url ?? null,
            email: String(d.email ?? ""),
            phone: String(d.phone ?? ""),
            category: String(d.category ?? ""),
            roll_number: String(d.roll_number ?? ""),
          });
          const ov = Number(d.overall_verify_status ?? 0) || null
          const iv = Number(d.interviewer_verify_status ?? 0) || null
          setOverallStatusId(ov)
          setInterviewerStatusId(iv)
          setVerificationStatusId(iv)
          
        } else {
          setCurrentCandidate(null);
          setOverallStatusId(null)
          setInterviewerStatusId(null)
          
        }

      } catch (e) {
        console.log("Candidate fetch error: ", e);
        setCurrentCandidate(null);
      } finally {
        setLoading(false);
      }
    })();
  };

  const mapStatusText = (id?: number | null) => {
    if (id === 42) return "Verified"
    if (id === 46) return "Not Approved"
    return "Pending"
  }

  const StatusIcon = (id?: number | null) => {
    if (id === 42) return <CheckCircle2 className="h-3 w-3" />
    if (id === 46) return <XCircle className="h-3 w-3" />
    return <Clock className="h-3 w-3" />
  }

  const updateCandidateVerifyStatus = async (candidateId: number, statusId: number, interviewId?: string) => {
    try {
      const response = await callAPIWithEnc(
        "/admin/updateCandidateStatusByInterviewer",
        "POST",
        {
          candidate_id: Number(candidateId),
          status_id: statusId,
          entry_user_id: user?.user_id || 0,
          interview_id: interviewId
        }
      )

      if (response?.status === 0) {
        if (statusId === 42) {
          setInterviewerStatusId(42)
          setVerificationStatusId(42)
          toast({ title: "Candidate Verified", description: "Marked as verified successfully." })
          if (overallStatusId === 42) {
            try {
              router.push(`/candidate-score/${candidateId}`)
            } catch (e) {
              console.log("Error while redirecting to candidate score page:", e);
            }
          } else {
            toast({ title: "Waiting for overall approval", description: "Verification pending from others.", variant: "default" })
          }
        } else if (statusId === 46) {
          setInterviewerStatusId(46)
          setVerificationStatusId(46)
          toast({ title: "Candidate Not Approved", description: "Marked as not approved." })
        }
      } else {
        toast({ title: "Error", description: "Failed to update candidate status.", variant: "destructive" })
      }
    } catch (e: any) {
      toast({ title: "Error", description: e?.message || "Something went wrong.", variant: "destructive" })
    }
  }

  const safeImageUrl = (url?: string | null) => {
    const raw = String(url ?? "").replace(/[`'\"]/g, "").trim()
    if (!raw || /\/null$/i.test(raw)) return "/placeholder-user.jpg"
    return raw
  }

  const handleOngoingCandidateClick = (candidate: OngoingCandidate) => {
    if (candidate.candidate_verify_status === 42) {
      router.push(`/candidate-score/${candidate.candidate_id}`)
    } else {
      toast({
        title: "Not Verified",
        description: "This candidate needs to be verified first.",
        variant: "destructive"
      })
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-6 px-3 sm:px-4 md:px-6">
      <div className="mx-auto max-w-7xl w-full">
        {/* Compact Header */}
        <div className="mb-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="p-2 sm:p-2.5 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg">
              <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg sm:text-xl md:text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Candidate Verification
              </h1>
              <p className="text-xs sm:text-sm text-slate-500">Review and verify candidate</p>
            </div>
          </div>
        </div>

        {/* Compact Main Card */}
        <Card className="border-0 shadow-xl rounded-2xl overflow-hidden bg-white/90 backdrop-blur-sm">
          <CardHeader className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 text-white py-5 px-4 sm:px-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <CardTitle className="text-white text-base sm:text-lg font-bold flex items-center gap-2">
                <User className="h-4 w-4 sm:h-5 sm:w-5" />
                Current Candidate
              </CardTitle>
              {currentCandidate && (
                <div className="flex flex-wrap items-center gap-2">
                  <Badge className="bg-white/20 backdrop-blur-sm text-white border-white/30 px-2 py-1 text-[10px] sm:text-xs">
                    {currentCandidate.exam_name}
                  </Badge>
                  <Badge className="bg-white/20 backdrop-blur-sm text-white border-white/30 px-2 py-1 text-[10px] sm:text-xs">
                    {currentCandidate.post_name}
                  </Badge>
                  <Badge className={`${statusBadgeClass(verificationStatusId)} px-2 py-1 text-[10px] sm:text-xs flex items-center gap-1`}>
                    {StatusIcon(verificationStatusId)}
                    {mapStatusText(verificationStatusId)}
                  </Badge>
                </div>
              )}
            </div>
          </CardHeader>

          <CardContent className="p-4 sm:p-6 md:p-8">
            {loading ? (
              <div className="flex items-center gap-4 py-10 sm:py-12">
                <div className="h-20 w-20 sm:h-24 sm:w-24 rounded-xl bg-gradient-to-br from-indigo-200 to-purple-200 animate-pulse" />
                <div className="space-y-2 flex-1">
                  <div className="h-4 w-32 sm:w-40 rounded bg-slate-200 animate-pulse" />
                  <div className="h-3 w-24 sm:w-32 rounded bg-slate-200 animate-pulse" />
                </div>
              </div>
            ) : currentCandidate ? (
              <div className="space-y-5 sm:space-y-6">
                {/* Compact Profile Section */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-5 sm:gap-6">
                  {/* Photo and Name - Compact */}
                  <div className="lg:col-span-1 flex flex-col items-center text-center space-y-3">
                    <div className="relative group">
                      <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl blur opacity-20 group-hover:opacity-30 transition"></div>
                      <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-xl overflow-hidden border-2 border-white shadow-lg bg-slate-100">
                        {currentCandidate.image_url ? (
                          <img
                            src={safeImageUrl(currentCandidate.image_url)}
                            alt={currentCandidate.candidate_name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-slate-100">
                            <User className="h-14 w-14 sm:h-16 sm:w-16 text-slate-400" />
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <h3 className="text-base sm:text-lg font-bold text-slate-800 leading-tight">
                        {currentCandidate.candidate_name}
                      </h3>
                      <div className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-2.5 py-1 border border-indigo-200">
                        <Hash className="h-3 w-3 text-indigo-600" />
                        <span className="text-xs font-semibold text-indigo-900">{currentCandidate.candidate_roll_no}</span>
                      </div>
                    </div>
                  </div>

                  {/* Information Grid - Compact */}
                  <div className="lg:col-span-3">
                    <div className="bg-gradient-to-br from-slate-50 to-indigo-50 rounded-xl p-4 sm:p-5 border border-indigo-100">
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                        {[
                          { icon: User, label: "Gender", value: currentCandidate.candidate_gender, color: "blue" },
                          { icon: CalendarDays, label: "DOB", value: currentCandidate.candidate_dob, color: "purple" },
                          { icon: User, label: "Category", value: currentCandidate.category, color: "orange" },
                          { icon: GraduationCap, label: "Exam", value: currentCandidate.exam_name, color: "green" },
                          { icon: ClipboardList, label: "Post", value: currentCandidate.post_name, color: "indigo" },
                          { icon: Mail, label: "Email", value: currentCandidate.email, color: "pink" },
                          { icon: Phone, label: "Phone", value: currentCandidate.phone, color: "cyan" },
                          { icon: Hash, label: "Roll No", value: currentCandidate.roll_number, color: "violet" },
                        ].map((item, idx) => (
                          <div key={idx} className="group bg-white rounded-lg p-2.5 sm:p-3 shadow-sm hover:shadow-md transition-all border border-slate-100 hover:border-indigo-200">
                            <div className="flex items-start gap-2">
                              <div className={`mt-0.5 p-1.5 sm:p-2 rounded-lg bg-gradient-to-br from-${item.color}-500 to-${item.color}-600 shadow-sm`}>
                                <item.icon className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-white" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-0.5">{item.label}</p>
                                <p className="text-xs sm:text-sm font-semibold text-slate-800 break-words leading-tight">
                                  {item.value || "N/A"}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Compact Action Buttons */}
                <div className="pt-4 sm:pt-5 border-t border-slate-200">
                  <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-2 sm:gap-3">
                    {interviewerStatusId === 42 ? (
                      <>
                        {overallStatusId === 42 ? (
                          <>
                            <div className="flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg bg-emerald-50 border border-emerald-200">
                              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                              <span className="font-semibold text-emerald-700 text-xs sm:text-sm">Verified</span>
                            </div>
                            <Button
                              onClick={() => router.push(`/candidate-score/${currentCandidate?.candidate_id}`)}
                              size="sm"
                              className="w-full sm:w-auto px-4 sm:px-5 py-2 sm:py-2.5 text-xs sm:text-sm font-bold bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all hover:scale-105 rounded-lg"
                            >
                              Proceed to Scoring →
                            </Button>
                          </>
                        ) : (
                          <div className="flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg bg-amber-50 border border-amber-200">
                            <Clock className="h-4 w-4 text-amber-600" />
                            <span className="font-semibold text-amber-700 text-xs sm:text-sm">Verification pending from others</span>
                          </div>
                        )}
                      </>
                    ) : (
                      <>
                        {interviewerStatusId === 40 ? (
                          <>
                            <Button
                              onClick={() => { if (!currentCandidate) return; updateCandidateVerifyStatus(currentCandidate.candidate_id, 42, currentCandidate.interview_id) }}
                              size="sm"
                              className="w-full sm:w-auto px-4 sm:px-5 py-2 sm:py-2.5 text-xs sm:text-sm font-bold bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white shadow-lg hover:shadow-xl transition-all hover:scale-105 rounded-lg flex items-center justify-center gap-1.5"
                            >
                              <CheckCircle2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                              Verify
                            </Button>
                            <Button
                              onClick={() => { if (!currentCandidate) return; updateCandidateVerifyStatus(currentCandidate.candidate_id, 46, currentCandidate.interview_id) }}
                              size="sm"
                              className="w-full sm:w-auto px-4 sm:px-5 py-2 sm:py-2.5 text-xs sm:text-sm font-bold bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-700 hover:to-red-700 text-white shadow-lg hover:shadow-xl transition-all hover:scale-105 rounded-lg flex items-center justify-center gap-1.5"
                            >
                              <XCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                              Not Approved
                            </Button>
                          </>
                        ) : (
                          <div className="flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg bg-amber-50 border border-amber-200">
                            <Clock className="h-4 w-4 text-amber-600" />
                            <span className="font-semibold text-amber-700 text-xs sm:text-sm">Verification pending from others</span>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-16 sm:py-20">
                <div className="inline-flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-slate-100 mb-4">
                  <User className="h-10 w-10 sm:h-12 sm:w-12 text-slate-400" />
                </div>
                <h3 className="text-base sm:text-lg font-bold text-slate-700 mb-2">No Candidate</h3>
                <p className="text-xs sm:text-sm text-slate-500">Waiting for assignment...</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
    </div>
  )
}