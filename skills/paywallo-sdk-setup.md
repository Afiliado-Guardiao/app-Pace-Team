# Skill: Paywallo SDK — Setup & Core Integration

> **SDK alvo:** `@virex-tech/paywallo-sdk` v2.1.x
> **App alvo:** `base-app` (React Native + Expo SDK 54)
> **Stack pressuposta:** Expo Router, Zustand, React Query, i18next, theme tokens

Setup mínimo **funcional** do SDK Paywallo no `base-app`. Esta skill cobre instalação, configuração, montagem do Provider, identificação de usuário em login/logout e wiring de erros para observability.

> ⚠️ **Não envolva o SDK em um Singleton wrapper customizado.** O `PaywalloClient` exportado pelo pacote já é singleton. Wrappers adicionam latência (Promise race / timeout) e duplicam lógica que o SDK já fornece (`waitUntilReady`, `onError`, fila offline).

---

## 1. Requisitos

| Plataforma   | Versão mínima                                      |
| :----------- | :------------------------------------------------- |
| React Native | recente (0.7x+)                                    |
| iOS          | 15.0+                                              |
| Android      | API 24 (Android 7.0+)                              |
| Node         | 18+                                                |
| Expo         | qualquer com prebuild (não há config plugin ainda) |

---

## 2. Instalação

```bash
cd base-app
npm install @virex-tech/paywallo-sdk
```

> Equivalentes: `yarn add @virex-tech/paywallo-sdk` ou `pnpm add @virex-tech/paywallo-sdk`.

**iOS:**

```bash
cd ios && pod install && cd ..
```

Autolinking do RN 0.60+ resolve o resto. Sem config extra em `Podfile`, `build.gradle` ou `MainApplication`.

**Expo:**

```bash
npx expo prebuild       # gera /ios e /android
cd ios && pod install   # depois disso
```

> Ainda não existe config plugin Expo — use prebuild.

O SDK traz módulos nativos próprios (StoreKit 2, Google Play Billing, secure storage, device info). **Não é necessário** RevenueCat, `react-native-iap` ou similar.

### Peer deps opcionais

| Pacote                             | Quando instalar                                                      |
| :--------------------------------- | :------------------------------------------------------------------- |
| `expo-tracking-transparency`       | App usa Meta Ads / AppsFlyer / qualquer atribuição que precise IDFA. |
| `@react-native-firebase/app`       | Push notifications via Paywallo (FCM no Android, APNS no iOS).       |
| `@react-native-firebase/messaging` | Idem — handler de mensagens FCM.                                     |

Se nenhum desses casos se aplica, **não instale**. O SDK detecta a ausência e desliga o subsistema correspondente.

---

## 3. Variáveis de ambiente

Adicione em `base-app/.env.example` e `base-app/.env`:

```env
EXPO_PUBLIC_PAYWALLO_APP_KEY=pk_xxxxxxxx
```

> Formato: `pk_<uuid-sem-hifen>`. Pegue no dashboard do Paywallo (`https://paywallo.com.br/dashboard` → seu app → aba **SDK**). Cole sem espaços.

> Variáveis com prefixo `EXPO_PUBLIC_` ficam embutidas no bundle do app — **não** coloque secrets do servidor aqui.

---

## 4. Plugando o `PaywalloProvider`

O Provider faz **tudo** automaticamente ao montar:

- chama `PaywalloClient.init(config)`
- inicia a sessão (`autoStartSession: true` por default)
- pré-resolve `sessionFlags`
- monta os modais de paywall (web view + modal nativo) — `presentCampaign`/`presentPaywall` renderizam dentro deles
- registra os listeners de transações nativas e push

Plugue dentro de `src/components/core/AppProviders/index.tsx` do `base-app`, **acima** dos providers que dependem de identidade do usuário (React Query, navegação):

