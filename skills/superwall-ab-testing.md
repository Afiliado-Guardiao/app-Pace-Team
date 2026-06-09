# Skill: Superwall — A/B Testing (Campanhas & Holdouts)

> **SDK alvo:** `expo-superwall` v1.x · **App:** `base-app`
> Pré-requisito: [`superwall-paywall-skill.md`](./superwall-paywall-skill.md).

No Superwall, **A/B testing acontece no dashboard, não em código**. Esta skill explica o modelo e como o app coopera.

---

## 1. Modelo: placement → campanha → audiência → variantes

1. **Placement** — o evento que o app dispara (`registerPlacement({ placement: "premium_feature_gate" })`).
2. **Campanha** — no dashboard, agrupa um ou mais placements.
3. **Regras de audiência** — filtros que decidem quem entra (baseados em atributos do usuário e `params` do placement).
4. **Variantes** — cada regra distribui usuários entre paywalls (A/B) e/ou um **holdout** (% que não vê paywall).

O app **não sabe** qual variante o usuário recebeu para tomar decisão de UI — ele só reage ao resultado (`feature()` rodou ou não). A análise de conversão fica no dashboard.

---

## 2. O papel do app: atributos e params

Para as regras de audiência funcionarem, o app fornece sinais:

**Atributos de usuário** (persistentes, via `useUser().update`):

```tsx
const { update } = useUser();
await update((old) => ({
	...old,
	plan: "free",
	signupAt: user.createdAt,
	referralCode: user.referralCode,
}));
```

No template isso já é feito por `useSuperwallAuthSync` no login.

**Params do placement** (contexto pontual, por disparo):

```tsx
await registerPlacement({
	placement: "premium_feature_gate",
	params: { source: "home", featureId: "export_pdf" },
	feature: () => {
		/* ... */
	},
});
```

Tanto atributos quanto `params` ficam disponíveis nas regras de audiência da campanha.

---

## 3. Holdout — o "grupo de controle"

Uma campanha pode reservar uma % de usuários como **holdout**: eles disparam o placement mas **não veem paywall**. No app, isso chega como `onSkip` com `reason.type === "Holdout"`:

```tsx
onSkip: (reason) => {
	if (reason.type === "Holdout") {
		// usuário no controle — liberar acesso
	}
},
```

> Por isso `useSubscriptionGate` resolve `true` em `onSkip`: holdout e skip significam **liberar a feature**. Tratar skip como bloqueio quebraria o experimento.

---

## 4. Anti-flicker / A/B de UI fora do paywall

A experimentação do Superwall é orientada a paywall/placement, resolvida no momento do disparo — não serve para variar UI **fora** de um paywall (ex.: dois layouts de welcome na primeira renderização).

Para esse caso, o template usa o **`useSessionFlag` do Paywallo** (A/B síncrono anti-flicker) — ver [`paywallo-funnel-tracking.md`](./paywallo-funnel-tracking.md). Divisão clara:

- A/B de **paywall** (qual paywall, holdout, preço) → campanha do **Superwall**.
- A/B de **UI não-paywall** (telas, copy, fluxo) → `useSessionFlag` do **Paywallo**.

---

## 5. Checklist

- [ ] Campanha criada no dashboard ligando o placement
- [ ] Regras de audiência usam atributos enviados via `update()` e/ou `params`
- [ ] `useSuperwallAuthSync` envia atributos de segmentação no login
- [ ] Holdout tratado como acesso liberado (`onSkip` → `true`)
- [ ] A/B de UI fora de paywall → `useSessionFlag` do Paywallo (não Superwall)

---

## 6. O que **não fazer**

| ❌ Anti-pattern                                          | ✅ Faça em vez disso                              |
| :------------------------------------------------------- | :------------------------------------------------ |
| Implementar branch de A/B de paywall em código           | Configure variantes na campanha do dashboard      |
| Tratar `Holdout` como "sem acesso"                       | Holdout libera a feature                          |
| Usar Superwall para A/B de telas não-paywall             | Use `useSessionFlag` do Paywallo                  |
| Ler "qual variante" no app para mudar UI                 | Deixe a análise de conversão no dashboard         |
