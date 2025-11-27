"use client"

import { useState } from "react"
import { Mail, Phone, Award, BookOpen, User, Save, X } from "lucide-react"
import { Interviewer } from "@/lib/interviewers"

interface InterviewerFormProps {
  interviewer?: Interviewer
  onSubmit: (data: Omit<Interviewer, "id" | "createdAt" | "updatedAt">) => void
  onCancel?: () => void
  isLoading?: boolean
}

export default function InterviewerForm({ interviewer, onSubmit, onCancel, isLoading = false }: InterviewerFormProps) {
  const [formData, setFormData] = useState({
    name: interviewer?.name || "",
    mobile: interviewer?.mobile || "",
    email: interviewer?.email || "",
    qualification: interviewer?.qualification || "",
    interviewSubject: interviewer?.interviewSubject || "",
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) newErrors.name = "Name is required"
    if (!formData.mobile.trim()) newErrors.mobile = "Mobile number is required"
    if (!/^\+?[0-9\s\-()]+$/.test(formData.mobile)) newErrors.mobile = "Invalid mobile number format"
    if (!formData.email.trim()) newErrors.email = "Email is required"
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = "Invalid email format"
    if (!formData.qualification.trim()) newErrors.qualification = "Qualification is required"
    if (!formData.interviewSubject.trim()) newErrors.interviewSubject = "Subject is required"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      onSubmit(formData)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }))
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Name Field */}
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-sm font-bold text-slate-700">
          <User className="h-4 w-4 text-blue-600" />
          Name
        </label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Enter interviewer name"
          className={`w-full px-4 py-3 rounded-xl border-2 font-medium transition-all ${
            errors.name
              ? "border-rose-500 bg-rose-50 focus:border-rose-600 focus:ring-4 focus:ring-rose-100"
              : "border-slate-200 bg-slate-50 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
          } focus:outline-none`}
        />
        {errors.name && <p className="text-xs font-semibold text-rose-600">{errors.name}</p>}
      </div>

      {/* Mobile Number Field */}
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-sm font-bold text-slate-700">
          <Phone className="h-4 w-4 text-blue-600" />
          Mobile Number
        </label>
        <input
          type="tel"
          name="mobile"
          value={formData.mobile}
          onChange={handleChange}
          placeholder="e.g., +91 9876543210"
          className={`w-full px-4 py-3 rounded-xl border-2 font-medium transition-all ${
            errors.mobile
              ? "border-rose-500 bg-rose-50 focus:border-rose-600 focus:ring-4 focus:ring-rose-100"
              : "border-slate-200 bg-slate-50 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
          } focus:outline-none`}
        />
        {errors.mobile && <p className="text-xs font-semibold text-rose-600">{errors.mobile}</p>}
      </div>

      {/* Email Field */}
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-sm font-bold text-slate-700">
          <Mail className="h-4 w-4 text-blue-600" />
          Email Address
        </label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="e.g., name@company.com"
          className={`w-full px-4 py-3 rounded-xl border-2 font-medium transition-all ${
            errors.email
              ? "border-rose-500 bg-rose-50 focus:border-rose-600 focus:ring-4 focus:ring-rose-100"
              : "border-slate-200 bg-slate-50 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
          } focus:outline-none`}
        />
        {errors.email && <p className="text-xs font-semibold text-rose-600">{errors.email}</p>}
      </div>

      {/* Qualification Field */}
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-sm font-bold text-slate-700">
          <Award className="h-4 w-4 text-blue-600" />
          Qualification
        </label>
        <select
          name="qualification"
          value={formData.qualification}
          onChange={handleChange}
          className={`w-full px-4 py-3 rounded-xl border-2 font-medium transition-all ${
            errors.qualification
              ? "border-rose-500 bg-rose-50 focus:border-rose-600 focus:ring-4 focus:ring-rose-100"
              : "border-slate-200 bg-slate-50 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
          } focus:outline-none`}
        >
          <option value="">Select a qualification</option>
          <option value="B.Tech">B.Tech</option>
          <option value="B.Sc">B.Sc</option>
          <option value="M.Tech">M.Tech</option>
          <option value="M.Sc">M.Sc</option>
          <option value="M.B.A">M.B.A</option>
          <option value="Ph.D">Ph.D</option>
          <option value="B.E">B.E</option>
          <option value="M.E">M.E</option>
        </select>
        {errors.qualification && <p className="text-xs font-semibold text-rose-600">{errors.qualification}</p>}
      </div>

      {/* Interview Subject Field */}
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-sm font-bold text-slate-700">
          <BookOpen className="h-4 w-4 text-blue-600" />
          Subject of Interview
        </label>
        <select
          name="interviewSubject"
          value={formData.interviewSubject}
          onChange={handleChange}
          className={`w-full px-4 py-3 rounded-xl border-2 font-medium transition-all ${
            errors.interviewSubject
              ? "border-rose-500 bg-rose-50 focus:border-rose-600 focus:ring-4 focus:ring-rose-100"
              : "border-slate-200 bg-slate-50 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
          } focus:outline-none`}
        >
          <option value="">Select interview subject</option>
          <option value="Full Stack Development">Full Stack Development</option>
          <option value="Frontend Development">Frontend Development</option>
          <option value="Backend Development">Backend Development</option>
          <option value="Data Science">Data Science</option>
          <option value="DevOps Engineering">DevOps Engineering</option>
          <option value="Cloud Architecture">Cloud Architecture</option>
          <option value="Mobile Development">Mobile Development</option>
          <option value="Database Design">Database Design</option>
        </select>
        {errors.interviewSubject && <p className="text-xs font-semibold text-rose-600">{errors.interviewSubject}</p>}
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-3 pt-4">
        <button
          type="submit"
          disabled={isLoading}
          className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Save className="h-4 w-4" />
          {isLoading ? "Saving..." : interviewer ? "Update" : "Add"} Interviewer
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-slate-700 bg-white border-2 border-slate-300 hover:bg-slate-50 transition-all"
          >
            <X className="h-4 w-4" />
            Cancel
          </button>
        )}
      </div>
    </form>
  )
}
