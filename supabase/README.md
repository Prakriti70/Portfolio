# Supabase setup

1. Create a free project at https://supabase.com.
2. **Run the schema:** SQL Editor → New query → paste `migrations/0001_art_journal.sql` → Run.
3. **Create your login:** Authentication → Users → Add user → *Create new user* (email + password, tick "Auto Confirm User").
4. **Turn off public sign-ups:** Authentication → Sign In / Providers → disable "Allow new users to sign up".
   (Even if left on, strangers still can't edit anything: step 5 is what grants access.)
5. **Make yourself an admin** (SQL Editor):
   ```sql
   insert into public.admins (user_id)
   select id from auth.users where email = 'you@example.com';
   ```
6. Copy **Project URL** and the **anon / publishable key** (Project Settings → API) into `.env.local`.
   Never use the `service_role` key in this project: it is not needed and must never reach the browser.

## What the policies enforce
| Who | Can do |
| --- | --- |
| Anyone | Read artwork rows; view images via their public URL |
| Signed-in user who is **not** in `admins` | Same as anyone |
| Admin | Insert / update / delete artwork rows and files in the `artwork` bucket |
