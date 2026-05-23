-- BG Auto Spa — pokreni u Supabase SQL Editor (ceo fajl odjednom)

create table if not exists public.inquiries (
  id bigint primary key,
  date text,
  ime text not null,
  telefon text not null,
  vozilo text default '',
  usluga text default '',
  status text not null default 'Novo',
  cena numeric default 0,
  napomena text default '',
  created_at timestamptz default now()
);

create table if not exists public.reviews (
  id bigint primary key,
  date text,
  name text not null,
  text text not null,
  stars int not null default 5 check (stars >= 1 and stars <= 5),
  vozilo text default '',
  usluga text default '',
  status text not null default 'pending' check (status in ('pending', 'approved')),
  seeded boolean default false,
  created_at timestamptz default now()
);

create table if not exists public.site_settings (
  id int primary key default 1,
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz default now()
);

-- Stara tabela: dodaj kolone; ukloni GENERATED ALWAYS sa id (sajt šalje id ručno)
alter table public.site_settings add column if not exists data jsonb not null default '{}'::jsonb;
alter table public.site_settings add column if not exists updated_at timestamptz default now();
alter table public.site_settings alter column id drop identity if exists;
alter table public.inquiries alter column id drop identity if exists;
alter table public.reviews alter column id drop identity if exists;

insert into public.site_settings (id, data)
values (1, '{}'::jsonb)
on conflict (id) do update set data = excluded.data;

alter table public.inquiries enable row level security;
alter table public.reviews enable row level security;
alter table public.site_settings enable row level security;

drop policy if exists "inquiries_insert_public" on public.inquiries;
drop policy if exists "inquiries_admin_all" on public.inquiries;
drop policy if exists "reviews_insert_public" on public.reviews;
drop policy if exists "reviews_select_approved" on public.reviews;
drop policy if exists "reviews_admin_all" on public.reviews;
drop policy if exists "settings_select_public" on public.site_settings;
drop policy if exists "settings_admin_all" on public.site_settings;

create policy "inquiries_insert_public"
  on public.inquiries for insert
  to anon, authenticated
  with check (true);

create policy "inquiries_admin_all"
  on public.inquiries for all
  to authenticated
  using (true)
  with check (true);

create policy "reviews_insert_public"
  on public.reviews for insert
  to anon, authenticated
  with check (status = 'pending');

create policy "reviews_select_approved"
  on public.reviews for select
  to anon, authenticated
  using (status = 'approved');

create policy "reviews_admin_all"
  on public.reviews for all
  to authenticated
  using (true)
  with check (true);

create policy "settings_select_public"
  on public.site_settings for select
  to anon, authenticated
  using (true);

create policy "settings_admin_all"
  on public.site_settings for all
  to authenticated
  using (true)
  with check (true);
