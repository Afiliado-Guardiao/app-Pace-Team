import React from "react";
import { Text, useWindowDimensions, View } from "react-native";

import Animated from "react-native-reanimated";
import Svg, {
	Circle,
	ClipPath,
	Defs,
	G,
	Line,
	LinearGradient,
	Path,
	Rect,
	Stop,
} from "react-native-svg";

import { Icon, useSvgId } from "@/components/pace";
import { useTheme } from "@/theme";

import { SETUP_COPY as C } from "../../constants";
import { useDrawProgress } from "../../hooks/useDrawProgress";
import { useTrophyGlow } from "../../hooks/useTrophyGlow";

import {
	BASE_Y,
	END_WITHOUT,
	REVEAL,
	RISE,
	START,
	WITH_AREA,
	WITH_PATH,
	WITHOUT_PATH,
} from "./geometry";
import { createRiseChartStyles } from "./styles";

const DRAW_MS = 2200;
const DRAW_DELAY = 700;

// O gráfico da evolução (igual ao rascunho do dono do app): a linha rosa
// sobe do dia 1 até o troféu, a tracejada (sem apoio) anda e cai. As duas vão
// sendo desenhadas juntas e, no fim, o troféu pula e fica brilhando
export const RiseChart: React.FC = () => {
	const { theme } = useTheme();
	const { width } = useWindowDimensions();
	const s = width / RISE.w;
	const styles = createRiseChartStyles(theme, s);
	const { colors } = styles;
	const t = useDrawProgress(DRAW_MS, DRAW_DELAY);
	const trophy = useTrophyGlow(t >= 1);
	const clip = useSvgId("rise-clip");
	const fade = useSvgId("rise-fade");
	const shown = REVEAL.from + (REVEAL.to - REVEAL.from) * t;

	return (
		<View style={styles.root}>
			<Text style={styles.title}>{C.boostTitle}</Text>
			<Text style={styles.sub}>{C.boostCardTitle}</Text>
			<Text style={styles.dayOne}>{C.boostDayOne}</Text>
			<Text style={styles.monthTwo}>{C.boostMonthTwo}</Text>
			<Text style={styles.axis}>{C.boostAxis}</Text>
			<Svg
				width={RISE.w * s}
				height={RISE.h * s}
				viewBox={`0 0 ${String(RISE.w)} ${String(RISE.h)}`}
				style={styles.svg}
			>
				<Defs>
					<ClipPath id={clip}>
						<Rect width={shown} height={RISE.h} />
					</ClipPath>
					<LinearGradient id={fade} x1="0" y1="0" x2="0" y2="1">
						<Stop offset="0" stopColor={colors.evolutionArea} stopOpacity={1} />
						<Stop offset="1" stopColor={colors.evolutionArea} stopOpacity={0} />
					</LinearGradient>
				</Defs>
				<Line x1={30} y1={BASE_Y} x2={560} y2={BASE_Y} stroke={colors.barTrack} strokeWidth={2} />
				<G clipPath={`url(#${clip})`}>
					<Path d={WITH_AREA} fill={`url(#${fade})`} />
					<Path
						d={WITHOUT_PATH}
						stroke={colors.textMuted}
						strokeWidth={4}
						strokeDasharray="12 10"
						strokeLinecap="round"
						fill="none"
					/>
					<Circle
						cx={END_WITHOUT.x}
						cy={END_WITHOUT.y}
						r={8}
						fill={colors.bgSunken}
						stroke={colors.textMuted}
						strokeWidth={3}
					/>
					<Path
						d={WITH_PATH}
						stroke={colors.evolutionLineGlow}
						strokeWidth={12}
						strokeLinecap="round"
						fill="none"
					/>
					<Path
						d={WITH_PATH}
						stroke={colors.evolutionLine}
						strokeWidth={4.5}
						strokeLinecap="round"
						fill="none"
					/>
				</G>
				<Circle
					cx={START.x}
					cy={START.y}
					r={10}
					fill={colors.bgSunken}
					stroke={colors.textPrimary}
					strokeWidth={4}
				/>
			</Svg>
			<Animated.View style={[styles.glow, trophy.glowStyle]} />
			<Animated.View style={[styles.trophy, trophy.popStyle]}>
				<Icon name="trophy" size={20 * s} color={colors.bgSunken} />
			</Animated.View>
			<Text style={styles.legend}>{C.boostWith}</Text>
			<Text style={styles.legendMuted}>{`— — ${C.boostWithout}`}</Text>
			<Text style={styles.note}>{C.boostNote}</Text>
		</View>
	);
};
