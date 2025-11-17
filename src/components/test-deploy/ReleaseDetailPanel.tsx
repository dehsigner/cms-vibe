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
import type { Release } from "@/lib/types"
import { getStatusToneClass, formatDate, formatTime } from "@/lib/utils"
import { mockEnvironments } from "@/lib/mock-data"

interface ReleaseDetailPanelProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  release: Release | null
}

export function ReleaseDetailPanel({
  open,
  onOpenChange,
  release,
}: ReleaseDetailPanelProps) {
  if (!release) {
    return null
  }

  // Get environments this release has been deployed to
  const deployedEnvironments = release.deployedTo
    ? mockEnvironments.filter((env) => release.deployedTo?.includes(env.name))
    : []

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Release Details</SheetTitle>
          <SheetDescription>{release.name}</SheetDescription>
        </SheetHeader>

        <div className="space-y-6 px-6 py-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Release Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <div className="text-sm text-muted-foreground">Name</div>
                <div className="font-medium">{release.name}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Branch</div>
                <div className="font-mono text-sm">{release.branch}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Commit</div>
                <div className="font-mono text-sm">{release.commit}</div>
              </div>
              {release.commitMessage && (
                <div>
                  <div className="text-sm text-muted-foreground">Commit Message</div>
                  <div className="text-sm">{release.commitMessage}</div>
                </div>
              )}
              <div>
                <div className="text-sm text-muted-foreground">Created At</div>
                <div className="text-sm">
                  {formatDate(release.createdAt)} {formatTime(release.createdAt)}
                </div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Status</div>
                <Badge variant="outline" className={getStatusToneClass(release.status)}>
                  {release.status}
                </Badge>
              </div>
              {release.notes && (
                <div>
                  <div className="text-sm text-muted-foreground">Notes</div>
                  <div className="text-sm">{release.notes}</div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Deployed Environments</CardTitle>
            </CardHeader>
            <CardContent>
              {deployedEnvironments.length > 0 ? (
                <div className="space-y-2">
                  {deployedEnvironments.map((env) => (
                    <div
                      key={env.id}
                      className="flex items-center justify-between rounded-md border border-border bg-muted/30 p-3"
                    >
                      <span className="text-sm font-medium">{env.displayName}</span>
                      <Badge variant="outline" className={getStatusToneClass(env.status)}>
                        {env.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  This release has not been deployed to any environment yet.
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </SheetContent>
    </Sheet>
  )
}


