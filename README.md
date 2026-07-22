# backlog-api-skills

`backlog-api-skills` provides an installable Agent Skill for operating Nulab
Backlog through the bundled `backlog-api` Node CLI runtime.

The Backlog MCP-equivalent Node Core/CLI is maintained separately in the sister
[`backlog-api`](https://github.com/igapyon/backlog-api) repository. This
repository adds explicit activation, user-facing safety policy, working-context
guidance, and Agent-oriented workflows around a pinned Node runtime.

## Repository Boundary

```text
skills/igapyon-backlog-api/      Agent Skill, references, notices, and runtime
scripts/                         Skill bundle and runtime synchronization tools
tests/                           Skill contract, provenance, and bundle tests
docs/                            Skill development notes and GitHub Issue drafts
workplace/                       ignored local scratch and approved data outputs
```

Node Core/CLI source, upstream operation mapping, direct handler tests, and Node
release artifacts belong to `backlog-api`, not this repository.

## Agent Skill

- installed name: `igapyon-backlog-api`
- explicit triggers: `igapyon-backlog-api`, `backlog-api`, or
  `backlog-api-skills`
- backend policy: CLI only
- bundled runtime: `runtime/backlog-api-0.3.0.mjs`
- runtime source record: `runtime/backlog-api-source.json`

Generic mentions of Backlog, issues, projects, wikis, or pull requests do not
activate the Skill by themselves.

## Requirements and Authentication

- Node.js 22 or later
- a Backlog account with API access
- `BACKLOG_DOMAIN` and `BACKLOG_API_KEY`, or the Node runtime's
  multi-organization environment variables

Credentials are inherited from the runtime process environment. They are not
stored, printed, or bundled by this repository.

## Build and Test

The committed runtime lets this repository build and test independently of a
local `backlog-api` checkout.

```bash
npm install
npm test
npm run smoke:runtime
npm run build:bundle:zip
```

Generated output:

- `bundle/igapyon-backlog-api-skills-<version>.zip`

## Refresh the Node Runtime

For local sister checkouts, first build `../backlog-api`, then synchronize its
CLI artifact:

```bash
npm --prefix ../backlog-api run build
npm run sync:runtime
```

The synchronization records the source repository, version, Git commit, dirty
state, artifact filename, SHA-256, and upstream anchor in
`skills/igapyon-backlog-api/runtime/backlog-api-source.json`.

Use a clean, committed `backlog-api` source state before preparing a Skill
release. After changing bundled Skill files, regenerate
`skills/igapyon-backlog-api/index.json` with `miku-indexgen --refresh-index`.

## Install

Build the Skill zip, extract it, and copy its top-level `skills/` directory into
the target agent's skill root. The installed path is
`skills/igapyon-backlog-api/`.

## License

This project is MIT licensed. The bundled Node runtime contains MIT-licensed
Nulab Backlog MCP Server handler code; see
[THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md).
