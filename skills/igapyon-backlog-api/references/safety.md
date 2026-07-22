# Safety and Data Handling

## Credentials

Backlog API keys, OAuth client secrets, access tokens, refresh tokens, and MCP
authorization headers are secrets.

- never request that they be pasted into chat
- never include them in generated examples, logs, tests, screenshots, or bundle
  files
- never search dotfiles or environment variables for them
- refer the user to the execution environment's secure secret configuration

## Tenant Boundaries

- resolve the organization before mutation in multi-organization environments
- do not assume that identical project or repository names belong to the same
  organization
- avoid including unrelated issue bodies, wiki text, document content, or user
  details in summaries

## Mutation Classes

Read operations do not change Backlog state.

Ordinary mutations include creating or updating a specifically requested issue,
comment, wiki, document, milestone, pull request, or watching item. They may
proceed when target and payload are clear.

High-impact mutations include:

- any `delete_*` operation
- project deletion
- broad notification-state reset
- bulk or cross-project changes
- an update that replaces substantial existing content when the user asked for
  a narrow edit

Obtain just-in-time confirmation for high-impact mutations and state the exact
scope. Do not rely on a confirmation from an earlier unrelated operation.

## Diagnostics

Preserve upstream authentication, authorization, validation, rate-limit,
truncation, and transport diagnostics. Redact secrets if an upstream diagnostic
unexpectedly contains them.
