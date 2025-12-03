"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Clock, User, Hash, CalendarDays, ClipboardList, GraduationCap } from "lucide-react"
import { callAPIWithEnc } from "@/lib/commonApi"

type CurrentCandidate = {
  candidate_id: number
  candidate_roll_no: string
  exam_name: string
  post_name: string
  candidate_full_name: string
  candidate_gender: string
  candidate_dob: string
}

export default function InterviewPage() {
  const [currentCandidate, setCurrentCandidate] = useState<CurrentCandidate | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    ;(async () => {
      try {
        const response = await callAPIWithEnc("/admin/getCandidateByInterviewer", "POST", {
          schedule_id: 3,
          status_id: 40,
          user_id: 3,
        })
        const raw = response?.status === 0 ? response?.data : response
        const d = Array.isArray(raw) ? raw[0] : raw
        if (d && d.candidate_id) {
          setCurrentCandidate({
            candidate_id: Number(d.candidate_id ?? 0),
            candidate_roll_no: String(d.candidate_roll_no ?? ""),
            exam_name: String(d.exam_name ?? ""),
            post_name: String(d.post_name ?? ""),
            candidate_full_name: String(d.candidate_full_name ?? ""),
            candidate_gender: String(d.candidate_gender ?? ""),
            candidate_dob: String(d.candidate_dob ?? ""),
          })
        } else {
          setCurrentCandidate(null)
        }
      } catch (e) {
        setCurrentCandidate(null)
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Interview Panel #102</h1>
            <p className="text-sm text-muted-foreground">Session ID: INT-2025-8821</p>
          </div>
          <div className="flex items-center gap-2 rounded-full bg-blue-500/10 px-4 py-1.5 text-sm font-medium text-blue-500">
            <Clock className="h-4 w-4" />
            <span>14:32 Remaining</span>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Evaluation Form</CardTitle>
            <CardDescription>Rate the candidate on the following criteria (1-10).</CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-base">Technical Knowledge</Label>
                <span className="font-mono font-bold">8.5</span>
              </div>
              <Slider defaultValue={[8.5]} max={10} step={0.5} className="w-full" />
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-base">Communication Skills</Label>
                <span className="font-mono font-bold">7.0</span>
              </div>
              <Slider defaultValue={[7]} max={10} step={0.5} className="w-full" />
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-base">Analytical Ability</Label>
                <span className="font-mono font-bold">9.0</span>
              </div>
              <Slider defaultValue={[9]} max={10} step={0.5} className="w-full" />
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-base">Behavioral / HR</Label>
                <span className="font-mono font-bold">8.0</span>
              </div>
              <Slider defaultValue={[8]} max={10} step={0.5} className="w-full" />
            </div>

            <div className="space-y-2">
              <Label>Panel Remarks</Label>
              <Textarea placeholder="Enter detailed observations..." className="min-h-[100px]" />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between border-t px-6 py-4">
            <div className="text-sm text-muted-foreground">
              Total Score: <span className="font-bold text-foreground">32.5 / 40</span>
            </div>
            <Button size="lg" className="bg-green-600 hover:bg-green-700">
              Submit Evaluation
            </Button>
          </CardFooter>
        </Card>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader className="bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-t-xl">
            <div className="flex items-center justify-between">
              <CardTitle className="text-white">Current Candidate</CardTitle>
              {currentCandidate && (
                <div className="flex items-center gap-2">
                  <Badge className="bg-white/20 text-white border-white/30">{currentCandidate.exam_name}</Badge>
                  <Badge className="bg-white/20 text-white border-white/30">{currentCandidate.post_name}</Badge>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            {loading ? (
              <div className="flex flex-col items-center gap-4">
                <div className="h-24 w-24 rounded-full bg-slate-200 animate-pulse" />
                <div className="h-5 w-40 rounded bg-slate-200 animate-pulse" />
                <div className="h-4 w-24 rounded bg-slate-200 animate-pulse" />
              </div>
            ) : currentCandidate ? (
              <>
                <div className="flex flex-col items-center space-y-4">
                  <div className="relative h-28 w-28 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 text-white flex items-center justify-center text-3xl font-bold shadow-lg">
                    {(currentCandidate.candidate_full_name || "").charAt(0).toUpperCase()}
                  </div>
                  <div className="text-center space-y-1">
                    <h3 className="text-xl font-bold text-slate-900">{currentCandidate.candidate_full_name}</h3>
                    <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                      <Hash className="h-4 w-4" />
                      {currentCandidate.candidate_roll_no}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 rounded-xl border p-4">
                  <div className="flex items-center gap-3">
                    <User className="h-5 w-5 text-slate-500" />
                    <div>
                      <p className="text-xs text-muted-foreground">Gender</p>
                      <p className="text-sm font-semibold text-slate-900">{currentCandidate.candidate_gender}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <CalendarDays className="h-5 w-5 text-slate-500" />
                    <div>
                      <p className="text-xs text-muted-foreground">DOB</p>
                      <p className="text-sm font-semibold text-slate-900">{currentCandidate.candidate_dob}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <GraduationCap className="h-5 w-5 text-slate-500" />
                    <div>
                      <p className="text-xs text-muted-foreground">Exam</p>
                      <p className="text-sm font-semibold text-slate-900">{currentCandidate.exam_name}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <ClipboardList className="h-5 w-5 text-slate-500" />
                    <div>
                      <p className="text-xs text-muted-foreground">Post</p>
                      <p className="text-sm font-semibold text-slate-900">{currentCandidate.post_name}</p>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center text-sm text-muted-foreground">No candidate assigned</div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Queue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-3 rounded-lg border p-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-xs font-medium">
                    {i}
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <p className="truncate text-sm font-medium">Waiting Candidate {i}</p>
                    <p className="text-xs text-muted-foreground">Roll-2025-0{50 + i}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
