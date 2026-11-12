// =============================================================================
// Edge Function: pace-ai (PACE TEAM PRO)
// -----------------------------------------------------------------------------
// O Buddy responde sobre as corridas do atleta com o Claude Haiku 5.5.
//
// 1. Só para quem está coberto pelo Team Pro (get_my_pro().isPro)
// 2. Limite de perguntas por dia (DAILY_LIMIT, contado em ai_messages)
// 3. Os números vêm de get_ai_context() — corridas válidas reais. A IA é
//    instruída a usar só esses dados e a dizer quando não há dados suficientes.
// 4. Pergunta e resposta ficam em ai_conversations / ai_messages
//
// Deploy: supabase functions deploy pace-ai   (verify_jwt ligado)
// Secret: ANTHROPIC_API_KEY (o dono do app cola no painel do Supabase)
// =============================================================================

import Anthropic from "npm:@anthropic-ai/sdk@1.8.0";
import { createClient, type SupabaseClient } from "npm:@supabase/supabase-js@2";

const MODEL = "claude-haiku-5-5";
const DAILY_LIMIT = 20;
const MAX_QUESTION = 500;
const HISTORY = 16;

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const SYSTEM = `Você é o Buddy, o mascote do PACE TEAM, um app brasileiro de corrida em equipe. Aqui você é a PACE AI: um parceiro de treino que ajuda o atleta a entender as próprias corridas e a evoluir.

Como responder:
- Português do Brasil, tom leve, animado e próximo, como um amigo que corre junto. Pode usar 1 emoji quando combinar, sem exagero.
- Respostas curtas: até 120 palavras, a não ser que o atleta peça detalhes.
- Texto simples para tela de celular: sem markdown, sem asteriscos, sem títulos e sem tabelas. Para listas use linhas começando com "• ".
- Escreva distâncias como "5,2 km" (vírgula decimal). O ritmo já vem pronto no campo "ritmo" (ex.: "6:15 min/km"): copie exatamente, NUNCA calcule ritmo, tempo ou média você mesmo.
- Ritmo acima de 12:00 min/km normalmente é caminhada ou trote bem leve: trate com naturalidade, sem julgar.

Dados:
- Use SOMENTE os números do bloco DADOS DO ATLETA. Nunca invente corridas, tempos, distâncias, posições ou datas.
- Se faltar dado para responder (por exemplo, nenhuma corrida de 5 km para falar do 5 km), diga isso com clareza e sugira o que registrar no app.
- As semanas vão de segunda a domingo; "weeks" vai da mais antiga para a atual (a última é a semana atual, ainda em andamento). "today" é a data de hoje.
- Na equipe ("team.mates"), "isYou" marca o próprio atleta. Se perguntarem quem correu menos ou teve o pior desempenho, responda com os números, de um jeito gentil e motivador (ex.: sugerir chamar a pessoa para correr junto), nunca humilhando ninguém.
- Para o ranking, use "team.cityRank" e a frase pronta em "team.rival.situacao" (se a equipe está à frente ou atrás da rival e por quantos km). Não refaça essa conta. Pontos vêm só de correr: não existe atalho nem compra.
- Se precisar de um número que não está pronto nos dados, diga que não tem esse dado em vez de calcular.

Limites:
- Você não é médico, nutricionista nem treinador. Não faça diagnóstico, não prescreva remédio nem treino para lesão. Se o atleta falar de dor, lesão, tontura ou mal-estar, recomende parar e procurar um profissional de saúde.
- Dicas de treino devem ser gerais e seguras (progressão gradual de cerca de 10% por semana, descanso, aquecimento, regularidade).
- Fale só de corrida, saúde em geral, motivação e do PACE TEAM. Se pedirem outro assunto, diga com bom humor que você é o parceiro de corrida e volte para o treino.`;

// deno-lint-ignore no-explicit-any
type IAdmin = SupabaseClient<any, "public", "public">;

