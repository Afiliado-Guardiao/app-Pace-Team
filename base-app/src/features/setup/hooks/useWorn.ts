import { IBuddyAccessoryId } from "@/lib/buddy/constants";
import { useBuddyStore } from "@/lib/buddy/store";

const NONE: IBuddyAccessoryId[] = [];

// O acessório ganho na 3a acompanha o Buddy em todas as telas seguintes
export const useWorn = (): IBuddyAccessoryId[] => {
	const gift = useBuddyStore((s) => s.gift);
	const equipped = useBuddyStore((s) => s.equipped);
	return gift ? equipped.filter((id) => id === gift) : NONE;
};
