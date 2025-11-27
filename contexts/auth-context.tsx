"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { type User, users } from "@/lib/mock-data"

type AuthContextType = {
  user: User | null
  login: (email: string) => Promise<void>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // Simulate checking for existing session
    const storedUser = localStorage.getItem("ims_user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string) => {
    setIsLoading(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const foundUser = users.find((u) => u.email === email)
    if (foundUser) {
      setUser(foundUser)
      localStorage.setItem("ims_user", JSON.stringify(foundUser))

      // Redirect based on role
      if (
        foundUser.role === "biometricVerifierExaminer" ||
        foundUser.role === "documentVerifierExaminer"
      ) {
        router.push("/verification")
      } else if (
        foundUser.role === "preInterviewExaminer" ||
        foundUser.role === "panelMember"
      ) {
        router.push("/candidates")
      } else {
        // System administrator and any other roles
        router.push("/")
      }
    } else {
      alert(
        "Invalid email. Try systemadmin@system.com, biometric.verifier@system.com, document.verifier@system.com, pre.interview@system.com or panel.member@system.com",
      )
    }
    setIsLoading(false)
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("ims_user")
    router.push("/login")
  }

  return <AuthContext.Provider value={{ user, login, logout, isLoading }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
