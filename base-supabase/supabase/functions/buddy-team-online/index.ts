// =============================================================================
// Edge Function: buddy-team-online
// -----------------------------------------------------------------------------
// O app chama ao abrir ou ao comecar uma corrida. Registra o atleta como
// online na equipe (RPC buddy_ping_online, como o proprio usuario) e manda um
// push da Expo para os colegas que ainda nao foram avisados nas ultimas 2 h.
//
// Seguranca: verify_jwt ligado. A RPC roda com o JWT de quem chamou, entao
// so avisa a equipe do proprio usuario e respeita o limite de 2 h no banco.
// A service_role so e usada para apagar tokens que a Expo diz nao existirem.
//
// Deploy:  supabase functions deploy buddy-team-online
// Secret opcional: EXPO_ACCESS_TOKEN (se o "push security" da Expo estiver ligado)
// =============================================================================

import { createClient } from "npm:@supabase/supabase-js@2";

interface Recipient {
  userId: string;
  name: string;
  token: string;
}

interface PingResult {
  userId: string;
  name: string;
  teamId: string | null;
  recipients: Recipient[];
}

interface ExpoTicket {
  status: "ok" | "error";
  id?: string;
  message?: string;
  details?: { error?: string };
}

const EXPO_PUSH_URL = "https://exp.host/--/api/v2/push/send";
const EXPO_BATCH = 100;
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

  const tickets: ExpoTicket[] = [];
  for (let i = 0; i < messages.length; i += EXPO_BATCH) {
    const res = await fetch(EXPO_PUSH_URL, {
      method: "POST",
      headers,
      body: JSON.stringify(messages.slice(i, i + EXPO_BATCH)),
    });
    const body = await res.json().catch(() => null) as { data?: ExpoTicket[] } | null;
    const batch = messages.slice(i, i + EXPO_BATCH);
    tickets.push(...(body?.data ?? batch.map(() => ({ status: "error" as const, message: `http_${res.status}` }))));
  }
  return tickets;
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

  // 1. Ping como o proprio usuario (RLS + auth.uid() da sessao).
  const userClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_ANON_KEY") ?? "",
    {
      global: { headers: { Authorization: authHeader } },
      auth: { persistSession: false, autoRefreshToken: false },
    },
  );

  const { data, error } = await userClient.rpc("buddy_ping_online");
  if (error) {
    const status = error.message.includes("not_authenticated") ? 401 : 500;
    return json({ error: "ping_failed", detail: error.message }, status);
  }

  const ping = data as PingResult;
  if (ping.recipients.length === 0) {
    return json({ teamId: ping.teamId, notified: 0 }, 200);
  }

  // 2. Push da Expo para cada aparelho dos colegas.
  const name = ping.name.trim() !== "" ? ping.name.trim() : "Seu colega";
  const messages = ping.recipients.map((r) => ({
    to: r.token,
    title: `${name} está online`,
    body: "Bora correr junto? Dois toques atrás do celular e o Buddy aparece.",
    sound: "default",
    data: { type: "team_online", userId: ping.userId },
  }));

  const tickets = await sendExpo(messages);

  // 3. Tokens que nao existem mais saem da tabela.
  const dead = ping.recipients
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
    teamId: ping.teamId,
    notified: tickets.filter((t) => t.status === "ok").length,
    failed: tickets.filter((t) => t.status !== "ok").length,
  }, 200);
});
