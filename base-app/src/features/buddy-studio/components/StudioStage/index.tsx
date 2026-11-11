import React from "react";
import { Text, View } from "react-native";

import { BUDDY_H, BUDDY_W, BuddyFigure, IBuddyPose } from "@/components/buddy";
import { GradientLayers } from "@/components/pace";
import { ITheme, useTheme } from "@/theme";
import { IBuddyAccessoryId, IBuddyColorId, IBuddyEffectId } from "@/lib/buddy";

import { STUDIO_COPY as C } from "../../constants";

interface IStudioStageProps {
	look: { color: IBuddyColorId; accessories: IBuddyAccessoryId[]; effect: IBuddyEffectId | null };
}

const SCALE = 1.35;
const STAGE = 240;
const POSE: IBuddyPose = { act: "idle", phase: null, blink: false, gx: 0, gy: 0 };
const SPOT = [
	{
		type: "radial" as const,
		cx: 0.5,
		cy: 0.55,
		rx: 0.5,
		ry: 0.5,
		stops: [
			{ offset: 0, color: "rgba(253,90,12,.30)" },
			{ offset: 0.6, color: "rgba(253,90,12,.08)" },
			{ offset: 1, color: "rgba(253,90,12,0)" },
		],
	},
];

const createStudioStageStyles = (theme: ITheme) => {
	const { colors, typography } = theme.pace;
	return {
		root: { alignItems: "center" as const },
		stage: { width: STAGE, height: STAGE * 0.82, alignItems: "center" as const },
		spot: { position: "absolute" as const, top: 0, left: 0 },
		buddy: { marginTop: 18, width: BUDDY_W * SCALE, height: BUDDY_H * SCALE },
		buddyInner: {
			position: "absolute" as const,
			transform: [{ scale: SCALE }],
			transformOrigin: "0% 0%",
		},
		hint: {
			fontFamily: typography.fonts.medium,
			fontSize: typography.sizes.xs,
			color: colors.textTertiary,
			textAlign: "center" as const,
		},
	};
};

// O Buddy grande no palco, com o visual que está sendo experimentado
export const StudioStage: React.FC<IStudioStageProps> = ({ look }) => {
	const { theme } = useTheme();
	const styles = createStudioStageStyles(theme);

	return (
		<View style={styles.root}>
			<View style={styles.stage}>
				<View style={styles.spot} pointerEvents="none">
					<GradientLayers layers={SPOT} width={STAGE} height={STAGE * 0.82} />
				</View>
				<View style={styles.buddy} pointerEvents="none">
					<View style={styles.buddyInner}>
						<BuddyFigure
							pose={POSE}
							color={look.color}
							accessories={look.accessories}
							effect={look.effect}
						/>
					</View>
				</View>
			</View>
			<Text style={styles.hint}>{C.tryHint}</Text>
		</View>
	);
};
