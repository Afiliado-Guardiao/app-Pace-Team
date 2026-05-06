# Skill: Paywallo SDK — Tracking de Funil & Eventos

> **Pré-requisito:** [`paywallo-sdk-setup.md`](./paywallo-sdk-setup.md) já aplicado.

Esta skill cobre como instrumentar o funil do `base-app` (welcome → onboarding → auth → home → paywall) para que o dashboard do Paywallo calcule taxa de conversão e identifique drop-off automaticamente.

> ⚠️ **A API mudou no SDK 2.x.** Eventos manuais com prefixo `$onboarding_*` e schemas custom (`stepIndex`, `totalSteps`, `timeSinceStart`) **não são mais necessários**. O SDK tem um `OnboardingManager` dedicado e o hook `useOnboarding()` que fala com o server na taxonomia correta.

---

## 1. Anatomia do funil que o Paywallo mede

| Camada               | Como o SDK rastreia                          | O que você instrumenta               |
| :------------------- | :------------------------------------------- | :----------------------------------- |
| Install / first open | Automático no boot (`lifecycle.install`)     | Nada                                 |
| Sessão               | Automático (`autoStartSession: true`)        | Nada                                 |
| Identify             | `PaywalloClient.identify({ email })`         | Após login                           |
| **Onboarding steps** | `useOnboarding().step(stepName)`             | Em cada tela do onboarding           |
| **Onboarding done**  | `useOnboarding().complete()`                 | Na última tela / antes do paywall    |
| **Onboarding drop**  | `useOnboarding().drop(stepName)` (opcional)  | Botão "skip" / abandono explícito    |
| Paywall view         | Automático em `presentCampaign`              | Nada                                 |
| Purchase             | Automático após validação StoreKit / Play    | Nada                                 |
| Eventos custom       | `PaywalloClient.track(name, { properties })` | Eventos de produto (CTA, share, ...) |

> Drop-off é detectado pelo **server**: se um user dispara `step("X")` mas nunca `step("Y")` ou `complete()`, ele é contado como drop em "X". Você não precisa rastrear isso manualmente.

---

## 2. Onboarding: o padrão correto

O `base-app` tem `src/features/onboarding/` com fluxo multi-step. Plugue o tracking via hook:

```tsx
// src/features/onboarding/hooks/useOnboardingTracking.ts
import { useCallback } from "react";

import { useOnboarding } from "@virex-tech/paywallo-sdk";

interface IUseOnboardingTrackingReturn {
  trackStep: (stepName: string) => Promise<void>;
  trackComplete: () => Promise<void>;
  trackDrop: (stepName: string) => Promise<void>;
}

export const useOnboardingTracking = (): IUseOnboardingTrackingReturn => {
  const { step, complete, drop } = useOnboarding();

  const trackStep = useCallback(
    async (stepName: string): Promise<void> => {
      await step(stepName);
    },
    [step],
  );

  const trackComplete = useCallback(async (): Promise<void> => {
    await complete();
  }, [complete]);

  const trackDrop = useCallback(
    async (stepName: string): Promise<void> => {
      await drop(stepName);
    },
    [drop],
  );

  return { trackStep, trackComplete, trackDrop };
};
```

### Convenção de naming

`stepName` é uma **string estável e única por tela**, em `snake_case`:

```
welcome
goal_selection
gender
age
weight
target_weight
loading_personalization
result_summary
```

**Regras:**

- Nomes consistentes — não mude depois que estiver em produção (quebra histórico do funil)
- Sem espaços, sem maiúsculas
- Sem `step_1`, `step_2` — use o **nome semântico** da tela

### Plugando no fluxo

No hook que orquestra o passo atual da feature `onboarding`:

```tsx
// src/features/onboarding/hooks/useOnboardingFlow.ts
import { useEffect } from "react";

import { useOnboardingTracking } from "./useOnboardingTracking";

export const useOnboardingFlow = () => {
  const { trackStep, trackComplete } = useOnboardingTracking();
  const currentStep = useOnboardingStore((s) => s.currentStep);
  const isLastStep = useOnboardingStore((s) => s.isLastStep);

  useEffect(() => {
    if (!currentStep?.name) return;
    void trackStep(currentStep.name);
  }, [currentStep?.name, trackStep]);

  const handleFinish = async (): Promise<void> => {
    await trackComplete();
    router.replace(ROUTES.PAYWALL);
  };

  return { handleFinish };
};
```