// Ritmo em texto ("27:46 min/km") e situação da rival prontos: a IA só copia,
// sem fazer conta (antes ela errava o ritmo e o lado da rival)
function paceText(sec: unknown): string | null {
  if (typeof sec !== "number" || sec <= 0) return null;
  const m = Math.floor(sec / 60);
  const s = Math.round(sec % 60);
  return `${m}:${String(s).padStart(2, "0")} min/km`;
}

function kmText(km: number): string {
  return `${km.toFixed(1).replace(".", ",")} km`;
}

function rivalSituation(rival: Record<string, unknown>): string {
  const gap = typeof rival.gapKm === "number" ? rival.gapKm : 0;
  const name = String(rival.name);
  if (gap > 0) return `A equipe está ATRÁS da ${name}: faltam ${kmText(gap)} para alcançar.`;
  if (gap < 0) return `A equipe está À FRENTE da ${name} por ${kmText(-gap)}.`;
  return `A equipe está empatada com a ${name}.`;
}

function prepare(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(prepare);
  if (!value || typeof value !== "object") return value;
  const out: Record<string, unknown> = {};
  for (const [key, v] of Object.entries(value as Record<string, unknown>)) {
    if (key === "paceSecKm") out.ritmo = paceText(v) ?? "sem ritmo (distância curta)";
    else out[key] = prepare(v);
  }
  const rival = out.rival as Record<string, unknown> | null | undefined;
  if (rival && typeof rival === "object") {
    rival.situacao = rivalSituation(rival);
    delete rival.gapKm;
    delete rival.gapPoints;
  }
  return out;
}

function json(body: unknown, status: number): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...CORS, "Content-Type": "application/json" },
  });
}

// Meia-noite de hoje no horário de Brasília (UTC−3, sem horário de verão)
function startOfTodayBrt(): string {
  const brt = new Date(Date.now() - 3 * 3600_000);
  const day = brt.toISOString().slice(0, 10);
  return new Date(`${day}T03:00:00.000Z`).toISOString();
}

async function questionsToday(admin: IAdmin, uid: string): Promise<number> {
  const { count } = await admin
    .from("ai_messages")
    .select("id", { count: "exact", head: true })
    .eq("user_id", uid)
    .eq("role", "user")
    .gte("created_at", startOfTodayBrt());
  return count ?? 0;
}

// Conversa do atleta (a pedida, se for dele) ou uma nova
async function conversationFor(
  admin: IAdmin,
  uid: string,
  wanted: string | null,
  question: string,
): Promise<string | null> {
  if (wanted) {
    const { data } = await admin
      .from("ai_conversations")
      .select("id")
      .eq("id", wanted)
      .eq("user_id", uid)
      .maybeSingle();
    if (data) return data.id as string;
  }
  const { data } = await admin
    .from("ai_conversations")
    .insert({ user_id: uid, title: question.slice(0, 80) })
    .select("id")
    .single();
  return (data?.id as string | undefined) ?? null;
}

async function historyOf(admin: IAdmin, conversationId: string): Promise<Anthropic.MessageParam[]> {
  const { data } = await admin
    .from("ai_messages")
    .select("role, content")
    .eq("conversation_id", conversationId)
    .order("created_at", { ascending: false })
    .limit(HISTORY);
  const rows = (data ?? []).reverse() as { role: "user" | "assistant"; content: string }[];
  // A conversa precisa começar pelo atleta
  while (rows.length > 0 && rows[0].role !== "user") rows.shift();
  return rows.map((r) => ({ role: r.role, content: r.content }));
}

function replyText(message: Anthropic.Message): string {
  if (message.stop_reason === "refusal") {
    return "Esse assunto eu não consigo responder. Bora falar das suas corridas? 🏃";
  }
  const text = message.content
    .filter((b): b is Anthropic.TextBlock => b.type === "text")
    .map((b) => b.text)
    .join("\n")
    .trim();
  return text || "Não consegui montar uma resposta agora. Tenta perguntar de outro jeito?";
}

