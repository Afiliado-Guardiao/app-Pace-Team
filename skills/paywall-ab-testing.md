# Skill: Paywallo SDK — A/B Testing & Feature Flags

> **Pré-requisito:** [`paywallo-sdk-setup.md`](./paywallo-sdk-setup.md) já aplicado.

Esta skill cobre como usar feature flags e A/B testing do Paywallo no `base-app` **sem flicker**, sem requests redundantes e sem gerenciar state em paralelo. O SDK 2.x oferece três APIs distintas — escolha a certa para cada caso.

---

## 1. As três APIs e quando usar cada uma

| API                                   | Quando                                                                | Latência     | Default       |
| :------------------------------------ | :-------------------------------------------------------------------- | :----------- | :------------ |
| **`sessionFlags` + `getSessionFlag`** | Variantes que decidem renderização inicial (Welcome, paywall variant) | **Síncrono** | `null`        |
| **`getVariantCached(key, default)`**  | Flags consultadas em runtime, com cache local                         | ~ms (cache)  | Você define   |
| **`getVariant(key)`**                 | Flag fresca, sem cache (raro — analytics, experimentos novos)         | Rede         | Server decide |

> **Regra de ouro:** se a flag decide **a primeira renderização** de uma tela, ela tem que estar em `sessionFlags`. Caso contrário, você verá flicker (UI default → UI variante).

---

## 2. Padrão A — `sessionFlags` (anti-flicker)

Liste as flags críticas no config do `<PaywalloProvider>` (declare como variável tipada — `sessionFlags` está em `PaywalloInitConfig`, não no subset `PaywalloConfig` que é o type público do Provider):

```tsx
// src/components/core/AppProviders/index.tsx
import { PaywalloProvider, type PaywalloInitConfig } from "@virex-tech/paywallo-sdk";

const paywalloConfig: PaywalloInitConfig = {
  appKey: PAYWALLO_APP_KEY,
  debug: __DEV__,
  sessionFlags: ["welcome_variant", "paywall_variant", "onboarding_v2"],
};

<PaywalloProvider config={paywalloConfig}>
```

O SDK pré-resolve essas flags **durante o init** (antes do app montar telas reais). A leitura depois é **síncrona** (não retorna Promise):

```tsx
import { PaywalloClient } from "@virex-tech/paywallo-sdk";

const variant = PaywalloClient.getSessionFlag("welcome_variant");
//      ^? string | null   (sem await!)
```

### Hook reutilizável

```tsx
// src/lib/paywallo/hooks/useSessionFlag.ts
import { useMemo } from "react";

import { PaywalloClient } from "@virex-tech/paywallo-sdk";

interface IUseSessionFlagReturn {
  variant: string;
  is: (value: string) => boolean;
}

export const useSessionFlag = (
  key: string,
  defaultValue: string = "control",
): IUseSessionFlagReturn => {
  const variant = useMemo<string>(
    () => PaywalloClient.getSessionFlag(key) ?? defaultValue,
    [key, defaultValue],
  );

  return {
    variant,
    is: (value: string): boolean => variant === value,
  };
};
```

### Uso na feature

```tsx
// src/features/welcome/hooks/useWelcomeVariant.ts
import { useSessionFlag } from "@/lib/paywallo/hooks/useSessionFlag";

interface IUseWelcomeVariantReturn {
  showVideo: boolean;
  ctaLabel: string;
}

export const useWelcomeVariant = (): IUseWelcomeVariantReturn => {
  const { variant, is } = useSessionFlag("welcome_variant", "control");

  return {
    showVideo: is("with_video"),
    ctaLabel: variant === "urgent_cta" ? "Comece agora" : "Continuar",
  };
};
```

**O que NÃO fazer:**

- ❌ Persistir `sessionFlags` em Zustand+AsyncStorage com lógica custom — o SDK já cacheia. Você adicionaria um bug de "valor stale após mudança no dashboard".
- ❌ Chamar `getSessionFlag` em `useEffect` → `setState`. É síncrono, pode ler direto no render.
- ❌ Esquecer o `defaultValue`. `null` é um valor válido se a flag ainda não resolveu (offline no first boot).

---

## 3. Padrão B — `getVariantCached` (flags em runtime)

