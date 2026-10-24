import React from "react";
import { Text, View } from "react-native";

import { Badge, CountUp, GlassSurface, Highlight, Icon } from "@/components/pace";
import { useTheme } from "@/theme";
import { IViradaView } from "@/lib/data";

import { VIRADA_COPY } from "../../constants";
import { TeamSide } from "../TeamSide";
import { TugBar } from "../TugBar";

import { createViradaHeroStyles } from "./styles";

interface IViradaHeroProps {
	virada: IViradaView;
	title: { start: string; highlight: string };
	// "2d 14h" até o ranking fechar
	closesIn: string;
}

const VS_ICON = 16;

// Placar do confronto: estado, título, os dois times, barra de disputa e números.
export const ViradaHero: React.FC<IViradaHeroProps> = ({ virada, title, closesIn }) => {
	const { theme } = useTheme();
	const { scenario, team, rival } = virada;
	const isDone = virada.state === "done";
	const styles = createViradaHeroStyles(theme, scenario.tone, isDone);
	const diff = scenario.us - scenario.rival;
	const diffText = `${diff > 0 ? "+" : ""}${String(diff)}`;

	return (
		<GlassSurface appearance={styles.appearance} radius={theme.pace.radii.hero} style={styles.card}>
			<View style={styles.center}>
				<Badge tone={scenario.tone} dot>
					{scenario.label}
				</Badge>
				<Text style={styles.title}>
					{title.start} <Highlight>{title.highlight}</Highlight>
				</Text>
				<Text style={styles.sub}>{scenario.sub}</Text>
			</View>
			<View style={styles.matchup}>
				<View style={styles.side}>
					<TeamSide
						name={team.name}
						city={team.city}
						points={scenario.us}
						position={scenario.pos}
						isUs
					/>
				</View>
				<View style={styles.vs}>
					<View style={styles.vsBadge}>
						<Text style={styles.vsText}>{VIRADA_COPY.vs}</Text>
					</View>
					<Icon name={scenario.icon} size={VS_ICON} color={styles.toneColor} />
				</View>
				<View style={styles.side}>
					<TeamSide
						name={rival.name}
						city={rival.city}
						points={scenario.rival}
						position={scenario.rivalPos}
						alignRight
					/>
				</View>
			</View>
			<View style={styles.tug}>
				<TugBar progress={scenario.progress} isDone={isDone} />
			</View>
			<View style={styles.stats}>
				<View style={styles.stat}>
					<Text style={[styles.statValue, styles.statAccent]}>
						<CountUp key={diffText} value={diffText} />
					</Text>
					<Text style={styles.statLabel}>{VIRADA_COPY.difference}</Text>
				</View>
				<View style={[styles.stat, styles.statDivider]}>
					<Text style={styles.statValue}>{scenario.pos}º</Text>
					<Text style={styles.statLabel}>{VIRADA_COPY.position}</Text>
				</View>
				<View style={[styles.stat, styles.statDivider]}>
					<Text style={styles.statValue}>{closesIn}</Text>
					<Text style={styles.statLabel}>{VIRADA_COPY.closesIn}</Text>
				</View>
			</View>
		</GlassSurface>
	);
};
