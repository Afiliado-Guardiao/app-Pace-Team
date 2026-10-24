import React from "react";
import { Text, View } from "react-native";

import { ITheme, useTheme } from "@/theme";
import { openLegalPage } from "@/constants/legal";

import { PROFILE_COPY } from "../../constants";

const createLegalLinksStyles = (theme: ITheme) => ({
	row: {
		flexDirection: "row" as const,
		gap: theme.pace.spacing[4],
		marginTop: theme.pace.spacing[3],
	},
	link: {
		fontFamily: theme.pace.typography.fonts.semibold,
		fontSize: theme.pace.typography.sizes.sm,
		color: theme.pace.colors.orange[400],
	},
});

const openTerms = (): void => {
	openLegalPage("terms");
};
const openPrivacy = (): void => {
	openLegalPage("privacy");
};

// Termos de Uso e Política de Privacidade (abrem no navegador do iPhone).
export const LegalLinks: React.FC = () => {
	const { theme } = useTheme();
	const styles = createLegalLinksStyles(theme);

	return (
		<View style={styles.row}>
			<Text style={styles.link} onPress={openTerms} accessibilityRole="link" testID="profile-terms">
				{PROFILE_COPY.terms}
			</Text>
			<Text
				style={styles.link}
				onPress={openPrivacy}
				accessibilityRole="link"
				testID="profile-privacy-policy"
			>
				{PROFILE_COPY.privacyPolicy}
			</Text>
		</View>
	);
};
