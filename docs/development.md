# Development

## Design Record

- checked date: 2026-08-04
- repository version: `0.7.1`
- implementation maturity: beta, standalone CLI-backed Agent Skill
- version policy: keep numeric Semantic Versions without a beta suffix
- runtime policy: the Skill version may advance ahead of the published runtime;
  the runtime version and provenance remain independently pinned
- Node provider: <https://github.com/igapyon/miku-backlog-api>
- original combined implementation commit:
  `d734c4fb1ecb91abfc2acf2b4995f3f8a4273fd2`

## Repository Boundary

This repository owns:

- Agent Skill activation and CLI-only backend policy
- user-facing credential and mutation safety rules
- fixed-runner workflow contracts and local approval handoffs for supported
  mechanical operations
- request routing, target resolution, and result reporting guidance
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
