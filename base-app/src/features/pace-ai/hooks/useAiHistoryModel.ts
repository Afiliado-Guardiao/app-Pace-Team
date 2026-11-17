import { useAiHistory } from "@/lib/data";

import { IAiHistoryModel } from "../components/AiHistorySheet";

import { usePaceAiChat } from "./usePaceAiChat";

interface IUseAiHistoryModelOptions {
	isAllowed: boolean;
	isOpen: boolean;
	setIsOpen: (isOpen: boolean) => void;
	chat: ReturnType<typeof usePaceAiChat>;
	// Conversa antiga carregada (rola até o fim)
	onLoaded: () => void;
}

// Folha "Conversas": abre uma conversa antiga, apaga ou começa uma nova
export const useAiHistoryModel = ({
	isAllowed,
	isOpen,
	setIsOpen,
	chat,
	onLoaded,
}: IUseAiHistoryModelOptions): IAiHistoryModel => {
	const historyData = useAiHistory(isAllowed);
	return {
		isOpen,
		items: historyData.conversations,
		activeId: chat.conversationId,
		close: () => {
			setIsOpen(false);
		},
		pick: (id) => {
			setIsOpen(false);
			void historyData.loadMessages(id).then((list) => {
				chat.open(id, list);
				onLoaded();
			});
		},
		remove: (id) => {
			historyData.remove(id);
			if (id === chat.conversationId) chat.reset();
		},
		startNew: () => {
			setIsOpen(false);
			chat.reset();
		},
	};
};
