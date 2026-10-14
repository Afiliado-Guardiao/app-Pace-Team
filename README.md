<div align="center">

<br/>

```
 ██████╗  █████╗ ███████╗███████╗    ██████╗ ███████╗██╗   ██╗
 ██╔══██╗██╔══██╗██╔════╝██╔════╝    ██╔══██╗██╔════╝██║   ██║
 ██████╔╝███████║███████╗█████╗      ██║  ██║█████╗  ██║   ██║
 ██╔══██╗██╔══██║╚════██║██╔══╝      ██║  ██║██╔══╝  ╚██╗ ██╔╝
 ██████╔╝██║  ██║███████║███████╗    ██████╔╝███████╗ ╚████╔╝
 ╚═════╝ ╚═╝  ╚═╝╚══════╝╚══════╝    ╚═════╝ ╚══════╝  ╚═══╝
```

**Monorepo · Mobile + Supabase · Template de partida**

<br/>

<table>
<tr>
<td><img src="https://img.shields.io/badge/2_projetos-base--app_+_base--supabase-3178c6?style=flat-square" /></td>
<td><img src="https://img.shields.io/badge/Expo_SDK_54-000000?style=flat-square&logo=expo&logoColor=white" /></td>
<td><img src="https://img.shields.io/badge/Supabase-3ECF8E?style=flat-square&logo=supabase&logoColor=white" /></td>
<td><img src="https://img.shields.io/badge/PostgreSQL-336791?style=flat-square&logo=postgresql&logoColor=white" /></td>
</tr>
</table>

<br/>

<img src="https://skillicons.dev/icons?i=react,ts,supabase,postgres&theme=dark&perline=8" alt="stack" />

<br/>

</div>

---

<br/>

## `>` Sobre

**`base-development`** é o monorepo de templates de partida da Virex Tech. Reúne um app mobile (Expo) e um backend **Supabase** (Postgres + Auth + Edge Functions), pré-conectados, com autenticação, onboarding, i18n, testes e **Paywallo SDK** (paywalls, subscriptions, A/B testing) integrado no app. Clone, renomeie os domínios e comece a construir o que importa.

O backend **não tem servidor para hospedar**: é um projeto Supabase. Quem usa o template cria um projeto no Supabase, roda os SQLs e publica uma Edge Function — sem Docker, sem VPS, sem deploy de Node. O app fala direto com o Supabase via `@supabase/supabase-js`. O monorepo também guarda **skills** — guias de uso aprofundado do Paywallo SDK.

<br/>

## `>` Estrutura do monorepo

```
base-development/
│
├── base-app/             # Mobile — React Native + Expo SDK 54
│   ├── app/              #   Expo Router (file-based)
│   ├── src/              #   Features, components, store, theme, i18n
│   │   └── lib/supabase/ #   Cliente Supabase (auth, profile, onboarding…)
│   ├── README.md         #   Documentação do app
│   └── CLAUDE.md         #   Hard rules e convenções
│
├── base-supabase/        # Backend — Supabase (Postgres + Auth + Edge Functions)
│   └── supabase/
│       ├── migrations/   #   Schema + RLS + triggers + funções SQL
│       ├── functions/    #   Edge Function do webhook Paywallo (Deno)
│       └── config.toml   #   Configuração da CLI
│   ├── README.md         #   Setup do backend
│   └── CLAUDE.md         #   Hard rules e convenções
│
└── skills/               # Guias de integração (Paywallo SDK)
    ├── paywallo-full-skill.md
    ├── paywallo-sdk-setup.md
    ├── paywallo-paywall-skill.md
    ├── paywallo-funnel-tracking.md
    └── paywall-ab-testing.md
```

<br/>

## `>` Quick Start (stack completa)

```bash
# 0. Pré-requisitos
#    Node.js 22+, npm, conta no Supabase (supabase.com), Expo Go (no celular)
#    iOS: Xcode (Mac) ou EAS Build na nuvem (sem Mac)  ·  Android: Android Studio

git clone <repo-url> && cd base-development
```

### 1. Suba o backend (Supabase)

```bash
cd base-supabase
npm install
cp .env.example .env                  # preencha os secrets do webhook

# Crie um projeto em supabase.com/dashboard, então:
npx supabase login
npx supabase link --project-ref <SEU_PROJECT_REF>
npm run db:push                       # aplica o schema (migrations SQL)
npm run secrets:set                   # envia os secrets do webhook
npm run functions:deploy              # publica a Edge Function do Paywallo
```

