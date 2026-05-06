# CLAUDE.md - Server

Backend Fastify/Prisma com arquitetura DDD (Domain-Driven Design) e injeção de dependência via factory pattern.

## Hard Rules (inegociáveis)

- **PROIBIDO** `any` — usar `unknown` quando o tipo não é conhecido
- **PROIBIDO** `// @ts-ignore` e `// @ts-expect-error` sem justificativa em comentário
- **PROIBIDO** `console.log` / `console.error` — usar `Logger` injetado
- **PROIBIDO** lógica de negócio em Controllers — só HTTP (parse, validate, respond)
- **PROIBIDO** queries Prisma fora de Repositories — Services nunca acessam DB diretamente
- **PROIBIDO** acessar `request` ou `reply` do Fastify fora de Controllers/Middleware/Routes
- **PROIBIDO** imports entre domínios de implementação — só via types (interfaces)
- **PROIBIDO** imports circulares
- **PROIBIDO** lançar strings como erro — sempre instâncias de `Error` ou `DomainError`
- **PROIBIDO** `try/catch` genérico que engole erro sem log ou re-throw
- **PROIBIDO** singletons globais (`export default new Service()`) — usar DI via constructor
- **1 classe/função principal por arquivo** — sem exceção
- **Testes de repositório com DB real** — nunca mock do Prisma

## Limites de Tamanho

| Tipo | Max linhas |
|---|---|
| Controller | **200** |
| Service | **250** |
| Repository | **200** |
| Routes | **80** |
| Middleware | **150** |
| Factory (`index.ts`) | **50** |
| Types/Schemas (Zod) | **150** |
| Função individual | **50** |

- **Max 4 parâmetros** por função/constructor — acima disso, usar objeto de opções
- **Max 3 níveis** de aninhamento (depth) em qualquer função
- **Complexidade ciclomática max 10** por função

> Se um arquivo ultrapassa o limite → refatorar antes de continuar. Nunca "só dessa vez".

## Arquitetura de Camadas

```
Controllers  → HTTP (Fastify request/reply)
Services     → Lógica de negócio
Repositories → Dados (Prisma)
Middleware   → Auth, validação, interceptação
```

**Fluxo obrigatório:** Route → Controller → Service → Repository

| Camada | Faz | Não faz |
|---|---|---|
| **Controller** | Valida com Zod, chama service, formata response, trata erros | Lógica de negócio, queries DB |
| **Service** | Orquestra regras de negócio, chama repositories, lança DomainErrors | Acessa request/reply, queries SQL diretas |
| **Repository** | CRUD via Prisma, mapeia erros do Prisma pra DomainErrors | Lógica de negócio, formatação de response |
| **Middleware** | Valida token, injeta user context no request | Lógica de negócio |

## Estrutura de Domínio

Cada domínio é um **bounded context** auto-contido:

```
domain/auth/
├── controllers/AuthController.ts
├── services/AuthService.ts
├── repositories/AuthRepository.ts
├── middleware/AuthMiddleware.ts
├── routes/auth.routes.ts
├── errors/AuthError.ts         # ou em shared/errors
├── types/index.ts              # Zod schemas + interfaces
├── constants/index.ts
├── utils/                      # Opcional
├── __tests__/                  # Testes de integração
└── index.ts                    # Factory (DI assembly)
```

**Regras de isolamento:**
- Domínios comunicam via **interfaces** (`IAuthService`, `IOnboardingService`), nunca imports diretos de implementação
- Código compartilhado vai pra `src/shared/` (errors, constants, types)
- Infraestrutura vai pra `src/infrastructure/` (Database, App)
- Cada domínio DEVE ter factory function em `index.ts`

## Dependency Injection (Factory Pattern)

Sem IoC container. Dependências via constructor, assembly em factory functions.

```typescript
// domain/auth/index.ts — Factory function
import { Logger } from "@/core/config/logger";
import { IOnboardingService } from "@/domain/onboarding/types";
import { ISubscriptionService } from "@/domain/subscription/types";
import { Database } from "@/infrastructure/database/Database";

import { AuthController } from "./controllers/AuthController";
import { AuthMiddleware } from "./middleware/AuthMiddleware";
import { AuthRepository } from "./repositories/AuthRepository";
import { AuthRoutes } from "./routes/auth.routes";
import { AuthService } from "./services/AuthService";

export function createAuthModule(
  logger: Logger,
  database: Database,
  onboardingService: IOnboardingService,
  subscriptionService: ISubscriptionService,
): { routes: AuthRoutes; middleware: AuthMiddleware } {
  const repository = new AuthRepository(database, logger);
  const service = new AuthService(logger, repository, onboardingService, subscriptionService);
  const controller = new AuthController(logger, service);
  const middleware = new AuthMiddleware(logger, service, repository);
  const routes = new AuthRoutes(controller, middleware);

  return { routes, middleware };
}
```

