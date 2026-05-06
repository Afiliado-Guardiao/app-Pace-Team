# Skill: Paywallo SDK — Apresentação de Paywalls & Gate de Conteúdo

> **Pré-requisito:** [`paywallo-sdk-setup.md`](./paywallo-sdk-setup.md) já aplicado — `<PaywalloProvider>` montado, `identify` plugado.

Esta skill cobre os três padrões para mostrar um paywall e bloquear conteúdo premium no `base-app`. **Em todos eles, o SDK renderiza a UI do paywall sozinho** (modal/web view montado pelo `PaywalloProvider`) — o app só dispara a chamada.

> ⚠️ **Não rastreie eventos `$paywall_viewed`, `$paywall_purchased` manualmente.** O SDK 2.x emite esses eventos automaticamente quando `presentCampaign` / `presentPaywall` é chamado e quando o IAP se conclui. Tracking manual gera duplicação no funil do dashboard.

---

## 1. Os três padrões

| Padrão                                   | Quando usar                                                                 | Retorno                                  |
| :--------------------------------------- | :-------------------------------------------------------------------------- | :--------------------------------------- |
| `requireSubscriptionWithCampaign(p, c?)` | Gate idiomático: "se não tem sub, mostra paywall e me devolve se conseguiu" | `Promise<boolean>` (purchased\|restored) |
| `presentCampaign(p, c?)`                 | Apresentação direta — você quer o `CampaignResult` completo                 | `Promise<CampaignResult>`                |
| `gateContentWithCampaign(fn, p, c?)`     | Executar uma função apenas se o usuário tem (ou conquista) sub              | `Promise<T \| null>`                     |

`p` = placement (string definida no dashboard), `c` = context opcional (objeto enviado ao server para regras dinâmicas).

---

## 2. Padrão A — `requireSubscriptionWithCampaign` (recomendado)

Use quando você só precisa saber **"o usuário tem acesso ou não?"** após apresentar o paywall (se necessário).

```tsx
// src/features/home/hooks/useUnlockPremium.ts
import { useCallback } from "react";

import { PaywalloClient } from "@virex-tech/paywallo-sdk";

interface IUseUnlockPremiumReturn {
  unlockPremium: () => Promise<boolean>;
}

export const useUnlockPremium = (): IUseUnlockPremiumReturn => {
  const unlockPremium = useCallback(async (): Promise<boolean> => {
    return await PaywalloClient.requireSubscriptionWithCampaign("home_unlock");
  }, []);

  return { unlockPremium };
};
```

Uso na screen:

```tsx
const { unlockPremium } = useUnlockPremium();

const handlePremiumFeature = async (): Promise<void> => {
  const granted = await unlockPremium();
  if (!granted) return; // user fechou paywall ou compra falhou

  // user tem sub agora — segue o fluxo
  navigateToPremiumScreen();
};
```

**Comportamento interno:**

1. Verifica `hasActiveSubscription()` — se `true`, retorna `true` sem mostrar paywall.
2. Se `false`, apresenta o campaign do placement `"home_unlock"`.
3. Aguarda o usuário interagir (compra, restore, fechar).
4. Retorna `purchased || restored`.

---

## 3. Padrão B — `presentCampaign` (controle total)

Use quando precisa diferenciar `cancelled` de `purchased` de `restored`, ou tratar erros específicos.

```tsx
import { PaywalloClient } from "@virex-tech/paywallo-sdk";
import type { CampaignResult } from "@virex-tech/paywallo-sdk";

const presentOnboardingPaywall = async (): Promise<void> => {
  const result: CampaignResult = await PaywalloClient.presentCampaign(
    "onboarding_end",
    { source: "first_session" }, // context — chega no server p/ regras
  );

  if (result.skippedReason === "subscriber") {
    // user já era assinante — SDK pulou apresentação
    return;
  }

  if (result.purchased) {
    navigate("home");
    return;
  }

  if (result.restored) {
    navigate("home");
    return;
  }

  if (result.cancelled) {
    // user fechou — você decide: tela de "no thanks", outro paywall, etc.
    return;
  }

  if (result.error) {
    // erro de rede / store / validação. SDK também já chamou `onError`
  }
};
```

### Shape do `PaywallResult` / `CampaignResult`

```ts
interface PaywallResult {
  presented: boolean; // false se foi pulado (subscriber) ou erro pré-apresentação
  purchased: boolean; // compra confirmada e validada
  cancelled: boolean; // user fechou sem comprar
  restored: boolean; // user clicou em restaurar e recuperou acesso
  productId?: string; // SKU comprado
  transactionId?: string;
  skippedReason?: "subscriber"; // user já tem sub ativa
  error?: Error;
}

// CampaignResult é PaywallResult + identificadores da campanha:
interface CampaignResult extends PaywallResult {
  campaignId?: string;
  variantKey?: string; // qual variante A/B foi exibida
  variantId?: string;
}
```

### `forceShow` — apresentar mesmo se user já é assinante

