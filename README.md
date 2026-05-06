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

**Monorepo · Mobile + API · Template de partida**

<br/>

<table>
<tr>
<td><img src="https://img.shields.io/badge/2_projetos-base--app_+_base--server-3178c6?style=flat-square" /></td>
<td><img src="https://img.shields.io/badge/Expo_SDK_54-000000?style=flat-square&logo=expo&logoColor=white" /></td>
<td><img src="https://img.shields.io/badge/Fastify_5-000000?style=flat-square&logo=fastify&logoColor=white" /></td>
<td><img src="https://img.shields.io/badge/PostgreSQL-336791?style=flat-square&logo=postgresql&logoColor=white" /></td>
</tr>
</table>

<br/>

<img src="https://skillicons.dev/icons?i=react,ts,nodejs,postgres,prisma,docker&theme=dark&perline=8" alt="stack" />

<br/>

</div>

---

<br/>

## `>` Sobre

**`base-development`** é o monorepo de templates de partida da Virex Tech. Reúne dois projetos prontos para fork — um app mobile (Expo) e uma API (Fastify/Prisma) — pré-conectados, com autenticação, onboarding, i18n, testes, infraestrutura Docker e **Paywallo SDK** (paywalls, subscriptions, A/B testing) integrado no app. Clone, renomeie os domínios e comece a construir o que importa.

Os dois projetos foram desenhados para conversar entre si: o app consome o server via React Query, com o mesmo schema Zod compartilhado em espírito (autenticação JWT, OAuth Apple/Google, fluxo de onboarding multi-step). O monorepo também guarda **skills** — guias de uso aprofundado do Paywallo SDK que já vem plugado no `base-app`.

<br/>

## `>` Estrutura do monorepo

```
base-development/
│
├── base-app/             # Mobile — React Native + Expo SDK 54
│   ├── app/              #   Expo Router (file-based)
│   ├── src/              #   Features, components, store, theme, i18n
│   ├── README.md         #   Documentação do app
│   └── CLAUDE.md         #   Hard rules e convenções
│
├── base-server/          # Backend — Fastify + Prisma + PostgreSQL
│   ├── src/              #   Domain (DDD), infrastructure, shared
│   ├── prisma/           #   Schema + migrations + seed
│   ├── docker/           #   production / staging / test
│   ├── README.md         #   Documentação do server
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

Para rodar app + server localmente do zero:

```bash
# 0. Pré-requisitos
#    Node.js 22+, npm, Docker Desktop, Expo Go (no celular)
#    iOS: Xcode (Mac)  ·  Android: Android Studio

git clone <repo-url> && cd base-development
```

### 1. Suba o backend

```bash
cd base-server
cp .env.example .env                  # JWT_SECRET obrigatório (min 32 chars)
npm install
npm run docker:up                     # PostgreSQL via Docker
npm run db:setup                      # prisma generate + migrate
npm run prisma:seed                   # opcional
npm run dev                           # http://localhost:11000
```

Health check: `curl http://localhost:11000/health`

### 2. Suba o app (em outro terminal)

```bash
cd base-app
cp .env.example .env                  # ajuste EXPO_PUBLIC_API_URL e EXPO_PUBLIC_PAYWALLO_APP_KEY
npm install
cd ios && pod install && cd ..        # iOS apenas — pods do Paywallo SDK
npx expo start                        # ou npm run ios / npm run android
```

