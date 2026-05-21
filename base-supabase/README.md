<div align="center">

<br/>

```
 ██████╗  █████╗ ███████╗███████╗   ███████╗██╗   ██╗██████╗  █████╗ ██████╗  █████╗ ███████╗███████╗
 ██╔══██╗██╔══██╗██╔════╝██╔════╝   ██╔════╝██║   ██║██╔══██╗██╔══██╗██╔══██╗██╔══██╗██╔════╝██╔════╝
 ██████╔╝███████║███████╗█████╗     ███████╗██║   ██║██████╔╝███████║██████╔╝███████║███████╗█████╗
 ██╔══██╗██╔══██║╚════██║██╔══╝     ╚════██║██║   ██║██╔═══╝ ██╔══██║██╔══██╗██╔══██║╚════██║██╔══╝
 ██████╔╝██║  ██║███████║███████╗   ███████║╚██████╔╝██║     ██║  ██║██████╔╝██║  ██║███████║███████╗
 ╚═════╝ ╚═╝  ╚═╝╚══════╝╚══════╝   ╚══════╝ ╚═════╝ ╚═╝     ╚═╝  ╚═╝╚═════╝ ╚═╝  ╚═╝╚══════╝╚══════╝
```

**Backend do template · Supabase · sem servidor para hospedar**

<br/>

<img src="https://skillicons.dev/icons?i=supabase,postgres,deno&theme=dark" alt="stack" />

<br/>

</div>

---

## `>` Sobre

**`base-supabase`** é o backend do monorepo. Substitui o antigo `base-server`
(Fastify + Prisma + Docker) por um projeto **Supabase**: banco PostgreSQL,
autenticação, regras de acesso e a única função de servidor que ainda existe
(o webhook do Paywallo).

**Você não hospeda nada.** O Supabase roda o banco, a autenticação e a Edge
Function. Quem usa o template só precisa criar um projeto no Supabase e rodar
três comandos.

### O que cada parte faz

| Parte | Arquivo | Função |
| :---- | :------ | :----- |
| **Schema + regras** | `supabase/migrations/*.sql` | Tabelas, Row Level Security, triggers e funções RPC |
| **Webhook Paywallo** | `supabase/functions/paywallo-webhook/` | Edge Function (Deno) que recebe eventos de assinatura |
| **Config local** | `supabase/config.toml` | Configuração do ambiente local da CLI |
| **Seed** | `supabase/seed.sql` | Dados opcionais de desenvolvimento |

### O que sumiu (e por quê)

| Antes (`base-server`) | Agora |
| :-------------------- | :---- |
| Servidor Node + Fastify | — (não existe mais servidor) |
| Docker + Postgres na VPS | Postgres gerenciado pelo Supabase |
| JWT custom + `loginVersion` + bcrypt | Supabase Auth (sessões + refresh token nativos) |
| Controllers / Services / Repositories | RLS + funções SQL (RPC) |
| Rota Fastify do webhook | Edge Function (Deno) |
| `prisma migrate` | `supabase db push` (migrations SQL) |

<br/>

## `>` Modelo de dados

```
auth.users            ← gerenciado pelo Supabase (email, senha, OAuth, sessões)
│
└─ public.profiles    ← dados do app (1:1 com auth.users)
   ├─ name, birthday
   ├─ referral_code (gerado no signup), referred_by_code, referred_by_id
   └─ is_premium (atualizado pelo webhook)

public.onboardings    ← respostas do onboarding (1 por usuário, inclui anônimo)
public.subscriptions  ← estado de assinatura (escrito só pelo webhook)
public.webhook_events ← idempotência dos eventos do Paywallo
```

Toda tabela tem **Row Level Security**: cada usuário só lê/escreve as próprias
linhas. `subscriptions` e `webhook_events` só são escritas pela Edge Function
(que usa a `service_role`).

### Funções RPC (chamadas pelo app via `supabase.rpc(...)`)

| Função | O que faz |
| :----- | :-------- |
| `apply_referral_code(p_code)` | Valida e aplica um código de indicação ao usuário logado |
| `get_referral_stats()` | Retorna `myCode`, `usedCode` e `referralsCount` |
| `delete_account()` | Apaga a própria conta (`auth.users` → cascata) |

<br/>

## `>` Setup (projeto hospedado)

> Pré-requisito: Node.js 22+. A CLI do Supabase já vem como dependência —
> use `npx supabase ...` ou os scripts `npm run ...` deste pacote.

```bash
cd base-supabase
npm install
cp .env.example .env          # preencha os secrets do webhook
```

### 1. Crie o projeto no Supabase

