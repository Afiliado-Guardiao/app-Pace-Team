import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ScrollView } from "react-native";

import { useRouter } from "expo-router";

import { IFloatingToastData, useFloatingToast } from "@/components/pace";
import { useAiContext, useAiHistory, useMyPro } from "@/lib/data";
import { useStore } from "@/store";
import { IS_PREVIEW } from "@/constants/preview";
import { ROUTES } from "@/constants/routes";

import { IAiComposerModel } from "../components/AiComposer";
import { IAiHistoryModel } from "../components/AiHistorySheet";
import { DAILY_LIMIT, PACE_AI_COPY } from "../constants";
import { aiWeekView, IAiWeekView } from "../utils/aiWeek";

import { useAiVoice } from "./useAiVoice";
import { IChatMessage, usePaceAiChat } from "./usePaceAiChat";

interface IUsePaceAiScreenReturn {
	greeting: string;
	week: IAiWeekView | null;
	messages: IChatMessage[];
	isSending: boolean;
	toast: IFloatingToastData | null;
	scrollRef: React.RefObject<ScrollView | null>;
	composer: IAiComposerModel;
	history: IAiHistoryModel;
	ask: (question: string) => void;
	openHistory: () => void;
	goBack: () => void;
}

const firstName = (name: string | null | undefined): string =>
	(name ?? "").trim().split(/\s+/)[0] ?? "";

// PACE AI: conversa com o Buddy sobre as corridas (Team Pro)
export const usePaceAiScreen = (): IUsePaceAiScreenReturn => {
	const router = useRouter();
	const { toast, showToast } = useFloatingToast();
	const { isPro, isLoading: isProLoading } = useMyPro();
	const isAllowed = IS_PREVIEW || isPro;
	const { context, refresh } = useAiContext(isAllowed);
	const historyData = useAiHistory(isAllowed);
	const chat = usePaceAiChat(context, showToast);
	const userName = useStore((s) => s.user?.name);
	const [draft, setDraft] = useState("");
	const [isHistoryOpen, setIsHistoryOpen] = useState(false);
	const scrollRef = useRef<ScrollView | null>(null);
	const week = useMemo(() => (context ? aiWeekView(context) : null), [context]);

	// Sem Team Pro, a tela de apresentação explica o recurso
	useEffect(() => {
		if (!IS_PREVIEW && !isProLoading && !isPro) {
			router.replace({ pathname: ROUTES.PRO_FEATURE, params: { id: "ai" } });
		}
	}, [isPro, isProLoading, router]);

	const scrollToEnd = useCallback(() => {
		setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 80);
	}, []);

	const voiceRef = useRef<ReturnType<typeof useAiVoice> | null>(null);
	const ask = useCallback(
		(question: string) => {
			setDraft("");
			scrollToEnd();
			void chat.send(question).then((reply) => {
				scrollToEnd();
				if (reply) voiceRef.current?.speak(reply);
				else setDraft(question);
				void refresh();
			});
		},
		[chat, refresh, scrollToEnd],
	);
	const voice = useAiVoice(ask, showToast);
	voiceRef.current = voice;

	const history: IAiHistoryModel = {
		isOpen: isHistoryOpen,
		items: historyData.conversations,
		activeId: chat.conversationId,
		close: () => {
			setIsHistoryOpen(false);
		},
		pick: (id) => {
			setIsHistoryOpen(false);
			void historyData.loadMessages(id).then((list) => {
				chat.open(id, list);
				scrollToEnd();
			});
		},
		remove: (id) => {
			historyData.remove(id);
			if (id === chat.conversationId) chat.reset();
		},
		startNew: () => {
			setIsHistoryOpen(false);
			chat.reset();
		},
	};

	return {
		greeting: PACE_AI_COPY.greeting(firstName(context?.me.name ?? userName)),
		week,
		messages: chat.messages,
		isSending: chat.isSending,
		toast,
		scrollRef,
		composer: {
			draft: voice.isListening ? voice.heard : draft,
			setDraft,
			submit: () => {
				ask(draft);
			},
			isSending: chat.isSending,
			left: chat.left,
			limit: DAILY_LIMIT,
			isListening: voice.isListening,
			isSpeakOn: voice.isSpeakOn,
			listen: voice.listen,
			stopListening: voice.stopListening,
			toggleSpeak: voice.toggleSpeak,
		},
		history,
		ask,
		openHistory: () => {
			setIsHistoryOpen(true);
		},
		goBack: () => {
			if (router.canGoBack()) router.back();
			else router.replace(ROUTES.HOME);
		},
	};
};
