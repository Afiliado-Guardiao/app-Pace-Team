import { SharedValue } from "react-native-reanimated";

import { useSceneClock } from "../components/WeekHero/hooks/useSceneClock";

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
}

// Bloco "Sua semana" do Início: clima, corredores online, posição na tela,
// relógio das animações e o pulinho do Buddy de pelúcia
export const useWeekHero = (o: { myName: string; hasToast: boolean }): IWeekHero => {
	const weather = useHeroWeather();
	const online = useHeroRunners(o.myName);
	const layout = useHeroLayout(o.hasToast);
	const clocks = useSceneClock();
	const { jump, onBuddyPress } = useBuddyJump();

	return {
		weather,
		online,
		layout,
		clocks,
		jump,
		onBuddyPress,
	};
};
