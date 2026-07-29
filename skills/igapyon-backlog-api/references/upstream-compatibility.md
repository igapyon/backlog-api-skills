# Upstream Compatibility

## Checked Baseline

- upstream: <https://github.com/nulab/backlog-mcp-server>
- version: `v0.13.2`
- commit: `d12f010de976af11bcd43f1d3497dc7043d26e62`
- checked: 2026-07-29
- upstream license: MIT

The upstream server is the semantic owner. The Node runtime directly bundles
the published upstream handler implementation and removes the MCP transport
boundary. The conversion adds a CLI envelope, trace metadata, input validation,
and destructive-operation confirmation without reimplementing Backlog calls.

The Node conversion is maintained in
<https://github.com/igapyon/backlog-api>. This Skill repository consumes a
versioned runtime and records its source commit and SHA-256 under `runtime/`.
The bundled `backlog-api` v0.5.0 runtime adds the Node-specific
`get_rate_limit` operation and machine-readable `tools describe` contracts
while preserving the upstream v0.13.2 semantic baseline.

The checked baseline supports Backlog tools for space, project, issue, wiki,
Git/pull request, document, notification, dynamic toolset, and organization
discovery workflows. It supports stdio and Streamable HTTP transports, toolset
selection, response optimization, token limiting, tool-name prefixes, and
single- or multi-organization configuration.

## Compatibility Rule

The bundled runtime's pinned upstream package wins for exact tool availability
and parameters. When a newer upstream checkout differs from this reference:

1. do not invent or translate unsupported parameters
2. do not mix the newer checkout into a released runtime implicitly
3. update the mapping and run parity tests in `backlog-api`
4. build and commit the Node release source
5. explicitly synchronize the new runtime into this Skill
