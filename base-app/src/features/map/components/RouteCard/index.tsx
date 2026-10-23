import React from "react";
import { Pressable, Text, View } from "react-native";

import { GlassSurface, Icon, MiniRoute } from "@/components/pace";
import { ITheme, useTheme } from "@/theme";

import { ROUTE_CARD } from "../../constants";

interface IRouteCardProps {
	title: string;
	meta: string;
	seed: number;
	isSelected: boolean;
	onPress: () => void;
}

const THUMB = 52;

const createRouteCardStyles = (theme: ITheme, isSelected: boolean) => {
	const { blur, colors, typography } = theme.pace;
	return {
		pressable: { width: ROUTE_CARD.width },
		card: { flexDirection: "row" as const, alignItems: "center" as const, gap: 10, padding: 10 },
		appearance: {
			fill: { color: isSelected ? colors.routeCardOn : colors.routeCardOff },
			blur: blur.intensity.glass,
			border: isSelected ? colors.routeCardBorderOn : colors.glassBorder,
			rim: true,
			outerShadow: isSelected ? "0 10px 26px -12px rgba(253,90,12,.7)" : undefined,
		},
		thumb: {
			width: THUMB,
			height: THUMB,
			borderRadius: 14,
			overflow: "hidden" as const,
			backgroundColor: colors.glass1,
			borderWidth: 1,
			borderColor: colors.hairline,
		},
		texts: { flex: 1, minWidth: 0 },
		title: {
			fontFamily: typography.fonts.bold,
			fontSize: typography.sizes.sm,
			color: colors.textPrimary,
		},
		meta: {
			marginTop: 3,
			fontFamily: typography.fonts.medium,
			fontSize: typography.sizes.xs,
			color: colors.textTertiary,
		},
	};
};

// Cartão de rota salva no carrossel do mapa (toque de novo abre o detalhe).
export const RouteCard: React.FC<IRouteCardProps> = ({
	title,
	meta,
	seed,
	isSelected,
	onPress,
}) => {
	const { theme } = useTheme();
	const styles = createRouteCardStyles(theme, isSelected);

	return (
		<Pressable
			style={styles.pressable}
			onPress={onPress}
			accessibilityRole="button"
			accessibilityLabel={title}
			testID={`map-route-${String(seed)}`}
		>
			<GlassSurface appearance={styles.appearance} radius={22} style={styles.card}>
				<View style={styles.thumb}>
					<MiniRoute seed={seed} size={THUMB} />
				</View>
				<View style={styles.texts}>
					<Text style={styles.title} numberOfLines={1}>
						{title}
					</Text>
					<Text style={styles.meta}>{meta}</Text>
				</View>
				{isSelected ? (
					<Icon name="chevron-right" size={16} color={theme.pace.colors.textSecondary} />
				) : null}
			</GlassSurface>
		</Pressable>
	);
};
