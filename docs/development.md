# Development

## Design Record

- checked date: 2026-08-04
- repository version: `0.7.5`
- implementation maturity: beta, standalone CLI-backed Agent Skill
- version policy: keep numeric Semantic Versions without a beta suffix
- runtime policy: the Skill version may advance ahead of the published runtime;
  the runtime version and provenance remain independently pinned
- Node provider: <https://github.com/igapyon/miku-backlog-api>
- original combined implementation commit:
  `d734c4fb1ecb91abfc2acf2b4995f3f8a4273fd2`

## 2026-08-14 Working Context

- completed GitHub Issue #17 with an explicit, local session-context runner.
  The pinned runtime and its checked upstream operation inventory provide
  per-call organization/project resolution but no saved current context.
- context persistence requires the runner's `--persist` gate after user
  permission, contains no credential values, and is limited to ignored
  owner-only workspace files.
- completed GitHub Issue #8 with a separate, opt-in recent-Issue history.
  It stores stable Issue/project identifiers only, exposes list and clear
  routes, and revalidates the newest record before a deletion preflight reuses
  it.
- maintenance uplift check: this CLI-backed Skill already uses the approved
  Node 22/24 CI matrix, Node 24 release build, Node-24-aware Action majors,
  least-authority CI permissions, and final bundle smoke coverage. No adjacent
  compatibility-neutral uplift was pending for this change.
- completed GitHub Issue #9 with a pinned-runtime feasibility matrix. It records
  which planned features can be implemented in the Skill layer and which need
  an explicit cross-product contract or runtime compatibility update.
- completed GitHub Issue #7 and the local `.env` evaluation: credentials stay
  only in an explicitly approved, ignored `workplace/backlog.env` within the
  credential-owning workspace. Repository-root `.env` variants are deliberately
  unsupported and no tracked credential example is provided.
- completed GitHub Issue #10 audit: the runtime tests exercise the default
  read-only maximum, call-level mutation gate, and destructive confirmation;
  the Skill contract independently requires per-mutation approval and a second
  confirmation for destructive or broad operations.
- completed GitHub Issue #11 with `issue.save`: a user-approved `--persist`
  gate writes a timestamped, owner-only compact Issue-search result under the
  ignored workspace. It intentionally has no arbitrary output path and excludes
  credentials, raw bodies, comments, attachments, and verbose diagnostics.
- completed GitHub Issue #13 with a Project-scoped, read-only hygiene route for
  overdue, stale, and no-parent-set Issues. It reports its heuristic boundaries
  and does not represent missing parent IDs as broken references.
- completed GitHub Issue #14 with read-only bell-notification triage. Reason
  values remain raw numeric values because the pinned contract has no verified
  mention mapping; notification writes remain in the generic approval flow.
- completed GitHub Issue #15 with a read-only WBS proposal contract. It defers
  `task_uid` allocation to an explicitly selected downstream workflow and
  preserves stable Backlog source identity for conflict detection.
- completed GitHub Issue #16 with a reviewed two-stage `miku-md2xlsx` export.
  Preflight requires explicit persistence permission and previews the compact
  columns/destination; apply requires a separate approval, rechecks converter
  identity, and writes owner-only Markdown/XLSX files under `workplace/`.
- completed GitHub Issue #23 with fixed single-Issue CREATE and UPDATE. UPDATE
  accepts only non-empty summary, description, due-date, priority, and assignee
  replacements; it persists one reviewed snapshot/input handoff after explicit
  permission, locks apply, rereads and digest-checks the Issue, and calls
  `update_issue` only when the snapshot still matches. Status and clearing
  semantics remain outside the fixed contract because the pinned runtime does
  not expose a safe status-name catalog or nullable update inputs.
- completed GitHub Issue #12 with synthetic, redacted examples for search,
  local save, hygiene, and notification review.

## Repository Boundary

This repository owns:

- Agent Skill activation and CLI-only backend policy
- user-facing credential and mutation safety rules
- fixed-runner workflow contracts and local approval handoffs for supported
  mechanical operations
- request routing, target resolution, and result reporting guidance
- session-scoped working-context records for explicitly authorized local use
- working-context and cross-product integration proposals
- the versioned Node runtime bundled into the Skill
- runtime source identity and checksum records
- Skill tests, bundles, and releases

The sister `miku-backlog-api` repository owns:

- Node Core/CLI source and operation catalog
- direct invocation of the pinned upstream handlers
- JSON envelopes and CLI exit behavior
- upstream source, test, and operation traceability
- Node build, tests, runtime artifacts, and releases

## Runtime Refresh Contract

1. publish and verify the target `miku-backlog-api` Release
2. download the versioned CLI asset and `SHA256SUMS`
3. confirm the downloaded asset checksum matches the published checksum
4. run `npm run import:runtime:release` with the exact version, tag, commit,
   asset path, and checksum
5. confirm `miku-backlog-api-source.json` records the GitHub Release asset identity
6. update runtime references when the runtime changes; update the Skill
   repository version independently as needed
7. regenerate the Skill index
8. run the complete Skill build and isolated bundle tests

`npm run sync:runtime` may be used for local development from a clean sister
checkout. It is not the provenance path for a distributable Skill release.

The trace chain is:

```text
backlog-mcp-server tag/commit/tool
  -> miku-backlog-api version/commit/operation/artifact
  -> miku-backlog-api-skills version/workflow/runtime checksum
```

## Fixed Single-Issue Delete Runner

`scripts/backlog-api-workflow-manifest.mjs` exposes the two fixed routes:

```text
issue.delete.preflight
  -> get_issue once + integrity-checked pending handoff + final prompt
issue.delete.handoff.apply --apply
  -> exactly one pending handoff + delete_issue once + stable result
```

The agent routes an exact single-issue deletion request to the preflight and
returns its `humanOutput` unchanged. Following the user's separate final
confirmation, it invokes the apply route with only `--apply`; the runner, not
the agent, restores the reviewed target and fixed delete arguments. The normal
success path has two Backlog API calls, no routine dry-run, and no routine
post-delete read-back. Failed applies are recorded as `unresolved` and are not
automatically retried.

The runner never receives API-key values as CLI arguments or writes them to its
handoff. Handoffs live under the credential-owning workspace's ignored
`workplace/backlog-api-skill/delete-handoffs/` directory.

## Commands

```bash
npm install
npm test
npm run smoke:runtime
npm run build:bundle:zip
```
