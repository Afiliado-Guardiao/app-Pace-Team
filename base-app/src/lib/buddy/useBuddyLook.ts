import { useMyPro } from "@/lib/data";

import { IBuddyAccessoryId, IBuddyColorId, IBuddyEffectId } from "./constants";
import { effectiveColor, withStudio, wornAccessories } from "./rules";
import { useBuddyStore } from "./store";
import { useBuddyContext } from "./useBuddyContext";

interface IUseBuddyLookReturn {
	color: IBuddyColorId;
	accessories: IBuddyAccessoryId[];
	// Efeito do Buddy Studio (só com o Team Pro)
	effect: IBuddyEffectId | null;
}

// Cor e acessórios que o Buddy está usando agora (só os que seguem liberados).
// Com o Team Pro, o visual do Buddy Studio vai por cima; sem o Pro, volta o
// visual conquistado correndo (nada do que foi ganho se perde).
export const useBuddyLook = (): IUseBuddyLookReturn => {
	const ctx = useBuddyContext();
	const { isPro } = useMyPro();
	const color = useBuddyStore((s) => s.color);
	const lastFree = useBuddyStore((s) => s.lastFree);
	const equipped = useBuddyStore((s) => s.equipped);
	const goals = useBuddyStore((s) => s.goals);
	const studio = useBuddyStore((s) => s.studio);
	const base = {
		color: effectiveColor(color, lastFree, ctx.rank),
		accessories: wornAccessories(equipped, goals, ctx),
	};

	return isPro ? withStudio(base, studio) : { ...base, effect: null };
};
