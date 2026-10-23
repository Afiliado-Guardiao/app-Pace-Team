import React from "react";
import { Text, View } from "react-native";

import { ActivityGauge, GlassCard, Icon } from "@/components/pace";
import { useTheme } from "@/theme";

import { HOME_COPY } from "../../constants";
import { IWeekSummary } from "../../hooks/useWeekSummary";
import { InnerTile } from "../InnerTile";

import { createWeekCardStyles } from "./styles";

interface IWeekCardProps {
	week: IWeekSummary;
	onOpenTeam: () => void;
}

const GAUGE_SIZE = 230;
const ICON_SIZE = 18;

// Card principal do Início: medidor de km da semana + pontos e posição do time.
export const WeekCard: React.FC<IWeekCardProps> = ({ week, onOpenTeam }) => {
	const { theme } = useTheme();
	const styles = createWeekCardStyles(theme);

	return (
		<GlassCard padding={theme.pace.spacing.cardPad} radius={theme.pace.radii.hero}>
			<View style={styles.header}>
				<View style={styles.iconDot}>
					<Icon name="activity" size={ICON_SIZE} />
				</View>
				<View>
					<Text style={styles.title}>{HOME_COPY.weekTitle}</Text>
					<Text style={styles.subtitle}>{HOME_COPY.weekSubtitle}</Text>
				</View>
			</View>
			<View style={styles.gauge}>
				<ActivityGauge
					value={week.km}
					max={week.goal}
					size={GAUGE_SIZE}
					display={week.display}
					label={HOME_COPY.gaugeLabel}
				/>
			</View>
			<View style={styles.tiles}>
				<InnerTile
					icon="zap"
					lineA={HOME_COPY.pointsA}
					lineB={HOME_COPY.pointsB}
					value={week.points}
					unit="pts"
				/>
				<InnerTile
					icon="users"
					lineA={week.teamFirst}
					lineB={week.teamRest}
					value={week.rank}
					unit={HOME_COPY.teamUnit}
					onPress={onOpenTeam}
				/>
			</View>
		</GlassCard>
	);
};
