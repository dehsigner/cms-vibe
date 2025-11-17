"use client"

import * as React from "react"
import { Eye, Package, Rocket, Server, TestTube } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { mockReleases, mockEnvironments, mockTestSuites } from "@/lib/mock-data"
import { mockDeployments } from "@/lib/mock-deployments"
import { CreateReleaseSheet } from "@/components/test-deploy/CreateReleaseSheet"
import { DeploymentDetailPanel } from "@/components/test-deploy/DeploymentDetailPanel"
import { ReleaseDetailPanel } from "@/components/test-deploy/ReleaseDetailPanel"
import type { Deployment, Environment, Release } from "@/lib/types"
import { getStatusToneClass, formatDate } from "@/lib/utils"

export default function TestDeployPage() {
  const [activeDeployment, setActiveDeployment] = React.useState<{
    deployment: Deployment
    release: Release
    environment: Environment
  } | null>(null)
  const [activeRelease, setActiveRelease] = React.useState<Release | null>(null)

  const activeReleases = mockReleases.filter((r) => r.status !== "deployed").length
  const healthyEnvironments = mockEnvironments.filter((e) => e.status === "healthy").length
  const passedTests = mockTestSuites.filter((t) => t.status === "passed").length
  const totalTests = mockTestSuites.length

  const handleViewDeployment = (releaseId: string, environmentId: string) => {
    const deployment = mockDeployments.find(
      (d) => d.releaseId === releaseId && d.environmentId === environmentId
    )
    if (!deployment) {
      return
    }

    const release = mockReleases.find((r) => r.id === deployment.releaseId)
    const environment = mockEnvironments.find((e) => e.id === deployment.environmentId)

    if (release && environment) {
      setActiveDeployment({ deployment, release, environment })
    }
  }

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
                        variant="outline"
                        className={getStatusToneClass(release.status)}
                      >
                        {release.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {release.branch} • {release.commitMessage}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setActiveRelease(release)}
                  >
                    <Eye className="size-4 mr-1" />
                    View
                  </Button>
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
                        variant="outline"
                        className={getStatusToneClass(env.status)}
                      >
                        {env.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {env.currentRelease?.name || "No deployment"}
                      {env.lastDeployedAt && ` • ${formatDate(env.lastDeployedAt)}`}
                    </p>
                  </div>
                  {env.currentRelease ? (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        handleViewDeployment(env.currentRelease!.id, env.id)
                      }
                    >
                      <Rocket className="size-4 mr-1" />
                      View Deployment
                    </Button>
                  ) : null}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {activeDeployment && (
        <DeploymentDetailPanel
          open={!!activeDeployment}
          onOpenChange={(open) => {
            if (!open) {
              setActiveDeployment(null)
            }
          }}
          deployment={activeDeployment.deployment}
          release={activeDeployment.release}
          environment={activeDeployment.environment}
        />
      )}

      {activeRelease && (
        <ReleaseDetailPanel
          open={!!activeRelease}
          onOpenChange={(open) => {
            if (!open) {
              setActiveRelease(null)
            }
          }}
          release={activeRelease}
        />
      )}
    </div>
  )
}