```typescript
// server.ts — Assembly
const subscriptionModule = createSubscriptionModule(logger, database);
const onboardingService = createOnboardingService(logger, database);
const authModule = createAuthModule(logger, database, onboardingService, subscriptionModule.service);
```

**Regras de DI:**
- Factory sempre recebe `Logger` e `Database` como primeiros parâmetros
- Dependências entre domínios sempre via interface, nunca classe concreta
- Factory retorna apenas o necessário (`{ routes, middleware }` ou `{ routes, service }`)

## Controller Pattern

Controllers lidam **exclusivamente** com HTTP. Toda lógica de negócio vive em Services.

```typescript
// domain/auth/controllers/AuthController.ts — CORRETO
export class AuthController {
  constructor(
    private logger: Logger,
    private authService: IAuthService,
  ) {}

  async register(
    request: FastifyRequest<{ Body: RegisterRequest }>,
    reply: FastifyReply,
  ): Promise<void> {
    try {
      const validatedData = registerSchema.parse(request.body);
      const response = await this.authService.register(validatedData);
      void reply.status(201).send(response);
    } catch (error) {
      this.handleError(error, reply, request);
    }
  }

  private handleError(error: unknown, reply: FastifyReply, request: FastifyRequest): void {
    const language = detectLanguageFromHeader(request.headers["accept-language"]);

    if (error instanceof ZodError) {
      const firstError = error.errors[0];
      void reply.status(400).send({
        error: "VALIDATION_ERROR",
        message: `Validation failed for field: ${firstError?.path.join(".")}`,
        details: error.errors,
      });
      return;
    }

    if (error instanceof DomainError) {
      void reply.status(error.statusCode).send({
        error: error.code,
        message: error.getLocalizedMessage(language),
      });
      return;
    }

    const err = error instanceof Error ? error : new Error(String(error));
    this.logger.error("Unknown error", err);
    void reply.status(500).send({
      error: "Internal Server Error",
      message: "An unexpected error occurred",
    });
  }
}
```

**Padrão de `handleError`:** todo controller DEVE ter `handleError` privado que trata Zod → DomainError → unknown, nesta ordem.

## Error Handling

Todos os erros de domínio estendem `DomainError` com suporte a i18n:

```typescript
// shared/errors/index.ts
export class DomainError extends Error {
  public readonly code: ErrorCode;
  public readonly statusCode: number;

  constructor(message: string, options: IDomainErrorOptions) {
    super(message);
    this.name = "DomainError";
    this.code = options.code;
    this.statusCode = options.statusCode ?? 400;
  }

  getLocalizedMessage(language: string): string {
    // i18n lookup com fallback para this.message
  }
}
```

```typescript
// Erro específico do domínio — CORRETO
export class EmailAlreadyExistsError extends DomainError {
  constructor() {
    super("Email already exists", {
      code: ERROR_CODES.EMAIL_ALREADY_EXISTS,
      statusCode: 409,
    });
    this.name = "EmailAlreadyExistsError";
  }
}
```

**Regras de errors:**
- Código de erro em `shared/constants/errorCodes.ts` — centralizado
- Nome do erro: `DescriçãoError` (ex: `InvalidCredentialsError`)
- `statusCode` encapsulado no erro — controller não decide HTTP status
- Mensagens em inglês no constructor, i18n no `getLocalizedMessage()`

## Route Pattern

Routes implementam a interface `IRoute` e registram endpoints no Fastify:

```typescript
// domain/auth/routes/auth.routes.ts — CORRETO
export class AuthRoutes implements IRoute {
  constructor(
    private authController: AuthController,
    private authMiddleware: AuthMiddleware,
  ) {}

  register(app: FastifyInstance): void {
    // Público
    app.post<{ Body: RegisterRequest }>("/auth/register", {
      handler: (request, reply) => this.authController.register(request, reply),
    });

    // Protegido
    app.get("/auth/me", {
      preHandler: (request, reply, done) => {
        void this.authMiddleware.authenticate(request, reply).then(() => done()).catch(done);
      },
      handler: (request, reply) => this.authController.me(request, reply),
    });
  }
}
```