No Dashboard do Supabase → **Authentication**: deixe _"Confirm email"_ desligado e _"Anonymous sign-ins"_ ligado. Passo a passo completo em [`base-supabase/README.md`](./base-supabase/README.md).

### 2. Suba o app (em outro terminal)

```bash
cd base-app
cp .env.example .env                  # cole EXPO_PUBLIC_SUPABASE_URL + ANON_KEY
npm install
cd ios && pod install && cd ..        # iOS apenas — pods do Paywallo SDK
npx expo start                        # ou npm run ios / npm run android
```

> A `URL` e a `anon key` ficam em **Project Settings → API** no Dashboard do Supabase.
>
> **Paywallo:** o `appKey` é obtido em [paywallo.com.br/dashboard](https://paywallo.com.br/dashboard). Sem ele, o SDK loga erro mas não derruba o app.
>
> **Sem Mac?** Gere o build iOS na nuvem com o EAS (`npm run eas:dev:ios`, `npm run eas:testflight`) — passo a passo em [`base-app/README.md`](./base-app/README.md#-sem-mac-build-ios-na-nuvem-eas).

<br/>

## `>` Os dois projetos

<table>
<tr>
<td width="50%" valign="top">

### 📱 [`base-app/`](./base-app/README.md)

Mobile template em **React Native + Expo**.

- **Stack:** Expo SDK 54 · React 19 · TypeScript · Zustand · React Query · i18next · Zod · Supabase JS · Paywallo SDK 2.10
- **Arquitetura:** features isoladas (DDD-inspired) em `src/features/`, camada Supabase em `src/lib/supabase/`
- **Pronto:** auth por e-mail (helpers Apple/Google prontos), onboarding multi-step, tema centralizado, i18n (pt-BR/en/es), Paywallo, testes Jest

```bash
cd base-app && npm start
```

Detalhes em [`base-app/README.md`](./base-app/README.md) · regras em [`base-app/CLAUDE.md`](./base-app/CLAUDE.md)

</td>
<td width="50%" valign="top">

### 🟢 [`base-supabase/`](./base-supabase/README.md)

Backend em **Supabase** — sem servidor para hospedar.

- **Stack:** PostgreSQL · Supabase Auth · Row Level Security · Edge Functions (Deno)
- **Arquitetura:** schema + RLS + triggers + funções RPC em `migrations/`; webhook em `functions/`
- **Pronto:** tabelas `profiles`/`onboardings`/`subscriptions`, RLS por usuário, RPCs de referral, webhook do Paywallo

```bash
cd base-supabase && npm run db:push
```

Detalhes em [`base-supabase/README.md`](./base-supabase/README.md) · regras em [`base-supabase/CLAUDE.md`](./base-supabase/CLAUDE.md)

</td>
</tr>
</table>

<br/>

## `>` Stack resumida

| Camada              | App (`base-app`)                        | Backend (`base-supabase`)         |
| :------------------ | :-------------------------------------- | :-------------------------------- |
| **Linguagem**       | TypeScript 5.9 (strict)                 | SQL + TypeScript (Deno)           |
| **Runtime**         | React Native 0.81 / Expo SDK 54         | Supabase (Postgres gerenciado)    |
| **Framework**       | Expo Router 6 (file-based)              | Supabase CLI                      |
| **Estado cliente**  | Zustand 5                               | —                                 |
| **Estado servidor** | React Query 5                           | —                                 |
| **Banco**           | —                                       | PostgreSQL + Row Level Security   |
| **Lógica server**   | —                                       | Funções SQL (RPC) + Edge Function |
| **Auth**            | Supabase Auth (`@supabase/supabase-js`) | Supabase Auth (sessões + OAuth)   |
| **i18n**            | i18next (pt-BR, en, es)                 | —                                 |
| **Testes**          | Jest + Testing Library                  | —                                 |
| **Lint/Format**     | ESLint 9 + Prettier 3                   | —                                 |
| **Monetização**     | Paywallo SDK 2.2 (paywalls, subs, A/B)  | Edge Function do webhook Paywallo |

<br/>

## `>` Skills (Paywallo)

O `@virex-tech/paywallo-sdk` v2.10.x **já vem plugado** no `base-app`. As skills em [`skills/`](./skills/) são guias de uso aprofundado:

| Skill                                                                 | Descrição                                                                                 |
| :-------------------------------------------------------------------- | :---------------------------------------------------------------------------------------- |
| [`paywallo-full-skill.md`](./skills/paywallo-full-skill.md)           | **Master guide** — visão arquitetural + checklist + integração com base-app/base-supabase |
| [`paywallo-sdk-setup.md`](./skills/paywallo-sdk-setup.md)             | Install, `PaywalloProvider`, `identify` no login, `reset` no logout                       |
| [`paywallo-paywall-skill.md`](./skills/paywallo-paywall-skill.md)     | `requireSubscriptionWithCampaign`, `presentCampaign`, `gateContent`, `useSubscription`    |
| [`paywallo-funnel-tracking.md`](./skills/paywallo-funnel-tracking.md) | `useOnboarding` (step/complete/drop), eventos custom com `track()`                        |
| [`paywall-ab-testing.md`](./skills/paywall-ab-testing.md)             | `sessionFlags` síncronos (anti-flicker), `getVariantCached`, conditional flags            |

> **Comece pelo `paywallo-full-skill.md`** — é o índice e tem o checklist ponta-a-ponta. A seção 7 cobre a Edge Function do webhook no `base-supabase`.

<br/>

## `>` Convenções compartilhadas

- **TypeScript strict** — `any` proibido, `unknown` em seu lugar
- **Sem `console.log`** em código commitado
- **1 export principal por arquivo**
- **Limites de tamanho** — componentes ≤200 linhas (app), funções ≤50 linhas
- **Imports ordenados** (ESLint enforce): builtins → 3rd-party → `@/` → relativos
- **Path aliases obrigatórios** — `@/components`, `@/features`, `@/lib`, etc.
- **SQL** — minúsculas, `snake_case`, RLS em toda tabela, migrations append-only

Antes de abrir PR, sempre rode `npm run check` no `base-app` (prettier + eslint + tsc).

<br/>

## `>` Workflow recomendado

### Rodando o app (dev local)

1. **Backend** — uma vez: configure o projeto Supabase (ver `base-supabase/README.md`)
2. **Terminal 1** — app: `cd base-app && npx expo start`

> Para iterar no backend localmente sem tocar o projeto hospedado, rode `cd base-supabase && npm run start` (Supabase local, precisa de Docker) e aponte o `.env` do app para a URL/anon key locais.

### Adicionando uma feature ponta a ponta

1. **No backend** — se precisar de tabela/coluna nova: crie uma migration em `base-supabase/supabase/migrations/`, com RLS, e rode `npm run db:push`. Lógica que cruza usuários vira função SQL (RPC).
2. **No app** — crie a feature em `src/features/nome/`; chamadas ao backend passam por `src/lib/supabase/`. Adicione traduções em `src/i18n/`.
3. **Testar** — `cd base-app && npm test`
4. **Validar** — `npm run check` no `base-app` antes do commit

<br/>

## `>` Comandos essenciais

<details>
<summary>&nbsp;<b>Setup inicial</b></summary>
<br/>

```bash
# Backend
cd base-supabase
npm install
cp .env.example .env
npx supabase link --project-ref <ref>
npm run db:push
npm run functions:deploy

# App
cd ../base-app
cp .env.example .env
npm install
```

</details>

<details>
<summary>&nbsp;<b>Dev</b></summary>
<br/>

```bash
# base-app
npm start                   # expo start
npm run ios                 # roda em device iOS
npm run android             # roda em device Android

# base-supabase (opcional — stack local, precisa de Docker)
npm run start               # sobe Supabase local
npm run status              # mostra URLs e chaves locais
```

</details>

<details>
<summary>&nbsp;<b>Backend (apenas base-supabase)</b></summary>
<br/>

```bash
npm run db:push             # aplica migrations no banco vinculado
npm run db:diff -f nome     # gera migration a partir de mudanças no Studio
npm run functions:deploy    # publica a Edge Function
npm run secrets:set         # envia os secrets do .env
npm run gen:types           # gera tipos TypeScript do schema
```

</details>

<details>
<summary>&nbsp;<b>Testes (apenas app)</b></summary>
<br/>

```bash
cd base-app
npm test                    # unit (Jest)
npm run test:watch
npm run test:coverage
```

</details>

<details>
<summary>&nbsp;<b>Qualidade</b></summary>
<br/>

```bash
cd base-app
npm run check      # prettier + eslint + tsc --noEmit
npm run fix        # auto-fix
npm run typecheck  # tsc --noEmit isolado
```

</details>

<br/>

## `>` Variáveis de ambiente

### `base-supabase/.env` (secrets da Edge Function — nunca vão para o app)

```env
PAYWALLO_WEBHOOK_PATH_SECRET=00000000-0000-0000-0000-000000000000
PAYWALLO_WEBHOOK_HMAC_SECRET=
```

> Não coloque variáveis com prefixo `SUPABASE_` aqui — o prefixo é reservado e
> `supabase secrets set` recusa o arquivo. O Project Ref vai direto no comando
> `supabase link --project-ref ...`.

### `base-app/.env`

```env
EXPO_PUBLIC_SUPABASE_URL=                       # Project Settings → API
EXPO_PUBLIC_SUPABASE_ANON_KEY=                  # anon / publishable key
EXPO_PUBLIC_PAYWALLO_APP_KEY=                   # paywallo.com.br/dashboard
EXPO_PUBLIC_POSTHOG_API_KEY=
EXPO_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com
EXPO_PUBLIC_SENTRY_DSN=
```

> Variáveis `EXPO_PUBLIC_` são embutidas no bundle — **não** coloque secrets aqui. A `anon key` do Supabase é pública por design (a segurança vem da RLS). Secrets reais ficam no `base-supabase`.

<br/>

## `>` Como forkar este template

1. Clone (ou use como template) o repositório
2. Renomeie os projetos (`base-app` → `meu-app`, `base-supabase` → `meu-backend`) — ajuste `name` em cada `package.json`
3. **Backend:** crie um projeto no [Supabase](https://supabase.com/dashboard), ajuste o schema em `supabase/migrations/`, e rode `npm run db:push`. Habilite _Anonymous sign-ins_ e ajuste a confirmação de e-mail no Dashboard.
4. **App:** ajuste `app.json` (nome, slug, bundle ID), cole a URL/anon key no `.env`, crie suas features em `src/features/`
5. **Paywallo:** crie um app no [dashboard](https://paywallo.com.br/dashboard), copie o `appKey` e configure a URL do webhook apontando para a Edge Function (ver [`skills/paywallo-full-skill.md`](./skills/paywallo-full-skill.md))
6. Configure CI/CD apontando para `npm run check` + `npm test` no `base-app`
7. Rode `npm run check` no `base-app` antes do primeiro commit no fork

<br/>

## `>` Troubleshooting rápido

| Sintoma                                                  | Provável causa / fix                                                                                  |
| :------------------------------------------------------- | :---------------------------------------------------------------------------------------------------- |
| App não conecta no Supabase                              | `EXPO_PUBLIC_SUPABASE_URL` / `ANON_KEY` vazios ou errados no `.env` — copie de Project Settings → API |
| Cadastro pede confirmação de e-mail                      | Desligue _"Confirm email"_ no Dashboard (Authentication → Email)                                      |
| Onboarding não funciona / erro de sessão                 | Ligue _"Anonymous sign-ins"_ no Dashboard do Supabase                                                 |
| Webhook do Paywallo responde `401`                       | `?secret=` ou `HMAC_SECRET` divergem — rode `npm run secrets:set` no `base-supabase`                  |
| `supabase db push` falha                                 | Rode `npx supabase migration list` e confira a ordem das migrations                                   |
| Expo Go reclama de versão de SDK                         | Atualize o app Expo Go no celular (precisa suportar SDK 54)                                           |
| iOS build falha após instalar deps                       | Rode `cd base-app/ios && pod install` (Paywallo SDK tem módulos nativos)                              |
| Console mostra `[Paywallo] init failed: MISSING_APP_KEY` | `EXPO_PUBLIC_PAYWALLO_APP_KEY` vazio no `.env` — pegue no dashboard Paywallo                          |

<br/>

---

<div align="center">

**`base-development`** · monorepo Virex Tech · template de partida para apps Mentorados

📱 [`base-app`](./base-app/README.md) &nbsp;·&nbsp; 🟢 [`base-supabase`](./base-supabase/README.md) &nbsp;·&nbsp; 🧩 [`skills/`](./skills/)

</div>
