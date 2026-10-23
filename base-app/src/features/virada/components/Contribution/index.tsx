import React from "react";
import { Text, View } from "react-native";

import Animated from "react-native-reanimated";

import { Avatar, CountUp, GlassCard, GradientLayers, Icon, useLayoutSize } from "@/components/pace";
import { ITheme, useTheme } from "@/theme";
import { formatPoints } from "@/lib/pace";

import { VIRADA_COPY } from "../../constants";
import { useViradaFill } from "../../hooks/useViradaFill";
import { IContribution } from "../../hooks/useViradaScreen";

interface IContributionProps {
	members: IContribution[];
	total: number;
}

const BAR_H = 6;
const ROW_PAD_Y = 11;
const ROW_PAD_X = 12;
const BASE_DELAY = 200;
const STAGGER = 80;

const createContributionStyles = (theme: ITheme) => {
	const { borders, colors, spacing, typography } = theme.pace;
	const { fonts, sizes } = typography;
	return {
		row: {
			flexDirection: "row" as const,
			alignItems: "center" as const,
			gap: spacing[3],
			paddingVertical: ROW_PAD_Y,
			paddingHorizontal: ROW_PAD_X,
		},
		divider: { borderTopWidth: borders.hairline, borderTopColor: colors.hairline },
		body: { flex: 1, minWidth: 0 },
		top: {
			flexDirection: "row" as const,
			justifyContent: "space-between" as const,
			gap: spacing[2],
		},
		nameRow: { flexDirection: "row" as const, alignItems: "center" as const, gap: 5 },
		name: { fontFamily: fonts.semibold, fontSize: sizes.sm, color: colors.textPrimary },
		points: {
			fontFamily: fonts.bold,
			fontSize: sizes.sm,
			fontVariant: [...typography.tabularNums],
			color: colors.textPrimary,
		},
		share: { fontFamily: fonts.medium, fontSize: sizes.micro, color: colors.textTertiary },
		track: {
			height: BAR_H,
			borderRadius: BAR_H / 2,
			marginTop: spacing[2],
			overflow: "hidden" as const,
			backgroundColor: colors.trackEmpty,
		},
		fill: { height: "100%" as const, borderRadius: BAR_H / 2, overflow: "hidden" as const },
		fillMember: { backgroundColor: colors.barMember },
	};
};

type IStyles = ReturnType<typeof createContributionStyles>;

const ContributionRow: React.FC<{
	member: IContribution;
	index: number;
	top: number;
	total: number;
	styles: IStyles;
}> = ({ member, index, top, total, styles }) => {
	const { theme } = useTheme();
	const { size, onLayout } = useLayoutSize();
	const fraction = member.points / top;
	const fill = useViradaFill(fraction, BASE_DELAY + index * STAGGER);

	return (
		<View style={[styles.row, index > 0 ? styles.divider : null]}>
			<Avatar name={member.name} size={36} ring={member.you} />
			<View style={styles.body}>
				<View style={styles.top}>
					<View style={styles.nameRow}>
						<Text style={styles.name}>{member.you ? VIRADA_COPY.you : member.name}</Text>
						{member.role === "Capitão" ? (
							<Icon name="crown" size={12} color={theme.pace.colors.rankGold} />
						) : null}
					</View>
					<Text style={styles.points}>
						<CountUp key={member.points} value={formatPoints(member.points)} delay={index * 70} />
						<Text
							style={styles.share}
						>{` pts · ${String(Math.round((member.points / total) * 100))}%`}</Text>
					</Text>
				</View>
				<View style={styles.track} onLayout={onLayout}>
					<Animated.View style={[styles.fill, member.you ? null : styles.fillMember, fill]}>
						{member.you && size ? (
							<GradientLayers
								layers={theme.pace.gradients.progress}
								width={size.width * fraction}
								height={BAR_H}
							/>
						) : null}
					</Animated.View>
				</View>
			</View>
		</View>
	);
};

// Quanto cada integrante contribuiu para os pontos do time nesta disputa.
export const Contribution: React.FC<IContributionProps> = ({ members, total }) => {
	const { theme } = useTheme();
	const styles = createContributionStyles(theme);
	const top = members[0]?.points ?? 1;

	return (
		<GlassCard padding={theme.pace.spacing[1.5]}>
			{members.map((member, index) => (
				<ContributionRow
					key={member.name}
					member={member}
					index={index}
					top={top}
					total={total}
					styles={styles}
				/>
			))}
		</GlassCard>
	);
};
