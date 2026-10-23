import React from "react";
import { Text, View } from "react-native";

import { Avatar, CountUp } from "@/components/pace";
import { ITheme, useTheme } from "@/theme";
import { formatPoints } from "@/lib/pace";

interface ITeamSideProps {
	name: string;
	city: string;
	points: number;
	position: number;
	isUs?: boolean;
	alignRight?: boolean;
}

const AVATAR = 48;
const RING_RADIUS = 14;
const POINTS_SIZE = 24;
const CITY_SIZE = 10.5;
const UNIT_OFFSET = -4;

const createTeamSideStyles = (theme: ITheme, isUs: boolean, right: boolean) => {
	const { colors, shadows, spacing, typography } = theme.pace;
	const { fonts, sizes } = typography;
	return {
		root: {
			alignItems: right ? ("flex-end" as const) : ("flex-start" as const),
			gap: spacing[2],
			minWidth: 0,
			overflow: "hidden" as const,
		},
		top: {
			flexDirection: right ? ("row-reverse" as const) : ("row" as const),
			alignItems: "center" as const,
			gap: spacing[2],
		},
		ring: { borderRadius: RING_RADIUS, boxShadow: isUs ? shadows.sideUs : shadows.sideThem },
		position: {
			fontFamily: fonts.extrabold,
			fontSize: sizes.sm,
			color: isUs ? colors.orange[300] : colors.textSecondary,
		},
		texts: { alignItems: right ? ("flex-end" as const) : ("flex-start" as const), minWidth: 0 },
		name: { fontFamily: fonts.bold, fontSize: sizes.sm, color: colors.textPrimary },
		city: {
			marginTop: 2,
			fontFamily: fonts.medium,
			fontSize: CITY_SIZE,
			color: colors.textTertiary,
		},
		points: {
			fontFamily: fonts.bold,
			fontSize: POINTS_SIZE,
			fontVariant: [...typography.tabularNums],
			color: colors.textPrimary,
		},
		unit: {
			marginTop: UNIT_OFFSET,
			fontFamily: fonts.medium,
			fontSize: sizes.micro,
			color: colors.textTertiary,
		},
	};
};

// Um lado do placar: escudo, posição, nome, cidade e pontos animados.
export const TeamSide: React.FC<ITeamSideProps> = ({
	name,
	city,
	points,
	position,
	isUs = false,
	alignRight = false,
}) => {
	const { theme } = useTheme();
	const styles = createTeamSideStyles(theme, isUs, alignRight);

	return (
		<View style={styles.root}>
			<View style={styles.top}>
				<View style={styles.ring}>
					<Avatar name={name} square size={AVATAR} />
				</View>
				<Text style={styles.position}>{position}º</Text>
			</View>
			<View style={styles.texts}>
				<Text style={styles.name} numberOfLines={1}>
					{name}
				</Text>
				<Text style={styles.city}>{city}</Text>
			</View>
			<Text style={styles.points}>
				<CountUp key={points} value={formatPoints(points)} />
			</Text>
			<Text style={styles.unit}>pts</Text>
		</View>
	);
};
