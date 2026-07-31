# Third-Party Notices

## Nulab Backlog MCP Server

This repository's generated Node runtime directly bundles published handler
code from `backlog-mcp-server` version `0.14.0`.

- Project: <https://github.com/nulab/backlog-mcp-server>
- Copyright: Copyright (c) 2025 Nulab Inc.
- License: MIT
- License text: [`licenses/backlog-mcp-server-MIT.txt`](licenses/backlog-mcp-server-MIT.txt)

The bundled runtime is produced by the sister `backlog-api` Node CLI project,
which removes the MCP transport boundary and invokes the published tool
handlers. Nulab owns the upstream Backlog behavior; `backlog-api` owns the Node
CLI adapter and traceability, and this repository owns the Agent Skill workflow
and bundled-runtime provenance.
