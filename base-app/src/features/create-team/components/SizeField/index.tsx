import React from "react";
import { Text, View } from "react-native";

import { Chip, Select } from "@/components/pace";
import { ITheme, useTheme } from "@/theme";

import { CREATE_TEAM_COPY, OTHER_SIZE_OPTIONS, SIZE_OPTIONS } from "../../constants";
import { IUseTeamSizeReturn } from "../../hooks/useTeamSize";

interface ISizeFieldProps {
	field: IUseTeamSizeReturn;
}

const createSizeFieldStyles = (theme: ITheme) => {
	const { colors, spacing, typography } = theme.pace;
	return {
		root: { gap: spacing[3] },
		label: {
			fontFamily: typography.fonts.semibold,
			fontSize: typography.sizes.label,
			color: colors.textSecondary,
		},
		chips: { flexDirection: "row" as const, flexWrap: "wrap" as const, gap: 8 },
	};
};

const sizeLabel = (value: string): string =>
	value === "2" ? `${CREATE_TEAM_COPY.duo} (2)` : `${value}${CREATE_TEAM_COPY.members}`;

// Categoria da equipe. Em "Outra", aparece a lista com todos os tamanhos.
export const SizeField: React.FC<ISizeFieldProps> = ({ field }) => {
	const { theme } = useTheme();
	const styles = createSizeFieldStyles(theme);

	return (
		<View style={styles.root}>
			<Text style={styles.label}>{CREATE_TEAM_COPY.category}</Text>
			<View style={styles.chips}>
				{SIZE_OPTIONS.map((v) => (
					<Chip
						key={v}
						selected={!field.isOther && field.size === v}
						onPress={() => {
							field.pick(v);
						}}
						testID={`create-team-size-${v}`}
					>
						{sizeLabel(v)}
					</Chip>
				))}
				<Chip selected={field.isOther} onPress={field.pickOther} testID="create-team-size-other">
					{CREATE_TEAM_COPY.otherSize}
				</Chip>
			</View>
			{field.isOther ? (
				<Select
					label={CREATE_TEAM_COPY.otherSizeLabel}
					icon="users"
					options={OTHER_SIZE_OPTIONS}
					value={field.size}
					onChange={field.setOtherSize}
					testID="create-team-size-list"
				/>
			) : null}
		</View>
	);
};
