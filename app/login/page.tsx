"use client"

import { useEffect, useMemo, useState } from "react"
import { ShieldCheck, UserCheck, Users, Phone, Lock, Sparkles, ArrowRight } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import Image from "next/image"

const DEMO_OTP = "123456"

type RoleId =
  | "systemAdministrator"
  | "biometricVerifierExaminer"
  | "documentVerifierExaminer"
  | "preInterviewExaminer"
  | "panelMember"

type RoleOption = {
  id: RoleId
  label: string
  description: string
  phone: string
  email: string
  accent: string
  icon: any
  meta: string
}

const roleOptions: RoleOption[] = [
  {
    id: "systemAdministrator",
    label: "System Admin",
    description: "Full control & workflow",
    phone: "+91 98765 43210",
    email: "systemadmin@system.com",
    accent: "from-sky-500 to-cyan-500",
    icon: ShieldCheck,
    meta: "Full control",
  },
  {
    id: "biometricVerifierExaminer",
    label: "Biometric Verifier",
    description: "Device status updates",
    phone: "+91 91234 56780",
    email: "biometric.verifier@system.com",
    accent: "from-emerald-500 to-teal-500",
    icon: UserCheck,
    meta: "External",
  },
  {
    id: "documentVerifierExaminer",
    label: "Document Verifier",
    description: "Manual scrutiny",
    phone: "+91 92345 67810",
    email: "document.verifier@system.com",
    accent: "from-amber-500 to-orange-500",
    icon: UserCheck,
    meta: "Manual",
  },
  {
    id: "preInterviewExaminer",
    label: "Pre-Interview",
    description: "Readiness checks",
    phone: "+91 93456 78100",
    email: "pre.interview@system.com",
    accent: "from-indigo-500 to-purple-500",
    icon: ShieldCheck,
    meta: "Operations",
  },
  {
    id: "panelMember",
    label: "Panel Member",
    description: "Scoring & interviews",
    phone: "+91 99887 66550",
    email: "panel.member@system.com",
    accent: "from-purple-500 to-pink-500",
    icon: Users,
    meta: "Interviews",
  },
]

