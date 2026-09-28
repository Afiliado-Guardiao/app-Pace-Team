# Skill: Paywallo — Assinatura Server-Side (webhook & backend)

> **SDK alvo:** `@virex-tech/paywallo-sdk` ^2.10.0 · **Backend:** `base-supabase`
> Pré-requisito: [`paywallo-sdk-setup.md`](./paywallo-sdk-setup.md).

No modelo híbrido, **a fonte de verdade da assinatura é o Paywallo, confirmada server-side** pela Edge Function `paywallo-webhook`. O Superwall apresenta o paywall e dispara a compra (StoreKit/Play Billing); o Paywallo recebe os eventos e o webhook mantém o banco. **Não usamos RevenueCat.**

---

## 1. Por que server-side

O `subscriptionStatus` do Superwall (SDK) é **client-side** — bom para UX, fraco para gating sensível (pode ser burlado). Para liberar conteúdo pago no backend/RLS você precisa de uma verdade no servidor: a tabela `subscriptions` + `profiles.is_premium`, escritas **só** pelo webhook (`service_role`).

---

## 2. A Edge Function `paywallo-webhook`

`base-supabase/supabase/functions/paywallo-webhook/index.ts` (Deno):

1. **Recebe** POSTs do Paywallo (formato RevenueCat-compatible).
2. **Valida** em duas camadas: path secret (`?secret=<PAYWALLO_WEBHOOK_PATH_SECRET>`) + HMAC-SHA256 do corpo (`X-Paywallo-Signature`, chave `PAYWALLO_WEBHOOK_HMAC_SECRET`), tudo constant-time.
3. **Deduplica** por `event.id` em `webhook_events`.
4. **Mapeia** evento → status: `INITIAL_PURCHASE`/`RENEWAL`/`UNCANCELLATION` → `active`, `CANCELLATION` → `cancelled`, `EXPIRATION` → `expired`.
5. **Resolve** o usuário pelo `app_user_id` (UUID → `profiles.id`; senão `anonymous_user_id`).
6. **Upsert** em `subscriptions` (chave `original_transaction_id`) + atualiza `profiles.is_premium`.

---

## 3. Como as compras do Superwall chegam ao Paywallo

A compra disparada no paywall do Superwall é uma transação **normal de StoreKit / Play Billing**. O bridge do SDK (`SuperwallAutoBridge`) já registra `paywall_viewed/closed` e o evento `transaction` (crítico) sozinho a partir dos callbacks do Superwall — **não rastreie compra manualmente**.

Para a **assinatura em si** virar registro no Paywallo (e então disparar o `paywallo-webhook` acima), é **obrigatório** configurar o webhook Superwall → Paywallo no dashboard:

1. Dashboard do **Paywallo** → `Configurações` → `Integrações` → `Superwall`: copie a URL do webhook e o secret gerado.
2. Dashboard do **Superwall** → `Settings` → `Webhooks`: adicione a URL `https://paywallo.com.br/api/webhook/superwall/{sua-chave-app}` com o custom header `x-paywallo-secret: <secret>`.
3. Marque os 7 eventos obrigatórios: `initial_purchase`, `renewal`, `cancellation`, `uncancellation`, `expiration`, `billing_issue`, `non_renewing_purchase`. Faltar um não trava os outros, mas degrada aquele sinal (ex.: sem `cancellation`, um reembolso continua contando como venda ativa).

Para a correlação usuário↔transação funcionar, o `identify` do Paywallo (ver [`paywallo-sdk-setup.md`](./paywallo-sdk-setup.md)) deve usar `userId == profiles.id` — vira `external_user_id` no Paywallo e chega no payload do webhook como `app_user_id`.

---

## 3.1 Atributos `pw_*` no Superwall (segmentação por origem)

O Paywallo envia a atribuição on-device pro Superwall como user attributes `pw_*` (`pw_ad_network`, `pw_is_paid`, `pw_match_type`, UTMs, click IDs…) **automaticamente**, via bridge nativo. Use pra criar audiences no Superwall e mostrar paywall/preço diferente por origem (ex.: `pw_ad_network is meta`).

Como o Superwall avalia audiences no `register()` e a variante escolhida gruda no usuário até o assignment ser resetado, chame `syncSuperwallAttributes({ timeoutMs: 1500 })` (export do `@virex-tech/paywallo-sdk`) **imediatamente antes** de cada `registerPlacement` — no template isso já é feito dentro de `useSubscriptionGate` (`src/lib/superwall/hooks/useSubscriptionGate.ts`). Sem esse sync, quem veio de anúncio pode ser avaliado como orgânico e ficar assim permanentemente.

---

## 4. Deploy & secrets

```bash
cd base-supabase
npm run functions:deploy   # publica a paywallo-webhook (--no-verify-jwt)
npm run secrets:set        # envia PAYWALLO_WEBHOOK_PATH_SECRET / _HMAC_SECRET
```

URL do webhook:

```
https://<PROJECT_REF>.supabase.co/functions/v1/paywallo-webhook?secret=<PAYWALLO_WEBHOOK_PATH_SECRET>
```

Cole no dashboard do Paywallo (Integrations → Webhooks).

---

## 5. Sincronizar de volta ao Superwall (evitar paywall de retenção)

Quando `profiles.is_premium` é `true`, espelhe para o Superwall no app:

```tsx
const { setSubscriptionStatus } = useUser();
await setSubscriptionStatus({ status: "ACTIVE", entitlements: [{ id: "pro", type: "SERVICE_LEVEL" }] });
```

Referência completa do fluxo store ↔ Superwall: `ozempro-app/src/app/hooks/useSuperwallSubscription.ts`.

---

## 6. Atribuição

O Paywallo já captura UTMs/click IDs on-device e os envia pro Superwall automaticamente como atributos `pw_*` (ver seção 3.1) — não é preciso configurar nada à parte pra isso. Se o fork também usa AppsFlyer/Meta SDK diretamente (fora do Paywallo), plugue os IDs deles como `properties` no `identify` só se o caso de atribuição exigir os dois sistemas rodando em paralelo.

---

## 7. Checklist

- [ ] `paywallo-webhook` deployada com path secret + HMAC configurados
- [ ] URL colada no dashboard do Paywallo (Webhooks)
- [ ] Webhook Superwall → Paywallo configurado (Paywallo: Integrações → Superwall; Superwall: Settings → Webhooks) com os 7 eventos marcados
- [ ] `identify` usa `userId == profiles.id` (vira `external_user_id`/`app_user_id` no backend)
- [ ] Gating sensível no backend lê `profiles.is_premium` / `subscriptions` (não o status client-side)
- [ ] `setSubscriptionStatus` espelha o premium de volta ao Superwall
- [ ] `syncSuperwallAttributes` chamado antes de cada `registerPlacement` (audiences por origem funcionando)
- [ ] Push (se usado): só `@react-native-firebase/app` no Android (sem `messaging`/notifee); iOS via APNS; vínculo por usuário exige `userId` no `identify`
- [ ] **RevenueCat não é usado**
