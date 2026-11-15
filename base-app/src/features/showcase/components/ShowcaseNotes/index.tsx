import React from "react";
import { Image, View } from "react-native";

import Animated, { FadeIn } from "react-native-reanimated";
import Svg, { Path } from "react-native-svg";

import { BUDDY_H, BUDDY_W, BuddyFigure, IBuddyPose } from "@/components/buddy";
import { ITheme, useTheme } from "@/theme";

import {
	APP_SHOTS,
	COLLAGE_H,
	HAND_ARROWS,
	HAND_NOTES,
	IAppShot,
	SICK_BUD,
	SPARKS,
} from "../../constants";
import { usePhotoPop } from "../../hooks/usePhotoPop";

interface IShowcaseNotesProps {
	k: number;
}

const SICK: IBuddyPose = { act: "sick", phase: null, blink: false, gx: 0, gy: 0 };
const REF_W = 390;

const createShowcaseNotesStyles = (theme: ITheme, k: number) => {
	const { colors, typography } = theme.pace;
	return {
		root: { width: REF_W * k, height: COLLAGE_H * k, alignSelf: "center" as const },
		fill: { position: "absolute" as const, left: 0, top: 0 },
		note: {
			position: "absolute" as const,
			fontFamily: typography.handFonts.light,
			fontSize: 17 * k,
			lineHeight: 24 * k,
			color: colors.textPrimary,
		},
		sick: {
			position: "absolute" as const,
			left: SICK_BUD.x * k,
			top: SICK_BUD.y * k,
			width: SICK_BUD.w * k,
			height: (SICK_BUD.w * k * BUDDY_H) / BUDDY_W,
		},
		sickInner: {
			position: "absolute" as const,
			transformOrigin: "0% 0%",
			transform: [{ scale: (SICK_BUD.w * k) / BUDDY_W }],
		},
		ink: colors.textPrimary,
	};
};

// Uma tela do app inclinada, que entra com pop e balança de leve
const AppShot: React.FC<{ shot: IAppShot; index: number; k: number }> = ({ shot, index, k }) => {
	const pop = usePhotoPop(index, 0);
	const box = { left: shot.x * k, top: shot.y * k, width: shot.w * k, height: shot.h * k };
	return (
		<Animated.View style={[{ position: "absolute" }, box, pop]}>
			<Image source={shot.source} style={{ width: box.width, height: box.height }} />
		</Animated.View>
	);
};

// Topo da primeira página: telas do app, frases e setas à mão e o buddy doente
export const ShowcaseNotes: React.FC<IShowcaseNotesProps> = ({ k }) => {
	const { theme } = useTheme();
	const styles = createShowcaseNotesStyles(theme, k);

	return (
		<View style={styles.root} pointerEvents="none">
			{APP_SHOTS.map((shot, i) => (
				<AppShot key={String(shot.x)} shot={shot} index={i} k={k} />
			))}
			<Animated.View entering={FadeIn.delay(650).duration(600)} style={styles.fill}>
				<Svg
					width={REF_W * k}
					height={COLLAGE_H * k}
					viewBox={`0 0 ${String(REF_W)} ${String(COLLAGE_H)}`}
				>
					{[...HAND_ARROWS, ...SPARKS].map((d) => (
						<Path
							key={d}
							d={d}
							stroke={styles.ink}
							strokeWidth={1.6}
							fill="none"
							strokeLinecap="round"
							strokeLinejoin="round"
						/>
					))}
				</Svg>
			</Animated.View>
			{HAND_NOTES.map((n, i) => (
				<Animated.Text
					key={n.text}
					entering={FadeIn.delay(500 + i * 180).duration(500)}
					style={[styles.note, { left: n.x * k, top: n.y * k, width: n.w * k, textAlign: n.align }]}
				>
					{n.text}
				</Animated.Text>
			))}
			<Animated.View entering={FadeIn.delay(450).duration(500)} style={styles.sick}>
				<View style={styles.sickInner}>
					<BuddyFigure pose={SICK} color="branco" accessories={[]} isMini />
				</View>
			</Animated.View>
		</View>
	);
};
