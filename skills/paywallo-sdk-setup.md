# Skill: Paywallo — Setup & Identidade (camada de tracking/assinatura)

> **SDK alvo:** `@virex-tech/paywallo-sdk` v2.x · **App:** `base-app` (RN + Expo SDK 54)
> **Doc oficial:** [`https://paywallo.com.br/docs`](https://paywallo.com.br/docs)

No `base-app`, o Paywallo **não apresenta o paywall** — isso é do Superwall (ver [`superwall-paywall-skill.md`](./superwall-paywall-skill.md)). O Paywallo fica responsável por **identidade/tracking, funil de onboarding e fonte de verdade de assinatura** (via `paywallo-webhook` no backend). Esta skill cobre o setup dessa camada.

> ⚠️ **Não envolva o `PaywalloClient` em Singleton wrapper.** Ele já é singleton.
> ⚠️ **Não use o Paywallo para apresentar paywall** no template — o gate/apresentação é do Superwall.

---

## 1. Instalação

```bash
cd base-app
npm install @virex-tech/paywallo-sdk
cd ios && pod install && cd ..    # após expo prebuild
```

Autolinking do RN resolve o nativo. Requer **development build** (não Expo Go). Coexiste com o `expo-superwall`.

---

## 2. Variável de ambiente

```env
EXPO_PUBLIC_PAYWALLO_APP_KEY=pk_xxxxxxxx
```

Pegue no dashboard do Paywallo (→ seu app → Settings). Declare o tipo em `src/types/global.d.ts`.

---

## 3. Provider (coexistindo com o Superwall)

Em `src/components/core/AppProviders/index.tsx`, o `PaywalloProvider` é o **mais externo**, com o `SuperwallProvider` dentro:

```tsx
<PaywalloProvider config={paywalloConfig}>
	<SuperwallProvider apiKeys={SUPERWALL_API_KEYS}>
		<PaywalloAuthBridge>
			<SuperwallAuthBridge>{/* resto */}</SuperwallAuthBridge>
		</PaywalloAuthBridge>
	</SuperwallProvider>
</PaywalloProvider>
```

```tsx
const paywalloConfig: PaywalloInitConfig = {
	appKey: process.env.EXPO_PUBLIC_PAYWALLO_APP_KEY ?? "",
	debug: __DEV__,
	onError: (error: unknown): void => {
		if (__DEV__) return;
		// Sentry.captureException(error, { tags: { source: "paywallo-sdk" } })
		void error;
	},
};
```

> Declare `paywalloConfig` como variável tipada `PaywalloInitConfig` (não literal inline) — o type público do Provider é um subset; campos como `onError`/`sessionFlags` passam por referência.

---

## 4. Identidade — `src/lib/paywallo/`

`usePaywalloAuthSync` (montado pelo `PaywalloAuthBridge`) reage ao `user` do store Zustand:

```tsx
// login
void PaywalloClient.identify({
	email: user.email,
	properties: { name: user.name, signup_at: user.createdAt, referral_code: user.referralCode },
});
// logout
void PaywalloClient.reset();
```

**Regras:**

- `identify` é idempotente; o merge de `properties` é não-destrutivo.
- Use valores **estáveis** em `properties` (plano, cohort, signup_at).
- `reset()` no logout (não `fullReset()`).
- O `app_user_id` que o backend usa para casar a assinatura vem dessa identidade — mantenha o `identify` consistente com `profiles.id`.

---

## 5. Checklist

- [ ] `npm install @virex-tech/paywallo-sdk` + `pod install`
- [ ] `EXPO_PUBLIC_PAYWALLO_APP_KEY` no `.env` (+ `.env.example`)
- [ ] `PaywalloProvider` externo ao `SuperwallProvider` no `AppProviders`
- [ ] `PaywalloAuthBridge` montado (identify/reset reativo)
- [ ] `onError` plugado no Sentry/logger
- [ ] **Não** usar Paywallo para apresentar paywall (isso é do Superwall)

Próximas: [`paywallo-funnel-tracking.md`](./paywallo-funnel-tracking.md) · [`paywallo-integrations.md`](./paywallo-integrations.md) · [`superwall-full-skill.md`](./superwall-full-skill.md).
