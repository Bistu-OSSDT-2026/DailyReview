# PR Flow Notes

## Standard workflow

For each feature or infrastructure task, create the GitHub Issue before opening the implementation branch.

1. Create an Issue with the task goal, scope, and acceptance criteria.
2. Create a branch from the latest `main`.
3. Open a Pull Request from that branch.
4. Add a closing keyword in the PR body, for example `Closes #7`.
5. After review and CI pass, merge the PR so GitHub closes the linked Issue automatically.

## Migration backfills

During the DailyReview repository migration, some tasks were implemented and merged before their tracking Issues were created. The records below document those historical relationships.

### Supabase database module

- Tracking Issue: #7
- Implementation PR: #5
- Branch: `feature/supabase-schema`
- Scope: Supabase `reviews` table, seed data, RLS policies, grants, and setup documentation.

### Auth and data access layer

- Tracking Issue: #9
- Implementation PR: #6
- Branch: `feature/auth-and-data-layer`
- Scope: login page, Supabase Auth helpers, current-user lookup, admin route protection, review data access functions, and admin Server Actions.

Future tasks should follow the standard workflow above so the Issue is created before the PR and closed by the PR merge event.
