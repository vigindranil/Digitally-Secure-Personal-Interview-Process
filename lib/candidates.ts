export type Candidate = {
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
  category?: string
  biometricStatus?: string
  documentStatus?: string
  interviewStatus?: string
  score?: number | null
  photo?: string
}

export const candidates: Candidate[] = [
  {
    id: "1",
    rollNo: "2025-001",
    name: "Rajesh Kumar",
    dob: "1988-04-12",
    gender: "Male",
    parentName: "Suresh Kumar",
    permanentAddress: "12 MG Road, Mumbai, Maharashtra",
    currentAddress: "12 MG Road, Mumbai, Maharashtra",
    mobile: "+91 98765 43210",
    email: "rajesh.kumar@example.com",
    registrationNumber: "REG-2025-001",
    aadhaarNumber: "XXXX-XXXX-1234",
    qualification: "M.Sc. Computer Science",
    subject: "Software Engineering",
    postApplied: "Software Engineer",
    interviewDateTime: "2025-12-05 10:30 AM",
    category: "General",
    biometricStatus: "Verified",
    documentStatus: "Verified",
    interviewStatus: "Completed",
    score: 87.5,
    photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rajesh"
  },
  {
    id: "2",
    rollNo: "2025-002",
    name: "Priya Sharma",
    dob: "1994-09-22",
    gender: "Female",
    parentName: "Ramesh Sharma",
    permanentAddress: "45 Laxmi Nagar, Delhi",
    currentAddress: "22 Sector 12, Noida",
    mobile: "+91 91234 56789",
    email: "priya.sharma@example.com",
    registrationNumber: "REG-2025-002",
    aadhaarNumber: "XXXX-XXXX-2345",
    qualification: "B.Tech (IT)",
    subject: "Information Technology",
    postApplied: "Junior Developer",
    interviewDateTime: "2025-12-06 02:00 PM",
    category: "OBC",
    biometricStatus: "Verified",
    documentStatus: "Pending",
    interviewStatus: "Scheduled",
    score: null,
    photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=Priya"
  },
  {
    id: "3",
    rollNo: "2025-003",
    name: "Amit Patel",
    dob: "1990-01-10",
    gender: "Male",
    parentName: "Kantilal Patel",
    permanentAddress: "78 Bazar Street, Ahmedabad",
    currentAddress: "78 Bazar Street, Ahmedabad",
    mobile: "+91 99887 66554",
    email: "amit.patel@example.com",
    registrationNumber: "REG-2025-003",
    aadhaarNumber: "XXXX-XXXX-3456",
    qualification: "MBA",
    subject: "Business Administration",
    postApplied: "Operations Manager",
    interviewDateTime: "2025-12-07 11:00 AM",
    category: "General",
    biometricStatus: "Pending",
    documentStatus: "Verified",
    interviewStatus: "Pending",
    score: null,
    photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=Amit"
  },
  {
    id: "4",
    rollNo: "2025-004",
    name: "Sneha Reddy",
    dob: "1996-07-15",
    gender: "Female",
    parentName: "Narendra Reddy",
    permanentAddress: "33 Lakeside, Hyderabad",
    currentAddress: "33 Lakeside, Hyderabad",
    mobile: "+91 90123 45678",
    email: "sneha.reddy@example.com",
    registrationNumber: "REG-2025-004",
    aadhaarNumber: "XXXX-XXXX-4567",
    qualification: "B.Sc. Mathematics",
    subject: "Statistics",
    postApplied: "Data Analyst",
    interviewDateTime: "2025-12-03 09:00 AM",
    category: "SC",
    biometricStatus: "Verified",
    documentStatus: "Verified",
    interviewStatus: "Completed",
    score: 92.3,
    photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sneha"
  },
  {
    id: "5",
    rollNo: "2025-005",
    name: "Vikram Singh",
    dob: "1992-11-02",
    gender: "Male",
    parentName: "Mohan Singh",
    permanentAddress: "10 Patel Colony, Lucknow",
    currentAddress: "10 Patel Colony, Lucknow",
    mobile: "+91 90909 09090",
    email: "vikram.singh@example.com",
    registrationNumber: "REG-2025-005",
    aadhaarNumber: "XXXX-XXXX-5678",
    qualification: "B.E. (Electrical)",
    subject: "Electrical Engineering",
    postApplied: "Field Engineer",
    interviewDateTime: "2025-12-08 03:00 PM",
    category: "General",
    biometricStatus: "Failed",
    documentStatus: "Pending",
    interviewStatus: "Pending",
    score: null,
    photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=Vikram"
  }
]

export function getCandidateById(id: string) {
  return candidates.find((c) => c.id === id) || null
}
