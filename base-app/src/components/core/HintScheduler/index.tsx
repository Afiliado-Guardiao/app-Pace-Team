import { useHintScheduler } from "@/lib/hints";

import { useSplashDone } from "../BootSplash/splashState";

// Liga as dicas da primeira vez (uma por vez) depois que a abertura sai
export const HintScheduler: React.FC = () => {
	useHintScheduler(useSplashDone());
	return null;
};
