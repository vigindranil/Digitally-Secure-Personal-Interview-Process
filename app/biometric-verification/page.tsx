"use client"

import { useEffect, useState } from "react"
import { CheckCircle2, XCircle, Search, Fingerprint, FileText, User, Calendar, MapPin, AlertCircle, Scan } from "lucide-react"
import { callAPIWithEnc } from "@/lib/commonApi"
import { getUser } from "@/hooks/getUser"
import { useToast } from "@/components/ui/use-toast"
import { ToastProvider, ToastViewport, Toast } from "@/components/ui/toast"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import DataTable, { ColumnDef } from "@/components/DataTable"


export default function VerificationPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCandidate, setSelectedCandidate] = useState<any>(null)
  const [isSearching, setIsSearching] = useState(false)
  const [results, setResults] = useState<any[]>([])
  const [user, setUser] = useState<any>(null)
  const { toasts, toast } = useToast()
  const [remarksOpen, setRemarksOpen] = useState(false)
  const [remarks, setRemarks] = useState("")
  const [submittingRemarks, setSubmittingRemarks] = useState(false)
  const [rejectTarget, setRejectTarget] = useState<any>(null)
  const [searchMode, setSearchMode] = useState<"roll" | "name">("roll")

  useEffect(() => {
    (async () => {
      const u = await getUser()
      setUser(u)
    })()
  }, [])



  const mapStatus = (id?: number) => {
    if (id == 10) return "Verified"
    if (id == 15) return "Not Verified"
    return "Pending"
  }

  const handleSearch = async () => {
    setIsSearching(true)
    try {
      const isName = searchMode === "name"
      const response = await callAPIWithEnc(
        isName ? "/admin/getCandidateByName" : "/admin/getCandidateByrollnumber",
        "POST",
        isName
          ? {
            Name: searchQuery,
            user_id: user?.user_id || 0,
            user_type_id: user?.user_type_id || 0,
          }
          : {
            roll_number: searchQuery,
            user_id: user?.user_id || 0,
            user_type_id: user?.user_type_id || 0,
          }
      )
      if (response?.status == 0) {
        const raw = response?.data
        const arr = Array.isArray(raw) ? raw : raw ? [raw] : []
        const mapped = arr.map((d: any) => ({
          id: Number(d.candidate_id ?? 0),
          name: d.candidate_name ?? "Unknown",
          rollNo: d.roll_number ?? "",
          category: d.category ?? "",
          dob: d.date_of_birth ?? "",
          appliedFor: d.applied_for ?? "",
          email: d.email ?? "",
          phone: d.phone ?? "",
          biometricVerifyStatusId: Number(d.biometricVerifyStatusId ?? 0),
          biometricStatus: mapStatus(d.biometricVerifyStatusId),
          photo: "/placeholder-user.jpg",
        }))
        setResults(mapped)
        setSelectedCandidate(null)
      } else {
        setResults([])
        setSelectedCandidate(null)
      }
    } catch (e) {
      setResults([])
      setSelectedCandidate(null)
    } finally {
      setIsSearching(false)
    }
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
        setResults((prev) => prev.map((c) => c.id === candidateId ? { ...c, biometricStatus: mapStatus(statusId), biometricVerifyStatusId: statusId } : c))
        if (statusId === 10) {
          toast({ title: "Biometric Verified", description: "Candidate biometric marked as verified." })
        }
      }
      else {
        toast({ title: "Error", description: "Failed to update candidate status.", variant: "destructive" })
      }
    } catch (e) {
      console.error("Failed to update status:", e)
      toast({ title: "Error", description: "Failed to update candidate status.", variant: "destructive" })
    }
  }
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Verified":
        return "bg-green-50 text-green-700 border-green-200"
      case "Not Verified":
        return "bg-rose-50 text-rose-700 border-rose-200"
      default:
        return "bg-amber-50 text-amber-700 border-amber-200"
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <ToastProvider>
        {toasts.map(({ id, title, description, action, ...props }) => (
          <Toast
            key={id}
            {...props}
            className={`${props?.variant === "destructive" ? "border-rose-200" : "border-emerald-200"} bg-white shadow-xl rounded-xl`}
          >
            <div className={`flex items-start gap-3 p-4 rounded-lg ${props?.variant === "destructive" ? "bg-rose-50" : "bg-emerald-50"}`}>
              <div className={`w-8 h-8 rounded-md flex items-center justify-center ${props?.variant === "destructive" ? "bg-rose-200 text-rose-700" : "bg-emerald-200 text-emerald-700"}`}>
                {props?.variant === "destructive" ? <AlertCircle className="h-4 w-4" /> : <CheckCircle2 className="h-4 w-4" />}
              </div>
              <div className="flex-1 min-w-0">
                {title && <div className="text-sm font-semibold text-slate-900 truncate">{title}</div>}
                {description && <div className="text-xs text-slate-700 mt-0.5">{description}</div>}
              </div>
            </div>
          </Toast>
        ))}
        <ToastViewport className="sm:right-4 sm:bottom-4" />
      </ToastProvider>
      <div className="mx-auto max-w-7xl px-8 py-6 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-gray-900">Verification Station</h1>
            <p className="text-gray-600 mt-1 text-sm">Process biometric and document verification for candidates</p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-md bg-green-50 border border-green-200">
            <div className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </div>
            <span className="text-sm font-normal text-gray-700">Station Active</span>
          </div>
        </div>

        {/* Search Section */}
        <div className="bg-white rounded-lg border border-gray-200 p-5">
          <div className="flex items-center gap-4">
            <div className="flex-1 flex gap-3">
              <div className="w-48">
                <select
                  value={searchMode}
                  onChange={(e) => setSearchMode(e.target.value as any)}
                  className="w-full h-10 rounded-md border border-gray-300 bg-white text-gray-900 text-sm px-3"
                >
                  <option value="roll">Search by Roll Number</option>
                  <option value="name">Search by Name</option>
                </select>
              </div>
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  placeholder="Scan barcode or enter roll number / name..."
                  className="w-full h-10 pl-10 pr-4 rounded-md border border-gray-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 focus:outline-none bg-white text-gray-900 placeholder:text-gray-500 text-sm"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                />
              </div>
              <button
                onClick={handleSearch}
                disabled={isSearching}
                className="px-5 py-2 rounded-md bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSearching ? "Searching..." : "Search"}
              </button>
            </div>
          </div>
        </div>

        {(
          <div className="space-y-6">
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <DataTable
                data={results}
                columns={[
                  { header: "Roll No", accessorKey: "rollNo" },
                  { header: "Name", accessorKey: "name" },
                  { header: "Category", accessorKey: "category" },
                  { header: "Applied For", accessorKey: "appliedFor" },
                  // { header: "Email", accessorKey: "email" },
                  { header: "Phone", accessorKey: "phone" },
                  {
                    header: "Status",
                    accessorFn: (row: any) => (
                      <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border ${getStatusColor(row.biometricStatus)}`}>
                        {row.biometricStatus === "Verified" && <CheckCircle2 className="h-3 w-3" />}
                        {row.biometricStatus === "Not Verified" && <AlertCircle className="h-3 w-3" />}
                        {row.biometricStatus === "Pending" && <AlertCircle className="h-3 w-3" />}
                        {row.biometricStatus}
                      </div>
                    ),
                  },
                  {
                    header: "Actions",
                    accessorFn: (row: any) => (
                      row.biometricVerifyStatusId === 10 ? (
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium border bg-green-50 border-green-200 text-green-700">
                          <CheckCircle2 className="h-3 w-3" />
                          Verification Completed
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <button onClick={() => { setRejectTarget(row); setRemarksOpen(true) }} className="px-3 py-1.5 rounded-md text-xs font-medium text-red-700 bg-red-50 hover:bg-red-100 border border-red-200">
                            Reject
                          </button>
                          <button onClick={() => updateCandidateVerifyStatus(row.id, 10)} className="px-3 py-1.5 rounded-md text-xs font-medium text-white bg-green-600 hover:bg-green-700">
                            Verify
                          </button>
                        </div>
                      )
                    ),
                  },
                ] as ColumnDef<any>[]}
                isLoading={isSearching}
                isExpandable
                renderExpandedRow={(row: any) => (
                  <div className="grid gap-6 lg:grid-cols-3">
                    <div className="lg:col-span-1">
                      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                        <div className="h-20 bg-blue-600"></div>
                        <div className="relative px-5 pb-5">
                          <div className="absolute -top-10 left-5">
                            <div className="w-20 h-20 rounded-lg bg-white border-4 border-white shadow-md overflow-hidden">
                              <img src={row.photo} alt={row.name} className="w-full h-full object-cover" />
                            </div>
                          </div>
                          <div className="pt-12 space-y-4">
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900">{row.name}</h3>
                              <p className="text-sm font-mono font-medium text-blue-600">{row.rollNo}</p>
                            </div>
                            <div className="space-y-2">
                              <div className="flex items-center gap-3 p-3 rounded-md bg-gray-50 border border-gray-200">
                                <User className="h-4 w-4 text-gray-500 flex-shrink-0" />
                                <div className="flex-1 min-w-0">
                                  <p className="text-xs text-gray-500">Category</p>
                                  <p className="text-sm font-medium text-gray-900">{row.category}</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-3 p-3 rounded-md bg-gray-50 border border-gray-200">
                                <Calendar className="h-4 w-4 text-gray-500 flex-shrink-0" />
                                <div className="flex-1 min-w-0">
                                  <p className="text-xs text-gray-500">Date of Birth</p>
                                  <p className="text-sm font-medium text-gray-900">{row.dob}</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-3 p-3 rounded-md bg-gray-50 border border-gray-200">
                                <MapPin className="h-4 w-4 text-gray-500 flex-shrink-0" />
                                <div className="flex-1 min-w-0">
                                  <p className="text-xs text-gray-500">Applied For</p>
                                  <p className="text-sm font-medium text-gray-900">{row.appliedFor}</p>
                                </div>
                              </div>
                            </div>
                            <div className="pt-4 border-t border-gray-200 space-y-2">
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-600">Email</span>
                                <span className="font-medium text-gray-900 truncate ml-2">{row.email}</span>
                              </div>
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-600">Phone</span>
                                <span className="font-medium text-gray-900">{row.phone}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="lg:col-span-2 space-y-6">
                      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                        <div className="border-b border-gray-200 bg-green-50 px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-md bg-green-600 flex items-center justify-center">
                              <Fingerprint className="h-5 w-5 text-white" />
                            </div>
                            <div>
                              <h3 className="text-base font-semibold text-gray-900">Biometric Verification</h3>
                              <p className="text-xs text-gray-600">Verify candidate identity via fingerprint/iris scan</p>
                            </div>
                          </div>
                        </div>
                        <div className="p-5">
                          <div className="flex items-center justify-between p-4 rounded-md border border-gray-200 bg-gray-50">
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 rounded-md bg-green-100 flex items-center justify-center">
                                <Fingerprint className="h-5 w-5 text-green-600" />
                              </div>
                              <div>
                                <div className="font-medium text-gray-900 mb-1 text-sm">Current Status</div>
                                <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border ${getStatusColor(row.biometricStatus)}`}>
                                  {row.biometricStatus === "Verified" && <CheckCircle2 className="h-3 w-3" />}
                                  {row.biometricStatus === "Not Verified" && <AlertCircle className="h-3 w-3" />}
                                  {row.biometricStatus}
                                </div>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              {row.biometricVerifyStatusId === 10 ? (
                                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium border bg-green-50 border-green-200 text-green-700">
                                  <CheckCircle2 className="h-4 w-4" />
                                  Verification Completed
                                </div>
                              ) : (
                                <>
                                  <button onClick={() => { setRejectTarget(row); setRemarksOpen(true) }} className="flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 transition-colors">
                                    <XCircle className="h-4 w-4" />
                                    Reject
                                  </button>
                                  <button onClick={() => updateCandidateVerifyStatus(row.id, 10)} className="flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium text-white bg-green-600 hover:bg-green-700 transition-colors">
                                    <CheckCircle2 className="h-4 w-4" />
                                    Verify
                                  </button>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              />
            </div>
          </div>
        )}
      </div>
      <Dialog open={remarksOpen} onOpenChange={setRemarksOpen}>
        <DialogContent className="bg-white">
          <DialogHeader>
            <DialogTitle>Remarks</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <textarea value={remarks} onChange={(e) => setRemarks(e.target.value)} className="w-full h-28 rounded-md border border-slate-200 p-3 text-sm bg-white" placeholder="Type remarks" />
            <div className="flex justify-end gap-2">
              <button onClick={() => { setRemarksOpen(false); setRejectTarget(null) }} className="px-4 py-2 rounded-md bg-white border border-slate-200 text-slate-700">Cancel</button>
              <button disabled={submittingRemarks || !remarks.trim()} onClick={async () => { if (!rejectTarget) return; setSubmittingRemarks(true); await updateCandidateVerifyStatus(rejectTarget.id, 15, remarks.trim()); setSubmittingRemarks(false); setRemarksOpen(false); setRemarks(""); setRejectTarget(null) }} className="px-4 py-2 rounded-md bg-rose-600 text-white disabled:opacity-50">Submit</button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}