import React from "react";
import { View } from "react-native";

import {
	ActivityGauge,
	Button,
	GlassCard,
	Podium,
	ProgressBar,
	RankRow,
	StatTile,
} from "@/components/pace";
import { useTheme } from "@/theme";

import { TEAMS } from "../../constants";
import { createCatalogSectionStyles } from "../../styles";
import { ICatalogState } from "../../types";
import { CatalogSection } from "../CatalogSection";

interface IDataShowcaseProps {
	catalog: ICatalogState;
}

// Medidor, métricas, barras, pódio e ranking (com animações de entrada).
export const DataShowcase: React.FC<IDataShowcaseProps> = ({ catalog }) => {
	const { theme } = useTheme();
	const styles = createCatalogSectionStyles(theme);

	return (
		<View key={catalog.replayKey} style={styles.column}>
			<CatalogSection title="Dados" caption="as animações rodam ao abrir a tela">
				<Button variant="outline" size="sm" icon="rotate-ccw" onPress={catalog.replay}>
					Rever animações
				</Button>
				<GlassCard>
					<View style={styles.rowCenter}>
						<ActivityGauge
							value={72}
							display="2.140"
							unit="pts"
							label="Pontos da semana"
							size={200}
						/>
					</View>
				</GlassCard>
				<GlassCard>
					<View style={styles.row}>
						<StatTile icon="flame" label="Sequência" value="12" unit="dias" accent size="sm" />
						<StatTile icon="zap" label="Ritmo" value={"5'07\""} unit="/km" size="sm" />
						<StatTile icon="medal" label="Posição" value="4º" size="sm" />
					</View>
				</GlassCard>
				<ProgressBar value={68} label="Meta da semana" valueLabel="34 / 50 km" />
				<ProgressBar value={100} tone="success" label="Desafio concluído" valueLabel="100%" />
			</CatalogSection>

			<CatalogSection title="Pódio">
				<Podium teams={TEAMS.slice(0, 3)} />
			</CatalogSection>

			<CatalogSection title="Ranking" caption="seu time em vidro laranja">
				{TEAMS.map((team, index) => (
					<RankRow
						key={team.name}
						position={index + 1}
						name={team.name}
						city={team.city}
						points={team.points}
						km={team.km}
						delta={team.delta}
						isYou={team.isYou}
					/>
				))}
			</CatalogSection>
		</View>
	);
};
