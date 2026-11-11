import { FunctionsHttpError } from "@supabase/supabase-js";

import {
	AiError,
	IAiAnswer,
	IAiContext,
	IAiConversation,
	IAiErrorCode,
	IAiMessage,
} from "./ai.types";
import { supabase } from "./client";

const KNOWN: readonly IAiErrorCode[] = ["limit", "not_pro", "not_configured", "busy"];

const errorCodeOf = async (error: unknown): Promise<IAiErrorCode> => {
	if (!(error instanceof FunctionsHttpError)) return "offline";
	const body = (await (error.context as Response).json().catch(() => null)) as {
		error?: string;
	} | null;
	const code = body?.error as IAiErrorCode | undefined;
	return code && KNOWN.includes(code) ? code : "busy";
};

// Pergunta ao Buddy (Edge Function pace-ai: Team Pro + limite do dia)
export async function askPaceAi(
	message: string,
	conversationId: string | null,
): Promise<IAiAnswer> {
	const { data, error } = await supabase.functions.invoke<IAiAnswer>("pace-ai", {
		body: { message, conversationId },
	});
	if (error || !data) throw new AiError(await errorCodeOf(error));
	return data;
}

// Os números reais que a PACE AI usa (resumo da semana na tela)
export async function getAiContext(): Promise<IAiContext> {
	const { data, error } = await supabase.rpc("get_ai_context");
	if (error) throw error;
	return data;
}

export async function listAiConversations(): Promise<IAiConversation[]> {
	const { data, error } = await supabase
		.from("ai_conversations")
		.select("id, title, updated_at")
		.order("updated_at", { ascending: false })
		.limit(30);
	if (error) throw error;
	return data;
}

export async function listAiMessages(conversationId: string): Promise<IAiMessage[]> {
	const { data, error } = await supabase
		.from("ai_messages")
		.select("id, role, content, created_at")
		.eq("conversation_id", conversationId)
		.order("created_at", { ascending: true });
	if (error) throw error;
	return data;
}

export async function deleteAiConversation(conversationId: string): Promise<void> {
	const { error } = await supabase.from("ai_conversations").delete().eq("id", conversationId);
	if (error) throw error;
}
