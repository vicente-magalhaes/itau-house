-- Schema inicial do Itaú House (T-05). Modelo da PRD §10, com os ajustes do contrato (docs/api.md).
-- Ids em text, legíveis (u-rafael, a-criterios-aceitacao). Enums como check, para mudar sem migração de tipo.
-- RLS ligado e sem política: só o back-end, com a chave secreta, lê e escreve. O front nunca fala com o banco.

create table squads (
  id text primary key,
  nome text not null unique,
  frente text not null
);

create table usuarios (
  id text primary key,
  nome text not null,
  iniciais text not null,
  papel text not null check (papel in ('produto', 'design', 'dev', 'dados', 'risco', 'coordenacao')),
  cargo text not null,
  squad_id text not null references squads (id),
  perfil text not null check (perfil in ('cord_mais', 'cord_menos')),
  foto_url text
);

create table ativos (
  id text primary key,
  nome text not null,
  tipo text not null check (tipo in ('skill', 'agente', 'mcp', 'framework', 'componente', 'esqueleto', 'design_system', 'harness')),
  resumo text not null default '',
  readme text not null default '',
  arquivos jsonb not null default '[]',          -- lista de {caminho, conteudo}
  manual_instalacao text not null default '',
  autor_id text not null references usuarios (id),
  squad_id text not null references squads (id), -- squad do autor no envio
  visibilidade text not null default 'squad' check (visibilidade in ('squad', 'frente', 'banco')),
  status text not null default 'rascunho' check (status in ('rascunho', 'barrado', 'em_aprovacao', 'devolvido', 'publicado')),
  derivado_de text references ativos (id),
  aprovado_por text references usuarios (id),
  comentario_coordenador text,
  tags text[] not null default '{}',
  ferramentas text[] not null default '{}',
  versao text not null default '1.0.0',
  acessos jsonb not null default '[]',
  -- Números do catálogo fictício anteriores aos eventos. Contador = base + eventos (RF-30).
  curtidas_base int not null default 0,
  instalacoes_base int not null default 0,
  derivacoes_base int not null default 0,
  squads_reuso_base text[] not null default '{}',
  criado_em timestamptz not null default now(),
  enviado_em timestamptz,
  publicado_em timestamptz,
  atualizado_em timestamptz not null default now()
);

create index ativos_status_idx on ativos (status);
create index ativos_derivado_de_idx on ativos (derivado_de);

-- Cada rodada do validador. ativo_id é nulo enquanto o rascunho não existe (docs/api.md).
create table validacoes (
  id text primary key,
  ativo_id text references ativos (id),
  ator_id text not null references usuarios (id),
  resultado text not null check (resultado in ('aprovado', 'barrado')),
  itens jsonb not null default '[]',
  criado_em timestamptz not null default now()
);

create table curtidas (
  usuario_id text not null references usuarios (id),
  ativo_id text not null references ativos (id),
  criado_em timestamptz not null default now(),
  primary key (usuario_id, ativo_id)
);

-- Trilha de tudo (RNF-01). Fonte dos contadores e do histórico do post.
create table eventos (
  id uuid primary key default gen_random_uuid(),
  tipo text not null check (tipo in ('intencao', 'busca', 'sugestao', 'decisao', 'validacao', 'envio', 'aprovacao', 'devolucao', 'instalacao', 'derivacao')),
  ator_id text not null references usuarios (id),
  ativo_id text references ativos (id),
  dados jsonb not null default '{}',
  criado_em timestamptz not null default now()
);

create index eventos_ativo_idx on eventos (ativo_id, tipo);

-- Contadores prontos para o feed e o detalhe (RF-25, RF-30).
-- security_invoker: a view respeita o RLS de quem consulta, em vez do dono.
create view ativos_contadores with (security_invoker = true) as
select
  a.id as ativo_id,
  a.curtidas_base + (select count(*) from curtidas c where c.ativo_id = a.id) as curtidas,
  a.instalacoes_base + (select count(*) from eventos e where e.ativo_id = a.id and e.tipo = 'instalacao') as instalacoes,
  a.derivacoes_base + (select count(*) from eventos e where e.ativo_id = a.id and e.tipo = 'derivacao') as derivacoes
from ativos a;

alter table squads enable row level security;
alter table usuarios enable row level security;
alter table ativos enable row level security;
alter table validacoes enable row level security;
alter table curtidas enable row level security;
alter table eventos enable row level security;
