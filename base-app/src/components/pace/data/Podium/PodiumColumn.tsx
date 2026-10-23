import React from "react";
import { Pressable, Text } from "react-native";

import Animated from "react-native-reanimated";

import { useTheme } from "@/theme";

import { useEntrance } from "../../animations";
import { Avatar } from "../../core/Avatar";
import { CountUp } from "../../core/CountUp";
import { GlassSurface } from "../../primitives";

import { AVATAR_POP_OFFSET, PODIUM_DELAY, POINTS_COUNT_OFFSET } from "./constants";
import { createPodiumColumnStyles } from "./styles";
import { IPodiumPlace, IPodiumTeam } from "./types";

interface IPodiumColumnProps {
	team: IPodiumTeam;
	place: IPodiumPlace;
	flex: number;
	onSelect?: (team: IPodiumTeam) => void;
}

// Uma coluna: logo com anel da medalha, nome, pontos e bloco que cresce da base.
export const PodiumColumn: React.FC<IPodiumColumnProps> = ({ team, place, flex, onSelect }) => {
	const { theme } = useTheme();
	const styles = createPodiumColumnStyles(theme, place, flex);
	const delay = PODIUM_DELAY[place];
	const avatarEntrance = useEntrance("pop", { delay: delay + AVATAR_POP_OFFSET });
	const blockEntrance = useEntrance("grow", { delay });
	const handlePress = (): void => {
		onSelect?.(team);
	};

	return (
		<Pressable
			testID={`pace-podium-${String(place)}`}
			accessibilityRole="button"
			accessibilityLabel={`${String(place)}º ${team.name}`}
			disabled={!onSelect}
			onPress={handlePress}
			style={styles.column}
		>
			<Animated.View style={[styles.avatarRing, avatarEntrance]}>
				<Avatar name={team.name} src={team.logo} square size={styles.avatarSize} />
			</Animated.View>
			<Text style={styles.name} numberOfLines={1}>
				{team.name}
			</Text>
			<Text style={styles.points}>
				<CountUp value={team.points} delay={delay + POINTS_COUNT_OFFSET} /> pts
			</Text>
			<Animated.View style={[styles.block, blockEntrance]}>
				<GlassSurface
					appearance={styles.appearance}
					radius={theme.pace.radii.md}
					style={styles.block}
				>
					<Text style={styles.number}>{place}</Text>
				</GlassSurface>
			</Animated.View>
		</Pressable>
	);
};
