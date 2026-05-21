// =============================================================================
// Edge Function: paywallo-webhook
// -----------------------------------------------------------------------------
// Recebe os webhooks do Paywallo (formato RevenueCat-compatible) e mantem a
// tabela `subscriptions` + a flag `profiles.is_premium` sincronizadas.
//
// Substitui o antigo dominio `src/domain/subscription` do base-server.
//
// Seguranca (dupla verificacao):
//   1. Path secret  -> query string `?secret=<PAYWALLO_WEBHOOK_PATH_SECRET>`
//   2. Assinatura   -> HMAC-SHA256 do corpo bruto no header X-Paywallo-Signature
//
// Idempotencia: cada `event.id` e gravado em `webhook_events`; replays retornam
// `deduplicated: true`.
//
// Deploy:  supabase functions deploy paywallo-webhook --no-verify-jwt
// Secrets: supabase secrets set --env-file ./.env
// =============================================================================

import { createClient } from "npm:@supabase/supabase-js@2";

interface PaywalloWebhookEvent {
  id: string;
  type: string;
  event_timestamp_ms: number;
  app_user_id: string;
  product_id: string;
  store: string;
  environment: string;
  period_type?: string;
  original_transaction_id: string;
  expiration_at_ms?: number;
}

interface PaywalloWebhookPayload {
  api_version?: string;
  event?: PaywalloWebhookEvent;
}

const STATUS_BY_EVENT: Record<string, string> = {
  INITIAL_PURCHASE: "active",
  RENEWAL: "active",
  UNCANCELLATION: "active",
  CANCELLATION: "cancelled",
  EXPIRATION: "expired",
};

const ACTIVE_STATUSES = ["active", "in_grace_period", "in_billing_retry"];

const PATH_SECRET = Deno.env.get("PAYWALLO_WEBHOOK_PATH_SECRET") ?? "disabled";
const HMAC_SECRET = Deno.env.get("PAYWALLO_WEBHOOK_HMAC_SECRET") ?? "";

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let mismatch = 0;
  for (let i = 0; i < a.length; i++) {
    mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return mismatch === 0;
}

async function verifySignature(rawBody: string, signature: string | null): Promise<boolean> {
  // HMAC vazio -> verificacao desabilitada (nao recomendado em producao).
  if (HMAC_SECRET === "") return true;
  if (!signature) return false;

  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(HMAC_SECRET),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const digest = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(rawBody));
  const hex = [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, "0")).join("");
  return timingSafeEqual(`sha256=${hex}`, signature);
}

function isUuid(value: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value);
}

function json(body: unknown, status: number): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

Deno.serve(async (req: Request): Promise<Response> => {
  if (req.method !== "POST") {
    return json({ error: "method_not_allowed" }, 405);
  }

  // 1. Path secret (constant-time).
  const providedSecret = new URL(req.url).searchParams.get("secret") ?? "";
  if (PATH_SECRET === "disabled" || !timingSafeEqual(PATH_SECRET, providedSecret)) {
    return json({ error: "invalid_secret" }, 401);
  }

  // 2. Assinatura HMAC do corpo bruto.
  const rawBody = await req.text();
  if (!(await verifySignature(rawBody, req.headers.get("x-paywallo-signature")))) {
    return json({ error: "invalid_signature" }, 401);
  }

  // 3. Parse + validacao minima do payload.
  let payload: PaywalloWebhookPayload;
  try {
    payload = JSON.parse(rawBody) as PaywalloWebhookPayload;
  } catch {
    return json({ error: "invalid_json" }, 400);
  }

  const event = payload.event;
  if (!event?.id || !event.type || !STATUS_BY_EVENT[event.type]) {
    return json({ error: "invalid_event" }, 400);
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    { auth: { persistSession: false, autoRefreshToken: false } },
  );

  // 4. Idempotencia.
  const { data: existing } = await supabase
    .from("webhook_events")
    .select("event_id")
    .eq("event_id", event.id)
    .maybeSingle();
  if (existing) {
    return json({ received: true, eventId: event.id, deduplicated: true }, 200);
  }

  // 5. Resolve o usuario. `app_user_id` e tratado como id do profile quando for
  // um UUID conhecido; caso contrario a assinatura fica como anonima.
  let userId: string | null = null;
  let anonymousUserId: string | null = null;
  if (isUuid(event.app_user_id)) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("id")
      .eq("id", event.app_user_id)
      .maybeSingle();
    if (profile) userId = profile.id as string;
  }
  if (!userId) anonymousUserId = event.app_user_id;

  // 6. Upsert da assinatura (chave: original_transaction_id).
  const status = STATUS_BY_EVENT[event.type];
  const eventTime = new Date(event.event_timestamp_ms).toISOString();
  const { error: upsertError } = await supabase.from("subscriptions").upsert(
    {
      user_id: userId,
      anonymous_user_id: anonymousUserId,
      product_id: event.product_id,
      status,
      store: event.store,
      environment: event.environment,
      is_trial: event.period_type === "TRIAL",
      started_at: eventTime,
      expires_at: event.expiration_at_ms
        ? new Date(event.expiration_at_ms).toISOString()
        : null,
      cancelled_at: event.type === "CANCELLATION" ? eventTime : null,
      original_transaction_id: event.original_transaction_id,
      last_event_id: event.id,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "original_transaction_id" },
  );
  if (upsertError) {
    return json({ error: "subscription_upsert_failed", detail: upsertError.message }, 500);
  }

  // 7. Atualiza a flag is_premium do perfil (quando o usuario foi resolvido).
  if (userId) {
    await supabase
      .from("profiles")
      .update({ is_premium: ACTIVE_STATUSES.includes(status) })
      .eq("id", userId);
  }

  // 8. Marca o evento como processado.
  await supabase
    .from("webhook_events")
    .insert({ event_id: event.id, event_type: event.type, payload });

  return json({ received: true, eventId: event.id, deduplicated: false }, 200);
});
