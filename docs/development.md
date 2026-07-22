# Development

## Design Record

- checked date: 2026-07-22
- repository version: `0.3.4`
- implementation maturity: beta, standalone CLI-backed Agent Skill
- version policy: keep numeric Semantic Versions without a beta suffix
- Node provider: <https://github.com/igapyon/backlog-api>
- original combined implementation commit:
  `d734c4fb1ecb91abfc2acf2b4995f3f8a4273fd2`

## Repository Boundary

This repository owns:

- Agent Skill activation and CLI-only backend policy
- user-facing credential and mutation safety rules
- request routing, target resolution, and result reporting guidance
- working-context and cross-product integration proposals
- the versioned Node runtime bundled into the Skill
- runtime source identity and checksum records
- Skill tests, bundles, and releases

The sister `backlog-api` repository owns:

- Node Core/CLI source and operation catalog
- direct invocation of the pinned upstream handlers
- JSON envelopes and CLI exit behavior
- upstream source, test, and operation traceability
- Node build, tests, runtime artifacts, and releases

## Runtime Refresh Contract

1. publish and verify the target `backlog-api` Release
2. download the versioned CLI asset and `SHA256SUMS`
3. confirm the downloaded asset checksum matches the published checksum
4. run `npm run import:runtime:release` with the exact version, tag, commit,
   asset path, and checksum
5. confirm `backlog-api-source.json` records the GitHub Release asset identity
6. update runtime references and the Skill repository version
7. regenerate the Skill index
8. run the complete Skill build and isolated bundle tests

`npm run sync:runtime` may be used for local development from a clean sister
checkout. It is not the provenance path for a distributable Skill release.

The trace chain is:

```text
backlog-mcp-server tag/commit/tool
  -> backlog-api version/commit/operation/artifact
  -> backlog-api-skills version/workflow/runtime checksum
```

## Commands

```bash
npm install
npm test
npm run smoke:runtime
npm run build:bundle:zip
```
