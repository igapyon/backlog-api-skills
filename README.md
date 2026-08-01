# backlog-api-skills

`backlog-api-skills` provides an installable Agent Skill for operating Nulab
Backlog through the bundled `backlog-api` Node CLI runtime.

This product is currently beta. Its version remains a numeric Semantic Version
such as `0.6.1`; beta status is not encoded in the version number.

The Backlog MCP-equivalent Node Core/CLI is maintained separately in the sister
[`backlog-api`](https://github.com/igapyon/backlog-api) repository. This
repository adds explicit activation, user-facing safety policy, working-context
guidance, and Agent-oriented workflows around a pinned Node runtime.

## Repository Boundary

```text
skills/igapyon-backlog-api/      Agent Skill, references, notices, and runtime
scripts/                         Skill bundle and runtime synchronization tools
tests/                           Skill contract, provenance, and bundle tests
docs/                            Skill development and product reference notes
workplace/                       ignored local scratch and approved data outputs
```

Node Core/CLI source, upstream operation mapping, direct handler tests, and Node
release artifacts belong to `backlog-api`, not this repository.

## Agent Skill

- maturity: beta
- installed name: `igapyon-backlog-api`
- explicit triggers: `igapyon-backlog-api`, `backlog-api`, or
  `backlog-api-skills`
- backend policy: CLI only
- Skill version: `0.6.1`
- bundled runtime: `runtime/backlog-api-0.6.0.mjs`
- runtime source record: `runtime/backlog-api-source.json`

Generic mentions of Backlog, issues, projects, wikis, or pull requests do not
activate the Skill by themselves.

The Skill and the bundled runtime are versioned independently. Consult the
runtime source record for the exact runtime version and provenance rather than
inferring it from the Skill version.

## Requirements and Authentication

- Node.js 22 or later
- a Backlog account with API access
- `BACKLOG_DOMAIN` and `BACKLOG_API_KEY`, or the Node runtime's
  multi-organization environment variables
- `BACKLOG_API_ALLOWED_PERMISSIONS` when write operations are allowed

Credentials are inherited from the runtime process environment. They are not
stored, printed, or bundled by this repository.

The bundled CLI allows read operations by default. Create, update, and delete
operations must be enabled both by the environment-level
`BACKLOG_API_ALLOWED_PERMISSIONS` maximum and by an explicit `--allow CREATE`,
`--allow UPDATE`, or `--allow DELETE` argument for that invocation. The Agent
must obtain the user's just-in-time approval before supplying the call-level
permission. A destructive or broad operation requires a second, separate
confirmation after the mutation approval; one approval cannot satisfy both
gates.

During the beta period, run actual Backlog API calls with `--verbose` by
default. The CLI keeps the JSON result on stdout and writes a safe access
summary to stderr as `verbose: `-prefixed JSON. It includes allowlisted resource
IDs or keys, execution metadata, an available actual HTTP status, and validated
rate-limit values, but excludes credentials, bodies, search text, personal data,
and error bodies. Do not persist verbose diagnostics unless the user explicitly
approves the destination and handling. Metadata commands do not need
`--verbose`. Dry-run does not resolve credentials or call Backlog and uses
`--verbose` only when diagnostic output is useful.

### Exact Single-Issue Deletion

For an explicit request to delete one named Backlog issue, the bundled fixed
runner replaces the agent-assembled read/dry-run/delete/read-back sequence.
It makes one target read at preflight, asks the one final destructive question,
then makes one delete call after the user's reply. It does not use a routine
dry-run or post-delete read-back.

Start preflight from the same agent workspace that owns the ignored
`workplace/` directory:

```bash
node --env-file=<agent-workspace>/workplace/backlog.env \
  skills/igapyon-backlog-api/scripts/backlog-api-skill-run.mjs \
  --format human issue.delete.preflight --issue-key PROJ-123
```

Return the runner's question unchanged. Only after the user separately
confirms it, apply the sole pending handoff without repeating the issue key,
organization, or delete flags:

```bash
node --env-file=<agent-workspace>/workplace/backlog.env \
  skills/igapyon-backlog-api/scripts/backlog-api-skill-run.mjs \
  --format human issue.delete.handoff.apply --apply
```

The handoff is stored locally under
`workplace/backlog-api-skill/delete-handoffs/`, with permissions restricted to
the workspace owner. It binds the reviewed issue and runtime checksum, never
contains an API-key value, requires exactly one pending record, and never
retries an unresolved delete automatically. The route is limited to one
`delete_issue`; other destructive operations retain the normal confirmation
workflow.

### Issuing a Backlog API Key

In Backlog, open the user menu in the upper-right corner, then select
**Personal settings** and **API**. Enter a purpose-only note such as
`Agent Skills connection`, select **Register**, and copy the newly issued key.

This is a guidance-only workflow. The user performs the registration and copy
steps; the Skill does not operate the settings UI or receive the key value.

Do not put the API key value in the note, documentation, screenshots, chat, or
tracked files. Keep the value only in the local connection file below.

### Local Connection Configuration

When a local Backlog connection file is explicitly requested, create
`workplace/backlog.env` in the Agent or operator workspace that owns local
credentials, not inside the installed Skill. Use this template and replace the
example domain:

```dotenv
BACKLOG_DOMAIN=userunique.backlog.com
BACKLOG_API_KEY=
BACKLOG_API_ALLOWED_PERMISSIONS=READ
```

Apply the following safety rules:

- create the file only after an explicit request
- set its permissions to `600`
- never overwrite an existing file
- never print or copy its values into chat, logs, tracked files, or generated
  artifacts
- specify `BACKLOG_DOMAIN` as a host name only, without `https://` or a trailing
  slash
- confirm that the credential-owning workspace ignores the file under
  `workplace/`
- begin a connection test with the read-only `get_space` operation

The CLI does not automatically load this file. Pass its resolved path to Node
explicitly when running the bundled runtime:

```bash
printf '{}\n' | node --env-file=<agent-workspace>/workplace/backlog.env \
  skills/igapyon-backlog-api/runtime/backlog-api-0.6.0.mjs \
  call get_space --input - --verbose
```

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

Use the published `backlog-api` Release asset as the source of a releasable
Skill runtime. Download the versioned CLI asset and `SHA256SUMS`, verify the
checksum, then import the asset with its exact Release tag and commit:

```bash
npm run import:runtime:release -- \
  --version 0.6.0 \
  --tag v0.6.0 \
  --commit 1535fa15a244a8eab992209a783e0bc7e0c9613d \
  --artifact /path/to/backlog-api-0.6.0.mjs \
  --expected-sha256 f43ad0a8d1a9f74916aef64a20463b0c2e3e55486546ebde8b9f39db100a18f3
```

The import validates the asset checksum and reported version, then records the
source repository, version, Release tag, Git commit, Release URL, asset URL,
SHA-256, and upstream anchor in
`skills/igapyon-backlog-api/runtime/backlog-api-source.json`.

`npm run sync:runtime` remains available for local development builds from the
sister checkout, but a distributable Skill release should use the published
Release asset. After changing bundled Skill files, regenerate
`skills/igapyon-backlog-api/index.json` with `miku-indexgen --refresh-index`.

## Install

Build the Skill zip, extract it, and copy its top-level `skills/` directory into
the target agent's skill root. The installed path is
`skills/igapyon-backlog-api/`.

## License

This project is MIT licensed. The bundled Node runtime contains MIT-licensed
Nulab Backlog MCP Server handler code; see
[THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md).
