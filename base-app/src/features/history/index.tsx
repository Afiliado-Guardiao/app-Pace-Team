import React from "react";
import { View } from "react-native";

import {
	GlassCard,
	InfoNote,
	ScreenBackground,
	ScreenScroll,
	SegmentedControl,
	StatTile,
	TopBar,
} from "@/components/pace";
import { RunRow } from "@/components/shared/RunRow";
import { ITheme, useTheme } from "@/theme";

import { HISTORY_COPY, HISTORY_FILTERS } from "./constants";
import { useHistory } from "./hooks/useHistory";

const createHistoryStyles = (theme: ITheme) => ({
	root: { flex: 1 },
	totals: { flexDirection: "row" as const },
	cell: { flex: 1 },
	runs: { gap: theme.pace.spacing[2] },
});

// 14a Histórico: resumo do mês, filtro e lista de corridas.
export const HistoryScreen: React.FC = () => {
	const { theme } = useTheme();
	const history = useHistory();
	const styles = createHistoryStyles(theme);

	return (
		<View style={styles.root}>
			<ScreenBackground />
			<ScreenScroll>
				<TopBar
					title={HISTORY_COPY.title}
					onBack={history.goBack}
					right={{ icon: "calendar", label: HISTORY_COPY.calendar }}
				/>
				<GlassCard padding={16}>
					<View style={styles.totals}>
						<StatTile
							size="sm"
							label={history.month.label}
							value={history.month.km}
							unit="km"
							style={styles.cell}
						/>
						<StatTile
							size="sm"
							label={HISTORY_COPY.runs}
							value={history.month.runs}
							style={styles.cell}
						/>
						<StatTile
							size="sm"
							label={HISTORY_COPY.points}
							value={history.month.points}
							accent
							style={styles.cell}
						/>
					</View>
				</GlassCard>
				<SegmentedControl
					size="sm"
					options={HISTORY_FILTERS}
					value={history.filter}
					onChange={history.setFilter}
					testID="history-filter"
				/>
				<View style={styles.runs}>
					{history.runs.map((run, i) => (
						<RunRow
							key={run.id}
							run={run}
							seed={i}
							onPress={() => {
								history.openRun(run.id);
							}}
						/>
					))}
				</View>
				{history.isEmpty ? <InfoNote icon="footprints">{HISTORY_COPY.empty}</InfoNote> : null}
				{history.showInvalidNote ? (
					<InfoNote icon="info">{HISTORY_COPY.invalidNote}</InfoNote>
				) : null}
			</ScreenScroll>
		</View>
	);
};
