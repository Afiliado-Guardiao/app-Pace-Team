# CLAUDE.md - Supabase

Backend do monorepo. **Não existe servidor Node.** O backend é um projeto
Supabase: PostgreSQL + Auth + Row Level Security + funções SQL + uma Edge
Function (Deno). Substituiu o antigo `base-server` (Fastify/Prisma/Docker).

## Hard Rules (inegociáveis)

- **PROIBIDO** editar uma migration já aplicada — migrations são append-only.
  Mudou o schema? Crie um arquivo novo em `supabase/migrations/`.
- **PROIBIDO** criar tabela em `public` sem `enable row level security` +
  policies. Tabela sem RLS exposta na API é vazamento de dados.
- **PROIBIDO** confiar em validação só no app — a regra de acesso vive na RLS
  e nas funções SQL, nunca apenas no cliente.
- **PROIBIDO** `security definer` sem `set search_path = ''` e sem qualificar
  todos os identificadores (`public.x`, `auth.y`).
- **PROIBIDO** usar a `service_role key` no app — ela só existe no servidor
  (Edge Function / secrets). No app vai apenas a `anon key`.
- **PROIBIDO** desabilitar `verify_jwt` em funções que não sejam webhooks
  públicos. Exceções (com verificação própria): `revenuecat-webhook` (header
  Authorization = secret `REVENUECAT_WEBHOOK_AUTH`) e a antiga `paywallo-webhook`
  (sem uso desde a troca para o RevenueCat).
- **PROIBIDO** ler/escrever segredo fora de `Deno.env.get(...)` nas Edge
  Functions. Nunca commitar `.env`.
- **SQL em minúsculas** — palavras-chave, tipos e nomes em `snake_case`.

## Estrutura

```
base-supabase/
├── supabase/
│   ├── config.toml                       # config do ambiente local da CLI
│   ├── migrations/
│   │   └── 20260521000000_init.sql       # schema + RLS + triggers + RPC
│   ├── functions/
│   │   └── paywallo-webhook/index.ts     # Edge Function (Deno)
│   └── seed.sql                          # dados opcionais de dev
├── .env.example                          # secrets do backend (webhook, CLI)
└── package.json                          # scripts da CLI do Supabase
```

## Modelo de dados

| Tabela | Papel | Escrita |
| :----- | :---- | :------ |
| `auth.users` | Identidade (email, senha, OAuth, sessões) | Supabase Auth |
| `public.profiles` | Dados do app por usuário (1:1 com `auth.users`) | Usuário (só `name`/`birthday`) + funções |
| `public.onboardings` | Respostas do onboarding | Usuário dono (RLS) |
| `public.subscriptions` | Estado de assinatura | Só `service_role` (webhook) |
| `public.webhook_events` | Idempotência de webhook | Só `service_role` (webhook) |

- `profiles.id` referencia `auth.users.id` com `on delete cascade`.
- O profile é criado automaticamente pelo trigger `on_auth_user_created`
  (função `handle_new_user`), inclusive para usuários anônimos.
- `referral_code` é gerado no signup e é **read-only** para o usuário.

## Autenticação

- **Supabase Auth nativo.** Não há JWT custom nem tabela de sessões.
- **Onboarding pré-cadastro** usa **login anônimo** (`signInAnonymously`). O
  usuário anônimo tem um `auth.uid()` real → a RLS funciona normalmente. No
  cadastro, ele vira permanente (mesmo `id`) — não há passo de "linkar".
- `enable_anonymous_sign_ins` precisa estar ligado (config.toml + Dashboard).
- Confirmação de e-mail desligada no template (`enable_confirmations = false`).
  Ligar em produção.

## Row Level Security

Padrão de policy (sempre mirando a role `authenticated`):

```sql
create policy "tabela_acao_own"
  on public.tabela for select          -- ou insert / update / delete / all
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);
```

