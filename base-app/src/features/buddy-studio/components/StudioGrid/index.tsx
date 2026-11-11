import React from "react";
import { Pressable, Text, View } from "react-native";

import { MiniBuddy } from "@/components/buddy";
import { Icon } from "@/components/pace";
import { ITheme, useTheme } from "@/theme";

import { STUDIO_COPY as C } from "../../constants";
import { IStudioItem } from "../../hooks/useBuddyStudio";

interface IStudioGridProps {
	items: IStudioItem[];
}

const EFFECT_ICON: Record<string, string> = {
	tontura: "orbit",
	coracoes: "heart",
	notas: "headphones",
	fogo: "flame",
	chuva: "cloud-rain",
	raios: "zap",
	faiscas: "sparkles",
	estrelas: "star",
	aura: "sun",
};

const createStudioGridStyles = (theme: ITheme) => {
	const { colors, spacing, typography } = theme.pace;
	return {
		grid: { flexDirection: "row" as const, flexWrap: "wrap" as const, gap: spacing[2] },
		cell: {
			width: "31.5%" as const,
			alignItems: "center" as const,
			gap: 4,
			paddingTop: spacing[2],
			paddingBottom: spacing[3],
			borderRadius: 18,
			backgroundColor: colors.glass1,
			borderWidth: 1,
			borderColor: colors.glassBorder,
		},
		selected: {
			backgroundColor: colors.accentSoft,
			borderWidth: 1.5,
			borderColor: colors.accent,
		},
		name: {
			fontFamily: typography.fonts.bold,
			fontSize: typography.sizes.xs,
			color: colors.textPrimary,
			textAlign: "center" as const,
		},
		badge: {
			position: "absolute" as const,
			top: 6,
			right: 6,
			paddingHorizontal: 6,
			paddingVertical: 2,
			borderRadius: 8,
			backgroundColor: colors.accent,
		},
		badgeText: {
			fontFamily: typography.fonts.extrabold,
			fontSize: 9,
			letterSpacing: 0.6,
			color: colors.onAccent,
		},
		fx: {
			position: "absolute" as const,
			top: 8,
			left: 8,
		},
		fxColor: colors.orange[300],
	};
};

// Itens Premium da aba: cada um mostra o Buddy já com o item
export const StudioGrid: React.FC<IStudioGridProps> = ({ items }) => {
	const { theme } = useTheme();
	const styles = createStudioGridStyles(theme);

	return (
		<View style={styles.grid}>
			{items.map((item) => (
				<Pressable
					key={item.id}
					style={[styles.cell, item.isSelected ? styles.selected : null]}
					onPress={item.pick}
					accessibilityRole="button"
					accessibilityState={{ selected: item.isSelected }}
					accessibilityLabel={item.name}
					testID={`studio-item-${item.id}`}
				>
					<MiniBuddy color={item.color} accessories={item.accessories} scale={0.5} />
					{EFFECT_ICON[item.id] ? (
						<View style={styles.fx}>
							<Icon name={EFFECT_ICON[item.id] ?? "sparkles"} size={18} color={styles.fxColor} />
						</View>
					) : null}
					<Text style={styles.name} numberOfLines={1}>
						{item.name}
					</Text>
					<View style={styles.badge}>
						<Text style={styles.badgeText}>{C.pro}</Text>
					</View>
				</Pressable>
			))}
		</View>
	);
};
