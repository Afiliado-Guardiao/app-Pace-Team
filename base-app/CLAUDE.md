# CLAUDE.md - App

React Native/Expo app com arquitetura component-based e feature-isolated (DDD-inspired).

## Hard Rules (inegociáveis)

- **PROIBIDO** `any` — usar `unknown` quando o tipo não é conhecido
- **PROIBIDO** `// @ts-ignore` e `// @ts-expect-error` sem justificativa em comentário
- **PROIBIDO** `console.log` em código commitado — usar logger ou remover
- **PROIBIDO** `StyleSheet.create()` em componentes — usar funções `createXStyles(theme)`
- **PROIBIDO** cores, espaçamentos ou tamanhos hardcoded — usar tokens do theme
- **PROIBIDO** imports circulares
- **PROIBIDO** imports entre features (`features/auth/` NÃO importa de `features/profile/`)
- **PROIBIDO** nested ternários no JSX — max 1 nível
- **PROIBIDO** lógica inline no JSX — extrair pra variável ou hook
- **1 componente exportado por arquivo** — sem exceção
- **`testID` obrigatório** em todo elemento interativo (botões, inputs, links)
- **`accessibilityLabel` obrigatório** em botões e inputs

## Limites de Tamanho

| Tipo                         | Max linhas |
| ---------------------------- | ---------- |
| Componente (`index.tsx`)     | **200**    |
| Hook customizado             | **150**    |
| Screen (feature `index.tsx`) | **200**    |
| Arquivo de styles            | **100**    |
| Arquivo de types             | **150**    |
| Função individual            | **50**     |

- **Max 7 props** por componente — acima disso, compor em sub-componentes ou agrupar em object props
- **Max 3 níveis** de aninhamento (depth) em qualquer função
- **Max 3 parâmetros** por função — acima disso, usar objeto de opções

> Se um arquivo ultrapassa o limite → refatorar antes de continuar. Nunca "só dessa vez".

## Arquitetura de Componentes

Componentes são **puros** — só renderizam JSX.

**Componentes NÃO PODEM ter:**

- `useState`, `useEffect`, `useCallback`, `useMemo`
- Lógica de negócio
- Chamadas de API
- Computação pesada

**Componentes SÓ PODEM ter:**

- `useTheme()`, `useTranslation()`, hooks customizados da feature
- JSX e renderização condicional simples (1 nível de ternário)
- Chamada de `createXStyles(theme, ...props)`

### Exemplo: Componente UI

```
Button/
├── index.tsx          # JSX puro
├── types/index.ts     # Props e tipos de estilo
├── styles/index.ts    # Função createButtonStyles()
└── hooks/             # Opcional — só se o componente tiver estado local
    └── useButton.ts
```

```tsx
// Button/index.tsx — CORRETO
import React from "react";
import { ActivityIndicator, Pressable, Text } from "react-native";

import { useTheme } from "@/theme";

import { createButtonStyles } from "./styles";
import { IButtonProps } from "./types";

export const Button: React.FC<IButtonProps> = ({
	children,
	onPress,
	variant = "default",
	size = "md",
	disabled = false,
	loading = false,
	style,
}) => {
	const { theme } = useTheme();
	const styles = createButtonStyles(theme, variant, size, disabled || loading);

	return (
		<Pressable
			testID="button"
			accessibilityLabel={typeof children === "string" ? children : undefined}
			onPress={onPress}
			disabled={disabled || loading}
			style={({ pressed }) => [styles.container, pressed && { opacity: 0.8 }, style]}
		>
			{loading ? (
				<ActivityIndicator color={styles.text.color} />
			) : (
				<Text style={styles.text}>{children}</Text>
			)}
		</Pressable>
	);
};
```

```tsx
// Button/index.tsx — ERRADO (lógica no componente)
export const Button: React.FC<IButtonProps> = (props) => {
	const [isPressed, setIsPressed] = useState(false); // ❌ useState no componente
	useEffect(() => {
		trackClick();
	}, [isPressed]); // ❌ useEffect no componente
	const formatted = props.label.toUpperCase().trim(); // ❌ lógica inline
	// ...
};
```

