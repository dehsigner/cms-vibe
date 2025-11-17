"use client"

import * as React from "react"
import { Eye, Rocket } from "lucide-react"

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
import { mockReleases } from "@/lib/mock-data"
import { CreateReleaseSheet } from "@/components/test-deploy/CreateReleaseSheet"
import { ReleaseDetailPanel } from "@/components/test-deploy/ReleaseDetailPanel"
import { DeploySheet } from "@/components/test-deploy/DeploySheet"
import { getStatusToneClass, formatDate, formatTime } from "@/lib/utils"
import type { Release } from "@/lib/types"

export default function ReleasesPage() {
  const [activeRelease, setActiveRelease] = React.useState<Release | null>(null)
  const [activeDeployRelease, setActiveDeployRelease] = React.useState<Release | null>(null)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Releases</h1>
          <p className="text-muted-foreground mt-1">
            Manage and deploy releases from branches
          </p>
        </div>
        <CreateReleaseSheet />
      </div>

      {/* Releases Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Releases</CardTitle>
          <CardDescription>
            {mockReleases.length} release{mockReleases.length !== 1 ? "s" : ""} found
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Branch</TableHead>
                <TableHead>Commit</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockReleases.map((release) => (
                <TableRow key={release.id}>
                  <TableCell className="font-medium">{release.name}</TableCell>
                  <TableCell className="font-mono text-sm">{release.branch}</TableCell>
                  <TableCell className="font-mono text-sm">
                    {release.commit.substring(0, 7)}
                  </TableCell>
                  <TableCell>
                    {formatDate(release.createdAt)} {formatTime(release.createdAt)}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={getStatusToneClass(release.status)}>
                      {release.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setActiveRelease(release)}
                      >
                        <Eye className="size-4 mr-1" />
                        View
                      </Button>
                      <Button
                        variant="default"
                        size="sm"
                        disabled={release.status !== "ready"}
                        onClick={() => setActiveDeployRelease(release)}
                      >
                        <Rocket className="size-4 mr-1" />
                        Deploy
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

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

      {activeDeployRelease && (
        <DeploySheet
          open={!!activeDeployRelease}
          onOpenChange={(open) => {
            if (!open) {
              setActiveDeployRelease(null)
            }
          }}
          release={activeDeployRelease}
        />
      )}
    </div>
  )
}
