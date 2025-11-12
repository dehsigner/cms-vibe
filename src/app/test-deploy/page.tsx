"use client"

import Link from "next/link"
import { Package, Server, TestTube } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { mockReleases, mockEnvironments, mockTestSuites } from "@/lib/mock-data"
import { CreateReleaseSheet } from "@/components/test-deploy/CreateReleaseSheet"

export default function TestDeployPage() {
  const activeReleases = mockReleases.filter((r) => r.status !== "deployed").length
  const healthyEnvironments = mockEnvironments.filter((e) => e.status === "healthy").length
  const passedTests = mockTestSuites.filter((t) => t.status === "passed").length
  const totalTests = mockTestSuites.length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Test & Deploy</h1>
          <p className="text-muted-foreground mt-1">
            Manage releases, environments, and test suites
          </p>
        </div>
        <CreateReleaseSheet />
      </div>

      {/* Overview Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Releases</CardTitle>
            <Package className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeReleases}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {mockReleases.length} total releases
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Environments</CardTitle>
            <Server className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{healthyEnvironments}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {mockEnvironments.length} total environments
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Test Results</CardTitle>
            <TestTube className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {passedTests}/{totalTests}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Test suites passed
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Releases</CardTitle>
            <CardDescription>Latest release activity</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockReleases.slice(0, 3).map((release) => (
                <div
                  key={release.id}
                  className="flex items-center justify-between border-b border-border pb-3 last:border-0 last:pb-0"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{release.name}</span>
                      <Badge
                        variant={
                          release.status === "deployed"
                            ? "default"
                            : release.status === "ready"
                              ? "secondary"
                              : "outline"
                        }
                      >
                        {release.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {release.branch} • {release.commitMessage}
                    </p>
                  </div>
                  <Link href={`/test-deploy/releases`}>
                    <Button variant="ghost" size="sm">
                      View
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Environment Status</CardTitle>
            <CardDescription>Current deployment status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockEnvironments.map((env) => (
                <div
                  key={env.id}
                  className="flex items-center justify-between border-b border-border pb-3 last:border-0 last:pb-0"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{env.displayName}</span>
                      <Badge
                        variant={
                          env.status === "healthy"
                            ? "default"
                            : env.status === "degraded"
                              ? "secondary"
                              : "destructive"
                        }
                      >
                        {env.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {env.currentRelease?.name || "No deployment"}
                      {env.lastDeployedAt &&
                        ` • ${env.lastDeployedAt.toLocaleDateString()}`}
                    </p>
                  </div>
                  <Link href={`/test-deploy/environments`}>
                    <Button variant="ghost" size="sm">
                      View
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
