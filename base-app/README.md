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

**Base App** é um template de partida para aplicativos mobile em React Native com Expo. Ele entrega uma estrutura pronta com autenticação (Apple, Google, e-mail), onboarding multi-step, navegação por grupos de rota, tema centralizado, i18n, monetização híbrida **Superwall + Paywallo** (paywalls, subscriptions, A/B testing) e testes configurados — para você clonar e construir em cima sem montar boilerplate do zero.

A arquitetura é orientada a features isoladas: cada domínio da UI vive em `src/features/[nome]/` com seus próprios screens, hooks, validações e estilos. Estado global via Zustand, estado de servidor via React Query, design tokens no `theme/`, monetização via `src/lib/superwall/` (apresentação do paywall) + `src/lib/paywallo/` (identidade, funil e assinatura).

O backend é o **Supabase** — autenticação, banco PostgreSQL e regras de acesso — consumido diretamente pelo app via `src/lib/supabase/`. Não há servidor para hospedar. A definição do backend fica em [`../base-supabase/`](../base-supabase/README.md).

<br/>

## `>` Quick Start

```bash
# 1. Clone e instale
git clone <repo-url> && cd base-app
npm install

# 2. iOS — instale os pods nativos (Superwall + Paywallo + outros)
cd ios && pod install && cd ..

# 3. Configure o ambiente
cp .env.example .env
# Edite .env: EXPO_PUBLIC_SUPABASE_URL, EXPO_PUBLIC_SUPABASE_ANON_KEY,
#             EXPO_PUBLIC_SUPERWALL_IOS_API_KEY / EXPO_PUBLIC_SUPERWALL_ANDROID_API_KEY
#             e EXPO_PUBLIC_PAYWALLO_APP_KEY

# 4. Rode
npx expo start
```

Para rodar no device: `npm run ios` ou `npm run android`.

> **Backend:** o app precisa de um projeto Supabase. Siga o setup em
> [`../base-supabase/README.md`](../base-supabase/README.md) e cole a URL e a
> anon key no `.env`. Sem isso, o app sobe mas as telas de auth/dados falham.

> **Superwall + Paywallo:** as API keys do Superwall (uma por plataforma, `pk_...`) saem de [superwall.com](https://superwall.com) → Settings → Keys; o `appKey` do Paywallo sai de [paywallo.com.br/dashboard](https://paywallo.com.br/dashboard). Sem elas o app roda, mas sem paywall/tracking até configurar. Ambos exigem **development build** (não funciona no Expo Go).

<br/>

## `>` Sem Mac? Build iOS na nuvem (EAS)

O [EAS Build](https://docs.expo.dev/build/introduction/) compila o app nos servidores da Expo — dá para gerar o build iOS, instalar no iPhone e mandar para o TestFlight direto do Windows/Linux. Precisa de conta Expo (grátis) e de **Apple Developer Program** pago para o iOS.

```bash
# 1. Uma vez por máquina
npm install -g eas-cli
eas login

# 2. Uma vez por app — cria o projeto na Expo e grava o projectId no app.json
eas init

# 3. Suba as variáveis do .env para a Expo (o .env NÃO vai no upload, está no .gitignore)
eas env:push --environment development --path .env
eas env:push --environment preview --path .env
eas env:push --environment production --path .env
```

| Comando                     | O que faz                                                                          |
| :-------------------------- | :--------------------------------------------------------------------------------- |
| `npm run eas:dev:ios`       | Development build para o seu iPhone (substitui o Expo Go, roda Paywallo/Superwall) |
| `npm run eas:dev:android`   | Development build para Android                                                     |
| `npm run eas:preview`       | Build interno (ad hoc no iOS, APK no Android) para testers                         |
| `npm run eas:testflight`    | Build de produção iOS + envio automático para o TestFlight                         |
| `npm run eas:build:ios`     | Só o build de produção iOS (`.ipa`)                                                |
| `npm run eas:build:android` | Build de produção Android (`.aab` para a Play Store)                               |
| `npm run eas:submit:ios`    | Envia o último build iOS para o App Store Connect                                  |

**Fluxo de dev sem Mac:** rode `eas device:create` e abra o link no iPhone para registrar o aparelho, depois `npm run eas:dev:ios`. Instale pelo QR code do build e use `npx expo start` normalmente — o app abre no seu iPhone com hot reload. Só precisa gerar um novo dev build quando adicionar/atualizar dependência nativa.

- Na primeira vez, o EAS pede login na Apple e cria certificados e provisioning profiles sozinho.
- `buildNumber` / `versionCode` são incrementados pela Expo (`appVersionSource: remote` no [`eas.json`](./eas.json)).
- As pastas `ios/` e `android/` **não** são versionadas (estão no `.gitignore`): o EAS gera os projetos nativos a partir do `app.json` a cada build (`expo prebuild`). Nome, bundle ID, ícone e tela de abertura se mudam só no `app.json`.

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
    ├── lib/
    │   ├── supabase/           #   Cliente Supabase — auth, profile, onboarding, referral
    │   ├── react-query/        #   Provider e config
    │   ├── superwall/          #   Bridge Superwall (auth sync, subscription gate)
    │   └── paywallo/           #   Bridge Paywallo (auth sync, session flags, funil)
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

| Quero...                      | Vou em...                                          |
| :---------------------------- | :------------------------------------------------- |
| Nova tela em uma feature      | `src/features/[feature]/screens/` + rota em `app/` |
| Componente global             | `src/components/{core,shared,ui}/`                 |
| Lógica de negócio             | `src/features/[feature]/hooks/`                    |
| Estado global (cliente)       | `src/store/` (Zustand)                             |
| Estado do servidor            | `src/lib/` (React Query)                           |
| Chamada ao backend            | `src/lib/supabase/` (auth, profile, onboarding…)   |
| Validação de formulário       | `src/features/[feature]/validation/`               |
| Nova feature                  | `src/features/[nome]/` com estrutura padrão acima  |
| Tradução                      | `src/i18n/`                                        |
| Tema / cores / espaçamento    | `src/theme/`                                       |
| Env var nova                  | `.env` + importar via `@env`                       |
| Paywall (UI) / gate           | `useSubscriptionGate` em `src/lib/superwall/`      |
| Tracking / funil / assinatura | `PaywalloClient.*` + `src/lib/paywallo/`           |

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
