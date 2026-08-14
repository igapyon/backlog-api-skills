# Synthetic Workflow Examples

All labels, keys, IDs, names, titles, and timestamps below are synthetic. Do
not replace them with tenant information in committed documentation.

## Project-Scoped Search

```bash
node --env-file=<agent-workspace>/workplace/backlog.env \
  <skill-directory>/scripts/backlog-api-skill-run.mjs \
  --format human issue.search --organization example-space \
  --project DEMO --incomplete --updated-within-days 14
```

Example result shape:

```text
組織 example-space・プロジェクト DEMO（Demo Project）のIssue検索（完了以外、更新: 過去14日、更新日時新しい順）: 1件（1件を1ページ取得）
DEMO-101    未対応    Synthetic planning task    2026-08-10T00:00:00Z
```

## Explicit Local Save

Before this route, state the selected fields and the fixed ignored destination,
then obtain explicit permission to persist the result.

```bash
node --env-file=<agent-workspace>/workplace/backlog.env \
  <skill-directory>/scripts/backlog-api-skill-run.mjs \
  --format human issue.save --organization example-space \
  --project DEMO --incomplete --persist
```

The runner reports a generated path such as
`workplace/backlog-api-skill/saved-issues/issues-20260814T000000Z-<uuid>.json`.

## Hygiene and Notification Review

```bash
node --env-file=<agent-workspace>/workplace/backlog.env \
  <skill-directory>/scripts/backlog-api-skill-run.mjs \
  --format human issue.hygiene --organization example-space --project DEMO \
  --overdue --stale-days 30

node --env-file=<agent-workspace>/workplace/backlog.env \
  <skill-directory>/scripts/backlog-api-skill-run.mjs \
  --format human notification.triage --organization example-space --unread --limit 20
```

Treat notification reasons as raw numeric values. Do not label one as a mention
without a verified mapping for the pinned runtime.
