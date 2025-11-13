"use client"

import * as React from "react"
import { Play } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { mockTestSuites } from "@/lib/mock-data"
import type { TestStatus, TestSuite } from "@/lib/types"

const statusVariant: Record<TestStatus, "default" | "secondary" | "destructive" | "outline"> = {
  passed: "default",
  failed: "destructive",
  pending: "outline",
  running: "secondary",
}

const typeLabel: Record<string, string> = {
  unit: "Unit",
  workflow: "Workflow",
}

const envLabel: Record<string, string> = {
  dev: "Development",
  stage: "Staging",
  prod: "Production",
}

export default function TestsPage() {
  const [testSuites, setTestSuites] = React.useState<TestSuite[]>(mockTestSuites)
  const [runningTests, setRunningTests] = React.useState<Set<string>>(new Set())

  const handleRunTest = (suiteId: string) => {
    // Prevent running if already running
    if (runningTests.has(suiteId)) return

    setRunningTests((prev) => new Set(prev).add(suiteId))

    // Update status to running immediately
    setTestSuites((prev) =>
      prev.map((suite) =>
        suite.id === suiteId
          ? {
              ...suite,
              status: "running" as TestStatus,
            }
          : suite
      )
    )

    // Simulate async test execution (1-2 seconds delay)
    const delay = 1000 + Math.random() * 1000 // 1000-2000ms
    setTimeout(() => {
      // Random result: 80% passed, 20% failed
      const passed = Math.random() < 0.8

      setTestSuites((prev) => {
        const suite = prev.find((s) => s.id === suiteId)
        if (!suite) return prev

        // Generate realistic passed/failed counts
        let passedCount: number
        let failedCount: number

        if (passed) {
          // All tests pass
          passedCount = suite.total
          failedCount = 0
        } else {
          // Some tests fail (1-20% of total)
          const failureRate = 0.01 + Math.random() * 0.19 // 1-20%
          failedCount = Math.max(1, Math.floor(suite.total * failureRate))
          passedCount = suite.total - failedCount
        }

        return prev.map((s) =>
          s.id === suiteId
            ? {
                ...s,
                status: (passed ? "passed" : "failed") as TestStatus,
                passed: passedCount,
                failed: failedCount,
                lastRunAt: new Date(),
              }
            : s
        )
      })

      setRunningTests((prev) => {
        const next = new Set(prev)
        next.delete(suiteId)
        return next
      })
    }, delay)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Tests</h1>
        <p className="text-muted-foreground mt-1">
          View test results across environments and releases
        </p>
      </div>

      {/* Test Suites Table */}
      <Card>
        <CardHeader>
          <CardTitle>Test Suites</CardTitle>
          <CardDescription>
            {testSuites.length} test suite{testSuites.length !== 1 ? "s" : ""} found
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Environment</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Results</TableHead>
                <TableHead>Last Run</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {testSuites.map((suite) => {
                const isRunning = runningTests.has(suite.id)
                return (
                  <TableRow key={suite.id}>
                    <TableCell className="font-medium">{suite.name}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{typeLabel[suite.type]}</Badge>
                    </TableCell>
                    <TableCell>{envLabel[suite.environment]}</TableCell>
                    <TableCell>
                      <Badge variant={statusVariant[suite.status]}>
                        {suite.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {suite.status === "running" ? (
                        <span className="text-muted-foreground">Running...</span>
                      ) : (
                        <span className="text-sm">
                          <span className="text-green-500">{suite.passed}</span> /{" "}
                          <span className="text-red-500">{suite.failed}</span> /{" "}
                          <span className="text-muted-foreground">{suite.total}</span>
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      {suite.lastRunAt ? (
                        <span className="text-sm text-muted-foreground">
                          {suite.lastRunAt.toLocaleDateString()}{" "}
                          {suite.lastRunAt.toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      ) : (
                        <span className="text-sm text-muted-foreground">Never</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRunTest(suite.id)}
                        disabled={isRunning}
                      >
                        <Play className="size-4 mr-1" />
                        {isRunning ? "Running..." : "Run"}
                      </Button>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

