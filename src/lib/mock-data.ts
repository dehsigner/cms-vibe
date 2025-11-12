/**
 * Mock data for Test & Deploy feature
 * This will be replaced with real API calls later
 */

import type { Release, Environment, TestSuite } from "./types"

export const mockReleases: Release[] = [
  {
    id: "rel-1",
    name: "v1.2.0",
    branch: "feature/new-api",
    commit: "a1b2c3d",
    commitMessage: "Add new API endpoints",
    createdAt: new Date("2024-01-15T10:30:00"),
    status: "ready",
    notes: "Includes new authentication flow",
    deployedTo: ["dev"],
  },
  {
    id: "rel-2",
    name: "v1.1.5",
    branch: "main",
    commit: "e4f5g6h",
    commitMessage: "Fix critical bug in payment processing",
    createdAt: new Date("2024-01-14T15:20:00"),
    status: "deployed",
    deployedTo: ["dev", "stage", "prod"],
  },
  {
    id: "rel-3",
    name: "v1.2.1-rc",
    branch: "release/v1.2.1",
    commit: "i7j8k9l",
    commitMessage: "Release candidate for v1.2.1",
    createdAt: new Date("2024-01-16T09:15:00"),
    status: "draft",
  },
]

export const mockEnvironments: Environment[] = [
  {
    id: "env-dev",
    name: "dev",
    displayName: "Development",
    currentRelease: mockReleases[0],
    lastDeployedAt: new Date("2024-01-15T10:35:00"),
    status: "healthy",
  },
  {
    id: "env-stage",
    name: "stage",
    displayName: "Staging",
    currentRelease: mockReleases[1],
    lastDeployedAt: new Date("2024-01-14T16:00:00"),
    status: "healthy",
  },
  {
    id: "env-prod",
    name: "prod",
    displayName: "Production",
    currentRelease: mockReleases[1],
    lastDeployedAt: new Date("2024-01-14T18:30:00"),
    status: "healthy",
  },
]

export const mockTestSuites: TestSuite[] = [
  {
    id: "test-1",
    name: "Unit Tests - API",
    type: "unit",
    environment: "dev",
    status: "passed",
    passed: 45,
    failed: 0,
    total: 45,
    lastRunAt: new Date("2024-01-15T10:36:00"),
    releaseId: "rel-1",
  },
  {
    id: "test-2",
    name: "Workflow Tests - Auth",
    type: "workflow",
    environment: "dev",
    status: "passed",
    passed: 12,
    failed: 0,
    total: 12,
    lastRunAt: new Date("2024-01-15T10:37:00"),
    releaseId: "rel-1",
  },
  {
    id: "test-3",
    name: "Unit Tests - Database",
    type: "unit",
    environment: "stage",
    status: "failed",
    passed: 38,
    failed: 2,
    total: 40,
    lastRunAt: new Date("2024-01-14T16:05:00"),
    releaseId: "rel-2",
  },
  {
    id: "test-4",
    name: "Workflow Tests - Payment",
    type: "workflow",
    environment: "prod",
    status: "passed",
    passed: 8,
    failed: 0,
    total: 8,
    lastRunAt: new Date("2024-01-14T18:35:00"),
    releaseId: "rel-2",
  },
  {
    id: "test-5",
    name: "Unit Tests - API",
    type: "unit",
    environment: "dev",
    status: "running",
    passed: 0,
    failed: 0,
    total: 45,
    releaseId: "rel-3",
  },
]

