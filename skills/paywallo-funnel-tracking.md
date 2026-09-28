# Skill: Paywallo — Funil de Onboarding & A/B de UI

> **SDK alvo:** `@virex-tech/paywallo-sdk` ^2.10.0 · **App:** `base-app`
> Pré-requisito: [`paywallo-sdk-setup.md`](./paywallo-sdk-setup.md).

No modelo híbrido, o **funil de onboarding e o A/B de UI fora do paywall** são do Paywallo. (O paywall em si e o A/B de paywall são do Superwall — ver [`superwall-ab-testing.md`](./superwall-ab-testing.md).)

---

## 1. Funil de onboarding

`useOnboarding()` do Paywallo emite os eventos de funil **automaticamente** e retorna só `{ step, complete }` — **`drop` não existe mais** (removido na 2.6.0; o abandono agora é inferido no backend por inatividade). No template, o hook `useOnboardingTracking` (`src/features/onboarding/hooks/`) o encapsula:

```tsx
const { step, complete } = useOnboarding();

trackStepViewed          = (name, order) => step(name, order);   // passo visto
trackOnboardingCompleted = ()             => complete();          // funil concluído
```

`order` é **obrigatório** desde a 2.6.0 — número finito ≥ 0 (o servidor faz o floor, não arredonde). Sem ele, `step()` lança `OnboardingError` (`ONBOARDING_INVALID_ORDER`). Use decimais para variantes A/B do mesmo passo (`2` e `2.1`) e o terceiro argumento opcional `{ variantKey?, timeOnPrevS? }` para nomear a variante ou registrar o tempo gasto na tela anterior; `complete({ variantKey })` fecha o funil pela variante correta.

Consumidores no template:

- `useOnboardingNavigation` → `trackStepViewed(currentStep.id, currentStepIndex + 1)` a cada passo (`order` 1-based).
- `useOnboardingSync` → `trackOnboardingCompleted()` ao concluir.

**Regras:**

- **PROIBIDO** rastrear eventos `$onboarding_*` manualmente — o SDK emite. Tracking manual duplica o funil.
- Use o `id` do passo (estável), não o label traduzido.
- Não chame `step` em re-render desnecessário — o template já chama dentro de `useEffect` por `currentStep.id`.

---

## 2. A/B de UI (session flags)

Para variar UI **fora** de um paywall (ex.: tela de welcome) sem flicker na primeira renderização, use `useSessionFlag` (síncrono):

```tsx
import { useSessionFlag } from "@/lib/paywallo";

const { variant, is } = useSessionFlag("welcome_variant", "control");
if (is("b")) {
	/* render variante B */
}
```

As flags são pré-resolvidas no boot. Para flags críticas de primeira renderização, declare-as em `sessionFlags` no `paywalloConfig` do Provider.

> Isso é A/B de **UI**, não de paywall. A/B de paywall (qual paywall, preço, holdout) é configurado no dashboard do **Superwall**.

---

## 3. Eventos custom

Para eventos de produto fora do funil/paywall, use `PaywalloClient.track`:

```tsx
import { PaywalloClient } from "@virex-tech/paywallo-sdk";

await PaywalloClient.track("meal_logged", { properties: { meal_type: "lunch" } });
await PaywalloClient.track("refund_requested", { properties: { order_id }, priority: "critical" });
```

- `priority: "critical"` para eventos financeiros (flush imediato + retry durável); o padrão `"normal"` vai em lote (com retry durável a partir da 2.10.1).
- **NUNCA** rastreie manualmente `$paywall_*`, `$onboarding_*`, `paywall` ou `transaction` — o SDK já emite isso sozinho via bridge automático com o Superwall (`onPaywallPresent`/`onPaywallDismiss`/`transactionComplete` viram eventos Paywallo). Rastrear de novo duplica o evento no dashboard.

---

## 4. Checklist

- [ ] Funil via `useOnboardingTracking` (não eventos manuais); `order` sempre passado
- [ ] `trackStepViewed` em cada passo; `trackOnboardingCompleted` na conclusão
- [ ] `useSessionFlag` para A/B de UI não-paywall
- [ ] Flags críticas de boot declaradas em `sessionFlags` no Provider
- [ ] A/B de paywall fica no dashboard do Superwall (não aqui)
- [ ] Eventos de compra/paywall não são rastreados manualmente (bridge automático já cobre)
