# Development

## Design Record

- checked date: 2026-07-22
- repository version: `0.3.0`
- implementation maturity: standalone CLI-backed Agent Skill
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

1. update and test `backlog-api`
2. commit the exact Node source state
3. run the Node build
4. run `npm run sync:runtime` in this repository
5. confirm `backlog-api-source.json` has `dirty: false`
6. regenerate the Skill index
7. run the complete Skill build and tests

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