## Hooks Customizados

Toda lógica de estado, efeitos e computação vive em hooks customizados.

```tsx
// features/auth/hooks/useAuthGuard.ts — CORRETO
import { useEffect } from "react";

import { useRouter } from "expo-router";

import { useStore } from "@/store";
import { ROUTES } from "@/constants/routes";

interface IUseAuthGuardReturn {
	shouldRender: boolean;
}

export const useAuthGuard = (): IUseAuthGuardReturn => {
	const router = useRouter();
	const isAuthenticated = useStore((state) => state.isAuthenticated);
	const hasHydrated = useStore((state) => state._hasHydrated);

	useEffect(() => {
		if (!hasHydrated) return;
		if (!isAuthenticated) {
			router.replace(ROUTES.AUTH);
		}
	}, [isAuthenticated, hasHydrated, router]);

	return { shouldRender: hasHydrated && isAuthenticated };
};
```

**Regras de hooks:**

- Sempre tipar o retorno com interface `IUseXReturn`
- Exportar named export (não default)
- 1 hook por arquivo
- Hook pode usar outros hooks, `useState`, `useEffect`, `useCallback`, `useMemo`

## Styles

Estilos são **funções fábricas**, nunca objetos estáticos.

```tsx
// Button/styles/index.ts — CORRETO
import { ITheme } from "@/theme";
import { IButtonSize, IButtonStyles, IButtonVariant } from "../types";

export const createButtonStyles = (
	theme: ITheme,
	variant: IButtonVariant,
	size: IButtonSize,
	disabled: boolean,
): IButtonStyles => {
	const baseContainer = {
		borderRadius: theme.borderRadius.sm,
		alignItems: "center" as const,
		justifyContent: "center" as const,
	};

	// variant e size styles...

	return {
		container: { ...baseContainer, ...sizeStyles[size], ...variantStyles[variant] },
		text: { ...baseText },
	};
};
```

**Regras de styles:**

- Nome: `create` + `ComponentName` + `Styles`
- Primeiro parâmetro: sempre `theme: ITheme`
- Retorno tipado com interface `IComponentStyles`
- Sem cores hardcoded — só `theme.colors.*`
- Sem espaçamentos hardcoded — só `theme.spacing.*`

## Isolamento de Features (DDD)

Cada feature é um **bounded context** — auto-contida e isolada.

```
features/auth/
├── index.tsx              # Screen principal
├── components/            # Componentes exclusivos da feature
│   ├── EmailAuthModal/
│   └── index.ts           # Barrel export
├── hooks/                 # Hooks da feature
│   ├── useAuthScreen.ts
│   ├── useAuthGuard.ts
│   └── index.ts
├── styles/index.ts        # Styles da screen
├── types/index.ts         # Types da feature
├── validation/index.ts    # Zod schemas
├── constants/index.ts     # Constantes da feature
└── __tests__/             # Testes da feature
```

**Regras de isolamento:**

- Features **NUNCA** importam de outras features
- Features importam de `@/components/`, `@/lib/`, `@/store/`, `@/theme/`, `@/i18n/`
- Comunicação entre features: via Zustand store global ou navegação (router)
- Cada pasta DEVE ter `index.ts` (barrel export)
- Componentes compartilhados vão pra `src/components/shared/` ou `src/components/ui/`

### Exemplo: Screen da Feature

```tsx
// features/auth/index.tsx — screen usa hooks, não tem lógica
export const AuthScreen: React.FC = () => {
	const { theme } = useTheme();
	const { t } = useTranslation("auth");
	const {
		isLoading,
		handleAppleSignIn,
		handleGoogleSignIn,
		isEmailModalVisible,
		openEmailModal,
		closeEmailModal,
		errorModal,
		hideError,
	} = useAuthScreen();

	const styles = createAuthScreenStyles(theme);

	return (
		<SafeAreaView style={styles.container}>
			{/* JSX composto de componentes — sem lógica */}
		</SafeAreaView>
	);
};
```

