# Skill: Paywallo — Assinatura Server-Side (webhook & backend)

> **SDK alvo:** `@virex-tech/paywallo-sdk` v2.x · **Backend:** `base-supabase`
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

A compra disparada no paywall do Superwall é uma transação **normal de StoreKit / Play Billing**. O Paywallo é configurado para receber as **App Store Server Notifications V2** e o **Google Play RTDN** — então ele aprende a transação independentemente de quem apresentou o paywall, valida o receipt e emite o webhook para o Supabase.

Para a correlação usuário↔transação funcionar, o `identify` do Paywallo (ver [`paywallo-sdk-setup.md`](./paywallo-sdk-setup.md)) deve usar um `app_user_id` que case com `profiles.id`.

> Setup no dashboard do Paywallo: **Integrations → Store Notifications** (Apple/Google) + **Webhooks** apontando para a URL da função.

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

## 6. Atribuição (opcional)

Se o fork usar AppsFlyer/Meta, envie os IDs como `properties` no `identify` do Paywallo e via `setIntegrationAttributes` no Superwall. Só pluge se o caso de atribuição existir.

---

## 7. Checklist

- [ ] `paywallo-webhook` deployada com path secret + HMAC configurados
- [ ] URL colada no dashboard do Paywallo (Webhooks)
- [ ] Store Notifications (Apple/Google) apontadas para o Paywallo
- [ ] `identify` usa `app_user_id == profiles.id`
- [ ] Gating sensível no backend lê `profiles.is_premium` / `subscriptions` (não o status client-side)
- [ ] `setSubscriptionStatus` espelha o premium de volta ao Superwall
- [ ] **RevenueCat não é usado**
