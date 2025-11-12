"use client"

import * as React from "react"
import { Plus, Rocket } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

/**
 * Release Dialog Component
 * 
 * Assumptions:
 * - Branch selector would be populated from git branches (mock data for now)
 * - Pre-deployment tests are optional
 * - "Run Tests" button would trigger test execution before creating release
 * - "Create Release" button creates the release with optional test gate
 */
const mockBranches = [
  "main",
  "develop",
  "feature/new-api",
  "feature/auth-improvements",
  "release/v1.2.1",
  "hotfix/payment-bug",
]

export function ReleaseDialog() {
  const [open, setOpen] = React.useState(false)
  const [releaseName, setReleaseName] = React.useState("")
  const [selectedBranch, setSelectedBranch] = React.useState("")
  const [notes, setNotes] = React.useState("")
  const [runTestsBeforeDeploy, setRunTestsBeforeDeploy] = React.useState(false)

  const handleRunTests = () => {
    // In a real implementation, this would trigger test execution
    console.log("Running tests for branch:", selectedBranch)
    // For now, just show an alert
    alert("Tests would run here. This is a mock implementation.")
  }

  const handleCreateRelease = () => {
    if (!releaseName || !selectedBranch) {
      alert("Please fill in all required fields")
      return
    }

    // In a real implementation, this would create the release via API
    console.log("Creating release:", {
      name: releaseName,
      branch: selectedBranch,
      notes,
      runTestsBeforeDeploy,
    })

    // Reset form and close dialog
    setReleaseName("")
    setSelectedBranch("")
    setNotes("")
    setRunTestsBeforeDeploy(false)
    setOpen(false)
    alert("Release created successfully! (This is a mock)")
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="size-4 mr-2" />
          Create Release
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create New Release</DialogTitle>
          <DialogDescription>
            Create a release from a branch to deploy to environments
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="release-name">Release Name *</Label>
            <Input
              id="release-name"
              placeholder="e.g., v1.2.0"
              value={releaseName}
              onChange={(e) => setReleaseName(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="branch">Branch *</Label>
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

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="run-tests"
              checked={runTestsBeforeDeploy}
              onChange={(e) => setRunTestsBeforeDeploy(e.target.checked)}
              className="h-4 w-4 rounded border-input text-primary focus:ring-2 focus:ring-ring"
            />
            <Label htmlFor="run-tests" className="cursor-pointer">
              Run tests before deployment
            </Label>
          </div>
        </div>
        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={handleRunTests}
            disabled={!selectedBranch}
          >
            <Rocket className="size-4 mr-2" />
            Run Tests
          </Button>
          <Button onClick={handleCreateRelease}>
            Create Release
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