> Para rodar no device físico, use o IP da máquina em `EXPO_PUBLIC_API_URL` (ex: `http://192.168.0.10:11000`), não `localhost`.
>
> **Paywallo:** o `appKey` é obtido em [paywallo.com.br/dashboard](https://paywallo.com.br/dashboard). Sem ele, o SDK loga erro mas não derruba o app — você pode rodar o template sem Paywallo até estar pronto pra configurar.

<br/>

## `>` Os dois projetos

<table>
<tr>
<td width="50%" valign="top">

### 📱 [`base-app/`](./base-app/README.md)

Mobile template em **React Native + Expo**.

- **Stack:** Expo SDK 54 · React 19 · TypeScript · Zustand · React Query · i18next · Zod · Paywallo SDK 2.1
- **Arquitetura:** features isoladas (DDD-inspired) em `src/features/`, bridge Paywallo em `src/lib/paywallo/`
- **Pronto:** Apple/Google Sign-in, onboarding multi-step, tema centralizado, i18n (pt-BR/en/es), Paywallo (identify/reset reativo, hooks de A/B test e gate), testes Jest com mock do SDK

```bash
cd base-app && npm start
```

Detalhes em [`base-app/README.md`](./base-app/README.md) · regras em [`base-app/CLAUDE.md`](./base-app/CLAUDE.md)

</td>
<td width="50%" valign="top">

### 🖥️ [`base-server/`](./base-server/README.md)

API template em **Fastify + Prisma**.

- **Stack:** Node 22 · Fastify 5 · TypeScript · PostgreSQL · Prisma 6 · Zod · Winston · i18next
- **Arquitetura:** DDD com factory pattern (DI manual) em `src/domain/`
- **Pronto:** JWT + OAuth (Apple/Google), domínios `auth`/`user`/`onboarding`/`referral`, Docker para dev/staging/prod, testes de integração com DB real

```bash
cd base-server && npm run dev
```

Detalhes em [`base-server/README.md`](./base-server/README.md) · regras em [`base-server/CLAUDE.md`](./base-server/CLAUDE.md)

</td>
</tr>
</table>

<br/>

## `>` Stack resumida

| Camada              | App (`base-app`)                       | Server (`base-server`)             |
| :------------------ | :------------------------------------- | :--------------------------------- |
| **Linguagem**       | TypeScript 5.9 (strict)                | TypeScript 5.9 (strict)            |
| **Runtime**         | React Native 0.81 / Expo SDK 54        | Node.js 22+                        |
| **Framework**       | Expo Router 6 (file-based)             | Fastify 5                          |
| **Estado cliente**  | Zustand 5                              | —                                  |
| **Estado servidor** | React Query 5                          | Stateless via JWT + `loginVersion` |
| **Banco**           | —                                      | PostgreSQL via Prisma 6            |
| **Validação**       | Zod 3                                  | Zod 3                              |
| **Auth**            | Apple/Google/Email (delega server)     | JWT + OAuth Apple/Google           |
| **i18n**            | i18next (pt-BR, en, es)                | i18next (file-system backend)      |
| **Testes**          | Jest + Testing Library                 | Jest + Supertest + DB real         |
| **Lint/Format**     | ESLint 9 + Prettier 3                  | ESLint 9 + Prettier 3              |
| **Monetização**     | Paywallo SDK 2.1 (paywalls, subs, A/B) | —                                  |
| **Observability**   | Sentry / PostHog (opcional)            | Winston logger                     |

<br/>

## `>` Skills (Paywallo)

O `@virex-tech/paywallo-sdk` v2.1.x **já vem plugado** no `base-app` (Provider montado, identify/reset reativo, mock no Jest). As skills em [`skills/`](./skills/) são guias de uso aprofundado para implementar paywalls, A/B test e funnel tracking sobre o que já está integrado:

| Skill                                                                 | Descrição                                                                               |
| :-------------------------------------------------------------------- | :-------------------------------------------------------------------------------------- |
| [`paywallo-full-skill.md`](./skills/paywallo-full-skill.md)           | **Master guide** — visão arquitetural + checklist consolidado + integração com base-app |
| [`paywallo-sdk-setup.md`](./skills/paywallo-sdk-setup.md)             | Install, `PaywalloProvider`, `identify` no login, `reset` no logout, wiring de erros    |
| [`paywallo-paywall-skill.md`](./skills/paywallo-paywall-skill.md)     | `requireSubscriptionWithCampaign`, `presentCampaign`, `gateContent`, `useSubscription`  |
| [`paywallo-funnel-tracking.md`](./skills/paywallo-funnel-tracking.md) | `useOnboarding` (step/complete/drop), eventos custom com `track()`                      |
| [`paywall-ab-testing.md`](./skills/paywall-ab-testing.md)             | `sessionFlags` síncronos (anti-flicker), `getVariantCached`, conditional flags          |

> **Comece pelo `paywallo-full-skill.md`** — ele é o índice e tem o checklist ponta-a-ponta. As outras skills aprofundam cada área. Todas alinhadas ao SDK v2.1.x e às hard rules do `base-app/CLAUDE.md`.

<br/>

## `>` Convenções compartilhadas

Os dois projetos seguem o **mesmo conjunto de regras** (detalhes nos respectivos `CLAUDE.md`):

- **TypeScript strict** — `any` proibido, `unknown` em seu lugar
- **Sem `console.log`** em código commitado — usar logger (server) ou remover (app)
- **Sem singletons globais** — DI por construtor / factory pattern (server)
- **1 export principal por arquivo**
- **Limites de tamanho** — componentes ≤200 linhas (app), services ≤250 linhas (server), funções ≤50 linhas
- **Imports ordenados** (ESLint enforce): builtins → 3rd-party → `@/` → relativos
- **Path aliases obrigatórios** — `@/components`, `@/features`, `@/domain`, etc. Sem `../../` profundos
- **Naming** — `IPrefix` para interfaces, `PascalCase` para classes/componentes, `camelCase` para hooks/funções, `UPPER_SNAKE_CASE` para constantes

Antes de abrir PR, sempre:

```bash
npm run check      # prettier + eslint + tsc --noEmit
```

<br/>

## `>` Workflow recomendado

### Rodando tudo junto (dev local)

1. **Terminal 1** — server: `cd base-server && npm run docker:up && npm run dev`
2. **Terminal 2** — app: `cd base-app && npx expo start`
3. **Terminal 3** (opcional) — Prisma Studio: `cd base-server && npm run prisma:studio`

### Adicionando uma nova feature ponta-a-ponta

1. **No server** — criar domínio: `src/domain/nome/` com `routes/controllers/services/repositories/types/__tests__/index.ts` (factory). Registrar em `server.ts`. Se mexer em schema → `npm run db:migrate:dev -- --name x`. Checklist completo no [`base-server/CLAUDE.md`](./base-server/CLAUDE.md).
2. **No app** — criar feature: `src/features/nome/` com `index.tsx/components/hooks/styles/types/validation/`. Adicionar rota em `app/`. Adicionar traduções em `src/i18n/resources/`. Checklist completo no [`base-app/CLAUDE.md`](./base-app/CLAUDE.md).
3. **Testar** — server: `npm run test:integration` · app: `npm test`
4. **Validar qualidade** — `npm run check` em ambos antes do commit

### Trabalhando só com o app

Aponte `EXPO_PUBLIC_API_URL` para uma API já hospedada (staging) e ignore o passo do server.

### Trabalhando só com o server

Use `npm run prisma:studio` para inspecionar dados e `app.inject()` (via testes de integração) para chamar endpoints sem precisar do app.

<br/>

## `>` Comandos essenciais

<details>
<summary>&nbsp;<b>Setup inicial</b></summary>
<br/>

```bash
# Server
cd base-server
cp .env.example .env
npm install
npm run docker:up
npm run db:setup
npm run prisma:seed         # opcional

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
# base-server
npm run dev                 # tsx watch — hot reload
npm run prisma:studio       # GUI do banco

# base-app
npm start                   # expo start
npm run ios                 # roda em device iOS
npm run android             # roda em device Android
```

</details>

<details>
<summary>&nbsp;<b>Banco (apenas server)</b></summary>
<br/>

```bash
npm run db:migrate:dev -- --name descricao   # criar migration
npm run db:migrate:deploy                    # aplicar (CI/prod)
npm run db:migrate:reset                     # reset local
npm run prisma:generate                      # regerar client
```

> `db push` é para prototipagem local apenas. Mudanças que vão para staging/prod **devem** virar migration versionada.

</details>

<details>
<summary>&nbsp;<b>Testes</b></summary>
<br/>

```bash
# base-server
npm test                          # unit (silent)
npm run test:integration          # com DB real (Docker)
npm run test:coverage             # cobertura

# base-app
npm test
npm run test:watch
npm run test:coverage
```

</details>

<details>
<summary>&nbsp;<b>Qualidade (em ambos)</b></summary>
<br/>

```bash
npm run check      # prettier + eslint + tsc --noEmit
npm run fix        # auto-fix
npm run typecheck  # tsc --noEmit isolado
```

</details>

<details>
<summary>&nbsp;<b>Docker (apenas server)</b></summary>
<br/>

```bash
npm run docker:up           # sobe API + Postgres
npm run docker:down         # desce e limpa
npm run docker:logs         # tail dos logs da API
npm run docker:exec:db      # psql no container
```

</details>

<br/>

## `>` Variáveis de ambiente

### `base-server/.env`

```env
NODE_ENV=development
BASE_PORT=11000
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/pushtime_dev
JWT_SECRET=                    # min 32 chars — gere um aleatório
JWT_EXPIRATION=7d
RATE_LIMIT=40
RATE_LIMIT_TIMEWINDOW=60000
AUTH_RATE_LIMIT=5
LOG_LEVEL=info
```

### `base-app/.env`

```env
EXPO_PUBLIC_API_URL=http://localhost:11000      # IP da máquina em device físico
EXPO_PUBLIC_PAYWALLO_APP_KEY=                   # paywallo.com.br/dashboard → seu app → Settings
EXPO_PUBLIC_POSTHOG_API_KEY=
EXPO_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com
EXPO_PUBLIC_SENTRY_DSN=
```

> Variáveis prefixadas com `EXPO_PUBLIC_` são embutidas no bundle do app — **não** coloque secrets aqui. Secrets reais ficam no server.

<br/>

## `>` Como forkar este template

1. Clone (ou use como template) o repositório
2. Renomeie os projetos (`base-app` → `meu-app`, `base-server` → `meu-server`) — ajuste `name` em cada `package.json`
3. **Server**: edite `prisma/schema.prisma` para seus models, gere a primeira migration e ajuste os domínios em `src/domain/` (mantenha `auth` se quiser usar o stack de autenticação pronto)
4. **App**: ajuste `app.json` (nome, slug, bundle ID), atualize traduções em `src/i18n/`, e crie suas features em `src/features/`
5. **Paywallo**: crie um app no [dashboard](https://paywallo.com.br/dashboard), copie o `appKey` para `base-app/.env`, e crie os placements/flags que vai usar (veja [`skills/paywallo-full-skill.md`](./skills/paywallo-full-skill.md))
6. Configure CI/CD apontando para `npm run check` + `npm test` em cada projeto
7. Rode `npm run check` nos dois projetos antes do primeiro commit no fork

<br/>

## `>` Troubleshooting rápido

| Sintoma                                                  | Provável causa / fix                                                                              |
| :------------------------------------------------------- | :------------------------------------------------------------------------------------------------ |
| App não conecta no server (timeout)                      | `EXPO_PUBLIC_API_URL` está como `localhost` em device físico — troque pelo IP da máquina          |
| `JWT_SECRET must be at least 32 characters`              | Gere um secret válido: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"` |
| `prisma generate` falha após editar schema               | Rode `npm run db:migrate:dev -- --name x` em vez de `db push`                                     |
| Container do Postgres não sobe (porta 5432 ocupada)      | Tem outro Postgres rodando local — pare-o ou ajuste `BASE_PORT`/porta do compose                  |
| Expo Go reclama de versão de SDK                         | Atualize o app Expo Go no celular (precisa suportar SDK 54)                                       |
| `tsc` reclama de path alias após mover arquivo           | Verifique `tsconfig.json` — paths são por projeto, não compartilhados na raiz                     |
| iOS build falha após instalar deps                       | Rode `cd base-app/ios && pod install` (Paywallo SDK tem módulos nativos)                          |
| Console mostra `[Paywallo] init failed: MISSING_APP_KEY` | `EXPO_PUBLIC_PAYWALLO_APP_KEY` vazio no `.env` — pegue no dashboard Paywallo                      |

<br/>

---

<div align="center">

**`base-development`** · monorepo Virex Tech · template de partida para apps Mentorados

📱 [`base-app`](./base-app/README.md) &nbsp;·&nbsp; 🖥️ [`base-server`](./base-server/README.md) &nbsp;·&nbsp; 🧩 [`skills/`](./skills/)

</div>