**Por que `useEffect` aqui é OK** (apesar do CLAUDE.md restringir useEffect a hooks): o efeito de tracking é uma função do estado da máquina de onboarding, não de uma renderização. Mantenha apenas no hook, nunca no componente.

### `drop()` — quando usar

Use só em **abandono explícito**:

```tsx
const handleSkipOnboarding = async (): Promise<void> => {
  await trackDrop(currentStep.name);
  router.replace(ROUTES.HOME);
};
```

Para abandono passivo (user fechou o app), **não chame nada** — o server detecta automaticamente pela ausência do próximo `step` ou de `complete`.

---

## 3. Eventos custom (`track`)

Para eventos de produto que **não** são onboarding nem paywall:

```tsx
import { PaywalloClient } from "@virex-tech/paywallo-sdk";

// Engajamento
await PaywalloClient.track("recipe_saved", {
  properties: { recipe_id: "rec_123", category: "vegan" },
});

// Conversão de funil custom
await PaywalloClient.track("share_invitation_sent", {
  properties: { channel: "whatsapp" },
});

// Evento crítico (flush imediato — não enfileira)
await PaywalloClient.track("checkout_started", {
  properties: { plan: "annual" },
  priority: "critical",
});
```

### Assinatura de `track`

```ts
track(eventName: string, options?: {
  properties?: UserProperties;       // Record<string, string|number|boolean|null>
  timestamp?: number;                // ms — default: agora
  priority?: "critical" | "normal";  // default: normal
}): Promise<void>
```

**Quando usar `priority: "critical"`:**

- Eventos onde a perda é inaceitável: `transaction`, `subscription_*`, `refund`, `checkout_started`, `identify`, `install`
- O SDK já marca automaticamente os eventos de IAP / lifecycle como críticos. **Você só precisa marcar eventos de produto que sejam financeiros.**
- `normal` é o default e bufferiza em **lotes de até 10 eventos a cada 5 segundos** — ideal para tracking de UI.

### Fila offline

Se o device fica offline, o SDK persiste eventos numa fila local (até **100 itens**, expira em **3 dias**). Quando a conexão volta, drena automaticamente. Você pode consultar:

```tsx
const queueSize = PaywalloClient.getOfflineQueueSize();
```

### Convenção de naming de eventos

| Tipo                        | Convenção             | Exemplo                    |
| :-------------------------- | :-------------------- | :------------------------- |
| Ação do user                | `noun_verb` (passado) | `recipe_saved`, `goal_set` |
| Funil custom (não onb.)     | `flow_step_action`    | `meal_plan_step_completed` |
| Evento crítico (financeiro) | `noun_verb`           | `checkout_started`         |

**Não use** prefixos `$` em eventos custom — esses são reservados para taxonomia do SDK (`$paywall_viewed`, `$onboarding_step`, etc.). Misturar quebra dashboards.

---

## 4. Identify enriquecido (atributos de segmentação)

Use `identify` (não `track`) para **atributos do user** que não mudam a cada sessão:

```tsx
await PaywalloClient.identify({
  email: user.email,
  properties: {
    plan: user.plan, // free | premium | trial
    signup_at: user.createdAt, // ISO string
    cohort: user.cohort, // ex: "2026-q2"
    locale: user.locale, // pt-BR
    has_completed_onboarding: true,
  },
});
```

Atributos de identify aparecem no dashboard como filtros segmentáveis ("usuários do plano free que viram paywall X").

**Não envie em identify:**

- `lastActiveAt` — muda a cada sessão (use `track` com session events)
- PII além de email (telefone, endereço)
- Tokens, IDs de sessão

### Limites de propriedades

| Limite                           | Valor                            |
| :------------------------------- | :------------------------------- |
| Chaves por usuário               | **50**                           |
| Tamanho de cada valor            | **1 KB**                         |
| Profundidade (se valor é objeto) | **3 níveis** (recomendado: flat) |

> O merge de `identify` é **não-destrutivo**: chamar `identify` de novo adiciona/atualiza campos sem apagar os existentes. Eventos disparados antes do `identify` ficam associados ao mesmo usuário.

### Atualizando properties sem mudar email

```tsx
await PaywalloClient.identify({
  properties: { plan: "premium" },
});
```

