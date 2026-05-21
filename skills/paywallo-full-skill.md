# Skill: Paywallo SDK — Master Guide (Full Integration)

> **SDK alvo:** `@virex-tech/paywallo-sdk` v2.2.x
> **App alvo:** `base-app` (React Native + Expo SDK 54, TypeScript strict, Expo Router, Zustand, React Query, i18next)
> **Doc oficial:** [`https://paywallo.com.br/docs`](https://paywallo.com.br/docs) — a maioria das páginas técnicas ainda está em construção; esta skill é a fonte canônica até a doc oficial publicar.

Guia consolidado para integrar o Paywallo no `base-app` ponta-a-ponta. Cobre setup, identidade, paywalls, funil, A/B testing e push notifications. Cada seção aponta para a skill detalhada correspondente.

---

## Visão geral arquitetural

```
┌──────────────────────────────────────────────────────────────────┐
│  base-app                                                         │
│                                                                   │
│   ┌─ PaywalloProvider (envolve tudo) ─────────────────────────┐   │
│   │                                                            │   │
│   │  • init() automático no mount                              │   │
│   │  • sessão iniciada                                         │   │
│   │  • sessionFlags pré-resolvidas                             │   │
│   │  • PaywallModal + PaywallWebView montados (invisíveis)     │   │
│   │  • Listener nativo de transactions/refunds                 │   │
│   │  • NotificationsManager pronto (se peer deps instaladas)   │   │
│   │                                                            │   │
│   │   ┌─ ThemeProvider → I18nProvider → QueryClientProvider ─┐ │   │
│   │   │                                                       │ │   │
│   │   │  ┌─ Auth flow                                         │ │   │
│   │   │  │   • após login: PaywalloClient.identify(...)       │ │   │
│   │   │  │   • após logout: PaywalloClient.reset()            │ │   │
│   │   │                                                       │ │   │
│   │   │  ┌─ Onboarding flow (feature)                         │ │   │
│   │   │  │   • useOnboarding().step("...") em cada tela       │ │   │
│   │   │  │   • useOnboarding().complete() ao fim              │ │   │
│   │   │                                                       │ │   │
│   │   │  ┌─ Gates de paywall                                  │ │   │
│   │   │  │   • requireSubscriptionWithCampaign("placement")   │ │   │
│   │   │  │   • presentCampaign(...) em handlers              │ │   │
│   │   │  │   • useSubscription() para state reativo           │ │   │
│   │   │  │                                                    │ │   │
│   │   │  └─ A/B tests                                          │ │   │
│   │   │       • useSessionFlag("welcome_variant")             │ │   │
│   │   │                                                       │ │   │
│   │   └───────────────────────────────────────────────────────┘ │   │
│   └────────────────────────────────────────────────────────────┘   │
└───────────────────────────────────────────────────────────────────┘
                                 │
                                 ▼ HTTPS
                  ┌────────────────────────────┐
                  │  Paywallo Server (SaaS)    │
                  │  • Eventos / funnels        │
                  │  • Validação de IAP         │
                  │  • Variants A/B             │
                  │  • Campaigns / paywalls     │
                  └────────────────────────────┘
```

> **`base-supabase` (seu backend) é opcional no fluxo.** O SDK fala diretamente com a Paywallo. Seu backend só entra se você quiser receber webhooks de subscription para sincronizar status no seu banco — veja a seção 7.

---

## 1. Setup mínimo (5 passos)

### 1.1. Instalar

```bash
cd base-app
npm install @virex-tech/paywallo-sdk@^2.2.1
cd ios && pod install && cd ..
```

### 1.2. .env

```env
# base-app/.env e .env.example
EXPO_PUBLIC_PAYWALLO_APP_KEY=
```

### 1.3. Plugar Provider

```tsx
// src/components/core/AppProviders/index.tsx
import {
  PaywalloProvider,
  type PaywalloInitConfig,
} from "@virex-tech/paywallo-sdk";

const PAYWALLO_APP_KEY = process.env.EXPO_PUBLIC_PAYWALLO_APP_KEY ?? "";

// Variável tipada — usar `PaywalloInitConfig` evita o excess-property-check do TS
// quando o config inclui campos além do subset público (`PaywalloConfig`).
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

### 1.4. Identify após login + reset no logout

```tsx
// src/features/auth/hooks/usePaywalloAuthSync.ts
import { useEffect } from "react";

import { PaywalloClient } from "@virex-tech/paywallo-sdk";

import { useStore } from "@/store";

export const usePaywalloAuthSync = (): void => {
  const user = useStore((s) => s.user);

  useEffect(() => {
    if (!user) return;
    void PaywalloClient.identify({
      email: user.email,
      properties: { plan: user.plan, signup_at: user.createdAt },
    });
  }, [user]);
};

// No logout handler:
await PaywalloClient.reset();
```

### 1.5. Verificar

Em dev, o console deve mostrar:

```
[Paywallo INIT] ready (environment=Sandbox)
```

Se não aparecer, confira: `appKey` formato `pk_xxxxxxxx` sem espaços, `pod install` rodou (iOS), Gradle sync completo (Android).

> Detalhes: [`paywallo-sdk-setup.md`](./paywallo-sdk-setup.md)

---

## 2. Apresentar paywall

**Padrão recomendado** — gate completo:

```tsx
const granted =
  await PaywalloClient.requireSubscriptionWithCampaign("home_unlock");
if (!granted) return;
// user tem sub agora
```

**Padrão controle total**:

```tsx
const result = await PaywalloClient.presentCampaign("onboarding_end");
if (result.purchased) navigate("home");
else if (result.cancelled) showSecondChanceOffer();
```

**Forçar exibição mesmo se já é assinante** (tela "manage subscription"):

```tsx
const result = await PaywalloClient.presentCampaign("plans", {
  forceShow: true,
});
```

**Callbacks inline** (alternativa ao `await`):

```tsx
await PaywalloClient.presentPaywall("onboarding_end", {
  onPurchase: (productId) => analytics.track("purchase", { productId }),
  onDismiss: () => console.log("fechou"),
  onError: (err) => reportError(err),
});
```

**State reativo de subscription**:

```tsx
const { isActive, subscription, entitlements, isLoading, error, refresh, restore } =
  useSubscription();
```

**Compra direta** (sem paywall — botão de upgrade fixo):

```tsx
const { purchase, restore, state, error, isPurchasing, isRestoring } = usePurchase();
const outcome = await purchase("com.app.annual");
if (outcome.status === "success") {
  /* libera feature */
}
```

> Detalhes: [`paywallo-paywall-skill.md`](./paywallo-paywall-skill.md)

---

## 3. Tracking de funil

**Onboarding** (feature `src/features/onboarding/`):

```tsx
import { useOnboarding } from "@virex-tech/paywallo-sdk";

const { step, complete } = useOnboarding();

await step("goal_selection"); // em cada tela
await complete(); // antes do paywall
```

**Eventos custom**:

```tsx
await PaywalloClient.track("recipe_saved", {
  properties: { recipe_id, category },
});

// Eventos financeiros — flush imediato
await PaywalloClient.track("checkout_started", {
  properties: { plan: "annual" },
  priority: "critical",
});
```

**Properties:** primitives apenas (`string` / `number` / `boolean` / `null`), sem objetos aninhados nem arrays. Convenção: `snake_case`.

**Batching:** lotes de até **10 eventos a cada 5 segundos** (`normal` priority). Eventos `critical` flushaem imediatamente. Fila offline persistente: até 100 itens, 3 dias.

**Atualizar properties do user** sem refazer identify completo:

```tsx
await PaywalloClient.identify({ properties: { plan: "premium" } });
```

> Detalhes: [`paywallo-funnel-tracking.md`](./paywallo-funnel-tracking.md)

---

## 4. A/B Testing

**Anti-flicker** (variante decide primeira renderização):

```tsx
// 1. Declarar no Provider
sessionFlags: ["welcome_variant"];

// 2. Ler síncrono
const variant = PaywalloClient.getSessionFlag("welcome_variant") ?? "control";
```

**Runtime** (flag consultada depois):

```tsx
const result = await PaywalloClient.getVariantCached("home_feature_x", "off");
if (result.variant === "on") {
  /* ... */
}
```

> Detalhes: [`paywall-ab-testing.md`](./paywall-ab-testing.md)

---

## 5. Push notifications (opcional)

**Pré-requisito:** instalar peer deps.

```bash
npm install @react-native-firebase/app @react-native-firebase/messaging
```

Adicione `google-services.json` (Android) e `GoogleService-Info.plist` (iOS) — o `base-app` já tem placeholders em `android/app/` e `ios/`.

**Pedir permissão** (em momento contextual, não no boot):

```tsx
import { PaywalloClient } from "@virex-tech/paywallo-sdk";

const status = await PaywalloClient.requestPushPermission({
  provisional: false, // true = silent permission no iOS (sem prompt)
});

if (status === "granted") {
  // user aceitou — token registrado automaticamente no server Paywallo
}
```

**Listeners** (opcional — Provider já wira o básico):

```tsx
import { notificationsManager } from "@virex-tech/paywallo-sdk";

notificationsManager.onOpened((payload) => {
  if (payload.deepLink) router.push(payload.deepLink);
});
```

**Logout**:

```tsx
await PaywalloClient.reset(); // já invalida o token local
// ou explicitamente:
await notificationsManager.optOut(); // remove token no server
```

---

## 6. Convenções alinhadas ao `base-app/CLAUDE.md`

A integração precisa respeitar as hard rules do `base-app`:

| Regra do CLAUDE.md                          | Como aplica ao Paywallo                                                      |
| :------------------------------------------ | :--------------------------------------------------------------------------- |
| Sem `any`                                   | SDK é totalmente tipado — use os types exportados (`CampaignResult`, etc.)   |
| Sem `console.log`                           | Use o `onError` callback do Provider                                         |
| Sem `useState/useEffect` em **componentes** | Encapsular lógica de paywall em hooks (`useUnlockPremium`, `useSessionFlag`) |
| Sem cores/spacing hardcoded                 | Se renderizar paywall local: usar `theme.colors.*`, `theme.spacing.*`        |
| `testID` obrigatório em interativos         | Botões "Restore", "Subscribe Now", "Maybe later" precisam de `testID`        |
| Features não importam de outras features    | Hooks Paywallo **compartilhados** vão em `src/lib/paywallo/hooks/`           |
| 1 export por arquivo                        | Um hook / componente por arquivo                                             |
| Imports ordenados                           | `react` → expo/3rd-party → `@virex-tech/paywallo-sdk` → `@/...` → relativos  |

### Estrutura sugerida no `base-app`

```
src/
├── lib/
│   └── paywallo/
│       ├── hooks/
│       │   ├── useSessionFlag.ts
│       │   ├── useUnlockPremium.ts
│       │   └── index.ts                   # barrel
│       └── index.ts
│
├── features/
│   ├── auth/
│   │   └── hooks/
│   │       └── usePaywalloAuthSync.ts     # identify on login
│   │
│   ├── onboarding/
│   │   └── hooks/
│   │       └── useOnboardingTracking.ts   # step/complete/drop
│   │
│   └── paywall/                           # opcional — UI local fallback
│       ├── index.tsx
│       ├── hooks/
│       │   └── usePaywallScreen.ts
│       ├── components/
│       │   └── LocalPaywall/
│       └── styles/
│
└── components/core/AppProviders/
    └── index.tsx                          # PaywalloProvider montado aqui
```

---

## 7. Backend (`base-supabase`) — Edge Function de subscription incluída

O `base-supabase` **já vem com a Edge Function `paywallo-webhook`** (`supabase/functions/paywallo-webhook/`) que recebe webhooks do Paywallo e mantém `profiles.is_premium` + a tabela `subscriptions` sincronizados. Use-a quando precisar de:

- Filtrar usuários premium por SQL via flag `profiles.is_premium` (RLS, queries)
- Reagir a eventos de assinatura no seu próprio banco
- Mostrar status de subscription em painel/dashboard interno

### Endpoint

```
POST https://<projeto>.supabase.co/functions/v1/paywallo-webhook?secret=<PATH_SECRET>
Headers:
  X-Paywallo-Signature: sha256=<hex-digest>   (HMAC SHA-256 sobre o body)
Body: { api_version, event: { id, type, app_user_id, product_id, ... } }
```

### Eventos suportados

`INITIAL_PURCHASE`, `RENEWAL`, `CANCELLATION`, `EXPIRATION`, `UNCANCELLATION`.

### Setup (4 passos)

1. **Secrets** em `base-supabase/.env`:
   ```env
   PAYWALLO_WEBHOOK_PATH_SECRET=<uuid-v4-gerado-por-você>
   PAYWALLO_WEBHOOK_HMAC_SECRET=<secret-também-no-dashboard-Paywallo>
   ```
2. **Publicar** (no diretório `base-supabase/`): `npm run secrets:set && npm run functions:deploy`
3. **Dashboard Paywallo**: cadastrar a URL pública `.../functions/v1/paywallo-webhook?secret=<PATH_SECRET>` e configurar o mesmo `secret` HMAC
4. **Verificar**: consultar `profiles.is_premium` ou a tabela `subscriptions` no Supabase Studio

### Vínculo a usuário

`event.app_user_id` é o `distinctId` do SDK Paywallo. A Edge Function casa:

1. Se for um UUID de profile conhecido → `profiles.id`
2. Senão → a subscription é gravada com `user_id: null` e `anonymous_user_id: <distinctId>`

### Comissão de referral (extensão)

Para correlacionar `INITIAL_PURCHASE` com `profiles.referred_by_id`, estenda a Edge Function `paywallo-webhook` ou adicione um trigger SQL na tabela `subscriptions`.

---

## 8. Checklist final de integração

### Setup

- [ ] `@virex-tech/paywallo-sdk` instalado + `pod install`
- [ ] `EXPO_PUBLIC_PAYWALLO_APP_KEY` em `.env` e `.env.example`
- [ ] `<PaywalloProvider>` montado em `AppProviders/index.tsx`
- [ ] `onError` plugado (Sentry / logger)
- [ ] `debug: __DEV__` configurado

### Identidade

- [ ] `identify({ email, properties })` no auth hook após login
- [ ] `reset()` no logout
- [ ] Atributos em `properties` são estáveis (sem `lastActiveAt` etc.)

### Funil

- [ ] `useOnboarding().step(stepName)` em cada tela do onboarding
- [ ] `complete()` antes do paywall final
- [ ] Nenhum `track("$onboarding_*")` ou `track("$paywall_*")` manual

### Paywall

- [ ] Placements criados no dashboard (snake_case, semânticos)
- [ ] Hooks por feature (`useUnlockPremium`, `useFeatureXGate`)
- [ ] Botão "Restore" se UI local
- [ ] Testado em Sandbox iOS + Google Play License Tester

### A/B testing

- [ ] Flags críticas (primeira renderização) em `sessionFlags`
- [ ] Flags runtime via `getVariantCached` com `defaultValue`
- [ ] Variantes em `snake_case`, com `control` para baseline

### Push (se aplicável)

- [ ] `@react-native-firebase/app` + `messaging` instalados
- [ ] `google-services.json` e `GoogleService-Info.plist` configurados
- [ ] `requestPushPermission()` em momento contextual (não boot)

### Qualidade

- [ ] `npm run check` passa (Prettier + ESLint + TS)
- [ ] Sem `any`, sem `console.log`, sem `StyleSheet.create` em componentes
- [ ] Componentes interativos têm `testID` + `accessibilityLabel`

---

## 9. Anti-patterns globais

| ❌ Não faça                                     | ✅ Faça                                                          |
| :---------------------------------------------- | :--------------------------------------------------------------- |
| Singleton wrapper `class PaywalloService`       | Importar `PaywalloClient` direto                                 |
| `init()` manual em `useEffect`                  | Deixar o `PaywalloProvider` cuidar disso                         |
| Sincronizar com RevenueCat / `react-native-iap` | SDK Paywallo tem IAP nativo — é o único provider                 |
| `track("$paywall_*")` manual                    | Nada — SDK rastreia automaticamente                              |
| `track("$onboarding_step", { stepIndex })`      | `useOnboarding().step("...")`                                    |
| Custom Zustand persist para A/B variants        | `sessionFlags` (sync) ou `getVariantCached` (com cache nativo)   |
| `PaywalloClient.init({ appKey, userId })`       | Sem `userId` no init — depois: `identify({ email, properties })` |
| `if (presentCampaign(...))` (booleano)          | `const r = await ...; if (r.purchased) ...`                      |
| `await getVariant(...)` em primeira tela        | Adicionar key em `sessionFlags`                                  |
| Múltiplos placements para variar preço          | 1 placement, A/B test no dashboard                               |
| `console.log` para debug em produção            | `debug: __DEV__` + `onError`                                     |

---

## 10. Quando algo dá errado

| Sintoma                                                    | Causa provável                                 | Fix                                                                          |
| :--------------------------------------------------------- | :--------------------------------------------- | :--------------------------------------------------------------------------- |
| `PAYWALL_NOT_INITIALIZED` ao chamar `presentCampaign`      | Provider não montou ainda                      | Aguarde `useReady()` do `usePaywallo()` ou apresente após `waitUntilReady()` |
| Paywall remoto não abre, retorna `result.presented: false` | Placement não existe no dashboard              | Crie no dashboard, ou implemente fallback local                              |
| Variants `null` no primeiro boot                           | Sem rede + flag não em `sessionFlags`          | Mover para `sessionFlags` ou aceitar `null` com default                      |
| Eventos não aparecem no dashboard                          | Buffer não flushou (app crashou)               | Verificar fila offline (`getOfflineQueueSize()`)                             |
| `hasActiveSubscription()` retorna `false` após compra      | Provider ainda não recebeu update da transação | Use `useSubscription()` (atualiza via listener) em vez de chamada imperativa |
| Push token não registra                                    | Peer deps Firebase não instaladas              | `npm install @react-native-firebase/app @react-native-firebase/messaging`    |
| iOS reclama de privacy manifest                            | Falta entrada de tracking                      | Adicionar `NSUserTrackingUsageDescription` em `Info.plist`                   |

---

## 11. Skills relacionadas

| Skill                                                          | Foco                                                                |
| :------------------------------------------------------------- | :------------------------------------------------------------------ |
| [`paywallo-sdk-setup.md`](./paywallo-sdk-setup.md)             | Instalação, Provider, identify, reset, onError                      |
| [`paywallo-paywall-skill.md`](./paywallo-paywall-skill.md)     | `requireSubscriptionWithCampaign`, `presentCampaign`, `gateContent` |
| [`paywallo-funnel-tracking.md`](./paywallo-funnel-tracking.md) | `useOnboarding`, eventos custom, identify enriquecido               |
| [`paywall-ab-testing.md`](./paywall-ab-testing.md)             | `sessionFlags`, `getVariantCached`, conditional flags               |

---

## 12. Integrações externas (dashboard-only)

Estas integrações **não exigem código no app** — toda configuração acontece no dashboard do Paywallo:

| Integração      | O que faz                                                       | Skill                                            |
| :-------------- | :-------------------------------------------------------------- | :----------------------------------------------- |
| **Meta Ads**    | Envia `paywallo_install` + `Purchase` server-side via CAPI      | [`paywallo-integrations.md`](./paywallo-integrations.md) |
| **TikTok Ads**  | Envia `paywallo_install` + `Purchase` via Events API            | [`paywallo-integrations.md`](./paywallo-integrations.md) |
| **Superwall**   | Importa eventos `initial_purchase`, `renewal`, etc. via webhook | [`paywallo-integrations.md`](./paywallo-integrations.md) |

---

## 13. Referências

- **README oficial do SDK:** `C:\Projects\paywallo\panel-sdk\README.md`
- **Types completos:** `C:\Projects\paywallo\panel-sdk\dist\index.d.ts`
- **Dashboard:** `https://paywallo.com.br/dashboard`
- **Documentação web oficial:** `https://paywallo.com.br/docs` (em construção — só páginas Intro, Meta Ads, TikTok Ads e Superwall estão publicadas; demais marcam "Esta página está sendo escrita")
