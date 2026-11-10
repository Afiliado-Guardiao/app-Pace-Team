import { useState } from "react";

import * as Haptics from "expo-haptics";

import { BUDDY_CROWN, IBuddyAccessoryId } from "@/lib/buddy/constants";
import { useBuddyStore } from "@/lib/buddy/store";

import { SETUP_ACCESSORIES } from "../constants";

interface IUseStepAccReturn {
	selected: IBuddyAccessoryId;
	selectedName: string;
	// Muda a cada escolha: o acessório "cai" na cabeça de novo
	dropKey: number;
	// Tocou na coroa: a frase de baixo pisca em dourado
	crownFlash: number;
	pick: (id: IBuddyAccessoryId) => void;
	confirm: () => void;
}

// 3a · escolher o primeiro acessório (presente). A coroa não equipa.
export const useStepAcc = (onDone: () => void): IUseStepAccReturn => {
	const giveGift = useBuddyStore((s) => s.giveGift);
	const [selected, setSelected] = useState<IBuddyAccessoryId>("oculos");
	const [dropKey, setDropKey] = useState(1);
	const [crownFlash, setCrownFlash] = useState(0);

	return {
		selected,
		selectedName: SETUP_ACCESSORIES.find((a) => a.id === selected)?.name ?? "",
		dropKey,
		crownFlash,
		pick: (id) => {
			if (id === BUDDY_CROWN) {
				void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning).catch(
					() => undefined,
				);
				setCrownFlash((n) => n + 1);
				return;
			}
			void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => undefined);
			setSelected(id);
			setDropKey((n) => n + 1);
		},
		confirm: () => {
			giveGift(selected);
			onDone();
		},
	};
};
