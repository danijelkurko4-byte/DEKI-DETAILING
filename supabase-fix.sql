-- Pokreni ovaj fajl ako SQL padne na site_settings (data / identity greške)

alter table public.site_settings add column if not exists data jsonb not null default '{}'::jsonb;
alter table public.site_settings add column if not exists updated_at timestamptz default now();
alter table public.site_settings alter column id drop identity if exists;
alter table public.inquiries alter column id drop identity if exists;
alter table public.reviews alter column id drop identity if exists;

insert into public.site_settings (id, data)
values (1, '{}'::jsonb)
on conflict (id) do update set data = excluded.data;
