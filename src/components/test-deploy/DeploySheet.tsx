"use client"

import * as React from "react"
import { Rocket, CheckCircle2, XCircle, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import type { EnvironmentName, Release } from "@/lib/types"
import { getStatusToneClass } from "@/lib/utils"
import { mockReleases } from "@/lib/mock-data"

interface DeploySheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  release: Release | null
  preselectedEnvironment?: EnvironmentName
}

const environments: { value: EnvironmentName; label: string }[] = [
  { value: "dev", label: "Development" },
  { value: "stage", label: "Staging" },
  { value: "prod", label: "Production" },
]

// Mock test gates per environment
const testGatesByEnvironment: Record<EnvironmentName, string[]> = {
  dev: [], // No required gates for dev
  stage: ["Unit Tests", "Workflow Tests - Auth"],
  prod: ["Unit Tests", "Workflow Tests - Auth", "Workflow Tests - Payment"],
}

export function DeploySheet({ open, onOpenChange, release, preselectedEnvironment }: DeploySheetProps) {
  const [selectedRelease, setSelectedRelease] = React.useState<Release | null>(release)
  const [selectedEnvironment, setSelectedEnvironment] = React.useState<EnvironmentName | "">(
    preselectedEnvironment || ""
  )
  const [testsRunning, setTestsRunning] = React.useState(false)
  const [testsPassed, setTestsPassed] = React.useState(false)

  const requiredGates = selectedEnvironment
    ? testGatesByEnvironment[selectedEnvironment as EnvironmentName]
    : []
  const hasGates = requiredGates.length > 0

  // Update selectedRelease when release prop changes
  React.useEffect(() => {
    setSelectedRelease(release)
  }, [release])

  // Reset form when sheet closes
  React.useEffect(() => {
    if (!open) {
      setSelectedRelease(release)
      setSelectedEnvironment(preselectedEnvironment || "")
      setTestsRunning(false)
      setTestsPassed(false)
    }
  }, [open, release, preselectedEnvironment])

  // Pre-select environment when preselectedEnvironment changes
  React.useEffect(() => {
    if (preselectedEnvironment) {
      setSelectedEnvironment(preselectedEnvironment)
    }
  }, [preselectedEnvironment])

  const handleRunTests = () => {
    if (!selectedEnvironment) return

    setTestsRunning(true)
    setTestsPassed(false)

    // Simulate test execution
    setTimeout(() => {
      setTestsRunning(false)
      setTestsPassed(true)
    }, 2000)
  }

  const handleDeploy = () => {
    if (!selectedEnvironment) {
      alert("Please select an environment")
      return
    }

    if (!selectedRelease) {
      alert("Please select a release")
      return
    }

    if (hasGates && !testsPassed) {
      alert("Please run and pass required tests before deploying")
      return
    }

    // In a real implementation, this would deploy via API
    console.log("Deploying release:", {
      releaseId: selectedRelease.id,
      releaseName: selectedRelease.name,
      environment: selectedEnvironment,
    })

    // Reset form and close sheet
    onOpenChange(false)
    alert(
      `Release "${selectedRelease.name}" deployed to ${selectedEnvironment}! (This is a mock)`
    )
  }

  const canDeploy = selectedRelease && selectedEnvironment && (!hasGates || testsPassed)

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Deploy Release</SheetTitle>
          <SheetDescription>
            {selectedRelease ? `Deploy ${selectedRelease.name} to an environment` : "Select a release to deploy"}
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-6 px-6 py-6">
          {/* Release Selection/Info */}
          {release ? (
            <div className="space-y-2">
              <Label>Release</Label>
              <div className="rounded-md border border-border bg-muted/30 p-3">
                <div className="font-medium">{release.name}</div>
                <div className="text-sm text-muted-foreground font-mono">
                  {release.commit.substring(0, 7)} • {release.branch}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <Label htmlFor="release-select">
                Release <span className="text-destructive">*</span>
              </Label>
              <select
                id="release-select"
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 dark:bg-input/30"
                value={selectedRelease?.id || ""}
                onChange={(e) => {
                  const release = mockReleases.find((r) => r.id === e.target.value)
                  setSelectedRelease(release || null)
                  setTestsPassed(false)
                  setTestsRunning(false)
                }}
              >
                <option value="">Select a release</option>
                {mockReleases
                  .filter((r) => r.status === "ready" || r.status === "draft")
                  .map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name} ({r.branch})
                    </option>
                  ))}
              </select>
            </div>
          )}

          {/* Environment Selection */}
          <div className="space-y-2">
            <Label htmlFor="environment">
              Environment <span className="text-destructive">*</span>
            </Label>
            <select
              id="environment"
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 dark:bg-input/30"
              value={selectedEnvironment}
              onChange={(e) => {
                setSelectedEnvironment(e.target.value as EnvironmentName)
                setTestsPassed(false)
                setTestsRunning(false)
              }}
            >
              <option value="">Select an environment</option>
              {environments.map((env) => (
                <option key={env.value} value={env.value}>
                  {env.label}
                </option>
              ))}
            </select>
          </div>

          {/* Required Test Gates */}
          {selectedEnvironment && hasGates && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Required Test Gates</Label>
                <div className="flex flex-wrap gap-2">
                  {requiredGates.map((gate) => (
                    <Badge key={gate} variant="outline" className="text-xs">
                      {gate}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Test Status */}
              {testsRunning && (
                <div className="flex items-center gap-2 rounded-md border border-border bg-muted/30 p-3">
                  <Loader2 className="size-4 animate-spin text-blue-400" />
                  <span className="text-sm">Running tests...</span>
                </div>
              )}

              {!testsRunning && testsPassed && (
                <div className="flex items-center gap-2 rounded-md border border-border bg-green-500/20 p-3">
                  <CheckCircle2 className="size-4 text-green-400" />
                  <span className="text-sm text-green-400">All tests passed</span>
                </div>
              )}

              {!testsRunning && !testsPassed && (
                <div className="flex items-center gap-2 rounded-md border border-border bg-muted/30 p-3">
                  <XCircle className="size-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Tests not run yet</span>
                </div>
              )}

              {/* Run Tests Button */}
              {!testsPassed && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleRunTests}
                  disabled={testsRunning || !selectedEnvironment}
                  className="w-full"
                >
                  {testsRunning ? (
                    <>
                      <Loader2 className="size-4 mr-2 animate-spin" />
                      Running Tests...
                    </>
                  ) : (
                    "Run Tests"
                  )}
                </Button>
              )}
            </div>
          )}

          {selectedEnvironment && !hasGates && (
            <div className="rounded-md border border-border bg-muted/30 p-3">
              <p className="text-sm text-muted-foreground">
                No required test gates for {environments.find((e) => e.value === selectedEnvironment)?.label}
              </p>
            </div>
          )}
        </div>

        <SheetFooter className="px-6">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleDeploy}
            disabled={!canDeploy}
          >
            <Rocket className="size-4 mr-2" />
            Deploy
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}


