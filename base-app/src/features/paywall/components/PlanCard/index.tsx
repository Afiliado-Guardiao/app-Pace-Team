import React from "react";
import { Pressable, Text, View } from "react-native";

import { Badge, GlassSurface } from "@/components/pace";
import { ITheme, useTheme } from "@/theme";
import { IPlan } from "@/lib/purchases";

import { PAYWALL_COPY } from "../../constants";

interface IPlanCardProps {
	plan: IPlan;
	isSelected: boolean;
	// "42%" no anual
	savings: string | null;
	onSelect: (planId: string) => void;
}

const RADIO = 22;

const createPlanCardStyles = (theme: ITheme, isSelected: boolean) => {
	const { blur, colors, radii, spacing, typography } = theme.pace;
	return {
		card: {
			flexDirection: "row" as const,
			alignItems: "center" as const,
			gap: spacing[3],
			padding: spacing[4],
		},
		appearance: {
			fill: "glassFill" as const,
			blur: blur.intensity.glass,
			border: isSelected ? colors.orange[500] : colors.glassBorder,
			rim: true,
		},
		radius: radii.xl,
		radio: {
			width: RADIO,
			height: RADIO,
			borderRadius: RADIO / 2,
			borderWidth: isSelected ? 7 : 2,
			borderColor: isSelected ? colors.orange[500] : colors.glassBorderStrong,
		},
		body: { flex: 1, gap: 2 },
		titleRow: { flexDirection: "row" as const, alignItems: "center" as const, gap: spacing[2] },
		title: {
			fontFamily: typography.fonts.bold,
			fontSize: typography.sizes.ui,
			color: colors.textPrimary,
		},
		sub: {
			fontFamily: typography.fonts.medium,
			fontSize: typography.sizes.xs,
			color: colors.textSecondary,
		},
		price: {
			fontFamily: typography.fonts.extrabold,
			fontSize: typography.sizes.lg,
			color: colors.textPrimary,
		},
		unit: {
			fontFamily: typography.fonts.medium,
			fontSize: typography.sizes.xs,
			color: colors.textSecondary,
		},
	};
};

// Cartão de um plano (mensal ou anual), com seleção e o quanto o anual economiza.
export const PlanCard: React.FC<IPlanCardProps> = ({ plan, isSelected, savings, onSelect }) => {
	const { theme } = useTheme();
	const styles = createPlanCardStyles(theme, isSelected);
	const isAnnual = plan.period === "annual";
	const sub = isAnnual ? `${plan.perMonth}${PAYWALL_COPY.annualEquivalent}` : null;
	const trial = plan.trial ? `${plan.trial}${PAYWALL_COPY.trialSuffix}` : null;

	return (
		<Pressable
			onPress={() => {
				onSelect(plan.id);
			}}
			accessibilityRole="radio"
			accessibilityState={{ selected: isSelected }}
			accessibilityLabel={`${isAnnual ? PAYWALL_COPY.annual : PAYWALL_COPY.monthly} ${plan.price}`}
			testID={`paywall-plan-${plan.period}`}
		>
			<GlassSurface appearance={styles.appearance} radius={styles.radius} style={styles.card}>
				<View style={styles.radio} />
				<View style={styles.body}>
					<View style={styles.titleRow}>
						<Text style={styles.title}>
							{isAnnual ? PAYWALL_COPY.annual : PAYWALL_COPY.monthly}
						</Text>
						{isAnnual && savings ? (
							<Badge tone="accent">{`${PAYWALL_COPY.save}${savings}`}</Badge>
						) : null}
					</View>
					{(sub ?? trial) ? (
						<Text style={styles.sub}>{[sub, trial].filter(Boolean).join(" · ")}</Text>
					) : null}
				</View>
				<Text style={styles.price}>
					{plan.price}
					<Text style={styles.unit}>{isAnnual ? PAYWALL_COPY.perYear : PAYWALL_COPY.perMonth}</Text>
				</Text>
			</GlassSurface>
		</Pressable>
	);
};
