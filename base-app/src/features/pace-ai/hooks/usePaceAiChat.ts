import { useCallback, useState } from "react";

import { useQueryClient } from "@tanstack/react-query";

import { IFloatingToastData } from "@/components/pace";
import { DATA_KEYS } from "@/lib/data";
import { AiError, askPaceAi, IAiAnswer, IAiContext, IAiMessage } from "@/lib/supabase";
import { IS_PREVIEW } from "@/constants/preview";

import { AI_ERRORS, DAILY_LIMIT, MAX_QUESTION } from "../constants";
import { aiWeekView } from "../utils/aiWeek";

export interface IChatMessage {
	id: string;
	role: "user" | "assistant";
	content: string;
}

interface IUsePaceAiChatReturn {
	messages: IChatMessage[];
	conversationId: string | null;
	isSending: boolean;
	left: number;
	send: (text: string) => Promise<string | null>;
	open: (id: string, history: IAiMessage[]) => void;
	reset: () => void;
}

let seq = 0;
const nextId = (): string => {
	seq += 1;
	return `local-${String(seq)}`;
};

// Prévia por link: não chama a IA, mostra como a resposta aparece
const previewAnswer = (context: IAiContext | null): IAiAnswer => {
	const week = context ? aiWeekView(context) : null;
	const numbers = week
		? `Nesta semana você já correu ${String(week.km).replace(".", ",")} km em ${String(week.runs)} corridas.`
		: "";
	return {
		conversationId: "preview",
		reply:
			`Isto é uma prévia. No app, eu respondo com as suas corridas de verdade. ${numbers}`.trim(),
		left: DAILY_LIMIT - 3,
		limit: DAILY_LIMIT,
	};
};

// Conversa com a PACE AI: manda a pergunta, mostra na hora e guarda a resposta
export const usePaceAiChat = (
	context: IAiContext | null,
	showToast: (t: IFloatingToastData) => void,
): IUsePaceAiChatReturn => {
	const queryClient = useQueryClient();
	const [messages, setMessages] = useState<IChatMessage[]>([]);
	const [conversationId, setConversationId] = useState<string | null>(null);
	const [isSending, setIsSending] = useState(false);
	const [answered, setAnswered] = useState<number | null>(null);
	const left = answered ?? Math.max(0, DAILY_LIMIT - (context?.questionsToday ?? 0));

	const send = useCallback(
		async (text: string): Promise<string | null> => {
			const question = text.trim().slice(0, MAX_QUESTION);
			if (!question || isSending) return null;
			setMessages((list) => [...list, { id: nextId(), role: "user", content: question }]);
			setIsSending(true);
			try {
				const answer = IS_PREVIEW
					? previewAnswer(context)
					: await askPaceAi(question, conversationId);
				setConversationId(answer.conversationId);
				setAnswered(answer.left);
				setMessages((list) => [
					...list,
					{ id: nextId(), role: "assistant", content: answer.reply },
				]);
				void queryClient.invalidateQueries({ queryKey: DATA_KEYS.aiConversations });
				return answer.reply;
			} catch (error) {
				const code = error instanceof AiError ? error.code : "offline";
				if (code === "limit") setAnswered(0);
				showToast({ tone: "danger", ...AI_ERRORS[code] });
				// A pergunta volta para o campo: tira o balão que não teve resposta
				setMessages((list) => list.slice(0, -1));
				return null;
			} finally {
				setIsSending(false);
			}
		},
		[context, conversationId, isSending, queryClient, showToast],
	);

	return {
		messages,
		conversationId,
		isSending,
		left,
		send,
		open: (id, history) => {
			setConversationId(id);
			setMessages(history.map((m) => ({ id: m.id, role: m.role, content: m.content })));
		},
		reset: () => {
			setConversationId(null);
			setMessages([]);
		},
	};
};
