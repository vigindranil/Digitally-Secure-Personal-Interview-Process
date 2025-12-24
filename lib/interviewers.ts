export interface Interviewer {
  id: string
  name: string
  mobile: string
  email: string
  qualification: string
  interviewSubject: string
  postId?: string | any
  postLabel?: string | any
  designationId?: string | any
  designationLabel?: string | any
  username?: string | any
  password?: string | any
  bankName?: string | any
  branchName?: string | any
  ifscCode?: string | any
  bankAccountNumber?: string | any
  examId?: string | any
  examLabel?: string | any
  address?: string | any
  createdAt?: Date
  updatedAt?: Date
}

export const interviewers: Interviewer[] = [
  {
    id: "int-001",
    name: "Dr. Rajesh Kumar",
    mobile: "+91 9876543210",
    email: "rajesh.kumar@company.com",
    qualification: "Ph.D. in Computer Science",
    interviewSubject: "Full Stack Development",
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-15"),
  },
  {
    id: "int-002",
    name: "Ms. Priya Sharma",
    mobile: "+91 9876543211",
    email: "priya.sharma@company.com",
    qualification: "M.Tech in Software Engineering",
    interviewSubject: "Frontend Development",
    createdAt: new Date("2024-01-20"),
    updatedAt: new Date("2024-01-20"),
  },
  {
    id: "int-003",
    name: "Mr. Amit Patel",
    mobile: "+91 9876543212",
    email: "amit.patel@company.com",
    qualification: "B.Tech in Information Technology",
    interviewSubject: "Backend Development",
    createdAt: new Date("2024-02-01"),
    updatedAt: new Date("2024-02-01"),
  },
]

export function getInterviewerById(id: string): Interviewer | null {
  return interviewers.find((interviewer) => interviewer.id === id) || null
}
