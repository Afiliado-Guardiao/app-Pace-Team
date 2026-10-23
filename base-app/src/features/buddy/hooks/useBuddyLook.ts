import { IBuddyAccessoryId, IBuddyColorId } from "@/lib/buddy/constants";
import { effectiveColor, wornAccessories } from "@/lib/buddy/rules";
import { useBuddyStore } from "@/lib/buddy/store";
import { useBuddyContext } from "@/lib/buddy/useBuddyContext";

interface IUseBuddyLookReturn {
	color: IBuddyColorId;
	accessories: IBuddyAccessoryId[];
}

// Cor e acessórios que o Buddy está usando agora (só os que seguem liberados)
export const useBuddyLook = (): IUseBuddyLookReturn => {
	const ctx = useBuddyContext();
	const color = useBuddyStore((s) => s.color);
	const lastFree = useBuddyStore((s) => s.lastFree);
	const equipped = useBuddyStore((s) => s.equipped);
	const goals = useBuddyStore((s) => s.goals);

	return {
		color: effectiveColor(color, lastFree, ctx.rank),
		accessories: wornAccessories(equipped, goals, ctx),
	};
};
