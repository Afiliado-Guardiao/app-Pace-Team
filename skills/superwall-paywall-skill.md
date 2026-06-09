# Skill: Superwall — Paywalls & Feature Gating

> **SDK alvo:** `expo-superwall` v1.x · **App:** `base-app`
> Pré-requisito: [`superwall-sdk-setup.md`](./superwall-sdk-setup.md) concluído.

Como apresentar paywalls e gatear features premium no `base-app` usando **placements** do Superwall.

---

## 1. Modelo mental: placements, não "telas de paywall"

No Superwall você **não** renderiza um paywall em código. Você registra um **placement** (um nome de evento, ex.: `premium_feature_gate`) e o **dashboard** decide:

- qual paywall mostrar (ou nenhum),
- para quais usuários (regras de audiência),
- em qual variante (A/B / holdout).

O app só dispara `registerPlacement({ placement, feature })`. O callback `feature()` roda **quando o usuário tem acesso** — já assinante, holdout/skip, ou após compra/restauração bem-sucedida. Se o usuário recusa o paywall, `feature()` não roda.

---

## 2. `usePlacement` — o hook base

```tsx
import { usePlacement } from "expo-superwall";

const { registerPlacement, state } = usePlacement({
	onPresent: (info) => {
		/* paywall apareceu — info.name, info.experiment?.id */
	},
	onDismiss: (info, result) => {
		// result.type: "purchased" | "restored" | "declined"
	},
	onSkip: (reason) => {
		// reason.type: "Holdout" | "NoRuleMatch" | "PlacementNotFound" | ...
		// paywall NÃO foi mostrado → trate como "tem acesso"
	},
	onError: (error) => {
		/* string de erro */
	},
});

await registerPlacement({
	placement: "premium_feature_gate",
	params: { source: "home" }, // params opcionais p/ regras de audiência
	feature: () => {
		// liberado: rode a feature premium aqui
	},
});
```

`state.status` é reativo: `idle → presented → dismissed | skipped | error`.

---

## 3. `useSubscriptionGate` — o wrapper do template

O `base-app` encapsula o padrão acima num hook com API simples em `src/lib/superwall/hooks/useSubscriptionGate.ts`:

```tsx
import { useSubscriptionGate } from "@/lib/superwall";

const { unlock, isUnlocking } = useSubscriptionGate("premium_feature_gate");

const handlePremiumAction = async (): Promise<void> => {
	const granted = await unlock();
	if (granted) {
		// usuário tem acesso (assinante, holdout, ou comprou agora)
	}
	// se false: recusou o paywall ou ocorreu erro
};
```

- `unlock()` registra o placement e resolve `Promise<boolean>`:
  - `true` → `feature()` rodou (acesso), `onSkip` (holdout/skip), ou `onDismiss` com `purchased`/`restored`.
  - `false` → `onDismiss` com `declined`, ou `onError`.
- `isUnlocking` reflete o estado de processamento — use para desabilitar o botão.

> Em hooks/componentes do template, prefira `useSubscriptionGate`. Caia para `usePlacement` direto só quando precisar de granularidade de lifecycle (ex.: telemetria fina no `onPresent`).

---

## 4. Lendo o status de assinatura

Para gatear UI **sem** disparar paywall (ex.: esconder um badge), leia o status:

```tsx
import { useUser } from "expo-superwall";

const { subscriptionStatus } = useUser();
const isPro = subscriptionStatus?.status === "ACTIVE";
```

Valores: `"ACTIVE" | "INACTIVE" | "UNKNOWN"`. Em `ACTIVE`, `subscriptionStatus.entitlements` lista as entitlements (ex.: `{ id: "pro", type: "SERVICE_LEVEL" }`).

> Regra: **gate de ação** (clicar em algo premium) → `useSubscriptionGate().unlock()`. **Gate de exibição** (renderizar condicional) → `subscriptionStatus`.

---

## 5. Compras, restauração e entitlements

O Superwall processa a compra **dentro do paywall** (StoreKit / Play Billing nativos). Você não chama `purchase()` manualmente no fluxo padrão. O resultado chega via:

- `onDismiss(info, result)` com `result.type === "purchased"` / `"restored"`,
- e o `feature()` callback dispara em seguida (acesso liberado).

Para sincronizar uma assinatura validada no seu backend de volta ao SDK (ex.: usuário já é Pro pelo servidor), use:

```tsx
const { setSubscriptionStatus } = useUser();
await setSubscriptionStatus({
	status: "ACTIVE",
	entitlements: [{ id: "pro", type: "SERVICE_LEVEL" }],
});
```

---

## 6. Checklist

- [ ] Placement criado no dashboard do Superwall e ligado a uma campanha
- [ ] Gate de ação via `useSubscriptionGate(placement).unlock()`
- [ ] Gate de exibição via `useUser().subscriptionStatus`
- [ ] Botões premium desabilitados enquanto `isUnlocking`
- [ ] `feature()` contém a lógica liberada (não duplique fora dele)

---

## 7. O que **não fazer**

| ❌ Anti-pattern                                         | ✅ Faça em vez disso                            |
| :------------------------------------------------------ | :---------------------------------------------- |
| Renderizar um componente de paywall em código           | Registre um placement; o dashboard mostra       |
| Chamar `purchase()` manual no fluxo padrão              | A compra acontece dentro do paywall             |
| Rodar a feature antes de checar `unlock()`              | Coloque a lógica no `feature()` / após `true`   |
| Tratar `onSkip` como "sem acesso"                       | Skip/holdout = **tem** acesso                   |

Veja também: [`superwall-ab-testing.md`](./superwall-ab-testing.md) e [`superwall-events-tracking.md`](./superwall-events-tracking.md).
