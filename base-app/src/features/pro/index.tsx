import React from "react";
import { Text, View } from "react-native";

import {
	Button,
	FloatingToast,
	Highlight,
	Icon,
	ScreenBackground,
	ScreenScroll,
	Sheet,
	TopBar,
} from "@/components/pace";
import { ITheme, useTheme } from "@/theme";
import { PHOTOS } from "@/lib/pace";

import { ProFooter } from "./components/ProFooter";
import { ProPillars } from "./components/ProPillars";
import { ProPlans } from "./components/ProPlans";
import { ProStatusCard } from "./components/ProStatusCard";
import { PRO_COPY } from "./constants";
import { useProScreen } from "./hooks/useProScreen";
import { statusContent } from "./utils/statusContent";

const TITLE = 30;

const createProStyles = (theme: ITheme) => {
	const { colors, spacing, typography, radii } = theme.pace;
	return {
		root: { flex: 1 },
		content: { gap: spacing[5], paddingTop: spacing[2] },
		badge: {
			alignSelf: "center" as const,
			flexDirection: "row" as const,
			alignItems: "center" as const,
			gap: spacing[2],
			paddingHorizontal: spacing[4],
			paddingVertical: spacing[2],
			borderRadius: radii.pill,
			backgroundColor: colors.accentSoft,
			borderWidth: 1,
			borderColor: colors.accentBorderSoft,
		},
		badgeText: {
			fontFamily: typography.fonts.extrabold,
			fontSize: typography.sizes.xs,
			letterSpacing: 1.4,
			color: colors.textPrimary,
		},
		title: {
			fontFamily: typography.fonts.extrabold,
			fontSize: TITLE,
			lineHeight: TITLE * 1.12,
			color: colors.textPrimary,
			textAlign: "center" as const,
		},
		subtitle: {
			marginTop: spacing[2],
			fontFamily: typography.fonts.medium,
			fontSize: typography.sizes.ui,
			lineHeight: typography.sizes.ui * 1.45,
			color: colors.textSecondary,
			textAlign: "center" as const,
		},
		fair: {
			fontFamily: typography.fonts.semibold,
			fontSize: typography.sizes.xs,
			lineHeight: typography.sizes.xs * 1.5,
			color: colors.textTertiary,
			textAlign: "center" as const,
		},
		sheetText: {
			fontFamily: typography.fonts.medium,
			fontSize: typography.sizes.ui,
			lineHeight: typography.sizes.ui * 1.45,
			color: colors.textSecondary,
		},
		gold: colors.statusWarning,
	};
};

// PACE TEAM PRO: o plano da equipe, o status de cada atleta e a assinatura.
export const ProScreen: React.FC = () => {
	const { theme } = useTheme();
	const screen = useProScreen();
	const styles = createProStyles(theme);
	const status = statusContent(screen.kind, screen.pro);

	return (
		<View style={styles.root}>
			<ScreenBackground photo={PHOTOS.teamRunningSunset} />
			<ScreenScroll contentStyle={styles.content}>
				<TopBar onBack={screen.goBack} />
				<View style={styles.badge}>
					<Icon name="crown" size={16} color={styles.gold} />
					<Text style={styles.badgeText}>{PRO_COPY.badge}</Text>
				</View>
				<View>
					<Text style={styles.title}>
						{PRO_COPY.titleStart} <Highlight>{PRO_COPY.titleHighlight}</Highlight>
					</Text>
					<Text style={styles.subtitle}>{PRO_COPY.subtitle}</Text>
				</View>
				{status ? <ProStatusCard content={status} onAction={screen.onStatusAction} /> : null}
				<ProPillars />
				<Text style={styles.fair}>{PRO_COPY.fair}</Text>
				{screen.showPlans ? <ProPlans screen={screen} /> : null}
				<ProFooter
					hasTrial={Boolean(screen.selected?.trial)}
					onRestore={screen.purchase.restore}
					onTerms={screen.openTerms}
					onPrivacy={screen.openPrivacy}
				/>
			</ScreenScroll>
			<Sheet
				open={screen.purchase.isDone}
				title={PRO_COPY.doneTitle}
				onClose={screen.purchase.closeDone}
				actions={
					<Button fullWidth icon="crown" onPress={screen.purchase.closeDone} testID="pro-done">
						{PRO_COPY.doneCta}
					</Button>
				}
			>
				<Text style={styles.sheetText}>{PRO_COPY.doneBody}</Text>
			</Sheet>
			<FloatingToast toast={screen.toast} />
		</View>
	);
};
