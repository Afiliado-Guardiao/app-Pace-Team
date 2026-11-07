import React from "react";
import { Text, View } from "react-native";

import { Chip, Icon, SegmentedControl } from "@/components/pace";
import { useTheme } from "@/theme";

import { RANKING_SCOPES } from "../../constants";

interface IRankingFiltersProps {
	scope: string;
	onScope: (value: string) => void;
	categories: readonly string[];
	category: string;
	onCategory: (value: string) => void;
	city: string;
}

// Escopo (Cidade, Região, Estado, País), categoria (tamanho da equipe) e a
// cidade — iguais no mapa e na lista
export const RankingFilters: React.FC<IRankingFiltersProps> = ({
	scope,
	onScope,
	categories,
	category,
	onCategory,
	city,
}) => {
	const { theme } = useTheme();
	const { colors, spacing, typography } = theme.pace;

	return (
		<View style={{ gap: spacing[2.5] }}>
			<SegmentedControl
				size="sm"
				options={RANKING_SCOPES}
				value={scope}
				onChange={onScope}
				testID="ranking-scope"
			/>
			<View
				style={{
					flexDirection: "row",
					flexWrap: "wrap",
					rowGap: spacing[2],
					gap: spacing[2],
					alignItems: "center",
				}}
			>
				{categories.map((v) => (
					<Chip
						key={v}
						size="sm"
						selected={category === v}
						onPress={() => {
							onCategory(v);
						}}
						testID={`ranking-category-${v}`}
					>
						{`${v} x ${v}`}
					</Chip>
				))}
				<View style={{ marginLeft: "auto", flexDirection: "row", alignItems: "center", gap: 6 }}>
					<Icon name="map-pin" size={14} color={colors.textSecondary} />
					<Text
						style={{
							fontFamily: typography.fonts.semibold,
							fontSize: typography.sizes.label,
							color: colors.textSecondary,
						}}
					>
						{city}
					</Text>
				</View>
			</View>
		</View>
	);
};
