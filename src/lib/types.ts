/**
 * Type definitions for Test & Deploy feature
 * 
 * Assumptions:
 * - Releases are created from git branches
 * - Environments are fixed: Dev, Stage, Prod
 * - Tests can be Unit tests or Workflow tests
 * - Releases can be deployed to environments with optional test gates
 */

export type ReleaseStatus = "draft" | "ready" | "deployed" | "failed";

export type EnvironmentName = "dev" | "stage" | "prod";

export type TestStatus = "passed" | "failed" | "pending" | "running";

export type TestType = "unit" | "workflow";

export interface Release {
  id: string;
  name: string;
  branch: string;
  commit: string;
  commitMessage: string;
  createdAt: Date;
  status: ReleaseStatus;
  notes?: string;
  deployedTo?: EnvironmentName[];
}

export interface Environment {
  id: string;
  name: EnvironmentName;
  displayName: string;
  currentRelease?: Release;
  lastDeployedAt?: Date;
  status: "healthy" | "degraded" | "down";
}

export interface TestSuite {
  id: string;
  name: string;
  type: TestType;
  environment: EnvironmentName;
  status: TestStatus;
  passed: number;
  failed: number;
  total: number;
  lastRunAt?: Date;
  releaseId?: string;
}

export type DeploymentStatus = "success" | "failed";

export interface DeploymentSuiteStatus {
  id: string;
  name: string;
  status: TestStatus;
}

export interface Deployment {
  id: string;
  releaseId: string;
  environmentId: string;
  deployedAt: Date;
  actor: string;
  status: DeploymentStatus;
  region?: string;
  requiredSuites: DeploymentSuiteStatus[];
  optionalSuites?: DeploymentSuiteStatus[];
  logs: string;
}

