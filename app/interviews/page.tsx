"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { getUser } from "@/hooks/getUser"
import { User, Hash, CalendarDays, ClipboardList, GraduationCap, Mail, Phone as PhoneIcon } from "lucide-react"
import { callAPIWithEnc } from "@/lib/commonApi"

type CurrentCandidate = {
  candidate_id: number
  candidate_roll_no: string
  interview_id: string
  exam_name: string
  post_name: string
  candidate_full_name: string
  candidate_gender: string
  candidate_dob: string
  image_url?: string | null
  email?: string
  phone?: string
  category?: string
  roll_number?: string
}

export default function InterviewPage() {
  const router = useRouter()
  const [currentCandidate, setCurrentCandidate] = useState<CurrentCandidate | null>(null)
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [verificationStatusId, setVerificationStatusId] = useState<number | null>(null)
  const { toast } = useToast()
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [confirmAction, setConfirmAction] = useState<'verify' | 'reject' | null>(null)
  const scoreBadge = (s: number) => (s >= 7 ? "bg-emerald-100 text-emerald-700" : s >= 4 ? "bg-amber-100 text-amber-700" : "bg-rose-100 text-rose-700")
  const statusBadgeClass = (id?: number | null) => {
    if (id === 42) return "bg-green-50 text-green-700 border-green-200"
    if (id === 46) return "bg-rose-50 text-rose-700 border-rose-200"
    return "bg-slate-100 text-slate-700 border-slate-200"
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
          candidate_full_name: String(d.candidate_full_name ?? ""),
          candidate_gender: String(d.candidate_gender ?? ""),
          candidate_dob: String(d.date_of_birth ?? d.candidate_dob ?? ""),
          image_url: d.image_url ?? null,
          email: String(d.email ?? ""),
          phone: String(d.phone ?? ""),
          category: String(d.category ?? ""),
          roll_number: String(d.roll_number ?? ""),
        });

        setVerificationStatusId(Number(d.verify_status ?? 0) || null);
      } else {
        setCurrentCandidate(null);
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
          try {
            router.push(`/candidate-score/${candidateId}`)
            toast({ title: "Candidate Verified", description: "Marked as verified successfully." })

          } catch (e) {
            console.log("Error while redirecting to candidate score page:", e);
          }
        }
      } else {
        toast({ title: "Error", description: "Failed to update candidate status.", variant: "destructive" })
      }
    } catch (e: any) {
      toast({ title: "Error", description: e?.message || "Something went wrong.", variant: "destructive" })
    }
  }

  return (
    <div className="mx-auto max-w-4xl w-full px-4 grid gap-6 lg:grid-cols-3">
      <div className="lg:col-span-3">
        <Card className="border border-slate-200 shadow-xl rounded-xl overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-t-xl">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <CardTitle className="text-white">Current Candidate</CardTitle>
              {currentCandidate && (
                <div className="flex flex-wrap items-center gap-2">
                  <Badge className="bg-white/20 text-white border-white/30">{currentCandidate.exam_name}</Badge>
                  <Badge className="bg-white/20 text-white border-white/30">{currentCandidate.post_name}</Badge>
                  <Badge className={statusBadgeClass(verificationStatusId)}>{mapStatusText(verificationStatusId)}</Badge>
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col items-center md:items-start">
                    <div className="relative group">
                      <div className="w-40 h-40 rounded-2xl overflow-hidden border-4 border-white shadow-2xl bg-gradient-to-br from-slate-200 to-slate-300 ring-4 ring-blue-100">
                        {currentCandidate.image_url ? (
                          <img src={currentCandidate.image_url} alt={currentCandidate.candidate_full_name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-5xl font-bold text-white bg-gradient-to-br from-indigo-500 to-violet-600">
                            {(currentCandidate.candidate_full_name || "").charAt(0).toUpperCase()}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="text-center md:text-left mt-6 space-y-1">
                      <h3 className="text-2xl font-bold text-slate-900">{currentCandidate.candidate_full_name}</h3>
                      <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                        <Hash className="h-4 w-4" />
                        {currentCandidate.candidate_roll_no}
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5 p-2 rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50">
                          <User className="h-4 w-4 text-blue-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Gender</p>
                          <p className="text-sm font-medium text-slate-800 break-words">{currentCandidate.candidate_gender}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5 p-2 rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50">
                          <CalendarDays className="h-4 w-4 text-blue-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">DOB</p>
                          <p className="text-sm font-medium text-slate-800 break-words">{currentCandidate.candidate_dob}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5 p-2 rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50">
                          <User className="h-4 w-4 text-blue-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Category</p>
                          <p className="text-sm font-medium text-slate-800 break-words">{currentCandidate.category}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5 p-2 rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50">
                          <GraduationCap className="h-4 w-4 text-blue-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Exam</p>
                          <p className="text-sm font-medium text-slate-800 break-words">{currentCandidate.exam_name}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5 p-2 rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50">
                          <ClipboardList className="h-4 w-4 text-blue-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Post</p>
                          <p className="text-sm font-medium text-slate-800 break-words">{currentCandidate.post_name}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5 p-2 rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50">
                          <Mail className="h-4 w-4 text-blue-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Email</p>
                          <p className="text-sm font-medium text-slate-800 break-words">{currentCandidate.email}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5 p-2 rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50">
                          <PhoneIcon className="h-4 w-4 text-blue-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Phone</p>
                          <p className="text-sm font-medium text-slate-800 break-words">{currentCandidate.phone}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5 p-2 rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50">
                          <Hash className="h-4 w-4 text-blue-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Roll Number</p>
                          <p className="text-sm font-medium text-slate-800 break-words">{currentCandidate.roll_number}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4 w-full">
                  {verificationStatusId === 42 ? (
                    <>
                      <div className="px-4 py-2 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-700 font-semibold">
                        Verification complete
                      </div>
                      <Button
                        onClick={() => {
                          router.push(`/candidate-score/${currentCandidate?.candidate_id}`)
                        }}
                        className="w-full sm:w-auto bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white shadow-lg hover:shadow-xl transition-all hover:scale-[1.02] focus:ring-4 focus:ring-violet-200"
                        aria-label="Proceed to next"
                      >
                        Proceed to Next
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        onClick={() => { setConfirmAction('verify'); setConfirmOpen(true) }}
                        className="w-full sm:w-auto bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white shadow-lg hover:shadow-xl transition-all hover:scale-[1.02] focus:ring-4 focus:ring-emerald-200"
                        aria-label="Verify candidate"
                      >
                        Verify Candidate
                      </Button>
                      <Button
                        onClick={() => { setConfirmAction('reject'); setConfirmOpen(true) }}
                        className="w-full sm:w-auto bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-700 hover:to-red-700 text-white shadow-lg hover:shadow-xl transition-all hover:scale-[1.02] focus:ring-4 focus:ring-rose-200"
                        aria-label="Mark not approved"
                      >
                        Not Approved
                      </Button>
                    </>
                  )}
                </div>
              </>
            ) : (
              <div className="text-center text-sm text-muted-foreground">No candidate assigned</div>
            )}
          </CardContent>
        </Card>
      </div>
    <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
      <DialogContent className="bg-white">
        <DialogHeader>
          <DialogTitle>{confirmAction === 'verify' ? 'Approve Candidate' : 'Not Approve Candidate'}</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <p className="text-sm text-slate-600">{confirmAction === 'verify' ? 'Do you want to approve this candidate?' : 'Do you want to mark this candidate as not approved?'}</p>
          <div className="flex justify-end gap-2">
            <button onClick={() => { setConfirmOpen(false); setConfirmAction(null) }} className="px-4 py-2 rounded-md bg-white border border-slate-200 text-slate-700">No</button>
            <button onClick={async () => { if (!currentCandidate || !confirmAction) return; if (confirmAction === 'verify') { await updateCandidateVerifyStatus(currentCandidate.candidate_id, 42, currentCandidate.interview_id) } else { await updateCandidateVerifyStatus(currentCandidate.candidate_id, 46, currentCandidate.interview_id) } setConfirmOpen(false); setConfirmAction(null) }} className="px-4 py-2 rounded-md bg-green-600 text-white">Yes</button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
    </div>
  )
}