```tsx
// src/components/core/AppProviders/index.tsx
import React from "react";

import {
  PaywalloProvider,
  type PaywalloInitConfig,
} from "@virex-tech/paywallo-sdk";

import { QueryClientProvider } from "@/lib/react-query";
import { I18nProvider } from "@/i18n";
import { ThemeProvider } from "@/theme";

import { IAppProvidersProps } from "./types";

const PAYWALLO_APP_KEY = process.env.EXPO_PUBLIC_PAYWALLO_APP_KEY ?? "";

// Importante: declarar como variável tipada `PaywalloInitConfig` (não literal inline).
// O PaywalloProvider aceita publicamente apenas `PaywalloConfig` (subset), mas o SDK em
// runtime passa o config completo para `PaywalloClient.init()`. A variável tipada escapa
// do excess-property-check do TS.
const paywalloConfig: PaywalloInitConfig = {
  appKey: PAYWALLO_APP_KEY,
  debug: __DEV__,
  sessionFlags: ["welcome_variant", "paywall_variant"],
  onError: (error: unknown): void => {
    if (__DEV__) return;
    // TODO: Sentry.captureException(error, { tags: { source: "paywallo-sdk" } })
    void error;
  },
};

export const AppProviders: React.FC<IAppProvidersProps> = ({ children }) => {
  return (
    <PaywalloProvider config={paywalloConfig}>
      <ThemeProvider>
        <I18nProvider>
          <QueryClientProvider>{children}</QueryClientProvider>
        </I18nProvider>
      </ThemeProvider>
    </PaywalloProvider>
  );
};
```

### Config completo (referência)

```ts
interface PaywalloInitConfig {
  appKey: string; // obrigatório
  apiUrl?: string; // default: https://paywallo.com.br
  debug?: boolean; // default: false — use __DEV__
  environment?: "Production" | "Sandbox"; // default: deduzido de __DEV__
  autoStartSession?: boolean; // default: true
  sessionFlags?: string[]; // flags pré-resolvidas no boot (síncronas)
  subscriptionCacheTTL?: number; // ms — cache de hasActiveSubscription
  autoPreloadCampaign?: string; // placement a pré-carregar no boot
  requestATT?: boolean; // pede ATT permission no iOS
  errorStrings?: { title?: string; retry?: string; close?: string };
  offlineQueueEnabled?: boolean; // default: true
  timeout?: number; // ms — timeout de requests
  onError?: (error: unknown) => void;
}
```

> ⚠️ **Não passe esses campos como literal inline** dentro do `<PaywalloProvider config={{ ... }}>`. O type público do Provider é `PaywalloConfig` (subset com 5 campos: `appKey`, `apiUrl`, `debug`, `environment`, `errorStrings`). Para usar campos como `sessionFlags`, `onError`, `autoStartSession`, declare uma variável tipada `PaywalloInitConfig` separada e passe-a por referência — o SDK aceita em runtime via spread interno.

> **`environment`**: o SDK deduz `Sandbox` quando `__DEV__ === true` e `Production` caso contrário. Só sobrescreva se você precisar testar Production em dev build, ou Sandbox em release build.

---

## 5. Identify após login

`PaywalloClient.identify(...)` associa o `distinctId` anônimo (criado no primeiro boot) ao seu usuário identificado. **Pode ser chamado antes ou depois do init** — chamadas pré-init são enfileiradas automaticamente.

No `base-app`, plugue no hook de auth (`src/features/auth/hooks/useAuth.ts` ou onde a session for hidratada):

```tsx
import { PaywalloClient } from "@virex-tech/paywallo-sdk";

import { useStore } from "@/store";

export const useAuthSync = (): void => {
  const user = useStore((state) => state.user);

  useEffect(() => {
    if (!user) return;

    void PaywalloClient.identify({
      email: user.email,
      properties: {
        plan: user.plan,
        signup_at: user.createdAt,
        // qualquer atributo segmentável — não envie PII além do necessário
      },
    });
  }, [user]);
};
```

**Regras:**

- Chame `identify` apenas **uma vez por sessão de usuário** — múltiplas chamadas com o mesmo email são idempotentes mas viram requests extras.
- O merge é **não-destrutivo**: chamar `identify` de novo adiciona/atualiza campos sem apagar os existentes. Eventos disparados antes do `identify` ficam associados ao mesmo usuário.
- Em `properties`, use **valores estáveis** (plano, cohort, signup_at). Atributos voláteis (lastActivity) não devem ir aqui — use `track`.
- **Não** passe `userId` interno — o SDK já tem `distinctId` próprio. Se precisar correlacionar, use `properties.app_user_id` como atributo informativo.

### Limites de propriedades

| Limite                           | Valor                            |
| :------------------------------- | :------------------------------- |
| Chaves por usuário               | **50**                           |
| Tamanho de cada valor            | **1 KB**                         |
| Profundidade (se valor é objeto) | **3 níveis** (recomendado: flat) |

