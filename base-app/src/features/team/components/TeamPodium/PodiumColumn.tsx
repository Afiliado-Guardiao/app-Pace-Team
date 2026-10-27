import React from "react";
import { Text, View } from "react-native";

import Animated from "react-native-reanimated";

import { Avatar, GradientLayers, useLayoutSize } from "@/components/pace";
import { ITheme, useTheme } from "@/theme";
import { ITeamMember } from "@/lib/pace";

import { MEDALS, PODIUM_HEIGHTS, TEAM_COPY } from "../../constants";
import { useGrowHeight } from "../../hooks/useGrowHeight";
import { Medal } from "../Medal";

interface IPodiumColumnProps {
	member: ITeamMember;
	// 0 = 1º lugar
	place: number;
	value: string;
	metricKey: string;
}

const DELAYS = [0, 120, 240] as const;
const NUMBER_COLORS = ["storyGold", "storySilver", "storyBronze"] as const;

const createPodiumColumnStyles = (theme: ITheme, place: number) => {
	const { colors, typography } = theme.pace;
	const isFirst = place === 0;
	const glow = colors[(MEDALS.at(place) ?? MEDALS[0]).glow];
	return {
		column: { flex: 1, minWidth: 0, alignItems: "center" as const, gap: 8 },
		avatar: { boxShadow: `0 0 0 2px ${colors.podiumRing}, 0 0 18px ${glow}` },
		medal: { position: "absolute" as const, right: -4, bottom: -4 },
		name: {
			maxWidth: "100%" as const,
			fontFamily: typography.fonts.bold,
			fontSize: typography.sizes.label,
			color: colors.textPrimary,
		},
		bar: {
			width: "100%" as const,
			overflow: "hidden" as const,
			alignItems: "center" as const,
			paddingTop: 10,
			gap: 4,
			borderTopLeftRadius: 16,
			borderTopRightRadius: 16,
			borderBottomLeftRadius: 6,
			borderBottomRightRadius: 6,
			borderWidth: 1,
			borderColor: colors.podiumBarBorder,
		},
		fill: { position: "absolute" as const, top: 0, left: 0 },
		place: {
			fontFamily: typography.fonts.extrabold,
			fontSize: isFirst ? 26 : 20,
			color: colors[NUMBER_COLORS[place] ?? "storyGold"],
		},
		value: {
			fontFamily: typography.fonts.semibold,
			fontSize: typography.sizes.xs,
			color: colors.textSecondary,
		},
	};
};

// Coluna do pódio: avatar com medalha, nome e degrau que sobe com mola.
export const PodiumColumn: React.FC<IPodiumColumnProps> = ({ member, place, value, metricKey }) => {
	const { theme } = useTheme();
	const { size, onLayout } = useLayoutSize();
	const height = PODIUM_HEIGHTS[place] ?? PODIUM_HEIGHTS[2];
	const heightStyle = useGrowHeight(height, DELAYS[place] ?? 0, metricKey);
	const styles = createPodiumColumnStyles(theme, place);
	const firstName = member.you ? TEAM_COPY.you : (member.name.split(" ")[0] ?? member.name);

	return (
		<View style={styles.column}>
			<View>
				<Avatar
					name={member.name}
					src={member.avatarUrl ?? undefined}
					size={place === 0 ? 56 : 46}
					ring={member.you}
					style={styles.avatar}
				/>
				<View style={styles.medal}>
					<Medal place={place} size={place === 0 ? 26 : 22} />
				</View>
			</View>
			<Text style={styles.name} numberOfLines={1}>
				{firstName}
			</Text>
			<Animated.View style={[styles.bar, heightStyle]} onLayout={onLayout}>
				{size ? (
					<View style={styles.fill}>
						<GradientLayers
							layers={theme.pace.gradients.teamPodiumBar}
							width={size.width}
							height={height}
						/>
					</View>
				) : null}
				<Text style={styles.place}>{`${String(place + 1)}º`}</Text>
				<Text style={styles.value} numberOfLines={1}>
					{value}
				</Text>
			</Animated.View>
		</View>
	);
};
