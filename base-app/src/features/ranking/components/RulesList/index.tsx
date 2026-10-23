import React from "react";
import { Text, View } from "react-native";

import { Icon } from "@/components/pace";
import { ITheme, useTheme } from "@/theme";

import { RANKING_RULES } from "../../constants";

const createRulesListStyles = (theme: ITheme) => {
	const { colors, spacing, typography } = theme.pace;
	return {
		list: { gap: spacing[3], marginTop: spacing[1] },
		row: { flexDirection: "row" as const, gap: spacing[3], alignItems: "flex-start" as const },
		icon: { marginTop: 1 },
		text: {
			flex: 1,
			fontFamily: typography.fonts.medium,
			fontSize: typography.sizes.ui,
			lineHeight: typography.sizes.ui * typography.lineHeights.body,
			color: colors.textSecondary,
		},
	};
};

// Regras de pontuação dentro da folha "Como pontuamos".
export const RulesList: React.FC = () => {
	const { theme } = useTheme();
	const styles = createRulesListStyles(theme);

	return (
		<View style={styles.list}>
			{RANKING_RULES.map((rule) => (
				<View key={rule.text} style={styles.row}>
					<Icon
						name={rule.icon}
						size={18}
						color={theme.pace.colors.orange[400]}
						style={styles.icon}
					/>
					<Text style={styles.text}>{rule.text}</Text>
				</View>
			))}
		</View>
	);
};
