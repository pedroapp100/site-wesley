-- Esquema inicial: perguntas do quiz e leads capturados.
-- Único caminho de acesso é o backend Next.js (rotas /api/*) usando a
-- service_role key, que ignora RLS por padrão. RLS fica habilitado sem
-- nenhuma policy para anon/authenticated, então a anon key (se algum dia
-- for exposta ao browser) não consegue ler nem escrever nada.

create table if not exists public.questions (
  id bigint generated always as identity primary key,
  text text not null,
  type text not null check (type in ('radio', 'text', 'whatsapp')),
  options text[] not null default '{}',
  sort_order integer not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists questions_active_sort_order_idx
  on public.questions (active, sort_order);

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text,
  whatsapp text,
  answers jsonb not null default '[]'::jsonb
);

create index if not exists leads_created_at_idx
  on public.leads (created_at desc);

alter table public.questions enable row level security;
alter table public.questions force row level security;

alter table public.leads enable row level security;
alter table public.leads force row level security;

-- Nenhuma policy criada de propósito: sem policy = acesso negado por
-- padrão para anon/authenticated. service_role sempre ignora RLS.