export default function LoginPage() {
  const { login, isLoading } = useAuth()
  const [selectedRole, setSelectedRole] = useState<RoleId>("systemAdministrator")
  const [mobile, setMobile] = useState(roleOptions[0].phone)
  const [otp, setOtp] = useState("")
  const [otpSent, setOtpSent] = useState(false)
  const [secondsLeft, setSecondsLeft] = useState(0)
  const [status, setStatus] = useState<{ tone: "info" | "error" | "success"; message: string } | null>(null)

  const currentRole = useMemo(
    () => roleOptions.find((role) => role.id === selectedRole) ?? roleOptions[0],
    [selectedRole]
  )

  useEffect(() => {
    setMobile(currentRole.phone)
    setOtp("")
    setOtpSent(false)
    setSecondsLeft(0)
    setStatus(null)
  }, [currentRole])

  useEffect(() => {
    if (!otpSent || secondsLeft <= 0) return
    const timer = setInterval(() => {
      setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0))
    }, 1000)
    return () => clearInterval(timer)
  }, [otpSent, secondsLeft])

  const normalizeNumber = (value: string) => value.replace(/\D/g, "")

  const handleSendOtp = () => {
    if (normalizeNumber(mobile).length < 10) {
      setStatus({ tone: "error", message: "Enter a valid 10-digit mobile number" })
      return
    }
    if (normalizeNumber(mobile) !== normalizeNumber(currentRole.phone)) {
      setStatus({ tone: "error", message: "Use the demo mobile number for selected role" })
      return
    }
    setOtp("")
    setOtpSent(true)
    setSecondsLeft(45)
    setStatus({ tone: "success", message: `OTP sent to ${currentRole.phone}. Demo: ${DEMO_OTP}` })
  }

  const handleLogin = async () => {
    if (!otpSent) {
      setStatus({ tone: "error", message: "Request an OTP first" })
      return
    }
    if (otp !== DEMO_OTP) {
      setStatus({ tone: "error", message: `Invalid OTP. Use ${DEMO_OTP}` })
      return
    }
    setStatus({ tone: "info", message: "Verifying..." })
    await login(currentRole.email)
  }

  return (
    <div className="relative min-h-screen w-screen overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1600&q=60')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-white/80 via-white/60 to-white/30 backdrop-blur-sm" />
      </div>

      <div className="relative z-10 min-h-screen flex flex-col lg:items-center lg:justify-center p-3 sm:p-6">
        <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-6 sm:gap-12 items-start lg:items-center">
          
          {/* Left side - Hero content */}
          <div className="space-y-4 sm:space-y-8 hidden lg:block">
            <div className="flex items-center gap-3">
              <img src="https://placehold.co/40x40.svg?text=IS&bg=2563eb&text=ffffff" alt="Interview Suite" width={40} height={40} className="rounded-xl shadow-md" />
              <div>
                <p className="text-xs font-semibold text-slate-500 tracking-wider">Interview Suite</p>
                <p className="text-sm text-slate-600">Trusted. Secure. Seamless.</p>
              </div>
            </div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm border border-sky-200/50 shadow-lg">
              <Sparkles className="h-4 w-4 text-sky-600" />
              <span className="text-sm font-medium text-slate-700">Secure Interview Management</span>
            </div>

            <div className="space-y-4">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl lg:text-6xl font-bold text-slate-900 leading-tight">
                Welcome to
                <span className="block bg-gradient-to-r from-sky-600 to-blue-600 bg-clip-text text-transparent">
                  Interview Suite
                </span>
              </h1>
              <p className="text-base sm:text-lg lg:text-xl text-slate-600 max-w-xl">
                Unified authentication for all exam stakeholders with secure mobile OTP verification
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 max-w-xl">
              {[
                { label: "Biometric", detail: "Device status" },
                { label: "Documents", detail: "Manual checks" },
                { label: "Pre-interview", detail: "Readiness" },
                { label: "Panels", detail: "Scoring" },
              ].map((item) => (
                <div key={item.label} className="group p-4 rounded-2xl bg-white/60 backdrop-blur border border-slate-200/50 shadow-sm hover:shadow-md hover:bg-white/80 transition-all duration-300">
                  <div className="h-2 w-12 bg-gradient-to-r from-sky-500 to-blue-500 rounded-full mb-3 group-hover:w-16 transition-all" />
                  <p className="font-semibold text-slate-900">{item.label}</p>
                  <p className="text-sm text-slate-600">{item.detail}</p>
                </div>
              ))}
            </div>

            <div className="relative mt-6 hidden lg:block">
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-blue-200/30 to-purple-200/30 blur-xl" />
              <img
                src="https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1000&q=60"
                alt="Interview Room"
                className="relative w-[520px] h-[360px] object-cover rounded-3xl border border-white shadow-xl"
              />
              <div className="absolute inset-0 rounded-3xl ring-1 ring-white/60 pointer-events-none" />
            </div>
          </div>

          {/* Right side - Login card */}
          <div className="w-full max-w-md mx-auto lg:mx-0">
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-2xl border border-white/50 p-5 sm:p-8 space-y-4 sm:space-y-6">
              
              <div className="text-center space-y-2">
                <div className="inline-flex items-center justify-center w-12 sm:w-14 h-12 sm:h-14 rounded-2xl bg-gradient-to-br from-sky-500 to-blue-600 shadow-lg shadow-sky-500/30">
                  <Lock className="h-6 sm:h-7 w-6 sm:w-7 text-white" />
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Secure Sign In</h2>
                <p className="text-xs sm:text-sm text-slate-600">Select role and verify with OTP</p>
              </div>

              {/* Role selection */}
              <div className="space-y-3">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Select Role</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {roleOptions.map((role) => {
                    const Icon = role.icon
                    const isActive = role.id === currentRole.id
                    return (
                      <button
                        key={role.id}
                        onClick={() => setSelectedRole(role.id)}
                        className={`relative p-2 sm:p-3 rounded-lg sm:rounded-xl border-2 transition-all duration-300 ${
                          isActive
                            ? "border-sky-400 ring-2 ring-white/60 bg-gradient-to-br " + role.accent + " shadow-lg scale-105"
                            : "border-slate-200 bg-white hover:border-sky-200 hover:shadow-md hover:scale-[1.02]"
                        }`}
                      >
                        <Icon className={`h-4 sm:h-5 w-4 sm:w-5 mx-auto mb-1 ${isActive ? "text-white" : "text-slate-600"}`} />
                        <p className={`text-xs font-semibold leading-tight ${isActive ? "text-white" : "text-slate-700"}`}>
                          {role.label}
                        </p>
                        {isActive && (
                          <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center">
                            <div className="w-2 h-2 rounded-full bg-white" />
                          </div>
                        )}
                      </button>
                    )
                  })}
                </div>
                <p className="text-xs text-slate-500 italic">{currentRole.description} • {currentRole.meta}</p>
              </div>

              {/* Mobile input */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                  <Phone className="h-3.5 w-3.5" />
                  Mobile Number
                </label>
                <div className="flex gap-2">
                  <div className="flex items-center px-2 sm:px-3 rounded-lg sm:rounded-xl bg-slate-100 border border-slate-200 text-slate-700 font-medium text-sm">
                    +91
                  </div>
                  <input
                    type="tel"
                    value={mobile.replace(/^\+91\s?/, "")}
                    onChange={(e) => setMobile(`+91 ${e.target.value}`)}
                    className="flex-1 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg sm:rounded-2xl border-2 border-slate-200 focus:border-sky-400 focus:ring-2 focus:ring-sky-200 focus:outline-none bg-white text-sm sm:text-base text-slate-900 font-medium shadow-sm transition-colors"
                    placeholder="98765 43210"
                  />
                </div>
              </div>

              {/* OTP input */}
              <div className="space-y-3">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">One-Time Passcode</label>
                <div className="flex justify-center gap-2 sm:gap-3">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <input
                      key={i}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={otp[i] || ""}
                      onChange={(e) => {
                        const newOtp = otp.split("")
                        newOtp[i] = e.target.value
                        setOtp(newOtp.join(""))
                        if (e.target.value && i < 5) {
                          const next = (e.target.parentElement?.children[i + 1] as HTMLInputElement)
                          next?.focus()
                        }
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Backspace' && !otp[i] && i > 0) {
                          const prev = ((e.target as HTMLInputElement).parentElement?.children[i - 1] as HTMLInputElement)
                          prev?.focus()
                        }
                      }}
                      disabled={!otpSent}
                      className="w-10 h-10 sm:w-12 sm:h-12 text-center text-base sm:text-lg font-bold rounded-lg sm:rounded-xl border-2 border-slate-200 hover:border-sky-300 focus:border-sky-400 focus:ring-2 focus:ring-sky-200 focus:outline-none bg-white disabled:bg-slate-100 disabled:text-slate-400 disabled:border-slate-200 shadow-sm transition-all duration-200 placeholder:text-slate-300"
                    />
                  ))}
                </div>
                <p className="text-xs text-slate-500 text-center mt-2">Demo OTP: <span className="font-mono font-bold text-sky-600">{DEMO_OTP}</span></p>
              </div>

              {/* Status message */}
              {status && (
                <div className={`p-2 sm:p-3 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium ${
                  status.tone === "success" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" :
                  status.tone === "error" ? "bg-rose-50 text-rose-700 border border-rose-200" :
                  "bg-sky-50 text-sky-700 border border-sky-200"
                }`}>
                  {status.message}
                </div>
              )}

              {/* Action buttons */}
              <div className="space-y-2 sm:space-y-3">
                <button
                  onClick={handleSendOtp}
                  disabled={secondsLeft > 0}
                  className="w-full py-2.5 sm:py-3 rounded-lg sm:rounded-xl font-semibold text-sm sm:text-base bg-gradient-to-r from-slate-100 to-slate-200 text-slate-700 hover:from-white hover:to-slate-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-sm hover:shadow border border-slate-300"
                >
                  {otpSent && secondsLeft > 0 ? `Resend in ${secondsLeft}s` : "Send OTP"}
                </button>
                
                <button
                  onClick={handleLogin}
                  disabled={isLoading || otp.length !== 6}
                  className="w-full py-2.5 sm:py-3.5 rounded-lg sm:rounded-xl font-semibold text-sm sm:text-base bg-gradient-to-r from-sky-500 to-blue-600 text-white hover:from-sky-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg shadow-sky-500/30 hover:shadow-xl hover:shadow-sky-500/40 flex items-center justify-center gap-2 group"
                >
                  {isLoading ? "Verifying..." : (
                    <>
                      Sign In Securely
                      <ArrowRight className="h-4 sm:h-5 w-4 sm:w-5 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </div>

              <p className="text-xs text-center text-slate-500">
                🔒 AES-256 encrypted • ISO 27001 • SSL
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}