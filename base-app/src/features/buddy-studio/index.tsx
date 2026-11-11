import React from "react";
import { Text, View } from "react-native";

import {
	Button,
	FloatingToast,
	ScreenBackground,
	ScreenScroll,
	SegmentedControl,
	Sheet,
	TopBar,
} from "@/components/pace";
import { ITheme, useTheme } from "@/theme";
import { PHOTOS } from "@/lib/pace";

import { StudioGrid } from "./components/StudioGrid";
import { StudioStage } from "./components/StudioStage";
import { STUDIO_COPY as C, STUDIO_TABS } from "./constants";
import { useBuddyStudio } from "./hooks/useBuddyStudio";

const createBuddyStudioStyles = (theme: ITheme) => {
	const { colors, spacing, typography } = theme.pace;
	return {
		root: { flex: 1 },
		content: { gap: spacing[4], paddingTop: spacing[2] },
		tagline: {
			fontFamily: typography.fonts.semibold,
			fontSize: typography.sizes.ui,
			color: colors.textSecondary,
			textAlign: "center" as const,
		},
		actions: { gap: spacing[3] },
		link: {
			fontFamily: typography.fonts.semibold,
			fontSize: typography.sizes.sm,
			color: colors.textSecondary,
			textAlign: "center" as const,
			textDecorationLine: "underline" as const,
		},
		fair: {
			fontFamily: typography.fonts.medium,
			fontSize: typography.sizes.xs,
			color: colors.textTertiary,
			textAlign: "center" as const,
		},
		lockText: {
			fontFamily: typography.fonts.medium,
			fontSize: typography.sizes.sm,
			lineHeight: typography.sizes.sm * 1.45,
			color: colors.textSecondary,
		},
	};
};

// PACE BUDDY STUDIO: cores, acessórios e efeitos Premium para o Buddy
export const BuddyStudioScreen: React.FC = () => {
	const { theme } = useTheme();
	const studio = useBuddyStudio();
	const styles = createBuddyStudioStyles(theme);

	return (
		<View style={styles.root}>
			<ScreenBackground photo={PHOTOS.teamRunningSunset} />
			<ScreenScroll contentStyle={styles.content}>
				<TopBar title={C.title} onBack={studio.goBack} />
				<Text style={styles.tagline}>{C.tagline}</Text>
				<StudioStage look={studio.preview} />
				<SegmentedControl
					options={STUDIO_TABS}
					value={studio.tab}
					onChange={studio.setTab}
					testID="studio-tabs"
				/>
				<StudioGrid items={studio.items} />
				<View style={styles.actions}>
					<Button
						size="lg"
						fullWidth
						icon="palette"
						onPress={studio.apply}
						disabled={!studio.isDirty}
						testID="studio-apply"
					>
						{studio.isDirty ? C.apply : C.applied}
					</Button>
					<Text
						style={styles.link}
						onPress={studio.reset}
						accessibilityRole="link"
						testID="studio-reset"
					>
						{C.reset}
					</Text>
					<Text style={styles.fair}>{C.fair}</Text>
				</View>
			</ScreenScroll>
			<Sheet
				open={studio.isLockOpen}
				title={C.lockedTitle}
				onClose={studio.closeLock}
				actions={
					<Button fullWidth icon="crown" onPress={studio.openPro} testID="studio-open-pro">
						{C.lockedCta}
					</Button>
				}
			>
				<Text style={styles.lockText}>{C.lockedBody}</Text>
			</Sheet>
			<FloatingToast toast={studio.toast} />
		</View>
	);
};