Para flags consultadas **depois** que o app já está rodando — features condicionais, gates de UI, switches de comportamento que não estão na primeira tela:

```tsx
import { PaywalloClient } from "@virex-tech/paywallo-sdk";

const result = await PaywalloClient.getVariantCached("home_feature_x", "off");
//      ^? FlagVariant { variant: string | null, payload?: Record<string, unknown> }

if (result.variant === "on") {
  // mostra feature
}
```

### Cache em cascata (do mais rápido ao mais lento)

| Camada         | TTL                   | Quando é usado                                        |
| :------------- | :-------------------- | :---------------------------------------------------- |
| Memória        | **5 minutos**         | Mesma sessão, chamadas repetidas                      |
| Storage local  | **7 dias**            | Reabertura do app, sem rede                           |
| `sessionFlags` | enquanto sessão ativa | Pré-resolvido no boot (síncrono via `getSessionFlag`) |
| Servidor       | sempre fresco         | Cache miss / `getVariant` (sem cached)                |

> Se o device estiver totalmente offline e nunca tiver visto a flag, retorna `variant: null`. Sempre passe um `defaultValue`.

### Hook com Suspense-friendly state

```tsx
// src/lib/paywallo/hooks/useVariant.ts
import { useEffect, useState } from "react";

import { PaywalloClient } from "@virex-tech/paywallo-sdk";

interface IUseVariantReturn {
  variant: string;
  isLoading: boolean;
}

export const useVariant = (
  key: string,
  defaultValue: string = "control",
): IUseVariantReturn => {
  const [variant, setVariant] = useState<string>(defaultValue);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    let cancelled = false;

    void PaywalloClient.getVariantCached(key, defaultValue).then((result) => {
      if (cancelled) return;
      setVariant(result.variant ?? defaultValue);
      setIsLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, [key, defaultValue]);

  return { variant, isLoading };
};
```

`getVariantCached` retorna do cache local imediatamente se já resolveu antes; em paralelo revalida do server. **Primeira chamada do app** pode ter latência de rede (~100-300ms), por isso o `isLoading`.

> Para evitar a latência da primeira chamada, **inclua a flag em `sessionFlags`** se ela for crítica para UX.

---

## 4. Padrão C — `getVariant` (sem cache, raro)

Quase nunca é o que você quer. Use **apenas** para:

- Experimentos curtos onde o user pode mudar de variante mid-sessão (raro)
- Dashboards admin que mostram a flag em tempo real

```tsx
const result = await PaywalloClient.getVariant("admin_debug_flag");
//                                ^^ sempre vai ao server
```

Para tudo mais, prefira `getVariantCached` ou `sessionFlags`.

---

## 5. Remote config — payload customizado por variante

Cada variante pode ter um `payload` JSON configurado no dashboard. Útil para mudar valores (preços, textos, números) sem republicar o app:

```tsx
const { variant, payload } = await PaywalloClient.getVariant("pricing_config");
// payload = { trialDays: 7, primaryPrice: 9.99, ctaText: "Começar grátis" }

const trialDays = payload?.trialDays ?? 7;
const ctaText = payload?.ctaText ?? "Assinar";
```

**Casos de uso:**

- Preços / descontos sazonais (ajusta no dashboard, app reflete na próxima fetch)
- Textos de CTA por experimento
- Configs numéricas (TTL, limites, thresholds)
- Conteúdo de telas estáticas (FAQ, terms)

> Sempre cheque o tipo do valor — `payload` é `Record<string, unknown>`, não há validação de schema. Use Zod ou cast com fallback se for crítico.

---

## 6. Conditional flags (regras server-side)

`getConditionalFlag` resolve `true`/`false` baseado em contexto (platform, country, app version) — útil para rollouts graduais:

```tsx
const isEnabled = await PaywalloClient.getConditionalFlag("ai_chat_rollout", {
  platform: Platform.OS,
  appVersion: Constants.expoConfig?.version,
  country: locale.regionCode,
});

if (isEnabled) {
  // mostra feature
}
```

A regra (ex: "habilitar para 10% dos users em iOS BR com app ≥ 2.3.0") é configurada no dashboard. O SDK só envia o contexto.

---

### Persistência da identidade

O bucketing de variante é determinístico por `(distinctId, flagKey)` no servidor. O `distinctId` é persistido localmente em **Keychain** (iOS) e **EncryptedSharedPreferences** (Android), então:

