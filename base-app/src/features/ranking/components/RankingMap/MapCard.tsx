import React from "react";
import { Image, Text, View } from "react-native";

import { Button, GlassSurface, Icon } from "@/components/pace";
import { useTheme } from "@/theme";
import { formatKm, formatPoints, IRankedTeam } from "@/lib/pace";

import { accentOf, initialsOf } from "./styles";

interface IMapCardProps {
	team: IRankedTeam;
	rank: number;
	// Equipe logo à frente (null = é o 1º)
	ahead: IRankedTeam | null;
	onOpen: () => void;
}

const PHOTO = 52;
const COPY = {
	mine: "· sua equipe",
	top: "No cume da montanha.",
	open: "Ver equipe",
	missing: "Faltam",
	pts: "pts",
	toPass: "para passar",
} as const;

// Card da equipe selecionada no mapa
export const MapCard: React.FC<IMapCardProps> = ({ team, rank, ahead, onOpen }) => {
	const { theme } = useTheme();
	const { colors, typography } = theme.pace;
	const accent = accentOf(theme, rank, Boolean(team.you));
	const gap = ahead ? ahead.points - team.points + 1 : 0;
	const trend = team.delta > 0 ? "trending-up" : team.delta < 0 ? "trending-down" : null;

	return (
		<GlassSurface
			appearance={{
				fill: { color: colors.glassPanel },
				border: colors.glassBorderStrong,
				rim: true,
			}}
			radius={28}
			style={{ padding: 16, gap: 12 }}
		>
			<View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
				<View
					style={{
						width: PHOTO,
						height: PHOTO,
						borderRadius: 16,
						borderWidth: 2,
						borderColor: accent,
						overflow: "hidden",
						alignItems: "center",
						justifyContent: "center",
						backgroundColor: colors.navy[900],
					}}
				>
					{team.logoUrl ? (
						<Image source={{ uri: team.logoUrl }} style={{ width: "100%", height: "100%" }} />
					) : (
						<Text style={{ fontFamily: typography.fonts.extrabold, color: colors.textPrimary }}>
							{initialsOf(team.name)}
						</Text>
					)}
				</View>
				<View style={{ flex: 1, minWidth: 0 }}>
					<Text
						numberOfLines={1}
						style={{ fontFamily: typography.fonts.bold, fontSize: 16, color: colors.textPrimary }}
					>
						{team.name}
						{team.you ? (
							<Text style={{ fontSize: 12, color: colors.accent }}>{` ${COPY.mine}`}</Text>
						) : null}
					</Text>
					<View style={{ flexDirection: "row", alignItems: "center", gap: 6, marginTop: 2 }}>
						<Text
							style={{
								fontFamily: typography.fonts.medium,
								fontSize: 12,
								color: colors.textSecondary,
							}}
						>{`${team.city} · ${formatKm(team.km, 1)} km`}</Text>
						{trend ? (
							<Icon
								name={trend}
								size={14}
								color={team.delta > 0 ? colors.statusSuccess : colors.statusDanger}
							/>
						) : (
							<Text style={{ color: colors.textSecondary }}>—</Text>
						)}
					</View>
				</View>
				<Text
					style={{
						fontFamily: typography.fonts.bold,
						fontSize: 22,
						color: colors.textPrimary,
						fontVariant: ["tabular-nums"],
					}}
				>
					{formatPoints(team.points)}
					<Text style={{ fontSize: 12, color: colors.textSecondary }}>{` ${COPY.pts}`}</Text>
				</Text>
			</View>
			<View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
				<Text
					style={{
						flex: 1,
						fontFamily: typography.fonts.medium,
						fontSize: 12,
						color: colors.textSecondary,
					}}
				>
					{ahead ? (
						<>
							{`${COPY.missing} `}
							<Text
								style={{ fontFamily: typography.fonts.bold, color: colors.textPrimary }}
							>{`${formatPoints(gap)} ${COPY.pts}`}</Text>
							{` ${COPY.toPass} ${ahead.name}`}
						</>
					) : (
						COPY.top
					)}
				</Text>
				<Button size="sm" onPress={onOpen} testID="ranking-map-open-team">
					{COPY.open}
				</Button>
			</View>
		</GlassSurface>
	);
};
