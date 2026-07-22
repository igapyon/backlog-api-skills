# TODO

- [ ] Evaluate a session-scoped working-context feature for users with access
      to multiple Backlog spaces and projects. It should list available spaces,
      show and explicitly switch or clear the current space and project, scope
      subsequent operations to that context, and display the resolved target
      before any mutation. Confirm first whether Backlog API or the upstream
      server already provides equivalent context handling; do not persist API
      keys, and require user permission before persisting context information.
- [ ] Evaluate a recent-issue context that remembers the most recently viewed
      or operated-on Backlog issue and can reuse its exact space, project, and
      issue key when the user refers to the current or previous issue. Keep it
      session-scoped by default, show the resolved issue before reuse or
      mutation, provide list and clear operations, and require explicit user
      permission before persisting history because issue metadata may be
      sensitive.
- [ ] Before implementing the feature requests below, confirm whether Backlog
      API already provides equivalent capabilities, permission controls, or
      relevant constraints, and document what must be handled by this product.
- [ ] Complete and document the early repository split:
      maintain the Backlog MCP-equivalent Node Core/CLI in `backlog-api`, and
      keep Agent Skill guidance, safety, context, and integrations in
      `backlog-api-skills`. Define the migration sequence, release boundary,
      and two-stage upstream-to-Node-to-Skill traceability before adding more
      features. Use the draft in `docs/github-issue-drafts.md`.
- [ ] Add a GitHub Issue to confirm or decide where Backlog API credentials
      should be configured and stored securely, without committing secrets to
      the repository. Use the draft in `docs/github-issue-drafts.md`.
- [ ] Evaluate whether a local `.env` file is an appropriate place for Backlog
      API credentials. If adopted, explicitly ignore `.env` and related local
      variants in `.gitignore`, provide only a secret-free example file, and
      document loading, file-permission, rotation, and accidental-commit
      prevention practices.
- [ ] Verify whether Backlog API access is read-only by default and create or
      update operations run only after explicit user authorization. If this
      protection is missing or incomplete, implement and test an authorization
      gate for all create and update operations.
- [ ] Add an opt-in feature for saving information retrieved through the
      Backlog API under `workplace/`, using an appropriate purpose-specific
      directory name and timestamped output. Because the saved data may require
      careful handling, explain the destination and data-handling implications
      and obtain explicit user permission before writing any files.
- [ ] Add a GitHub Issue to evaluate read-only issue-hygiene assistance for
      overdue, stale in-progress, missing-parent, and other potentially
      neglected tickets. Include the candidate checks and safe remediation
      workflow in `docs/github-issue-drafts.md`; verify Backlog API capabilities
      before deciding the implementation scope.
- [ ] Add a GitHub Issue to evaluate read-only notification triage for personal
      mentions and the Backlog bell notification list. Determine how notification
      reason codes map to mentions and actionable events, and require explicit
      authorization before marking individual notifications as read or resetting
      the unread count. Use the draft in `docs/github-issue-drafts.md`.
- [ ] Add a GitHub Issue to evaluate integration with `mikuproject` WBS
      workflows. Start with a read-only Backlog-to-`project_draft_view` or Patch
      JSON proposal flow, define issue-key-to-`task_uid` traceability and conflict
      handling, and require explicit authorization before writing changes back to
      Backlog or persisting retrieved project data. Use the draft in
      `docs/github-issue-drafts.md`.
- [ ] Add a GitHub Issue to export reviewed and summarized Backlog issues to an
      `.xlsx` file through `miku-md2xlsx`. Define a Markdown table contract,
      preview the selected issues, columns, and destination, and require explicit
      user permission before writing the timestamped output under `workplace/`.
      Use the draft in `docs/github-issue-drafts.md`.
- [ ] Add focused workflow examples after redacting organization names,
      project keys, issue keys, user names, and other tenant data.
