"use client"

import Link from "next/link"
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
import type { ReleaseStatus } from "@/lib/types"

const statusVariant: Record<ReleaseStatus, "default" | "secondary" | "outline" | "destructive"> = {
  draft: "outline",
  ready: "secondary",
  deployed: "default",
  failed: "destructive",
}

export default function ReleasesPage() {
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
                    {release.createdAt.toLocaleDateString()}{" "}
                    {release.createdAt.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </TableCell>
                  <TableCell>
                    <Badge variant={statusVariant[release.status]}>
                      {release.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/test-deploy/releases/${release.id}`}>
                          <Eye className="size-4 mr-1" />
                          View
                        </Link>
                      </Button>
                      <Button
                        variant="default"
                        size="sm"
                        disabled={release.status !== "ready"}
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
    </div>
  )
}
