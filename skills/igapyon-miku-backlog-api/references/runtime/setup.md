# Backlog API Runtime Setup

The installed skill contains a versioned, single-file Node runtime under
`runtime/`. It does not require an MCP server process.

The runtime is released by <https://github.com/igapyon/miku-backlog-api>. Its version,
release tag, source commit, release asset URL, and SHA-256 are stored in
`runtime/miku-backlog-api-source.json`.

## Requirements

- Node.js 22 or later
- a Backlog account with API access
- authentication configured in the runtime process environment

For one organization, the converted upstream contract uses:

- `BACKLOG_DOMAIN`
- `BACKLOG_API_KEY`

For multiple organizations, it uses:

- `BACKLOG_DEFAULT_ORG`
- `BACKLOG_ORG_<NAME>_DOMAIN`
- `BACKLOG_ORG_<NAME>_API_KEY`

The runtime also uses `BACKLOG_API_ALLOWED_PERMISSIONS` as the environment-level
maximum for `READ`, `CREATE`, `UPDATE`, and `DELETE`. It defaults to `READ` when
unset. A write must be allowed both here and by the call-level `--allow`.

## Issuing an API Key in Backlog

Open the user menu in the upper-right corner of Backlog, choose **Personal
settings**, then select **API**. Add a purpose-only memo (for example, `Agent
Skills connection`) and select **Register** to issue a key.

The agent provides these steps as guidance only. The user performs **Register**
and copies the key directly from Backlog into their local credential store.
The agent does not operate the settings UI or receive the key value.

Never include the API key value in that memo, in documentation, screenshots,
chat, or tracked files. Copy it only into the local connection file described
below.

If a key is exposed in a conversation, image, or other supplied material,
revoke it in this API settings page and issue a replacement. Do not reuse the
exposed key.

## Local Connection File

When the user explicitly requests a local connection file, use
`workplace/backlog.env` under the Agent or operator workspace that owns local
credentials. Do not assume that the Skill source repository is the credential
workspace:

```dotenv
BACKLOG_DOMAIN=userunique.backlog.com
BACKLOG_API_KEY=
BACKLOG_API_ALLOWED_PERMISSIONS=READ
```

- create it only when it does not already exist
- set its permissions to `600`
- keep it excluded from Git through the credential-owning workspace's
  `workplace/*` rule
- use a host name without `https://` or a trailing slash
- never display, log, summarize, or copy its values

The CLI does not automatically load this file. Supply its resolved path to the
Node process explicitly. Begin live verification with the read-only
`get_space` operation:

```bash
printf '{}\n' | node --env-file=<agent-workspace>/workplace/backlog.env \
  <skill-directory>/runtime/miku-backlog-api-0.7.0.mjs \
  call get_space --input - --verbose
```

### `.env` Decision

Do not use a repository-root `.env`, `.env.local`, or similar dotfile for
Backlog credentials in this Skill. The supported local location is the
credential-owning workspace's ignored `workplace/backlog.env` file. It makes
the location, Git-exclusion rule, and owner-only permission expectation
explicit, while keeping credentials outside both the installed Skill and the
repository root.

There is deliberately no tracked credential example file: even a blank
root-level example would encourage placing a secret next to tracked source.
Use the blank template above only in an approved local workspace file. When a
key is rotated or exposed, revoke it in Backlog, issue a replacement, and
replace the local value without reading, logging, or committing it.

## Agent Boundary

- let the human or execution environment provide credentials
- never ask for an API key or access token in chat
- never write credentials into the repository, request JSON, reports, or
  generated bundle
- do not read arbitrary dotfiles or print environment values; an explicitly
  approved `<agent-workspace>/workplace/backlog.env` may be passed directly to
  Node as described above without inspecting its contents
- do not start the upstream MCP Server as fallback

Verify installation without credentials:

```bash
node runtime/miku-backlog-api-0.7.0.mjs --version
node runtime/miku-backlog-api-0.7.0.mjs tools list
node runtime/miku-backlog-api-0.7.0.mjs tools describe get_space
```

An actual Backlog operation requires configured credentials. A missing or
invalid configuration is a hard error.
