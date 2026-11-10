import React from "react";
import { Text, View } from "react-native";

import { ITheme, useTheme } from "@/theme";

import { PRO_COPY } from "../../constants";

interface IProFooterProps {
	hasTrial: boolean;
	onRestore: () => void;
	onTerms: () => void;
	onPrivacy: () => void;
}

const createProFooterStyles = (theme: ITheme) => {
	const { colors, spacing, typography } = theme.pace;
	return {
		root: { gap: spacing[3], alignItems: "center" as const },
		note: {
			fontFamily: typography.fonts.semibold,
			fontSize: typography.sizes.xs,
			color: colors.textSecondary,
			textAlign: "center" as const,
		},
		legal: {
			fontFamily: typography.fonts.medium,
			fontSize: typography.sizes.micro,
			lineHeight: typography.sizes.micro * 1.5,
			color: colors.textTertiary,
			textAlign: "center" as const,
		},
		links: {
			flexDirection: "row" as const,
			flexWrap: "wrap" as const,
			justifyContent: "center" as const,
			gap: spacing[4],
		},
		link: {
			fontFamily: typography.fonts.semibold,
			fontSize: typography.sizes.xs,
			color: colors.orange[400],
		},
	};
};

// Rodapé exigido pela Apple: renovação automática, Termos, Privacidade e restaurar.
export const ProFooter: React.FC<IProFooterProps> = ({
	hasTrial,
	onRestore,
	onTerms,
	onPrivacy,
}) => {
	const { theme } = useTheme();
	const styles = createProFooterStyles(theme);

	return (
		<View style={styles.root}>
			<Text style={styles.note}>{PRO_COPY.cancelAnytime}</Text>
			<Text style={styles.legal}>
				{PRO_COPY.legal}
				{hasTrial ? PRO_COPY.trialLegal : ""}
			</Text>
			<View style={styles.links}>
				<Text
					style={styles.link}
					onPress={onRestore}
					accessibilityRole="button"
					accessibilityLabel={PRO_COPY.restore}
					testID="pro-restore"
				>
					{PRO_COPY.restore}
				</Text>
				<Text
					style={styles.link}
					onPress={onTerms}
					accessibilityRole="link"
					accessibilityLabel={PRO_COPY.terms}
					testID="pro-terms"
				>
					{PRO_COPY.terms}
				</Text>
				<Text
					style={styles.link}
					onPress={onPrivacy}
					accessibilityRole="link"
					accessibilityLabel={PRO_COPY.privacy}
					testID="pro-privacy"
				>
					{PRO_COPY.privacy}
				</Text>
			</View>
		</View>
	);
};
