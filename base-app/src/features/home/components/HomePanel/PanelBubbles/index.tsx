import React from "react";
import { Pressable, View } from "react-native";

import Animated from "react-native-reanimated";

import { BuddyFigure, IBuddyPose } from "@/components/buddy";
import { Icon, useEntrance } from "@/components/pace";
import { useTheme } from "@/theme";
import { IBuddyColorId } from "@/lib/buddy";

import { IPanelSection } from "../constants";
import { useBubbleStyle } from "../hooks/useBubbleStyle";
import { IPanelPager } from "../hooks/usePanelPager";

import { BubbleGlass } from "./BubbleGlass";
import { BUBBLE_ICON, createPanelBubblesStyles } from "./styles";

interface IPanelBubblesProps {
	sections: readonly IPanelSection[];
	pager: IPanelPager;
	budColor: IBuddyColorId;
}

interface IBubbleProps {
	section: IPanelSection;
	i: number;
	pager: IPanelPager;
	budColor: IBuddyColorId;
}

const POSE: IBuddyPose = { act: "idle", phase: null, blink: false, gx: 0, gy: 0 };
const NO_ACCESSORIES = [] as const;
// Bolinhas longe demais (quase invisíveis) não recebem toque
const TOUCH_RANGE = 3;

const Bubble: React.FC<IBubbleProps> = ({ section, i, pager, budColor }) => {
	const { theme } = useTheme();
	const styles = createPanelBubblesStyles(theme);
	const spot = useBubbleStyle(pager.pos, { index: i, centerX: pager.width / 2 });
	const isOn = i === pager.index;
	const isTouchable = Math.abs(i - pager.index) <= TOUCH_RANGE;

	return (
		<Animated.View style={[styles.bubble, spot]} pointerEvents={isTouchable ? "auto" : "none"}>
			<Pressable
				style={[styles.glass, isOn && styles.glassOn]}
				onPress={pager.guard(() => {
					pager.goTo(i);
				})}
				accessibilityRole="button"
				accessibilityLabel={section.label}
				accessibilityState={{ selected: isOn }}
				testID={`home-panel-bubble-${section.id}`}
			>
				<BubbleGlass />
				{section.icon ? (
					<View style={styles.icon}>
						<Icon name={section.icon} size={BUBBLE_ICON} strokeWidth={2.3} />
					</View>
				) : (
					<View style={styles.bud} pointerEvents="none">
						<BuddyFigure pose={POSE} color={budColor} accessories={NO_ACCESSORIES} />
					</View>
				)}
			</Pressable>
		</Animated.View>
	);
};

// O rótulo da seção ativa aparece com um pop a cada troca
const ActiveLabel: React.FC<{ text: string }> = ({ text }) => {
	const { theme } = useTheme();
	const styles = createPanelBubblesStyles(theme);
	const pop = useEntrance("pop");
	return (
		<Animated.Text style={[styles.label, pop]} pointerEvents="none">
			{text}
		</Animated.Text>
	);
};

// Fileira de bolinhas de vidro (atalhos) no topo do card, em lente olho-de-peixe
export const PanelBubbles: React.FC<IPanelBubblesProps> = ({ sections, pager, budColor }) => {
	const { theme } = useTheme();
	const styles = createPanelBubblesStyles(theme);
	const label = sections[pager.index]?.label ?? "";

	return (
		<View style={styles.row}>
			{pager.width > 0
				? sections.map((s, i) => (
						<Bubble key={s.id} section={s} i={i} pager={pager} budColor={budColor} />
					))
				: null}
			<ActiveLabel key={pager.index} text={label} />
		</View>
	);
};
