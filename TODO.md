# TODO

- [x] Implement GitHub Issue #17: evaluate a session-scoped working-context
      feature for users with access
      to multiple Backlog spaces and projects. It should list available spaces,
      show and explicitly switch or clear the current space and project, scope
      subsequent operations to that context, and display the resolved target
      before any mutation. Confirm first whether Backlog API or the upstream
      server already provides equivalent context handling; do not persist API
      keys, and require user permission before persisting context information.
- [x] Implement GitHub Issue #8: evaluate a recent-issue context that remembers
      the most recently viewed
      or operated-on Backlog issue and can reuse its exact space, project, and
      issue key when the user refers to the current or previous issue. Keep it
      session-scoped by default, show the resolved issue before reuse or
      mutation, provide list and clear operations, and require explicit user
      permission before persisting history because issue metadata may be
      sensitive.
- [x] Implement GitHub Issue #9: investigate whether Backlog API, the upstream
      server, or `backlog-api` already provides the operations, permission
      controls, and constraints required by the Agent Skill feature requests
      below. Keep this investigation scoped to feature feasibility and missing
      capabilities; follow existing GitHub Issue #5 for repository
      responsibilities and #6 for traceability instead of duplicating them.
- [x] Implement GitHub Issue #7: confirm or decide where Backlog API credentials
      should be configured and stored securely, without committing secrets to
      the repository.
- [x] Evaluate whether a local `.env` file is an appropriate place for Backlog
      API credentials. If adopted, explicitly ignore `.env` and related local
      variants in `.gitignore`, provide only a secret-free example file, and
      document loading, file-permission, rotation, and accidental-commit
      prevention practices.
- [x] Implement GitHub Issue #10: preserve the bundled CLI's read-only default
      and require just-in-time user approval before every create, update, or
      delete permission. For destructive or broad operations, require a second,
      separate confirmation that cannot be satisfied by the mutation approval.
      Keep contract and runtime permission-gate tests aligned with this policy.
- [x] Implement GitHub Issue #11: add an opt-in feature for saving information
      retrieved through the
      Backlog API under `workplace/`, using an appropriate purpose-specific
      directory name and timestamped output. Because the saved data may require
      careful handling, explain the destination and data-handling implications
      and obtain explicit user permission before writing any files.
- [x] Implement GitHub Issue #13: evaluate read-only issue-hygiene assistance for
      overdue, stale in-progress, missing-parent, and other potentially
      neglected tickets. Verify Backlog API capabilities before deciding the
      implementation scope.
- [x] Implement GitHub Issue #14: evaluate read-only notification triage for personal
      mentions and the Backlog bell notification list. Determine how notification
      reason codes map to mentions and actionable events, and require explicit
      authorization before marking individual notifications as read or resetting
      the unread count.
- [x] Implement GitHub Issue #15: evaluate integration with `mikuproject` WBS
      workflows. Start with a read-only Backlog-to-`project_draft_view` or Patch
      JSON proposal flow, define issue-key-to-`task_uid` traceability and conflict
      handling, and require explicit authorization before writing changes back to
      Backlog or persisting retrieved project data.
- [x] Implement GitHub Issue #16: export reviewed and summarized Backlog issues to an
      `.xlsx` file through `miku-md2xlsx`. Define a Markdown table contract,
      preview the selected issues, columns, and destination, and require explicit
      user permission before writing the timestamped output under `workplace/`.
- [x] Implement GitHub Issue #12: add focused workflow examples after redacting
      organization names,
      project keys, issue keys, user names, and other tenant data.
- [x] Implement GitHub Issue #23: provide reviewed fixed single-Issue CREATE and
      UPDATE routes. UPDATE must resolve supported names, persist only after
      permission, reread and conflict-check the reviewed Issue before one UPDATE
      call, and prevent duplicate or automatic retry attempts.
