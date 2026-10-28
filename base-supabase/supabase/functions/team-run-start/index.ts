// =============================================================================
// Edge Function: team-run-start
// -----------------------------------------------------------------------------
// O app (ou o Buddy, fora do app) chama quando o atleta começa a correr com a
// equipe. Manda "Sua equipe está correndo, só falta você!" para os colegas que
// não estão correndo agora (no máximo 1 aviso desses a cada 45 min por pessoa).
//
// Seguranca: verify_jwt ligado. A RPC team_run_start_targets roda com o JWT de
// quem chamou (só avisa a própria equipe e respeita o limite no banco).
// A service_role só é usada para apagar tokens que a Expo diz não existirem.
//
// Deploy:  supabase functions deploy team-run-start
// Secret opcional: EXPO_ACCESS_TOKEN (se o "push security" da Expo estiver ligado)
// =============================================================================

import { createClient } from "npm:@supabase/supabase-js@2";

interface Recipient {
  userId: string;
  token: string;
}

interface PushTargets {
  name?: string;
  recipients: Recipient[];
}

interface ExpoTicket {
  status: "ok" | "error";
  id?: string;
  message?: string;
  details?: { error?: string };
}

const EXPO_PUSH_URL = "https://exp.host/--/api/v2/push/send";
const EXPO_ACCESS_TOKEN = Deno.env.get("EXPO_ACCESS_TOKEN") ?? "";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function json(body: unknown, status: number): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...CORS, "Content-Type": "application/json" },
  });
}

async function sendExpo(messages: unknown[]): Promise<ExpoTicket[]> {
  const headers: Record<string, string> = {
    "Accept": "application/json",
    "Content-Type": "application/json",
  };
  if (EXPO_ACCESS_TOKEN !== "") headers.Authorization = `Bearer ${EXPO_ACCESS_TOKEN}`;
  const res = await fetch(EXPO_PUSH_URL, { method: "POST", headers, body: JSON.stringify(messages) });
  const body = await res.json().catch(() => null) as { data?: ExpoTicket[] } | null;
  return body?.data ?? messages.map(() => ({ status: "error" as const, message: `http_${res.status}` }));
}

Deno.serve(async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: CORS });
  }
  if (req.method !== "POST") {
    return json({ error: "method_not_allowed" }, 405);
  }

  const authHeader = req.headers.get("Authorization");
  if (!authHeader) {
    return json({ error: "not_authenticated" }, 401);
  }

  const userClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_ANON_KEY") ?? "",
    {
      global: { headers: { Authorization: authHeader } },
      auth: { persistSession: false, autoRefreshToken: false },
    },
  );

  const { data, error } = await userClient.rpc("team_run_start_targets");
  if (error) {
    const status = error.message.includes("not_authenticated") ? 401 : 500;
    return json({ error: "targets_failed", detail: error.message }, status);
  }

  const targets = data as PushTargets;
  if (targets.recipients.length === 0) {
    return json({ notified: 0 }, 200);
  }

  const messages = targets.recipients.map((r) => ({
    to: r.token,
    title: "Sua equipe está correndo, só falta você! 🏃",
    body: `${targets.name ?? "Seu colega"} começou a correr agora. Bora junto?`,
    sound: "default",
    data: { type: "team_running" },
  }));
  const tickets = await sendExpo(messages);

  const dead = targets.recipients
    .filter((_, i) => tickets[i]?.details?.error === "DeviceNotRegistered")
    .map((r) => r.token);
  if (dead.length > 0) {
    const admin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false, autoRefreshToken: false } },
    );
    await admin.from("device_tokens").delete().in("token", dead);
  }

  return json({
    notified: tickets.filter((t) => t.status === "ok").length,
    failed: tickets.filter((t) => t.status !== "ok").map((t) => t.details?.error ?? t.message ?? "error"),
  }, 200);
});
