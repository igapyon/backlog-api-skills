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
export const CONTEXT_SCHEMA_VERSION = "backlog-api-skills.session-context/v1";
export const RECENT_ISSUE_HISTORY_SCHEMA_VERSION = "backlog-api-skills.recent-issue-history/v1";
export const SAVED_ISSUE_RESULT_SCHEMA_VERSION = "backlog-api-skills.saved-issue-result/v1";
export const XLSX_EXPORT_HANDOFF_SCHEMA_VERSION = "backlog-api-skills.issue-xlsx-export-handoff/v1";
export const ISSUE_CREATE_HANDOFF_SCHEMA_VERSION = "backlog-api-skills.issue-create-handoff/v1";
export const ISSUE_UPDATE_HANDOFF_SCHEMA_VERSION = "backlog-api-skills.issue-update-handoff/v1";
export const PRODUCT_VERSION = "0.7.5";

const SCRIPT_DIRECTORY = path.dirname(fileURLToPath(import.meta.url));
const SKILL_ROOT = path.resolve(SCRIPT_DIRECTORY, "..");
const HANDOFF_DIRECTORY = path.join("workplace", "backlog-api-skill", "delete-handoffs");
const CONTEXT_DIRECTORY = path.join("workplace", "backlog-api-skill", "session-contexts");
const RECENT_ISSUE_DIRECTORY = path.join("workplace", "backlog-api-skill", "recent-issues");
const SAVED_ISSUE_DIRECTORY = path.join("workplace", "backlog-api-skill", "saved-issues");
const XLSX_EXPORT_HANDOFF_DIRECTORY = path.join("workplace", "backlog-api-skill", "xlsx-export-handoffs");
const XLSX_EXPORT_DIRECTORY = path.join("workplace", "backlog-api-skill", "issue-exports");
const ISSUE_CREATE_HANDOFF_DIRECTORY = path.join("workplace", "backlog-api-skill", "issue-create-handoffs");
const ISSUE_UPDATE_HANDOFF_DIRECTORY = path.join("workplace", "backlog-api-skill", "issue-update-handoffs");
const HANDOFF_ID = /^[a-z0-9-]{36}$/i;
const CONTEXT_SESSION_ID = /^[A-Za-z0-9][A-Za-z0-9_-]{0,63}$/;
const ORGANIZATION_NAME = /^[A-Za-z0-9][A-Za-z0-9_-]{0,63}$/;
const ISSUE_KEY = /^\S{1,100}$/;
const PERMISSIONS = new Set(["READ", "CREATE", "UPDATE", "DELETE"]);
const CLOSED_STATUS_ID = 4;
const ISSUE_PAGE_SIZE = 100;
const ISSUE_SEARCH_FIELDS = "{ issueKey summary status { id name } created updated }";
const ISSUE_HYGIENE_FIELDS = "{ issueKey summary status { id name } dueDate parentIssueId updated }";
const NOTIFICATION_TRIAGE_FIELDS = "{ id alreadyRead reason resourceAlreadyRead created issue { issueKey } }";
const SEARCH_SORT_FIELDS = new Set(["created", "updated"]);
const SEARCH_ORDER_FIELDS = new Set(["asc", "desc"]);
const MAX_RELATIVE_DAYS = 3660;
const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;
const RECENT_ISSUE_LIMIT = 10;
const NOTIFICATION_TRIAGE_LIMIT = 100;
const XLSX_EXPORT_COLUMNS = ["Organization", "Project", "Issue key", "Status", "Summary", "Created", "Updated"];
const MIKU_MD2XLSX_RUNTIME_FILE = /^miku-md2xlsx-\d+\.\d+\.\d+\.mjs$/;
const ISSUE_UPDATE_FIELDS = "{ id projectId issueKey summary description dueDate priority { id name } assignee { id name } updated }";

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

function writeTextAtomic(filePath, value) {
  const temporaryPath = `${filePath}.tmp-${process.pid}-${randomUUID()}`;
  writeFileSync(temporaryPath, value, { encoding: "utf8", mode: 0o600 });
  renameSync(temporaryPath, filePath);
  chmodSync(filePath, 0o600);
}

function handoffDirectory(cwd, artifactRoot) {
  return path.resolve(artifactRoot ?? path.join(cwd, HANDOFF_DIRECTORY));
}

function contextDirectory(cwd, contextRoot) {
  return path.resolve(contextRoot ?? path.join(cwd, CONTEXT_DIRECTORY));
}

function recentIssueDirectory(cwd, recentIssueRoot) {
  return path.resolve(recentIssueRoot ?? path.join(cwd, RECENT_ISSUE_DIRECTORY));
}

function savedIssueDirectory(cwd, savedIssueRoot) {
  return path.resolve(savedIssueRoot ?? path.join(cwd, SAVED_ISSUE_DIRECTORY));
}

function xlsxExportHandoffDirectory(cwd, xlsxExportHandoffRoot) {
  return path.resolve(xlsxExportHandoffRoot ?? path.join(cwd, XLSX_EXPORT_HANDOFF_DIRECTORY));
}

function xlsxExportDirectory(cwd, xlsxExportRoot) {
  return path.resolve(xlsxExportRoot ?? path.join(cwd, XLSX_EXPORT_DIRECTORY));
}

function issueCreateHandoffDirectory(cwd, issueCreateHandoffRoot) {
  return path.resolve(issueCreateHandoffRoot ?? path.join(cwd, ISSUE_CREATE_HANDOFF_DIRECTORY));
}

function issueUpdateHandoffDirectory(cwd, issueUpdateHandoffRoot) {
  return path.resolve(issueUpdateHandoffRoot ?? path.join(cwd, ISSUE_UPDATE_HANDOFF_DIRECTORY));
}

function ensureHandoffDirectory(directory) {
  mkdirSync(directory, { recursive: true, mode: 0o700 });
  chmodSync(directory, 0o700);
}

function ensureContextDirectory(directory) {
  mkdirSync(directory, { recursive: true, mode: 0o700 });
  chmodSync(directory, 0o700);
}

function ensureRecentIssueDirectory(directory) {
  mkdirSync(directory, { recursive: true, mode: 0o700 });
  chmodSync(directory, 0o700);
}

function ensureSavedIssueDirectory(directory) {
  mkdirSync(directory, { recursive: true, mode: 0o700 });
  chmodSync(directory, 0o700);
}

function ensureXlsxExportDirectory(directory) {
  mkdirSync(directory, { recursive: true, mode: 0o700 });
  chmodSync(directory, 0o700);
}

function parseContextSessionId(value) {
  if (!CONTEXT_SESSION_ID.test(value)) {
    throw new BacklogSkillRunnerError("INVALID_CONTEXT_SESSION", "Invalid context session ID");
  }
  return value;
}

function contextFilePath(directory, session) {
  return path.join(directory, `${parseContextSessionId(session)}.json`);
}

function validateContext(context, expectedSession) {
  if (!isRecord(context)
    || context.schemaVersion !== CONTEXT_SCHEMA_VERSION
    || context.session !== expectedSession
    || (context.organization !== null && !ORGANIZATION_NAME.test(context.organization))
    || !isRecord(context.project)
    || !Number.isSafeInteger(context.project.id)
    || context.project.id <= 0
    || typeof context.project.key !== "string"
    || !context.project.key
    || typeof context.project.name !== "string"
    || !context.project.name
    || typeof context.updatedAt !== "string") {
    throw new BacklogSkillRunnerError("INVALID_CONTEXT", "Session context is invalid");
  }
  return context;
}

function readContext({ cwd, contextRoot, session }) {
  const directory = contextDirectory(cwd, contextRoot);
  const filePath = contextFilePath(directory, session);
  if (!existsSync(filePath)) {
    throw new BacklogSkillRunnerError("CONTEXT_NOT_FOUND", "Session context was not found");
  }
  let context;
  try {
    context = JSON.parse(readFileSync(filePath, "utf8"));
  } catch {
    throw new BacklogSkillRunnerError("INVALID_CONTEXT", "Session context cannot be read");
  }
  return { context: validateContext(context, session), filePath };
}

function writeContext({ cwd, contextRoot, context }) {
  const directory = contextDirectory(cwd, contextRoot);
  ensureContextDirectory(directory);
  const filePath = contextFilePath(directory, context.session);
  writeJsonAtomic(filePath, context);
  return filePath;
}

function recentIssueFilePath(directory, session) {
  return path.join(directory, `${parseContextSessionId(session)}.json`);
}

function validateRecentIssueEntry(entry) {
  if (!isRecord(entry)
    || (entry.organization !== null && !ORGANIZATION_NAME.test(entry.organization))
    || !isRecord(entry.project)
    || !Number.isSafeInteger(entry.project.id)
    || entry.project.id <= 0
    || typeof entry.project.key !== "string"
    || !entry.project.key
    || typeof entry.project.name !== "string"
    || !entry.project.name
    || !isRecord(entry.issue)
    || !Number.isSafeInteger(entry.issue.id)
    || entry.issue.id <= 0
    || typeof entry.issue.key !== "string"
    || !ISSUE_KEY.test(entry.issue.key)
    || typeof entry.recordedAt !== "string") {
    throw new BacklogSkillRunnerError("INVALID_RECENT_ISSUE_HISTORY", "Recent Issue history is invalid");
  }
  return entry;
}

function validateRecentIssueHistory(history, expectedSession) {
  if (!isRecord(history)
    || history.schemaVersion !== RECENT_ISSUE_HISTORY_SCHEMA_VERSION
    || history.session !== expectedSession
    || !Array.isArray(history.entries)
    || history.entries.length > RECENT_ISSUE_LIMIT) {
    throw new BacklogSkillRunnerError("INVALID_RECENT_ISSUE_HISTORY", "Recent Issue history is invalid");
  }
  history.entries.forEach(validateRecentIssueEntry);
  return history;
}

function readRecentIssueHistory({ cwd, recentIssueRoot, session }) {
  const directory = recentIssueDirectory(cwd, recentIssueRoot);
  const filePath = recentIssueFilePath(directory, session);
  if (!existsSync(filePath)) {
    throw new BacklogSkillRunnerError("RECENT_ISSUE_HISTORY_NOT_FOUND", "Recent Issue history was not found");
  }
  let history;
  try {
    history = JSON.parse(readFileSync(filePath, "utf8"));
  } catch {
    throw new BacklogSkillRunnerError("INVALID_RECENT_ISSUE_HISTORY", "Recent Issue history cannot be read");
  }
  return { history: validateRecentIssueHistory(history, session), filePath };
}

