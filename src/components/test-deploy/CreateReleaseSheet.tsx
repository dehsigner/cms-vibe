"use client"

import * as React from "react"
import { Plus, Rocket, CheckCircle2, XCircle, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import type { EnvironmentName } from "@/lib/types"

/**
 * Create Release Sheet Component
 * 
 * Assumptions:
 * - Test gates are required for Stage and Prod environments
 * - Dev environment has no required test gates
 * - Tests can be simulated and will show a running state
 * - "Create + Deploy" button is disabled until tests pass when auto-deploy is enabled
 */
const mockBranches = [
  "main",
  "develop",
  "feature/new-api",
  "feature/auth-improvements",
  "release/v1.2.1",
  "hotfix/payment-bug",
]

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

export function CreateReleaseSheet() {
  const [open, setOpen] = React.useState(false)
  const [releaseName, setReleaseName] = React.useState("")
  const [selectedBranch, setSelectedBranch] = React.useState("")
  const [notes, setNotes] = React.useState("")
  const [autoDeploy, setAutoDeploy] = React.useState(false)
  const [selectedEnvironment, setSelectedEnvironment] = React.useState<EnvironmentName | "">("")
  const [runTestsBeforeDeploy, setRunTestsBeforeDeploy] = React.useState(false)
  const [testsRunning, setTestsRunning] = React.useState(false)
  const [testsPassed, setTestsPassed] = React.useState(false)

  const requiredGates = selectedEnvironment
    ? testGatesByEnvironment[selectedEnvironment as EnvironmentName]
    : []
  const hasGates = requiredGates.length > 0

  // Reset form when sheet closes
  React.useEffect(() => {
    if (!open) {
      setReleaseName("")
      setSelectedBranch("")
      setNotes("")
      setAutoDeploy(false)
      setSelectedEnvironment("")
      setRunTestsBeforeDeploy(false)
      setTestsRunning(false)
      setTestsPassed(false)
    }
  }, [open])

  // Auto-enable run tests when gates exist and auto-deploy is enabled
  React.useEffect(() => {
    if (autoDeploy && hasGates) {
      setRunTestsBeforeDeploy(true)
    }
  }, [autoDeploy, hasGates])

  const handleRunTests = () => {
    if (!selectedBranch) return

    setTestsRunning(true)
    setTestsPassed(false)

    // Simulate test execution
    setTimeout(() => {
      setTestsRunning(false)
      setTestsPassed(true)
    }, 2000)
  }

  const handleCreateRelease = () => {
    if (!releaseName || !selectedBranch) {
      alert("Please fill in all required fields")
      return
    }

    if (autoDeploy && selectedEnvironment && hasGates && !testsPassed) {
      alert("Please run and pass required tests before deploying")
      return
    }

    // In a real implementation, this would create the release via API
    console.log("Creating release:", {
      name: releaseName,
      branch: selectedBranch,
      notes,
      autoDeploy,
      environment: selectedEnvironment,
      runTestsBeforeDeploy,
    })

    // Reset form and close sheet
    setOpen(false)
    alert(
      `Release "${releaseName}" created${autoDeploy && selectedEnvironment ? ` and deployed to ${selectedEnvironment}` : ""}! (This is a mock)`
    )
  }

  const canDeploy = !autoDeploy || !hasGates || testsPassed
  const isFormValid = releaseName && selectedBranch

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button>
          <Plus className="size-4 mr-2" />
          Create Release
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Create New Release</SheetTitle>
          <SheetDescription>
            Create a release from a branch to deploy to environments
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-6 px-6 py-6">
          {/* Basic Fields */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="release-name">
                Release Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="release-name"
                placeholder="e.g., v1.2.0"
                value={releaseName}
                onChange={(e) => setReleaseName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="branch">
                Branch <span className="text-destructive">*</span>
              </Label>
              <select
                id="branch"
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 dark:bg-input/30"
                value={selectedBranch}
                onChange={(e) => setSelectedBranch(e.target.value)}
              >
                <option value="">Select a branch</option>
                {mockBranches.map((branch) => (
                  <option key={branch} value={branch}>
                    {branch}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                placeholder="Optional release notes..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
              />
            </div>
          </div>

          {/* After Create Section */}
          <div className="space-y-4 border-t border-border pt-4">
            <h3 className="text-sm font-semibold">After create</h3>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="auto-deploy" className="cursor-pointer">
                  Auto-deploy
                </Label>
                <p className="text-xs text-muted-foreground">
                  Automatically deploy after creating the release
                </p>
              </div>
              <Switch
                id="auto-deploy"
                checked={autoDeploy}
                onCheckedChange={setAutoDeploy}
              />
            </div>

            {autoDeploy && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="environment">
                    Environment <span className="text-destructive">*</span>
                  </Label>
                  <select
                    id="environment"
                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 dark:bg-input/30"
                    value={selectedEnvironment}
                    onChange={(e) =>
                      setSelectedEnvironment(e.target.value as EnvironmentName)
                    }
                  >
                    <option value="">Select an environment</option>
                    {environments.map((env) => (
                      <option key={env.value} value={env.value}>
                        {env.label}
                      </option>
                    ))}
                  </select>
                </div>

                {selectedEnvironment && hasGates && (
                  <div className="space-y-3 rounded-lg border border-border bg-muted/30 p-3">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm font-medium">
                        Required test gates
                      </Label>
                      <Badge variant="outline" className="text-xs">
                        {requiredGates.length} gate{requiredGates.length !== 1 ? "s" : ""}
                      </Badge>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {requiredGates.map((gate) => (
                        <Badge key={gate} variant="secondary" className="text-xs">
                          {gate}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-border">
                      <div className="space-y-0.5">
                        <Label htmlFor="run-tests" className="cursor-pointer text-sm">
                          Run required tests before deploy
                        </Label>
                        <p className="text-xs text-muted-foreground">
                          Execute test gates before deployment
                        </p>
                      </div>
                      <Switch
                        id="run-tests"
                        checked={runTestsBeforeDeploy}
                        onCheckedChange={setRunTestsBeforeDeploy}
                      />
                    </div>

                    {runTestsBeforeDeploy && (
                      <div className="space-y-2 pt-2 border-t border-border">
                        {testsRunning ? (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Loader2 className="size-4 animate-spin" />
                            Running tests...
                          </div>
                        ) : testsPassed ? (
                          <div className="flex items-center gap-2 text-sm text-green-500">
                            <CheckCircle2 className="size-4" />
                            All tests passed
                          </div>
                        ) : (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={handleRunTests}
                            disabled={!selectedBranch}
                            className="w-full"
                          >
                            <Rocket className="size-4 mr-2" />
                            Run Tests
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {selectedEnvironment && !hasGates && (
                  <div className="rounded-lg border border-border bg-muted/30 p-3">
                    <p className="text-sm text-muted-foreground">
                      No test gates required for this environment
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        <SheetFooter className="gap-2">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleCreateRelease}
            disabled={!isFormValid || (autoDeploy && !selectedEnvironment) || !canDeploy}
          >
            {autoDeploy ? "Create + Deploy" : "Create Release"}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}

