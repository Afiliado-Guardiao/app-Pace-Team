# Skill: Paywallo — Funil de Onboarding & A/B de UI

> **SDK alvo:** `@virex-tech/paywallo-sdk` v2.x · **App:** `base-app`
> Pré-requisito: [`paywallo-sdk-setup.md`](./paywallo-sdk-setup.md).

No modelo híbrido, o **funil de onboarding e o A/B de UI fora do paywall** são do Paywallo. (O paywall em si e o A/B de paywall são do Superwall — ver [`superwall-ab-testing.md`](./superwall-ab-testing.md).)

---

## 1. Funil de onboarding

`useOnboarding()` do Paywallo emite os eventos de funil **automaticamente**. No template, o hook `useOnboardingTracking` (`src/features/onboarding/hooks/`) o encapsula:

```tsx
const { step, complete, drop } = useOnboarding();

trackStepViewed   = (name) => step(name);      // passo visto
trackStepDropped  = (name) => drop(name);      // passo abandonado
trackOnboardingCompleted = () => complete();   // funil concluído
```

Consumidores no template:

- `useOnboardingNavigation` → `trackStepViewed(currentStep.id)` a cada passo.
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

## 3. Checklist

- [ ] Funil via `useOnboardingTracking` (não eventos manuais)
- [ ] `trackStepViewed` em cada passo; `trackOnboardingCompleted` na conclusão
- [ ] `useSessionFlag` para A/B de UI não-paywall
- [ ] Flags críticas de boot declaradas em `sessionFlags` no Provider
- [ ] A/B de paywall fica no dashboard do Superwall (não aqui)
