// =============================================================================
// Edge Function: revenuecat-webhook
// -----------------------------------------------------------------------------
// Recebe os webhooks do RevenueCat e mantém a tabela `subscriptions` + a flag
// `profiles.is_premium` em dia. Team Pro: a compra fica ligada à equipe do
// capitão que pagou (`subscriptions.team_id`); `get_my_pro()` libera até 10
// integrantes dela. Por isso esta cópia é a fonte da verdade do Pro no app.
//
// Segurança: o RevenueCat envia no header Authorization o valor configurado em
// RevenueCat › Integrations › Webhooks › Authorization header. Ele precisa ser
// igual ao secret REVENUECAT_WEBHOOK_AUTH (comparação em tempo constante). Sem
// o secret configurado, tudo é recusado.
//
// Idempotência: cada `event.id` é gravado em `webhook_events`; reenvios
// retornam `deduplicated: true`.
//
// Deploy: supabase functions deploy revenuecat-webhook --no-verify-jwt
// Secret: supabase secrets set REVENUECAT_WEBHOOK_AUTH=<valor>
// =============================================================================

import { createClient } from "npm:@supabase/supabase-js@2";

interface RevenueCatEvent {
	id: string;
	type: string;
	event_timestamp_ms: number;
	app_user_id: string;
	original_app_user_id?: string;
	product_id: string;
	store: string;
	environment: string;
	period_type?: string;
	original_transaction_id?: string;
	transaction_id?: string;
	expiration_at_ms?: number | null;
}

interface RevenueCatPayload {
	api_version?: string;
	event?: RevenueCatEvent;
}

// Status gravado por tipo de evento. TRANSFER, TEST e outros só confirmam.
const STATUS_BY_EVENT: Record<string, string> = {
	INITIAL_PURCHASE: "active",
	RENEWAL: "active",
	UNCANCELLATION: "active",
	PRODUCT_CHANGE: "active",
	NON_RENEWING_PURCHASE: "active",
	SUBSCRIPTION_EXTENDED: "active",
	CANCELLATION: "cancelled",
	BILLING_ISSUE: "in_billing_retry",
	SUBSCRIPTION_PAUSED: "paused",
	EXPIRATION: "expired",
};

const AUTH = Deno.env.get("REVENUECAT_WEBHOOK_AUTH") ?? "";

function timingSafeEqual(a: string, b: string): boolean {
	if (a.length !== b.length) return false;
	let mismatch = 0;
	for (let i = 0; i < a.length; i++) mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i);
	return mismatch === 0;
}

function isUuid(value: string): boolean {
	return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value);
}

function json(body: unknown, status: number): Response {
	return new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } });
}

// Cancelada ainda vale até expirar; premium = não expirou e não é EXPIRATION.
function isPremium(event: RevenueCatEvent, status: string): boolean {
	if (status === "expired" || status === "paused") return false;
	if (!event.expiration_at_ms) return status === "active";
	return event.expiration_at_ms > Date.now();
}

type IAdmin = ReturnType<typeof createClient>;

// Equipe que a compra libera: a que quem paga capitaneia agora. Sem equipe
// (ou não é capitão), fica solta até ele chamar link_my_pro_to_team no app.
async function captainTeam(supabase: IAdmin, userId: string | null): Promise<string | null> {
	if (!userId) return null;
	const { data } = await supabase
		.from("team_members")
		.select("team_id")
		.eq("user_id", userId)
		.eq("role", "captain")
		.maybeSingle();
	return (data?.team_id as string | undefined) ?? null;
}

Deno.serve(async (req: Request): Promise<Response> => {
	if (req.method !== "POST") return json({ error: "method_not_allowed" }, 405);

	// 1. Header Authorization (aceita "Bearer <valor>" ou só "<valor>")
	const header = (req.headers.get("authorization") ?? "").replace(/^Bearer\s+/i, "");
	if (AUTH === "" || !timingSafeEqual(AUTH, header)) return json({ error: "unauthorized" }, 401);

	let payload: RevenueCatPayload;
	try {
		payload = (await req.json()) as RevenueCatPayload;
	} catch {
		return json({ error: "invalid_json" }, 400);
	}
	const event = payload.event;
	if (!event?.id || !event.type) return json({ error: "invalid_event" }, 400);

	const supabase = createClient(
		Deno.env.get("SUPABASE_URL") ?? "",
		Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
		{ auth: { persistSession: false, autoRefreshToken: false } },
	);

	// 2. Idempotência
	const { data: existing } = await supabase
		.from("webhook_events")
		.select("event_id")
		.eq("event_id", event.id)
		.maybeSingle();
	if (existing) return json({ received: true, eventId: event.id, deduplicated: true }, 200);

	const status = STATUS_BY_EVENT[event.type];
	if (status) {
		// 3. Atleta: o app usa o id do Supabase como App User ID no RevenueCat
		const candidate = isUuid(event.app_user_id) ? event.app_user_id : (event.original_app_user_id ?? "");
		let userId: string | null = null;
		if (isUuid(candidate)) {
			const { data: profile } = await supabase.from("profiles").select("id").eq("id", candidate).maybeSingle();
			if (profile) userId = profile.id as string;
		}
		const eventTime = new Date(event.event_timestamp_ms).toISOString();
		const original = event.original_transaction_id ?? event.transaction_id ?? event.id;

		// 4. Team Pro: a compra libera a equipe do capitão que pagou. Renovações
		// mantêm a equipe já ligada (a assinatura nunca pula de equipe sozinha).
		const { data: current } = await supabase
			.from("subscriptions")
			.select("team_id")
			.eq("original_transaction_id", original)
			.maybeSingle();
		const teamId = (current?.team_id as string | null | undefined) ?? (await captainTeam(supabase, userId));

		// 5. Assinatura (uma linha por compra original)
		const { error: upsertError } = await supabase.from("subscriptions").upsert(
			{
				team_id: teamId,
				user_id: userId,
				anonymous_user_id: userId ? null : event.app_user_id,
				product_id: event.product_id,
				status,
				store: event.store,
				environment: event.environment,
				is_trial: event.period_type === "TRIAL",
				started_at: eventTime,
				expires_at: event.expiration_at_ms ? new Date(event.expiration_at_ms).toISOString() : null,
				cancelled_at: event.type === "CANCELLATION" ? eventTime : null,
				original_transaction_id: original,
				last_event_id: event.id,
				updated_at: new Date().toISOString(),
			},
			{ onConflict: "original_transaction_id" },
		);
		if (upsertError) return json({ error: "subscription_upsert_failed", detail: upsertError.message }, 500);

		// 6. Flag no perfil (quem paga)
		if (userId) {
			await supabase.from("profiles").update({ is_premium: isPremium(event, status) }).eq("id", userId);
		}
	}

	// 7. Evento processado
	await supabase.from("webhook_events").insert({ event_id: event.id, event_type: event.type, payload });
	return json({ received: true, eventId: event.id, deduplicated: false }, 200);
});
