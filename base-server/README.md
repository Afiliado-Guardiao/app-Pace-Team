<div align="center">

<br/>

```
██████╗  █████╗ ███████╗███████╗    ███████╗███████╗██████╗ ██╗   ██╗███████╗██████╗
██╔══██╗██╔══██╗██╔════╝██╔════╝    ██╔════╝██╔════╝██╔══██╗██║   ██║██╔════╝██╔══██╗
██████╔╝███████║███████╗█████╗      ███████╗█████╗  ██████╔╝██║   ██║█████╗  ██████╔╝
██╔══██╗██╔══██║╚════██║██╔══╝      ╚════██║██╔══╝  ██╔══██╗╚██╗ ██╔╝██╔══╝  ██╔══██╗
██████╔╝██║  ██║███████║███████╗    ███████║███████╗██║  ██║ ╚████╔╝ ███████╗██║  ██║
╚═════╝ ╚═╝  ╚═╝╚══════╝╚══════╝    ╚══════╝╚══════╝╚═╝  ╚═╝  ╚═══╝  ╚══════╝╚═╝  ╚═╝
```

**Template · API · DDD**

<br/>

<table>
<tr>
<td><img src="https://img.shields.io/badge/80-arquivos_TypeScript-3178c6?style=flat-square&logo=typescript&logoColor=white" /></td>
<td><img src="https://img.shields.io/badge/4-domínios-8b5cf6?style=flat-square&logoColor=white" /></td>
<td><img src="https://img.shields.io/badge/2-models_Prisma-2d3748?style=flat-square&logo=prisma&logoColor=white" /></td>
<td><img src="https://img.shields.io/badge/Node_22+-339933?style=flat-square&logo=node.js&logoColor=white" /></td>
</tr>
</table>

<br/>

<img src="https://skillicons.dev/icons?i=nodejs,ts,postgres,prisma,docker&theme=dark&perline=8" alt="stack" />

<br/>

</div>

---

<br/>

## `>` Sobre

**Base Server** é um template de backend pronto para uso — estruturado com DDD, Fastify, Prisma e TypeScript. O objetivo é eliminar o setup repetitivo e oferecer uma base sólida e consistente para novos projetos de API.

O template inclui autenticação completa (JWT + OAuth Apple/Google), domínios de usuário, onboarding e referral já implementados, além de infraestrutura configurada para testes de integração com banco real via Docker. Copie, renomeie os domínios, ajuste o schema e comece a construir o que importa.

<br/>

## `>` Quick Start

```bash
# 1. Clone e instale
git clone <repo-url> && cd base-server
npm install

# 2. Configure o ambiente
cp .env.example .env
# Edite .env (JWT_SECRET obrigatório, min 32 chars)

# 3. Suba o banco (Docker)
npm run docker:up

# 4. Prepare o banco
npm run db:setup        # generate + migrate
npm run prisma:seed     # seed opcional

# 5. Rode
npm run dev
```

O server roda em `http://localhost:11000` com health check em `/health`.

<br/>

## `>` Estrutura do projeto

```
src/
├── core/                  # Config (env, logger, i18n)
│
├── domain/                # 4 domínios isolados (DDD)
│   ├── auth/              #   Login, registro, JWT, OAuth (Apple, Google)
│   ├── user/              #   CRUD de usuário, perfil, senha
│   ├── onboarding/        #   Fluxo inicial
│   └── referral/          #   Código de indicação
│
├── infrastructure/        # Camada de infraestrutura
│   ├── http/              #   Fastify server + middlewares
│   └── database/          #   Prisma client
│
├── shared/                # Errors, types e constants compartilhados
│
├── utils/                 # Utilitários
│
└── server.ts              # Entry point
```

<br/>

## `>` Anatomia de um domínio

Todos os domínios seguem a mesma estrutura:

```
domain/[qualquer-um]/
│
├── routes/          →  Define os endpoints (GET, POST, PUT, DELETE)
├── controllers/     →  Recebe request, valida, chama service, devolve response
├── services/        →  Lógica de negócio
├── repositories/    →  Queries no banco (Prisma)
├── types/           →  Schemas Zod + interfaces TypeScript
├── errors/          →  Erros customizados do domínio
└── __tests__/       →  Testes de integração
```

O fluxo é sempre: **Route → Controller → Service → Repository → DB**

<br/>

## `>` Navegação rápida

| Quero...                   | Vou em...                                        |
| :------------------------- | :----------------------------------------------- |
| Criar um endpoint novo     | `src/domain/[dominio]/routes/` → `controllers/`  |
| Escrever lógica de negócio | `src/domain/[dominio]/services/`                 |
| Fazer query no banco       | `src/domain/[dominio]/repositories/`             |
| Criar uma migration        | `npm run db:migrate:dev -- --name descricao`     |
| Plugar rotas no servidor   | `src/infrastructure/http/`                       |
| Adicionar env var nova     | `.env` + `src/core/config/`                      |
| Adicionar novo domínio     | `src/domain/[nome]/` + factory `createXModule()` |

<br/>

## `>` Comandos

<details>
<summary>&nbsp;<b>Dev & Build</b></summary>
<br/>

```bash
npm run dev              # Hot reload (tsx watch)
npm run build            # Build de produção (tsup)
npm run start            # Roda o build
```

</details>

<details>
<summary>&nbsp;<b>Testes</b></summary>
<br/>

```bash
npm test                       # Jest silent
npm run test:watch             # Watch mode
npm run test:coverage          # Coverage
npm run test:integration       # Integração com DB real (Docker)
npm run test:integration:watch # Integração em watch mode
```

</details>

<details>
<summary>&nbsp;<b>Banco (Prisma)</b></summary>
<br/>

```bash
npm run prisma:generate   # Gera client após mudar schema
npm run prisma:studio     # GUI do banco
npm run prisma:seed       # Seed inicial
npm run db:setup          # generate + migrate (combo)
npm run db:seed           # Alias para prisma:seed
```

**Migrations versionadas** (use sempre que o schema vai para staging/prod):

```bash
# Dev — gera arquivo em prisma/migrations/ e atualiza o client
npm run db:migrate:dev -- --name descricao_da_mudanca

# Staging/Prod/CI — aplica pendentes sem interação
npm run db:migrate:deploy

# Reset local (drop + recreate + migrate + seed)
npm run db:migrate:reset
```

> `db push` é permitido apenas para prototipagem local rápida — nunca em staging/prod.

</details>

<details>
<summary>&nbsp;<b>Docker</b></summary>
<br/>

```bash
npm run docker:up           # Sobe tudo
npm run docker:down         # Desce e limpa
npm run docker:clean        # Remove containers sem shutdown
npm run docker:logs         # Logs do container api (tail 200)
npm run docker:exec:api     # Shell dentro do container
npm run docker:exec:db      # Conecta direto no postgres
npm run docker:seed         # Seed via container
npm run docker:deploy       # Deploy
npm run docker:deploy:clean # Deploy com limpeza
```

</details>

<details>
<summary>&nbsp;<b>Qualidade</b></summary>
<br/>

```bash
npm run check      # prettier + eslint + tsc --noEmit
npm run fix        # eslint --fix + prettier --write
npm run typecheck  # tsc --noEmit isolado
npm run lint       # ESLint isolado
```

</details>

<br/>

---

<div align="center">

**`base-server`** · v1.0.0 · 80 arquivos · 6.428 linhas de TypeScript · 4 domínios · 2 models Prisma

</div>
