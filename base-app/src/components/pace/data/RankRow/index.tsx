import React from "react";
import { Pressable, Text, View } from "react-native";

import Animated from "react-native-reanimated";

import { useTheme } from "@/theme";

import { staggerDelay, useEntrance } from "../../animations";
import { Avatar } from "../../core/Avatar";
import { CountUp } from "../../core/CountUp";
import { Icon } from "../../core/Icon";
import { GlassSurface } from "../../primitives";

import { createRankRowStyles } from "./styles";
import { IRankRowProps } from "./types";

const AVATAR_SIZE = 40;
const DELTA_ICON = 12;
const DELTA_STROKE = 2.5;
const DELTA_POP_DELAY = 500;
const DELTA_POP_DURATION = 500;

// Linha do ranking: posição (ouro/prata/bronze), logo, nome, pontos animados
// e seta de variação. O seu time ganha vidro laranja e a etiqueta VOCÊ.
export const RankRow: React.FC<IRankRowProps> = ({
	position,
	name,
	city,
	points,
	km,
	delta = 0,
	logo,
	isYou = false,
	onPress,
	animate = true,
	style,
	testID = "pace-rank-row",
}) => {
	const { theme } = useTheme();
	const { motion } = theme.pace;
	const styles = createRankRowStyles(theme, { position, delta, isYou });
	const delay = staggerDelay(motion, position);
	const deltaIcon = delta > 0 ? "chevron-up" : delta < 0 ? "chevron-down" : "minus";
	const rowEntrance = useEntrance("rise", { delay, enabled: animate });
	const deltaEntrance = useEntrance("pop", {
		delay: delay + DELTA_POP_DELAY,
		duration: DELTA_POP_DURATION,
		enabled: animate && delta !== 0,
	});
	const sub = [city, km !== undefined ? `${String(km)} km` : undefined].filter(Boolean).join(" · ");

	return (
		<Animated.View style={[rowEntrance, style]}>
			<Pressable testID={testID} disabled={!onPress} onPress={onPress} accessibilityRole="button">
				<GlassSurface
					appearance={styles.appearance}
					radius={theme.pace.radii.row}
					style={styles.surface}
				>
					<Text style={styles.position}>{position}</Text>
					<Avatar name={name} src={logo} square size={AVATAR_SIZE} />
					<View style={styles.info}>
						<View style={styles.nameRow}>
							<Text style={styles.name} numberOfLines={1}>
								{name}
							</Text>
							{isYou ? (
								<View style={styles.youTag}>
									<Text style={styles.youText}>VOCÊ</Text>
								</View>
							) : null}
						</View>
						<Text style={styles.sub}>{sub}</Text>
					</View>
					<View style={styles.right}>
						<Text style={styles.points}>
							<CountUp value={points} delay={delay} />
							<Text style={styles.pointsUnit}> pts</Text>
						</Text>
						<View style={styles.delta}>
							<Animated.View style={deltaEntrance}>
								<Icon
									name={deltaIcon}
									size={DELTA_ICON}
									strokeWidth={DELTA_STROKE}
									color={styles.deltaColor}
								/>
							</Animated.View>
							{delta !== 0 ? <Text style={styles.deltaText}>{Math.abs(delta)}</Text> : null}
						</View>
					</View>
				</GlassSurface>
			</Pressable>
		</Animated.View>
	);
};

export * from "./types";
