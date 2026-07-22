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
5. Execute one smallest-scope mutation.
6. Read back the target when practical and report its stable key or ID.

An explicit request such as “create this issue” or “post this comment” normally
authorizes that exact operation. Do not add an unnecessary second confirmation
unless the target or payload is ambiguous, broad, or destructive.

## Delete Workflow

1. Read the exact target.
2. Present the organization, resource type, stable key/ID, and human-readable
   title or name.
3. Ask for just-in-time confirmation.
4. Delete only after confirmation.
5. Report the upstream result without implying recoverability.

Never convert “remove from my view,” “close,” “archive,” or “mark as read” into
a delete without resolving the intended Backlog operation.

## Result Wording

A concise result should include:

- action and status
- organization and target
- important returned key, ID, URL, or state
- warnings or fields not applied
- verification result, if read-back was performed