Por default, `presentCampaign` / `presentPaywall` pula o paywall quando detecta sub ativa e retorna `skippedReason: "subscriber"`. Para forçar a exibição (telas tipo "manage subscription", "view plans"), passe `forceShow: true`:

```tsx
const result = await PaywalloClient.presentCampaign("plans", {
  forceShow: true,
});
```

### Callbacks inline (alternativa ao `await`)

`presentPaywall` e `presentCampaign` aceitam callbacks no segundo parâmetro — útil quando você quer reagir em pontos específicos sem montar lógica em cima do retorno:

```tsx
await PaywalloClient.presentPaywall("onboarding_end", {
  onDismiss: () => console.log("user fechou"),
  onPurchase: (productId) => analytics.track("purchase", { productId }),
  onError: (err) => reportError(err),
});
```

> Os callbacks **não substituem** o retorno da Promise — você ainda recebe o `PaywallResult`. Use os callbacks para hooks de instrumentação; use o `await` para lógica de fluxo.

---

## 4. Padrão C — `gateContentWithCampaign`

Wrapper para "execute essa função, mas só se o user tem (ou conquistar) sub":

```tsx
import { PaywalloClient } from "@virex-tech/paywallo-sdk";

const exportPremiumReport = async (): Promise<string | null> => {
  return await PaywalloClient.gateContentWithCampaign(async () => {
    const data = await fetchPremiumData();
    return generateReportPdf(data);
  }, "feature_export");
};
```

Retorna `null` se o user não tem sub e não conquistou no paywall apresentado. Caso contrário, o resultado da função.

---

## 5. Verificando status de assinatura sem apresentar paywall

### Imperativo (one-shot)

```tsx
import { PaywalloClient } from "@virex-tech/paywallo-sdk";

const isPremium = await PaywalloClient.hasActiveSubscription();
const subscription = await PaywalloClient.getSubscription();
//        ^^ { productId, status, expiresAt, autoRenewEnabled, ... } | null
```

### Reativo (hook — recomendado em screens)

Use o hook nativo `useSubscription()` em vez de chamar `hasActiveSubscription()` em `useEffect`. Ele já faz cache, refresh, listeners de transações:

```tsx
import { useSubscription } from "@virex-tech/paywallo-sdk";

export const useHomeSubscriptionGate = () => {
  const { subscription, isActive, isLoading, entitlements, refresh } =
    useSubscription();

  return {
    isPremium: isActive,
    plan: subscription?.productId ?? null,
    entitlements,
    isLoading,
    refresh,
  };
};
```

> Internamente o hook ouve `Transaction.updates` (StoreKit 2) / `PurchasesUpdatedListener` (Google Play) e atualiza sozinho quando uma compra/renovação/refund acontece. Não precisa fazer polling.

### Tabela de status de subscription

`isActive` é `true` quando `status` é um dos três primeiros — os outros derrubam o acesso:

| Status             | `isActive` | Significado                                            |
| :----------------- | :--------: | :----------------------------------------------------- |
| `active`           |     ✅     | Assinatura em dia                                      |
| `in_grace_period`  |     ✅     | Pagamento com problema, acesso mantido temporariamente |
| `in_billing_retry` |     ✅     | Loja tentando cobrar de novo, acesso mantido           |
| `expired`          |     ❌     | Assinatura vencida sem renovação                       |
| `revoked`          |     ❌     | Acesso revogado (reembolso, fraude)                    |
| `cancelled`        |     ❌     | Cancelada pelo usuário, acesso encerrado               |
| `paused`           |     ❌     | Pausada pelo usuário                                   |

---

## 6. Compra direta (sem paywall) — `usePurchase`

Para casos onde você quer disparar a compra sem apresentar paywall (botão de upgrade direto, bundle promocional fixo), use `usePurchase()`:

```tsx
import { usePurchase } from "@virex-tech/paywallo-sdk";

interface IUseUpgradeButtonReturn {
  handleBuy: (productId: string) => Promise<void>;
  isPurchasing: boolean;
}

export const useUpgradeButton = (): IUseUpgradeButtonReturn => {
  const { purchase, isPurchasing } = usePurchase();

  const handleBuy = useCallback(
    async (productId: string): Promise<void> => {
      const outcome = await purchase(productId);
      if (outcome.status === "success") return;
      if (outcome.status === "cancelled") return;
      if (outcome.status === "pending") {
        // aguardando aprovação parental ou pagamento pendente
        return;
      }
      if (outcome.status === "error") {
        if (outcome.error?.userCancelled) return;
        if (outcome.error?.code === "STORE_NOT_AVAILABLE") {
          showToast(t("paywall.store_unavailable"));
          return;
        }
        showToast(t("paywall.purchase_error"));
      }
    },
    [purchase],
  );

  return { handleBuy, isPurchasing };
};
```

### Shape do `PurchaseOutcome`

```ts
interface PurchaseOutcome {
  status: "success" | "cancelled" | "pending" | "error";
  productId: string;
  transactionId?: string;
  purchase?: {
    transactionId: string;
    productId: string;
    transactionDate: string;
  };
  error?: PurchaseError;
}
```

### Códigos de erro relevantes

