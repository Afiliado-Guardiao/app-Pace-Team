import { SharedValue } from "react-native-reanimated";

import { useSceneClock } from "../components/WeekHero/hooks/useSceneClock";
import { HERO, heroScale } from "../components/WeekHero/layout";

import { useBuddyJump } from "./useBuddyJump";
import { IHeroLayout, useHeroLayout } from "./useHeroLayout";
import { IHeroRunners, useHeroRunners } from "./useHeroRunners";
import { IHeroWeather, useHeroWeather } from "./useHeroWeather";

export interface IWeekHero {
	weather: IHeroWeather;
	online: IHeroRunners;
	layout: IHeroLayout;
	clocks: { clock: SharedValue<number>; still: SharedValue<number> };
	jump: SharedValue<number>;
	onBuddyPress: () => void;
	// Chão do Buddyzinho que corre pela tela: entre o título e o medidor
	runnerFeetY: number;
}

const RUNNER_FLOOR = 40;

// Bloco "Sua semana" do Início: clima, corredores online, posição na tela,
// relógio das animações e o pulinho do Buddy de pelúcia
export const useWeekHero = (o: { myName: string; hasToast: boolean }): IWeekHero => {
	const weather = useHeroWeather();
	const online = useHeroRunners(o.myName);
	const layout = useHeroLayout(o.hasToast);
	const clocks = useSceneClock();
	const { jump, onBuddyPress } = useBuddyJump();
	const { k } = heroScale(layout.width || HERO.baseWidth);
	const heroInBackdrop = layout.heroY - layout.backdropTop;

	return {
		weather,
		online,
		layout,
		clocks,
		jump,
		onBuddyPress,
		runnerFeetY: heroInBackdrop + HERO.titleHeight + HERO.titleGap + RUNNER_FLOOR * k,
	};
};
