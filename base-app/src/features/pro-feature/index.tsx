import React from "react";
import { Text, View } from "react-native";

import { Button, GlassCard, Icon, ScreenBackground, ScreenScroll, TopBar } from "@/components/pace";
import { ITheme, useTheme } from "@/theme";
import { PHOTOS } from "@/lib/pace";

import { FeatureHero } from "./components/FeatureHero";
import { PRO_FEATURE_COPY } from "./constants";
import { useProFeatureScreen } from "./hooks/useProFeatureScreen";

const TITLE = 28;

const createProFeatureStyles = (theme: ITheme) => {
	const { colors, spacing, typography } = theme.pace;
	return {
		root: { flex: 1 },
		content: { gap: spacing[5], paddingTop: spacing[2] },
		head: { alignItems: "center" as const, gap: spacing[2] },
		label: {
			fontFamily: typography.fonts.bold,
			fontSize: typography.sizes.xs,
			letterSpacing: 1.4,
			color: colors.statusWarning,
		},
		title: {
			fontFamily: typography.fonts.extrabold,
			fontSize: TITLE,
			color: colors.textPrimary,
			textAlign: "center" as const,
		},
		tagline: {
			fontFamily: typography.fonts.medium,
			fontSize: typography.sizes.ui,
			lineHeight: typography.sizes.ui * 1.45,
			color: colors.textSecondary,
			textAlign: "center" as const,
		},
		list: { gap: spacing[3] },
		row: { flexDirection: "row" as const, alignItems: "center" as const, gap: spacing[3] },
		bullet: {
			flex: 1,
			fontFamily: typography.fonts.semibold,
			fontSize: typography.sizes.sm,
			color: colors.textPrimary,
		},
		why: {
			fontFamily: typography.fonts.medium,
			fontSize: typography.sizes.xs,
			lineHeight: typography.sizes.xs * 1.5,
			color: colors.textTertiary,
			textAlign: "center" as const,
		},
		check: colors.orange[400],
	};
};

// PACE AI, Buddy Studio ou Team Analytics: o que é, o que oferece e como liberar
export const ProFeatureScreen: React.FC = () => {
	const { theme } = useTheme();
	const screen = useProFeatureScreen();
	const styles = createProFeatureStyles(theme);
	const { feature, isPro } = screen;
	const label = isPro ? PRO_FEATURE_COPY.unlocked : PRO_FEATURE_COPY.inPro;
	const cta = isPro ? PRO_FEATURE_COPY.seePlan : PRO_FEATURE_COPY.cta;

	return (
		<View style={styles.root}>
			<ScreenBackground photo={PHOTOS.teamRunningSunset} />
			<ScreenScroll contentStyle={styles.content}>
				<TopBar onBack={screen.goBack} />
				<FeatureHero icon={feature.icon} />
				<View style={styles.head}>
					<Text style={styles.label}>{label}</Text>
					<Text style={styles.title}>{feature.title}</Text>
					<Text style={styles.tagline}>{feature.tagline}</Text>
				</View>
				<GlassCard>
					<View style={styles.list}>
						{feature.bullets.map((text) => (
							<View key={text} style={styles.row}>
								<Icon name="check" size={18} color={styles.check} />
								<Text style={styles.bullet}>{text}</Text>
							</View>
						))}
					</View>
				</GlassCard>
				<Text style={styles.why}>{feature.why}</Text>
				{isPro && !screen.canOpen ? <Text style={styles.why}>{PRO_FEATURE_COPY.soon}</Text> : null}
				{screen.canOpen ? (
					<Button
						size="lg"
						fullWidth
						icon="chart-column"
						onPress={screen.open}
						testID="pro-feature-open"
					>
						{PRO_FEATURE_COPY.openNow}
					</Button>
				) : null}
				<Button
					size="lg"
					fullWidth
					icon="crown"
					variant={isPro ? "glass" : "primary"}
					onPress={screen.openPro}
					testID="pro-feature-cta"
				>
					{cta}
				</Button>
			</ScreenScroll>
		</View>
	);
};
