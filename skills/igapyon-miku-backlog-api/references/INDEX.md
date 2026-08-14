# Backlog API References

Use this index to choose the smallest reference needed for the current request.

- `runtime/operations-map.md`: Node CLI commands, operation categories, and
  read/write classification
- `runtime/setup.md`: Node runtime and authentication configuration
- `workflow/request-routing.md`: target resolution, mutation flow, and result
  reporting
- `safety.md`: credentials, tenant boundaries, confirmation, and destructive
  operations
- `../scripts/backlog-api-workflow-manifest.mjs`: fixed workflow identifiers
  and approval gates, including reviewed create and update routes
- `../scripts/backlog-api-skill-run.mjs`: deterministic common Issue-search,
  reviewed create/update, and single-issue deletion runner
- `upstream-compatibility.md`: checked Nulab Backlog MCP Server baseline
- `feature-feasibility.md`: checked feature capability matrix and supported
  implementation boundaries
- `integration-proposals.md`: explicit cross-product WBS and spreadsheet
  proposal contracts
- `workflow/examples.md`: synthetic, non-tenant workflow examples

The upstream Backlog MCP Server owns the converted tool schemas and handlers.
The bundled runtime is fixed to the compatibility version recorded here; do
not mix it with a different upstream checkout at execution time.
