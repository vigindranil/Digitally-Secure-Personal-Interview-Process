"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { candidates } from "@/lib/mock-data"
import { Clock } from "lucide-react"

export default function InterviewPage() {
  // Mocking an active interview session
  const currentCandidate = candidates[3] // Diana Evans

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
          <CardHeader>
            <CardTitle>Current Candidate</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col items-center space-y-3">
              <div className="h-24 w-24 rounded-full bg-muted overflow-hidden">
                <img
                  src={currentCandidate.photoUrl || "/placeholder.svg"}
                  alt={currentCandidate.name}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="text-center">
                <h3 className="font-semibold">{currentCandidate.name}</h3>
                <p className="font-mono text-sm text-muted-foreground">{currentCandidate.rollNo}</p>
              </div>
            </div>

            <div className="space-y-4 rounded-lg border p-4 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Category</span>
                <span className="font-medium">{currentCandidate.category}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Biometric</span>
                <Badge variant="outline" className="border-green-500/50 text-green-500">
                  Verified
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Documents</span>
                <Badge variant="outline" className="border-green-500/50 text-green-500">
                  Verified
                </Badge>
              </div>
            </div>
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