## State Management

| Tipo de estado        | Onde vive                            | Exemplo                       |
| --------------------- | ------------------------------------ | ----------------------------- |
| Client state (global) | Zustand — `src/store/slices/`        | auth, theme, language         |
| Server state          | React Query — `src/lib/react-query/` | dados do Supabase             |
| Local state           | `useState` em hooks customizados     | form values, modal visibility |

**Regras:**

- Zustand slices são fábricas: `createAuthSlice: StateCreator<IStore, [], [], IAuthSlice>`
- Selectors sempre específicos: `useStore((state) => state.user)` — nunca `useStore()` inteiro
- React Query pra qualquer dado que vem do backend — nunca guardar response em Zustand

## Backend (Supabase)

O backend é um projeto **Supabase** (`../base-supabase/`). O app fala direto com ele — não há servidor HTTP intermediário.

- **Toda chamada ao backend passa por `src/lib/supabase/`** — proibido usar `fetch` para o Supabase ou instanciar `createClient` fora de `src/lib/supabase/client.ts`
- `auth.ts` — login / cadastro / logout / sessão / social login. O store é sincronizado por `syncAuthState` (listener em `useAppInitialization`)
- `profile.ts` · `onboarding.ts` · `referral.ts` — dados por domínio
- **Sem token manual** — a sessão é gerenciada pelo `supabase-js` (AsyncStorage). O store guarda só `user` / `isAuthenticated`, derivados da sessão; nunca persistir token
- Onboarding pré-cadastro usa **login anônimo**; o cadastro converte o usuário anônimo em permanente (mesmo `id`)
- Regras de negócio que cruzam usuários (ex.: indicação) vivem em funções SQL no `base-supabase`, chamadas via `supabase.rpc(...)` — não reimplementar no app
- React Query continua sendo a camada de cache: o `queryFn` chama os helpers de `src/lib/supabase/`
- Login Apple/Google: os helpers `signInWithApple` / `signInWithGoogle` já existem; ativar exige módulos nativos + configuração de provider no Supabase

## Types

```tsx
// types/index.ts — CORRETO
import { StyleProp, TextStyle, ViewStyle } from "react-native";

// Props sempre com prefixo I
export interface IButtonProps {
	children: React.ReactNode;
	onPress: () => void;
	variant?: IButtonVariant;
	size?: IButtonSize;
	disabled?: boolean;
	loading?: boolean;
	style?: StyleProp<ViewStyle>;
}

// Styles sempre com prefixo I
export interface IButtonStyles {
	container: ViewStyle;
	text: TextStyle;
}

// Variants/enums como union types
export type IButtonVariant = "default" | "outline" | "ghost";
export type IButtonSize = "sm" | "md" | "lg";
```

**Regras de types:**

- Prefixo `I` para interfaces e type aliases: `IButtonProps`, `IUserData`
- Props: `ComponentName` + `Props`
- Styles: `ComponentName` + `Styles`
- Return types de hooks: `IUse` + `HookName` + `Return`
- Sem `enum` — usar union types
- Sem `any` — usar `unknown`

## Naming Conventions

| Tipo                 | Convenção                  | Exemplo                       |
| -------------------- | -------------------------- | ----------------------------- |
| Componente (pasta)   | `PascalCase/`              | `Button/`, `EmailAuthModal/`  |
| Componente (export)  | `PascalCase`               | `export const Button`         |
| Hook (arquivo)       | `camelCase.ts`             | `useAuthGuard.ts`             |
| Hook (export)        | `camelCase`                | `export const useAuthGuard`   |
| Style function       | `create` + Name + `Styles` | `createButtonStyles`          |
| Type/Interface       | `I` + `PascalCase`         | `IButtonProps`                |
| Constante            | `UPPER_SNAKE_CASE`         | `MAX_RETRY_COUNT`             |
| Event handler        | `handle` + Action          | `handlePress`, `handleSubmit` |
| Boolean prop         | `is`/`has`/`should` prefix | `isLoading`, `hasError`       |
| Util (arquivo)       | `camelCase.ts`             | `formatDate.ts`               |
| Screen (Expo Router) | `kebab-case.tsx`           | `user-profile.tsx`            |

