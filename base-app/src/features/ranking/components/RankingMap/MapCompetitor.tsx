import React from "react";
import { Image, Pressable, Text, View } from "react-native";

import Animated from "react-native-reanimated";

import { Icon } from "@/components/pace";
import { useTheme } from "@/theme";

import { MAP_ART } from "./assets";
import { useCompetitorAnim } from "./hooks/useCompetitorAnim";
import { IPlacedTeam } from "./hooks/useRankingMap";
import { accentOf, createCompetitorStyles, initialsOf } from "./styles";

interface IMapCompetitorProps {
	spot: IPlacedTeam;
	myRank: number;
	isSelected: boolean;
	replay: string;
	onPress: () => void;
}

const MAP_YOU = "VOCÊ";

// Equipe na trilha: corredor com a bandeira (emblema da equipe), coroa no 1º,
// "VOCÊ" na sua, e a pílula com a posição embaixo dos pés
export const MapCompetitor: React.FC<IMapCompetitorProps> = ({
	spot,
	myRank,
	isSelected,
	replay,
	onPress,
}) => {
	const { theme } = useTheme();
	const { team, rank, x, y, scale } = spot;
	const accent = accentOf(theme, rank, Boolean(team.you));
	const anim = useCompetitorAnim({ rank, myRank, replay });
	const styles = createCompetitorStyles(theme, {
		x,
		y,
		scale,
		accent,
		isSelected,
		isMine: Boolean(team.you),
		rank,
	});
	const sprite = team.you
		? MAP_ART.mine
		: (MAP_ART.others[(rank - 1) % MAP_ART.others.length] ?? MAP_ART.mine);
	const showName = Boolean(team.you) || isSelected;

	return (
		<Pressable
			style={styles.hit}
			onPress={onPress}
			accessibilityRole="button"
			accessibilityLabel={`${String(rank)}º lugar, ${team.name}, ${String(team.points)} pontos${team.you ? ", sua equipe" : ""}`}
			testID={`ranking-map-team-${String(rank)}`}
		>
			<Animated.View style={[styles.box, anim.popStyle]}>
				<View style={styles.groupScale}>
					<View style={styles.shadow} />
					<View style={styles.pole} />
					<View style={styles.ball} />
					<Animated.View style={[styles.flag, anim.flagStyle]}>
						{team.logoUrl ? (
							<Image source={{ uri: team.logoUrl }} style={styles.flagImage} resizeMode="cover" />
						) : (
							<Text style={styles.flagInitials}>{initialsOf(team.name)}</Text>
						)}
					</Animated.View>
					{rank === 1 ? (
						<View style={styles.crown}>
							<Icon
								name="crown"
								size={18}
								color={theme.pace.colors.rankGold}
								fill={theme.pace.colors.rankGold}
							/>
						</View>
					) : null}
					{team.you ? (
						<View style={styles.you}>
							<Text style={styles.youText}>{MAP_YOU}</Text>
						</View>
					) : null}
					<Animated.View style={[styles.runner, anim.runStyle]}>
						<Image
							source={sprite}
							style={[styles.runnerImage, spot.faceRight ? styles.flip : null]}
							resizeMode="contain"
						/>
					</Animated.View>
				</View>
			</Animated.View>
			<View style={styles.label}>
				<View style={styles.badge}>
					<Text style={styles.badgeText}>{`${String(rank)}º`}</Text>
				</View>
				{showName ? (
					<Text style={styles.name} numberOfLines={1}>
						{team.name}
					</Text>
				) : null}
			</View>
		</Pressable>
	);
};
