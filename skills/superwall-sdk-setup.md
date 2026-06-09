# Skill: Superwall — Setup & Core Integration

> **SDK alvo:** `expo-superwall` v1.x
> **App alvo:** `base-app` (React Native + Expo SDK 54)
> **Stack pressuposta:** Expo Router, Zustand, React Query, i18next, theme tokens
> **Doc oficial:** [`https://superwall.com/docs`](https://superwall.com/docs) · [`github.com/superwall/expo-superwall`](https://github.com/superwall/expo-superwall)

Setup mínimo **funcional** do Superwall no `base-app`: instalação, API keys, montagem do `SuperwallProvider`, identificação de usuário em login/logout e o bridge reativo via store Zustand.

> ⚠️ **Não chame `Superwall.shared` direto fora de `src/lib/superwall/`.** Use os hooks do `expo-superwall` (`useUser`, `usePlacement`, `useSuperwall`). O bridge do template já centraliza a sincronização de identidade.

---

## 1. Requisitos

| Plataforma   | Versão mínima                                    |
| :----------- | :----------------------------------------------- |
| React Native | 0.7x+ (Expo SDK 54)                              |
| iOS          | 14.0+                                            |
| Android      | API 26 (Android 8.0+)                            |
| Node         | 18+                                              |
| Expo         | **development build** (não roda no Expo Go)      |

O Superwall tem módulos nativos (StoreKit 2 no iOS, Google Play Billing no Android). **Não é necessário** RevenueCat nem `react-native-iap` em paralelo.

---

## 2. Instalação

```bash
cd base-app
npm install expo-superwall
```

**Expo (prebuild + dev build):**

```bash
npx expo prebuild        # gera /ios e /android (autolink do módulo nativo)
cd ios && pod install && cd ..
npm run ios              # ou: npm run android
```

> Não há config plugin obrigatório no `app.json` — o `expo-superwall` é autolinkado. Mas **exige development build**: o Expo Go não carrega o módulo nativo.

---

## 3. Variáveis de ambiente

Uma **API key pública por plataforma** (formato `pk_...`), obtida no dashboard do Superwall → **Settings → Keys**.

`base-app/.env.example` e `base-app/.env`:

```env
EXPO_PUBLIC_SUPERWALL_IOS_API_KEY=pk_xxxxxxxx
EXPO_PUBLIC_SUPERWALL_ANDROID_API_KEY=pk_yyyyyyyy
```

> Variáveis `EXPO_PUBLIC_` ficam embutidas no bundle — keys públicas do Superwall podem ir aqui com segurança. Sem elas o SDK inicializa, mas não apresenta paywalls.

Declare os tipos em `src/types/global.d.ts` (`ProcessEnv`).

---

## 4. Plugando o `SuperwallProvider`

O Provider inicializa o SDK ao montar e recebe as `apiKeys`. Plugue em `src/components/core/AppProviders/index.tsx`, **acima** dos providers que dependem de identidade do usuário:

```tsx
// src/components/core/AppProviders/index.tsx
import React from "react";

import { SuperwallProvider } from "expo-superwall";
import { initialWindowMetrics, SafeAreaProvider } from "react-native-safe-area-context";

import { ErrorBoundary } from "@/components/core/ErrorBoundary";
import { ModalProvider } from "@/components/ui/Modal";
import { ThemeProvider } from "@/theme";
import { QueryProvider } from "@/lib/react-query";
import { SuperwallAuthBridge } from "@/lib/superwall";

interface IAppProvidersProps {
	children: React.ReactNode;
}

const SUPERWALL_API_KEYS = {
	ios: process.env.EXPO_PUBLIC_SUPERWALL_IOS_API_KEY ?? "",
	android: process.env.EXPO_PUBLIC_SUPERWALL_ANDROID_API_KEY ?? "",
};

export const AppProviders: React.FC<IAppProvidersProps> = ({ children }) => {
	return (
		<ErrorBoundary>
			<SuperwallProvider apiKeys={SUPERWALL_API_KEYS}>
				<SuperwallAuthBridge>
					<ThemeProvider>
						<QueryProvider>
							<SafeAreaProvider initialMetrics={initialWindowMetrics}>
								<ModalProvider>{children}</ModalProvider>
							</SafeAreaProvider>
						</QueryProvider>
					</ThemeProvider>
				</SuperwallAuthBridge>
			</SuperwallProvider>
		</ErrorBoundary>
	);
};
```

> Opcional: `SuperwallProvider` aceita os componentes `<SuperwallLoading>` / `<SuperwallLoaded>` como children para gatear a UI até o SDK ficar pronto. No template usamos a montagem direta — a inicialização é rápida e os hooks expõem estados próprios.

---

## 5. Identidade — `useUser` e o bridge

O bridge `SuperwallAuthBridge` chama `useSuperwallAuthSync`, que reage ao `user` do store Zustand:

```tsx
// src/lib/superwall/hooks/useSuperwallAuthSync.ts (resumo)
const { identify, update, signOut } = useUser();

// login:  identify(userId) + update(attributes de segmentação)
// logout: signOut()
```

**Regras:**

- `identify(userId)` associa o usuário anônimo (criado no primeiro boot) ao seu `userId`. Chame **uma vez** ao logar.
- `update((old) => ({ ...old, plan, signupAt }))` define **atributos de segmentação** usados nas regras de audiência das campanhas (ver `superwall-ab-testing.md`). Use valores estáveis; valores devem ser `string | number | boolean`.
- `signOut()` no logout limpa a identidade e volta ao estado anônimo.
- **Não** passe PII além do necessário nos atributos.

---

## 6. Verificando que está funcionando

- `useUser().subscriptionStatus?.status` retorna `"ACTIVE" | "INACTIVE" | "UNKNOWN"`.
- `useUser().user?.appUserId` mostra o id identificado.
- No dashboard do Superwall: o usuário aparece após o primeiro `identify`, e os placements disparados aparecem em **Events**.

Em dev, eventos do SDK podem ser observados via `useSuperwallEvents({ onSuperwallEvent, onLog })` (ver `superwall-events-tracking.md`).

---

## 7. Checklist de integração

- [ ] `npm install expo-superwall` + `expo prebuild` + `pod install` (iOS)
- [ ] **Development build** (não Expo Go)
- [ ] `EXPO_PUBLIC_SUPERWALL_IOS_API_KEY` / `_ANDROID_API_KEY` no `.env` (+ `.env.example`)
- [ ] `<SuperwallProvider apiKeys={...}>` em `AppProviders/index.tsx` envolvendo os demais providers
- [ ] `SuperwallAuthBridge` montado para sincronizar identidade
- [ ] `subscriptionStatus` lido via `useUser()` onde precisar gatear conteúdo

---

## 8. O que **não fazer**

| ❌ Anti-pattern                                       | ✅ Faça em vez disso                                  |
| :---------------------------------------------------- | :---------------------------------------------------- |
| Instalar RevenueCat / `react-native-iap` junto        | O Superwall já lida com IAP nativo                    |
| `Superwall.shared.identify(...)` espalhado no app     | Centralize via `useSuperwallAuthSync` / `useUser`     |
| Rodar no Expo Go                                      | Use development build (módulo nativo)                 |
| Hardcode das API keys no código                       | `process.env.EXPO_PUBLIC_SUPERWALL_*`                 |
| `console.log` em produção                             | `useSuperwallEvents({ onLog })` filtrando por `__DEV__` |

> **Modelo híbrido:** o `base-app` usa Superwall **junto com** o Paywallo. O Superwall só apresenta o paywall; identidade/tracking, funil e assinatura ficam no Paywallo. Ver as skills `paywallo-*.md`.

Próximas skills:

- [`superwall-paywall-skill.md`](./superwall-paywall-skill.md) — apresentar paywalls e gate de feature
- [`superwall-events-tracking.md`](./superwall-events-tracking.md) — eventos do SDK e analytics
- [`superwall-ab-testing.md`](./superwall-ab-testing.md) — campanhas, holdouts e regras de audiência
- [`superwall-integrations.md`](./superwall-integrations.md) — atribuição e sync de assinatura
- [`superwall-full-skill.md`](./superwall-full-skill.md) — guia consolidado (master)
- [`paywallo-sdk-setup.md`](./paywallo-sdk-setup.md) · [`paywallo-funnel-tracking.md`](./paywallo-funnel-tracking.md) · [`paywallo-integrations.md`](./paywallo-integrations.md) — a camada Paywallo
