# Skill: Paywallo — Setup & Identidade (camada de tracking/assinatura)

> **SDK alvo:** `@virex-tech/paywallo-sdk` ^2.10.0 · **App:** `base-app` (RN + Expo SDK 54)
> **Doc oficial:** [`https://paywallo.com.br/docs`](https://paywallo.com.br/docs)

No `base-app`, o Paywallo **não apresenta o paywall** — isso é do Superwall (ver [`superwall-paywall-skill.md`](./superwall-paywall-skill.md)). O Paywallo fica responsável por **identidade/tracking, funil de onboarding e fonte de verdade de assinatura** (via `paywallo-webhook` no backend). Esta skill cobre o setup dessa camada.

> ⚠️ **Não envolva o `PaywalloClient` em Singleton wrapper.** Ele já é singleton.
> ⚠️ **Não use o Paywallo para apresentar paywall** no template — o gate/apresentação é do Superwall.

---

## 1. Instalação

```bash
cd base-app
npm install @virex-tech/paywallo-sdk
npx expo install expo-application expo-device expo-localization   # peer deps obrigatórias
cd ios && pod install && cd ..    # após expo prebuild
```

`expo-application`, `expo-device` e `expo-localization` são importadas estaticamente pelo SDK — a ausência de qualquer uma quebra o build (não é um degrade silencioso). Autolinking do RN resolve o nativo; **não há config plugin Expo**. Requer **development build** (não Expo Go) e **rebuild nativo a cada atualização do SDK** (OTA/CodePush/EAS Update não bastam — módulos nativos novos só entram num binário recompilado). Coexiste com o `expo-superwall`.

Opcionais conforme o caso: `@react-native-async-storage/async-storage`, `@react-native-firebase/app` (só Android, push), `expo-superwall`, `expo-tracking-transparency` (ATT — ver seção 3).

---

## 2. Variável de ambiente

```env
EXPO_PUBLIC_PAYWALLO_APP_KEY=pk_xxxxxxxx
```

Pegue no dashboard do Paywallo (→ seu app → Settings). Declare o tipo em `src/types/global.d.ts`.

> A URL padrão da API agora é `https://serverjs.paywallo.com.br`. **Não configure `apiUrl`** no `paywalloConfig` em produção — é só para apontar o SDK a um servidor local durante teste.

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

Campos válidos: `appKey`, `apiUrl?` (só teste local), `debug?`, `environment?`, `autoStartSession?`, `sessionConfig?`, `sessionFlags?`, `timeout?`, `subscriptionCacheTTL?`, `onError?`, `notifications?`, `skan?` (default `true`; use `skan: false` se outro SDK do app já for dono do conversion value do iOS — dois escritores corrompem o sinal). `offlineQueueEnabled`/`autoPreloadCampaign` ainda são aceitos pelo tipo mas são **ignorados** (stubs `@deprecated`, saem na v3.0.0) — não configure.

> ⚠️ **`requestATT` não existe mais** (removido na 2.8.0). O SDK nunca pede o ATT sozinho. Se o app precisa do IDFA (Meta/AppsFlyer), chame `requestTrackingPermissionsAsync()` de `expo-tracking-transparency` **antes** de montar o `PaywalloProvider`, e declare `NSUserTrackingUsageDescription` no `Info.plist`. Se o Provider montar primeiro, o install sobe com `attStatus: 'undetermined'` (sem IDFA) e a atribuição fica degradada.

---

## 4. Identidade — `src/lib/paywallo/`

`usePaywalloAuthSync` (montado pelo `PaywalloAuthBridge`) reage ao `user` do store Zustand:

```tsx
// login
void PaywalloClient.identify({
	userId: user.id,
	email: user.email ?? undefined,
	properties: { name: user.name, signup_at: user.createdAt, referral_code: user.referralCode },
});
// logout
void PaywalloClient.reset();
```

**Regras:**

- `identify` é idempotente; o merge de `properties` é não-destrutivo. O SDK também deduplica payload idêntico por até 24h — chamar em todo cold start logado é seguro e barato.
- Use valores **estáveis** em `properties` (plano, cohort, signup_at).
- `reset()` no logout (não `fullReset()`).
- `userId` vira `external_user_id` no servidor — é por ele que o `paywallo-webhook` casa a assinatura com o `profiles.id` e que o envio de push por usuário encontra o device. Mantenha `identify({ userId })` consistente com `profiles.id`.
- `deleteUserData()` (LGPD) só apaga PII local e gira o `distinctId` — não sinaliza o servidor (a rota nunca existiu). É um "esqueça-me" no device, não no backend.

---

## 5. Checklist

- [ ] `npm install @virex-tech/paywallo-sdk` (^2.10.0) + peer deps (`expo-application`, `expo-device`, `expo-localization`) + `pod install`
- [ ] `EXPO_PUBLIC_PAYWALLO_APP_KEY` no `.env` (+ `.env.example`) — sem `apiUrl` em produção
- [ ] `PaywalloProvider` externo ao `SuperwallProvider` no `AppProviders`
- [ ] `PaywalloAuthBridge` montado (`identify` com `userId` / `reset` reativo)
- [ ] `onError` plugado no Sentry/logger
- [ ] Se o app usa ATT: `requestTrackingPermissionsAsync()` chamado antes do `PaywalloProvider` montar
- [ ] Rebuild nativo feito após instalar/atualizar o SDK
- [ ] **Não** usar Paywallo para apresentar paywall (isso é do Superwall)
- [ ] **Não** chamar APIs de paywall/campanha próprias do Paywallo (`presentPaywall`, `getCampaign`, `preload*`, `requireSubscriptionWithCampaign` etc.) — removidas na 2.10.0, viram stubs inertes

> ⚠️ **iOS Privacy Manifest:** o SDK ainda não embarca `PrivacyInfo.xcprivacy` (decisão pendente do lado Paywallo). Ponto de atenção na submissão à App Store enquanto isso não muda.

Próximas: [`paywallo-funnel-tracking.md`](./paywallo-funnel-tracking.md) · [`paywallo-integrations.md`](./paywallo-integrations.md) · [`superwall-full-skill.md`](./superwall-full-skill.md).
