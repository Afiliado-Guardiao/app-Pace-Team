import { useCallback, useMemo, useRef, useState } from "react";
import { ScrollView } from "react-native";

import { useRouter } from "expo-router";

import { IFloatingToastData, useFloatingToast } from "@/components/pace";
import { useAiContext } from "@/lib/data";
import { useProGate } from "@/lib/pro";
import { useStore } from "@/store";
import { ROUTES } from "@/constants/routes";

import { IAiComposerModel } from "../components/AiComposer";
import { IAiHistoryModel } from "../components/AiHistorySheet";
import { DAILY_LIMIT, PACE_AI_COPY } from "../constants";
import { aiWeekView, IAiWeekView } from "../utils/aiWeek";
import { IAiBubbleItem, toBubbles } from "../utils/bubbles";

import { useAiHistoryModel } from "./useAiHistoryModel";
import { useAiSpeaker } from "./useAiSpeaker";
import { useAiVoice } from "./useAiVoice";
import { usePaceAiChat } from "./usePaceAiChat";

interface IUsePaceAiScreenReturn {
	greeting: string;
	week: IAiWeekView | null;
	messages: IAiBubbleItem[];
	isSending: boolean;
	toast: IFloatingToastData | null;
	scrollRef: React.RefObject<ScrollView | null>;
	composer: IAiComposerModel;
	// Só a voz básica no iPhone: como baixar a natural
	showVoiceTip: boolean;
	history: IAiHistoryModel;
	ask: (question: string) => void;
	openHistory: () => void;
	goBack: () => void;
	// Tem o Team Pro (sem ele, a tela é uma vitrine: enviar abre os planos)
	isPro: boolean;
}

const firstName = (name: string | null | undefined): string =>
	(name ?? "").trim().split(/\s+/)[0] ?? "";

// PACE AI: conversa com o Buddy sobre as corridas (Team Pro)
export const usePaceAiScreen = (): IUsePaceAiScreenReturn => {
	const router = useRouter();
	const { toast, showToast } = useFloatingToast();
	const gate = useProGate("ai");
	const isAllowed = gate.isPro;
	const { context, refresh } = useAiContext(isAllowed);
	const chat = usePaceAiChat(context, showToast);
	const userName = useStore((s) => s.user?.name);
	const [draft, setDraft] = useState("");
	const [isHistoryOpen, setIsHistoryOpen] = useState(false);
	const scrollRef = useRef<ScrollView | null>(null);
	const week = useMemo(() => (context ? aiWeekView(context) : null), [context]);

	const scrollToEnd = useCallback(() => {
		setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 80);
	}, []);

	const speaker = useAiSpeaker();
	const speakRef = useRef(speaker.speak);
	speakRef.current = speaker.speak;
	const ask = useCallback(
		(question: string) => {
			// Campo vazio: não faz nada (antes ia e voltava sem enviar)
			if (!question.trim()) return;
			// Sem o Pro: a pergunta fica no campo e abre a janela do Team Pro
			if (!isAllowed) {
				gate.ask();
				return;
			}
			setDraft("");
			scrollToEnd();
			void chat.send(question).then((reply) => {
				scrollToEnd();
				if (reply) speakRef.current(reply);
				else setDraft(question);
				void refresh();
			});
		},
		[chat, refresh, scrollToEnd, isAllowed, gate],
	);
	// A fala entra no campo (somando ao que já está escrito); só vai no Enviar
	const voice = useAiVoice(
		(text) => {
			setDraft((current) => (current.trim() ? `${current.trim()} ${text}` : text));
		},
		showToast,
		speaker,
	);

	const history = useAiHistoryModel({
		isAllowed,
		isOpen: isHistoryOpen,
		setIsOpen: setIsHistoryOpen,
		chat,
		onLoaded: scrollToEnd,
	});

	return {
		greeting: PACE_AI_COPY.greeting(firstName(context?.me.name ?? userName)),
		week,
		messages: toBubbles(chat.messages, speaker),
		isSending: chat.isSending,
		toast,
		scrollRef,
		composer: {
			draft: voice.isListening ? [draft.trim(), voice.heard].filter(Boolean).join(" ") : draft,
			setDraft,
			// Com o microfone ligado, o que ele ouviu ainda não está no campo:
			// envia o texto todo que aparece na tela
			submit: () => {
				const heard = voice.isListening ? voice.takeHeard() : "";
				ask([draft.trim(), heard].filter(Boolean).join(" "));
			},
			isSending: chat.isSending,
			left: chat.left,
			limit: DAILY_LIMIT,
			isListening: voice.isListening,
			isSpeakOn: speaker.isSpeakOn,
			listen: voice.listen,
			stopListening: voice.stopListening,
			toggleSpeak: speaker.toggleSpeak,
			speedLabel: speaker.speedLabel,
			cycleSpeed: speaker.cycleSpeed,
		},
		showVoiceTip: speaker.isBasicVoice && (speaker.isSpeakOn || speaker.playing !== null),
		history,
		ask,
		openHistory: () => {
			if (isAllowed) setIsHistoryOpen(true);
			else gate.ask();
		},
		isPro: isAllowed,
		goBack: () => {
			gate.leave();
			if (router.canGoBack()) router.back();
			else router.replace(ROUTES.HOME);
		},
	};
};
