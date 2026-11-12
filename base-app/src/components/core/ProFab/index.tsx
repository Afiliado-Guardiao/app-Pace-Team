import React from "react";
import { Pressable, Text, View } from "react-native";

import Animated from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { BuddyFigure, IBuddyPose } from "@/components/buddy";
import { GradientLayers, Icon } from "@/components/pace";
import { useTheme } from "@/theme";

import { PRO_FAB_COPY, PRO_FAB_ITEMS } from "./constants";
import { useFabDrag } from "./hooks/useFabDrag";
import { useProFab } from "./hooks/useProFab";
import { createProFabStyles, PRO_FAB_SIZE } from "./styles";

const NO_ACCESSORIES = [] as const;
const POSE: IBuddyPose = { act: "idle", phase: null, blink: false, gx: 0, gy: 0 };
const ICON = 17;

// PACE TEAM PRO: botão laranja com o Buddy, solto (arrasta com o dedo e gruda
// na borda). Toque abre PACE AI, BUDDY STUDIO e TEAM ANALYTICS; tocar fora (ou
// de novo no Buddy) fecha.
export const ProFab: React.FC = () => {
	const { theme } = useTheme();
	const insets = useSafeAreaInsets();
	const fab = useProFab();
	const drag = useFabDrag();
	const styles = createProFabStyles(theme, insets.bottom, drag.isLeft);

	if (fab.isHidden) return null;

	return (
		<>
			{fab.isOpen ? (
				<Animated.View style={[styles.backdrop, fab.backdropStyle]}>
					<Pressable
						style={styles.backdrop}
						onPress={fab.close}
						accessibilityRole="button"
						accessibilityLabel={PRO_FAB_COPY.close}
						testID="pro-fab-backdrop"
					/>
				</Animated.View>
			) : null}
			<Animated.View
				style={[styles.root, drag.dragStyle]}
				pointerEvents="box-none"
				{...drag.handlers}
			>
				{fab.isOpen ? (
					<View style={styles.menu}>
						{PRO_FAB_ITEMS.map((item, index) => (
							<Animated.View key={item.id} style={fab.itemStyles[index]}>
								<Pressable
									style={styles.item}
									onPress={() => {
										fab.open(item.id);
									}}
									accessibilityRole="button"
									accessibilityLabel={item.label}
									testID={`pro-fab-${item.id}`}
								>
									<View style={styles.itemDot}>
										<Icon name={item.icon} size={ICON} color={styles.iconColor} />
									</View>
									<Text style={styles.itemText}>{item.label}</Text>
								</Pressable>
							</Animated.View>
						))}
					</View>
				) : null}
				<Animated.View style={fab.fabStyle}>
					<Pressable
						style={styles.fab}
						onPress={fab.toggle}
						accessibilityRole="button"
						accessibilityLabel={fab.isOpen ? PRO_FAB_COPY.close : PRO_FAB_COPY.open}
						testID="pro-fab"
					>
						<GradientLayers
							layers={theme.pace.gradients.accent}
							width={PRO_FAB_SIZE}
							height={PRO_FAB_SIZE}
						/>
						<View style={styles.figure} pointerEvents="none">
							<BuddyFigure pose={POSE} color="branco" accessories={NO_ACCESSORIES} />
						</View>
					</Pressable>
				</Animated.View>
			</Animated.View>
		</>
	);
};
