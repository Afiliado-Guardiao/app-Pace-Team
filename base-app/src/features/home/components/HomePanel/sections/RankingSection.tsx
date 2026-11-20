import React from "react";
import { Image, Pressable, Text, View, ViewStyle } from "react-native";

import { MAP_ART, MapCompetitor } from "@/components/shared/RankingTrail";
import { useTheme } from "@/theme";

import { PANEL } from "../constants";
import { PANEL_COPY } from "../copy";
import { useGrow } from "../hooks/useGrow";
import { IPanelData } from "../hooks/usePanelData";
import { useTrailWindow } from "../hooks/useTrailWindow";

import { PanelBar } from "./PanelBar";
import { PanelButton } from "./PanelButton";
import { createSectionStyles } from "./styles";

interface IRankingSectionProps {
	ranking: IPanelData["ranking"];
	isActive: boolean;
	k: number;
	visit: number;
	onOpen: () => void;
}

// Sombras por cima do mapa: em cima (bolinhas) e embaixo (textos e botão)
const TOP_SHADE = "linear-gradient(to bottom, rgba(0,0,0,.55), rgba(0,0,0,0))";
const BOTTOM_SHADE =
	"linear-gradient(to bottom, rgba(0,0,0,0), rgba(0,0,0,.55) 40%, rgba(0,0,0,.85))";

// Ranking: a Trilha até o Cume (a mesma da tela de Ranking) ocupando o card
// todo, com a sua equipe e as vizinhas; a posição, quanto falta e o botão
// ficam por cima do mapa
export const RankingSection: React.FC<IRankingSectionProps> = ({
	ranking,
	isActive,
	k,
	visit,
	onOpen,
}) => {
	const { theme } = useTheme();
	const s = createSectionStyles(theme, k);
	const grow = useGrow(isActive);
	const size = {
		width: PANEL.baseWidth * k,
		height: PANEL.bubblesHeight + PANEL.sectionHeight * k,
	};
	const trail = useTrailWindow(ranking?.teams ?? [], size);
	const fill: ViewStyle = { position: "absolute", left: 0, top: 0, ...size };
	const world: ViewStyle = {
		position: "absolute",
		left: 0,
		top: -trail.offsetY,
		width: size.width,
		height: trail.world.height,
	};
	const art = {
		position: "absolute" as const,
		left: trail.world.ox,
		top: trail.world.oy,
		width: trail.world.iw,
		height: trail.world.ih,
	};
	const topShade: ViewStyle = {
		position: "absolute",
		left: 0,
		right: 0,
		top: 0,
		height: PANEL.bubblesHeight + 20,
		experimental_backgroundImage: TOP_SHADE,
	};
	const bottomShade: ViewStyle = {
		position: "absolute",
		left: 0,
		right: 0,
		bottom: 0,
		height: size.height * 0.48,
		experimental_backgroundImage: BOTTOM_SHADE,
	};
	const info: ViewStyle = {
		position: "absolute",
		left: 20 * k,
		right: 20 * k,
		bottom: 18 * k,
		gap: 8 * k,
	};

	if (!ranking) {
		return (
			<View style={[size, { paddingTop: PANEL.bubblesHeight }]}>
				<View style={[s.root, s.center, { gap: 14 * k }]}>
					<Text style={s.title}>{PANEL_COPY.ranking.noTeam}</Text>
					<PanelButton
						label={PANEL_COPY.ranking.action}
						onPress={onOpen}
						testID="home-panel-ranking"
					/>
				</View>
			</View>
		);
	}

	return (
		<View style={size}>
			<View style={world} pointerEvents="none">
				<Image source={MAP_ART.trail} style={art} resizeMode="cover" />
				{trail.placed.map((spot) => (
					<MapCompetitor
						key={spot.team.id ?? spot.team.name}
						spot={spot}
						myRank={trail.myRank}
						isSelected={Boolean(spot.team.you)}
						replay={String(visit)}
						onPress={onOpen}
					/>
				))}
			</View>
			<Pressable
				style={fill}
				onPress={onOpen}
				accessibilityRole="button"
				accessibilityLabel={PANEL_COPY.ranking.action}
				testID="home-panel-ranking-trail"
			/>
			<View style={topShade} pointerEvents="none" />
			<View style={bottomShade} pointerEvents="none" />
			<View style={info} pointerEvents="box-none">
				<View style={[s.row, { alignItems: "flex-end" }]}>
					<Text style={[s.number, { fontSize: 40 * k, lineHeight: 44 * k }]}>{ranking.pos}</Text>
					<Text style={[s.strong, { marginBottom: 7 * k }]}>{ranking.place}</Text>
				</View>
				<Text style={s.small} numberOfLines={1}>
					{ranking.gap}
				</Text>
				<PanelBar fraction={ranking.fraction} grow={grow} />
				<PanelButton
					label={PANEL_COPY.ranking.action}
					onPress={onOpen}
					testID="home-panel-ranking"
				/>
			</View>
		</View>
	);
};
