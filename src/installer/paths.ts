import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Bundled workflows ship with antfarm (in the repo's workflows/ directory)
export function resolveBundledWorkflowsDir(): string {
  // From dist/installer/paths.js -> ../../workflows
  return path.resolve(__dirname, "..", "..", "workflows");
}

// Validate workflowId to prevent path traversal
function validateWorkflowId(workflowId: string): void {
  if (!/^[a-z0-9_-]+$/i.test(workflowId)) {
    throw new Error(`Invalid workflowId: ${workflowId}. Must match ^[a-z0-9_-]+$`);
  }
}

// Assert resolved path stays within root directory
function assertPathWithinRoot(resolvedPath: string, root: string): void {
  const normalizedPath = path.resolve(resolvedPath);
  const normalizedRoot = path.resolve(root);
  if (!normalizedPath.startsWith(normalizedRoot + path.sep) && normalizedPath !== normalizedRoot) {
    throw new Error(`Path traversal detected: ${resolvedPath} is outside ${root}`);
  }
}

export function resolveBundledWorkflowDir(workflowId: string): string {
  validateWorkflowId(workflowId);
  const root = resolveBundledWorkflowsDir();
  const resolved = path.join(root, workflowId);
  assertPathWithinRoot(resolved, root);
  return resolved;
}

export function resolveOpenClawStateDir(): string {
  const env = process.env.OPENCLAW_STATE_DIR?.trim();
  if (env) {
    return env;
  }
  return path.join(os.homedir(), ".openclaw");
}

export function resolveOpenClawConfigPath(): string {
  const env = process.env.OPENCLAW_CONFIG_PATH?.trim();
  if (env) {
    return env;
  }
  return path.join(resolveOpenClawStateDir(), "openclaw.json");
}

export function resolveAntfarmRoot(): string {
  return path.join(resolveOpenClawStateDir(), "antfarm");
}

export function resolveWorkflowRoot(): string {
  return path.join(resolveAntfarmRoot(), "workflows");
}

export function resolveWorkflowDir(workflowId: string): string {
  validateWorkflowId(workflowId);
  const root = resolveWorkflowRoot();
  const resolved = path.join(root, workflowId);
  assertPathWithinRoot(resolved, root);
  return resolved;
}

export function resolveWorkflowWorkspaceRoot(): string {
  return path.join(resolveOpenClawStateDir(), "workspaces", "workflows");
}

export function resolveWorkflowWorkspaceDir(workflowId: string): string {
  validateWorkflowId(workflowId);
  const root = resolveWorkflowWorkspaceRoot();
  const resolved = path.join(root, workflowId);
  assertPathWithinRoot(resolved, root);
  return resolved;
}

export function resolveRunRoot(): string {
  return path.join(resolveAntfarmRoot(), "runs");
}

export function resolveAntfarmCli(): string {
  // From dist/installer/paths.js -> ../../dist/cli/cli.js
  return path.resolve(__dirname, "..", "cli", "cli.js");
}
