"use client"

import React from "react"
import { CheckCircle2, XCircle, Clock, Award, Mail, Phone, MapPin, Calendar, FileText, User, Shield, Briefcase } from "lucide-react"

type Candidate = {
  id: string
  rollNo: string
  name: string
  dob?: string
  gender?: string
  parentName?: string
  permanentAddress?: string
  currentAddress?: string
  mobile?: string
  email?: string
  registrationNumber?: string
  aadhaarNumber?: string
  qualification?: string
  subject?: string
  postApplied?: string
  interviewDateTime?: string
  biometricStatus?: string
  documentStatus?: string
  interviewStatus?: string
  score?: number | null
  photo?: string
}

export default function CandidateCard({ candidate }: { candidate: Candidate }) {
  const badge = (status?: string) => {
    if (!status) return null
    if (status === "Verified") return (
      <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-xs font-bold shadow-md">
        <CheckCircle2 className="w-3.5 h-3.5" />
        {status}
      </div>
    )
    if (status === "Pending") return (
      <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-400 to-orange-400 text-white text-xs font-bold shadow-md">
        <Clock className="w-3.5 h-3.5" />
        {status}
      </div>
    )
    return (
      <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-rose-500 to-pink-500 text-white text-xs font-bold shadow-md">
        <XCircle className="w-3.5 h-3.5" />
        {status}
      </div>
    )
  }

  const InfoRow = ({ icon: Icon, label, value }: { icon: any, label: string, value?: string }) => (
    <div className="flex items-start gap-3 group">
      <div className="mt-0.5 p-2 rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50 group-hover:from-blue-100 group-hover:to-indigo-100 transition-colors duration-200">
        <Icon className="w-4 h-4 text-blue-600" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-0.5">{label}</p>
        <p className="text-sm font-medium text-slate-800 break-words">{value || '—'}</p>
      </div>
    </div>
  )

  return (
    <div className="w-full bg-gradient-to-br from-white via-blue-50/30 to-indigo-50/20 rounded-3xl border border-slate-200/60 shadow-2xl overflow-hidden backdrop-blur-sm">
      {/* Header Banner */}
      <div className="h-32 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yLjIxIDEuNzktNCA0LTRzNCAxLjc5IDQgNC0xLjc5IDQtNCA0LTQtMS43OS00LTR6bTAtMTBjMC0yLjIxIDEuNzktNCA0LTRzNCAxLjc5IDQgNC0xLjc5IDQtNCA0LTQtMS43OS00LTR6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-30"></div>
        <div className="absolute top-4 right-4">
          <div className="px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white text-xs font-bold">
            ID: {candidate.rollNo}
          </div>
        </div>
      </div>

      <div className="px-8 pb-8 -mt-20 relative">
        {/* Profile Section */}
        <div className="flex flex-col md:flex-row gap-6 mb-8">
          {/* Photo & Name */}
          <div className="flex flex-col items-center md:items-start">
            <div className="relative group">
              <div className="w-40 h-40 rounded-2xl overflow-hidden border-4 border-white shadow-2xl bg-gradient-to-br from-slate-200 to-slate-300 ring-4 ring-blue-100">
                <img src={candidate.photo} alt={candidate.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
              </div>
              {candidate.score !== null && candidate.score !== undefined && (
                <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 text-slate-900 font-bold shadow-lg border-2 border-white">
                    <Award className="w-4 h-4" />
                    <span className="text-sm">{candidate.score.toFixed(1)}</span>
                  </div>
                </div>
              )}
            </div>
            <div className="text-center md:text-left mt-6 space-y-1">
              <h2 className="text-2xl font-bold text-slate-900">{candidate.name}</h2>
              <p className="text-sm text-slate-500 font-mono bg-slate-100 px-3 py-1 rounded-full inline-block">
                {candidate.rollNo}
              </p>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="flex-1 bg-white rounded-2xl p-6 shadow-lg border border-slate-100">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="text-center p-4 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100">
                <Shield className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <p className="text-xs text-slate-600 font-semibold mb-1">Biometric</p>
                {badge(candidate.biometricStatus)}
              </div>
              <div className="text-center p-4 rounded-xl bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-100">
                <FileText className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                <p className="text-xs text-slate-600 font-semibold mb-1">Documents</p>
                {badge(candidate.documentStatus)}
              </div>
              <div className="text-center p-4 rounded-xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-100">
                <Briefcase className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
                <p className="text-xs text-slate-600 font-semibold mb-1">Interview</p>
                <div className="text-sm font-bold text-slate-700 mt-1">{candidate.interviewStatus || 'Pending'}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Information Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Personal Information */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100 hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center gap-3 mb-5 pb-4 border-b border-slate-100">
              <div className="p-2.5 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600">
                <User className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Personal Information</h3>
            </div>
            <div className="space-y-4">
              <InfoRow icon={Calendar} label="Date of Birth" value={candidate.dob} />
              <InfoRow icon={User} label="Gender" value={candidate.gender} />
              <InfoRow icon={User} label="Parent's Name" value={candidate.parentName} />
              <InfoRow icon={MapPin} label="Permanent Address" value={candidate.permanentAddress} />
              <InfoRow icon={MapPin} label="Current Address" value={candidate.currentAddress} />
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100 hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center gap-3 mb-5 pb-4 border-b border-slate-100">
              <div className="p-2.5 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600">
                <Phone className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Contact & Identification</h3>
            </div>
            <div className="space-y-4">
              <InfoRow icon={Phone} label="Mobile Number" value={candidate.mobile} />
              <InfoRow icon={Mail} label="Email Address" value={candidate.email} />
              <InfoRow icon={FileText} label="Registration Number" value={candidate.registrationNumber} />
              <InfoRow icon={Shield} label="Aadhaar Number" value={candidate.aadhaarNumber} />
            </div>
          </div>

          {/* Education Details */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100 hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center gap-3 mb-5 pb-4 border-b border-slate-100">
              <div className="p-2.5 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600">
                <Award className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Education & Application</h3>
            </div>
            <div className="space-y-4">
              <InfoRow icon={Award} label="Qualification" value={candidate.qualification} />
              <InfoRow icon={FileText} label="Subject" value={candidate.subject} />
              <InfoRow icon={Briefcase} label="Post Applied For" value={candidate.postApplied} />
              <InfoRow icon={Calendar} label="Interview Date & Time" value={candidate.interviewDateTime} />
            </div>
          </div>

          {/* Verification Status */}
          <div className="bg-gradient-to-br from-slate-50 to-blue-50/50 rounded-2xl p-6 shadow-lg border border-slate-200 hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center gap-3 mb-5 pb-4 border-b border-slate-200">
              <div className="p-2.5 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Verification Status</h3>
            </div>
            <div className="space-y-5">
              <div className="flex items-center justify-between p-4 rounded-xl bg-white border border-slate-100 hover:border-blue-200 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-blue-50">
                    <Shield className="w-5 h-5 text-blue-600" />
                  </div>
                  <p className="font-semibold text-slate-700">Biometric Verification</p>
                </div>
                {badge(candidate.biometricStatus)}
              </div>
              <div className="flex items-center justify-between p-4 rounded-xl bg-white border border-slate-100 hover:border-purple-200 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-purple-50">
                    <FileText className="w-5 h-5 text-purple-600" />
                  </div>
                  <p className="font-semibold text-slate-700">Document Verification</p>
                </div>
                {badge(candidate.documentStatus)}
              </div>
              <div className="flex items-center justify-between p-4 rounded-xl bg-white border border-slate-100 hover:border-emerald-200 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-emerald-50">
                    <Briefcase className="w-5 h-5 text-emerald-600" />
                  </div>
                  <p className="font-semibold text-slate-700">Interview Status</p>
                </div>
                <div className="text-sm font-bold text-slate-700 px-3 py-1.5 rounded-full bg-slate-100">
                  {candidate.interviewStatus || 'Not Scheduled'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 