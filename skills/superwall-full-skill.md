# Skill: Superwall — Guia Consolidado (Master)

> **SDK alvo:** `expo-superwall` v1.x
> **App alvo:** `base-app` (React Native + Expo SDK 54)
> **Doc oficial:** [`https://superwall.com/docs`](https://superwall.com/docs) · [`github.com/superwall/expo-superwall`](https://github.com/superwall/expo-superwall)

Guia mestre da integração Superwall no `base-app`. Consolida as skills:

- [`superwall-sdk-setup.md`](./superwall-sdk-setup.md) — instalação, keys, Provider, identidade
- [`superwall-paywall-skill.md`](./superwall-paywall-skill.md) — placements e feature gating
- [`superwall-events-tracking.md`](./superwall-events-tracking.md) — eventos do SDK e analytics
- [`superwall-ab-testing.md`](./superwall-ab-testing.md) — campanhas, holdouts, audiência
- [`superwall-integrations.md`](./superwall-integrations.md) — atribuição e backend sync

---

## TL;DR

- Monetização **híbrida**: **Superwall** apresenta o paywall; **Paywallo** cuida de identidade/tracking, funil de onboarding e da fonte de verdade de assinatura (webhook no backend). Sem RevenueCat.
- Superwall: SDK de **paywall remoto + A/B**. Paywalls/experimentos vivem no **dashboard**; o app só dispara **placements** e reage.
- Setup: `expo-superwall` + `<SuperwallProvider apiKeys={{ ios, android }}>` + `@virex-tech/paywallo-sdk` + `<PaywalloProvider>` + development build.
- Identidade: `useUser().identify` (Superwall) **e** `PaywalloClient.identify` (Paywallo) — bridges separados.
- Gate de paywall: `useSubscriptionGate(placement).unlock()` → `Promise<boolean>` (Superwall).
- Funil de onboarding e A/B de UI não-paywall: **Paywallo** (`useOnboarding`, `useSessionFlag`). Ver `paywallo-*.md`.

---

## 1. Arquitetura no `base-app`

```
src/lib/
├── superwall/                    # apresentação do paywall
│   ├── SuperwallAuthBridge.tsx   #   monta useSuperwallAuthSync
│   └── hooks/
│       ├── useSuperwallAuthSync.ts  # identify/update no login, signOut no logout
│       └── useSubscriptionGate.ts   # gate de feature via usePlacement
└── paywallo/                     # identidade, funil, assinatura
    ├── PaywalloAuthBridge.tsx    #   monta usePaywalloAuthSync
    └── hooks/
        ├── usePaywalloAuthSync.ts   # identify/reset
        └── useSessionFlag.ts        # A/B síncrono de UI não-paywall
```

No `AppProviders` (`src/components/core/`): `PaywalloProvider` (externo) → `SuperwallProvider` → `PaywalloAuthBridge` → `SuperwallAuthBridge` → resto. O funil de onboarding (`useOnboarding` do Paywallo) é consumido por `useOnboardingTracking`.

---

## 2. Setup (resumo)

```bash
npm install expo-superwall
npx expo prebuild && cd ios && pod install && cd ..
```

`.env`:

```env
EXPO_PUBLIC_SUPERWALL_IOS_API_KEY=pk_xxxxxxxx
EXPO_PUBLIC_SUPERWALL_ANDROID_API_KEY=pk_yyyyyyyy
```

> Requer **development build** (não Expo Go). Detalhes em [`superwall-sdk-setup.md`](./superwall-sdk-setup.md).

---

## 3. Identidade

```tsx
const { identify, update, signOut } = useUser();
// login:  await identify(userId); await update((o) => ({ ...o, plan, signupAt }));
// logout: await signOut();
```

No template, `useSuperwallAuthSync` faz isso reagindo ao `user` do store Zustand.

---

## 4. Apresentar paywall / gate de feature

```tsx
const { unlock, isUnlocking } = useSubscriptionGate("premium_feature_gate");

const onPremium = async () => {
	if (await unlock()) {
		// acesso liberado
	}
};
```

- `unlock()` → `true` quando o usuário tem acesso (assinante, holdout/skip, ou comprou/restaurou); `false` quando recusa ou erro.
- Gate de **exibição** (sem disparar paywall): `useUser().subscriptionStatus?.status === "ACTIVE"`.

Detalhes em [`superwall-paywall-skill.md`](./superwall-paywall-skill.md).

---

## 5. A/B testing

A/B de **paywall** é configurado no dashboard do Superwall (campanhas → regras de audiência → variantes/holdout). O app coopera enviando **atributos** (`update`) e **params** (`registerPlacement({ params })`). Holdout chega como `onSkip({ type: "Holdout" })` e significa **acesso liberado**.

A/B de **UI fora do paywall** usa o `useSessionFlag` do **Paywallo** (síncrono, anti-flicker). Ver [`superwall-ab-testing.md`](./superwall-ab-testing.md) e [`paywallo-funnel-tracking.md`](./paywallo-funnel-tracking.md).

---

## 6. Eventos & analytics

- **Funil de onboarding** → Paywallo (`useOnboarding` via `useOnboardingTracking`), automático. Ver [`paywallo-funnel-tracking.md`](./paywallo-funnel-tracking.md).
- **Eventos de paywall/transação** → `useSuperwallEvents({ onSuperwallEvent, onLog })`, úteis para espelhar num destino extra. Ver [`superwall-events-tracking.md`](./superwall-events-tracking.md).

---

## 7. O que mudou em relação ao Paywallo puro

Antes o Paywallo apresentava o paywall **e** cuidava de tudo. Agora a **apresentação do paywall migrou para o Superwall**; o resto continua no Paywallo.

| Responsabilidade                  | Antes (Paywallo)                  | Agora                                   |
| :-------------------------------- | :-------------------------------- | :-------------------------------------- |
| Apresentar paywall / gate         | `PaywalloClient` + `useSubscriptionGate` | **Superwall** `useSubscriptionGate` (placement) |
| Identidade no app                 | `usePaywalloAuthSync`             | `usePaywalloAuthSync` **+** `useSuperwallAuthSync` |
| Funil de onboarding               | `useOnboarding`                   | `useOnboarding` (inalterado)            |
| A/B de UI não-paywall             | `useSessionFlag`                  | `useSessionFlag` (inalterado)           |
| Fonte de verdade de assinatura    | `paywallo-webhook`                | `paywallo-webhook` (inalterado)         |
| Env keys                          | `EXPO_PUBLIC_PAYWALLO_APP_KEY`    | `_PAYWALLO_APP_KEY` **+** `_SUPERWALL_IOS/ANDROID_API_KEY` |

---

## 8. Hard rules

- **PROIBIDO** RevenueCat / `react-native-iap` (Superwall + Paywallo já cobrem IAP nativo). **Não usar RevenueCat.**
- **PROIBIDO** `Superwall.shared` direto fora de `src/lib/superwall/` — use os hooks.
- **PROIBIDO** envolver o `PaywalloClient` em wrapper Singleton — já é singleton.
- Apresentar/gatear paywall = **Superwall**. Identidade/funil/assinatura = **Paywallo**. Não duplicar.
- A/B e paywalls são configurados **no dashboard**, não em código.
- Requer **development build**.
- Tratar `onSkip`/holdout como **acesso liberado**, nunca como bloqueio.
