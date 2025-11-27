"use client"

import { useMemo, useState } from "react"
import {
  Search,
  Filter,
  Download,
  Plus,
  ChevronDown,
  CheckCircle2,
  Clock,
  XCircle,
  AlertCircle,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Star,
  TrendingUp,
  Award,
  Users,
  X,
  FileText
} from "lucide-react"
import CandidateCard from "../../components/candidate-card"
import { candidates as mockCandidates } from "../../lib/candidates"

// --- Sub-components ---

function StatusBadge({ status }: { status?: string }) {
  const styles: Record<string, { bg: string; text: string; dot: string; icon: any }> = {
    Verified: { bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-500", icon: CheckCircle2 },
    Completed: { bg: "bg-blue-50", text: "text-blue-700", dot: "bg-blue-500", icon: CheckCircle2 },
    Pending: { bg: "bg-amber-50", text: "text-amber-700", dot: "bg-amber-500", icon: Clock },
    Scheduled: { bg: "bg-indigo-50", text: "text-indigo-700", dot: "bg-indigo-500", icon: AlertCircle },
    Failed: { bg: "bg-rose-50", text: "text-rose-700", dot: "bg-rose-500", icon: XCircle },
  }

  const style = styles[(status as keyof typeof styles) || "Pending"] || styles.Pending

  if (!status) return <span className="text-slate-400 text-xs">—</span>

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border border-transparent ${style.bg} ${style.text}`}>
      <div className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
      {status}
    </span>
  )
}

function StatCard({ title, value, icon: Icon, trend, trendUp, subtext }: any) {
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
        <div className="flex items-baseline gap-2 mt-1">
            <p className="text-2xl font-bold text-slate-900">{value}</p>
            {subtext && <p className="text-xs text-slate-400">{subtext}</p>}
        </div>
      </div>
    </div>
  )
}

const ratingTopics = [
  { id: "communication", label: "Communication Clarity", icon: "💬" },
  { id: "domain", label: "Domain Knowledge", icon: "📚" },
  { id: "problemSolving", label: "Problem Solving", icon: "🧩" },
  { id: "professionalism", label: "Professionalism", icon: "👔" },
  { id: "decisionMaking", label: "Decision Making", icon: "🎯" },
]

const createDefaultTopicScores = () =>
  ratingTopics.reduce<Record<string, number>>((acc, topic) => {
    acc[topic.id] = 5
    return acc
  }, {})

// --- Main Page Component ---

export default function CandidatesPage() {
  const user = { role: "panelMember" }
  const canRate = user?.role === "panelMember" || user?.role === "systemAdministrator"

  const [candidates, setCandidates] = useState(mockCandidates)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedRows, setSelectedRows] = useState<string[]>([])
  const [showActionMenu, setShowActionMenu] = useState<string | null>(null)
  const [ratingDialogOpen, setRatingDialogOpen] = useState(false)
  const [ratingCandidate, setRatingCandidate] = useState<typeof mockCandidates[0] | null>(null)
  const [ratingValues, setRatingValues] = useState<Record<string, number>>(createDefaultTopicScores())
  const [savedRatings, setSavedRatings] = useState<Record<string, Record<string, number>>>({})
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [detailsCandidate, setDetailsCandidate] = useState<typeof mockCandidates[0] | null>(null)

  const filteredCandidates = useMemo(
    () =>
      candidates.filter(
        (c) =>
          c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.rollNo.toLowerCase().includes(searchQuery.toLowerCase()),
      ),
    [candidates, searchQuery],
  )

  const toggleRow = (id: string) => {
    setSelectedRows(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    )
  }

  const toggleAll = () => {
    setSelectedRows((prev) =>
      prev.length === filteredCandidates.length ? [] : filteredCandidates.map((c) => c.id),
    )
  }

  const openRatingDialog = (candidate: (typeof mockCandidates)[0]) => {
    setRatingCandidate(candidate)
    const existing = savedRatings[candidate.id]
    setRatingValues(existing ?? createDefaultTopicScores())
    setRatingDialogOpen(true)
    setShowActionMenu(null)
  }

  const handleRatingChange = (topicId: string, value: number) => {
    setRatingValues((prev) => ({
      ...prev,
      [topicId]: value,
    }))
  }

  const handleSaveRatings = () => {
    if (!ratingCandidate) return
    const newRatings = { ...ratingValues }
    const average =
      Object.values(newRatings).reduce((sum, value) => sum + value, 0) / ratingTopics.length
    setSavedRatings((prev) => ({
      ...prev,
      [ratingCandidate.id]: newRatings,
    }))
    setCandidates((prev) =>
      prev.map((candidate) =>
        candidate.id === ratingCandidate.id
          ? { ...candidate, score: Number(average.toFixed(1)) * 10, interviewStatus: "Completed" }
          : candidate,
      ),
    )
    setRatingDialogOpen(false)
    setRatingCandidate(null)
  }

  const averageScore = candidates.filter((c) => typeof c.score === "number").length > 0
    ? (
        candidates
          .filter((c) => typeof c.score === "number")
          .reduce((sum, c) => sum + (c.score || 0), 0) /
        candidates.filter((c) => typeof c.score === "number").length
      ).toFixed(1)
    : "—"

  return (
    <div className="min-h-screen bg-slate-50/50">
      
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200 px-3 sm:px-6 py-3 sm:py-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-lg flex-shrink-0">
              <Users className="h-4 sm:h-5 w-4 sm:w-5 text-white" />
            </div>
            <div className="min-w-0">
              <h1 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight truncate">Candidates</h1>
              <p className="text-xs text-slate-500 font-medium hidden sm:block">Recruitment Pipeline</p>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
             <button className="hidden sm:flex items-center gap-2 px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 hover:text-slate-900 transition-colors shadow-sm flex-1 sm:flex-none">
              <Download className="h-4 w-4 flex-shrink-0" />
              <span className="hidden sm:inline">Export</span>
            </button>
            <button className="flex items-center justify-center sm:justify-start gap-2 px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all shadow-sm shadow-blue-200 flex-1 sm:flex-none">
              <Plus className="h-4 w-4 flex-shrink-0" />
              <span className="sm:inline">Add</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-3 sm:p-6 space-y-6 sm:space-y-8">
        {/* Stats Section */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
           <StatCard 
            title="Total Candidates" 
            value={candidates.length} 
            icon={Users} 
            trend="12%" 
            trendUp={true} 
           />
           <StatCard 
            title="Interviews Done" 
            value={candidates.filter((c) => c.interviewStatus === "Completed").length} 
            icon={CheckCircle2} 
            trend="8%" 
            trendUp={true} 
           />
           <StatCard 
            title="Pending Actions" 
            value={candidates.filter((c) => c.biometricStatus === "Pending" || c.documentStatus === "Pending").length} 
            icon={Clock} 
            trend="3%" 
            trendUp={false} 
           />
           <StatCard 
            title="Average Score" 
            value={averageScore} 
            icon={Award} 
            subtext="/ 100"
            trend="5%" 
            trendUp={true} 
           />
        </div>

        {/* Filters & Table Section */}
        <div className="bg-white rounded-lg sm:rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          
          {/* Toolbar */}
          <div className="p-3 sm:p-4 border-b border-slate-200 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between bg-white">
            <div className="relative w-full sm:max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search candidates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-10 pl-10 pr-4 rounded-lg border border-slate-200 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-50 focus:outline-none transition-all placeholder:text-slate-400"
              />
            </div>
            
            <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
              {selectedRows.length > 0 && (
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 text-xs sm:text-sm font-medium animate-in fade-in whitespace-nowrap">
                  <span>{selectedRows.length} selected</span>
                  <button onClick={() => setSelectedRows([])} className="hover:text-blue-900">
                    <X className="h-3 w-3" />
                  </button>
                </div>
              )}
              <button className="hidden sm:flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors whitespace-nowrap">
                <Filter className="h-4 w-4" />
                Filter
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
                      checked={selectedRows.length === filteredCandidates.length && filteredCandidates.length > 0}
                      onChange={toggleAll}
                      className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    />
                  </th>
                  <th className="text-left py-2 sm:py-3 px-3 sm:px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Candidate</th>
                  <th className="hidden sm:table-cell text-left py-2 sm:py-3 px-3 sm:px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Roll No</th>
                  <th className="hidden md:table-cell text-left py-2 sm:py-3 px-3 sm:px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Category</th>
                  <th className="hidden md:table-cell text-left py-2 sm:py-3 px-3 sm:px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="hidden lg:table-cell text-left py-2 sm:py-3 px-3 sm:px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Documents</th>
                  <th className="text-right py-2 sm:py-3 px-3 sm:px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Score</th>
                  <th className="text-right py-2 sm:py-3 px-3 sm:px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredCandidates.length === 0 ? (
                    <tr>
                        <td colSpan={9} className="py-12 text-center">
                            <div className="flex flex-col items-center justify-center text-slate-400">
                                <Search className="h-10 w-10 mb-2 opacity-20" />
                                <p className="text-sm font-medium">No candidates found</p>
                            </div>
                        </td>
                    </tr>
                ) : (
                filteredCandidates.map((candidate) => (
                  <tr 
                    key={candidate.id} 
                    className={`group hover:bg-slate-50/80 transition-colors ${selectedRows.includes(candidate.id) ? 'bg-blue-50/30' : ''}`}
                  >
                    <td className="p-4">
                      <input
                        type="checkbox"
                        checked={selectedRows.includes(candidate.id)}
                        onChange={() => toggleRow(candidate.id)}
                        className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                      />
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="relative h-9 w-9">
                          <img 
                            src={candidate.photo} 
                            alt={candidate.name} 
                            className="h-full w-full rounded-full object-cover border border-slate-200" 
                          />
                          {candidate.score && candidate.score >= 90 && (
                            <div className="absolute -top-1 -right-1 bg-white rounded-full p-0.5 shadow-sm">
                                <Award className="h-3 w-3 text-amber-500 fill-amber-500" />
                            </div>
                          )}
                        </div>
                        <span className="font-medium text-slate-900 text-sm">{candidate.name}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="font-mono text-xs text-slate-600 bg-slate-100 px-2 py-1 rounded">{candidate.rollNo}</span>
                    </td>
                    <td className="p-4">
                      <span className="text-sm text-slate-600">{candidate.category}</span>
                    </td>
                    <td className="p-4">
                      <StatusBadge status={candidate.biometricStatus} />
                    </td>
                    <td className="p-4">
                      <StatusBadge status={candidate.documentStatus} />
                    </td>
                    <td className="p-4">
                      <StatusBadge status={candidate.interviewStatus} />
                    </td>
                    <td className="p-4 text-right">
                      {candidate.score ? (
                        <span className="inline-flex items-center gap-1 font-semibold text-slate-900">
                          {candidate.score.toFixed(1)}
                          <Star className="h-3 w-3 text-amber-400 fill-amber-400" />
                        </span>
                      ) : (
                        <span className="text-slate-400 text-sm">—</span>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      <div className="relative inline-block text-left">
                        <button
                            onClick={() => setShowActionMenu(showActionMenu === candidate.id ? null : candidate.id)}
                            className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-white hover:shadow-sm border border-transparent hover:border-slate-200 transition-all"
                        >
                            <MoreHorizontal className="h-4 w-4" />
                        </button>
                        
                        {showActionMenu === candidate.id && (
                          <>
                            <div className="fixed inset-0 z-40" onClick={() => setShowActionMenu(null)} />
                            <div className="absolute right-0 mt-2 w-48 rounded-lg border border-slate-200 bg-white shadow-lg z-50 py-1">
                              {canRate && (
                                <>
                                  <button
                                    className="flex w-full items-center gap-2 px-4 py-2 text-sm text-amber-700 hover:bg-amber-50"
                                    onClick={() => openRatingDialog(candidate)}
                                  >
                                    <Star className="h-4 w-4" />
                                    Rate Candidate
                                  </button>
                                  <div className="my-1 border-t border-slate-100" />
                                </>
                              )}
                              <button
                                onClick={() => {
                                  setDetailsCandidate(candidate)
                                  setDetailsOpen(true)
                                  setShowActionMenu(null)
                                }}
                                className="flex w-full items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                              >
                                <Eye className="h-4 w-4 text-slate-400" />
                                View Details
                              </button>
                              <button className="flex w-full items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">
                                <Edit className="h-4 w-4 text-slate-400" />
                                Edit Info
                              </button>
                              <div className="my-1 border-t border-slate-100" />
                              <button className="flex w-full items-center gap-2 px-4 py-2 text-sm text-rose-600 hover:bg-rose-50">
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

          {/* Pagination */}
          <div className="border-t border-slate-200 px-4 py-3 bg-white flex items-center justify-between">
            <p className="text-sm text-slate-500">
              Showing <span className="font-semibold text-slate-900">{filteredCandidates.length}</span> of {candidates.length} results
            </p>
            <div className="flex gap-2">
                <button className="px-3 py-1 text-sm border border-slate-200 rounded-md text-slate-500 disabled:opacity-50" disabled>Previous</button>
                <button className="px-3 py-1 text-sm border border-slate-200 rounded-md text-slate-500 disabled:opacity-50" disabled>Next</button>
            </div>
          </div>
        </div>
      </main>

      {/* Rating Dialog */}
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
                {/* Candidate Summary */}
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

      {/* Details Dialog */}
      {detailsOpen && detailsCandidate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setDetailsOpen(false)} />
            <div className="relative w-full max-w-3xl bg-white rounded-xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
                <div className="absolute top-4 right-4 z-10">
                     <button onClick={() => setDetailsOpen(false)} className="p-2 bg-white/80 hover:bg-white text-slate-500 rounded-full shadow-sm transition-all">
                        <X className="h-5 w-5" />
                    </button>
                </div>
                {/* Using the imported CandidateCard here. 
                   We wrap it to ensure it fits the modal style 
                */}
                <div className="p-0">
                    <CandidateCard candidate={detailsCandidate} />
                </div>
                
                <div className="p-4 border-t border-slate-200 bg-slate-50 flex justify-end">
                    <button
                    onClick={() => {
                        setDetailsOpen(false)
                        setDetailsCandidate(null)
                    }}
                    className="px-4 py-2 rounded-lg bg-white border border-slate-200 text-slate-700 font-medium hover:bg-slate-50"
                    >
                    Close
                    </button>
                </div>
            </div>
        </div>
      )}
    </div>
  )
}