## Imports

Ordem obrigatória (ESLint enforced):

```tsx
// 1. React
import React from "react";
import { View, Text } from "react-native";

// 2. Expo
import { useRouter } from "expo-router";

// 3. Third-party
import { useTranslation } from "react-i18next";

// 4. Internal — @/ paths
import { Button } from "@/components/ui";
import { useTheme } from "@/theme";
import { useStore } from "@/store";

// 5. Relative
import { useAuthScreen } from "./hooks";
import { createAuthScreenStyles } from "./styles";
import { IAuthScreenProps } from "./types";
```

- Path aliases obrigatórios: `@/components`, `@/features`, `@/theme`, `@/lib`, `@/store`, `@/i18n`, `@/types`
- Sem `../../` profundos — max 1 nível relativo (`./` e `../`)
- Barrel imports sempre que disponível: `from "@/components/ui"` (não `from "@/components/ui/Button"`)

## Comandos

```bash
npm run check      # Prettier + ESLint + TypeScript (tsc --noEmit)
npm run fix        # ESLint auto-fix + Prettier write
npm test           # Jest
npm run typecheck  # tsc --noEmit (isolado)
npx expo start     # Dev server
```

## Checklist: Novo Componente

1. Criar pasta `PascalCase/` no local correto (`components/ui/`, `components/shared/`, ou `features/x/components/`)
2. Criar `types/index.ts` com `IComponentProps` e `IComponentStyles`
3. Criar `styles/index.ts` com `createComponentStyles(theme, ...)`
4. Criar `index.tsx` — componente puro, sem hooks de React
5. Se tiver estado → criar `hooks/useComponent.ts`
6. Adicionar ao barrel export (`index.ts`) da pasta pai
7. `testID` em todo elemento interativo
8. Verificar: max 200 linhas, max 7 props, sem `any`, sem hardcoded values

## Dependências Nativas (skeleton)

- `@quidone/react-native-wheel-picker`: componente reutilizável em `src/components/shared/WheelPicker/index.tsx` — picker de scroll tipo roda (iOS-style)
- `react-native-keyboard-controller`: usado em `app/_layout.tsx` (KeyboardProvider), `features/auth/components/EmailAuthModal/index.tsx` e `features/onboarding/index.tsx` — evita que teclado sobreponha inputs
- `react-native-purchases`: assinatura (RevenueCat) em `src/lib/purchases/`
- `expo-blur`: desfoque do vidro (backdrop-filter) em `src/components/pace/primitives/GlassSurface`

## Design System PACE TEAM

Portado 1:1 do Cloud Design (pacote "Pace Team Design System"). É a referência visual aprovada: **não redesenhar**.

