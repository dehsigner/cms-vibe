"use client"

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
import type { TestStatus } from "@/lib/types"

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
            {mockTestSuites.length} test suite{mockTestSuites.length !== 1 ? "s" : ""} found
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
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockTestSuites.map((suite) => (
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
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

