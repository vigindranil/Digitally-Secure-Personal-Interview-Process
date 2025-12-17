"use client"

import React, { useState } from "react"
import {
  Plus,
  ChevronDown,
  ChevronUp,
  LayoutGrid,
  Clock,
  MapPin,
  Briefcase,
  Hash,
  CheckCircle2,
  Trash2,
  Building2,
  Users
} from "lucide-react"

// --- Mock Data ---

const MOCK_POSTS = [
  { id: "p1", label: "Senior Frontend Engineer" },
  { id: "p2", label: "Backend Developer" },
  { id: "p3", label: "UI/UX Designer" },
  { id: "p4", label: "Product Manager" },
]

const MOCK_SLOTS = [
  { id: "s1", label: "09:00 AM - 10:00 AM" },
  { id: "s2", label: "10:00 AM - 11:00 AM" },
  { id: "s3", label: "02:00 PM - 03:00 PM" },
  { id: "s4", label: "04:00 PM - 05:00 PM" },
]

// Mocking existing panels for the right side
const INITIAL_PANELS = [
  { id: 1, room: "Conf-A 101", post: "Senior Frontend Engineer", slot: "09:00 AM - 10:00 AM", status: "Active" },
  { id: 2, room: "Meeting Room B", post: "Product Manager", slot: "02:00 PM - 03:00 PM", status: "Active" },
  { id: 3, room: "Zoom Pod 4", post: "UI/UX Designer", slot: "10:00 AM - 11:00 AM", status: "Closed" },
]

// --- Sub-components ---

function Badge({ active }: { active: boolean }) {
  return active ? (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-xs font-medium text-emerald-700 border border-emerald-100">
      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
      Active
    </span>
  ) : (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-100 text-xs font-medium text-slate-600 border border-slate-200">
      <div className="w-1.5 h-1.5 rounded-full bg-slate-400" />
      Closed
    </span>
  )
}

// --- Main Component ---

