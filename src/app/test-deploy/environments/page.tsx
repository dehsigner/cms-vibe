"use client"

import * as React from "react"
import { Rocket, Clock } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { mockEnvironments } from "@/lib/mock-data"
import { DeploySheet } from "@/components/test-deploy/DeploySheet"
import { getStatusToneClass, formatDate, formatTime } from "@/lib/utils"
import type { EnvironmentName } from "@/lib/types"

export default function EnvironmentsPage() {
  const [activeDeployEnvironment, setActiveDeployEnvironment] = React.useState<EnvironmentName | null>(null)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Environments</h1>
        <p className="text-muted-foreground mt-1">
          Manage deployments across development, staging, and production
        </p>
      </div>

      {/* Environment Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        {mockEnvironments.map((env) => (
          <Card key={env.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{env.displayName}</CardTitle>
                <Badge variant="outline" className={getStatusToneClass(env.status)}>
                  {env.status}
                </Badge>
              </div>
              <CardDescription>
                {env.name.toUpperCase()} environment
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">Current Release</div>
                <div className="font-medium">
                  {env.currentRelease?.name || "No deployment"}
                </div>
                {env.currentRelease && (
                  <div className="text-xs text-muted-foreground font-mono">
                    {env.currentRelease.commit.substring(0, 7)} • {env.currentRelease.branch}
                  </div>
                )}
              </div>

              {env.lastDeployedAt && (
                <div className="space-y-2">
                  <div className="text-sm text-muted-foreground">Last Deployed</div>
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="size-4" />
                    {formatDate(env.lastDeployedAt)} {formatTime(env.lastDeployedAt)}
                  </div>
                </div>
              )}

              <Button
                className="w-full"
                variant="default"
                onClick={() => setActiveDeployEnvironment(env.name)}
              >
                <Rocket className="size-4 mr-2" />
                Deploy Release
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {activeDeployEnvironment && (
        <DeploySheet
          open={!!activeDeployEnvironment}
          onOpenChange={(open) => {
            if (!open) {
              setActiveDeployEnvironment(null)
            }
          }}
          release={null}
          preselectedEnvironment={activeDeployEnvironment}
        />
      )}
    </div>
  )
}