- Use `(select auth.uid())` (com subselect) — o planner faz cache e a policy
  fica mais rápida.
- Restrinja **colunas** editáveis com `grant update (col_a, col_b) on ... to
  authenticated` em vez de tentar fazer isso na policy.
- Tabelas escritas só pelo backend: habilite RLS e **não crie policy** — a
  `service_role` ignora RLS, o resto fica bloqueado.

## Funções SQL (RPC)

- Lógica de negócio que precisa validar/atravessar linhas de outros usuários
  vira função `security definer` em `public`, chamada via `supabase.rpc(...)`.
- Toda função `security definer` **deve** ter `set search_path = ''` e
  qualificar tudo (`public.`, `auth.`).
- Cheque `auth.uid()` no início e `raise exception` quando inválido.
- Retorne `jsonb` com chaves em `camelCase` quando o app for consumir direto —
  evita mapear no cliente.
- `grant execute ... to authenticated` em toda função chamada pelo app.

## Edge Functions (Deno)

- Runtime é **Deno**, não Node. Imports via `npm:` / `jsr:` / URL.
- `SUPABASE_URL` e `SUPABASE_SERVICE_ROLE_KEY` são injetados automaticamente.
- Secrets custom: `Deno.env.get("NOME")`, definidos com `npm run secrets:set`.
- Webhook público: deploy com `--no-verify-jwt` **e** verificação própria
  (path secret + HMAC) dentro da função. Nunca só uma das duas.
- Comparação de segredos: sempre constant-time (`timingSafeEqual`).

## Webhook Paywallo

`supabase/functions/paywallo-webhook/index.ts` recebe eventos no formato
RevenueCat-compatible e mantém `subscriptions` + `profiles.is_premium`.

- **URL:** `.../functions/v1/paywallo-webhook?secret=<PAYWALLO_WEBHOOK_PATH_SECRET>`
- **Dupla verificação:** path secret (query `?secret=`) + HMAC-SHA256 do corpo
  bruto (header `X-Paywallo-Signature`, chave `PAYWALLO_WEBHOOK_HMAC_SECRET`).
- **Idempotência:** `webhook_events.event_id` é único; replays retornam
  `deduplicated: true`.
- **Eventos:** `INITIAL_PURCHASE`, `RENEWAL`, `CANCELLATION`, `EXPIRATION`,
  `UNCANCELLATION`.
- **`is_premium`:** `true` para status `active` / `in_grace_period` /
  `in_billing_retry`, `false` no resto.
- **Vínculo a usuário:** `event.app_user_id` — se for um UUID de profile
  conhecido, casa com `profiles.id`; senão a assinatura fica como anônima
  (`anonymous_user_id`).

## Comandos

```bash
npm run db:push          # aplica migrations no banco vinculado
npm run db:diff -f nome  # gera migration a partir de mudanças no Studio
npm run db:reset         # recria o banco local (migrations + seed)
npm run functions:deploy # publica a Edge Function
npm run secrets:set      # envia os secrets do .env
npm run gen:types        # gera tipos TypeScript do schema
npm run start            # sobe o Supabase local (precisa de Docker)
```

## Checklist: nova tabela

1. Criar a tabela em uma migration nova (`supabase/migrations/`)
2. `alter table ... enable row level security`
3. `grant` dos privilégios necessários para `authenticated`
4. Criar as policies (`select` / `insert` / `update` / `delete`)
5. Trigger `set_updated_at` se tiver coluna `updated_at`
6. `npm run db:push`
7. `npm run gen:types` se o app for consumir a tabela

## Checklist: nova função RPC

1. `create or replace function public.nome(...)` em uma migration
2. `security definer` + `set search_path = ''` se cruzar linhas de outros
3. Checar `auth.uid()` no início
4. Retornar `jsonb` em `camelCase` se o app consumir direto
5. `grant execute on function public.nome(...) to authenticated`
6. `npm run db:push`