Deno.serve(async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS });
  if (req.method !== "POST") return json({ error: "method_not_allowed" }, 405);

  const authHeader = req.headers.get("Authorization");
  if (!authHeader) return json({ error: "not_authenticated" }, 401);

  const apiKey = Deno.env.get("ANTHROPIC_API_KEY") ?? "";
  if (apiKey === "") return json({ error: "not_configured" }, 503);

  let body: { message?: unknown; conversationId?: unknown };
  try {
    body = await req.json();
  } catch {
    return json({ error: "invalid_json" }, 400);
  }
  const question = typeof body.message === "string" ? body.message.trim() : "";
  if (question.length === 0 || question.length > MAX_QUESTION) {
    return json({ error: "invalid_message" }, 400);
  }
  const wanted = typeof body.conversationId === "string" ? body.conversationId : null;

  const userClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_ANON_KEY") ?? "",
    {
      global: { headers: { Authorization: authHeader } },
      auth: { persistSession: false, autoRefreshToken: false },
    },
  );
  const { data: userData } = await userClient.auth.getUser();
  const uid = userData.user?.id;
  if (!uid) return json({ error: "not_authenticated" }, 401);

  // 1. Team Pro
  const { data: pro, error: proError } = await userClient.rpc("get_my_pro");
  if (proError) return json({ error: "pro_failed" }, 500);
  if (!(pro as { isPro?: boolean } | null)?.isPro) return json({ error: "not_pro" }, 403);

  const admin = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    { auth: { persistSession: false, autoRefreshToken: false } },
  );

  // 2. Limite do dia
  const asked = await questionsToday(admin, uid);
  if (asked >= DAILY_LIMIT) return json({ error: "limit", left: 0, limit: DAILY_LIMIT }, 429);

  // 3. Dados reais + conversa
  const { data: context, error: contextError } = await userClient.rpc("get_ai_context");
  if (contextError) return json({ error: "context_failed" }, 500);
  const conversationId = await conversationFor(admin, uid, wanted, question);
  if (!conversationId) return json({ error: "conversation_failed" }, 500);
  const history = await historyOf(admin, conversationId);

  const client = new Anthropic({ apiKey });
  let message: Anthropic.Message;
  try {
    message = await client.messages.create({
      model: MODEL,
      max_tokens: 4000,
      output_config: { effort: "low" },
      system: [
        { type: "text", text: SYSTEM },
        { type: "text", text: `DADOS DO ATLETA (JSON):\n${JSON.stringify(prepare(context))}` },
      ],
      messages: [...history, { role: "user", content: question }],
    });
  } catch (error) {
    // Conversa recém-criada sem resposta não fica no histórico
    if (conversationId !== wanted) {
      await admin.from("ai_conversations").delete().eq("id", conversationId);
    }
    if (error instanceof Anthropic.RateLimitError) return json({ error: "busy" }, 503);
    if (error instanceof Anthropic.AuthenticationError) return json({ error: "not_configured" }, 503);
    if (error instanceof Anthropic.APIError) return json({ error: "ai_failed", status: error.status }, 502);
    return json({ error: "ai_failed" }, 502);
  }

  const reply = replyText(message);

  // 4. Histórico
  await admin.from("ai_messages").insert([
    { conversation_id: conversationId, user_id: uid, role: "user", content: question },
    {
      conversation_id: conversationId,
      user_id: uid,
      role: "assistant",
      content: reply.slice(0, 6000),
      input_tokens: message.usage.input_tokens,
      output_tokens: message.usage.output_tokens,
    },
  ]);
  await admin
    .from("ai_conversations")
    .update({ updated_at: new Date().toISOString() })
    .eq("id", conversationId);

  return json({ conversationId, reply, left: Math.max(0, DAILY_LIMIT - asked - 1), limit: DAILY_LIMIT }, 200);
});
