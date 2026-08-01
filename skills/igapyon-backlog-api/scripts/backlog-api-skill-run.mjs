#!/usr/bin/env node

import { spawnSync } from "node:child_process";
import { createHash, randomUUID } from "node:crypto";
import {
  chmodSync,
  closeSync,
  existsSync,
  mkdirSync,
  openSync,
  readFileSync,
  readdirSync,
  realpathSync,
  renameSync,
  unlinkSync,
  writeFileSync
} from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import {
  WORKFLOW_MANIFEST,
  WORKFLOW_MANIFEST_VERSION,
  workflowManifestById
} from "./backlog-api-workflow-manifest.mjs";

export const RUNNER_SCHEMA_VERSION = "backlog-api-skills.runner/v1";
export const HANDOFF_SCHEMA_VERSION = "backlog-api-skills.issue-delete-handoff/v1";
export const PRODUCT_VERSION = "0.6.1";

const SCRIPT_DIRECTORY = path.dirname(fileURLToPath(import.meta.url));
const SKILL_ROOT = path.resolve(SCRIPT_DIRECTORY, "..");
const HANDOFF_DIRECTORY = path.join("workplace", "backlog-api-skill", "delete-handoffs");
const HANDOFF_ID = /^[a-z0-9-]{36}$/i;
const ORGANIZATION_NAME = /^[A-Za-z0-9][A-Za-z0-9_-]{0,63}$/;
const ISSUE_KEY = /^\S{1,100}$/;
const PERMISSIONS = new Set(["READ", "CREATE", "UPDATE", "DELETE"]);

export class BacklogSkillRunnerError extends Error {
  constructor(code, message) {
    super(message);
    this.name = "BacklogSkillRunnerError";
    this.code = code;
  }
}

