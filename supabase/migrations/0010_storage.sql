-- 0010_storage.sql
-- Storage buckets and object-level policies.
-- Path convention: `{user_id}/{filename}` — the first path segment must equal
-- the uploader's auth.uid(). (storage.foldername(name))[1] is that segment.

-- ---------------------------------------------------------------------------
-- Buckets
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public) values
  ('avatars',       'avatars',       true),
  ('covers',        'covers',        true),
  ('course-media',  'course-media',  true),
  ('verifications', 'verifications', false),
  ('attachments',   'attachments',   false)
on conflict (id) do nothing;

-- ---------------------------------------------------------------------------
-- Public buckets: world-readable, owner-writable within their own folder.
-- ---------------------------------------------------------------------------
create policy "public assets are readable"
  on storage.objects for select
  using (bucket_id in ('avatars','covers','course-media'));

create policy "users upload to their own folder (public buckets)"
  on storage.objects for insert
  with check (
    bucket_id in ('avatars','covers','course-media')
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "users update their own public assets"
  on storage.objects for update
  using (
    bucket_id in ('avatars','covers','course-media')
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "users delete their own public assets"
  on storage.objects for delete
  using (
    bucket_id in ('avatars','covers','course-media')
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- ---------------------------------------------------------------------------
-- Private buckets: only the owner can read/write their own folder.
-- (Admins / server use the service role, which bypasses these policies.)
-- ---------------------------------------------------------------------------
create policy "owners read their private files"
  on storage.objects for select
  using (
    bucket_id in ('verifications','attachments')
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "owners upload their private files"
  on storage.objects for insert
  with check (
    bucket_id in ('verifications','attachments')
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "owners update their private files"
  on storage.objects for update
  using (
    bucket_id in ('verifications','attachments')
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "owners delete their private files"
  on storage.objects for delete
  using (
    bucket_id in ('verifications','attachments')
    and (storage.foldername(name))[1] = auth.uid()::text
  );
