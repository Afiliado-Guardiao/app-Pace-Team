import React from "react";
import { Text, useWindowDimensions, View } from "react-native";

import Animated, { FadeIn, ZoomIn } from "react-native-reanimated";
import Svg, { Path } from "react-native-svg";

import { BuddyFigure, IBuddyPose } from "@/components/buddy";
import { Icon } from "@/components/pace";
import { useTheme } from "@/theme";

import { SETUP_COPY as C } from "../../constants";
import { useDrawProgress } from "../../hooks/useDrawProgress";
import { useTrophyGlow } from "../../hooks/useTrophyGlow";

import { ROUTE_BOX, ROUTE_LENGTH, ROUTE_PATH, ROUTE_TEXT as T, STOPS } from "./geometry";
import { createPlanRouteStyles } from "./styles";

const DRAW_MS = 2800;
const DRAW_DELAY = 600;
const IDLE: IBuddyPose = { act: "idle", phase: null, blink: false, gx: 0, gy: 0 };
const NO_ACCESSORIES = [] as const;
const POP = ZoomIn.springify().damping(11);
const SHOW = FadeIn.duration(450);

// O caminho de tudo que o app oferece (igual ao rascunho do dono do app): a
// linha vai sendo feita de cima para baixo, cada parada aparece quando a
// linha chega nela e, no fim, o troféu pula e fica brilhando
export const PlanRoute: React.FC = () => {
	const { theme } = useTheme();
	const { width } = useWindowDimensions();
	const s = width / ROUTE_BOX.w;
	const styles = createPlanRouteStyles(theme, s);
	const { colors } = styles;
	const t = useDrawProgress(DRAW_MS, DRAW_DELAY);
	const trophy = useTrophyGlow(t >= 1);
	const offset = ROUTE_LENGTH * (1 - t);
	const [team, bud, trend] = C.planSteps;
	const dash = {
		strokeDasharray: `${String(ROUTE_LENGTH)} ${String(ROUTE_LENGTH)}`,
		strokeDashoffset: offset,
	};

	return (
		<View style={styles.root}>
			<Text style={styles.title}>{C.planTitle}</Text>
			<Svg
				width={ROUTE_BOX.w * s}
				height={ROUTE_BOX.h * s}
				viewBox={`0 0 ${String(ROUTE_BOX.w)} ${String(ROUTE_BOX.h)}`}
				style={styles.svg}
			>
				<Path
					d={ROUTE_PATH}
					stroke={colors.crewRouteGlow}
					strokeWidth={14}
					strokeLinecap="round"
					fill="none"
					{...dash}
				/>
				<Path
					d={ROUTE_PATH}
					stroke={colors.crewRoute}
					strokeWidth={5}
					strokeLinecap="round"
					fill="none"
					{...dash}
				/>
			</Svg>
			{t >= STOPS.team.at ? (
				<>
					<Animated.View entering={POP} style={styles.team}>
						<Icon name="users" size={30 * s} color={colors.bgSunken} />
					</Animated.View>
					<Animated.View
						entering={SHOW}
						style={[styles.label, { left: T.team.x * s, top: T.team.y * s }]}
					>
						<Text style={styles.strong}>{team.title}</Text>
						<Text style={styles.soft}>{team.text}</Text>
					</Animated.View>
				</>
			) : null}
			{t >= STOPS.bud.at ? (
				<>
					<Animated.View entering={POP} style={styles.bud}>
						<View style={styles.budInner}>
							<BuddyFigure pose={IDLE} color="branco" accessories={NO_ACCESSORIES} />
						</View>
					</Animated.View>
					<Animated.View
						entering={SHOW}
						style={[styles.label, { left: T.bud.x * s, top: T.bud.y * s }]}
					>
						<Text style={styles.strongWhite}>{bud.title}</Text>
						<Text style={styles.soft}>{bud.text}</Text>
					</Animated.View>
				</>
			) : null}
			{t >= STOPS.trend.at ? (
				<>
					<Animated.View entering={POP} style={styles.trend}>
						<Icon name="trending-up" size={22 * s} color={colors.bgSunken} />
					</Animated.View>
					<Animated.View
						entering={SHOW}
						style={[styles.label, { right: (ROUTE_BOX.w - T.trend.right) * s, top: T.trend.y * s }]}
					>
						<Text style={[styles.strong, styles.right]}>{trend.title}</Text>
						<Text style={[styles.soft, styles.right]}>{trend.text}</Text>
					</Animated.View>
				</>
			) : null}
			<Animated.View style={[styles.glow, trophy.glowStyle]} />
			<Animated.View style={[styles.prize, trophy.popStyle]}>
				<Icon name="trophy" size={28 * s} color={colors.bgSunken} />
			</Animated.View>
		</View>
	);
};
