import React from "react";
import { Text, View } from "react-native";

import { GlassCard, Highlight, ScreenBackground, ScreenScroll } from "@/components/pace";
import { ITheme, useTheme } from "@/theme";

interface IComingSoonProps {
	title: string;
	highlight: string;
}

const TOP = 150;
const TITLE_SIZE = 34;

const createComingSoonStyles = (theme: ITheme) => {
	const { colors, typography } = theme.pace;
	return {
		root: { flex: 1 },
		title: {
			marginTop: TOP,
			fontFamily: typography.fonts.extrabold,
			fontSize: TITLE_SIZE,
			lineHeight: TITLE_SIZE * 1.12,
			color: colors.textPrimary,
		},
		text: {
			fontFamily: typography.fonts.medium,
			fontSize: typography.sizes.ui,
			lineHeight: typography.sizes.ui * 1.5,
			color: colors.textSecondary,
		},
	};
};

// Tela provisória das abas que ainda estão sendo portadas do design.
export const ComingSoon: React.FC<IComingSoonProps> = ({ title, highlight }) => {
	const { theme } = useTheme();
	const styles = createComingSoonStyles(theme);

	return (
		<View style={styles.root}>
			<ScreenBackground />
			<ScreenScroll hasRail>
				<Text style={styles.title}>
					{title}
					{"\n"}
					<Highlight>{highlight}</Highlight>
				</Text>
				<GlassCard>
					<Text style={styles.text}>
						Esta tela está sendo montada a partir do design aprovado e entra na próxima etapa.
					</Text>
				</GlassCard>
			</ScreenScroll>
		</View>
	);
};
