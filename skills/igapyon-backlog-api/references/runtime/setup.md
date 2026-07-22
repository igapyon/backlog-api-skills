# Backlog API Runtime Setup

The installed skill contains a versioned, single-file Node runtime under
`runtime/`. It does not require an MCP server process.

The runtime is built by <https://github.com/igapyon/backlog-api>. Its version,
source commit, dirty-state record, and SHA-256 are stored in
`runtime/backlog-api-source.json`.

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

## Agent Boundary

- let the human or execution environment provide credentials
- never ask for an API key or access token in chat
- never write credentials into the repository, request JSON, reports, or
  generated bundle
- do not read arbitrary dotfiles or print environment values
- do not start the upstream MCP Server as fallback

Verify installation without credentials:

```bash
node runtime/backlog-api-0.3.0.mjs --version
node runtime/backlog-api-0.3.0.mjs tools list
```

An actual Backlog operation requires configured credentials. A missing or
invalid configuration is a hard error.
