import { useBuddyAppEvents } from "./useBuddyAppEvents";
import { useBuddyProfileSync } from "./useBuddyProfileSync";
import { useBuddySync } from "./useBuddySync";

// Pace Buddy fora do app: estado do widget/atalho, perfil no servidor e o que
// aconteceu fora do app. Montado uma vez na área logada.
export const useBuddyBridge = (): void => {
	useBuddySync();
	useBuddyProfileSync();
	useBuddyAppEvents();
};
