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

## Delete and Destructive Workflow

1. Read the exact target.
2. Present the organization, resource type, stable key/ID, and human-readable
   title or name.
3. Confirm that `DELETE` is already enabled in
   `BACKLOG_API_ALLOWED_PERMISSIONS`; do not modify the environment maximum
   implicitly.
4. Ask for mutation approval to supply `--allow DELETE`.
5. After that approval, separately explain the destructive impact and ask for
   a second confirmation.
6. Execute the destructive operation only after both approvals, passing
   `--allow DELETE` and `--confirm-destructive`.
7. Report the upstream result without implying recoverability. This includes
   `remove_related_issue`, which removes an issue relation rather than an issue
   itself.

Never convert “remove from my view,” “close,” “archive,” or “mark as read” into
a delete without resolving the intended Backlog operation.

## Result Wording

A concise result should include:

- action and status
- organization and target
- important returned key, ID, URL, or state
- warnings or fields not applied
- verification result, if read-back was performed
