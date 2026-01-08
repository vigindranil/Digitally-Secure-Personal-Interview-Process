"use client"
import React, { useEffect, useState } from "react"
import { useParams, useSearchParams, useRouter } from "next/navigation"
import {
  Building2,
  CalendarDays,
  Users,
  Edit2,
  Trash2,
  Plus,
  Loader2,
  ArrowLeft,
  MapPin,
  Briefcase,
  Calendar,
  Award,
  UserCheck,
} from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { mockApi, Panel, PanelAssignment } from "@/app/add-panel/api"
import { interviewers as allInterviewers } from "@/lib/interviewers"
import { MultiSelect } from "@/components/multiSelect"
import Cookies from "js-cookie"

export default function PanelDetailsPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const router = useRouter()
  const panelId = String(params?.id || "")
  const venueId = String(searchParams?.get("venueId") || "")

  const [panel, setPanel] = useState<Panel | null>(null)
  const [venueLabel, setVenueLabel] = useState<string>("")
  const [examName, setExamName] = useState<string>("")
  const [scheduleDates, setScheduleDates] = useState<string[]>([])
  const [assignments, setAssignments] = useState<PanelAssignment[]>([])
  const [loading, setLoading] = useState(true)
  const [assignOpen, setAssignOpen] = useState(false)
  const [editAssignmentId, setEditAssignmentId] = useState<string | null>(null)
  const [selectedInterviewers, setSelectedInterviewers] = useState<string[]>([])
  const [assignDate, setAssignDate] = useState<string>("")
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [confirmTargetId, setConfirmTargetId] = useState<string | null>(null)

  useEffect(() => {
    if (assignOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [assignOpen])

  useEffect(() => {
    ; (async () => {
      setLoading(true)
      let p: Panel | null = null
      try {
        const stored = Cookies.get('selected_panel')
        if (stored) {
          const parsed = JSON.parse(stored)

          if (parsed.exam_name) setExamName(parsed.exam_name)
          if (parsed.lstDate && Array.isArray(parsed.lstDate)) {
            setScheduleDates(parsed.lstDate.map((d: any) => d.exam_date))
          }

          const normalized: Panel | null = parsed?.panel_id
            ? {
              id: String(parsed.panel_id ?? ''),
              panelName: String(parsed.panel_name ?? ''),
              roomNumber: String(parsed.room_no ?? ''),
              postId: String(parsed.post_id ?? ''),
              postLabel: String(parsed.post_name ?? ''),
              designationId: String(parsed.designation_id ?? ''),
              designationLabel: String(parsed.designation_name ?? ''),
              venueId: String(parsed.venue_id ?? ''),
            }
            : parsed
          if (normalized?.id === panelId) p = normalized
        }
      } catch { }
      if (!p) {
        p = await mockApi.getPanelById(panelId)
      }
      setPanel(p)
      const v = await mockApi.getVenueById(venueId)
      setVenueLabel(v?.label || "")
      const a = await mockApi.getAssignmentsByPanel(panelId)
      setAssignments(a)
      setLoading(false)
    })()
  }, [panelId, venueId])

  const handleUpdateAssignment = async (id: string, interviewerId?: string, date?: string) => {
    await mockApi.updateAssignment(id, { interviewerId, date })
    const a = await mockApi.getAssignmentsByPanel(panelId)
    setAssignments(a)
  }

  const handleDeleteAssignment = async (id: string) => {
    await mockApi.deleteAssignment(id)
    const a = await mockApi.getAssignmentsByPanel(panelId)
    setAssignments(a)
  }

  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr)
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    } catch {
      return dateStr
    }
  }

  const groupedAssignments = assignments.reduce((acc, curr) => {
    if (!acc[curr.date]) acc[curr.date] = []
    acc[curr.date].push(curr)
    return acc
  }, {} as Record<string, PanelAssignment[]>)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/20 to-cyan-50/30 p-4 sm:p-6 lg:p-8 font-sans">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-cyan-600 to-blue-600 p-2.5 rounded-xl shadow-lg shadow-cyan-900/20">
              <Users className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                Panel Details
              </h1>
              <p className="text-sm text-slate-500 font-medium">
                Manage interview assignments and schedules
              </p>
            </div>
          </div>
          <button
            onClick={() => router.back()}
            className="hidden sm:flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-slate-900 font-medium rounded-xl transition-all shadow-sm"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>
        </div>

        {/* Info Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-2">
              <div className="p-2 bg-cyan-50 rounded-lg">
                <Award className="h-5 w-5 text-cyan-600" />
              </div>
            </div>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Examination</p>
            <p className="text-base font-bold text-slate-900">{examName || "N/A"}</p>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-2">
              <div className="p-2 bg-blue-50 rounded-lg">
                <Building2 className="h-5 w-5 text-blue-600" />
              </div>
            </div>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Venue</p>
            <p className="text-base font-bold text-slate-900">{venueLabel || "Loading..."}</p>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-2">
              <div className="p-2 bg-cyan-50 rounded-lg">
                <MapPin className="h-5 w-5 text-cyan-600" />
              </div>
            </div>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Room Number</p>
            <p className="text-base font-bold text-slate-900">Room {panel?.roomNumber || "..."}</p>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-2">
              <div className="p-2 bg-blue-50 rounded-lg">
                <Briefcase className="h-5 w-5 text-blue-600" />
              </div>
            </div>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Post</p>
            <p className="text-base font-bold text-slate-900">{panel?.postLabel || "N/A"}</p>
          </div>
        </div>

        {/* Schedule Dates */}
        {scheduleDates.length > 0 && (
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 bg-cyan-50 rounded-lg">
                <Calendar className="h-4 w-4 text-cyan-600" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Scheduled Interview Dates</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {scheduleDates.map((date, idx) => (
                <div
                  key={idx}
                  className="inline-flex items-center gap-2 px-3 py-2 bg-cyan-50 border border-cyan-100 rounded-lg"
                >
                  <CalendarDays className="h-3.5 w-3.5 text-cyan-600" />
                  <span className="text-sm font-semibold text-slate-900">{formatDate(date)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Main Content Card */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-blue-50/30">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-slate-800">
                  {panel?.panelName || "Loading Panel..."}
                </h2>
                <div className="flex flex-wrap items-center gap-3 mt-2">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-slate-200 text-xs font-medium text-slate-600 shadow-sm">
                    <Building2 className="h-3.5 w-3.5 text-cyan-600" />
                    {venueLabel || "Loading Venue..."}
                  </div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-slate-200 text-xs font-medium text-slate-600 shadow-sm">
                    <MapPin className="h-3.5 w-3.5 text-blue-600" />
                    Room: {panel?.roomNumber || "..."}
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  setEditAssignmentId(null);
                  setSelectedInterviewers([]);
                  setAssignDate('');
                  setAssignOpen(true);
                }}
                className="flex items-center justify-center gap-2 px-4 h-11 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white font-medium rounded-xl transition-all shadow-md shadow-cyan-200/50 hover:shadow-cyan-200 active:scale-[0.98]"
              >
                <Plus className="h-4 w-4" />
                <span>Assign Interviews</span>
              </button>
            </div>
          </div>

          {/* Table Content */}
          <div className="p-6">
            {loading ? (
              <div className="py-20 flex flex-col items-center justify-center text-slate-400">
                <Loader2 className="h-10 w-10 animate-spin mb-4 text-cyan-600" />
                <p className="text-sm font-medium">Loading assignments...</p>
              </div>
            ) : assignments.length === 0 ? (
              <div className="py-20 flex flex-col items-center justify-center text-slate-400">
                <div className="p-4 bg-slate-100 rounded-full mb-4">
                  <Users className="h-10 w-10 opacity-50" />
                </div>
                <p className="text-sm font-medium">No assignments yet</p>
                <p className="text-xs opacity-70 mt-1">
                  Click "Assign Interviews" to schedule interviewers
                </p>
              </div>
            ) : (
              <div className="space-y-5">
                {Object.entries(groupedAssignments).map(([date, dateAssignments]) => (
                  <div key={date}>
                    <div className="flex items-center gap-3 mb-3 pb-2 border-b border-slate-200">
                      <div className="p-1.5 bg-cyan-50 rounded-lg">
                        <CalendarDays className="h-4 w-4 text-cyan-600" />
                      </div>
                      <h3 className="text-base font-bold text-slate-900">{formatDate(date)}</h3>
                      <span className="ml-auto px-2.5 py-1 bg-slate-100 rounded-full text-xs font-semibold text-slate-600">
                        {dateAssignments.length} {dateAssignments.length === 1 ? 'Interviewer' : 'Interviewers'}
                      </span>
                    </div>

                    <div className="overflow-x-auto -mx-6 px-6">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-slate-200">
                            <th className="text-left py-3 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                              Panel Name
                            </th>
                            <th className="text-left py-3 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                              Interviewer
                            </th>
                            <th className="text-center py-3 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {dateAssignments.map((a) => (
                            <tr key={a.id} className="group hover:bg-slate-50/50 transition-colors">
                              <td className="py-4 px-4">
                                <span className="text-sm font-semibold text-slate-900">
                                  {panel?.panelName}
                                </span>
                              </td>
                              <td className="py-4 px-4">
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-xs">
                                    {a.interviewerName.charAt(0)}
                                  </div>
                                  <span className="text-sm font-medium text-slate-900">{a.interviewerName}</span>
                                </div>
                              </td>
                              <td className="py-4 px-4">
                                <div className="flex items-center justify-center gap-2">
                                  <button
                                    onClick={() => {
                                      setEditAssignmentId(a.id);
                                      setSelectedInterviewers([a.interviewerId]);
                                      setAssignDate(a.date);
                                      setAssignOpen(true);
                                    }}
                                    className="h-9 w-9 flex items-center justify-center hover:bg-blue-50 text-blue-600 rounded-lg transition-colors border border-transparent hover:border-blue-100"
                                    title="Edit assignment"
                                  >
                                    <Edit2 className="h-4 w-4" />
                                  </button>
                                  <button
                                    onClick={() => {
                                      setConfirmTargetId(a.id);
                                      setConfirmOpen(true);
                                    }}
                                    className="h-9 w-9 flex items-center justify-center hover:bg-rose-50 text-rose-600 rounded-lg transition-colors border border-transparent hover:border-rose-100"
                                    title="Delete assignment"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Floating Back Button for Mobile */}
        <div className="fixed bottom-6 right-6 sm:hidden">
          <button
            onClick={() => router.back()}
            className="flex items-center justify-center h-12 w-12 rounded-full bg-white shadow-lg border border-slate-200 text-slate-600"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Assignment Modal */}
      {assignOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm z-50 p-4" role="dialog" aria-modal="true">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-blue-50/30 flex justify-between items-center">
              <h2 className="text-lg font-bold text-slate-800">
                {editAssignmentId ? 'Edit Assignment' : 'Assign Interviews'}
              </h2>
              <button
                onClick={() => setAssignOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <Plus className="h-6 w-6 rotate-45" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Select Interviewers
                </label>
                <MultiSelect
                  options={allInterviewers}
                  selected={allInterviewers.filter(i => selectedInterviewers.includes(i.id))}
                  onChange={(vals) => setSelectedInterviewers(vals.map(v => (v as any).id))}
                  placeholder="Search interviewers..."
                  getOptionKey={(i: any) => i.id}
                  getOptionLabel={(i: any) => i.name}
                />
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setSelectedInterviewers(allInterviewers.map(i => i.id))}
                  className="text-xs px-3 py-1.5 rounded-lg bg-cyan-50 text-cyan-700 hover:bg-cyan-100 font-medium transition-colors border border-cyan-100"
                >
                  Select All
                </button>
                <button
                  onClick={() => setSelectedInterviewers([])}
                  className="text-xs px-3 py-1.5 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 font-medium transition-colors"
                >
                  Clear Selection
                </button>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Interview Date
                </label>
                <input
                  type="date"
                  value={assignDate}
                  onChange={(e) => setAssignDate(e.target.value)}
                  className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all"
                />
              </div>
            </div>

            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
              <button
                onClick={() => {
                  setAssignOpen(false)
                  setEditAssignmentId(null)
                  setSelectedInterviewers([])
                  setAssignDate('')
                }}
                className="px-4 py-2 rounded-xl border border-slate-200 bg-white text-slate-700 font-medium hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  if (!assignDate) return
                  if (editAssignmentId) {
                    if (selectedInterviewers.length === 0) return
                    await mockApi.updateAssignment(editAssignmentId, { interviewerId: selectedInterviewers[0], date: assignDate })
                  } else {
                    if (selectedInterviewers.length === 0) return
                    await mockApi.createAssignments(panelId, selectedInterviewers, assignDate)
                  }
                  const a = await mockApi.getAssignmentsByPanel(panelId)
                  setAssignments(a)
                  setAssignOpen(false)
                  setEditAssignmentId(null)
                  setSelectedInterviewers([])
                  setAssignDate('')
                }}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-medium hover:from-cyan-700 hover:to-blue-700 shadow-md shadow-cyan-200/50 transition-all"
              >
                Save Assignment
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Dialog */}
      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent className="bg-white p-0 overflow-hidden rounded-2xl gap-0">
          <DialogHeader className="p-6 pb-2">
            <DialogTitle className="text-xl font-bold text-slate-900">Delete Assignment</DialogTitle>
          </DialogHeader>
          <div className="px-6 py-2">
            <p className="text-slate-600">Are you sure you want to remove this interviewer from the panel? This action cannot be undone.</p>
          </div>
          <div className="p-6 flex justify-end gap-3">
            <button
              onClick={() => { setConfirmOpen(false); setConfirmTargetId(null) }}
              className="px-4 py-2 rounded-xl border border-slate-200 bg-white text-slate-700 font-medium hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={async () => {
                if (!confirmTargetId) return
                await handleDeleteAssignment(confirmTargetId)
                setConfirmOpen(false)
                setConfirmTargetId(null)
              }}
              className="px-4 py-2 rounded-xl bg-rose-600 text-white font-medium hover:bg-rose-700 shadow-md shadow-rose-200/50 transition-all"
            >
              Delete
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}