- **Tokens:** `theme.pace.*` em `src/theme/pace/` — `colors`, `gradients` (camadas SVG), `typography`, `spacing`, `radii`, `shadows` (box-shadow CSS, suportado pelo RN 0.81), `motion`, `blur`. Telas PACE usam só esses tokens; os tokens antigos (`theme.colors` etc.) ficam para as telas do template até serem substituídas
- **Componentes:** `import { Button, GlassCard, RankRow } from "@/components/pace"` — core (Button, IconButton, Chip, Badge, Avatar, AvatarStack, Logo, Icon, CountUp), forms (Input, Select, Checkbox, Radio, Switch, SegmentedControl), surfaces (GlassCard, Sheet, Toast, Tooltip), data (StatTile, ActivityGauge, ProgressBar, RankRow, Podium), navigation (TabBar + `PACE_TABS`, TopBar)
- **Vidro:** toda superfície de vidro passa por `GlassSurface` (blur + `--glass-fill` + borda + brilho interno + rim branco). Não recriar vidro à mão
- **Fontes:** Montserrat (UI) e Exo 2 (marca) carregadas em `useAppInitialization` a partir de `src/theme/pace/fonts`
- **Ícones:** Lucide por nome kebab-case (`<Icon name="footprints" />`), como no design system
- **Animações de entrada:** `riseIn` / `popIn` / `growIn` em `src/components/pace/animations` (respeitam "reduzir movimento")
- Diferenças de API em relação ao web: `onClick` → `onPress`; `IconButton.label` é obrigatório; `TopBar` recebe `right={{ icon, label, onPress, badge }}`; `Toast` recebe `action={{ label, onPress }}`; `Select` abre as opções numa `Sheet`

## Observability & Monetização

Monetização do PACE TEAM: **RevenueCat** (decisão do dono do app em 2026-10-24,
substituiu o Superwall + Paywallo do template). Assinatura única com dois
planos (mensal e anual) que liberam o app inteiro.

### RevenueCat — assinatura (`src/lib/purchases/`)

`react-native-purchases` (StoreKit 2). Fonte da verdade da assinatura no app.

- `PurchasesBridge` (em `AppProviders`) liga o RevenueCat ao atleta: o **id do
  profile do Supabase é o App User ID** (`Purchases.logIn`) — é por ele que o
  `revenuecat-webhook` acha o perfil
- `useSubscription()` → status (entitlement `premium`), atualizado pelo listener
  do SDK; `usePlans()` → oferta atual (`$rc_monthly` / `$rc_annual`) com preço
  da Apple
- `usePaywallGate()` (em `app/(auth)/_layout.tsx`): sem assinatura ativa, a área
  logada abre `/(auth)/paywall` (`src/features/paywall`, visual PACE TEAM)
- Sem `EXPO_PUBLIC_REVENUECAT_IOS_KEY` (dev) ou na prévia web
  (`IS_PURCHASES_ENABLED = false`), tudo abre liberado; `client.web.ts` é o stub
- Perfil › Configurações: "Gerenciar assinatura" (`showManageSubscriptions`) e
  "Restaurar compras" (exigência da Apple, também no paywall)
- Backend: `base-supabase/supabase/functions/revenuecat-webhook` grava
  `subscriptions` + `profiles.is_premium` (header Authorization =
  secret `REVENUECAT_WEBHOOK_AUTH`)

**Hard rules:**

- **PROIBIDO** reinstalar Superwall / Paywallo ou `react-native-iap` — a compra é do RevenueCat
- **PROIBIDO** liberar recurso pago por fora da compra da Apple (Pix, link, cartão) — regra 3.1.1 da App Store
- O paywall precisa mostrar preço e período de cada plano, aviso de renovação automática, links de Termos e Privacidade e "Restaurar compras"
- Requer **development build** (módulo nativo; não roda no Expo Go)

### Sentry / PostHog (opcional)

Não vêm incluídos no skeleton — cada fork decide. Para integrar:

1. Instale a lib (`npm install @sentry/react-native` ou similar)
2. Adicione o mock correspondente em `jest.setup.js`
3. Pluge o provider/inicialização em `AppProviders/index.tsx`

## Checklist: Nova Feature

1. Criar pasta em `src/features/nomeDaFeature/`
2. Criar estrutura: `index.tsx`, `components/`, `hooks/`, `styles/`, `types/`, `constants/`
3. Screen em `index.tsx` — usa hooks, sem lógica direta
4. Lógica em `hooks/useFeatureName.ts`
5. Não importar de outras features
6. Adicionar rota em `app/`
7. Adicionar translations em `i18n/resources/*/`
8. Testes em `__tests__/`