**Regras de routes:**
- Endpoints públicos: sem `preHandler`
- Endpoints protegidos: `preHandler` com `authMiddleware.authenticate`
- Sem lógica nos handlers da rota — delegar pra controller

## Types e Validação (Zod)

```typescript
// domain/auth/types/index.ts — CORRETO
import { z } from "zod";

// Schemas Zod para validação de input
export const registerSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(VALIDATION_CONSTANTS.MIN_PASSWORD_LENGTH),
  name: z.string().min(VALIDATION_CONSTANTS.MIN_NAME_LENGTH),
  onboardingId: z.string().uuid("Invalid onboarding ID format"),
});

// Types inferidos do schema
export type RegisterRequest = z.infer<typeof registerSchema>;

// Interfaces de contrato (DI)
export interface IAuthService {
  register(data: RegisterRequest): Promise<AuthResponse>;
  login(data: LoginRequest): Promise<AuthResponse>;
  verifyToken(token: string): JWTPayload;
}

export interface IAuthRepository {
  createUser(data: CreateUserData): Promise<UserData>;
  findUserByEmail(email: string): Promise<UserData | null>;
}
```

**Regras de types:**
- Schemas Zod + types inferidos no mesmo arquivo
- Interfaces de serviço e repositório (`IAuthService`, `IAuthRepository`) no types do domínio
- Constantes de validação em `shared/constants/validation.ts`
- Sem `enum` — usar `as const` + union types

## Response Shape

Respostas da API seguem formato padronizado:

```typescript
// Sucesso com dados
{ token: string; user: UserData }

// Erro
{ error: string; message: string; details?: unknown }

// Erro de validação
{ error: "VALIDATION_ERROR"; message: string; field: string; details: ZodIssue[] }
```

## Testing

Testes de integração com DB real (Docker), sem mocks do Prisma.

```typescript
// domain/auth/__tests__/auth.integration.test.ts — CORRETO
describe("POST /auth/register", () => {
  it("should register a new user", async () => {
    const app = getTestServer();
    const onboarding = await createOnboardingWithSubscription();

    const response = await app.inject({
      method: "POST",
      url: "/auth/register",
      payload: {
        email: "newuser@example.com",
        password: "SecurePass123!",
        name: "New User",
        onboardingId: onboarding.id,
      },
    });

    expect(response.statusCode).toBe(201);
    const body = JSON.parse(response.body) as AuthResponse;
    expect(body.token).toBeDefined();
    expect(body.user.email).toBe("newuser@example.com");
  });
});
```

**Regras de testing:**
- Testes de integração usam `app.inject()` do Fastify (sem HTTP real)
- Fixtures via factory functions em `tests/fixtures/` (ex: `createUser()`, `createOnboardingWithSubscription()`)
- `beforeEach` limpa o banco (`clearDatabase()`)
- Mocks APENAS para SDKs externos (payment, push, SMS)
- Cada domínio tem `__tests__/` com seus testes de integração

## Naming Conventions

| Tipo | Convenção | Exemplo |
|---|---|---|
| Controller | `PascalCase` + `Controller` | `AuthController` |
| Service | `PascalCase` + `Service` | `AuthService` |
| Repository | `PascalCase` + `Repository` | `AuthRepository` |
| Middleware | `PascalCase` + `Middleware` | `AuthMiddleware` |
| Routes | `PascalCase` + `Routes` | `AuthRoutes` |
| Error | `PascalCase` + `Error` | `EmailAlreadyExistsError` |
| Factory | `create` + `ModuleName` | `createAuthModule` |
| Interface | `I` + `PascalCase` | `IAuthService` |
| Zod schema | `camelCase` + `Schema` | `registerSchema` |
| Type (inferido) | `PascalCase` + `Request`/`Response` | `RegisterRequest` |
| Constante | `UPPER_SNAKE_CASE` | `ERROR_CODES` |
| Arquivo controller | `PascalCase.ts` | `AuthController.ts` |
| Arquivo rota | `kebab-case.routes.ts` | `auth.routes.ts` |

## Imports

Ordem obrigatória (ESLint enforced):