Acesse [supabase.com/dashboard](https://supabase.com/dashboard) → **New project**.
Anote a senha do banco. Quando terminar de provisionar, copie o **Project Ref**
(em Project Settings → General).

### 2. Vincule e suba o schema

```bash
npx supabase login                       # abre o navegador uma vez
npx supabase link --project-ref <SEU_PROJECT_REF>
npm run db:push                          # aplica supabase/migrations/ no banco
```

### 3. Publique a Edge Function do webhook

```bash
npm run secrets:set                      # envia os secrets do .env
npm run functions:deploy                 # publica a paywallo-webhook
```

A URL pública do webhook fica:

```
https://<SEU_PROJECT_REF>.supabase.co/functions/v1/paywallo-webhook?secret=<PAYWALLO_WEBHOOK_PATH_SECRET>
```

Cole essa URL no dashboard do Paywallo (**Integrations → Webhooks**).

### 4. Ajuste a autenticação no Dashboard

Em **Authentication** do projeto:

- **Sign In / Providers → Email**: deixe _"Confirm email"_ **desligado** (cadastro
  instantâneo, igual ao template). Ligue em produção.
- **Sign In / Providers → Anonymous sign-ins**: **ligado** (o onboarding
  pré-cadastro depende disso).
- **Apple / Google** (opcional): preencha as credenciais para habilitar login
  social. Veja a seção _Login social_ abaixo.

### 5. Conecte o app

Em **Project Settings → API**, copie:

- **Project URL** → `EXPO_PUBLIC_SUPABASE_URL` no `base-app/.env`
- **anon / public key** → `EXPO_PUBLIC_SUPABASE_ANON_KEY` no `base-app/.env`

> Projetos novos chamam a anon key de **publishable key** (`sb_publishable_...`).
> É o mesmo papel — é a chave pública, segura para ir no app.

<br/>

## `>` Desenvolvimento local (opcional)

Para rodar todo o Supabase na sua máquina (precisa de Docker):

```bash
npm run start            # sobe Postgres + Auth + Studio + Edge Runtime
npm run functions:serve  # roda a Edge Function localmente
npm run status           # mostra URLs e chaves locais
npm run stop             # derruba tudo
```

- **Studio** (GUI do banco): http://127.0.0.1:54323
- **Inbucket** (e-mails de teste): http://127.0.0.1:54324

Aponte o `base-app/.env` para a URL e a anon key locais (`npm run status` mostra
ambas) para desenvolver sem tocar no projeto hospedado.

<br/>

## `>` Comandos

```bash
npm run db:push          # aplica migrations no banco vinculado
npm run db:diff          # gera SQL a partir de mudanças feitas no Studio
npm run db:reset         # recria o banco local (migrations + seed)
npm run functions:deploy # publica a Edge Function
npm run secrets:set      # envia os secrets do .env para o projeto
npm run gen:types        # gera tipos TypeScript do schema
```

### Criando uma migration

```bash
# 1. Crie um arquivo novo em supabase/migrations/ com timestamp:
#    AAAAMMDDHHMMSS_descricao.sql
# 2. Escreva o SQL (sempre incremental — nunca edite migrations já aplicadas)
# 3. npm run db:push
```

> Alternativa: altere o schema pelo **Studio** e rode `npm run db:diff -f nome`
> para gerar a migration automaticamente.

<br/>

## `>` Login social (Apple / Google)

O app usa `signInWithIdToken` — o login nativo gera um ID token que o Supabase
valida. Para ativar:

1. **Apple**: crie um _Service ID_ no Apple Developer e configure o provider
   Apple no Dashboard (Authentication → Providers).
2. **Google**: crie credenciais OAuth no Google Cloud Console e configure o
   provider Google no Dashboard.
3. No `base-app`, instale os módulos nativos de login e troque os stubs
   _"em breve"_ pelas chamadas reais — o helper `signInWithApple` /
   `signInWithGoogle` já está pronto em `base-app/src/lib/supabase/auth.ts`.

Detalhes: [Login With Apple](https://supabase.com/docs/guides/auth/social-login/auth-apple) ·
[Login With Google](https://supabase.com/docs/guides/auth/social-login/auth-google).

<br/>

## `>` Troubleshooting

| Sintoma | Causa provável / fix |
| :------ | :------------------- |
| `supabase link` pede senha do banco | Use a senha definida ao criar o projeto (ou redefina em Settings → Database) |
| Webhook responde `401 invalid_secret` | `?secret=` da URL ≠ `PAYWALLO_WEBHOOK_PATH_SECRET`; rode `npm run secrets:set` |
| Webhook responde `401 invalid_signature` | `PAYWALLO_WEBHOOK_HMAC_SECRET` ≠ o configurado no Paywallo |
| Cadastro pede confirmação de e-mail | Desligue _"Confirm email"_ no Dashboard (Authentication → Email) |
| App não cria usuário anônimo | Ligue _"Anonymous sign-ins"_ no Dashboard |
| `npm run db:push` falha | Rode `npx supabase migration list` e confira a ordem das migrations |

<br/>

---

<div align="center">

**`base-supabase`** · backend do monorepo Virex Tech

📱 [`base-app`](../base-app/README.md) &nbsp;·&nbsp; 🧩 [`skills/`](../skills/) &nbsp;·&nbsp; regras em [`CLAUDE.md`](./CLAUDE.md)

</div>