function isRecord(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function sha256(value) {
  return createHash("sha256").update(value).digest("hex");
}

function oneLine(value, fallback = "(no summary)") {
  const normalized = String(value ?? "").replace(/\s+/g, " ").trim();
  if (!normalized) return fallback;
  return normalized.length <= 160 ? normalized : `${normalized.slice(0, 157)}...`;
}

function writeJsonAtomic(filePath, value) {
  const temporaryPath = `${filePath}.tmp-${process.pid}-${randomUUID()}`;
  writeFileSync(temporaryPath, `${JSON.stringify(value, null, 2)}\n`, {
    encoding: "utf8",
    mode: 0o600
  });
  renameSync(temporaryPath, filePath);
  chmodSync(filePath, 0o600);
}

function handoffDirectory(cwd, artifactRoot) {
  return path.resolve(artifactRoot ?? path.join(cwd, HANDOFF_DIRECTORY));
}

function ensureHandoffDirectory(directory) {
  mkdirSync(directory, { recursive: true, mode: 0o700 });
  chmodSync(directory, 0o700);
}

function parsePermissionSet(environment) {
  const raw = environment.BACKLOG_API_ALLOWED_PERMISSIONS;
  if (raw === undefined) return new Set(["READ"]);
  const values = raw.split(",").map((entry) => entry.trim().toUpperCase());
  if (values.length === 0 || values.some((entry) => !PERMISSIONS.has(entry))) {
    throw new BacklogSkillRunnerError(
      "INVALID_PERMISSION_CONFIGURATION",
      "BACKLOG_API_ALLOWED_PERMISSIONS is invalid"
    );
  }
  return new Set(values);
}

function requirePreflightPermissions(environment) {
  const permissions = parsePermissionSet(environment);
  if (!permissions.has("READ")) {
    throw new BacklogSkillRunnerError("READ_PERMISSION_NOT_ENABLED", "READ permission is not enabled");
  }
  if (!permissions.has("DELETE")) {
    throw new BacklogSkillRunnerError("DELETE_PERMISSION_NOT_ENABLED", "DELETE permission is not enabled");
  }
}

function requireApplyPermissions(environment) {
  const permissions = parsePermissionSet(environment);
  if (!permissions.has("DELETE")) {
    throw new BacklogSkillRunnerError("DELETE_PERMISSION_NOT_ENABLED", "DELETE permission is not enabled");
  }
}

function parseIssueTarget(argumentsList, { requireApply }) {
  const options = {
    issueKey: undefined,
    issueId: undefined,
    organization: undefined,
    apply: false
  };
  const knownFlags = new Set(["--issue-key", "--issue-id", "--organization", "--apply"]);

  for (let index = 0; index < argumentsList.length; index += 1) {
    const flag = argumentsList[index];
    if (!knownFlags.has(flag)) {
      throw new BacklogSkillRunnerError("UNKNOWN_OPTION", `Unknown option: ${flag}`);
    }
    if (flag === "--apply") {
      if (options.apply) throw new BacklogSkillRunnerError("DUPLICATE_OPTION", "Duplicate --apply");
      options.apply = true;
      continue;
    }
    const value = argumentsList[index + 1];
    if (value === undefined || value.startsWith("--")) {
      throw new BacklogSkillRunnerError("MISSING_OPTION_VALUE", `Missing value for ${flag}`);
    }
    index += 1;
    if (flag === "--issue-key") {
      if (options.issueKey !== undefined) {
        throw new BacklogSkillRunnerError("DUPLICATE_OPTION", "Duplicate --issue-key");
      }
      if (!ISSUE_KEY.test(value)) {
        throw new BacklogSkillRunnerError("INVALID_ISSUE_KEY", "Invalid issue key");
      }
      options.issueKey = value;
    } else if (flag === "--issue-id") {
      if (options.issueId !== undefined) {
        throw new BacklogSkillRunnerError("DUPLICATE_OPTION", "Duplicate --issue-id");
      }
      if (!/^[1-9]\d*$/.test(value) || !Number.isSafeInteger(Number(value))) {
        throw new BacklogSkillRunnerError("INVALID_ISSUE_ID", "Invalid issue ID");
      }
      options.issueId = Number(value);
    } else if (flag === "--organization") {
      if (options.organization !== undefined) {
        throw new BacklogSkillRunnerError("DUPLICATE_OPTION", "Duplicate --organization");
      }
      if (!ORGANIZATION_NAME.test(value)) {
        throw new BacklogSkillRunnerError("INVALID_ORGANIZATION", "Invalid organization name");
      }
      options.organization = value;
    }
  }

  if ((options.issueKey === undefined) === (options.issueId === undefined)) {
    throw new BacklogSkillRunnerError(
      "ISSUE_TARGET_REQUIRED",
      "Specify exactly one of --issue-key or --issue-id"
    );
  }
  if (requireApply !== options.apply) {
    throw new BacklogSkillRunnerError(
      requireApply ? "EXPLICIT_APPLY_REQUIRED" : "UNEXPECTED_APPLY",
      requireApply ? "This workflow requires --apply" : "Preflight rejects --apply"
    );
  }
  return options;
}

function parseDeleteApplyArgs(argumentsList) {
  let apply = false;
  for (const argument of argumentsList) {
    if (argument !== "--apply") {
      throw new BacklogSkillRunnerError("UNKNOWN_OPTION", `Unknown option: ${argument}`);
    }
    if (apply) {
      throw new BacklogSkillRunnerError("DUPLICATE_OPTION", "Duplicate --apply");
    }
    apply = true;
  }
  if (!apply) {
    throw new BacklogSkillRunnerError(
      "EXPLICIT_APPLY_REQUIRED",
      "This workflow requires --apply"
    );
  }
  return { apply };
}

export function parseRunnerCliArgs(argv) {
  const argumentsList = [...argv];
  let format = "json";
  if (argumentsList[0] === "--format") {
    format = argumentsList[1] ?? "";
    argumentsList.splice(0, 2);
  }
  if (format !== "json" && format !== "human") {
    throw new BacklogSkillRunnerError("INVALID_FORMAT", "--format must be json or human");
  }
  const [workflowId, ...workflowArguments] = argumentsList;
  return { format, workflowId, workflowArguments };
}

export function resolveRuntimeIdentity(skillRoot = SKILL_ROOT) {
  const runtimeDirectory = path.resolve(skillRoot, "runtime");
  const source = JSON.parse(readFileSync(path.join(runtimeDirectory, "backlog-api-source.json"), "utf8"));
  const runtimePath = path.resolve(runtimeDirectory, source.artifact.file);
  if (!existsSync(runtimePath)) {
    throw new BacklogSkillRunnerError("RUNTIME_NOT_FOUND", `Missing runtime: ${source.artifact.file}`);
  }
  const artifactSha256 = sha256(readFileSync(runtimePath));
  if (artifactSha256 !== source.artifact.sha256) {
    throw new BacklogSkillRunnerError("RUNTIME_CHECKSUM_MISMATCH", "Bundled runtime checksum mismatch");
  }
  return {
    path: runtimePath,
    file: source.artifact.file,
    sourceVersion: source.source.version,
    sha256: artifactSha256
  };
}

export function callBundledRuntime({ runtime, operation, input, callOptions, environment, spawn = spawnSync }) {
  const execution = spawn(
    process.execPath,
    [runtime.path, "call", operation, "--input", "-", ...callOptions],
    {
      encoding: "utf8",
      input: `${JSON.stringify(input)}\n`,
      env: environment,
      maxBuffer: 1024 * 1024
    }
  );
  if (execution.error) {
    throw new BacklogSkillRunnerError("RUNTIME_EXECUTION_FAILED", "Bundled runtime could not start");
  }
  let result;
  try {
    result = JSON.parse(execution.stdout);
  } catch {
    throw new BacklogSkillRunnerError("RUNTIME_PROTOCOL_ERROR", "Bundled runtime did not return JSON");
  }
  if (!isRecord(result) || result.operation !== operation || typeof result.success !== "boolean") {
    throw new BacklogSkillRunnerError("RUNTIME_PROTOCOL_ERROR", "Bundled runtime returned an invalid envelope");
  }
  return result;
}

function runtimeFailure(operation, result) {
  const diagnostic = Array.isArray(result.diagnostics) ? result.diagnostics[0] : undefined;
  const code = isRecord(diagnostic) && typeof diagnostic.code === "string"
    ? diagnostic.code
    : "UNKNOWN";
  return new BacklogSkillRunnerError("BACKLOG_CALL_FAILED", `${operation} failed: ${code}`);
}

function invokeRuntime(dependencies, argumentsObject) {
  const invoke = dependencies.invokeRuntime ?? callBundledRuntime;
  return invoke(argumentsObject);
}

function targetInput(target) {
  return {
    ...(target.issueKey === undefined ? { issueId: target.issueId } : { issueKey: target.issueKey }),
    ...(target.organization === undefined ? {} : { organization: target.organization })
  };
}

function extractIssueTarget(result, requestedTarget) {
  if (!isRecord(result.result)) {
    throw new BacklogSkillRunnerError("INVALID_RUNTIME_RESULT", "get_issue returned no issue object");
  }
  const issue = result.result;
  if (!Number.isSafeInteger(issue.id) || issue.id <= 0) {
    throw new BacklogSkillRunnerError("INVALID_RUNTIME_RESULT", "get_issue returned an invalid issue ID");
  }
  if (typeof issue.issueKey !== "string" || !ISSUE_KEY.test(issue.issueKey)) {
    throw new BacklogSkillRunnerError("INVALID_RUNTIME_RESULT", "get_issue returned an invalid issue key");
  }
  if (requestedTarget.issueKey !== undefined && requestedTarget.issueKey !== issue.issueKey) {
    throw new BacklogSkillRunnerError("TARGET_MISMATCH", "Resolved issue key differs from the requested key");
  }
  if (requestedTarget.issueId !== undefined && requestedTarget.issueId !== issue.id) {
    throw new BacklogSkillRunnerError("TARGET_MISMATCH", "Resolved issue ID differs from the requested ID");
  }
  return {
    organization: requestedTarget.organization ?? "default",
    issueId: issue.id,
    projectId: Number.isSafeInteger(issue.projectId) ? issue.projectId : null,
    issueKey: issue.issueKey,
    summary: oneLine(issue.summary),
    status: isRecord(issue.status) ? oneLine(issue.status.name, "unknown") : "unknown"
  };
}

function reviewPayload(runtime, target, organization) {
  return {
    schemaVersion: HANDOFF_SCHEMA_VERSION,
    workflow: "issue.delete.preflight",
    operation: "delete_issue",
    runtime: {
      file: runtime.file,
      sourceVersion: runtime.sourceVersion,
      sha256: runtime.sha256
    },
    target,
    deleteInput: {
      issueId: target.issueId,
      ...(organization === undefined ? {} : { organization })
    }
  };
}

function handoffPayload(handoff) {
  const { recordSha256: ignoredRecordSha256, ...payload } = handoff;
  return payload;
}

function withRecordDigest(handoff) {
  const payload = handoffPayload(handoff);
  return {
    ...payload,
    recordSha256: sha256(JSON.stringify(payload))
  };
}

function writeHandoff(filePath, handoff) {
  const updated = withRecordDigest(handoff);
  writeJsonAtomic(filePath, updated);
  return updated;
}

function acquireApplyLock(filePath) {
  const lockPath = `${filePath}.apply.lock`;
  let descriptor;
  try {
    descriptor = openSync(lockPath, "wx", 0o600);
  } catch (error) {
    if (error?.code === "EEXIST") {
      throw new BacklogSkillRunnerError(
        "HANDOFF_APPLY_IN_PROGRESS",
        "Deletion handoff already has an apply attempt"
      );
    }
    throw new BacklogSkillRunnerError("HANDOFF_LOCK_FAILED", "Deletion handoff could not be locked");
  }
  closeSync(descriptor);
  return lockPath;
}

function releaseApplyLock(lockPath) {
  try {
    unlinkSync(lockPath);
  } catch {
    // A residual lock is fail-safe: the handoff is no longer pending after an attempt.
  }
}

function validateHandoff(handoff) {
  if (!isRecord(handoff) || handoff.schemaVersion !== HANDOFF_SCHEMA_VERSION || !HANDOFF_ID.test(handoff.id)) {
    throw new BacklogSkillRunnerError("INVALID_HANDOFF", "Invalid deletion handoff");
  }
  if (!isRecord(handoff.review) || typeof handoff.reviewSha256 !== "string" || typeof handoff.recordSha256 !== "string") {
    throw new BacklogSkillRunnerError("INVALID_HANDOFF", "Deletion handoff has no review payload");
  }
  if (sha256(JSON.stringify(handoff.review)) !== handoff.reviewSha256) {
    throw new BacklogSkillRunnerError("HANDOFF_DIGEST_MISMATCH", "Deletion handoff review changed");
  }
  if (sha256(JSON.stringify(handoffPayload(handoff))) !== handoff.recordSha256) {
    throw new BacklogSkillRunnerError("HANDOFF_RECORD_DIGEST_MISMATCH", "Deletion handoff record changed");
  }
  if (handoff.review.workflow !== "issue.delete.preflight" || handoff.review.operation !== "delete_issue") {
    throw new BacklogSkillRunnerError("INVALID_HANDOFF", "Deletion handoff workflow is invalid");
  }
  if (!isRecord(handoff.review.target) || !isRecord(handoff.review.deleteInput)) {
    throw new BacklogSkillRunnerError("INVALID_HANDOFF", "Deletion handoff target is invalid");
  }
  if (!Number.isSafeInteger(handoff.review.deleteInput.issueId) || handoff.review.deleteInput.issueId <= 0) {
    throw new BacklogSkillRunnerError("INVALID_HANDOFF", "Deletion handoff issue ID is invalid");
  }
  if (!['pending', 'applying', 'applied', 'unresolved'].includes(handoff.status)) {
    throw new BacklogSkillRunnerError("INVALID_HANDOFF", "Deletion handoff status is invalid");
  }
  return handoff;
}

function createHandoff({ directory, runtime, target, organization, now, createId }) {
  ensureHandoffDirectory(directory);
  const id = createId?.() ?? randomUUID();
  if (!HANDOFF_ID.test(id)) {
    throw new BacklogSkillRunnerError("INVALID_HANDOFF_ID", "Generated an invalid handoff ID");
  }
  const review = reviewPayload(runtime, target, organization);
  const handoff = withRecordDigest({
    schemaVersion: HANDOFF_SCHEMA_VERSION,
    id,
    status: "pending",
    createdAt: now.toISOString(),
    review,
    reviewSha256: sha256(JSON.stringify(review))
  });
  const filePath = path.join(directory, `${id}.json`);
  if (existsSync(filePath)) {
    throw new BacklogSkillRunnerError("HANDOFF_ALREADY_EXISTS", "Deletion handoff already exists");
  }
  writeJsonAtomic(filePath, handoff);
  return { handoff, filePath };
}

function matchingPendingHandoffs(directory) {
  if (!existsSync(directory)) return [];
  return readdirSync(directory, { withFileTypes: true })
    .filter((entry) => entry.isFile() && HANDOFF_ID.test(entry.name.replace(/\.json$/, "")) && entry.name.endsWith(".json"))
    .map((entry) => {
      const filePath = path.join(directory, entry.name);
      let parsed;
      try {
        parsed = JSON.parse(readFileSync(filePath, "utf8"));
      } catch {
        throw new BacklogSkillRunnerError("INVALID_HANDOFF", "Deletion handoff cannot be read");
      }
      const handoff = validateHandoff(parsed);
      if (entry.name !== `${handoff.id}.json`) {
        throw new BacklogSkillRunnerError("INVALID_HANDOFF", "Deletion handoff file name is invalid");
      }
      return { filePath, handoff };
    })
    .filter(({ handoff }) => handoff.status === "pending");
}

function finalConfirmation(target) {
  return `組織 ${target.organization} の ${target.issueKey}（「${target.summary}」）を完全に削除します。復元できません。実行しますか？`;
}

function makeResult({ workflow, status, mutationInvoked, handoffPath, target, humanOutput }) {
  return {
    schemaVersion: RUNNER_SCHEMA_VERSION,
    workflow,
    workflowManifestVersion: WORKFLOW_MANIFEST_VERSION,
    status,
    mutationInvoked,
    ...(handoffPath === undefined ? {} : { handoffPath }),
    ...(target === undefined ? {} : { target }),
    humanOutput
  };
}

export function runDeletePreflight(options, dependencies = {}) {
  const cwd = path.resolve(dependencies.cwd ?? process.cwd());
  const environment = dependencies.environment ?? process.env;
  requirePreflightPermissions(environment);
  const runtime = dependencies.runtime ?? resolveRuntimeIdentity(dependencies.skillRoot);
  const readInput = {
    ...targetInput(options),
    fields: "{ id projectId issueKey summary status { name } }"
  };
  const readResult = invokeRuntime(dependencies, {
    runtime,
    operation: "get_issue",
    input: readInput,
    callOptions: ["--verbose"],
    environment
  });
  if (!readResult.success) throw runtimeFailure("get_issue", readResult);

  const target = extractIssueTarget(readResult, options);
  const { handoff, filePath } = createHandoff({
    directory: handoffDirectory(cwd, dependencies.artifactRoot),
    runtime,
    target,
    organization: options.organization,
    now: dependencies.now?.() ?? new Date(),
    createId: dependencies.createId
  });
  return makeResult({
    workflow: "issue.delete.preflight",
    status: "preflight-ok",
    mutationInvoked: false,
    handoffPath: path.relative(cwd, filePath),
    target,
    humanOutput: finalConfirmation(handoff.review.target)
  });
}

export function runDeleteApply(_options, dependencies = {}) {
  const cwd = path.resolve(dependencies.cwd ?? process.cwd());
  const environment = dependencies.environment ?? process.env;
  requireApplyPermissions(environment);
  const directory = handoffDirectory(cwd, dependencies.artifactRoot);
  const pending = matchingPendingHandoffs(directory);
  if (pending.length === 0) {
    throw new BacklogSkillRunnerError("PENDING_HANDOFF_NOT_FOUND", "No pending deletion handoff exists");
  }
  if (pending.length > 1) {
    throw new BacklogSkillRunnerError("AMBIGUOUS_PENDING_HANDOFF", "More than one pending deletion handoff exists");
  }
  const { filePath, handoff } = pending[0];
  const runtime = dependencies.runtime ?? resolveRuntimeIdentity(dependencies.skillRoot);
  const reviewedRuntime = handoff.review.runtime;
  if (!isRecord(reviewedRuntime)
    || reviewedRuntime.sha256 !== runtime.sha256
    || reviewedRuntime.file !== runtime.file
    || reviewedRuntime.sourceVersion !== runtime.sourceVersion) {
    throw new BacklogSkillRunnerError("RUNTIME_IDENTITY_CHANGED", "Bundled runtime changed after deletion review");
  }

  const lockPath = acquireApplyLock(filePath);
  try {
    let updatedHandoff = writeHandoff(filePath, {
      ...handoff,
      status: "applying",
      attemptStartedAt: (dependencies.now?.() ?? new Date()).toISOString()
    });
    let deleteResult;
    try {
      deleteResult = invokeRuntime(dependencies, {
        runtime,
        operation: "delete_issue",
        input: handoff.review.deleteInput,
        callOptions: ["--allow", "DELETE", "--confirm-destructive", "--verbose"],
        environment
      });
    } catch (error) {
      writeHandoff(filePath, {
        ...updatedHandoff,
        status: "unresolved",
        finishedAt: (dependencies.now?.() ?? new Date()).toISOString()
      });
      throw error;
    }
    if (!deleteResult.success) {
      writeHandoff(filePath, {
        ...updatedHandoff,
        status: "unresolved",
        finishedAt: (dependencies.now?.() ?? new Date()).toISOString()
      });
      throw runtimeFailure("delete_issue", deleteResult);
    }
    updatedHandoff = writeHandoff(filePath, {
      ...updatedHandoff,
      status: "applied",
      finishedAt: (dependencies.now?.() ?? new Date()).toISOString()
    });
    return makeResult({
      workflow: "issue.delete.handoff.apply",
      status: "success",
      mutationInvoked: true,
      handoffPath: path.relative(cwd, filePath),
      target: updatedHandoff.review.target,
      humanOutput: `${updatedHandoff.review.target.issueKey} を削除しました。`
    });
  } finally {
    releaseApplyLock(lockPath);
  }
}

export function runWorkflow(workflowId, workflowArguments, dependencies = {}) {
  if (!workflowManifestById().has(workflowId)) {
    throw new BacklogSkillRunnerError("UNKNOWN_WORKFLOW", `Unknown workflow: ${workflowId}`);
  }
  if (workflowId === "issue.delete.preflight") {
    return runDeletePreflight(parseIssueTarget(workflowArguments, { requireApply: false }), dependencies);
  }
  if (workflowId === "issue.delete.handoff.apply") {
    return runDeleteApply(parseDeleteApplyArgs(workflowArguments), dependencies);
  }
  throw new BacklogSkillRunnerError("UNKNOWN_WORKFLOW", `Unknown workflow: ${workflowId}`);
}

function renderWorkflowList() {
  return `${WORKFLOW_MANIFEST.map((workflow) => (
    `${workflow.id}\t${workflow.mutationLevel}\t${workflow.approvalGate}`
  )).join("\n")}\n`;
}

function renderHelp() {
  return [
    "backlog-api-skill-run.mjs",
    "",
    "Usage:",
    "  node <skill-root>/scripts/backlog-api-skill-run.mjs --format human issue.delete.preflight --issue-key PROJ-123 [--organization NAME]",
    "  node <skill-root>/scripts/backlog-api-skill-run.mjs --format human issue.delete.handoff.apply --apply",
    "",
    "The parent Node process supplies Backlog credentials through its environment."
  ].join("\n") + "\n";
}

function safeErrorPayload(error, workflow) {
  const code = error instanceof BacklogSkillRunnerError ? error.code : "INTERNAL_ERROR";
  return {
    schemaVersion: RUNNER_SCHEMA_VERSION,
    workflow: workflow ?? null,
    status: "not-applied",
    mutationInvoked: false,
    error: { code }
  };
}

function renderHumanError(error) {
  const code = error instanceof BacklogSkillRunnerError ? error.code : "INTERNAL_ERROR";
  const messages = {
    READ_PERMISSION_NOT_ENABLED: "READ が BACKLOG_API_ALLOWED_PERMISSIONS に含まれていません。",
    DELETE_PERMISSION_NOT_ENABLED: "DELETE が BACKLOG_API_ALLOWED_PERMISSIONS に含まれていません。",
    PENDING_HANDOFF_NOT_FOUND: "承認待ちの削除確認が見つかりません。もう一度確認してください。",
    AMBIGUOUS_PENDING_HANDOFF: "承認待ちの削除確認が複数あります。処理を中止しました。",
    HANDOFF_APPLY_IN_PROGRESS: "この削除確認はすでに適用処理中です。重複実行を中止しました。",
    RUNTIME_IDENTITY_CHANGED: "確認後に同梱ランタイムが変わったため、削除を中止しました。",
    BACKLOG_CALL_FAILED: "Backlogで対象を処理できませんでした。削除は完了扱いにしていません。"
  };
  return messages[code] ?? `削除処理を実行できませんでした（${code}）。`;
}

async function main() {
  const { format, workflowId, workflowArguments } = parseRunnerCliArgs(process.argv.slice(2));
  if (workflowId === "--version") {
    if (workflowArguments.length > 0) {
      throw new BacklogSkillRunnerError("UNEXPECTED_ARGUMENT", "--version accepts no arguments");
    }
    process.stdout.write(`${PRODUCT_VERSION}\n`);
    return;
  }
  if (workflowId === "--help" || workflowId === "help") {
    process.stdout.write(renderHelp());
    return;
  }
  if (workflowId === "--list-workflows") {
    if (workflowArguments.length > 0) {
      throw new BacklogSkillRunnerError("UNEXPECTED_ARGUMENT", "--list-workflows accepts no arguments");
    }
    process.stdout.write(format === "human"
      ? renderWorkflowList()
      : `${JSON.stringify({ schemaVersion: RUNNER_SCHEMA_VERSION, workflows: WORKFLOW_MANIFEST }, null, 2)}\n`);
    return;
  }
  try {
    const result = runWorkflow(workflowId, workflowArguments);
    process.stdout.write(format === "human" ? `${result.humanOutput}\n` : `${JSON.stringify(result, null, 2)}\n`);
  } catch (error) {
    const payload = safeErrorPayload(error, workflowId);
    process.stdout.write(format === "human" ? `${renderHumanError(error)}\n` : `${JSON.stringify(payload, null, 2)}\n`);
    process.exitCode = 1;
  }
}

function isDirectExecution() {
  if (!process.argv[1]) return false;
  try {
    return fileURLToPath(import.meta.url) === realpathSync(path.resolve(process.argv[1]));
  } catch {
    return false;
  }
}

if (isDirectExecution()) {
  main().catch((error) => {
    process.stderr.write(`${renderHumanError(error)}\n`);
    process.exitCode = 1;
  });
}
