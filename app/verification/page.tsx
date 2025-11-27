"use client"

import { useState } from "react"
import { CheckCircle2, XCircle, Search, Fingerprint, FileText, User, Calendar, MapPin, AlertCircle, Scan } from "lucide-react"

const mockCandidates = [
  {
    id: "1",
    name: "Rajesh Kumar",
    rollNo: "2025-001",
    category: "General",
    dob: "15/03/1998",
    email: "rajesh.k@email.com",
    phone: "+91 98765 43210",
    photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rajesh",
    biometricStatus: "Pending",
    documentStatus: "Verified",
    appliedFor: "Assistant Manager"
  },
  {
    id: "2",
    name: "Priya Sharma",
    rollNo: "2025-002",
    category: "OBC",
    dob: "22/07/1999",
    email: "priya.s@email.com",
    phone: "+91 98765 43211",
    photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=Priya",
    biometricStatus: "Verified",
    documentStatus: "Pending",
    appliedFor: "Senior Clerk"
  }
]

export default function VerificationPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCandidate, setSelectedCandidate] = useState<typeof mockCandidates[0] | null>(null)
  const [isSearching, setIsSearching] = useState(false)

  const handleSearch = () => {
    setIsSearching(true)
    setTimeout(() => {
      const found = mockCandidates.find(
        (c) => c.rollNo === searchQuery || c.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
      setSelectedCandidate(found || null)
      setIsSearching(false)
    }, 500)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Verified":
        return "bg-green-50 text-green-700 border-green-200"
      case "Pending":
        return "bg-yellow-50 text-yellow-700 border-yellow-200"
      case "Rejected":
        return "bg-red-50 text-red-700 border-red-200"
      default:
        return "bg-gray-50 text-gray-700 border-gray-200"
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-7xl px-8 py-6 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-gray-900">Verification Station</h1>
            <p className="text-gray-600 mt-1 text-sm">Process biometric and document verification for candidates</p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-md bg-green-50 border border-green-200">
            <div className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </div>
            <span className="text-sm font-normal text-gray-700">Station Active</span>
          </div>
        </div>

        {/* Search Section */}
        <div className="bg-white rounded-lg border border-gray-200 p-5">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-2 rounded-md bg-blue-600 text-white">
              <Scan className="h-4 w-4" />
              <span className="text-sm font-medium">Quick Scan</span>
            </div>
            <div className="flex-1 flex gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  placeholder="Scan barcode or enter roll number / name..."
                  className="w-full h-10 pl-10 pr-4 rounded-md border border-gray-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 focus:outline-none bg-white text-gray-900 placeholder:text-gray-500 text-sm"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                />
              </div>
              <button
                onClick={handleSearch}
                disabled={isSearching}
                className="px-5 py-2 rounded-md bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSearching ? "Searching..." : "Search"}
              </button>
            </div>
          </div>
        </div>

        {selectedCandidate ? (
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Candidate Profile Card */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="h-20 bg-blue-600"></div>
                <div className="relative px-5 pb-5">
                  <div className="absolute -top-10 left-5">
                    <div className="w-20 h-20 rounded-lg bg-white border-4 border-white shadow-md overflow-hidden">
                      <img src={selectedCandidate.photo} alt={selectedCandidate.name} className="w-full h-full object-cover" />
                    </div>
                  </div>
                  <div className="pt-12 space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{selectedCandidate.name}</h3>
                      <p className="text-sm font-mono font-medium text-blue-600">{selectedCandidate.rollNo}</p>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-3 p-3 rounded-md bg-gray-50 border border-gray-200">
                        <User className="h-4 w-4 text-gray-500 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-gray-500">Category</p>
                          <p className="text-sm font-medium text-gray-900">{selectedCandidate.category}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 p-3 rounded-md bg-gray-50 border border-gray-200">
                        <Calendar className="h-4 w-4 text-gray-500 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-gray-500">Date of Birth</p>
                          <p className="text-sm font-medium text-gray-900">{selectedCandidate.dob}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 p-3 rounded-md bg-gray-50 border border-gray-200">
                        <MapPin className="h-4 w-4 text-gray-500 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-gray-500">Applied For</p>
                          <p className="text-sm font-medium text-gray-900">{selectedCandidate.appliedFor}</p>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-gray-200 space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Email</span>
                        <span className="font-medium text-gray-900 truncate ml-2">{selectedCandidate.email}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Phone</span>
                        <span className="font-medium text-gray-900">{selectedCandidate.phone}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Verification Cards */}
            <div className="lg:col-span-2 space-y-6">
              {/* Biometric Verification */}
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="border-b border-gray-200 bg-green-50 px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-md bg-green-600 flex items-center justify-center">
                      <Fingerprint className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-base font-semibold text-gray-900">Biometric Verification</h3>
                      <p className="text-xs text-gray-600">Verify candidate identity via fingerprint/iris scan</p>
                    </div>
                  </div>
                </div>
                <div className="p-5">
                  <div className="flex items-center justify-between p-4 rounded-md border border-gray-200 bg-gray-50">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-md bg-green-100 flex items-center justify-center">
                        <Fingerprint className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900 mb-1 text-sm">Current Status</div>
                        <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border ${getStatusColor(selectedCandidate.biometricStatus)}`}>
                          {selectedCandidate.biometricStatus === "Verified" && <CheckCircle2 className="h-3 w-3" />}
                          {selectedCandidate.biometricStatus === "Pending" && <AlertCircle className="h-3 w-3" />}
                          {selectedCandidate.biometricStatus}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button className="flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 transition-colors">
                        <XCircle className="h-4 w-4" />
                        Reject
                      </button>
                      <button className="flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium text-white bg-green-600 hover:bg-green-700 transition-colors">
                        <CheckCircle2 className="h-4 w-4" />
                        Verify
                      </button>
                    </div>
                  </div>

                  <div className="mt-4 p-3 rounded-md bg-blue-50 border border-blue-200">
                    <div className="flex items-start gap-2 text-sm text-blue-800">
                      <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                      <p>Ensure the biometric device is connected and candidate's fingers are clean and dry before scanning.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Document Verification */}
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="border-b border-gray-200 bg-orange-50 px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-md bg-orange-600 flex items-center justify-center">
                      <FileText className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-base font-semibold text-gray-900">Document Verification</h3>
                      <p className="text-xs text-gray-600">Check and verify all required original documents</p>
                    </div>
                  </div>
                </div>
                <div className="p-5">
                  <div className="flex items-center justify-between p-4 rounded-md border border-gray-200 bg-gray-50">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-md bg-orange-100 flex items-center justify-center">
                        <FileText className="h-5 w-5 text-orange-600" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900 mb-1 text-sm">Current Status</div>
                        <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border ${getStatusColor(selectedCandidate.documentStatus)}`}>
                          {selectedCandidate.documentStatus === "Verified" && <CheckCircle2 className="h-3 w-3" />}
                          {selectedCandidate.documentStatus === "Pending" && <AlertCircle className="h-3 w-3" />}
                          {selectedCandidate.documentStatus}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button className="flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 transition-colors">
                        <XCircle className="h-4 w-4" />
                        Reject
                      </button>
                      <button className="flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 transition-colors">
                        <CheckCircle2 className="h-4 w-4" />
                        Verify
                      </button>
                    </div>
                  </div>

                  <div className="mt-4 space-y-2">
                    {["ID Proof (Aadhaar/PAN)", "Educational Certificates", "Category Certificate", "Photograph"].map((doc, i) => (
                      <div key={i} className="flex items-center justify-between p-3 rounded-md border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-colors">
                        <div className="flex items-center gap-3">
                          <CheckCircle2 className="h-4 w-4 text-green-600" />
                          <span className="text-sm font-medium text-gray-700">{doc}</span>
                        </div>
                        <span className="text-xs text-green-600 font-medium">Checked</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-white p-16 text-center">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-6">
              <Search className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Candidate Selected</h3>
            <p className="text-gray-600 max-w-md text-sm">
              Search for a candidate by roll number or name to begin the verification process. You can also scan their barcode for quick access.
            </p>
            <div className="mt-6 flex items-center gap-2 px-4 py-2 rounded-md bg-blue-50 border border-blue-200">
              <AlertCircle className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-700">Try searching: "2025-001" or "Rajesh"</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}