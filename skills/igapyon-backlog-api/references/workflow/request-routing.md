# Request Routing

## Read Workflow

1. Identify the organization and resource kind.
2. Use list or lookup tools to resolve names to keys or IDs.
3. Request only fields and result volume needed for the answer.
4. Summarize the result and preserve meaningful upstream warnings.

## Create or Update Workflow

1. Confirm that the user explicitly requested the mutation.
2. Resolve the organization, project key, issue key, repository, user, issue
   type, milestone, and custom-field identities that matter.
3. Separate user-provided values from values discovered through read calls.
4. If a material field is ambiguous, ask before execution.
5. Confirm that the corresponding permission is already enabled in
   `BACKLOG_API_ALLOWED_PERMISSIONS`; do not modify the environment maximum
   implicitly.
6. Present the operation class, organization, exact target, and material fields,
   and ask for just-in-time mutation approval.
7. Only after approval, execute one smallest-scope mutation with its required
   `--allow CREATE` or `--allow UPDATE` permission.
8. Read back the target when practical and report its stable key or ID.

An explicit request such as “create this issue” or “post this comment” begins
the mutation workflow but does not replace the just-in-time approval above.

## Fixed Single-Issue Delete Workflow

For `delete_issue` only, use the fixed runner when the user's original request
names one stable issue key or ID and explicitly asks to delete it. The request
counts as the mutation approval only after preflight resolves exactly that
target. The runner output supplies the only separate destructive confirmation.

1. Confirm that both `READ` and `DELETE` are already enabled in
   `BACKLOG_API_ALLOWED_PERMISSIONS`; do not modify that maximum implicitly.
2. Invoke `issue.delete.preflight` in
   `scripts/backlog-api-skill-run.mjs` with exactly one of `--issue-key` or
   `--issue-id` and, only when specified, `--organization`.
3. Return its human output unchanged. It reads the target once, creates an
   integrity-checked pending handoff, and asks the concise final question.
4. After a separate affirmative reply, invoke only
   `issue.delete.handoff.apply --apply` from the same workspace. Do not repeat
   the target or reconstruct any apply argument. The runner requires exactly
   one pending handoff, verifies the reviewed runtime identity, and calls the
   bundled `delete_issue` operation once with its fixed delete gates.
5. Return the runner's human output unchanged. Do not add routine progress,
   dry-run, or read-back narration.

The fixed runner performs exactly two Backlog API calls across the normal
success path: `get_issue` at preflight and `delete_issue` at apply. It does not
run a routine `--dry-run` or post-delete read-back. A failed or interrupted
apply becomes `unresolved` and must not be retried automatically.

For example, after an exact Japanese request such as `PROJ-123 を削除`, return
the preflight result only:

> 組織 example の PROJ-123（「Example title」）を完全に削除します。復元できません。実行しますか？

After confirmation and an unambiguous successful deletion, return only:

> PROJ-123 を削除しました。

Do not use this route for `remove_related_issue`, project deletion, bulk
deletion, or an ambiguous request. Those operations use the generic mutation
flow: resolve the target, obtain mutation approval, then obtain a separate
destructive confirmation in a later turn.

Never convert “remove from my view,” “close,” “archive,” or “mark as read” into
a delete without resolving the intended Backlog operation.

## Result Wording

A concise result should include:

- action and status
- organization and target
- important returned key, ID, URL, or state
- warnings or fields not applied
- verification result, if read-back was performed

Do not narrate that an approval was received, announce routine validation, or
repeat unchanged target details between steps. After an unambiguous success,
one sentence naming the action and stable target is sufficient.
