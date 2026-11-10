import { useCallback, useRef, useState } from "react";

import { IBuddyPose } from "@/components/buddy";
import { IBuddyAccessoryId, IBuddySlot } from "@/lib/buddy/constants";

// Ordem em que os acessórios caem (o do mesmo lugar sai voando)
const DROPS: readonly { id: IBuddyAccessoryId; slot: IBuddySlot }[] = [
	{ id: "faixa", slot: "head" },
	{ id: "oculos", slot: "eyes" },
	{ id: "grau", slot: "eyes" },
	{ id: "bone", slot: "head" },
	{ id: "aureola", slot: "head" },
	{ id: "capa", slot: "back" },
];

const RUNNING: IBuddyPose = { act: "idle", phase: "ring", blink: false, gx: 0, gy: 0 };
const STANDING: IBuddyPose = { act: "idle", phase: null, blink: false, gx: 0, gy: 0 };

interface IUseSplashBuddyReturn {
	pose: IBuddyPose;
	accessories: IBuddyAccessoryId[];
	dropId: IBuddyAccessoryId | null;
	// Quantos acessórios já caíram (a saída espera pelo menos 1)
	drops: React.RefObject<number>;
	stand: () => void;
	dropNext: () => void;
	run: () => void;
}

// O Bud da abertura: corre com o anel, para e vai vestindo os acessórios
// em sequência (e recomeça a lista se o app ainda estiver carregando).
export const useSplashBuddy = (): IUseSplashBuddyReturn => {
	const [pose, setPose] = useState<IBuddyPose>(RUNNING);
	const [worn, setWorn] = useState<Partial<Record<IBuddySlot, IBuddyAccessoryId>>>({});
	const [dropId, setDropId] = useState<IBuddyAccessoryId | null>(null);
	const drops = useRef(0);

	const dropNext = useCallback(() => {
		const index = drops.current % DROPS.length;
		const next = DROPS[index];
		drops.current += 1;
		setWorn((current) =>
			index === 0 ? { [next.slot]: next.id } : { ...current, [next.slot]: next.id },
		);
		setDropId(next.id);
	}, []);

	return {
		pose,
		accessories: Object.values(worn),
		dropId,
		drops,
		stand: () => {
			setPose(STANDING);
		},
		dropNext,
		run: () => {
			setPose(RUNNING);
		},
	};
};