- Reinstalar o app **mantém** a mesma variante (Keychain sobrevive uninstall em iOS, EncryptedSharedPreferences é limpo em Android)
- Logout + login com mesmo email → mesma variante (após `identify`, distinctId é vinculado ao email)
- Trocar de device → **nova variante** (distinctId é por device até identify)

---

## 7. A/B test — significância estatística

No dashboard, cada flag com múltiplas variantes vira um A/B test automático. Métricas de conversão por variante são calculadas em tempo real, e o dashboard aponta o **winner** quando atinge `p < 0.05` com amostra suficiente. No código, A/B test é só uma flag — você consome via `getVariant(key)` igual a qualquer outra.

---

## 8. Tracking que correlaciona variant ↔ outcome

O dashboard do Paywallo correlaciona automaticamente:

- Variantes de `sessionFlags` → todos os eventos da sessão
- Variantes apresentadas em `presentCampaign` → resultado da compra (via `variantKey` no payload)

**Não precisa** passar `variant` manualmente em cada `track`. Mas se você integra com Sentry / PostHog / Meta CAPI, passe lá:

```tsx
const { variant } = useSessionFlag("paywall_variant");

useEffect(() => {
  Sentry?.setTag("paywall_variant", variant);
  posthog?.register({ paywall_variant: variant });
}, [variant]);
```

---

## 9. Naming de flags e variantes

### Flags

`snake_case`, escopo claro, sem sufixo de versão:

```
✅ welcome_variant
✅ paywall_main_variant
✅ home_feature_x
✅ onboarding_flow

❌ welcomeVariant         (camelCase)
❌ welcome_v2             (sufixo de versão — use a variante para isso)
❌ flag1, flag2           (sem semântica)
```

### Variantes

`snake_case`, descritivas. Reserve `control` para o baseline:

```
✅ control, with_video, urgent_cta
✅ price_low, price_mid, price_high

❌ a, b, c                (sem semântica)
❌ test1, test2           (idem)
```

---

## 10. Encerrando experimentos

Quando um A/B test conclui:

1. **Implemente a variante vencedora como default** no código — remova condicionais
2. **Remova a flag de `sessionFlags`** do Provider
3. **Apague o hook** específico do experimento (ex: `useWelcomeVariant`)
4. **Não apague a flag no dashboard** imediatamente — mantenha em modo "completed" para histórico
5. Commit com mensagem explicando: `experiment: roll out 'with_video' as default for welcome_variant`

> Não deixe condicionais zumbi (`if (variant === "control")` quando todos veem `with_video`). Quem ler o código depois vai assumir que ainda é experimento.

---

## 11. Checklist de A/B test

- [ ] Flag declarada no dashboard com variantes nomeadas
- [ ] Se afeta **primeira renderização** de uma tela: incluída em `sessionFlags`
- [ ] Hook próprio em `src/lib/paywallo/hooks/` ou na própria feature
- [ ] Default value definido (`control` ou equivalente)
- [ ] Testado offline (sem rede no primeiro boot) → cai no default sem crashar
- [ ] Variantes adicionais como `tag` no Sentry/PostHog se usar
- [ ] Documentado em comentário ou ADR: o que está sendo testado, hipótese, métrica de sucesso

---

## 12. Anti-patterns

| ❌ Não faça                                                        | ✅ Faça                                                   |
| :----------------------------------------------------------------- | :-------------------------------------------------------- |
| Zustand store custom replicando flags do Paywallo                  | `sessionFlags` no config + `useSessionFlag` síncrono      |
| `await PaywalloClient.getVariant(...)` em primeira tela            | Adicione a key em `sessionFlags`                          |
| Inventar placement por variante de preço                           | 1 placement, A/B test no dashboard via `paywall_variant`  |
| Variantes em `camelCase` ou com espaços                            | `snake_case` consistente                                  |
| Esquecer `defaultValue` — assumir que SDK sempre devolveu valor    | Sempre passe default                                      |
| Manter `if (variant === "control") ...` após experimento concluído | Remover condicional, codar a variante vencedora como base |

---

## 13. Próximos passos

- Visão consolidada de todos os padrões: [`paywallo-full-skill.md`](./paywallo-full-skill.md)
