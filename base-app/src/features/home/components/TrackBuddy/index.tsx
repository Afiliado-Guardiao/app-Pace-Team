import React from "react";
import { View, ViewStyle } from "react-native";

import Animated from "react-native-reanimated";

import { BUDDY_H, BUDDY_W, BuddyFigure } from "@/components/buddy";
import { ITheme, useTheme } from "@/theme";

import { IUseTrackBuddyReturn } from "../../hooks/useTrackBuddy";

interface ITrackBuddyProps {
	buddy: IUseTrackBuddyReturn;
	// Caixa do Bud na cena (px), já com a escala da tela
	box: { left: number; top: number; scale: number };
}

const BAR = { w: 7, h: 46, gap: 2 } as const;

// Verde com a vida cheia, amarelo na metade e vermelho perto de adoecer
const lifeColor = (theme: ITheme, life: number): string => {
	const { colors } = theme.pace;
	if (life > 0.6) return colors.statusSuccess;
	if (life > 0.3) return colors.statusWarning;
	return colors.statusDanger;
};

const createTrackBuddyStyles = (theme: ITheme, o: ITrackBuddyProps) => {
	const { scale } = o.box;
	return {
		root: {
			position: "absolute",
			left: o.box.left,
			top: o.box.top,
			width: BUDDY_W * scale,
			height: BUDDY_H * scale,
			transformOrigin: "50% 100%",
		} as ViewStyle,
		figure: {
			position: "absolute",
			left: 0,
			top: 0,
			width: BUDDY_W,
			height: BUDDY_H,
			transformOrigin: "0 0",
			transform: [{ scale }],
		} as ViewStyle,
		// Barrinha de vida em pé, à esquerda do Bud
		bar: {
			position: "absolute",
			left: 4 * scale,
			top: 50 * scale,
			width: BAR.w * scale,
			height: BAR.h * scale,
			borderRadius: (BAR.w * scale) / 2,
			padding: BAR.gap * scale,
			justifyContent: "flex-end",
			backgroundColor: "rgba(0,0,0,.55)",
			borderWidth: 0.5,
			borderColor: "rgba(255,255,255,.4)",
		} as ViewStyle,
		fill: {
			width: "100%",
			height: `${String(Math.round(Math.max(0.06, o.buddy.life) * 100))}%`,
			borderRadius: (BAR.w * scale) / 2,
			backgroundColor: lifeColor(theme, o.buddy.life),
		} as ViewStyle,
	};
};

// Novo Bud sentado na pista do Início (no lugar do Buddy de pelúcia), com a
// barrinha de vida do lado esquerdo
export const TrackBuddy: React.FC<ITrackBuddyProps> = (props) => {
	const { theme } = useTheme();
	const styles = createTrackBuddyStyles(theme, props);
	const { buddy } = props;

	return (
		<Animated.View style={[styles.root, buddy.hopStyle]} pointerEvents="none" testID="track-buddy">
			<View style={styles.figure}>
				<BuddyFigure
					pose={buddy.pose}
					color={buddy.look.color}
					accessories={buddy.look.accessories}
					effect={buddy.look.effect}
				/>
			</View>
			<View style={styles.bar}>
				<View style={styles.fill} />
			</View>
		</Animated.View>
	);
};