function writeRecentIssueHistory({ cwd, recentIssueRoot, history }) {
  const directory = recentIssueDirectory(cwd, recentIssueRoot);
  ensureRecentIssueDirectory(directory);
  const filePath = recentIssueFilePath(directory, history.session);
  writeJsonAtomic(filePath, history);
  return filePath;
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

function requireReadPermission(environment) {
  if (!parsePermissionSet(environment).has("READ")) {
    throw new BacklogSkillRunnerError("READ_PERMISSION_NOT_ENABLED", "READ permission is not enabled");
  }
}

function requireApplyPermissions(environment) {
  const permissions = parsePermissionSet(environment);
  if (!permissions.has("DELETE")) {
    throw new BacklogSkillRunnerError("DELETE_PERMISSION_NOT_ENABLED", "DELETE permission is not enabled");
  }
}

function requireCreatePreflightPermissions(environment) {
  const permissions = parsePermissionSet(environment);
  if (!permissions.has("READ")) {
    throw new BacklogSkillRunnerError("READ_PERMISSION_NOT_ENABLED", "READ permission is not enabled");
  }
  if (!permissions.has("CREATE")) {
    throw new BacklogSkillRunnerError("CREATE_PERMISSION_NOT_ENABLED", "CREATE permission is not enabled");
  }
}

function requireCreateApplyPermissions(environment) {
  if (!parsePermissionSet(environment).has("CREATE")) {
    throw new BacklogSkillRunnerError("CREATE_PERMISSION_NOT_ENABLED", "CREATE permission is not enabled");
  }
}

function requireUpdatePreflightPermissions(environment) {
  const permissions = parsePermissionSet(environment);
  if (!permissions.has("READ")) {
    throw new BacklogSkillRunnerError("READ_PERMISSION_NOT_ENABLED", "READ permission is not enabled");
  }
  if (!permissions.has("UPDATE")) {
    throw new BacklogSkillRunnerError("UPDATE_PERMISSION_NOT_ENABLED", "UPDATE permission is not enabled");
  }
}

function requireUpdateApplyPermissions(environment) {
  const permissions = parsePermissionSet(environment);
  if (!permissions.has("READ")) {
    throw new BacklogSkillRunnerError("READ_PERMISSION_NOT_ENABLED", "READ permission is not enabled");
  }
  if (!permissions.has("UPDATE")) {
    throw new BacklogSkillRunnerError("UPDATE_PERMISSION_NOT_ENABLED", "UPDATE permission is not enabled");
  }
}

function parseIssueTarget(argumentsList, { requireApply }) {
  const options = {
    issueKey: undefined,
    issueId: undefined,
    organization: undefined,
    contextSession: undefined,
    recentIssueSession: undefined,
    apply: false
  };
  const knownFlags = new Set([
    "--issue-key", "--issue-id", "--organization", "--context-session", "--recent-issue-session", "--apply"
  ]);

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
    } else if (flag === "--context-session") {
      if (options.contextSession !== undefined) {
        throw new BacklogSkillRunnerError("DUPLICATE_OPTION", "Duplicate --context-session");
      }
      options.contextSession = parseContextSessionId(value);
    } else if (flag === "--recent-issue-session") {
      if (options.recentIssueSession !== undefined) {
        throw new BacklogSkillRunnerError("DUPLICATE_OPTION", "Duplicate --recent-issue-session");
      }
      options.recentIssueSession = parseContextSessionId(value);
    }
  }

  if (options.recentIssueSession !== undefined
    && (options.issueKey !== undefined || options.issueId !== undefined || options.contextSession !== undefined || options.organization !== undefined)) {
    throw new BacklogSkillRunnerError(
      "RECENT_ISSUE_ARGUMENT_CONFLICT",
      "A recent Issue session cannot be combined with an Issue target, organization, or context session"
    );
  }
  if (options.recentIssueSession === undefined && (options.issueKey === undefined) === (options.issueId === undefined)) {
    throw new BacklogSkillRunnerError(
      "ISSUE_TARGET_REQUIRED",
      "Specify exactly one of --issue-key, --issue-id, or --recent-issue-session"
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

function parseContextListArgs(argumentsList) {
  if (argumentsList.length !== 0) {
    throw new BacklogSkillRunnerError("UNKNOWN_OPTION", `Unknown option: ${argumentsList[0]}`);
  }
  return {};
}

function parseContextSessionArgs(argumentsList, { requirePersist = false } = {}) {
  const options = { session: undefined, persist: false };
  for (let index = 0; index < argumentsList.length; index += 1) {
    const flag = argumentsList[index];
    if (flag === "--persist") {
      if (options.persist) throw new BacklogSkillRunnerError("DUPLICATE_OPTION", "Duplicate --persist");
      options.persist = true;
      continue;
    }
    if (flag !== "--session") {
      throw new BacklogSkillRunnerError("UNKNOWN_OPTION", `Unknown option: ${flag}`);
    }
    if (options.session !== undefined) {
      throw new BacklogSkillRunnerError("DUPLICATE_OPTION", "Duplicate --session");
    }
    const value = argumentsList[index + 1];
    if (value === undefined || value.startsWith("--")) {
      throw new BacklogSkillRunnerError("MISSING_OPTION_VALUE", "Missing value for --session");
    }
    index += 1;
    options.session = parseContextSessionId(value);
  }
  if (options.session === undefined) {
    throw new BacklogSkillRunnerError("CONTEXT_SESSION_REQUIRED", "--session is required");
  }
  if (requirePersist !== options.persist) {
    throw new BacklogSkillRunnerError(
      requirePersist ? "CONTEXT_PERSIST_PERMISSION_REQUIRED" : "UNEXPECTED_PERSIST",
      requirePersist ? "--persist is required to store a session context" : "--persist is not accepted"
    );
  }
  return options;
}

function parseContextSelectArgs(argumentsList) {
  const options = { session: undefined, organization: undefined, project: undefined, persist: false };
  for (let index = 0; index < argumentsList.length; index += 1) {
    const flag = argumentsList[index];
    if (flag === "--persist") {
      if (options.persist) throw new BacklogSkillRunnerError("DUPLICATE_OPTION", "Duplicate --persist");
      options.persist = true;
      continue;
    }
    const property = flag === "--session"
      ? "session"
      : flag === "--organization" ? "organization" : flag === "--project" ? "project" : undefined;
    if (property === undefined) {
      throw new BacklogSkillRunnerError("UNKNOWN_OPTION", `Unknown option: ${flag}`);
    }
    if (options[property] !== undefined) {
      throw new BacklogSkillRunnerError("DUPLICATE_OPTION", `Duplicate ${flag}`);
    }
    const value = argumentsList[index + 1];
    if (value === undefined || value.startsWith("--")) {
      throw new BacklogSkillRunnerError("MISSING_OPTION_VALUE", `Missing value for ${flag}`);
    }
    index += 1;
    if (property === "session") options.session = parseContextSessionId(value);
    else if (property === "organization") {
      if (!ORGANIZATION_NAME.test(value)) {
        throw new BacklogSkillRunnerError("INVALID_ORGANIZATION", "Invalid organization name");
      }
      options.organization = value;
    } else options.project = parseIdOrName(value, flag);
  }
  if (options.session === undefined) {
    throw new BacklogSkillRunnerError("CONTEXT_SESSION_REQUIRED", "--session is required");
  }
  if (options.project === undefined) {
    throw new BacklogSkillRunnerError("PROJECT_REQUIRED", "--project is required");
  }
  if (!options.persist) {
    throw new BacklogSkillRunnerError(
      "CONTEXT_PERSIST_PERMISSION_REQUIRED",
      "--persist is required to store a session context"
    );
  }
  return options;
}

function parseRecentIssueRecordArgs(argumentsList) {
  const options = {
    session: undefined,
    issueKey: undefined,
    issueId: undefined,
    organization: undefined,
    persist: false
  };
  for (let index = 0; index < argumentsList.length; index += 1) {
    const flag = argumentsList[index];
    if (flag === "--persist") {
      if (options.persist) throw new BacklogSkillRunnerError("DUPLICATE_OPTION", "Duplicate --persist");
      options.persist = true;
      continue;
    }
    const property = flag === "--session"
      ? "session"
      : flag === "--issue-key" ? "issueKey" : flag === "--issue-id" ? "issueId"
        : flag === "--organization" ? "organization" : undefined;
    if (property === undefined) {
      throw new BacklogSkillRunnerError("UNKNOWN_OPTION", `Unknown option: ${flag}`);
    }
    if (options[property] !== undefined) {
      throw new BacklogSkillRunnerError("DUPLICATE_OPTION", `Duplicate ${flag}`);
    }
    const value = argumentsList[index + 1];
    if (value === undefined || value.startsWith("--")) {
      throw new BacklogSkillRunnerError("MISSING_OPTION_VALUE", `Missing value for ${flag}`);
    }
    index += 1;
    if (property === "session") options.session = parseContextSessionId(value);
    else if (property === "issueKey") {
      if (!ISSUE_KEY.test(value)) {
        throw new BacklogSkillRunnerError("INVALID_ISSUE_KEY", "Invalid issue key");
      }
      options.issueKey = value;
    } else if (property === "issueId") {
      if (!/^[1-9]\d*$/.test(value) || !Number.isSafeInteger(Number(value))) {
        throw new BacklogSkillRunnerError("INVALID_ISSUE_ID", "Invalid issue ID");
      }
      options.issueId = Number(value);
    } else if (property === "organization") {
      if (!ORGANIZATION_NAME.test(value)) {
        throw new BacklogSkillRunnerError("INVALID_ORGANIZATION", "Invalid organization name");
      }
      options.organization = value;
    }
  }
  if (options.session === undefined) {
    throw new BacklogSkillRunnerError("CONTEXT_SESSION_REQUIRED", "--session is required");
  }
  if ((options.issueKey === undefined) === (options.issueId === undefined)) {
    throw new BacklogSkillRunnerError("ISSUE_TARGET_REQUIRED", "Specify exactly one of --issue-key or --issue-id");
  }
  if (!options.persist) {
    throw new BacklogSkillRunnerError(
      "RECENT_ISSUE_PERSIST_PERMISSION_REQUIRED",
      "--persist is required to store recent Issue history"
    );
  }
  return options;
}

function parseIncompleteIssueListArgs(argumentsList) {
  const options = { organization: undefined, project: undefined, contextSession: undefined };
  for (let index = 0; index < argumentsList.length; index += 1) {
    const flag = argumentsList[index];
    if (flag !== "--organization" && flag !== "--project" && flag !== "--context-session") {
      throw new BacklogSkillRunnerError("UNKNOWN_OPTION", `Unknown option: ${flag}`);
    }
    const optionName = flag === "--organization"
      ? "organization"
      : flag === "--project" ? "project" : "contextSession";
    if (options[optionName] !== undefined) {
      throw new BacklogSkillRunnerError("DUPLICATE_OPTION", `Duplicate ${flag}`);
    }
    const value = argumentsList[index + 1];
    if (value === undefined || value.startsWith("--")) {
      throw new BacklogSkillRunnerError("MISSING_OPTION_VALUE", `Missing value for ${flag}`);
    }
    index += 1;
    if (flag === "--organization" && !ORGANIZATION_NAME.test(value)) {
      throw new BacklogSkillRunnerError("INVALID_ORGANIZATION", "Invalid organization name");
    }
    options[optionName] = flag === "--project"
      ? parseIdOrName(value, flag)
      : flag === "--context-session" ? parseContextSessionId(value) : value;
  }
  if (options.project === undefined && options.contextSession === undefined) {
    throw new BacklogSkillRunnerError("PROJECT_REQUIRED", "--project is required");
  }
  return createIssueSearchOptions({ ...options, incomplete: true });
}

function createIssueSearchOptions(overrides = {}) {
  return {
    organization: undefined,
    project: undefined,
    contextSession: undefined,
    incomplete: false,
    keyword: undefined,
    assignees: [],
    priorities: [],
    milestones: [],
    categories: [],
    versions: [],
    resolutions: [],
    dueFrom: undefined,
    dueTo: undefined,
    createdWithinDays: undefined,
    updatedWithinDays: undefined,
    sort: "updated",
    order: "desc",
    ...overrides
  };
}

function parseIdOrName(value, optionName) {
  const normalized = value.trim();
  if (!normalized) {
    throw new BacklogSkillRunnerError("INVALID_OPTION_VALUE", `Invalid value for ${optionName}`);
  }
  if (/^[1-9]\d*$/.test(normalized)) {
    const id = Number(normalized);
    if (!Number.isSafeInteger(id)) {
      throw new BacklogSkillRunnerError("INVALID_OPTION_VALUE", `Invalid value for ${optionName}`);
    }
    return id;
  }
  return normalized;
}

function parseIsoDate(value, optionName) {
  if (!ISO_DATE.test(value)) {
    throw new BacklogSkillRunnerError("INVALID_OPTION_VALUE", `Invalid value for ${optionName}`);
  }
  const parsed = new Date(`${value}T00:00:00.000Z`);
  if (Number.isNaN(parsed.getTime()) || parsed.toISOString().slice(0, 10) !== value) {
    throw new BacklogSkillRunnerError("INVALID_OPTION_VALUE", `Invalid value for ${optionName}`);
  }
  return value;
}

function addSearchReference(options, optionName, value, flag) {
  const reference = value === "me" && optionName === "assignees"
    ? "me"
    : parseIdOrName(value, flag);
  if (options[optionName].some((entry) => entry === reference)) {
    throw new BacklogSkillRunnerError("DUPLICATE_OPTION_VALUE", `Duplicate value for ${flag}`);
  }
  options[optionName].push(reference);
}

function parsePositiveInteger(value, optionName) {
  if (!/^[1-9]\d*$/.test(value)
    || !Number.isSafeInteger(Number(value))
    || Number(value) > MAX_RELATIVE_DAYS) {
    throw new BacklogSkillRunnerError("INVALID_OPTION_VALUE", `Invalid value for ${optionName}`);
  }
  return Number(value);
}

function parseIssueSearchArgs(argumentsList) {
  const options = createIssueSearchOptions();
  const seenOptions = new Set();
  const singleValueOptions = new Map([
    ["--organization", "organization"],
    ["--project", "project"],
    ["--context-session", "contextSession"],
    ["--keyword", "keyword"],
    ["--due-from", "dueFrom"],
    ["--due-to", "dueTo"],
    ["--created-within-days", "createdWithinDays"],
    ["--updated-within-days", "updatedWithinDays"],
    ["--sort", "sort"],
    ["--order", "order"]
  ]);
  const repeatableOptions = new Map([
    ["--assignee", "assignees"],
    ["--priority", "priorities"],
    ["--milestone", "milestones"],
    ["--category", "categories"],
    ["--version", "versions"],
    ["--resolution", "resolutions"]
  ]);

  for (let index = 0; index < argumentsList.length; index += 1) {
    const flag = argumentsList[index];
    if (flag === "--incomplete") {
      if (seenOptions.has(flag)) throw new BacklogSkillRunnerError("DUPLICATE_OPTION", "Duplicate --incomplete");
      seenOptions.add(flag);
      options.incomplete = true;
      continue;
    }
    const optionName = singleValueOptions.get(flag) ?? repeatableOptions.get(flag);
    if (optionName === undefined) {
      throw new BacklogSkillRunnerError("UNKNOWN_OPTION", `Unknown option: ${flag}`);
    }
    if (singleValueOptions.has(flag) && seenOptions.has(flag)) {
      throw new BacklogSkillRunnerError("DUPLICATE_OPTION", `Duplicate ${flag}`);
    }
    if (singleValueOptions.has(flag)) seenOptions.add(flag);
    const value = argumentsList[index + 1];
    if (value === undefined || value.startsWith("--")) {
      throw new BacklogSkillRunnerError("MISSING_OPTION_VALUE", `Missing value for ${flag}`);
    }
    index += 1;

    if (repeatableOptions.has(flag)) {
      addSearchReference(options, optionName, value, flag);
    } else if (optionName === "organization") {
      if (!ORGANIZATION_NAME.test(value)) {
        throw new BacklogSkillRunnerError("INVALID_ORGANIZATION", "Invalid organization name");
      }
      options.organization = value;
    } else if (optionName === "project") {
      options.project = parseIdOrName(value, flag);
    } else if (optionName === "contextSession") {
      options.contextSession = parseContextSessionId(value);
    } else if (optionName === "keyword") {
      const keyword = value.trim();
      if (!keyword) throw new BacklogSkillRunnerError("INVALID_OPTION_VALUE", "Invalid value for --keyword");
      options.keyword = keyword;
    } else if (optionName === "dueFrom" || optionName === "dueTo") {
      options[optionName] = parseIsoDate(value, flag);
    } else if (optionName === "createdWithinDays" || optionName === "updatedWithinDays") {
      options[optionName] = parsePositiveInteger(value, flag);
    } else if (optionName === "sort") {
      if (!SEARCH_SORT_FIELDS.has(value)) {
        throw new BacklogSkillRunnerError("INVALID_OPTION_VALUE", "Invalid value for --sort");
      }
      options.sort = value;
    } else if (optionName === "order") {
      if (!SEARCH_ORDER_FIELDS.has(value)) {
        throw new BacklogSkillRunnerError("INVALID_OPTION_VALUE", "Invalid value for --order");
      }
      options.order = value;
    }
  }

  if (options.project === undefined && options.contextSession === undefined) {
    throw new BacklogSkillRunnerError("PROJECT_REQUIRED", "--project is required");
  }
  if (options.dueFrom !== undefined
    && options.dueTo !== undefined
    && options.dueFrom > options.dueTo) {
    throw new BacklogSkillRunnerError("INVALID_DATE_RANGE", "--due-from must not be after --due-to");
  }
  if (!options.incomplete
    && options.keyword === undefined
    && options.assignees.length === 0
    && options.priorities.length === 0
    && options.milestones.length === 0
    && options.categories.length === 0
    && options.versions.length === 0
    && options.resolutions.length === 0
    && options.dueFrom === undefined
    && options.dueTo === undefined
    && options.createdWithinDays === undefined
    && options.updatedWithinDays === undefined) {
    throw new BacklogSkillRunnerError("SEARCH_FILTER_REQUIRED", "At least one issue search filter is required");
  }
  return options;
}

function parseIssueSaveArgs(argumentsList) {
  const searchArguments = [];
  let persist = false;
  for (const argument of argumentsList) {
    if (argument === "--persist") {
      if (persist) throw new BacklogSkillRunnerError("DUPLICATE_OPTION", "Duplicate --persist");
      persist = true;
      continue;
    }
    searchArguments.push(argument);
  }
  if (!persist) {
    throw new BacklogSkillRunnerError(
      "SAVE_PERSIST_PERMISSION_REQUIRED",
      "--persist is required to save retrieved Issue data"
    );
  }
  return parseIssueSearchArgs(searchArguments);
}

function parseIssueXlsxExportPreflightArgs(argumentsList) {
  const searchArguments = [];
  let persist = false;
  let md2xlsxRuntime;
  for (let index = 0; index < argumentsList.length; index += 1) {
    const argument = argumentsList[index];
    if (argument === "--persist") {
      if (persist) throw new BacklogSkillRunnerError("DUPLICATE_OPTION", "Duplicate --persist");
      persist = true;
      continue;
    }
    if (argument === "--md2xlsx-runtime") {
      if (md2xlsxRuntime !== undefined) {
        throw new BacklogSkillRunnerError("DUPLICATE_OPTION", "Duplicate --md2xlsx-runtime");
      }
      const value = argumentsList[index + 1];
      if (value === undefined || value.startsWith("--")) {
        throw new BacklogSkillRunnerError("MISSING_OPTION_VALUE", "Missing value for --md2xlsx-runtime");
      }
      index += 1;
      if (!path.isAbsolute(value) || !MIKU_MD2XLSX_RUNTIME_FILE.test(path.basename(value))) {
        throw new BacklogSkillRunnerError("INVALID_MD2XLSX_RUNTIME", "Invalid miku-md2xlsx runtime path");
      }
      md2xlsxRuntime = value;
      continue;
    }
    searchArguments.push(argument);
  }
  if (!persist) {
    throw new BacklogSkillRunnerError(
      "XLSX_EXPORT_PERSIST_PERMISSION_REQUIRED",
      "--persist is required to prepare an XLSX export"
    );
  }
  if (md2xlsxRuntime === undefined) {
    throw new BacklogSkillRunnerError("MD2XLSX_RUNTIME_REQUIRED", "--md2xlsx-runtime is required");
  }
  return { ...parseIssueSearchArgs(searchArguments), md2xlsxRuntime };
}

function parseIssueCreatePreflightArgs(argumentsList) {
  const options = {
    organization: undefined,
    project: undefined,
    summary: undefined,
    description: undefined,
    issueType: undefined,
    priority: undefined,
    persist: false
  };
  const propertyByFlag = new Map([
    ["--organization", "organization"],
    ["--project", "project"],
    ["--summary", "summary"],
    ["--description", "description"],
    ["--issue-type", "issueType"],
    ["--priority", "priority"]
  ]);
  for (let index = 0; index < argumentsList.length; index += 1) {
    const flag = argumentsList[index];
    if (flag === "--persist") {
      if (options.persist) throw new BacklogSkillRunnerError("DUPLICATE_OPTION", "Duplicate --persist");
      options.persist = true;
      continue;
    }
    const property = propertyByFlag.get(flag);
    if (property === undefined) throw new BacklogSkillRunnerError("UNKNOWN_OPTION", `Unknown option: ${flag}`);
    if (options[property] !== undefined) throw new BacklogSkillRunnerError("DUPLICATE_OPTION", `Duplicate ${flag}`);
    const value = argumentsList[index + 1];
    if (value === undefined || value.startsWith("--")) {
      throw new BacklogSkillRunnerError("MISSING_OPTION_VALUE", `Missing value for ${flag}`);
    }
    index += 1;
    if (property === "organization") {
      if (!ORGANIZATION_NAME.test(value)) {
        throw new BacklogSkillRunnerError("INVALID_ORGANIZATION", "Invalid organization name");
      }
      options.organization = value;
    } else if (property === "project" || property === "issueType" || property === "priority") {
      options[property] = parseIdOrName(value, flag);
    } else {
      const normalized = value.trim();
      if (!normalized) throw new BacklogSkillRunnerError("INVALID_OPTION_VALUE", `Invalid value for ${flag}`);
      options[property] = normalized;
    }
  }
  if (options.project === undefined) throw new BacklogSkillRunnerError("PROJECT_REQUIRED", "--project is required");
  if (options.summary === undefined) throw new BacklogSkillRunnerError("ISSUE_SUMMARY_REQUIRED", "--summary is required");
  if (options.issueType === undefined) throw new BacklogSkillRunnerError("ISSUE_TYPE_REQUIRED", "--issue-type is required");
  if (options.priority === undefined) throw new BacklogSkillRunnerError("ISSUE_PRIORITY_REQUIRED", "--priority is required");
  if (!options.persist) {
    throw new BacklogSkillRunnerError(
      "CREATE_HANDOFF_PERSIST_PERMISSION_REQUIRED",
      "--persist is required to prepare an Issue creation handoff"
    );
  }
  return options;
}

function parseIssueUpdatePreflightArgs(argumentsList) {
  const options = {
    issueKey: undefined,
    issueId: undefined,
    organization: undefined,
    summary: undefined,
    description: undefined,
    dueDate: undefined,
    priority: undefined,
    assignee: undefined,
    persist: false
  };
  const propertyByFlag = new Map([
    ["--issue-key", "issueKey"],
    ["--issue-id", "issueId"],
    ["--organization", "organization"],
    ["--summary", "summary"],
    ["--description", "description"],
    ["--due-date", "dueDate"],
    ["--priority", "priority"],
    ["--assignee", "assignee"]
  ]);
  for (let index = 0; index < argumentsList.length; index += 1) {
    const flag = argumentsList[index];
    if (flag === "--persist") {
      if (options.persist) throw new BacklogSkillRunnerError("DUPLICATE_OPTION", "Duplicate --persist");
      options.persist = true;
      continue;
    }
    const property = propertyByFlag.get(flag);
    if (property === undefined) throw new BacklogSkillRunnerError("UNKNOWN_OPTION", `Unknown option: ${flag}`);
    if (options[property] !== undefined) throw new BacklogSkillRunnerError("DUPLICATE_OPTION", `Duplicate ${flag}`);
    const value = argumentsList[index + 1];
    if (value === undefined || value.startsWith("--")) {
      throw new BacklogSkillRunnerError("MISSING_OPTION_VALUE", `Missing value for ${flag}`);
    }
    index += 1;
    if (property === "issueKey") {
      if (!ISSUE_KEY.test(value)) throw new BacklogSkillRunnerError("INVALID_ISSUE_KEY", "Invalid issue key");
      options.issueKey = value;
    } else if (property === "issueId") {
      if (!/^[1-9]\d*$/.test(value) || !Number.isSafeInteger(Number(value))) {
        throw new BacklogSkillRunnerError("INVALID_ISSUE_ID", "Invalid issue ID");
      }
      options.issueId = Number(value);
    } else if (property === "organization") {
      if (!ORGANIZATION_NAME.test(value)) {
        throw new BacklogSkillRunnerError("INVALID_ORGANIZATION", "Invalid organization name");
      }
      options.organization = value;
    } else if (property === "priority" || property === "assignee") {
      options[property] = parseIdOrName(value, flag);
    } else if (property === "dueDate") {
      options.dueDate = parseIsoDate(value, flag);
    } else {
      const normalized = value.trim();
      if (!normalized) throw new BacklogSkillRunnerError("INVALID_OPTION_VALUE", `Invalid value for ${flag}`);
      options[property] = normalized;
    }
  }
  if ((options.issueKey === undefined) === (options.issueId === undefined)) {
    throw new BacklogSkillRunnerError("ISSUE_TARGET_REQUIRED", "Specify exactly one of --issue-key or --issue-id");
  }
  if (options.summary === undefined
    && options.description === undefined
    && options.dueDate === undefined
    && options.priority === undefined
    && options.assignee === undefined) {
    throw new BacklogSkillRunnerError("ISSUE_UPDATE_REQUIRED", "Specify at least one supported Issue update field");
  }
  if (!options.persist) {
    throw new BacklogSkillRunnerError(
      "UPDATE_HANDOFF_PERSIST_PERMISSION_REQUIRED",
      "--persist is required to prepare an Issue update handoff"
    );
  }
  return options;
}

function parseIssueHygieneArgs(argumentsList) {
  const options = {
    organization: undefined,
    project: undefined,
    contextSession: undefined,
    overdue: false,
    staleDays: undefined,
    withoutParent: false
  };
  const seen = new Set();
  for (let index = 0; index < argumentsList.length; index += 1) {
    const flag = argumentsList[index];
    if (flag === "--overdue" || flag === "--without-parent") {
      if (seen.has(flag)) throw new BacklogSkillRunnerError("DUPLICATE_OPTION", `Duplicate ${flag}`);
      seen.add(flag);
      if (flag === "--overdue") options.overdue = true;
      else options.withoutParent = true;
      continue;
    }
    const optionName = flag === "--organization"
      ? "organization"
      : flag === "--project" ? "project" : flag === "--context-session" ? "contextSession"
        : flag === "--stale-days" ? "staleDays" : undefined;
    if (optionName === undefined) throw new BacklogSkillRunnerError("UNKNOWN_OPTION", `Unknown option: ${flag}`);
    if (seen.has(flag)) throw new BacklogSkillRunnerError("DUPLICATE_OPTION", `Duplicate ${flag}`);
    seen.add(flag);
    const value = argumentsList[index + 1];
    if (value === undefined || value.startsWith("--")) {
      throw new BacklogSkillRunnerError("MISSING_OPTION_VALUE", `Missing value for ${flag}`);
    }
    index += 1;
    if (optionName === "organization") {
      if (!ORGANIZATION_NAME.test(value)) {
        throw new BacklogSkillRunnerError("INVALID_ORGANIZATION", "Invalid organization name");
      }
      options.organization = value;
    } else if (optionName === "project") options.project = parseIdOrName(value, flag);
    else if (optionName === "contextSession") options.contextSession = parseContextSessionId(value);
    else options.staleDays = parsePositiveInteger(value, flag);
  }
  if (options.project === undefined && options.contextSession === undefined) {
    throw new BacklogSkillRunnerError("PROJECT_REQUIRED", "--project is required");
  }
  if (!options.overdue && !options.withoutParent && options.staleDays === undefined) {
    throw new BacklogSkillRunnerError("HYGIENE_FILTER_REQUIRED", "At least one hygiene condition is required");
  }
  return options;
}

function parseNotificationTriageArgs(argumentsList) {
  const options = { organization: undefined, unread: false, limit: 50 };
  const seen = new Set();
  for (let index = 0; index < argumentsList.length; index += 1) {
    const flag = argumentsList[index];
    if (flag === "--unread") {
      if (seen.has(flag)) throw new BacklogSkillRunnerError("DUPLICATE_OPTION", "Duplicate --unread");
      seen.add(flag);
      options.unread = true;
      continue;
    }
    if (flag !== "--organization" && flag !== "--limit") {
      throw new BacklogSkillRunnerError("UNKNOWN_OPTION", `Unknown option: ${flag}`);
    }
    if (seen.has(flag)) throw new BacklogSkillRunnerError("DUPLICATE_OPTION", `Duplicate ${flag}`);
    seen.add(flag);
    const value = argumentsList[index + 1];
    if (value === undefined || value.startsWith("--")) {
      throw new BacklogSkillRunnerError("MISSING_OPTION_VALUE", `Missing value for ${flag}`);
    }
    index += 1;
    if (flag === "--organization") {
      if (!ORGANIZATION_NAME.test(value)) {
        throw new BacklogSkillRunnerError("INVALID_ORGANIZATION", "Invalid organization name");
      }
      options.organization = value;
    } else if (!/^[1-9]\d*$/.test(value) || Number(value) > NOTIFICATION_TRIAGE_LIMIT) {
      throw new BacklogSkillRunnerError("INVALID_OPTION_VALUE", "Invalid value for --limit");
    } else options.limit = Number(value);
  }
  return options;
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
  const source = JSON.parse(readFileSync(path.join(runtimeDirectory, "miku-backlog-api-source.json"), "utf8"));
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

function finalConfirmation(target, context) {
  const project = context === undefined
    ? ""
    : `・プロジェクト ${context.project.key}（${context.project.name}）`;
  const targetSeparator = context === undefined ? " の" : "の";
  return `組織 ${target.organization}${project}${targetSeparator} ${target.issueKey}（「${target.summary}」）を完全に削除します。復元できません。実行しますか？`;
}

function makeResult({ workflow, status, mutationInvoked, handoffPath, target, humanOutput, ...details }) {
  return {
    schemaVersion: RUNNER_SCHEMA_VERSION,
    workflow,
    workflowManifestVersion: WORKFLOW_MANIFEST_VERSION,
    status,
    mutationInvoked,
    ...(handoffPath === undefined ? {} : { handoffPath }),
    ...(target === undefined ? {} : { target }),
    ...details,
    humanOutput
  };
}

function configuredSpaces(environment) {
  const organizations = new Map();
  for (const key of Object.keys(environment)) {
    const match = /^BACKLOG_ORG_(.+)_(DOMAIN|API_KEY)$/.exec(key);
    if (match === null) continue;
    const [, organization, field] = match;
    const configuration = organizations.get(organization) ?? { domain: false, apiKey: false };
    configuration[field === "DOMAIN" ? "domain" : "apiKey"] = Boolean(environment[key]);
    organizations.set(organization, configuration);
  }
  if (organizations.size === 0) {
    return [{ name: "default", configured: Boolean(environment.BACKLOG_DOMAIN && environment.BACKLOG_API_KEY) }];
  }
  return [...organizations.entries()]
    .map(([name, configuration]) => ({ name, configured: configuration.domain && configuration.apiKey }))
    .sort((left, right) => left.name < right.name ? -1 : left.name > right.name ? 1 : 0);
}

function contextSummary(context) {
  return {
    organization: context.organization ?? "default",
    project: { ...context.project }
  };
}

export function runContextList(_options, dependencies = {}) {
  const environment = dependencies.environment ?? process.env;
  const spaces = configuredSpaces(environment);
  const humanOutput = [
    `設定済みのBacklog Space: ${spaces.length}件`,
    ...spaces.map((space) => `${space.name}\t${space.configured ? "接続設定あり" : "接続設定が不完全"}`)
  ].join("\n");
  return makeResult({
    workflow: "context.list",
    status: "success",
    mutationInvoked: false,
    spaces,
    humanOutput
  });
}

export function runContextSelect(options, dependencies = {}) {
  const cwd = path.resolve(dependencies.cwd ?? process.cwd());
  const environment = dependencies.environment ?? process.env;
  requireReadPermission(environment);
  const runtime = dependencies.runtime ?? resolveRuntimeIdentity(dependencies.skillRoot);
  const project = resolveSearchProject(options, runtime, environment, dependencies);
  const context = {
    schemaVersion: CONTEXT_SCHEMA_VERSION,
    session: options.session,
    organization: options.organization ?? null,
    project,
    updatedAt: (dependencies.now?.() ?? new Date()).toISOString()
  };
  const filePath = writeContext({ cwd, contextRoot: dependencies.contextRoot, context });
  const summary = contextSummary(context);
  return makeResult({
    workflow: "context.select",
    status: "success",
    mutationInvoked: false,
    context: summary,
    contextPath: path.relative(cwd, filePath),
    humanOutput: `作業コンテキストを組織 ${summary.organization}・プロジェクト ${summary.project.key}（${summary.project.name}）に切り替えました。`
  });
}

export function runContextShow(options, dependencies = {}) {
  const cwd = path.resolve(dependencies.cwd ?? process.cwd());
  const { context, filePath } = readContext({
    cwd,
    contextRoot: dependencies.contextRoot,
    session: options.session
  });
  const summary = contextSummary(context);
  return makeResult({
    workflow: "context.show",
    status: "success",
    mutationInvoked: false,
    context: summary,
    contextPath: path.relative(cwd, filePath),
    humanOutput: `現在の作業コンテキスト: 組織 ${summary.organization}・プロジェクト ${summary.project.key}（${summary.project.name}）`
  });
}

export function runContextClear(options, dependencies = {}) {
  const cwd = path.resolve(dependencies.cwd ?? process.cwd());
  const { context, filePath } = readContext({
    cwd,
    contextRoot: dependencies.contextRoot,
    session: options.session
  });
  unlinkSync(filePath);
  const summary = contextSummary(context);
  return makeResult({
    workflow: "context.clear",
    status: "success",
    mutationInvoked: false,
    clearedContext: summary,
    humanOutput: `作業コンテキスト（組織 ${summary.organization}・プロジェクト ${summary.project.key}）をクリアしました。`
  });
}

function recentIssueSummary(entry) {
  return {
    organization: entry.organization ?? "default",
    project: { ...entry.project },
    issue: { ...entry.issue },
    recordedAt: entry.recordedAt
  };
}

function recentIssueHistoryEntry(target, project, organization, recordedAt) {
  if (!Number.isSafeInteger(target.projectId) || target.projectId <= 0) {
    throw new BacklogSkillRunnerError("INVALID_RUNTIME_RESULT", "get_issue returned no project ID");
  }
  return {
    organization: organization ?? null,
    project: { ...project },
    issue: { id: target.issueId, key: target.issueKey },
    recordedAt
  };
}

export function runRecentIssueRecord(options, dependencies = {}) {
  const cwd = path.resolve(dependencies.cwd ?? process.cwd());
  const environment = dependencies.environment ?? process.env;
  requireReadPermission(environment);
  const runtime = dependencies.runtime ?? resolveRuntimeIdentity(dependencies.skillRoot);
  const readResult = invokeRuntime(dependencies, {
    runtime,
    operation: "get_issue",
    input: {
      ...targetInput(options),
      fields: "{ id projectId issueKey }"
    },
    callOptions: ["--verbose"],
    environment
  });
  if (!readResult.success) throw runtimeFailure("get_issue", readResult);
  const target = extractIssueTarget(readResult, options);
  if (!Number.isSafeInteger(target.projectId) || target.projectId <= 0) {
    throw new BacklogSkillRunnerError("INVALID_RUNTIME_RESULT", "get_issue returned no project ID");
  }
  const project = resolveSearchProject({
    organization: options.organization,
    project: target.projectId
  }, runtime, environment, dependencies);
  const entry = recentIssueHistoryEntry(
    target,
    project,
    options.organization,
    (dependencies.now?.() ?? new Date()).toISOString()
  );
  let existingEntries = [];
  try {
    existingEntries = readRecentIssueHistory({
      cwd,
      recentIssueRoot: dependencies.recentIssueRoot,
      session: options.session
    }).history.entries;
  } catch (error) {
    if (!(error instanceof BacklogSkillRunnerError) || error.code !== "RECENT_ISSUE_HISTORY_NOT_FOUND") {
      throw error;
    }
  }
  const history = {
    schemaVersion: RECENT_ISSUE_HISTORY_SCHEMA_VERSION,
    session: options.session,
    entries: [
      entry,
      ...existingEntries.filter((candidate) => (
        candidate.organization !== entry.organization
        || candidate.project.id !== entry.project.id
        || candidate.issue.id !== entry.issue.id
      ))
    ].slice(0, RECENT_ISSUE_LIMIT)
  };
  const filePath = writeRecentIssueHistory({
    cwd,
    recentIssueRoot: dependencies.recentIssueRoot,
    history
  });
  const summary = recentIssueSummary(entry);
  return makeResult({
    workflow: "issue.recent.record",
    status: "success",
    mutationInvoked: false,
    recentIssue: summary,
    historyPath: path.relative(cwd, filePath),
    humanOutput: `最近のIssueとして組織 ${summary.organization}・プロジェクト ${summary.project.key}・${summary.issue.key} を記録しました。`
  });
}

export function runRecentIssueList(options, dependencies = {}) {
  const cwd = path.resolve(dependencies.cwd ?? process.cwd());
  const { history, filePath } = readRecentIssueHistory({
    cwd,
    recentIssueRoot: dependencies.recentIssueRoot,
    session: options.session
  });
  const entries = history.entries.map(recentIssueSummary);
  return makeResult({
    workflow: "issue.recent.list",
    status: "success",
    mutationInvoked: false,
    recentIssues: entries,
    historyPath: path.relative(cwd, filePath),
    humanOutput: [
      `最近のIssue: ${entries.length}件`,
      ...entries.map((entry) => (
        `${entry.organization}\t${entry.project.key}\t${entry.issue.key}\t${entry.recordedAt}`
      ))
    ].join("\n")
  });
}

export function runRecentIssueClear(options, dependencies = {}) {
  const cwd = path.resolve(dependencies.cwd ?? process.cwd());
  const { history, filePath } = readRecentIssueHistory({
    cwd,
    recentIssueRoot: dependencies.recentIssueRoot,
    session: options.session
  });
  unlinkSync(filePath);
  return makeResult({
    workflow: "issue.recent.clear",
    status: "success",
    mutationInvoked: false,
    clearedIssueCount: history.entries.length,
    humanOutput: `最近のIssue履歴（${history.entries.length}件）をクリアしました。`
  });
}

function applySessionContext(options, dependencies) {
  if (options.contextSession === undefined) return { options, context: undefined };
  if (options.organization !== undefined || options.project !== undefined) {
    throw new BacklogSkillRunnerError(
      "CONTEXT_ARGUMENT_CONFLICT",
      "A context session cannot be combined with --organization or --project"
    );
  }
  const cwd = path.resolve(dependencies.cwd ?? process.cwd());
  const { context } = readContext({
    cwd,
    contextRoot: dependencies.contextRoot,
    session: options.contextSession
  });
  return {
    options: {
      ...options,
      organization: context.organization ?? undefined,
      project: context.project.key
    },
    context
  };
}

function applyDeleteSessionContext(options, dependencies) {
  if (options.contextSession === undefined) return { options, context: undefined };
  if (options.organization !== undefined) {
    throw new BacklogSkillRunnerError(
      "CONTEXT_ARGUMENT_CONFLICT",
      "A context session cannot be combined with --organization"
    );
  }
  const cwd = path.resolve(dependencies.cwd ?? process.cwd());
  const { context } = readContext({
    cwd,
    contextRoot: dependencies.contextRoot,
    session: options.contextSession
  });
  return {
    options: { ...options, organization: context.organization ?? undefined },
    context
  };
}

function applyRecentIssueSession(options, dependencies) {
  if (options.recentIssueSession === undefined) return { options, recentIssue: undefined };
  const cwd = path.resolve(dependencies.cwd ?? process.cwd());
  const { history } = readRecentIssueHistory({
    cwd,
    recentIssueRoot: dependencies.recentIssueRoot,
    session: options.recentIssueSession
  });
  const entry = history.entries[0];
  if (entry === undefined) {
    throw new BacklogSkillRunnerError("RECENT_ISSUE_HISTORY_EMPTY", "Recent Issue history is empty");
  }
  return {
    options: {
      ...options,
      issueKey: entry.issue.key,
      organization: entry.organization ?? undefined
    },
    recentIssue: entry
  };
}

function extractIssueSearchPage(result) {
  if (!Array.isArray(result.result)) {
    throw new BacklogSkillRunnerError("INVALID_RUNTIME_RESULT", "get_issues returned no issue list");
  }
  return result.result.map((issue) => {
    if (!isRecord(issue)
      || typeof issue.issueKey !== "string"
      || !ISSUE_KEY.test(issue.issueKey)
      || typeof issue.summary !== "string"
      || typeof issue.created !== "string"
      || typeof issue.updated !== "string"
      || !isRecord(issue.status)
      || !Number.isSafeInteger(issue.status.id)
      || issue.status.id <= 0
      || typeof issue.status.name !== "string") {
      throw new BacklogSkillRunnerError("INVALID_RUNTIME_RESULT", "get_issues returned an invalid issue");
    }
    return {
      issueKey: issue.issueKey,
      summary: oneLine(issue.summary),
      status: oneLine(issue.status.name, "unknown"),
      statusId: issue.status.id,
      created: issue.created,
      updated: issue.updated
    };
  });
}

function sortIssueSearchResults(options, left, right) {
  const sortField = options.sort;
  if (left[sortField] !== right[sortField]) {
    const comparison = left[sortField] < right[sortField] ? -1 : 1;
    return options.order === "asc" ? comparison : -comparison;
  }
  return left.issueKey < right.issueKey ? -1 : left.issueKey > right.issueKey ? 1 : 0;
}

function calendarDaysAgo(days, now) {
  const date = new Date(now);
  date.setHours(0, 0, 0, 0);
  date.setDate(date.getDate() - days);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function extractCurrentUserId(result) {
  if (!isRecord(result.result) || !Number.isSafeInteger(result.result.id) || result.result.id <= 0) {
    throw new BacklogSkillRunnerError("INVALID_RUNTIME_RESULT", "get_myself returned an invalid user ID");
  }
  return result.result.id;
}

function organizationInput(options) {
  return options.organization === undefined ? {} : { organization: options.organization };
}

function resolveSearchProject(options, runtime, environment, dependencies) {
  const result = invokeRuntime(dependencies, {
    runtime,
    operation: "get_project",
    input: {
      ...organizationInput(options),
      ...(typeof options.project === "number"
        ? { projectId: options.project }
        : { projectKey: options.project }),
      fields: "{ id projectKey name }"
    },
    callOptions: ["--verbose"],
    environment
  });
  if (!result.success) throw runtimeFailure("get_project", result);
  if (!isRecord(result.result)
    || !Number.isSafeInteger(result.result.id)
    || result.result.id <= 0
    || typeof result.result.projectKey !== "string"
    || !result.result.projectKey
    || typeof result.result.name !== "string"
    || !result.result.name) {
    throw new BacklogSkillRunnerError("INVALID_RUNTIME_RESULT", "get_project returned an invalid project");
  }
  return {
    id: result.result.id,
    key: result.result.projectKey,
    name: oneLine(result.result.name)
  };
}

function resolveCurrentAssignee(options, runtime, environment, dependencies) {
  const result = invokeRuntime(dependencies, {
    runtime,
    operation: "get_myself",
    input: {
      ...organizationInput(options),
      fields: "{ id }"
    },
    callOptions: ["--verbose"],
    environment
  });
  if (!result.success) throw runtimeFailure("get_myself", result);
  return { id: extractCurrentUserId(result), label: "自分" };
}

function fetchSearchCatalog(options, project, runtime, environment, dependencies, operation) {
  const projectOperations = new Set([
    "get_project_users",
    "get_categories",
    "get_version_milestone_list",
    "get_issue_types"
  ]);
  const result = invokeRuntime(dependencies, {
    runtime,
    operation,
    input: {
      ...organizationInput(options),
      ...(projectOperations.has(operation) ? { projectId: project.id } : {}),
      fields: "{ id name }"
    },
    callOptions: ["--verbose"],
    environment
  });
  if (!result.success) throw runtimeFailure(operation, result);
  if (!Array.isArray(result.result)) {
    throw new BacklogSkillRunnerError("INVALID_RUNTIME_RESULT", `${operation} returned no list`);
  }
  return result.result.map((entry) => {
    if (!isRecord(entry)
      || !Number.isSafeInteger(entry.id)
      || entry.id <= 0
      || typeof entry.name !== "string"
      || !entry.name) {
      throw new BacklogSkillRunnerError("INVALID_RUNTIME_RESULT", `${operation} returned an invalid entry`);
    }
    return { id: entry.id, name: entry.name };
  });
}

function resolveCatalogReferences(references, catalog, resourceLabel) {
  const resolved = [];
  for (const reference of references) {
    if (typeof reference === "number") {
      resolved.push({ id: reference, label: `ID ${reference}` });
      continue;
    }
    const matches = catalog.filter((entry) => entry.name === reference);
    if (matches.length === 0) {
      throw new BacklogSkillRunnerError(
        "SEARCH_REFERENCE_NOT_FOUND",
        `${resourceLabel} was not found: ${reference}`
      );
    }
    if (matches.length > 1) {
      throw new BacklogSkillRunnerError(
        "SEARCH_REFERENCE_AMBIGUOUS",
        `${resourceLabel} is ambiguous: ${reference}`
      );
    }
    resolved.push({ id: matches[0].id, label: oneLine(matches[0].name) });
  }
  return deduplicateResolvedEntries(resolved);
}

function deduplicateResolvedEntries(entries) {
  const ids = new Set();
  return entries.filter((entry) => {
    if (ids.has(entry.id)) return false;
    ids.add(entry.id);
    return true;
  });
}

function resolveReferencesWithOperation({
  references,
  options,
  project,
  runtime,
  environment,
  dependencies,
  operation,
  resourceLabel
}) {
  const names = references.filter((reference) => typeof reference === "string");
  const catalog = names.length === 0
    ? []
    : fetchSearchCatalog(options, project, runtime, environment, dependencies, operation);
  return resolveCatalogReferences(references, catalog, resourceLabel);
}

function resolveSearchFilters(options, project, runtime, environment, dependencies) {
  const assignees = [];
  if (options.assignees.includes("me")) {
    assignees.push(resolveCurrentAssignee(options, runtime, environment, dependencies));
  }
  const assigneeReferences = options.assignees.filter((reference) => reference !== "me");
  assignees.push(...resolveReferencesWithOperation({
    references: assigneeReferences,
    options,
    project,
    runtime,
    environment,
    dependencies,
    operation: "get_project_users",
    resourceLabel: "Assignee"
  }));

  const priorities = resolveReferencesWithOperation({
    references: options.priorities,
    options,
    project,
    runtime,
    environment,
    dependencies,
    operation: "get_priorities",
    resourceLabel: "Priority"
  });
  const categories = resolveReferencesWithOperation({
    references: options.categories,
    options,
    project,
    runtime,
    environment,
    dependencies,
    operation: "get_categories",
    resourceLabel: "Category"
  });

  const versionReferences = [...options.versions, ...options.milestones];
  const versionCatalog = versionReferences.some((reference) => typeof reference === "string")
    ? fetchSearchCatalog(
      options,
      project,
      runtime,
      environment,
      dependencies,
      "get_version_milestone_list"
    )
    : [];
  const versions = resolveCatalogReferences(options.versions, versionCatalog, "Version");
  const milestones = resolveCatalogReferences(options.milestones, versionCatalog, "Milestone");
  const resolutions = resolveReferencesWithOperation({
    references: options.resolutions,
    options,
    project,
    runtime,
    environment,
    dependencies,
    operation: "get_resolutions",
    resourceLabel: "Resolution"
  });

  return {
    assignees: deduplicateResolvedEntries(assignees),
    priorities,
    categories,
    versions,
    milestones,
    resolutions
  };
}

function resolvedIds(entries) {
  return entries.map((entry) => entry.id);
}

function issueSearchInput(options, offset, project, filters, now) {
  return {
    ...organizationInput(options),
    projectId: [project.id],
    ...(options.keyword === undefined ? {} : { keyword: options.keyword }),
    ...(filters.assignees.length === 0 ? {} : { assigneeId: resolvedIds(filters.assignees) }),
    ...(filters.priorities.length === 0 ? {} : { priorityId: resolvedIds(filters.priorities) }),
    ...(filters.milestones.length === 0 ? {} : { milestoneId: resolvedIds(filters.milestones) }),
    ...(filters.categories.length === 0 ? {} : { categoryId: resolvedIds(filters.categories) }),
    ...(filters.versions.length === 0 ? {} : { versionId: resolvedIds(filters.versions) }),
    ...(filters.resolutions.length === 0 ? {} : { resolutionId: resolvedIds(filters.resolutions) }),
    ...(options.dueFrom === undefined ? {} : { dueDateSince: options.dueFrom }),
    ...(options.dueTo === undefined ? {} : { dueDateUntil: options.dueTo }),
    ...(options.createdWithinDays === undefined
      ? {}
      : { createdSince: calendarDaysAgo(options.createdWithinDays, now) }),
    ...(options.updatedWithinDays === undefined
      ? {}
      : { updatedSince: calendarDaysAgo(options.updatedWithinDays, now) }),
    fields: ISSUE_SEARCH_FIELDS,
    sort: options.sort,
    order: options.order,
    offset,
    count: ISSUE_PAGE_SIZE
  };
}

function filterLabels(entries) {
  return entries.map((entry) => entry.label).join(" / ");
}

function searchFilterSummary(options, resolvedFilters) {
  const summaries = [];
  if (options.incomplete) summaries.push("完了以外");
  if (options.keyword !== undefined) summaries.push(`キーワード「${oneLine(options.keyword)}」`);
  if (resolvedFilters.assignees.length > 0) summaries.push(`担当: ${filterLabels(resolvedFilters.assignees)}`);
  if (resolvedFilters.priorities.length > 0) summaries.push(`優先度: ${filterLabels(resolvedFilters.priorities)}`);
  if (resolvedFilters.milestones.length > 0) summaries.push(`マイルストーン: ${filterLabels(resolvedFilters.milestones)}`);
  if (resolvedFilters.categories.length > 0) summaries.push(`カテゴリー: ${filterLabels(resolvedFilters.categories)}`);
  if (resolvedFilters.versions.length > 0) summaries.push(`発生バージョン: ${filterLabels(resolvedFilters.versions)}`);
  if (options.dueFrom !== undefined) summaries.push(`期限日: ${options.dueFrom}以降`);
  if (options.dueTo !== undefined) summaries.push(`期限日: ${options.dueTo}以前`);
  if (resolvedFilters.resolutions.length > 0) summaries.push(`完了理由: ${filterLabels(resolvedFilters.resolutions)}`);
  if (options.createdWithinDays !== undefined) summaries.push(`登録: 過去${options.createdWithinDays}日`);
  if (options.updatedWithinDays !== undefined) summaries.push(`更新: 過去${options.updatedWithinDays}日`);
  return summaries.join("、");
}

function issueSearchOutput(options, project, filters, issues, scannedIssueCount, pageCount) {
  const dateLabel = options.sort === "created" ? "登録日時" : "更新日時";
  const direction = options.order === "asc" ? "古い順" : "新しい順";
  const heading = `組織 ${options.organization ?? "default"}・プロジェクト ${project.key}（${project.name}）のIssue検索（${searchFilterSummary(options, filters)}、${dateLabel}${direction}）: ${issues.length}件（${scannedIssueCount}件を${pageCount}ページ取得）`;
  const entries = issues.map((issue) => (
    `${issue.issueKey}\t${issue.status}\t${issue.summary}\t${issue[options.sort]}`
  ));
  return [heading, ...entries].join("\n");
}

export function runIssueSearch(options, dependencies = {}, workflow = "issue.search") {
  const scoped = applySessionContext(options, dependencies);
  const resolvedOptions = scoped.options;
  const environment = dependencies.environment ?? process.env;
  requireReadPermission(environment);
  const runtime = dependencies.runtime ?? resolveRuntimeIdentity(dependencies.skillRoot);
  const now = dependencies.now?.() ?? new Date();
  const project = resolveSearchProject(resolvedOptions, runtime, environment, dependencies);
  const filters = resolveSearchFilters(resolvedOptions, project, runtime, environment, dependencies);
  const issues = [];
  let offset = 0;
  let pageCount = 0;
  let scannedIssueCount = 0;

  while (true) {
    const result = invokeRuntime(dependencies, {
      runtime,
      operation: "get_issues",
      input: issueSearchInput(resolvedOptions, offset, project, filters, now),
      callOptions: ["--verbose"],
      environment
    });
    if (!result.success) throw runtimeFailure("get_issues", result);

    const page = extractIssueSearchPage(result);
    pageCount += 1;
    scannedIssueCount += page.length;
    issues.push(...page.filter((issue) => !resolvedOptions.incomplete || issue.statusId !== CLOSED_STATUS_ID));
    if (page.length < ISSUE_PAGE_SIZE) break;
    offset += page.length;
  }

  const sortedIssues = issues
    .sort((left, right) => sortIssueSearchResults(resolvedOptions, left, right))
    .map(({ statusId: ignoredStatusId, ...issue }) => issue);
  return makeResult({
    workflow,
    status: "success",
    mutationInvoked: false,
    organization: resolvedOptions.organization ?? "default",
    project,
    ...(scoped.context === undefined ? {} : { context: contextSummary(scoped.context) }),
    issueCount: sortedIssues.length,
    scannedIssueCount,
    pageCount,
    issues: sortedIssues,
    humanOutput: issueSearchOutput(
      resolvedOptions,
      project,
      filters,
      sortedIssues,
      scannedIssueCount,
      pageCount
    )
  });
}

export function runIncompleteIssueList(options, dependencies = {}) {
  return runIssueSearch(options, dependencies, "issue.list.incomplete");
}

function timestampForFile(now) {
  return now.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z");
}

export function runIssueSave(options, dependencies = {}) {
  const cwd = path.resolve(dependencies.cwd ?? process.cwd());
  const search = runIssueSearch(options, dependencies, "issue.save");
  const now = dependencies.now?.() ?? new Date();
  const directory = savedIssueDirectory(cwd, dependencies.savedIssueRoot);
  ensureSavedIssueDirectory(directory);
  const filePath = path.join(directory, `issues-${timestampForFile(now)}-${randomUUID()}.json`);
  const saved = {
    schemaVersion: SAVED_ISSUE_RESULT_SCHEMA_VERSION,
    savedAt: now.toISOString(),
    purpose: "issue-search-result",
    organization: search.organization,
    project: search.project,
    issueCount: search.issueCount,
    scannedIssueCount: search.scannedIssueCount,
    pageCount: search.pageCount,
    issues: search.issues
  };
  writeJsonAtomic(filePath, saved);
  const savePath = path.relative(cwd, filePath);
  return {
    ...search,
    savePath,
    savedIssueCount: saved.issues.length,
    humanOutput: `${search.humanOutput}\n保存先: ${savePath}（${saved.issues.length}件、ローカル保存済み）`
  };
}

function resolveMd2xlsxRuntime(runtimePath) {
  if (!existsSync(runtimePath)) {
    throw new BacklogSkillRunnerError("MD2XLSX_RUNTIME_NOT_FOUND", "miku-md2xlsx runtime was not found");
  }
  return {
    path: runtimePath,
    file: path.basename(runtimePath),
    sha256: sha256(readFileSync(runtimePath))
  };
}

function xlsxExportPayload(handoff) {
  const { recordSha256: ignoredRecordSha256, ...payload } = handoff;
  return payload;
}

function withXlsxExportRecordDigest(handoff) {
  const payload = xlsxExportPayload(handoff);
  return { ...payload, recordSha256: sha256(JSON.stringify(payload)) };
}

function validateXlsxExportHandoff(handoff) {
  if (!isRecord(handoff)
    || handoff.schemaVersion !== XLSX_EXPORT_HANDOFF_SCHEMA_VERSION
    || !HANDOFF_ID.test(handoff.id)
    || !["pending", "applying", "applied", "unresolved"].includes(handoff.status)
    || !isRecord(handoff.converter)
    || !path.isAbsolute(handoff.converter.path)
    || !MIKU_MD2XLSX_RUNTIME_FILE.test(handoff.converter.file)
    || typeof handoff.converter.sha256 !== "string"
    || !isRecord(handoff.export)
    || typeof handoff.export.organization !== "string"
    || !isRecord(handoff.export.project)
    || !Number.isSafeInteger(handoff.export.project.id)
    || typeof handoff.export.project.key !== "string"
    || typeof handoff.export.project.name !== "string"
    || !Array.isArray(handoff.export.issues)
    || !isRecord(handoff.output)
    || typeof handoff.output.markdownFile !== "string"
    || typeof handoff.output.xlsxFile !== "string"
    || path.basename(handoff.output.markdownFile) !== handoff.output.markdownFile
    || path.basename(handoff.output.xlsxFile) !== handoff.output.xlsxFile
    || !handoff.output.markdownFile.endsWith(".md")
    || !handoff.output.xlsxFile.endsWith(".xlsx")
    || typeof handoff.recordSha256 !== "string"
    || sha256(JSON.stringify(xlsxExportPayload(handoff))) !== handoff.recordSha256) {
    throw new BacklogSkillRunnerError("INVALID_XLSX_EXPORT_HANDOFF", "XLSX export handoff is invalid");
  }
  return handoff;
}

function writeXlsxExportHandoff(filePath, handoff) {
  const updated = withXlsxExportRecordDigest(handoff);
  writeJsonAtomic(filePath, updated);
  return updated;
}

function matchingPendingXlsxExportHandoffs(directory) {
  if (!existsSync(directory)) return [];
  return readdirSync(directory, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith(".json") && HANDOFF_ID.test(entry.name.slice(0, -5)))
    .map((entry) => {
      const filePath = path.join(directory, entry.name);
      let handoff;
      try {
        handoff = JSON.parse(readFileSync(filePath, "utf8"));
      } catch {
        throw new BacklogSkillRunnerError("INVALID_XLSX_EXPORT_HANDOFF", "XLSX export handoff cannot be read");
      }
      return { filePath, handoff: validateXlsxExportHandoff(handoff) };
    })
    .filter(({ handoff }) => handoff.status === "pending");
}

function escapeMarkdownCell(value) {
  return oneLine(value, "").replace(/\\/g, "\\\\").replace(/\|/g, "\\|");
}

function renderXlsxExportMarkdown(exportPayload) {
  const rows = exportPayload.issues.map((issue) => (
    `| ${[
      exportPayload.organization,
      exportPayload.project.key,
      issue.issueKey,
      issue.status,
      issue.summary,
      issue.created,
      issue.updated
    ].map(escapeMarkdownCell).join(" | ")} |`
  ));
  return [
    "# Backlog Issue Export",
    "",
    `| ${XLSX_EXPORT_COLUMNS.join(" | ")} |`,
    `| ${XLSX_EXPORT_COLUMNS.map(() => "---").join(" | ")} |`,
    ...rows,
    ""
  ].join("\n");
}

function parseXlsxExportApplyArgs(argumentsList) {
  return parseDeleteApplyArgs(argumentsList);
}

export function runIssueXlsxExportPreflight(options, dependencies = {}) {
  const cwd = path.resolve(dependencies.cwd ?? process.cwd());
  const search = runIssueSearch(options, dependencies, "issue.export.xlsx.preflight");
  const converter = resolveMd2xlsxRuntime(options.md2xlsxRuntime);
  const now = dependencies.now?.() ?? new Date();
  const id = dependencies.createXlsxExportId?.() ?? randomUUID();
  if (!HANDOFF_ID.test(id)) {
    throw new BacklogSkillRunnerError("INVALID_XLSX_EXPORT_HANDOFF_ID", "Generated an invalid XLSX export handoff ID");
  }
  const handoffDirectory = xlsxExportHandoffDirectory(cwd, dependencies.xlsxExportHandoffRoot);
  const outputDirectory = xlsxExportDirectory(cwd, dependencies.xlsxExportRoot);
  ensureXlsxExportDirectory(handoffDirectory);
  ensureXlsxExportDirectory(outputDirectory);
  const stamp = timestampForFile(now);
  const output = {
    markdownFile: `issues-${stamp}-${id}.md`,
    xlsxFile: `issues-${stamp}-${id}.xlsx`
  };
  const exportPayload = {
    organization: search.organization,
    project: search.project,
    columns: XLSX_EXPORT_COLUMNS,
    issueCount: search.issueCount,
    issues: search.issues
  };
  const handoffPath = path.join(handoffDirectory, `${id}.json`);
  if (existsSync(handoffPath)) {
    throw new BacklogSkillRunnerError("XLSX_EXPORT_HANDOFF_ALREADY_EXISTS", "XLSX export handoff already exists");
  }
  const handoff = writeXlsxExportHandoff(handoffPath, {
    schemaVersion: XLSX_EXPORT_HANDOFF_SCHEMA_VERSION,
    id,
    status: "pending",
    createdAt: now.toISOString(),
    converter,
    export: exportPayload,
    output
  });
  const xlsxPath = path.relative(cwd, path.join(outputDirectory, output.xlsxFile));
  return makeResult({
    workflow: "issue.export.xlsx.preflight",
    status: "preflight-ok",
    mutationInvoked: false,
    handoffPath: path.relative(cwd, handoffPath),
    organization: exportPayload.organization,
    project: exportPayload.project,
    issueCount: exportPayload.issueCount,
    columns: exportPayload.columns,
    xlsxPath,
    humanOutput: `${search.humanOutput}\nXLSX 出力の確認: ${exportPayload.issueCount}件、列: ${exportPayload.columns.join(" / ")}、保存先: ${xlsxPath}。この内容でローカル XLSX を作成しますか？`
  });
}

export function runIssueXlsxExportApply(_options, dependencies = {}) {
  const cwd = path.resolve(dependencies.cwd ?? process.cwd());
  const handoffDirectory = xlsxExportHandoffDirectory(cwd, dependencies.xlsxExportHandoffRoot);
  const pending = matchingPendingXlsxExportHandoffs(handoffDirectory);
  if (pending.length === 0) {
    throw new BacklogSkillRunnerError("PENDING_XLSX_EXPORT_HANDOFF_NOT_FOUND", "No pending XLSX export handoff exists");
  }
  if (pending.length > 1) {
    throw new BacklogSkillRunnerError("AMBIGUOUS_PENDING_XLSX_EXPORT_HANDOFF", "More than one pending XLSX export handoff exists");
  }
  const { filePath, handoff } = pending[0];
  const converter = resolveMd2xlsxRuntime(handoff.converter.path);
  if (converter.sha256 !== handoff.converter.sha256 || converter.file !== handoff.converter.file) {
    throw new BacklogSkillRunnerError("MD2XLSX_RUNTIME_CHANGED", "miku-md2xlsx runtime changed after export review");
  }
  const outputDirectory = xlsxExportDirectory(cwd, dependencies.xlsxExportRoot);
  ensureXlsxExportDirectory(outputDirectory);
  const markdownPath = path.join(outputDirectory, handoff.output.markdownFile);
  const xlsxPath = path.join(outputDirectory, handoff.output.xlsxFile);
  if (existsSync(markdownPath) || existsSync(xlsxPath)) {
    throw new BacklogSkillRunnerError("XLSX_EXPORT_OUTPUT_ALREADY_EXISTS", "XLSX export output already exists");
  }
  const applying = writeXlsxExportHandoff(filePath, {
    ...handoff,
    status: "applying",
    attemptStartedAt: (dependencies.now?.() ?? new Date()).toISOString()
  });
  writeTextAtomic(markdownPath, renderXlsxExportMarkdown(applying.export));
  const spawn = dependencies.spawnMd2xlsx ?? spawnSync;
  let execution;
  try {
    execution = spawn(process.execPath, [
      converter.path,
      markdownPath,
      "--out",
      xlsxPath,
      "--title",
      applying.export.project.key
    ], { encoding: "utf8", maxBuffer: 1024 * 1024 });
  } catch (error) {
    writeXlsxExportHandoff(filePath, {
      ...applying,
      status: "unresolved",
      finishedAt: (dependencies.now?.() ?? new Date()).toISOString()
    });
    throw error;
  }
  if (execution?.error || execution?.status !== 0 || !existsSync(xlsxPath)) {
    writeXlsxExportHandoff(filePath, {
      ...applying,
      status: "unresolved",
      finishedAt: (dependencies.now?.() ?? new Date()).toISOString()
    });
    throw new BacklogSkillRunnerError("MD2XLSX_CONVERSION_FAILED", "miku-md2xlsx did not produce an XLSX file");
  }
  chmodSync(xlsxPath, 0o600);
  const applied = writeXlsxExportHandoff(filePath, {
    ...applying,
    status: "applied",
    finishedAt: (dependencies.now?.() ?? new Date()).toISOString()
  });
  return makeResult({
    workflow: "issue.export.xlsx.apply",
    status: "success",
    mutationInvoked: false,
    handoffPath: path.relative(cwd, filePath),
    xlsxPath: path.relative(cwd, xlsxPath),
    markdownPath: path.relative(cwd, markdownPath),
    issueCount: applied.export.issueCount,
    columns: applied.export.columns,
    humanOutput: `${applied.export.issueCount}件を XLSX に出力しました: ${path.relative(cwd, xlsxPath)}`
  });
}

function issueCreateHandoffPayload(handoff) {
  const { recordSha256: ignoredRecordSha256, ...payload } = handoff;
  return payload;
}

function withIssueCreateRecordDigest(handoff) {
  const payload = issueCreateHandoffPayload(handoff);
  return { ...payload, recordSha256: sha256(JSON.stringify(payload)) };
}

function writeIssueCreateHandoff(filePath, handoff) {
  const updated = withIssueCreateRecordDigest(handoff);
  writeJsonAtomic(filePath, updated);
  return updated;
}

function validateIssueCreateHandoff(handoff) {
  if (!isRecord(handoff)
    || handoff.schemaVersion !== ISSUE_CREATE_HANDOFF_SCHEMA_VERSION
    || !HANDOFF_ID.test(handoff.id)
    || !["pending", "applying", "applied", "unresolved"].includes(handoff.status)
    || !isRecord(handoff.runtime)
    || typeof handoff.runtime.file !== "string"
    || typeof handoff.runtime.sourceVersion !== "string"
    || typeof handoff.runtime.sha256 !== "string"
    || !isRecord(handoff.review)
    || handoff.review.operation !== "add_issue"
    || !isRecord(handoff.review.project)
    || !Number.isSafeInteger(handoff.review.project.id)
    || typeof handoff.review.project.key !== "string"
    || !isRecord(handoff.review.issueType)
    || !Number.isSafeInteger(handoff.review.issueType.id)
    || typeof handoff.review.issueType.label !== "string"
    || !isRecord(handoff.review.priority)
    || !Number.isSafeInteger(handoff.review.priority.id)
    || typeof handoff.review.priority.label !== "string"
    || !isRecord(handoff.review.input)
    || !Number.isSafeInteger(handoff.review.input.projectId)
    || !Number.isSafeInteger(handoff.review.input.issueTypeId)
    || !Number.isSafeInteger(handoff.review.input.priorityId)
    || typeof handoff.review.input.summary !== "string"
    || typeof handoff.recordSha256 !== "string"
    || sha256(JSON.stringify(issueCreateHandoffPayload(handoff))) !== handoff.recordSha256) {
    throw new BacklogSkillRunnerError("INVALID_ISSUE_CREATE_HANDOFF", "Issue creation handoff is invalid");
  }
  return handoff;
}

function matchingPendingIssueCreateHandoffs(directory) {
  if (!existsSync(directory)) return [];
  return readdirSync(directory, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith(".json") && HANDOFF_ID.test(entry.name.slice(0, -5)))
    .map((entry) => {
      const filePath = path.join(directory, entry.name);
      let handoff;
      try {
        handoff = JSON.parse(readFileSync(filePath, "utf8"));
      } catch {
        throw new BacklogSkillRunnerError("INVALID_ISSUE_CREATE_HANDOFF", "Issue creation handoff cannot be read");
      }
      return { filePath, handoff: validateIssueCreateHandoff(handoff) };
    })
    .filter(({ handoff }) => handoff.status === "pending");
}

function resolveCreateReference(reference, options, project, runtime, environment, dependencies, operation, label) {
  const entries = resolveReferencesWithOperation({
    references: [reference],
    options,
    project,
    runtime,
    environment,
    dependencies,
    operation,
    resourceLabel: label
  });
  return entries[0];
}

export function runIssueCreatePreflight(options, dependencies = {}) {
  const cwd = path.resolve(dependencies.cwd ?? process.cwd());
  const environment = dependencies.environment ?? process.env;
  requireCreatePreflightPermissions(environment);
  const runtime = dependencies.runtime ?? resolveRuntimeIdentity(dependencies.skillRoot);
  const project = resolveSearchProject(options, runtime, environment, dependencies);
  const issueType = resolveCreateReference(
    options.issueType,
    options,
    project,
    runtime,
    environment,
    dependencies,
    "get_issue_types",
    "Issue type"
  );
  const priority = resolveCreateReference(
    options.priority,
    options,
    project,
    runtime,
    environment,
    dependencies,
    "get_priorities",
    "Priority"
  );
  const input = {
    ...organizationInput(options),
    projectId: project.id,
    summary: options.summary,
    issueTypeId: issueType.id,
    priorityId: priority.id,
    ...(options.description === undefined ? {} : { description: options.description }),
    fields: "{ id projectId issueKey summary }"
  };
  const now = dependencies.now?.() ?? new Date();
  const id = dependencies.createIssueCreateId?.() ?? randomUUID();
  if (!HANDOFF_ID.test(id)) {
    throw new BacklogSkillRunnerError("INVALID_ISSUE_CREATE_HANDOFF_ID", "Generated an invalid Issue creation handoff ID");
  }
  const directory = issueCreateHandoffDirectory(cwd, dependencies.issueCreateHandoffRoot);
  ensureHandoffDirectory(directory);
  const filePath = path.join(directory, `${id}.json`);
  if (existsSync(filePath)) {
    throw new BacklogSkillRunnerError("ISSUE_CREATE_HANDOFF_ALREADY_EXISTS", "Issue creation handoff already exists");
  }
  const handoff = writeIssueCreateHandoff(filePath, {
    schemaVersion: ISSUE_CREATE_HANDOFF_SCHEMA_VERSION,
    id,
    status: "pending",
    createdAt: now.toISOString(),
    runtime: {
      file: runtime.file,
      sourceVersion: runtime.sourceVersion,
      sha256: runtime.sha256
    },
    review: {
      operation: "add_issue",
      organization: options.organization ?? "default",
      project,
      issueType,
      priority,
      input
    }
  });
  const description = options.description === undefined ? "（説明なし）" : oneLine(options.description);
  return makeResult({
    workflow: "issue.create.preflight",
    status: "preflight-ok",
    mutationInvoked: false,
    handoffPath: path.relative(cwd, filePath),
    organization: handoff.review.organization,
    project,
    issueType,
    priority,
    summary: oneLine(options.summary),
    humanOutput: `組織 ${handoff.review.organization}・プロジェクト ${project.key} に Issue を作成します。種別: ${issueType.label}、優先度: ${priority.label}、件名: 「${oneLine(options.summary)}」、説明: ${description}。作成しますか？`
  });
}

function extractCreatedIssue(result, review) {
  if (!isRecord(result.result)
    || !Number.isSafeInteger(result.result.id)
    || result.result.projectId !== review.project.id
    || typeof result.result.issueKey !== "string"
    || !ISSUE_KEY.test(result.result.issueKey)
    || typeof result.result.summary !== "string") {
    throw new BacklogSkillRunnerError("INVALID_RUNTIME_RESULT", "add_issue returned an invalid Issue");
  }
  return {
    id: result.result.id,
    issueKey: result.result.issueKey,
    summary: oneLine(result.result.summary)
  };
}

export function runIssueCreateApply(_options, dependencies = {}) {
  const cwd = path.resolve(dependencies.cwd ?? process.cwd());
  const environment = dependencies.environment ?? process.env;
  requireCreateApplyPermissions(environment);
  const directory = issueCreateHandoffDirectory(cwd, dependencies.issueCreateHandoffRoot);
  const pending = matchingPendingIssueCreateHandoffs(directory);
  if (pending.length === 0) {
    throw new BacklogSkillRunnerError("PENDING_ISSUE_CREATE_HANDOFF_NOT_FOUND", "No pending Issue creation handoff exists");
  }
  if (pending.length > 1) {
    throw new BacklogSkillRunnerError("AMBIGUOUS_PENDING_ISSUE_CREATE_HANDOFF", "More than one pending Issue creation handoff exists");
  }
  const { filePath, handoff } = pending[0];
  const runtime = dependencies.runtime ?? resolveRuntimeIdentity(dependencies.skillRoot);
  if (handoff.runtime.sha256 !== runtime.sha256
    || handoff.runtime.file !== runtime.file
    || handoff.runtime.sourceVersion !== runtime.sourceVersion) {
    throw new BacklogSkillRunnerError("RUNTIME_IDENTITY_CHANGED", "Bundled runtime changed after Issue creation review");
  }
  const applying = writeIssueCreateHandoff(filePath, {
    ...handoff,
    status: "applying",
    attemptStartedAt: (dependencies.now?.() ?? new Date()).toISOString()
  });
  let createResult;
  try {
    createResult = invokeRuntime(dependencies, {
      runtime,
      operation: "add_issue",
      input: applying.review.input,
      callOptions: ["--allow", "CREATE", "--verbose"],
      environment
    });
  } catch (error) {
    writeIssueCreateHandoff(filePath, {
      ...applying,
      status: "unresolved",
      finishedAt: (dependencies.now?.() ?? new Date()).toISOString()
    });
    throw error;
  }
  if (!createResult.success) {
    writeIssueCreateHandoff(filePath, {
      ...applying,
      status: "unresolved",
      finishedAt: (dependencies.now?.() ?? new Date()).toISOString()
    });
    throw runtimeFailure("add_issue", createResult);
  }
  const issue = extractCreatedIssue(createResult, applying.review);
  writeIssueCreateHandoff(filePath, {
    ...applying,
    status: "applied",
    createdIssue: issue,
    finishedAt: (dependencies.now?.() ?? new Date()).toISOString()
  });
  return makeResult({
    workflow: "issue.create.apply",
    status: "success",
    mutationInvoked: true,
    handoffPath: path.relative(cwd, filePath),
    organization: applying.review.organization,
    project: applying.review.project,
    issue,
    humanOutput: `${issue.issueKey}（「${issue.summary}」）を作成しました。`
  });
}

function issueUpdateHandoffPayload(handoff) {
  const { recordSha256: ignoredRecordSha256, ...payload } = handoff;
  return payload;
}

function withIssueUpdateRecordDigest(handoff) {
  const payload = issueUpdateHandoffPayload(handoff);
  return { ...payload, recordSha256: sha256(JSON.stringify(payload)) };
}

function writeIssueUpdateHandoff(filePath, handoff) {
  const updated = withIssueUpdateRecordDigest(handoff);
  writeJsonAtomic(filePath, updated);
  return updated;
}

function extractIssueUpdateReference(value, field, { allowNull = false } = {}) {
  if (value === null && allowNull) return null;
  if (!isRecord(value)
    || !Number.isSafeInteger(value.id)
    || value.id <= 0
    || typeof value.name !== "string"
    || !value.name) {
    throw new BacklogSkillRunnerError("INVALID_RUNTIME_RESULT", `get_issue returned an invalid ${field}`);
  }
  return { id: value.id, label: oneLine(value.name) };
}

function extractIssueUpdateSnapshot(result, expectedTarget) {
  if (!isRecord(result.result)) {
    throw new BacklogSkillRunnerError("INVALID_RUNTIME_RESULT", "get_issue returned no Issue object");
  }
  const issue = result.result;
  if (!Number.isSafeInteger(issue.id) || issue.id <= 0
    || !Number.isSafeInteger(issue.projectId) || issue.projectId <= 0
    || typeof issue.issueKey !== "string" || !ISSUE_KEY.test(issue.issueKey)
    || typeof issue.summary !== "string"
    || (issue.description !== null && typeof issue.description !== "string")
    || (issue.dueDate !== null && issue.dueDate !== undefined && !ISO_DATE.test(issue.dueDate))
    || typeof issue.updated !== "string") {
    throw new BacklogSkillRunnerError("INVALID_RUNTIME_RESULT", "get_issue returned an invalid Issue snapshot");
  }
  if (expectedTarget.issueId !== undefined && issue.id !== expectedTarget.issueId) {
    throw new BacklogSkillRunnerError("TARGET_MISMATCH", "Resolved Issue ID differs from the reviewed Issue");
  }
  if (expectedTarget.issueKey !== undefined && issue.issueKey !== expectedTarget.issueKey) {
    throw new BacklogSkillRunnerError("TARGET_MISMATCH", "Resolved Issue key differs from the reviewed Issue");
  }
  if (expectedTarget.projectId !== undefined && issue.projectId !== expectedTarget.projectId) {
    throw new BacklogSkillRunnerError("TARGET_MISMATCH", "Resolved Issue project differs from the reviewed Issue");
  }
  return {
    issueId: issue.id,
    projectId: issue.projectId,
    issueKey: issue.issueKey,
    summary: issue.summary,
    description: issue.description ?? null,
    dueDate: issue.dueDate ?? null,
    priority: extractIssueUpdateReference(issue.priority, "priority"),
    assignee: extractIssueUpdateReference(issue.assignee ?? null, "assignee", { allowNull: true }),
    updated: issue.updated
  };
}

function issueUpdateSnapshotDigest(snapshot) {
  return sha256(JSON.stringify(snapshot));
}

function issueUpdateValueLabel(value) {
  if (value === null) return "（未設定）";
  if (isRecord(value) && typeof value.label === "string") return value.label;
  return oneLine(value);
}

function issueUpdateChanges(snapshot, options, priority, assignee) {
  const changes = [];
  if (options.summary !== undefined) {
    changes.push({ field: "summary", label: "件名", from: snapshot.summary, to: options.summary });
  }
  if (options.description !== undefined) {
    changes.push({ field: "description", label: "説明", from: snapshot.description, to: options.description });
  }
  if (options.dueDate !== undefined) {
    changes.push({ field: "dueDate", label: "期限", from: snapshot.dueDate, to: options.dueDate });
  }
  if (priority !== undefined) {
    changes.push({ field: "priority", label: "優先度", from: snapshot.priority, to: priority });
  }
  if (assignee !== undefined) {
    changes.push({ field: "assignee", label: "担当者", from: snapshot.assignee, to: assignee });
  }
  return changes.filter((change) => !issueUpdateValuesEqual(change.field, change.from, change.to));
}

function issueUpdateValuesEqual(field, left, right) {
  if (field === "priority" || field === "assignee") {
    return left?.id === right?.id;
  }
  return JSON.stringify(left) === JSON.stringify(right);
}

function issueUpdateInput(options, snapshot, priority, assignee) {
  return {
    ...organizationInput(options),
    issueId: snapshot.issueId,
    ...(options.summary === undefined ? {} : { summary: options.summary }),
    ...(options.description === undefined ? {} : { description: options.description }),
    ...(options.dueDate === undefined ? {} : { dueDate: options.dueDate }),
    ...(priority === undefined ? {} : { priorityId: priority.id }),
    ...(assignee === undefined ? {} : { assigneeId: assignee.id }),
    fields: ISSUE_UPDATE_FIELDS
  };
}

function renderIssueUpdateChanges(changes) {
  return changes
    .map((change) => `${change.label}: ${issueUpdateValueLabel(change.from)} → ${issueUpdateValueLabel(change.to)}`)
    .join("、");
}

function validateIssueUpdateHandoff(handoff) {
  if (!isRecord(handoff)
    || handoff.schemaVersion !== ISSUE_UPDATE_HANDOFF_SCHEMA_VERSION
    || !HANDOFF_ID.test(handoff.id)
    || !["pending", "applying", "applied", "conflict", "unresolved"].includes(handoff.status)
    || !isRecord(handoff.runtime)
    || typeof handoff.runtime.file !== "string"
    || typeof handoff.runtime.sourceVersion !== "string"
    || typeof handoff.runtime.sha256 !== "string"
    || !isRecord(handoff.review)
    || handoff.review.operation !== "update_issue"
    || !isRecord(handoff.review.project)
    || !Number.isSafeInteger(handoff.review.project.id)
    || !isRecord(handoff.review.snapshot)
    || !Number.isSafeInteger(handoff.review.snapshot.issueId)
    || !Number.isSafeInteger(handoff.review.snapshot.projectId)
    || typeof handoff.review.snapshot.issueKey !== "string"
    || typeof handoff.review.snapshotSha256 !== "string"
    || issueUpdateSnapshotDigest(handoff.review.snapshot) !== handoff.review.snapshotSha256
    || !Array.isArray(handoff.review.changes)
    || handoff.review.changes.length === 0
    || !isRecord(handoff.review.input)
    || handoff.review.input.issueId !== handoff.review.snapshot.issueId
    || handoff.review.input.fields !== ISSUE_UPDATE_FIELDS
    || typeof handoff.recordSha256 !== "string"
    || sha256(JSON.stringify(issueUpdateHandoffPayload(handoff))) !== handoff.recordSha256) {
    throw new BacklogSkillRunnerError("INVALID_ISSUE_UPDATE_HANDOFF", "Issue update handoff is invalid");
  }
  return handoff;
}

function matchingPendingIssueUpdateHandoffs(directory) {
  if (!existsSync(directory)) return [];
  return readdirSync(directory, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith(".json") && HANDOFF_ID.test(entry.name.slice(0, -5)))
    .map((entry) => {
      const filePath = path.join(directory, entry.name);
      let handoff;
      try {
        handoff = JSON.parse(readFileSync(filePath, "utf8"));
      } catch {
        throw new BacklogSkillRunnerError("INVALID_ISSUE_UPDATE_HANDOFF", "Issue update handoff cannot be read");
      }
      return { filePath, handoff: validateIssueUpdateHandoff(handoff) };
    })
    .filter(({ handoff }) => handoff.status === "pending");
}

function acquireIssueUpdateApplyLock(filePath) {
  const lockPath = `${filePath}.apply.lock`;
  let descriptor;
  try {
    descriptor = openSync(lockPath, "wx", 0o600);
  } catch (error) {
    if (error?.code === "EEXIST") {
      throw new BacklogSkillRunnerError(
        "ISSUE_UPDATE_HANDOFF_APPLY_IN_PROGRESS",
        "Issue update handoff already has an apply attempt"
      );
    }
    throw new BacklogSkillRunnerError("ISSUE_UPDATE_HANDOFF_LOCK_FAILED", "Issue update handoff could not be locked");
  }
  closeSync(descriptor);
  return lockPath;
}

function resolveIssueUpdateReference(reference, options, project, runtime, environment, dependencies, operation, label) {
  return resolveCreateReference(
    reference,
    options,
    project,
    runtime,
    environment,
    dependencies,
    operation,
    label
  );
}

export function runIssueUpdatePreflight(options, dependencies = {}) {
  const cwd = path.resolve(dependencies.cwd ?? process.cwd());
  const environment = dependencies.environment ?? process.env;
  requireUpdatePreflightPermissions(environment);
  const runtime = dependencies.runtime ?? resolveRuntimeIdentity(dependencies.skillRoot);
  const directory = issueUpdateHandoffDirectory(cwd, dependencies.issueUpdateHandoffRoot);
  ensureHandoffDirectory(directory);
  if (matchingPendingIssueUpdateHandoffs(directory).length > 0) {
    throw new BacklogSkillRunnerError(
      "PENDING_ISSUE_UPDATE_HANDOFF_EXISTS",
      "A pending Issue update handoff already exists"
    );
  }
  const readResult = invokeRuntime(dependencies, {
    runtime,
    operation: "get_issue",
    input: { ...targetInput(options), fields: ISSUE_UPDATE_FIELDS },
    callOptions: ["--verbose"],
    environment
  });
  if (!readResult.success) throw runtimeFailure("get_issue", readResult);
  const snapshot = extractIssueUpdateSnapshot(readResult, options);
  const project = resolveSearchProject({
    organization: options.organization,
    project: snapshot.projectId
  }, runtime, environment, dependencies);
  const priority = options.priority === undefined
    ? undefined
    : resolveIssueUpdateReference(
      options.priority,
      options,
      project,
      runtime,
      environment,
      dependencies,
      "get_priorities",
      "Priority"
    );
  const assignee = options.assignee === undefined
    ? undefined
    : resolveIssueUpdateReference(
      options.assignee,
      options,
      project,
      runtime,
      environment,
      dependencies,
      "get_project_users",
      "Assignee"
    );
  const changes = issueUpdateChanges(snapshot, options, priority, assignee);
  if (changes.length === 0) {
    throw new BacklogSkillRunnerError("ISSUE_UPDATE_NO_CHANGE", "Requested Issue values already match the current Issue");
  }
  const id = dependencies.createIssueUpdateId?.() ?? randomUUID();
  if (!HANDOFF_ID.test(id)) {
    throw new BacklogSkillRunnerError("INVALID_ISSUE_UPDATE_HANDOFF_ID", "Generated an invalid Issue update handoff ID");
  }
  const filePath = path.join(directory, `${id}.json`);
  if (existsSync(filePath)) {
    throw new BacklogSkillRunnerError("ISSUE_UPDATE_HANDOFF_ALREADY_EXISTS", "Issue update handoff already exists");
  }
  const handoff = writeIssueUpdateHandoff(filePath, {
    schemaVersion: ISSUE_UPDATE_HANDOFF_SCHEMA_VERSION,
    id,
    status: "pending",
    createdAt: (dependencies.now?.() ?? new Date()).toISOString(),
    runtime: {
      file: runtime.file,
      sourceVersion: runtime.sourceVersion,
      sha256: runtime.sha256
    },
    review: {
      operation: "update_issue",
      organization: options.organization ?? "default",
      project,
      snapshot,
      snapshotSha256: issueUpdateSnapshotDigest(snapshot),
      changes,
      input: issueUpdateInput(options, snapshot, priority, assignee)
    }
  });
  return makeResult({
    workflow: "issue.update.preflight",
    status: "preflight-ok",
    mutationInvoked: false,
    handoffPath: path.relative(cwd, filePath),
    organization: handoff.review.organization,
    project,
    issue: { id: snapshot.issueId, issueKey: snapshot.issueKey, summary: oneLine(snapshot.summary) },
    changes,
    snapshotSha256: handoff.review.snapshotSha256,
    humanOutput: `組織 ${handoff.review.organization}・プロジェクト ${project.key} の ${snapshot.issueKey}（「${oneLine(snapshot.summary)}」）を更新します。${renderIssueUpdateChanges(changes)}。実行しますか？`
  });
}

function extractUpdatedIssue(result, review) {
  const snapshot = extractIssueUpdateSnapshot(result, {
    issueId: review.snapshot.issueId,
    issueKey: review.snapshot.issueKey,
    projectId: review.snapshot.projectId
  });
  for (const change of review.changes) {
    const actual = snapshot[change.field];
    if (!issueUpdateValuesEqual(change.field, actual, change.to)) {
      throw new BacklogSkillRunnerError("INVALID_RUNTIME_RESULT", `update_issue did not return the reviewed ${change.field}`);
    }
  }
  return {
    id: snapshot.issueId,
    issueKey: snapshot.issueKey,
    summary: oneLine(snapshot.summary)
  };
}

export function runIssueUpdateApply(_options, dependencies = {}) {
  const cwd = path.resolve(dependencies.cwd ?? process.cwd());
  const environment = dependencies.environment ?? process.env;
  requireUpdateApplyPermissions(environment);
  const directory = issueUpdateHandoffDirectory(cwd, dependencies.issueUpdateHandoffRoot);
  const pending = matchingPendingIssueUpdateHandoffs(directory);
  if (pending.length === 0) {
    throw new BacklogSkillRunnerError("PENDING_ISSUE_UPDATE_HANDOFF_NOT_FOUND", "No pending Issue update handoff exists");
  }
  if (pending.length > 1) {
    throw new BacklogSkillRunnerError("AMBIGUOUS_PENDING_ISSUE_UPDATE_HANDOFF", "More than one pending Issue update handoff exists");
  }
  const { filePath, handoff } = pending[0];
  const runtime = dependencies.runtime ?? resolveRuntimeIdentity(dependencies.skillRoot);
  if (handoff.runtime.sha256 !== runtime.sha256
    || handoff.runtime.file !== runtime.file
    || handoff.runtime.sourceVersion !== runtime.sourceVersion) {
    throw new BacklogSkillRunnerError("RUNTIME_IDENTITY_CHANGED", "Bundled runtime changed after Issue update review");
  }
  const lockPath = acquireIssueUpdateApplyLock(filePath);
  try {
    const applying = writeIssueUpdateHandoff(filePath, {
      ...handoff,
      status: "applying",
      attemptStartedAt: (dependencies.now?.() ?? new Date()).toISOString()
    });
    let rereadResult;
    try {
      rereadResult = invokeRuntime(dependencies, {
        runtime,
        operation: "get_issue",
        input: {
          issueId: applying.review.snapshot.issueId,
          ...(applying.review.organization === "default" ? {} : { organization: applying.review.organization }),
          fields: ISSUE_UPDATE_FIELDS
        },
        callOptions: ["--verbose"],
        environment
      });
    } catch (error) {
      writeIssueUpdateHandoff(filePath, {
        ...applying,
        status: "unresolved",
        finishedAt: (dependencies.now?.() ?? new Date()).toISOString()
      });
      throw error;
    }
    if (!rereadResult.success) {
      writeIssueUpdateHandoff(filePath, {
        ...applying,
        status: "unresolved",
        finishedAt: (dependencies.now?.() ?? new Date()).toISOString()
      });
      throw runtimeFailure("get_issue", rereadResult);
    }
    const currentSnapshot = extractIssueUpdateSnapshot(rereadResult, applying.review.snapshot);
    if (issueUpdateSnapshotDigest(currentSnapshot) !== applying.review.snapshotSha256) {
      writeIssueUpdateHandoff(filePath, {
        ...applying,
        status: "conflict",
        finishedAt: (dependencies.now?.() ?? new Date()).toISOString(),
        observedSnapshotSha256: issueUpdateSnapshotDigest(currentSnapshot)
      });
      throw new BacklogSkillRunnerError(
        "ISSUE_UPDATE_SNAPSHOT_CONFLICT",
        "Issue changed after review; no update was sent"
      );
    }
    let updateResult;
    try {
      updateResult = invokeRuntime(dependencies, {
        runtime,
        operation: "update_issue",
        input: applying.review.input,
        callOptions: ["--allow", "UPDATE", "--verbose"],
        environment
      });
      if (!updateResult.success) throw runtimeFailure("update_issue", updateResult);
      const issue = extractUpdatedIssue(updateResult, applying.review);
      const applied = writeIssueUpdateHandoff(filePath, {
        ...applying,
        status: "applied",
        updatedIssue: issue,
        finishedAt: (dependencies.now?.() ?? new Date()).toISOString()
      });
      return makeResult({
        workflow: "issue.update.apply",
        status: "success",
        mutationInvoked: true,
        handoffPath: path.relative(cwd, filePath),
        organization: applied.review.organization,
        project: applied.review.project,
        issue,
        changes: applied.review.changes,
        humanOutput: `${issue.issueKey}（「${issue.summary}」）を更新しました。`
      });
    } catch (error) {
      writeIssueUpdateHandoff(filePath, {
        ...applying,
        status: "unresolved",
        finishedAt: (dependencies.now?.() ?? new Date()).toISOString()
      });
      throw error;
    }
  } finally {
    releaseApplyLock(lockPath);
  }
}

function extractHygieneIssue(issue) {
  if (!isRecord(issue)
    || typeof issue.issueKey !== "string"
    || !ISSUE_KEY.test(issue.issueKey)
    || typeof issue.summary !== "string"
    || typeof issue.updated !== "string"
    || !isRecord(issue.status)
    || !Number.isSafeInteger(issue.status.id)
    || issue.status.id <= 0
    || typeof issue.status.name !== "string"
    || (issue.dueDate !== undefined && issue.dueDate !== null && !ISO_DATE.test(issue.dueDate))
    || (issue.parentIssueId !== undefined && issue.parentIssueId !== null
      && (!Number.isSafeInteger(issue.parentIssueId) || issue.parentIssueId <= 0))) {
    throw new BacklogSkillRunnerError("INVALID_RUNTIME_RESULT", "get_issues returned an invalid hygiene Issue");
  }
  return {
    issueKey: issue.issueKey,
    summary: oneLine(issue.summary),
    status: oneLine(issue.status.name, "unknown"),
    statusId: issue.status.id,
    dueDate: issue.dueDate ?? null,
    parentIssueId: issue.parentIssueId ?? null,
    updated: issue.updated
  };
}

function hygieneReasons(issue, options, now) {
  const reasons = [];
  const today = calendarDaysAgo(0, now);
  if (options.overdue && issue.dueDate !== null && issue.dueDate < today) reasons.push("期限超過");
  if (options.staleDays !== undefined
    && issue.updated.slice(0, 10) < calendarDaysAgo(options.staleDays, now)) {
    reasons.push(`${options.staleDays}日以上更新なし`);
  }
  if (options.withoutParent && issue.parentIssueId === null) reasons.push("親Issue未設定");
  return reasons;
}

export function runIssueHygiene(options, dependencies = {}) {
  const scoped = applySessionContext(options, dependencies);
  const resolvedOptions = scoped.options;
  const environment = dependencies.environment ?? process.env;
  requireReadPermission(environment);
  const runtime = dependencies.runtime ?? resolveRuntimeIdentity(dependencies.skillRoot);
  const now = dependencies.now?.() ?? new Date();
  const project = resolveSearchProject(resolvedOptions, runtime, environment, dependencies);
  const issues = [];
  let offset = 0;
  let pageCount = 0;
  let scannedIssueCount = 0;
  while (true) {
    const result = invokeRuntime(dependencies, {
      runtime,
      operation: "get_issues",
      input: {
        ...organizationInput(resolvedOptions),
        projectId: [project.id],
        fields: ISSUE_HYGIENE_FIELDS,
        sort: "updated",
        order: "asc",
        offset,
        count: ISSUE_PAGE_SIZE
      },
      callOptions: ["--verbose"],
      environment
    });
    if (!result.success) throw runtimeFailure("get_issues", result);
    if (!Array.isArray(result.result)) {
      throw new BacklogSkillRunnerError("INVALID_RUNTIME_RESULT", "get_issues returned no issue list");
    }
    const page = result.result.map(extractHygieneIssue);
    pageCount += 1;
    scannedIssueCount += page.length;
    for (const issue of page) {
      if (issue.statusId === CLOSED_STATUS_ID) continue;
      const reasons = hygieneReasons(issue, resolvedOptions, now);
      if (reasons.length > 0) issues.push({ ...issue, reasons });
    }
    if (page.length < ISSUE_PAGE_SIZE) break;
    offset += page.length;
  }
  const results = issues
    .sort((left, right) => left.updated === right.updated
      ? (left.issueKey < right.issueKey ? -1 : left.issueKey > right.issueKey ? 1 : 0)
      : left.updated < right.updated ? -1 : 1)
    .map(({ statusId: ignoredStatusId, parentIssueId: ignoredParentIssueId, ...issue }) => issue);
  const conditions = [
    ...(resolvedOptions.overdue ? ["期限超過"] : []),
    ...(resolvedOptions.staleDays === undefined ? [] : [`${resolvedOptions.staleDays}日以上更新なし`]),
    ...(resolvedOptions.withoutParent ? ["親Issue未設定"] : [])
  ].join("、");
  return makeResult({
    workflow: "issue.hygiene",
    status: "success",
    mutationInvoked: false,
    organization: resolvedOptions.organization ?? "default",
    project,
    ...(scoped.context === undefined ? {} : { context: contextSummary(scoped.context) }),
    conditions: {
      overdue: resolvedOptions.overdue,
      staleDays: resolvedOptions.staleDays ?? null,
      withoutParent: resolvedOptions.withoutParent
    },
    issueCount: results.length,
    scannedIssueCount,
    pageCount,
    issues: results,
    humanOutput: [
      `組織 ${resolvedOptions.organization ?? "default"}・プロジェクト ${project.key}（${project.name}）のIssue衛生確認（${conditions}）: ${results.length}件（${scannedIssueCount}件を${pageCount}ページ取得）`,
      ...results.map((issue) => `${issue.issueKey}\t${issue.reasons.join(" / ")}\t期限:${issue.dueDate ?? "未設定"}\t更新:${issue.updated}\t${issue.summary}`)
    ].join("\n")
  });
}

function extractNotificationTriageEntry(notification) {
  if (!isRecord(notification)
    || !Number.isSafeInteger(notification.id)
    || notification.id <= 0
    || typeof notification.alreadyRead !== "boolean"
    || !Number.isSafeInteger(notification.reason)
    || typeof notification.resourceAlreadyRead !== "boolean"
    || typeof notification.created !== "string"
    || (notification.issue !== undefined && notification.issue !== null
      && (!isRecord(notification.issue) || typeof notification.issue.issueKey !== "string" || !ISSUE_KEY.test(notification.issue.issueKey)))) {
    throw new BacklogSkillRunnerError("INVALID_RUNTIME_RESULT", "get_notifications returned an invalid notification");
  }
  return {
    id: notification.id,
    alreadyRead: notification.alreadyRead,
    reason: notification.reason,
    resourceAlreadyRead: notification.resourceAlreadyRead,
    created: notification.created,
    issueKey: notification.issue?.issueKey ?? null
  };
}

export function runNotificationTriage(options, dependencies = {}) {
  const environment = dependencies.environment ?? process.env;
  requireReadPermission(environment);
  const runtime = dependencies.runtime ?? resolveRuntimeIdentity(dependencies.skillRoot);
  const result = invokeRuntime(dependencies, {
    runtime,
    operation: "get_notifications",
    input: {
      ...organizationInput(options),
      count: options.limit,
      order: "desc",
      fields: NOTIFICATION_TRIAGE_FIELDS
    },
    callOptions: ["--verbose"],
    environment
  });
  if (!result.success) throw runtimeFailure("get_notifications", result);
  if (!Array.isArray(result.result)) {
    throw new BacklogSkillRunnerError("INVALID_RUNTIME_RESULT", "get_notifications returned no notification list");
  }
  const notifications = result.result
    .map(extractNotificationTriageEntry)
    .filter((notification) => !options.unread || !notification.alreadyRead);
  return makeResult({
    workflow: "notification.triage",
    status: "success",
    mutationInvoked: false,
    organization: options.organization ?? "default",
    requestedCount: options.limit,
    unreadOnly: options.unread,
    notificationCount: notifications.length,
    notifications,
    humanOutput: [
      `組織 ${options.organization ?? "default"} のBacklog通知（${options.unread ? "未読のみ、" : ""}最新${options.limit}件）: ${notifications.length}件`,
      ...notifications.map((notification) => (
        `${notification.id}\t${notification.alreadyRead ? "既読" : "未読"}\treason=${notification.reason}\t${notification.resourceAlreadyRead ? "リソース既読" : "リソース未読"}\t${notification.issueKey ?? "Issueなし"}\t${notification.created}`
      )),
      "reason はピン留め済み契約で意味を確定していない数値です。推測でメンション扱いにしません。"
    ].join("\n")
  });
}

export function runDeletePreflight(options, dependencies = {}) {
  const cwd = path.resolve(dependencies.cwd ?? process.cwd());
  const environment = dependencies.environment ?? process.env;
  requirePreflightPermissions(environment);
  const runtime = dependencies.runtime ?? resolveRuntimeIdentity(dependencies.skillRoot);
  const recentScoped = applyRecentIssueSession(options, dependencies);
  const scoped = applyDeleteSessionContext(recentScoped.options, dependencies);
  const resolvedOptions = scoped.options;
  const readInput = {
    ...targetInput(resolvedOptions),
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

  const target = extractIssueTarget(readResult, resolvedOptions);
  if (scoped.context !== undefined && target.projectId !== scoped.context.project.id) {
    throw new BacklogSkillRunnerError(
      "CONTEXT_PROJECT_MISMATCH",
      "Resolved issue is outside the selected project context"
    );
  }
  if (recentScoped.recentIssue !== undefined && target.projectId !== recentScoped.recentIssue.project.id) {
    throw new BacklogSkillRunnerError(
      "RECENT_ISSUE_PROJECT_MISMATCH",
      "Resolved Issue differs from the recorded recent Issue project"
    );
  }
  const { handoff, filePath } = createHandoff({
    directory: handoffDirectory(cwd, dependencies.artifactRoot),
    runtime,
    target,
    organization: resolvedOptions.organization,
    now: dependencies.now?.() ?? new Date(),
    createId: dependencies.createId
  });
  return makeResult({
    workflow: "issue.delete.preflight",
    status: "preflight-ok",
    mutationInvoked: false,
    handoffPath: path.relative(cwd, filePath),
    target,
    ...(scoped.context === undefined ? {} : { context: contextSummary(scoped.context) }),
    ...(recentScoped.recentIssue === undefined ? {} : { recentIssue: recentIssueSummary(recentScoped.recentIssue) }),
    humanOutput: finalConfirmation(
      handoff.review.target,
      scoped.context ?? (recentScoped.recentIssue === undefined ? undefined : { project: recentScoped.recentIssue.project })
    )
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
  if (workflowId === "context.list") {
    return runContextList(parseContextListArgs(workflowArguments), dependencies);
  }
  if (workflowId === "context.select") {
    return runContextSelect(parseContextSelectArgs(workflowArguments), dependencies);
  }
  if (workflowId === "context.show") {
    return runContextShow(parseContextSessionArgs(workflowArguments), dependencies);
  }
  if (workflowId === "context.clear") {
    return runContextClear(parseContextSessionArgs(workflowArguments), dependencies);
  }
  if (workflowId === "issue.recent.record") {
    return runRecentIssueRecord(parseRecentIssueRecordArgs(workflowArguments), dependencies);
  }
  if (workflowId === "issue.recent.list") {
    return runRecentIssueList(parseContextSessionArgs(workflowArguments), dependencies);
  }
  if (workflowId === "issue.recent.clear") {
    return runRecentIssueClear(parseContextSessionArgs(workflowArguments), dependencies);
  }
  if (workflowId === "issue.list.incomplete") {
    return runIncompleteIssueList(parseIncompleteIssueListArgs(workflowArguments), dependencies);
  }
  if (workflowId === "issue.hygiene") {
    return runIssueHygiene(parseIssueHygieneArgs(workflowArguments), dependencies);
  }
  if (workflowId === "notification.triage") {
    return runNotificationTriage(parseNotificationTriageArgs(workflowArguments), dependencies);
  }
  if (workflowId === "issue.search") {
    return runIssueSearch(parseIssueSearchArgs(workflowArguments), dependencies);
  }
  if (workflowId === "issue.save") {
    return runIssueSave(parseIssueSaveArgs(workflowArguments), dependencies);
  }
  if (workflowId === "issue.export.xlsx.preflight") {
    return runIssueXlsxExportPreflight(parseIssueXlsxExportPreflightArgs(workflowArguments), dependencies);
  }
  if (workflowId === "issue.export.xlsx.apply") {
    return runIssueXlsxExportApply(parseXlsxExportApplyArgs(workflowArguments), dependencies);
  }
  if (workflowId === "issue.create.preflight") {
    return runIssueCreatePreflight(parseIssueCreatePreflightArgs(workflowArguments), dependencies);
  }
  if (workflowId === "issue.create.apply") {
    return runIssueCreateApply(parseDeleteApplyArgs(workflowArguments), dependencies);
  }
  if (workflowId === "issue.update.preflight") {
    return runIssueUpdatePreflight(parseIssueUpdatePreflightArgs(workflowArguments), dependencies);
  }
  if (workflowId === "issue.update.apply") {
    return runIssueUpdateApply(parseDeleteApplyArgs(workflowArguments), dependencies);
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
    "  node <skill-root>/scripts/backlog-api-skill-run.mjs --format human context.list",
    "  node <skill-root>/scripts/backlog-api-skill-run.mjs --format human context.select --session SESSION --project PROJECT_KEY|PROJECT_ID [--organization NAME] --persist",
    "  node <skill-root>/scripts/backlog-api-skill-run.mjs --format human context.show --session SESSION",
    "  node <skill-root>/scripts/backlog-api-skill-run.mjs --format human context.clear --session SESSION",
    "  node <skill-root>/scripts/backlog-api-skill-run.mjs --format human issue.recent.record --session SESSION --issue-key PROJ-123 [--organization NAME] --persist",
    "  node <skill-root>/scripts/backlog-api-skill-run.mjs --format human issue.recent.list --session SESSION",
    "  node <skill-root>/scripts/backlog-api-skill-run.mjs --format human issue.recent.clear --session SESSION",
    "  node <skill-root>/scripts/backlog-api-skill-run.mjs --format human issue.list.incomplete --project PROJECT_KEY|PROJECT_ID [--organization NAME]",
    "  node <skill-root>/scripts/backlog-api-skill-run.mjs --format human issue.list.incomplete --context-session SESSION",
    "  node <skill-root>/scripts/backlog-api-skill-run.mjs --format human issue.search --project PROJECT_KEY|PROJECT_ID [--organization NAME] [--incomplete] [--keyword TEXT] [--assignee me|NAME|ID] [--priority NAME|ID] [--milestone NAME|ID] [--category NAME|ID] [--version NAME|ID] [--resolution NAME|ID] [--due-from YYYY-MM-DD] [--due-to YYYY-MM-DD] [--created-within-days DAYS] [--updated-within-days DAYS] [--sort created|updated] [--order asc|desc]",
    "  node <skill-root>/scripts/backlog-api-skill-run.mjs --format human issue.search --context-session SESSION [--incomplete] [--keyword TEXT] [--assignee me|NAME|ID] [--priority NAME|ID] [--milestone NAME|ID] [--category NAME|ID] [--version NAME|ID] [--resolution NAME|ID] [--due-from YYYY-MM-DD] [--due-to YYYY-MM-DD] [--created-within-days DAYS] [--updated-within-days DAYS] [--sort created|updated] [--order asc|desc]",
    "  node <skill-root>/scripts/backlog-api-skill-run.mjs --format human issue.save --project PROJECT_KEY|PROJECT_ID [--organization NAME] <issue.search conditions> --persist",
    "  node <skill-root>/scripts/backlog-api-skill-run.mjs --format human issue.export.xlsx.preflight --project PROJECT_KEY|PROJECT_ID [--organization NAME] <issue.search conditions> --md2xlsx-runtime /absolute/miku-md2xlsx-X.Y.Z.mjs --persist",
    "  node <skill-root>/scripts/backlog-api-skill-run.mjs --format human issue.export.xlsx.apply --apply",
    "  node <skill-root>/scripts/backlog-api-skill-run.mjs --format human issue.create.preflight --project PROJECT_KEY|PROJECT_ID [--organization NAME] --summary TEXT --issue-type NAME|ID --priority NAME|ID [--description TEXT] --persist",
    "  node <skill-root>/scripts/backlog-api-skill-run.mjs --format human issue.create.apply --apply",
    "  node <skill-root>/scripts/backlog-api-skill-run.mjs --format human issue.update.preflight --issue-key PROJ-123|--issue-id ID [--organization NAME] [--summary TEXT] [--description TEXT] [--due-date YYYY-MM-DD] [--priority NAME|ID] [--assignee NAME|ID] --persist",
    "  node <skill-root>/scripts/backlog-api-skill-run.mjs --format human issue.update.apply --apply",
    "  node <skill-root>/scripts/backlog-api-skill-run.mjs --format human issue.hygiene --project PROJECT_KEY|PROJECT_ID [--organization NAME] [--overdue] [--stale-days DAYS] [--without-parent]",
    "  node <skill-root>/scripts/backlog-api-skill-run.mjs --format human notification.triage [--organization NAME] [--unread] [--limit 1..100]",
    "  node <skill-root>/scripts/backlog-api-skill-run.mjs --format human issue.delete.preflight --issue-key PROJ-123 [--organization NAME] [--context-session SESSION]",
    "  node <skill-root>/scripts/backlog-api-skill-run.mjs --format human issue.delete.preflight --recent-issue-session SESSION",
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
    SEARCH_FILTER_REQUIRED: "Issue検索には少なくとも一つの検索条件が必要です。",
    DELETE_PERMISSION_NOT_ENABLED: "DELETE が BACKLOG_API_ALLOWED_PERMISSIONS に含まれていません。",
    UPDATE_PERMISSION_NOT_ENABLED: "UPDATE が BACKLOG_API_ALLOWED_PERMISSIONS に含まれていません。",
    PENDING_HANDOFF_NOT_FOUND: "承認待ちの削除確認が見つかりません。もう一度確認してください。",
    AMBIGUOUS_PENDING_HANDOFF: "承認待ちの削除確認が複数あります。処理を中止しました。",
    HANDOFF_APPLY_IN_PROGRESS: "この削除確認はすでに適用処理中です。重複実行を中止しました。",
    ISSUE_UPDATE_HANDOFF_APPLY_IN_PROGRESS: "この Issue 更新確認はすでに適用処理中です。重複実行を中止しました。",
    ISSUE_UPDATE_SNAPSHOT_CONFLICT: "確認後に Issue が更新されたため、更新を送信せず中止しました。もう一度確認してください。",
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
