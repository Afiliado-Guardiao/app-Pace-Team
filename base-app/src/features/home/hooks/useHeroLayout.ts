import { useCallback, useState } from "react";
import { LayoutChangeEvent, useWindowDimensions } from "react-native";

import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useTheme } from "@/theme";

import { HERO, heroFrame } from "../components/WeekHero/layout";
import { IHeroFrame } from "../components/WeekHero/scene/types";

export interface IHeroLayout {
	width: number;
	frame: IHeroFrame;
	// Do topo da tela até o bloco (as camadas sobem até a borda da tela)
	heroY: number;
	// Topo do fundo do ScreenScroll em relação ao topo da tela
	backdropTop: number;
	onHeaderLayout: (e: LayoutChangeEvent) => void;
	onToastLayout: (e: LayoutChangeEvent) => void;
	onHeroLayout: (e: LayoutChangeEvent) => void;
}

const heightOf = (e: LayoutChangeEvent): number => e.nativeEvent.layout.height;

// Onde o bloco "Sua semana" fica na tela: altura do cabeçalho e do aviso de
// notificações (quando aparece) acima dele
export const useHeroLayout = (hasToast: boolean): IHeroLayout => {
	const { theme } = useTheme();
	const insets = useSafeAreaInsets();
	const screen = useWindowDimensions();
	const [headerH, setHeaderH] = useState(0);
	const [toastH, setToastH] = useState(0);
	const [size, setSize] = useState({ width: 0, height: 0 });

	const onHeaderLayout = useCallback((e: LayoutChangeEvent) => {
		setHeaderH(heightOf(e));
	}, []);
	const onToastLayout = useCallback((e: LayoutChangeEvent) => {
		setToastH(heightOf(e));
	}, []);
	const onHeroLayout = useCallback((e: LayoutChangeEvent) => {
		const { width, height } = e.nativeEvent.layout;
		setSize((s) => (s.width === width && s.height === height ? s : { width, height }));
	}, []);

	const gap = theme.pace.spacing.stackGap;
	const backdropTop = insets.top + HERO.scrollTop;
	const heroY = backdropTop + headerH + gap + (hasToast ? toastH + gap : 0);
	const frame = heroFrame({
		heroY,
		width: size.width,
		height: size.height,
		screenWidth: screen.width,
	});

	return {
		width: size.width,
		frame,
		heroY,
		backdropTop,
		onHeaderLayout,
		onToastLayout,
		onHeroLayout,
	};
};
