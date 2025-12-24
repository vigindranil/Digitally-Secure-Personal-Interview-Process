"use client"

import { useState, useEffect } from "react"
import { Mail, Phone, Award, BookOpen, User, Save, X, Building2, Eye, EyeClosedIcon } from "lucide-react"
import { Interviewer } from "@/lib/interviewers"
import SearchableDropdown from "@/components/SearchableDropdown"
import { mockApi } from "@/app/add-panel/api"
import { getPostList, getDesignationList, saveInterviewer, SaveInterviewerRequest, getExamList } from "@/app/interviewers/api"
import { getUser } from "@/hooks/getUser"
import { useToast } from "@/components/ui/use-toast";


interface InterviewerFormProps {
  interviewer?: Interviewer
  onSubmit: (data: Omit<Interviewer, "id" | "createdAt" | "updatedAt">) => void
  onCancel?: () => void
  isLoading?: boolean
}

export default function InterviewerForm({ interviewer, onSubmit, onCancel, isLoading = false }: InterviewerFormProps) {
  const [formData, setFormData] = useState<Omit<Interviewer, "id" | "createdAt" | "updatedAt">>({
    name: interviewer?.name || "",
    mobile: interviewer?.mobile || "",
    email: interviewer?.email || "",
    postId: interviewer?.postId || "",
    postLabel: interviewer?.postLabel || "",
    designationId: interviewer?.designationId || "",
    designationLabel: interviewer?.designationLabel || "",
    username: interviewer?.username || "",
    password: interviewer?.password || "",
    bankName: interviewer?.bankName || "",
    branchName: interviewer?.branchName || "",
    ifscCode: interviewer?.ifscCode || "",
    bankAccountNumber: interviewer?.bankAccountNumber || "",
    address: interviewer?.address || "",
    examId: interviewer?.examId || "",
    examLabel: interviewer?.examLabel || "",
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [posts, setPosts] = useState<{ id: string; label: string }[]>([])
  const [designations, setDesignations] = useState<{ id: string; label: string }[]>([])
  const [loadingDesignations, setLoadingDesignations] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [exams, setExams] = useState<{ id: string; label: string }[]>([])
  const [user, setUser] = useState<any>(null);
  const { toast } = useToast()



  useEffect(() => {
    (async () => {
      const examData = await getExamList()
      const formattedExams = examData.map(e => ({
        id: e.exam_id.toString(),
        label: e.exam_name
      }))
      setExams(formattedExams)
    })()
  }, [])



  useEffect(() => {
    if (formData.examId) {
      (async () => {
        const postData = await getPostList(parseInt(formData.examId))
        const formattedPosts = postData.map(p => ({
          id: p.post_id.toString(),
          label: p.post_name
        }))
        setPosts(formattedPosts)
      })()
    } else {
      setPosts([])
    }
  }, [formData.examId])

  // Add new useEffect to fetch designations when post changes
  useEffect(() => {
    if (formData.postId) {
      (async () => {
        setLoadingDesignations(true)
        setDesignations([]) // Clear previous designations
        setFormData(prev => ({ ...prev, designationId: "", designationLabel: "" })) // Reset designation

        const designationData = await getDesignationList(parseInt(formData.postId))
        const formattedDesignations = designationData.map(d => ({
          id: d.designation_id.toString(),
          label: d.designation_name
        }))
        setDesignations(formattedDesignations)
        setLoadingDesignations(false)
      })()
    } else {
      setDesignations([])
    }
  }, [formData.postId])
  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) newErrors.name = "Name is required"
    if (!formData.mobile.trim()) newErrors.mobile = "Mobile number is required"
    if (!/^\+?[0-9\s\-()]+$/.test(formData.mobile)) newErrors.mobile = "Invalid mobile number format"
    if (!formData.email.trim()) newErrors.email = "Email is required"
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = "Invalid email format"
    if (!formData.postId) newErrors.postId = "Post is required"
    if (!formData.designationId) newErrors.designationId = "Designation is required"
    if (!formData.username.trim()) newErrors.username = "Username is required"
    if (!formData.password.trim()) newErrors.password = "Password is required"
    if (!formData.bankName.trim()) newErrors.bankName = "Bank name is required"
    if (!formData.examId) newErrors.examId = "Exam is required"
    if (!formData.branchName.trim()) newErrors.branchName = "Branch name is required"
    if (!formData.ifscCode.trim()) newErrors.ifscCode = "IFSC code is required"
    if (!formData.bankAccountNumber.trim()) newErrors.bankAccountNumber = "Account number is required"
    if (!formData.address.trim()) newErrors.address = "Address is required"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    setIsSubmitting(true)
    try {
      // Prepare API payload
      const payload: SaveInterviewerRequest = {
        inuser_id: interviewer?.id ? parseInt(interviewer.id.replace('int-', '')) : 0,
        post_id: parseInt(formData.postId),
        designation_id: parseInt(formData.designationId),
        full_name: formData.name,
        bank_name: formData.bankName,
        branch_name: formData.branchName,
        ifsc: formData.ifscCode,
        bank_acc_no: formData.bankAccountNumber,
        contact_no: formData.mobile,
        address: formData.address,
        user_name: formData.username,
        user_password: formData.password,
        entry_user_id: user?.user_id,
        user_id: 0, // Replace with actual logged-in user ID if available
      }

      // Call API
      const response = await saveInterviewer(payload)
      console.log('API response:', response)

      if (response.status === 0) {
        // Success - call parent's onSubmit with form data
        onSubmit(formData)
        toast({
          title: "Success",
          description: "Interviewer saved successfully.",
          // duration: 5000,
        });
      } else {
        // Handle API error
        alert(response.message || 'Failed to save interviewer')
      }
    } catch (error) {
      console.error('Error submitting form:', error)
      alert('An error occurred while saving the interviewer. Please try again.')
    } finally {
      setIsSubmitting(false)
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

  useEffect(() => {
    (async () => {
      const u = await getUser()
      setUser(u)
    })()
  }, [])



  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Exam */}
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-sm font-bold text-slate-700">
          <BookOpen className="h-4 w-4 text-blue-600" />
          Exam
        </label>
        <SearchableDropdown
          options={exams}
          value={formData.examId || ""}
          onChange={(val) => {
            const label = exams.find(e => e.id === val)?.label || ""
            setFormData(prev => ({
              ...prev,
              examId: val,
              examLabel: label,
              postId: "",
              postLabel: "",
              designationId: "",
              designationLabel: ""
            }))
            if (errors.examId) setErrors(prev => ({ ...prev, examId: "" }))
          }}
          placeholder="Select an exam"
          icon={<BookOpen className="h-4 w-4" />}
          label=""
        />
        {errors.examId && <p className="text-xs font-semibold text-rose-600">{errors.examId}</p>}
      </div>
      {/* Post / Role */}
      <SearchableDropdown
        options={posts.map(p => ({ id: p.id, label: p.label }))}
        value={formData.postId || ""}
        onChange={(val) => {
          const label = posts.find(p => p.id === val)?.label || ""
          setFormData(prev => ({ ...prev, postId: val, postLabel: label }))
          if (errors.postId) setErrors(prev => ({ ...prev, postId: "" }))
        }}
        placeholder="Select a post / role"
        icon={<Building2 className="h-4 w-4" />}
        label=""
        disabled={!formData.examId}
      />
      {!formData.examId && (
        <p className="text-xs text-slate-500">Please select an exam first</p>
      )}

      {/* Designation */}
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-sm font-bold text-slate-700">
          <Award className="h-4 w-4 text-blue-600" />
          Designation
        </label>
        <SearchableDropdown
          options={designations}
          value={formData.designationId || ""}
          onChange={(val) => {
            const label = designations.find(d => d.id === val)?.label || ""
            setFormData(prev => ({ ...prev, designationId: val, designationLabel: label }))
            if (errors.designationId) setErrors(prev => ({ ...prev, designationId: "" }))
          }}
          placeholder={loadingDesignations ? "Loading designations..." : "Select a designation"}
          icon={<Award className="h-4 w-4" />}
          label=""
          disabled={!formData.postId || loadingDesignations}
        />
        {!formData.postId && (
          <p className="text-xs text-slate-500">Please select a post first</p>
        )}
        {errors.designationId && <p className="text-xs font-semibold text-rose-600">{errors.designationId}</p>}
      </div>

      {/* Name Field */}
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-sm font-bold text-slate-700">
          <User className="h-4 w-4 text-blue-600" />
          Full Name
        </label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Enter interviewer name"
          className={`w-full px-4 py-3 rounded-xl border-2 font-medium transition-all ${errors.name
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
          className={`w-full px-4 py-3 rounded-xl border-2 font-medium transition-all ${errors.mobile
            ? "border-rose-500 bg-rose-50 focus:border-rose-600 focus:ring-4 focus:ring-rose-100"
            : "border-slate-200 bg-slate-50 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            } focus:outline-none`}
        />
        {errors.mobile && <p className="text-xs font-semibold text-rose-600">{errors.mobile}</p>}
      </div>

      {/* Username */}
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-sm font-bold text-slate-700">
          <User className="h-4 w-4 text-blue-600" />
          Username
        </label>
        <input
          type="text"
          name="username"
          value={formData.username || ""}
          onChange={handleChange}
          placeholder="Enter username"
          className={`w-full px-4 py-3 rounded-xl border-2 font-medium transition-all ${errors.username
            ? "border-rose-500 bg-rose-50 focus:border-rose-600 focus:ring-4 focus:ring-rose-100"
            : "border-slate-200 bg-slate-50 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            } focus:outline-none`}
        />
        {errors.username && <p className="text-xs font-semibold text-rose-600">{errors.username}</p>}
      </div>

      {/* Password */}
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-sm font-bold text-slate-700">
          <User className="h-4 w-4 text-blue-600" />
          Password
        </label>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            value={formData.password || ""}
            onChange={handleChange}
            placeholder="Enter password"
            className={`w-full px-4 py-3 rounded-xl border-2 font-medium transition-all ${errors.password
              ? "border-rose-500 bg-rose-50 focus:border-rose-600 focus:ring-4 focus:ring-rose-100"
              : "border-slate-200 bg-slate-50 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              } focus:outline-none`}

          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-500 hover:text-slate-700"
          >
            {showPassword ? <EyeClosedIcon className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        </div>

        {errors.password && <p className="text-xs font-semibold text-rose-600">{errors.password}</p>}
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
          className={`w-full px-4 py-3 rounded-xl border-2 font-medium transition-all ${errors.email
            ? "border-rose-500 bg-rose-50 focus:border-rose-600 focus:ring-4 focus:ring-rose-100"
            : "border-slate-200 bg-slate-50 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            } focus:outline-none`}
        />
        {errors.email && <p className="text-xs font-semibold text-rose-600">{errors.email}</p>}
      </div>

      {/* Bank Name */}
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-sm font-bold text-slate-700">
          Bank Name
        </label>
        <input
          type="text"
          name="bankName"
          value={formData.bankName || ""}
          onChange={handleChange}
          placeholder="Enter bank name"
          className={`w-full px-4 py-3 rounded-xl border-2 font-medium transition-all ${errors.bankName
            ? "border-rose-500 bg-rose-50 focus:border-rose-600 focus:ring-4 focus:ring-rose-100"
            : "border-slate-200 bg-slate-50 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            } focus:outline-none`}
        />
        {errors.bankName && <p className="text-xs font-semibold text-rose-600">{errors.bankName}</p>}
      </div>

      {/* Branch Name */}
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-sm font-bold text-slate-700">
          Branch Name
        </label>
        <input
          type="text"
          name="branchName"
          value={formData.branchName || ""}
          onChange={handleChange}
          placeholder="Enter branch name"
          className={`w-full px-4 py-3 rounded-xl border-2 font-medium transition-all ${errors.branchName
            ? "border-rose-500 bg-rose-50 focus:border-rose-600 focus:ring-4 focus:ring-rose-100"
            : "border-slate-200 bg-slate-50 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            } focus:outline-none`}
        />
        {errors.branchName && <p className="text-xs font-semibold text-rose-600">{errors.branchName}</p>}
      </div>

      {/* IFSC Code */}
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-sm font-bold text-slate-700">
          IFSC Code
        </label>
        <input
          type="text"
          name="ifscCode"
          value={formData.ifscCode || ""}
          onChange={handleChange}
          placeholder="e.g., SBIN0001234"
          className={`w-full px-4 py-3 rounded-xl border-2 font-medium transition-all ${errors.ifscCode
            ? "border-rose-500 bg-rose-50 focus:border-rose-600 focus:ring-4 focus:ring-rose-100"
            : "border-slate-200 bg-slate-50 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            } focus:outline-none`}
        />
        {errors.ifscCode && <p className="text-xs font-semibold text-rose-600">{errors.ifscCode}</p>}
      </div>

      {/* Bank Account Number */}
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-sm font-bold text-slate-700">
          Bank Account Number
        </label>
        <input
          type="text"
          name="bankAccountNumber"
          value={formData.bankAccountNumber || ""}
          onChange={handleChange}
          placeholder="Enter account number"
          className={`w-full px-4 py-3 rounded-xl border-2 font-medium transition-all ${errors.bankAccountNumber
            ? "border-rose-500 bg-rose-50 focus:border-rose-600 focus:ring-4 focus:ring-rose-100"
            : "border-slate-200 bg-slate-50 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            } focus:outline-none`}
        />
        {errors.bankAccountNumber && <p className="text-xs font-semibold text-rose-600">{errors.bankAccountNumber}</p>}
      </div>

      {/* Address */}
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-sm font-bold text-slate-700">
          Address
        </label>
        <textarea
          name="address"
          value={formData.address || ""}
          onChange={handleChange}
          placeholder="Enter address"
          className={`w-full px-4 py-3 rounded-xl border-2 font-medium transition-all ${errors.address
            ? "border-rose-500 bg-rose-50 focus:border-rose-600 focus:ring-4 focus:ring-rose-100"
            : "border-slate-200 bg-slate-50 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            } focus:outline-none`}
        />
        {errors.address && <p className="text-xs font-semibold text-rose-600">{errors.address}</p>}
      </div>

      {/* Qualification Field */}
      {/* <div className="space-y-2">
        <label className="flex items-center gap-2 text-sm font-bold text-slate-700">
          <Award className="h-4 w-4 text-blue-600" />
          Qualification
        </label>
        <select
          name="qualification"
          value={formData.qualification}
          onChange={handleChange}
          className={`w-full px-4 py-3 rounded-xl border-2 font-medium transition-all ${errors.qualification
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
      </div> */}

      {/* Interview Subject Field */}
      {/* <div className="space-y-2">
        <label className="flex items-center gap-2 text-sm font-bold text-slate-700">
          <BookOpen className="h-4 w-4 text-blue-600" />
          Subject of Interview
        </label>
        <select
          name="interviewSubject"
          value={formData.interviewSubject}
          onChange={handleChange}
          className={`w-full px-4 py-3 rounded-xl border-2 font-medium transition-all ${errors.interviewSubject
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
      </div> */}

      {/* Action Buttons */}
      <div className="flex items-center gap-3 pt-4">
        <button
          type="submit"
          disabled={isLoading || isSubmitting}
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