Passar `identify` sem `email` apenas atualiza properties — útil quando o user faz upgrade de plano e você quer refletir no dashboard sem chamar identify completo.

---

## 5. Que eventos **não** rastrear manualmente

O SDK 2.x já emite estes — rastrear manualmente causa duplicação:

| Evento                      | Emitido automaticamente em                                           |
| :-------------------------- | :------------------------------------------------------------------- |
| `$app_installed`            | Primeira abertura do app (inclui device model, OS, locale, referrer) |
| `$app_open`                 | App volta a foreground                                               |
| `$app_background`           | App vai pra background (inclui duração da sessão)                    |
| `$session_start`            | Nova sessão começa (`autoStartSession`, timeout 30 min)              |
| `$session_end`              | Sessão termina                                                       |
| `$paywall_viewed`           | Paywall aparece (placement, paywallId, variantKey)                   |
| `$paywall_product_selected` | User escolhe um produto no paywall                                   |
| `$paywall_dismissed`        | Paywall fecha (com `action`: `close` / `purchase` / `restore`)       |
| `$paywall_purchased`        | Compra validada via paywall                                          |
| `$purchase_completed`       | Qualquer compra validada (standalone ou via paywall)                 |
| `$trial_started`            | Trial iniciado                                                       |
| `$subscription_started`     | Assinatura ativa começou                                             |
| `$subscription_renewed`     | Renovação automática (listener nativo `Transaction.updates`)         |
| `$onboarding_step`          | `useOnboarding().step(...)`                                          |
| `$onboarding_completed`     | `useOnboarding().complete()`                                         |
| `$onboarding_dropped`       | `useOnboarding().drop(...)`                                          |

---

## 6. Debugging do funil

### Ver eventos em tempo real

`debug: __DEV__` no Provider faz o SDK logar cada evento enviado:

```
[Paywallo] track onboarding.step { step_name: "goal_selection" }
[Paywallo] track custom.recipe_saved { recipe_id: "rec_123" }
[Paywallo] flush batch (5 events) → 200 OK
```

### Forçar flush imediato

Útil em testes E2E:

```tsx
import { PaywalloClient } from "@virex-tech/paywallo-sdk";

await PaywalloClient.track("e2e_marker", { properties: { run: runId } });
// SDK normalmente bufferiza — em E2E você quer flush imediato:
await PaywalloClient.endSession(); // força flush + finaliza sessão
await PaywalloClient.startSession(); // recomeça
```

### Verificar fila offline

```tsx
const queueSize = PaywalloClient.getOfflineQueueSize();
// Se > 0, há eventos pendentes (user esteve offline)
```

---

## 7. Checklist de instrumentação

- [ ] Cada tela do onboarding chama `step(stepName)` no mount via hook
- [ ] `complete()` é chamado **uma vez** ao fim do onboarding (antes do paywall)
- [ ] Nomes de step são `snake_case`, semânticos, estáveis
- [ ] `identify` é chamado após login com email + atributos de segmentação
- [ ] Eventos críticos (financeiros / de checkout custom) usam `priority: "critical"`
- [ ] Nenhum `track("$paywall_*")` ou `track("$onboarding_*")` manual no codebase
- [ ] Em dev, console mostra `[Paywallo] track ...` para cada step

---

## 8. Anti-patterns

| ❌ Não faça                                                                 | ✅ Faça                                                   |
| :-------------------------------------------------------------------------- | :-------------------------------------------------------- |
| `track("$onboarding_step", { stepIndex: 3, stepName: "..." })`              | `useOnboarding().step("goal_selection")`                  |
| Wrapper `paywalloService.trackOnboardingStep(...)` (não existe)             | Hook `useOnboarding` direto                               |
| Tracking de step em `useEffect` no **componente** (proibido pelo CLAUDE.md) | Em hook customizado da feature                            |
| Renomear `stepName` mid-funcionamento                                       | Decidir nome **antes** de subir para produção             |
| `track("login_success")` após `identify`                                    | `identify` já é o evento — não duplique                   |
| `properties` com objetos aninhados                                          | Achatar (ex: `goal_type` em vez de `goal: { type: ... }`) |

---

## 9. Próximos passos

- A/B test de variantes do onboarding ou paywall: [`paywall-ab-testing.md`](./paywall-ab-testing.md)
- Visão consolidada: [`paywallo-full-skill.md`](./paywallo-full-skill.md)