```typescript
// 1. Node built-ins
import { join } from "path";

// 2. Third-party
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

// 3. Internal — @/ paths
import { Logger } from "@/core/config/logger";
import { DomainError } from "@/shared/errors";
import { Database } from "@/infrastructure/database/Database";

// 4. Relative
import { AuthService } from "./services/AuthService";
import { IAuthService } from "./types";
```

- Path alias: `@/*` → `./src/*`
- Sem `../../` profundos — max 1 nível relativo

## Comandos

```bash
npm run dev              # Hot-reload (tsx watch)
npm run build            # Build (tsup)
npm run check            # Prettier + ESLint + TypeScript
npm run fix              # ESLint fix + Prettier write
npm test                 # Jest (silent)
npm run test:integration # Jest com DB real (--runInBand)
npm run typecheck        # tsc --noEmit
npm run db:setup         # Prisma generate + migrate
npm run prisma:studio    # Prisma Studio (DB GUI)
npm run docker:up        # Docker compose up
npm run docker:down      # Docker cleanup
```

## Database Migrations

O projeto usa **`prisma migrate`** versionado — nunca `db push` em staging/prod.

### Regras

- `db push` — permitido apenas para prototipagem local rápida. Nunca em staging/prod.
- Qualquer mudança de schema que vai para staging ou prod **deve** gerar uma migration versionada em `prisma/migrations/`.

### Comandos

| Comando | Quando usar |
|---|---|
| `npm run db:migrate:dev -- --name descricao_da_mudanca` | Criar migration local em dev (interativo, atualiza o client) |
| `npm run db:migrate:deploy` | Aplicar migrations pendentes em staging/prod/CI (não interativo) |
| `npm run db:migrate:reset` | Reset local: drop + recreate + migrate + seed (só dev) |

### Fluxo de desenvolvimento

1. Altere `prisma/schema.prisma`
2. Rode `npm run db:migrate:dev -- --name descricao_curta` — isso gera o arquivo em `prisma/migrations/` e atualiza o Prisma Client
3. Commit do schema + arquivo de migration juntos

### Deploy / CI

```bash
# Antes de subir o app — roda todas as migrations pendentes
npm run db:migrate:deploy
```

Nunca rodar `db:migrate:dev` em CI ou produção — ele é interativo e pode solicitar reset do banco.

## Auth Strategy

Auth é **stateless via JWT + `loginVersion`**. Sem tabela `sessions`.

- Cada token JWT carrega `userId` e `loginVersion`
- No middleware, o `loginVersion` do token é comparado com o do banco — se diferir, o token é rejeitado
- Logout e password-change incrementam `loginVersion`, invalidando todos os tokens anteriores imediatamente
- **Refresh tokens: fora de escopo deste skeleton** — implementar em projeto derivado se necessário
- O model `Session` foi removido na migration `20260419202204_remove_session_model` — não recriar sem plano explícito de refresh tokens

## Checklist: Novo Domínio

1. Criar pasta em `src/domain/nomeDoDominio/`
2. Criar `types/index.ts` — Zod schemas + interfaces `IService` e `IRepository`
3. Criar `repositories/NomeRepository.ts` — CRUD via Prisma
4. Criar `services/NomeService.ts` — lógica de negócio
5. Criar `controllers/NomeController.ts` — HTTP handlers + `handleError`
6. Criar `routes/nome.routes.ts` — implements `IRoute`
7. Criar `errors/` — erros específicos do domínio (ou em `shared/errors`)
8. Criar `index.ts` — factory `createNomeModule(logger, database, ...deps)`
9. Registrar no `server.ts` — assembly de DI
10. Registrar rotas no `App` (`infrastructure/http/app.ts`)
11. Adicionar error codes em `shared/constants/errorCodes.ts`
12. Criar `__tests__/nome.integration.test.ts`
13. Criar fixtures em `tests/fixtures/` se necessário
14. Se o domínio adiciona ou altera models no `schema.prisma`, gerar migration via `db:migrate:dev`

## Checklist: Novo Endpoint

1. Adicionar Zod schema em `types/index.ts`
2. Adicionar método no Repository (se precisa de dados)
3. Adicionar método no Service (lógica de negócio)
4. Adicionar método no Controller (HTTP handler)
5. Registrar rota em `routes/` (com `preHandler` se protegido)
6. Adicionar teste de integração
7. Verificar: max linhas respeitado, sem `any`, DomainError tipado
