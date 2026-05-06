# Skill: Implementação Completa Paywallo SDK (Master Guide)

Esta skill descreve o padrão ouro para integrar o Paywallo SDK em projetos React Native/Expo, cobrindo desde o setup inicial até rastreamento avançado de conversão e paywalls híbridos.

## 1. Configuração de Ambiente e SDK

### Instalação
```bash
npm install @virex-tech/paywallo-sdk
```

### Variáveis de Ambiente (.env)
Sempre use o prefixo `EXPO_PUBLIC_` para garantir visibilidade no lado do cliente.
```env
EXPO_PUBLIC_PAYWALLO_APP_KEY="sua_chave_aqui"
```

## 2. Singleton Service Pattern (Core)

Não instancie o cliente em múltiplos lugares. Use o padrão Singleton em `src/app/services/paywalloService.js`.

```javascript
import { PaywalloClient } from "@virex-tech/paywallo-sdk";

const APP_KEY = process.env.EXPO_PUBLIC_PAYWALLO_APP_KEY;

class PaywalloService {
  constructor() {
    this.isInitialized = false;
  }

  async init(userId = null) {
    if (this.isInitialized) return;

    try {
      await PaywalloClient.init({
        appKey: APP_KEY,
        userId: userId,
        debug: __DEV__,
      });
      this.isInitialized = true;
    } catch (error) {
      console.error("[Paywallo] Init failed:", error);
    }
  }

  // Tracking de Eventos Customizados
  async track(eventName, properties = {}) {
    if (!this.isInitialized) return;
    await PaywalloClient.track(eventName, properties);
  }

  // Busca segura de Variantes de Teste A/B
  async getVariant(experimentKey, fallback = "control") {
    try {
      const res = await PaywalloClient.getVariant(experimentKey);
      return res?.variant || fallback;
    } catch {
      return fallback;
    }
  }
}

export const paywalloService = new PaywalloService();
```

## 3. Gestão de Estado e Testes A/B (Zustand)

Para evitar "piscadas" na UI (flickers), carregue as variantes no boot do app e persista-as localmente.

```javascript
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const usePaywalloStore = create()(
  persist(
    (set) => ({
      variants: {},
      setVariant: (key, value) => 
        set((state) => ({ variants: { ...state.variants, [key]: value } })),
    }),
    {
      name: "paywallo-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
```

### Pré-carregamento (App boot)
No seu hook de inicialização do app (`App.js` ou `useAppSetup`):
```javascript
const preloadFlags = async () => {
  await paywalloService.init(user?.id);
  const variant = await paywalloService.getVariant("onboarding_flow_v2");
  usePaywalloStore.getState().setVariant("onboarding_flow_v2", variant);
};
```

## 4. Rastreamento de Funil e Dropouts

Para que o dashboard do Paywallo mostre taxas de conversão, use eventos que comecem com `$`.

### Onboarding Funnel
- `$onboarding_started`: Disparado no clique de "Começar".
- `$onboarding_step`: Disparado em cada tela. Obrigatório: `stepIndex`, `stepName`.
- `$onboarding_completed`: Disparado antes de abrir o Paywall.

```javascript
// Exemplo de track de step
paywalloService.track("$onboarding_step", {
  stepIndex: 3,
  stepName: "Medication Selection",
  variant: currentVariant
});
```

## 5. Implementação de Paywall Híbrido

O padrão é tentar abrir o **Painel Remoto** (configurado no dashboard) e ter um **Fallback Local** caso falhe ou o usuário esteja offline.

### Componente de Paywall (`Paywall.js`)
```javascript
import { PaywalloClient } from "@virex-tech/paywallo-sdk";

const Paywall = () => {
  const triggerPaywall = async () => {
    // 1. Log de visualização (Obrigatório para ROI)
    await paywalloService.track("$paywall_viewed", {
      variant: currentVariant,
      origin: "onboarding"
    });

    // 2. Tenta abrir o Remoto
    const presented = await PaywalloClient.presentCampaign("main_paywall");
    
    if (!presented) {
      // 3. Fallback para UI Local
      setShowLocalPaywall(true);
    }
  };
  
  // Handler de Compra com Sucesso
  const onPurchaseComplete = async (packageId) => {
    // Evento vital para conversão no dashboard
    await paywalloService.track("$purchase_completed", {
      product_id: packageId,
      variant: currentVariant,
      revenue: priceValue
    });

    // Sincroniza com RevenueCat se existir
    if (Purchases) {
      await Purchases.setAttributes({ "paywall_variant": currentVariant });
    }
    
    await PaywalloClient.flush(); // Garante o envio imediato
  };
};
```

## 6. Checklist de Validação (O que conferir?)

1. **Wait for Init:** Verifique se o `init()` foi chamado antes de qualquer `track()`.
2. **Variant Persistence:** A variante está no `AsyncStorage`? (Se sim, a página carrega sem delay).
3. **Double Success Logic:** O evento `$purchase_completed` está enviando o `revenue` real?
4. **Flush no Close:** Sempre chame `.flush()` ao fechar o app ou após compras para garantir que os dados não fiquem em cache.
