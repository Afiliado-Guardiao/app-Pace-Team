<div align="center">

<br/>

```
 ██████╗  █████╗ ███████╗███████╗     █████╗ ██████╗ ██████╗
 ██╔══██╗██╔══██╗██╔════╝██╔════╝    ██╔══██╗██╔══██╗██╔══██╗
 ██████╔╝███████║███████╗█████╗      ███████║██████╔╝██████╔╝
 ██╔══██╗██╔══██║╚════██║██╔══╝      ██╔══██║██╔═══╝ ██╔═══╝
 ██████╔╝██║  ██║███████║███████╗    ██║  ██║██║     ██║
 ╚═════╝ ╚═╝  ╚═╝╚══════╝╚══════╝    ╚═╝  ╚═╝╚═╝     ╚═╝
```

**Template · Mobile · Expo**

<br/>

<table>
<tr>
<td><img src="https://img.shields.io/badge/v1.0.0-version-3178c6?style=flat-square&logo=typescript&logoColor=white" /></td>
<td><img src="https://img.shields.io/badge/Expo_SDK_54-000000?style=flat-square&logo=expo&logoColor=white" /></td>
<td><img src="https://img.shields.io/badge/5_features-8b5cf6?style=flat-square" /></td>
<td><img src="https://img.shields.io/badge/274_arquivos_TS-2d3748?style=flat-square" /></td>
</tr>
</table>

<br/>

<img src="https://skillicons.dev/icons?i=react,ts,nodejs&theme=dark&perline=8" alt="stack" />

<br/>

</div>

---

<br/>

## `>` Sobre

**Base App** é um template de partida para aplicativos mobile em React Native com Expo. Ele entrega uma estrutura pronta com autenticação (Apple, Google, e-mail), onboarding multi-step, navegação por grupos de rota, tema centralizado, i18n e testes configurados — para você clonar e construir em cima sem montar boilerplate do zero.

A arquitetura é orientada a features isoladas: cada domínio da UI vive em `src/features/[nome]/` com seus próprios screens, hooks, validações e estilos. Estado global via Zustand, estado de servidor via React Query, design tokens no `theme/`.

<br/>

## `>` Quick Start

```bash
# 1. Clone e instale
git clone <repo-url> && cd base-app
npm install

# 2. Configure o ambiente
cp .env.example .env
# Edite .env com sua API_URL

# 3. Rode
npx expo start
```

Para rodar no device: `npm run ios` ou `npm run android`.

<br/>

## `>` Estrutura do projeto

```
base-app/
├── app/                        # Expo Router — file-based routing
│   ├── _layout.tsx             #   Root layout (providers, splash)
│   ├── index.tsx               #   Entry point (redireciona por auth)
│   ├── (auth)/                 #   Grupo autenticado
│   │   └── (tabs)/             #     home.tsx, profile.tsx
│   └── (non-auth)/             #   Grupo público
│       ├── welcome.tsx
│       ├── auth.tsx
│       └── onboarding.tsx
│
└── src/
    ├── features/               # 5 features isoladas
    │   ├── auth/               #   Login, registro, Apple/Google Sign-in
    │   ├── welcome/            #   Tela de boas-vindas
    │   ├── onboarding/         #   Fluxo multi-step com pickers
    │   ├── home/               #   Tela principal
    │   └── profile/            #   Perfil e danger zone
    │
    ├── components/             # Componentes reutilizáveis
    │   ├── core/               #   App-wide (layouts, wrappers)
    │   ├── shared/             #   Cross-feature (botões, inputs)
    │   └── ui/                 #   Primitivos atômicos
    │
    ├── lib/                    # React Query, API clients, configs
    ├── store/                  # Zustand slices (auth, theme, language)
    ├── theme/                  # Design tokens, cores, tipografia
    ├── i18n/                   # Traduções (pt-BR, en, es)
    ├── constants/              # Valores fixos e rotas
    ├── utils/                  # Utilitários (device, formatters)
    └── types/                  # Tipos e declarations globais
```

<br/>

## `>` Anatomia de uma feature

Todas as features seguem o mesmo padrão:

```
features/[qualquer-uma]/
│
├── index.tsx            →  Screen principal da feature
├── screens/             →  Telas adicionais (se houver)
├── components/          →  Componentes específicos desta feature
│   └── [Componente]/
│       ├── index.tsx
│       ├── hooks/       →  Lógica do componente
│       ├── styles/
│       └── types/
├── hooks/               →  Lógica de negócio da feature
├── validation/          →  Schemas Zod + error mappers
├── styles/              →  createXStyles factory functions
├── types/               →  Interfaces e tipos
├── constants/           →  Constantes locais
└── __tests__/           →  Testes unitários e de integração
```

O fluxo é sempre: **Screen → Hook → Validação → Store / React Query**

<br/>

## `>` Navegação rápida

| Quero...                        | Vou em...                                         |
| :------------------------------ | :------------------------------------------------ |
| Nova tela em uma feature        | `src/features/[feature]/screens/` + rota em `app/` |
| Componente global               | `src/components/{core,shared,ui}/`                |
| Lógica de negócio               | `src/features/[feature]/hooks/`                   |
| Estado global (cliente)         | `src/store/` (Zustand)                            |
| Estado do servidor              | `src/lib/` (React Query)                          |
| Validação de formulário         | `src/features/[feature]/validation/`              |
| Nova feature                    | `src/features/[nome]/` com estrutura padrão acima |
| Tradução                        | `src/i18n/`                                       |
| Tema / cores / espaçamento      | `src/theme/`                                      |
| Env var nova                    | `.env` + importar via `@env`                      |

<br/>

## `>` Comandos

<details>
<summary>&nbsp;<b>Dev</b></summary>
<br/>

```bash
npm start               # expo start
npm run ios             # roda no device iOS
npm run android         # roda no device Android
npm run web             # expo web (localhost:8081)
```

</details>

<details>
<summary>&nbsp;<b>Testes</b></summary>
<br/>

```bash
npm test                # jest (modo silencioso)
npm run test:watch      # watch mode
npm run test:coverage   # relatório de cobertura
```

</details>

<details>
<summary>&nbsp;<b>Qualidade</b></summary>
<br/>

```bash
npm run check           # prettier + eslint + tsc --noEmit
npm run fix             # eslint --fix + prettier --write
npm run typecheck       # só tsc --noEmit
```

</details>

<br/>

---

<div align="center">

**`base-app`** · v1.0.0 · 274 arquivos · 12.394 linhas de TypeScript

</div>
