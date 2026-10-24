import React from "react";
import { Image, ImageSourcePropType, StyleProp, Text, View, ViewStyle } from "react-native";

import Svg, { Path } from "react-native-svg";

import { GradientLayers, Logo, useLayoutSize } from "@/components/pace";
import { useTheme } from "@/theme";
import { CREW, formatDurationShort, formatKm, formatPaceClock, MY_TEAM } from "@/lib/pace";
import { IS_PREVIEW } from "@/constants/preview";

import { PostPin } from "./PostPin";
import { PostTeamBadge } from "./PostTeamBadge";
import { createPostArtStyles, POST_ART_RATIO } from "./styles";

export { POST_ART_RATIO } from "./styles";

export interface IPostArtLayers {
	route: boolean;
	stats: boolean;
	badge: boolean;
}

interface IPostArtProps {
	// Sem foto: só a camada da marca (sobre a câmera ao vivo)
	image?: ImageSourcePropType;
	seconds: number;
	km: number;
	layers?: IPostArtLayers;
	// null = atleta sem equipe (o selo da equipe não aparece)
	team?: { name: string; rank: number; isUp: boolean } | null;
	style?: StyleProp<ViewStyle>;
}

// Percurso estilizado da arte (viewBox 100 × 140), igual às fotos do feed
const ROUTE_D =
	"M38 74 C30 66 33 52 42 54 C50 56 46 64 53 64 C61 64 57 50 66 51 C74 52 72 63 66 68 C61 72 68 77 63 82 C58 87 48 82 42 86 C35 90 24 86 26 79 C28 73 44 80 38 74 Z";
const ALL_LAYERS: IPostArtLayers = { route: true, stats: true, badge: true };
// Equipe e fotos de colegas no percurso são do design: só na prévia por link
const DEFAULT_TEAM = IS_PREVIEW ? { name: MY_TEAM.name, rank: MY_TEAM.rank, isUp: true } : null;
const PINS = IS_PREVIEW
	? [
			{ image: CREW[0], x: 33, y: 49.5 },
			{ image: CREW[1], x: 63, y: 44 },
		]
	: [];
const LOGO_WIDTH = 34;
const LOGO_RATIO = 696 / 222;
const COPY = { distance: "Distância", pace: "Ritmo", time: "Tempo" } as const;

// Foto da corrida com a marca PACE TEAM: métricas, percurso, equipe e logo.
export const PostArt: React.FC<IPostArtProps> = ({
	image,
	seconds,
	km,
	layers = ALL_LAYERS,
	team = DEFAULT_TEAM,
	style,
}) => {
	const { theme } = useTheme();
	const { size, onLayout } = useLayoutSize();
	const width = size?.width ?? 0;
	const cqw = width / 100;
	const styles = createPostArtStyles(theme, cqw);
	const pace = `${formatPaceClock(km > 0 ? seconds / km : 0)} /km`;

	return (
		<View style={[styles.root, image ? null : styles.overlayOnly, style]} onLayout={onLayout}>
			{image ? (
				<Image
					source={image}
					style={styles.image}
					resizeMode="cover"
					accessibilityLabel="Foto da corrida"
				/>
			) : null}
			{size ? (
				<>
					<View style={styles.fill} pointerEvents="none">
						<GradientLayers
							layers={theme.pace.gradients.postArtScrim}
							width={width}
							height={width / POST_ART_RATIO}
						/>
					</View>
					{layers.stats ? (
						<View style={styles.stats} pointerEvents="none">
							<Text style={styles.label}>{COPY.distance}</Text>
							<Text style={styles.value}>{`${formatKm(km)} km`}</Text>
							<Text style={styles.label}>{COPY.pace}</Text>
							<Text style={styles.value}>{pace}</Text>
							<Text style={styles.label}>{COPY.time}</Text>
							<Text style={[styles.value, styles.lastValue]}>{formatDurationShort(seconds)}</Text>
						</View>
					) : null}
					{layers.route ? (
						<View style={styles.fill} pointerEvents="none">
							<Svg width="100%" height="100%" viewBox="0 0 100 140" preserveAspectRatio="none">
								<Path
									d={ROUTE_D}
									fill="none"
									stroke={theme.pace.colors.postRoute}
									strokeWidth={0.75}
									strokeLinecap="round"
									strokeLinejoin="round"
								/>
							</Svg>
						</View>
					) : null}
					{layers.route
						? PINS.map((pin) => (
								<PostPin key={String(pin.x)} image={pin.image} x={pin.x} y={pin.y} cqw={cqw} />
							))
						: null}
					{layers.badge && team ? (
						<PostTeamBadge team={team.name} rank={team.rank} isUp={team.isUp} cqw={cqw} />
					) : null}
					<View style={styles.logo} pointerEvents="none">
						<Logo variant="horizontal" height={(LOGO_WIDTH * cqw) / LOGO_RATIO} />
					</View>
				</>
			) : null}
		</View>
	);
};
