import React from "react";
import { ActivityIndicator, Text, View } from "react-native";

import {
	Button,
	FloatingToast,
	Highlight,
	Icon,
	Logo,
	ScreenBackground,
	ScreenScroll,
	Sheet,
} from "@/components/pace";
import { ITheme, useTheme } from "@/theme";
import { PHOTOS } from "@/lib/pace";

import { PaywallFooter } from "./components/PaywallFooter";
import { PlanCard } from "./components/PlanCard";
import { PAYWALL_BENEFITS, PAYWALL_COPY } from "./constants";
import { usePaywallScreen } from "./hooks/usePaywallScreen";

const LOGO_HEIGHT = 40;
const TITLE = 32;

const createPaywallStyles = (theme: ITheme) => {
	const { colors, spacing, typography } = theme.pace;
	return {
		root: { flex: 1 },
		content: { gap: spacing[5], paddingTop: spacing[6] },
		logo: { alignItems: "center" as const },
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
		benefits: { gap: spacing[3] },
		benefit: { flexDirection: "row" as const, alignItems: "center" as const, gap: spacing[3] },
		benefitText: {
			flex: 1,
			fontFamily: typography.fonts.semibold,
			fontSize: typography.sizes.sm,
			color: colors.textPrimary,
		},
		plans: { gap: spacing[3] },
		error: {
			fontFamily: typography.fonts.medium,
			fontSize: typography.sizes.sm,
			color: colors.textSecondary,
			textAlign: "center" as const,
		},
		sheetText: {
			fontFamily: typography.fonts.medium,
			fontSize: typography.sizes.ui,
			lineHeight: typography.sizes.ui * 1.45,
			color: colors.textSecondary,
		},
		accent: colors.orange[400],
	};
};

// Assinatura PACE TEAM: mensal ou anual, tudo incluso (StoreKit via RevenueCat).
export const PaywallScreen: React.FC = () => {
	const { theme } = useTheme();
	const paywall = usePaywallScreen();
	const styles = createPaywallStyles(theme);
	const selected = paywall.selected;
	const cta = selected?.trial
		? PAYWALL_COPY.startTrial
		: `${PAYWALL_COPY.subscribe}${selected?.price ?? ""}`;

	return (
		<View style={styles.root}>
			<ScreenBackground photo={PHOTOS.teamRunningSunset} />
			<ScreenScroll contentStyle={styles.content}>
				<View style={styles.logo}>
					<Logo height={LOGO_HEIGHT} />
				</View>
				<View>
					<Text style={styles.title}>
						{PAYWALL_COPY.titleStart} <Highlight>{PAYWALL_COPY.titleHighlight}</Highlight>
					</Text>
					<Text style={styles.subtitle}>{PAYWALL_COPY.subtitle}</Text>
				</View>
				<View style={styles.benefits}>
					{PAYWALL_BENEFITS.map((b) => (
						<View key={b.icon} style={styles.benefit}>
							<Icon name={b.icon} size={20} color={styles.accent} />
							<Text style={styles.benefitText}>{b.text}</Text>
						</View>
					))}
				</View>
				<View style={styles.plans}>
					{paywall.isLoading ? <ActivityIndicator color={styles.accent} /> : null}
					{paywall.isError ? <Text style={styles.error}>{PAYWALL_COPY.loadError}</Text> : null}
					{paywall.plans.map((plan) => (
						<PlanCard
							key={plan.id}
							plan={plan}
							isSelected={plan.id === selected?.id}
							savings={paywall.savings}
							onSelect={paywall.select}
						/>
					))}
				</View>
				{paywall.isError ? (
					<Button
						size="lg"
						fullWidth
						variant="glass"
						onPress={paywall.retry}
						testID="paywall-retry"
					>
						{PAYWALL_COPY.retry}
					</Button>
				) : (
					<Button
						size="lg"
						fullWidth
						disabled={!selected || paywall.isBusy}
						onPress={paywall.subscribe}
						testID="paywall-subscribe"
					>
						{cta}
					</Button>
				)}
				<PaywallFooter paywall={paywall} hasTrial={Boolean(selected?.trial)} />
			</ScreenScroll>
			<Sheet
				open={paywall.isDeleteOpen}
				title={PAYWALL_COPY.deleteTitle}
				onClose={paywall.closeDelete}
				actions={
					<>
						<Button
							fullWidth
							icon="trash-2"
							disabled={paywall.isBusy}
							onPress={paywall.confirmDelete}
							testID="paywall-delete-confirm"
						>
							{PAYWALL_COPY.deleteConfirm}
						</Button>
						<Button
							fullWidth
							variant="ghost"
							onPress={paywall.closeDelete}
							testID="paywall-delete-cancel"
						>
							{PAYWALL_COPY.cancel}
						</Button>
					</>
				}
			>
				<Text style={styles.sheetText}>{PAYWALL_COPY.deleteBody}</Text>
			</Sheet>
			<FloatingToast toast={paywall.toast} />
		</View>
	);
};
