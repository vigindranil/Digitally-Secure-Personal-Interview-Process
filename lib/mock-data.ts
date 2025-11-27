export type Candidate = {
  id: string
  rollNo: string
  name: string
  category: string
  photoUrl: string
  biometricStatus: "Verified" | "Pending" | "Failed"
  documentStatus: "Verified" | "Pending" | "Failed"
  interviewStatus: "Pending" | "Scheduled" | "Completed"
  panelId?: string
  score?: number
  checkInTime?: string
}

export const candidates: Candidate[] = [
  {
    id: "1",
    rollNo: "2025-001",
    name: "Alice Johnson",
    category: "General",
    photoUrl: "/placeholder.svg?key=5qmfa",
    biometricStatus: "Verified",
    documentStatus: "Verified",
    interviewStatus: "Completed",
    panelId: "P-101",
    score: 85,
    checkInTime: "08:30 AM",
  },
  {
    id: "2",
    rollNo: "2025-002",
    name: "Bob Smith",
    category: "OBC",
    photoUrl: "/placeholder.svg?key=83a7c",
    biometricStatus: "Verified",
    documentStatus: "Pending",
    interviewStatus: "Pending",
    checkInTime: "08:45 AM",
  },
  {
    id: "3",
    rollNo: "2025-003",
    name: "Charlie Davis",
    category: "SC",
    photoUrl: "/placeholder.svg?key=9rlha",
    biometricStatus: "Pending",
    documentStatus: "Pending",
    interviewStatus: "Pending",
  },
  {
    id: "4",
    rollNo: "2025-004",
    name: "Diana Evans",
    category: "General",
    photoUrl: "/placeholder.svg?key=pmrts",
    biometricStatus: "Verified",
    documentStatus: "Verified",
    interviewStatus: "Scheduled",
    panelId: "P-102",
    checkInTime: "09:00 AM",
  },
  {
    id: "5",
    rollNo: "2025-005",
    name: "Ethan Hunt",
    category: "ST",
    photoUrl: "/placeholder.svg?key=0i3l8",
    biometricStatus: "Failed",
    documentStatus: "Pending",
    interviewStatus: "Pending",
  },
]

export type UserRole =
  | "systemAdministrator"
  | "biometricVerifierExaminer"
  | "documentVerifierExaminer"
  | "preInterviewExaminer"
  | "panelMember"

export type User = {
  id: string
  name: string
  email: string
  role: UserRole
  avatar?: string
}

export const users: User[] = [
  {
    id: "u1",
    name: "System Administrator",
    email: "systemadmin@system.com",
    role: "systemAdministrator",
    avatar: "/placeholder.svg?key=systemadmin",
  },
  {
    id: "u2",
    name: "Biometric Verifier Examiner",
    email: "biometric.verifier@system.com",
    role: "biometricVerifierExaminer",
    avatar: "/placeholder.svg?key=biometric",
  },
  {
    id: "u3",
    name: "Document Verifier Examiner",
    email: "document.verifier@system.com",
    role: "documentVerifierExaminer",
    avatar: "/placeholder.svg?key=document",
  },
  {
    id: "u4",
    name: "Pre-Interview Examiner",
    email: "pre.interview@system.com",
    role: "preInterviewExaminer",
    avatar: "/placeholder.svg?key=preinterview",
  },
  {
    id: "u5",
    name: "Panel Member / Interviewer",
    email: "panel.member@system.com",
    role: "panelMember",
    avatar: "/placeholder.svg?key=panel",
  },
]

export const stats = {
  totalCandidates: 1250,
  biometricVerified: 980,
  documentVerified: 850,
  interviewsCompleted: 420,
  panelsActive: 12,
}