### Atualizando properties sem mudar email

Pra refletir mudanças de plano/cohort sem refazer identify completo, chame `identify` apenas com `properties`:

```tsx
await PaywalloClient.identify({
  properties: { plan: "premium" },
});
```

### Reset no logout

```tsx
await PaywalloClient.reset();
```

`reset()` limpa email + properties, gera novo `anonId` e desfaz o vínculo identificado. Use no logout, antes de limpar o estado de auth do app.

> Não use `fullReset()` em logout normal — esse é destrutivo (apaga até a fila offline) e existe para casos extremos como troca de `appKey`.

---

## 6. Wiring de erros para observability

O SDK silencia erros de rede / SDK (não derruba o app), mas chama o callback `onError` para você logar. Plugue dentro da variável `paywalloConfig` definida na seção 3:

```tsx
const paywalloConfig: PaywalloInitConfig = {
  appKey: PAYWALLO_APP_KEY,
  debug: __DEV__,
  onError: (error: unknown): void => {
    if (__DEV__) return; // SDK já loga em dev via debug:true
    const err = error instanceof Error ? error : new Error(String(error));
    Sentry?.captureException(err, { tags: { source: "paywallo-sdk" } });
  },
};
```

Erros que **são lançados** (em vez de silenciados):

- `MISSING_APP_KEY` — config inválido no init
- `PAYWALL_NOT_INITIALIZED` — chamou `presentPaywall` antes do Provider montar
- `PURCHASE_USER_CANCELLED` — usuário cancelou compra (esperado, trate como branch normal, não exception)

---

## 7. Verificando que está funcionando

Em dev, com `debug: __DEV__`, o SDK loga no console com prefixo `[Paywallo ...]`. Procure pela linha de boot:

```
[Paywallo INIT] ready (environment=Sandbox)
```

Se não aparecer, confira:

- `appKey` copiada sem espaços (formato `pk_xxxxxxxx`)
- `pod install` rodou sem erro (iOS)
- Gradle sync completo (Android)

Para confirmar identidade:

```tsx
import { PaywalloClient } from "@virex-tech/paywallo-sdk";

const distinctId = PaywalloClient.getDistinctId(); // string
const email = PaywalloClient.getEmail(); // string | null
```

E no dashboard do Paywallo: o usuário deve aparecer em **Users** após o primeiro `identify`.

---

## 8. Checklist de integração

- [ ] `npm install @virex-tech/paywallo-sdk` + `pod install` no iOS
- [ ] `EXPO_PUBLIC_PAYWALLO_APP_KEY` no `.env` (e `.env.example` com placeholder)
- [ ] `<PaywalloProvider>` montado em `AppProviders/index.tsx` envolvendo todos os outros providers que dependem de identidade
- [ ] `identify({ email, properties })` no hook de auth, após user logar
- [ ] `reset()` no fluxo de logout
- [ ] `onError` plugado no Sentry / logger central
- [ ] Em dev, log `[Paywallo] init() ok` aparece no console
- [ ] Dashboard mostra o user após primeiro `identify`

---

## 9. O que **não fazer**

| ❌ Anti-pattern                                         | ✅ Faça em vez disso                                 |
| :------------------------------------------------------ | :--------------------------------------------------- |
| `class PaywalloService { ... }` wrapper customizado     | Importe `PaywalloClient` direto                      |
| `await PaywalloClient.init(...)` manual em `useEffect`  | Use `<PaywalloProvider>` — ele faz init no mount     |
| Promise race com timeout custom esperando init          | `await PaywalloClient.waitUntilReady()`              |
| `identify({ email, properties: { ...props, userId } })` | `userId` interno do app não pertence ao SDK Paywallo |
| `track("login", { email })` como evento manual          | Use `identify` — login não é evento, é estado        |
| `console.log` em produção                               | Use `onError` callback                               |

Próximas skills:

- [`paywallo-paywall-skill.md`](./paywallo-paywall-skill.md) — apresentar paywalls e gate de conteúdo
- [`paywallo-funnel-tracking.md`](./paywallo-funnel-tracking.md) — tracking de onboarding e eventos custom
- [`paywall-ab-testing.md`](./paywall-ab-testing.md) — A/B testing com `sessionFlags`
- [`paywallo-full-skill.md`](./paywallo-full-skill.md) — guia consolidado (master)
