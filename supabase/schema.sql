-- Tabela de ingredientes
create table if not exists ingredientes (
  id uuid default gen_random_uuid() primary key,
  nome text not null,
  preco decimal(10,4) not null,
  qtd decimal(10,4) not null,
  unidade text not null,
  created_at timestamp with time zone default now()
);

-- Tabela de receitas
create table if not exists receitas (
  id uuid default gen_random_uuid() primary key,
  nome text not null,
  rendimento integer not null,
  created_at timestamp with time zone default now()
);

-- Tabela de ingredientes por receita
create table if not exists receita_ingredientes (
  id uuid default gen_random_uuid() primary key,
  receita_id uuid references receitas(id) on delete cascade not null,
  ingrediente_id uuid references ingredientes(id) on delete restrict not null,
  qtd decimal(10,4) not null,
  unidade text not null
);

-- Habilitar Row Level Security (RLS)
alter table ingredientes enable row level security;
alter table receitas enable row level security;
alter table receita_ingredientes enable row level security;

-- Políticas públicas (sem autenticação por enquanto)
-- Se quiser adicionar autenticação futuramente, altere estas políticas.
create policy "Acesso público a ingredientes"
  on ingredientes for all using (true) with check (true);

create policy "Acesso público a receitas"
  on receitas for all using (true) with check (true);

create policy "Acesso público a receita_ingredientes"
  on receita_ingredientes for all using (true) with check (true);