| `error.code`          | Significado                                                             |
| :-------------------- | :---------------------------------------------------------------------- |
| `USER_CANCELLED`      | User cancelou. Cheque `error.userCancelled === true` — não é falha real |
| `STORE_NOT_AVAILABLE` | Device não suporta IAP (simulador sem conta, device restrito)           |
| `PENDING_PURCHASE`    | Compra com aprovação pendente (parental, pagamento aguardando)          |
| `VALIDATION_FAILED`   | Servidor rejeitou o receipt                                             |
| `NETWORK_ERROR`       | Timeout ou sem rede ao validar                                          |
| `PRODUCT_NOT_FOUND`   | `productId` não existe na loja ou não foi configurado                   |

> **Family sharing & compras pendentes**: Compras com aprovação parental ou pagamento aguardando retornam `status: "pending"` sem finalizar. Quando aprovado, o receipt aparece na próxima chamada de `restore()` ou via `useSubscription()` que atualiza sozinho. Compras compartilhadas via family sharing aparecem como `isActive: true` automaticamente.

---

## 7. Restore purchases

Disponível como botão obrigatório nas lojas (Apple Guideline 3.1.1). Adicione na sua tela de paywall local ou em Settings:

```tsx
import { PaywalloClient } from "@virex-tech/paywallo-sdk";

const handleRestore = async (): Promise<void> => {
  const result = await PaywalloClient.restorePurchases();

  if (result.success) {
    showToast(t("paywall.restore_success"));
    return;
  }

  showToast(t("paywall.restore_no_purchases"));
};
```

> O paywall remoto do Paywallo já tem botão de restore embutido se você habilitar no editor. Só implemente manualmente se for usar UI 100% custom.

---

## 8. Padrão híbrido: Remote + Local fallback

Cenário: você quer o paywall remoto editável no dashboard, mas precisa de uma UI local de fallback caso o user esteja offline ou o `presentCampaign` falhe.

```tsx
const handleShowPaywall = async (): Promise<void> => {
  const result = await PaywalloClient.presentCampaign("main_offer");

  if (result.presented || result.purchased || result.restored) return;

  // SDK não conseguiu apresentar (offline, campaign não configurada, erro de render)
  setShowLocalPaywall(true);
};
```

**Quando vale a pena:**

- ✅ App tem público em regiões com conectividade ruim
- ✅ Você quer garantir que o paywall **sempre** seja exibido

**Quando não vale:**

- ❌ Apps com público estável online — o `EmergencyPaywall` do SDK já cobre o caso de o campaign falhar (configurado no dashboard)

---

## 9. Decidindo placement vs context

| Conceito      | O que é                                                      | Exemplo                                       |
| :------------ | :----------------------------------------------------------- | :-------------------------------------------- |
| **Placement** | String fixa que identifica **onde** no app o paywall aparece | `"onboarding_end"`, `"home_unlock"`           |
| **Context**   | Objeto com dados dinâmicos enviados ao server para regras    | `{ source: "push", campaign: "blackfriday" }` |
| **Variant**   | Resolvido pelo server com base em A/B test do dashboard      | `"control"`, `"discounted"`                   |

**Regra:** crie um placement por **superfície de UI distinta**. O dashboard cuida das variantes. Não invente placements para variar preços — isso é trabalho do A/B test.

---

## 10. Checklist por feature

Para cada local que apresenta paywall:

- [ ] Placement criado no dashboard com nome estável (`feature_x_unlock`)
- [ ] Hook próprio (`useFeatureXGate` em `features/featureX/hooks/`)
- [ ] Tratamento de `result.purchased`, `result.cancelled`, `result.error`
- [ ] Sem tracking manual de `$paywall_*` (SDK rastreia automaticamente)
- [ ] `accessibilityLabel` no botão de "Restore" se for UI custom
- [ ] Testado em Sandbox iOS + Google Play License Tester antes do release

---

## 11. Anti-patterns

| ❌ Não faça                                                 | ✅ Faça                                               |
| :---------------------------------------------------------- | :---------------------------------------------------- |
| `track("$paywall_viewed", ...)` antes de `presentCampaign`  | Nada — SDK emite automaticamente                      |
| `presentCampaign` em `useEffect` direto na render           | Em handler de evento (`onPress`, `onComplete`)        |
| Sincronizar variant com RevenueCat / outro provider         | Inaplicável — o SDK Paywallo é o provider de IAP      |
| Implementar restore com `react-native-iap`                  | `PaywalloClient.restorePurchases()`                   |
| `if (presentCampaign(...) === true)` — tratar como booleano | `const result = await ...; if (result.purchased) ...` |
| Múltiplos placements para variar preço                      | 1 placement, A/B test no dashboard                    |

---

## 12. Próximos passos

- Tracking de funil antes do paywall: [`paywallo-funnel-tracking.md`](./paywallo-funnel-tracking.md)
- A/B test de variantes do paywall: [`paywall-ab-testing.md`](./paywall-ab-testing.md)
- Visão geral consolidada: [`paywallo-full-skill.md`](./paywallo-full-skill.md)