export default function AddPanel() {
  // State for Form
  const [selectedPost, setSelectedPost] = useState("")
  const [selectedSlot, setSelectedSlot] = useState("")
  const [roomNumber, setRoomNumber] = useState("")

  // State for List
  const [panels, setPanels] = useState(INITIAL_PANELS)
  const [expandedPanelId, setExpandedPanelId] = useState<number | null>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedPost || !selectedSlot || !roomNumber) return

    const newPanel = {
      id: Date.now(),
      room: roomNumber,
      post: selectedPost,
      slot: selectedSlot,
      status: "Active"
    }

    setPanels([newPanel, ...panels])

    // Reset form
    setRoomNumber("")
    setSelectedPost("")
    setSelectedSlot("")
  }

  const handleDelete = (id: number) => {
    setPanels(prev => prev.filter(p => p.id !== id))
    if (expandedPanelId === id) setExpandedPanelId(null)
  }

  const toggleAccordion = (id: number) => {
    setExpandedPanelId(expandedPanelId === id ? null : id)
  }

  return (
    <div className="min-h-screen bg-slate-50/50 p-4 sm:p-6 lg:p-8 font-sans">
      <div className="max-w-7xl mx-auto">

        {/* Header Section */}
        <div className="mb-8 flex items-center gap-3">
          <div className="bg-gradient-to-br from-cyan-600 to-blue-600 p-2.5 rounded-xl shadow-lg shadow-cyan-900/20">
            <LayoutGrid className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Panel Management</h1>
            <p className="text-sm text-slate-500 font-medium">Configure interview rooms and slot allocations</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">

          {/* LEFT SIDE: Add Panel Form */}
          <div className="lg:col-span-5 xl:col-span-4">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm sticky top-6">
              <div className="p-6 border-b border-slate-100 bg-slate-50/50 rounded-t-2xl">
                <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                  <Plus className="h-5 w-5 text-cyan-600" />
                  Create New Panel
                </h2>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-5">

                {/* Post Dropdown */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider ml-1">
                    Interview Post
                  </label>
                  <div className="relative">
                    <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                    <select
                      value={selectedPost}
                      onChange={(e) => setSelectedPost(e.target.value)}
                      className="w-full h-11 pl-10 pr-4 rounded-xl border border-slate-200 bg-slate-50/30 text-slate-900 text-sm focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100 focus:outline-none transition-all appearance-none cursor-pointer hover:bg-white"
                    >
                      <option value="" disabled>Select a position...</option>
                      {MOCK_POSTS.map(post => (
                        <option key={post.id} value={post.label}>{post.label}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                  </div>
                </div>

                {/* Slot Dropdown */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider ml-1">
                    Time Slot
                  </label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                    <select
                      value={selectedSlot}
                      onChange={(e) => setSelectedSlot(e.target.value)}
                      className="w-full h-11 pl-10 pr-4 rounded-xl border border-slate-200 bg-slate-50/30 text-slate-900 text-sm focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100 focus:outline-none transition-all appearance-none cursor-pointer hover:bg-white"
                    >
                      <option value="" disabled>Select a time slot...</option>
                      {MOCK_SLOTS.map(slot => (
                        <option key={slot.id} value={slot.label}>{slot.label}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                  </div>
                </div>

                {/* Room Number Input */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider ml-1">
                    Room Number
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                    <input
                      type="text"
                      value={roomNumber}
                      onChange={(e) => setRoomNumber(e.target.value)}
                      placeholder="e.g. Conference Hall A"
                      className="w-full h-11 pl-10 pr-4 rounded-xl border border-slate-200 bg-slate-50/30 text-slate-900 text-sm focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100 focus:outline-none transition-all placeholder:text-slate-400 hover:bg-white"
                    />
                  </div>
                  <p className="text-xs text-slate-400 ml-1">Enter the physical location identifier.</p>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={!selectedPost || !selectedSlot || !roomNumber}
                  className="w-full mt-2 flex items-center justify-center gap-2 h-11 bg-cyan-600 hover:bg-cyan-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-medium rounded-xl transition-all shadow-md shadow-cyan-200/50 hover:shadow-cyan-200 active:scale-[0.98]"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  Assign Panel
                </button>
              </form>
            </div>
          </div>

          {/* RIGHT SIDE: Existing Panels Accordion */}
          <div className="lg:col-span-7 xl:col-span-8">
            <div className="flex items-center justify-between mb-4 px-1">
              <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                Active Panels ({panels.length})
              </h3>
              {panels.length > 0 && (
                <span className="text-xs text-slate-400">Expand to view details</span>
              )}
            </div>

            <div className="space-y-3">
              {panels.length === 0 ? (
                <div className="bg-white rounded-xl border border-dashed border-slate-300 p-12 flex flex-col items-center justify-center text-slate-400">
                  <div className="p-4 bg-slate-50 rounded-full mb-3">
                    <LayoutGrid className="h-8 w-8 opacity-50" />
                  </div>
                  <p className="text-sm font-medium">No panels assigned yet.</p>
                  <p className="text-xs opacity-70">Use the form to create your first panel.</p>
                </div>
              ) : (
                panels.map((panel) => {
                  const isExpanded = expandedPanelId === panel.id

                  return (
                    <div
                      key={panel.id}
                      className={`group bg-white rounded-xl border transition-all duration-300 overflow-hidden ${isExpanded
                          ? "border-cyan-200 shadow-md ring-1 ring-cyan-100"
                          : "border-slate-200 hover:border-cyan-200 hover:shadow-sm"
                        }`}
                    >
                      {/* Accordion Header */}
                      <button
                        onClick={() => toggleAccordion(panel.id)}
                        className="w-full flex items-center justify-between p-4 sm:p-5 text-left bg-white"
                      >
                        <div className="flex items-center gap-4">
                          <div className={`h-10 w-10 rounded-lg flex items-center justify-center transition-colors ${isExpanded ? "bg-cyan-100 text-cyan-700" : "bg-slate-100 text-slate-500 group-hover:bg-slate-200"
                            }`}>
                            <Hash className="h-5 w-5" />
                          </div>
                          <div>
                            <h4 className="text-sm font-bold text-slate-900">{panel.room}</h4>
                            <p className="text-xs text-slate-500 font-medium mt-0.5 flex items-center gap-2">
                              {panel.post}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="hidden sm:block">
                            <Badge active={panel.status === "Active"} />
                          </div>
                          {isExpanded ? (
                            <ChevronUp className="h-5 w-5 text-cyan-600" />
                          ) : (
                            <ChevronDown className="h-5 w-5 text-slate-400 group-hover:text-slate-600" />
                          )}
                        </div>
                      </button>

                      {/* Accordion Body */}
                      <div
                        className={`grid transition-all duration-300 ease-in-out ${isExpanded ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                          }`}
                      >
                        <div className="overflow-hidden">
                          <div className="p-5 pt-0 border-t border-slate-100 bg-slate-50/30">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">

                              <div className="bg-white p-3 rounded-lg border border-slate-100 shadow-sm">
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 block">Time Allocation</span>
                                <div className="flex items-center gap-2 text-slate-700">
                                  <Clock className="h-4 w-4 text-cyan-600" />
                                  <span className="text-sm font-medium">{panel.slot}</span>
                                </div>
                              </div>

                              <div className="bg-white p-3 rounded-lg border border-slate-100 shadow-sm">
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 block">Assigned Role</span>
                                <div className="flex items-center gap-2 text-slate-700">
                                  <Users className="h-4 w-4 text-indigo-600" />
                                  <span className="text-sm font-medium">{panel.post}</span>
                                </div>
                              </div>
                            </div>

                            <div className="mt-4 flex items-center justify-end gap-3">
                              <span className="sm:hidden">
                                <Badge active={panel.status === "Active"} />
                              </span>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDelete(panel.id);
                                }}
                                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-rose-600 hover:bg-rose-50 rounded-lg transition-colors border border-transparent hover:border-rose-100"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                                Remove Panel
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}