# Skill: Superwall — Eventos & Tracking

> **SDK alvo:** `expo-superwall` v1.x · **App:** `base-app`
> Pré-requisito: [`superwall-sdk-setup.md`](./superwall-sdk-setup.md).

Como observar eventos do Superwall e como o tracking se divide no modelo híbrido do `base-app`.

> ⚠️ **O Superwall emite eventos de paywall e transação, não de funil de onboarding.** No modelo híbrido do template, o **funil de onboarding é do Paywallo** (`useOnboarding` via `useOnboardingTracking`) — ver [`paywallo-funnel-tracking.md`](./paywallo-funnel-tracking.md). Use `useSuperwallEvents` quando quiser **espelhar** eventos de paywall/transação num destino extra (PostHog/Firebase). Ver seção 4.

---

## 1. `useSuperwallEvents` — escutando o SDK

```tsx
import { useSuperwallEvents } from "expo-superwall";

export const useSuperwallTelemetry = (): void => {
	useSuperwallEvents({
		onSuperwallEvent: (eventInfo) => {
			const name = eventInfo.event.event;
			switch (name) {
				case "transactionComplete":
					// eventInfo.event.transaction / .product
					break;
				case "subscriptionStart":
				case "freeTrialStart":
					break;
				case "paywallOpen":
				case "paywallClose":
					break;
				case "transactionFail":
					break;
			}
		},
		onSubscriptionStatusChange: (status) => {
			// status.status: "ACTIVE" | "INACTIVE" | "UNKNOWN"
		},
		onLog: (params) => {
			if (params.level === "error" && __DEV__) {
				// log de diagnóstico do SDK em dev
			}
		},
	});
};
```

Monte esse hook **uma vez**, num ponto global do app (ex.: um hook de setup chamado no root). Callbacks são limpos no unmount automaticamente.

---

## 2. Eventos úteis

| Evento                | Quando dispara                                  |
| :-------------------- | :---------------------------------------------- |
| `paywallOpen`         | Paywall apresentado                             |
| `paywallClose`        | Paywall fechado                                 |
| `transactionStart`    | Usuário iniciou a compra                        |
| `transactionComplete` | Compra concluída (tem `transaction` + `product`)|
| `transactionFail`     | Falha na compra                                 |
| `transactionAbandon`  | Usuário abandonou o fluxo de compra             |
| `subscriptionStart`   | Assinatura iniciada                             |
| `freeTrialStart`      | Trial iniciado                                  |

> O Superwall envia esses eventos automaticamente para o próprio dashboard e para integrações configuradas lá (ver `superwall-integrations.md`). Você só precisa escutar via `useSuperwallEvents` se quiser espelhar em **outro** destino (ex.: AppsFlyer/Firebase/PostHog do seu app).

---

## 3. Distinguir trial de compra

No `transactionComplete`, o `product` indica trial:

```tsx
const isTrial = product.hasFreeTrial || !!product.trialPeriodPrice;
// isTrial → logue "start_trial"; senão → "purchase"
```

Para deduplicar com `freeTrialStart`, use o mesmo `transactionId` (`transaction.storeTransactionId` ou `originalTransactionIdentifier`) como chave.

---

## 4. Funil de onboarding (é do Paywallo)

O funil de onboarding **não** passa pelo Superwall. `useOnboardingTracking` (`src/features/onboarding/hooks/`) usa o `useOnboarding()` do **Paywallo**, que emite os eventos de funil automaticamente. Detalhes em [`paywallo-funnel-tracking.md`](./paywallo-funnel-tracking.md).

Se quiser **espelhar** eventos de transação do Superwall num analytics próprio (PostHog/Firebase), faça no `onSuperwallEvent` acima — sem duplicar o que o Paywallo já registra.

---

## 5. Checklist

- [ ] `useSuperwallEvents` montado uma vez no root (se for espelhar eventos)
- [ ] `transactionComplete` distingue trial × purchase
- [ ] Dedup de trial/purchase por `transactionId`
- [ ] Funil de onboarding via Paywallo (não duplicar no Superwall)
- [ ] `onLog` filtra ruído por `__DEV__`

Veja também: [`superwall-integrations.md`](./superwall-integrations.md).
