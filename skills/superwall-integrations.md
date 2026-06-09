# Skill: Superwall — Integrações & Atribuição

> **SDK alvo:** `expo-superwall` v1.x · **App:** `base-app`
> Pré-requisito: [`superwall-sdk-setup.md`](./superwall-sdk-setup.md).

Como conectar o Superwall a analytics/atribuição e ao seu backend.

---

## 1. Integrações nativas do dashboard

A maior parte das integrações é configurada **no dashboard do Superwall** (Settings → Integrations), não em código: o Superwall envia eventos de paywall/transação para os destinos que você ativar (ex.: Amplitude, Mixpanel, webhooks, etc.).

O app só precisa garantir que a **identidade** e os **atributos de atribuição** cheguem ao SDK — o resto é server-to-server.

---

## 2. Atributos de integração (`setIntegrationAttributes`)

Para correlacionar o usuário do Superwall com IDs de atribuição (AppsFlyer, Facebook, etc.), use `setIntegrationAttributes` após `identify`:

```tsx
const { identify, setIntegrationAttributes, update } = useUser();

await identify(userId);

// IDs de atribuição (buscados do seu SDK de atribuição):
await setIntegrationAttributes({
	appsflyerId: afId,
	// fbAnonId, etc.
});

// params de atribuição como atributos para filtros de campanha:
await update((old) => ({ ...old, utm_source, campaign }));
```

> No `base-app` (template enxuto) isso é **opcional** — só pluge se o fork usar AppsFlyer/Meta. O exemplo `ozempro-app` no workspace mostra o padrão completo em `useSuperwallUser.ts`.

---

## 3. Fonte de verdade da assinatura = Paywallo (server-side)

No modelo híbrido do template, a **fonte de verdade server-side é o Paywallo**: o `paywallo-webhook` (em `../base-supabase/`) recebe os eventos de assinatura e mantém `subscriptions` + `profiles.is_premium`. As compras feitas no paywall do Superwall chegam ao Paywallo via App Store/Play Notifications. **Não usamos RevenueCat.** Ver [`paywallo-integrations.md`](./paywallo-integrations.md).

Para evitar paywall de retenção quando o backend já diz que o usuário é Pro, espelhe o status para o Superwall:

```tsx
const { setSubscriptionStatus } = useUser();

// usuário é Pro pelo backend (profiles.is_premium) → informe o Superwall
await setSubscriptionStatus({
	status: "ACTIVE",
	entitlements: [{ id: "pro", type: "SERVICE_LEVEL" }],
});
```

> O `ozempro-app` implementa esse sync store ↔ Superwall em `useSuperwallSubscription.ts` — use como referência.

---

## 4. Sentry / PostHog (opcional no template)

Não vêm no skeleton. Para integrar:

1. Instale a lib (`npm install @sentry/react-native` ou `posthog-react-native`).
2. Adicione o mock em `jest.setup.js`.
3. Pluge:
   - **erros** → `onError` do `PaywalloProvider` / `Sentry.init` no entrypoint;
   - **funil de onboarding** → já é do Paywallo (`useOnboarding`); espelhe no PostHog só se quiser um destino extra;
   - **eventos de paywall** → `useSuperwallEvents({ onSuperwallEvent })` espelhando para o PostHog.

---

## 5. Checklist

- [ ] Integrações de destino ativadas no dashboard do Superwall
- [ ] `setIntegrationAttributes` plugado **se** usar atribuição (AppsFlyer/Meta)
- [ ] Sync de assinatura backend ↔ `setSubscriptionStatus` (se backend é fonte de verdade)
- [ ] `transactionComplete` notifica o backend para persistir a transação
- [ ] Sentry/PostHog plugados conscientemente (ou propositalmente fora)

Referência completa no workspace: `ozempro-app/src/app/hooks/useSuperwall*.ts`.
