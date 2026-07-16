# Supabase login and storage setup

Run this SQL in Supabase SQL Editor:

```sql
create table if not exists public.gradquest_user_data (
  user_id uuid not null references auth.users(id) on delete cascade,
  key text not null,
  value jsonb not null,
  updated_at timestamptz not null default now(),
  primary key (user_id, key)
);

alter table public.gradquest_user_data enable row level security;

create policy "Users can read own GradQuest data"
on public.gradquest_user_data
for select
to authenticated
using ((select auth.uid()) = user_id);

create policy "Users can insert own GradQuest data"
on public.gradquest_user_data
for insert
to authenticated
with check ((select auth.uid()) = user_id);

create policy "Users can update own GradQuest data"
on public.gradquest_user_data
for update
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);
```

In Supabase Auth settings, disable email confirmation if you want students to sign in with only student number and password.

In Vercel Project Settings > Environment Variables, add:

- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`

Redeploy after saving the environment variables.
