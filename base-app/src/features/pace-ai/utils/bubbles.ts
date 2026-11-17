import { IUseAiSpeakerReturn } from "../hooks/useAiSpeaker";
import { IChatMessage } from "../hooks/usePaceAiChat";

// Balão com "Ouvir de novo" nas respostas do Buddy
export interface IAiBubbleItem extends IChatMessage {
	isPlaying: boolean;
	onListen?: () => void;
}

export const toBubbles = (
	messages: IChatMessage[],
	speaker: Pick<IUseAiSpeakerReturn, "playing" | "togglePlay">,
): IAiBubbleItem[] =>
	messages.map((m) => ({
		...m,
		isPlaying: speaker.playing === m.content,
		onListen:
			m.role === "assistant"
				? () => {
						speaker.togglePlay(m.content);
					}
				: undefined,
	}));
