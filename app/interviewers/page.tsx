"use client"

import { useState, useMemo } from "react"
import {
  Search,
  Filter,
  Plus,
  Download,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  ChevronDown,
  TrendingUp,
  Mail,
  Phone,
  Award,
  BookOpen,
  User,
  X,
  CheckCircle2,
  Building2
} from "lucide-react"
import InterviewerForm from "@/components/interviewer-form"
import { interviewers as mockInterviewers, Interviewer } from "@/lib/interviewers"

// --- Sub-components ---

function StatusBadge() {
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-xs font-medium text-emerald-700 border border-emerald-100">
      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
      Active
    </span>
  )
}

function StatCard({ title, value, icon: Icon, trend, trendUp }: any) {
  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center justify-between mb-4">
        <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 text-slate-600">
          <Icon className="h-5 w-5" />
        </div>
        {trend && (
          <div className={`flex items-center gap-1 text-xs font-medium ${trendUp ? 'text-emerald-600' : 'text-rose-600'}`}>
            {trendUp ? <TrendingUp className="h-3 w-3" /> : <TrendingUp className="h-3 w-3 rotate-180" />}
            {trend}
          </div>
        )}
      </div>
      <div>
        <h3 className="text-slate-500 text-sm font-medium">{title}</h3>
        <p className="text-2xl font-bold text-slate-900 mt-1">{value}</p>
      </div>
    </div>
  )
}

// --- Main Page Component ---

