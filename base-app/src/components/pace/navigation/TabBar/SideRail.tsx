import React from "react";
import { Pressable, Text, View } from "react-native";

import Animated from "react-native-reanimated";

import { useTheme } from "@/theme";

import { Icon } from "../../core/Icon";
import { GlassSurface } from "../../primitives";

import { IDLE_STROKE, RAIL_ACTIVE_STROKE, RAIL_PADDING } from "./constants";
import { useSideRail } from "./hooks/useSideRail";
import { createSideRailStyles } from "./styles/sideRail";
import { ITabItem } from "./types";

interface ISideRailProps {
	items: readonly ITabItem[];
	active: string;
	size: number;
	onChange?: (id: string) => void;
}

// Navegação do app: trilho de vidro vertical na direita, Início → Perfil,
// com disco laranja deslizante. Toque ou arraste para trocar de aba.
export const SideRail: React.FC<ISideRailProps> = ({ items, active, size, onChange }) => {
	const { theme } = useTheme();
	const rail = useSideRail({ items, active, size, onChange });
	const styles = createSideRailStyles(theme, size);
	const { colors } = theme.pace;

	return (
		<View {...rail.panHandlers} accessibilityRole="tablist">
			<GlassSurface
				appearance={styles.railAppearance}
				radius={theme.pace.radii.pill}
				style={styles.surface}
			>
				<Animated.View style={[styles.disc, rail.discStyle]} pointerEvents="none">
					<GlassSurface appearance={styles.discAppearance} radius={size / 2} style={styles.item} />
				</Animated.View>
				{items.map((item, index) => {
					const isCurrent = index === rail.current;
					return (
						<Pressable
							key={item.id}
							testID={`pace-rail-${item.id}`}
							accessibilityRole="tab"
							accessibilityLabel={item.label}
							accessibilityState={{ selected: item.id === active }}
							onPress={() => onChange?.(item.id)}
							style={styles.item}
						>
							<Icon
								name={item.icon}
								size={styles.iconSize}
								strokeWidth={isCurrent ? RAIL_ACTIVE_STROKE : IDLE_STROKE}
								color={isCurrent ? colors.ink.white : colors.textSecondary}
							/>
						</Pressable>
					);
				})}
				{rail.previewLabel ? (
					<GlassSurface
						appearance={styles.labelAppearance}
						radius={theme.pace.radii.pill}
						style={[styles.label, { top: RAIL_PADDING + rail.labelTop }]}
					>
						<Text style={styles.labelText} numberOfLines={1}>
							{rail.previewLabel}
						</Text>
					</GlassSurface>
				) : null}
			</GlassSurface>
		</View>
	);
};
