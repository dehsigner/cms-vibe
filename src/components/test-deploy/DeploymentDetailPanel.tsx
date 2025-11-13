"use client"

import * as React from "react"

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { Deployment, DeploymentSuiteStatus, Environment, Release } from "@/lib/types"
import { cn, getStatusToneClass } from "@/lib/utils"

interface DeploymentDetailPanelProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  deployment: Deployment | null
  release: Release | null
  environment: Environment | null
}

const renderSuiteList = (
  suites: DeploymentSuiteStatus[] | undefined,
  emptyLabel: string
) => {
  if (!suites || suites.length === 0) {
    return <p className="text-sm text-muted-foreground">{emptyLabel}</p>
  }

  return (
    <div className="space-y-2">
      {suites.map((suite) => (
        <div
          key={suite.id}
          className="flex items-center justify-between rounded-md border border-border bg-muted/30 p-3"
        >
          <span className="text-sm">{suite.name}</span>
          <Badge variant="outline" className={cn(getStatusToneClass(suite.status), "text-xs")}>
            {suite.status}
          </Badge>
        </div>
      ))}
    </div>
  )
}

export function DeploymentDetailPanel({
  open,
  onOpenChange,
  deployment,
  release,
  environment,
}: DeploymentDetailPanelProps) {
  if (!deployment || !release || !environment) {
    return null
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Deployment Details</SheetTitle>
          <SheetDescription>
            {environment.displayName} • {release.name}
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-6 px-6 py-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Environment</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="font-medium">{environment.displayName}</div>
              <div className="text-sm text-muted-foreground font-mono">{environment.name}</div>
              {deployment.region && (
                <div className="text-sm text-muted-foreground">Region: {deployment.region}</div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Release</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="font-medium">{release.name}</div>
              <div className="text-sm text-muted-foreground font-mono">
                {release.commit.substring(0, 7)} • {release.branch}
              </div>
              {release.commitMessage && (
                <div className="text-sm text-muted-foreground">{release.commitMessage}</div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Deployment Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Deployed At</span>
                <span>
                  {deployment.deployedAt.toLocaleDateString()}{" "}
                  {deployment.deployedAt.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                  })}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Actor</span>
                <span>{deployment.actor}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Result</span>
                <Badge
                  variant="outline"
                  className={getStatusToneClass(deployment.status)}
                >
                  {deployment.status}
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Required Suites</CardTitle>
            </CardHeader>
            <CardContent>
              {renderSuiteList(deployment.requiredSuites, "No required test suites recorded.")}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Optional Suites</CardTitle>
            </CardHeader>
            <CardContent>
              {renderSuiteList(deployment.optionalSuites, "No optional test suites recorded.")}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Logs</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="max-h-64 overflow-y-auto whitespace-pre-wrap rounded-md border border-border bg-muted/30 p-3 text-xs text-muted-foreground">
                {deployment.logs}
              </pre>
            </CardContent>
          </Card>
        </div>
      </SheetContent>
    </Sheet>
  )
}

