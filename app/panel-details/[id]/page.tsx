"use client"
import { useEffect, useMemo, useState } from "react"
import { useParams, useSearchParams, useRouter } from "next/navigation"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { mockApi, Panel, PanelAssignment } from "@/app/add-panel/api"
import { Building2, CalendarDays, Users, Edit2, Trash2, Plus, Loader2, Search } from "lucide-react"
import { interviewers as allInterviewers } from "@/lib/interviewers"

export default function PanelDetailsPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const router = useRouter()
  const panelId = String(params?.id || "")
  const venueId = String(searchParams?.get("venueId") || "")
  const [panel, setPanel] = useState<Panel | null>(null)
  const [venueLabel, setVenueLabel] = useState<string>("")
  const [assignments, setAssignments] = useState<PanelAssignment[]>([])
  const [loading, setLoading] = useState(true)
  const [assignOpen, setAssignOpen] = useState(false)
  const [editAssignmentId, setEditAssignmentId] = useState<string | null>(null)
  const [selectedInterviewers, setSelectedInterviewers] = useState<string[]>([])
  const [assignDate, setAssignDate] = useState<string>("")
  const [modalSearch, setModalSearch] = useState<string>("")
  const filteredInterviewers = useMemo(() => {
    const term = modalSearch.trim().toLowerCase()
    return allInterviewers.filter(i => i.name.toLowerCase().includes(term))
  }, [modalSearch])

  useEffect(() => {
    ; (async () => {
      setLoading(true)
      const p = await mockApi.getPanelById(panelId)
      setPanel(p)
      const v = await mockApi.getVenueById(venueId)
      setVenueLabel(v?.label || "")
      const a = await mockApi.getAssignmentsByPanel(panelId)
      setAssignments(a)
      setLoading(false)
    })()
  }, [panelId, venueId])

  const toggleInterviewer = (id: string) => {
    setSelectedInterviewers(prev => {
      if (editAssignmentId) {
        return [id]
      }
      return prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    })
  }

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-cyan-50/30 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 flex items-center gap-3">
          <div className="bg-gradient-to-br from-indigo-600 to-purple-600 p-2.5 rounded-xl shadow-lg">
            <LayoutTitleIcon />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Panel Details</h1>
            <p className="text-sm text-slate-500 font-medium">Manage interview assignments</p>
          </div>
        </div>

        <Card className="border-0 shadow-lg rounded-2xl overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
              <CardTitle className="text-white text-lg font-bold">
                {panel?.panelName || "Loading..."}
              </CardTitle>
              <div className="flex items-center gap-2">
                <Badge className="bg-white/20 backdrop-blur-sm text-white border-white/30 px-2 py-1 text-xs flex items-center gap-1">
                  <Building2 className="h-3 w-3" />
                  {venueLabel || "Venue"}
                </Badge>
                <Badge className="bg-white/20 backdrop-blur-sm text-white border-white/30 px-2 py-1 text-xs flex items-center gap-1">
                  <CalendarDays className="h-3 w-3" />
                  {panel?.roomNumber}
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div className="flex items-center justify-between">
              <div />
              <Button onClick={() => { setEditAssignmentId(null); setSelectedInterviewers([]); setAssignDate(''); setAssignOpen(true) }} className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
                <Plus className="h-4 w-4 mr-1" />
                Assign Interviews to Panel
              </Button>
            </div>

            <div className="overflow-x-auto">
              {loading ? (
                <div className="py-12 flex items-center justify-center">
                  <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
                </div>
              ) : assignments.length === 0 ? (
                <div className="py-12 text-center text-slate-500 text-sm">No assignments yet</div>
              ) : (
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-200">
                      <th className="text-left py-3 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Panel Name</th>
                      <th className="text-left py-3 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Interview Date</th>
                      <th className="text-left py-3 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Interviewer</th>
                      <th className="text-center py-3 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {assignments.map((a) => (
                      <tr key={a.id} className="group hover:bg-slate-50/50 transition-colors">
                        <td className="py-4 px-4">
                          <span className="text-sm font-semibold text-slate-900">{panel?.panelName}</span>
                        </td>
                        <td className="py-4 px-4">
                          <input
                            type="date"
                            value={a.date}
                            onChange={(e) => handleUpdateAssignment(a.id, undefined, e.target.value)}
                            className="h-9 rounded-lg border border-slate-200 bg-white px-3 text-xs"
                          />
                        </td>
                        <td className="py-4 px-4">
                          <select
                            value={a.interviewerId}
                            onChange={(e) => handleUpdateAssignment(a.id, e.target.value, undefined)}
                            className="h-9 rounded-lg border border-slate-200 bg-white px-3 text-xs"
                          >
                            {allInterviewers.map(i => (
                              <option key={i.id} value={i.id}>{i.name}</option>
                            ))}
                          </select>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => { setEditAssignmentId(a.id); setSelectedInterviewers([a.interviewerId]); setAssignDate(a.date); setModalSearch(""); setAssignOpen(true) }}
                              className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg transition-colors border border-transparent hover:border-blue-100"
                              title="Edit assignment"
                            >
                              <Edit2 className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteAssignment(a.id)}
                              className="p-2 hover:bg-rose-50 text-rose-600 rounded-lg transition-colors border border-transparent hover:border-rose-100"
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
              )}
            </div>
          </CardContent>
        </Card>
      </div>
      {assignOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-3/5">
            <h2 className="text-lg font-bold mb-4">{editAssignmentId ? 'Edit Assignment' : 'Assign Interviews to Panel'}</h2>
            <label className="font-semibold">Select Interviewers</label>
            <div className="mt-2 mb-4">
              <input
                type="text"
                value={modalSearch}
                onChange={(e) => setModalSearch(e.target.value)}
                placeholder="Search interviewers"
                className="w-full h-10 px-3 rounded-lg border border-slate-200 bg-white text-sm"
              />
              <div className="mt-2 max-h-48 overflow-y-auto border border-slate-200 rounded-lg">
                {filteredInterviewers.map(i => (
                  <label key={i.id} className="flex items-center gap-2 px-3 py-2 text-sm">
                    <input
                      type="checkbox"
                      checked={selectedInterviewers.includes(i.id)}
                      onChange={() => toggleInterviewer(i.id)}
                    />
                    <span>{i.name}</span>
                  </label>
                ))}
                {filteredInterviewers.length === 0 && (
                  <div className="px-3 py-2 text-sm text-slate-400">No interviewers found</div>
                )}
              </div>
            </div>
            <div className="flex justify-between mb-4">
              <button
                className="bg-green-500 text-white px-4 py-2 rounded"
                onClick={() => setSelectedInterviewers(allInterviewers.map(i => i.id))}
              >
                Select All Interviewers
              </button>
              <button
                className="bg-gray-200 text-slate-800 px-4 py-2 rounded"
                onClick={() => setSelectedInterviewers([])}
              >
                Clear Selection
              </button>
            </div>
            <label className="font-semibold">Interview Date</label>
            <input
              type="date"
              value={assignDate}
              onChange={(e) => setAssignDate(e.target.value)}
              className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm w-full mb-4"
            />
            <div className="flex justify-end">
              <button
                className="bg-gray-500 text-white px-4 py-2 rounded mr-2"
                onClick={() => {
                  setAssignOpen(false)
                  setEditAssignmentId(null)
                  setSelectedInterviewers([])
                  setAssignDate('')
                  setModalSearch('')
                }}
              >
                Cancel
              </button>
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded"
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
                  setModalSearch('')
                }}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function LayoutTitleIcon() {
  return <Users className="h-6 w-6 text-white" />
}