export default function InterviewersPage() {
  const [interviewers, setInterviewers] = useState(mockInterviewers)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedRows, setSelectedRows] = useState<string[]>([])
  const [showActionMenu, setShowActionMenu] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [editingInterviewer, setEditingInterviewer] = useState<Interviewer | null>(null)
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [detailsInterviewer, setDetailsInterviewer] = useState<Interviewer | null>(null)

  const filteredInterviewers = useMemo(
    () =>
      interviewers.filter(
        (i) =>
          i.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          i.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          i.mobile.includes(searchQuery),
      ),
    [interviewers, searchQuery],
  )

  // ... (Handlers remain mostly the same, logic unchanged)
  const toggleRow = (id: string) => {
    setSelectedRows((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]))
  }

  const toggleAll = () => {
    setSelectedRows((prev) =>
      prev.length === filteredInterviewers.length ? [] : filteredInterviewers.map((i) => i.id),
    )
  }

  const handleAddInterviewer = (data: Omit<Interviewer, "id" | "createdAt" | "updatedAt">) => {
    if (editingInterviewer) {
      setInterviewers((prev) =>
        prev.map((i) =>
          i.id === editingInterviewer.id ? { ...i, ...data, updatedAt: new Date() } : i,
        ),
      )
      setEditingInterviewer(null)
    } else {
      const newInterviewer: Interviewer = {
        id: `int-${Date.now()}`,
        ...data,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      setInterviewers((prev) => [newInterviewer, ...prev])
    }
    setShowForm(false)
  }

  const handleEdit = (interviewer: Interviewer) => {
    setEditingInterviewer(interviewer)
    setShowForm(true)
    setShowActionMenu(null)
  }

  const handleDelete = (id: string) => {
    setInterviewers((prev) => prev.filter((i) => i.id !== id))
    setShowActionMenu(null)
  }

  const handleViewDetails = (interviewer: Interviewer) => {
    setDetailsInterviewer(interviewer)
    setDetailsOpen(true)
    setShowActionMenu(null)
  }

  return (
    <div className="min-h-screen bg-slate-50/50">
      {/* Top Navigation Bar style header */}
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200 px-3 sm:px-6 py-3 sm:py-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
          <div className="flex items-center gap-3">
            <div className="bg-cyan-600 p-2 rounded-lg flex-shrink-0">
              <Building2 className="h-4 sm:h-5 w-4 sm:w-5 text-white" />
            </div>
            <div className="min-w-0">
              <h1 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight truncate">Interviewers</h1>
              <p className="text-xs text-slate-500 font-medium hidden sm:block">HR Management Portal</p>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
             <button className="hidden sm:flex items-center gap-2 px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 hover:text-slate-900 transition-colors shadow-sm flex-1 sm:flex-none">
              <Download className="h-4 w-4 flex-shrink-0" />
              <span className="hidden sm:inline">Export CSV</span>
            </button>
            <button
              onClick={() => {
                setEditingInterviewer(null)
                setShowForm(true)
              }}
              className="flex items-center justify-center sm:justify-start gap-2 px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-white bg-cyan-600 rounded-lg hover:bg-cyan-700 transition-all shadow-sm shadow-cyan-200 flex-1 sm:flex-none"
            >
              <Plus className="h-4 w-4 flex-shrink-0" />
              <span className="hidden sm:inline">Add Interviewer</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-3 sm:p-6 space-y-6 sm:space-y-8">
        
        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
          <StatCard 
            title="Total Interviewers" 
            value={interviewers.length} 
            icon={User} 
            trend="12%" 
            trendUp={true} 
          />
          <StatCard 
            title="Active Profiles" 
            value={interviewers.length} 
            icon={CheckCircle2} 
            trend="100%" 
            trendUp={true} 
          />
          <StatCard 
            title="Unique Subjects" 
            value={new Set(interviewers.map((i) => i.interviewSubject)).size} 
            icon={BookOpen} 
            trend="3%" 
            trendUp={true} 
          />
        </div>

        {/* Filters & Table Container */}
        <div className="bg-white rounded-lg sm:rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          
          {/* Toolbar */}
          <div className="p-3 sm:p-4 border-b border-slate-200 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between bg-white">
            <div className="relative w-full sm:max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search interviewers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-10 pl-10 pr-4 rounded-lg border border-slate-200 text-sm focus:border-cyan-500 focus:ring-2 focus:ring-cyan-50 focus:outline-none transition-all placeholder:text-slate-400"
              />
            </div>
            
            <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
              {selectedRows.length > 0 && (
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-cyan-50 text-cyan-700 text-xs sm:text-sm font-medium animate-in fade-in whitespace-nowrap">
                  <span>{selectedRows.length} selected</span>
                  <button onClick={() => setSelectedRows([])} className="hover:text-cyan-900">
                    <X className="h-3 w-3" />
                  </button>
                </div>
              )}
              <button className="hidden sm:flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors whitespace-nowrap">
                <Filter className="h-4 w-4" />
                Filters
                <ChevronDown className="h-3 w-3 opacity-50" />
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-200">
                  <th className="w-10 sm:w-12 p-3 sm:p-4">
                    <input
                      type="checkbox"
                      checked={selectedRows.length === filteredInterviewers.length && filteredInterviewers.length > 0}
                      onChange={toggleAll}
                      className="w-4 h-4 rounded border-slate-300 text-cyan-600 focus:ring-cyan-500"
                    />
                  </th>
                  <th className="text-left py-2 sm:py-3 px-3 sm:px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Interviewer</th>
                  <th className="hidden sm:table-cell text-left py-2 sm:py-3 px-3 sm:px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Contact</th>
                  <th className="hidden md:table-cell text-left py-2 sm:py-3 px-3 sm:px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Qualification</th>
                  <th className="hidden lg:table-cell text-left py-2 sm:py-3 px-3 sm:px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Subject</th>
                  <th className="hidden sm:table-cell text-left py-2 sm:py-3 px-3 sm:px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="text-right py-2 sm:py-3 px-3 sm:px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredInterviewers.length === 0 ? (
                    <tr>
                        <td colSpan={7} className="py-12 text-center">
                            <div className="flex flex-col items-center justify-center text-slate-400">
                                <Search className="h-10 w-10 mb-2 opacity-20" />
                                <p className="text-sm font-medium">No interviewers found</p>
                            </div>
                        </td>
                    </tr>
                ) : (
                filteredInterviewers.map((interviewer) => (
                  <tr
                    key={interviewer.id}
                    className={`group hover:bg-slate-50/80 transition-colors ${
                      selectedRows.includes(interviewer.id) ? "bg-indigo-50/30" : ""
                    }`}
                  >
                    <td className="p-4">
                      <input
                        type="checkbox"
                        checked={selectedRows.includes(interviewer.id)}
                        onChange={() => toggleRow(interviewer.id)}
                        className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                      />
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-sm">
                            {interviewer.name.charAt(0)}
                        </div>
                        <span className="font-medium text-slate-900">{interviewer.name}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <Mail className="h-3.5 w-3.5 text-slate-400" />
                          {interviewer.email}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-slate-500">
                          <Phone className="h-3 w-3 text-slate-400" />
                          {interviewer.mobile}
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-700">
                            {interviewer.qualification}
                        </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2 text-sm text-slate-700">
                        <BookOpen className="h-4 w-4 text-slate-400" />
                        {interviewer.interviewSubject}
                      </div>
                    </td>
                    <td className="p-4">
                      <StatusBadge />
                    </td>
                    <td className="p-4 text-right">
                      <div className="relative inline-block text-left">
                        <button
                          onClick={() => setShowActionMenu(showActionMenu === interviewer.id ? null : interviewer.id)}
                          className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-white hover:shadow-sm border border-transparent hover:border-slate-200 transition-all"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </button>

                        {showActionMenu === interviewer.id && (
                          <>
                            <div className="fixed inset-0 z-40" onClick={() => setShowActionMenu(null)} />
                            <div className="absolute right-0 mt-2 w-48 rounded-lg border border-slate-200 bg-white shadow-lg z-50 py-1 origin-top-right">
                              <button
                                onClick={() => handleViewDetails(interviewer)}
                                className="flex w-full items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                              >
                                <Eye className="h-4 w-4 text-slate-400" />
                                View Details
                              </button>
                              <button
                                onClick={() => handleEdit(interviewer)}
                                className="flex w-full items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                              >
                                <Edit className="h-4 w-4 text-slate-400" />
                                Edit
                              </button>
                              <div className="my-1 border-t border-slate-100" />
                              <button
                                onClick={() => handleDelete(interviewer.id)}
                                className="flex w-full items-center gap-2 px-4 py-2 text-sm text-rose-600 hover:bg-rose-50"
                              >
                                <Trash2 className="h-4 w-4" />
                                Delete
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                )))}
              </tbody>
            </table>
          </div>

          {/* Footer */}
          <div className="border-t border-slate-200 px-4 py-3 bg-white flex items-center justify-between">
            <p className="text-sm text-slate-500">
              Showing <span className="font-semibold text-slate-900">{filteredInterviewers.length}</span> of {interviewers.length} results
            </p>
            <div className="flex gap-2">
                <button className="px-3 py-1 text-sm border border-slate-200 rounded-md text-slate-500 disabled:opacity-50" disabled>Previous</button>
                <button className="px-3 py-1 text-sm border border-slate-200 rounded-md text-slate-500 disabled:opacity-50" disabled>Next</button>
            </div>
          </div>
        </div>
      </main>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setShowForm(false)} />
            <div className="relative w-full max-w-2xl bg-white rounded-xl shadow-2xl border border-slate-200 flex flex-col max-h-[90vh]">
              <div className="flex items-center justify-between p-6 border-b border-slate-100">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">
                    {editingInterviewer ? "Edit Profile" : "New Interviewer"}
                  </h2>
                  <p className="text-sm text-slate-500 mt-1">
                    {editingInterviewer ? "Update the interviewer's credentials." : "Add a new interviewer to the system."}
                  </p>
                </div>
                <button onClick={() => setShowForm(false)} className="p-2 text-slate-400 hover:bg-slate-100 rounded-full transition-colors">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="p-6 overflow-y-auto">
                <InterviewerForm
                  interviewer={editingInterviewer || undefined}
                  onSubmit={handleAddInterviewer}
                  onCancel={() => {
                    setShowForm(false)
                    setEditingInterviewer(null)
                  }}
                />
              </div>
            </div>
        </div>
      )}

      {/* Details Modal */}
      {detailsOpen && detailsInterviewer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setDetailsOpen(false)} />
            <div className="relative w-full max-w-lg bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden">
                <div className="relative h-24 bg-gradient-to-r from-indigo-600 to-blue-600">
                     <button onClick={() => setDetailsOpen(false)} className="absolute top-4 right-4 p-2 text-white/70 hover:bg-white/10 rounded-full transition-colors">
                        <X className="h-5 w-5" />
                    </button>
                </div>
                <div className="px-6 pb-6">
                    <div className="relative -mt-10 mb-5 flex justify-between items-end">
                        <div className="h-20 w-20 rounded-xl border-4 border-white bg-white shadow-md flex items-center justify-center text-2xl font-bold text-indigo-600">
                            {detailsInterviewer.name.charAt(0)}
                        </div>
                        <span className="mb-2 px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-full border border-emerald-100">
                            Active Status
                        </span>
                    </div>

                    <div className="space-y-1 mb-6">
                        <h2 className="text-2xl font-bold text-slate-900">{detailsInterviewer.name}</h2>
                        <p className="text-slate-500 font-medium">{detailsInterviewer.qualification} • {detailsInterviewer.interviewSubject}</p>
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Contact Information</h3>
                        <div className="grid grid-cols-1 gap-4">
                            <div className="flex items-center p-3 rounded-lg border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-colors">
                                <div className="h-10 w-10 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-500 mr-4 shadow-sm">
                                    <Mail className="h-5 w-5" />
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500 font-semibold">Email Address</p>
                                    <p className="text-sm font-medium text-slate-900">{detailsInterviewer.email}</p>
                                </div>
                            </div>
                            <div className="flex items-center p-3 rounded-lg border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-colors">
                                <div className="h-10 w-10 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-500 mr-4 shadow-sm">
                                    <Phone className="h-5 w-5" />
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500 font-semibold">Mobile Number</p>
                                    <p className="text-sm font-medium text-slate-900">{detailsInterviewer.mobile}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 pt-6 border-t border-slate-100 flex gap-3">
                        <button 
                            onClick={() => {
                                handleEdit(detailsInterviewer)
                                setDetailsOpen(false)
                            }}
                            className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 rounded-lg transition-all shadow-sm shadow-indigo-200"
                        >
                            Edit Profile
                        </button>
                        <button 
                            onClick={() => setDetailsOpen(false)}
                            className="flex-1 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-medium py-2.5 rounded-lg transition-all"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
      )}
    </div>
  )
}