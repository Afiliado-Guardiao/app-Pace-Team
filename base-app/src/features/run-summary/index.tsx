import React from "react";
import { Text, View } from "react-native";

import { useSafeAreaInsets } from "react-native-safe-area-context";

import {
	Button,
	GradientLayers,
	ScreenScroll,
	Tooltip,
	TopBar,
	useLayoutSize,
} from "@/components/pace";
import { RunMap } from "@/components/shared/RunMap";
import { useTheme } from "@/theme";
import { formatKm } from "@/lib/pace";

import { GroupRunDetail } from "./components/GroupRunDetail";
import { PointsCard } from "./components/PointsCard";
import { RunStatsCard } from "./components/RunStatsCard";
import { SplitsCard } from "./components/SplitsCard";
import { RUN_SUMMARY_COPY } from "./constants";
import { IRunSummaryVariant, useRunSummary } from "./hooks/useRunSummary";
import { createRunSummaryStyles, MAP_HEIGHT } from "./styles";

interface IRunSummaryScreenProps {
	variant: IRunSummaryVariant;
}

// 06c Corrida concluída / Detalhes da corrida (sozinho ou da equipe).
export const RunSummaryScreen: React.FC<IRunSummaryScreenProps> = ({ variant }) => {
	const { theme } = useTheme();
	const insets = useSafeAreaInsets();
	const { size, onLayout } = useLayoutSize();
	const run = useRunSummary(variant);
	const styles = createRunSummaryStyles(theme, insets);
	const halfway = `${formatKm(run.km / 2)} km`;

	const soloContent = [
		<View key="head">
			<Text style={styles.meta}>{run.meta}</Text>
			<Text style={styles.title}>{run.runTitle}</Text>
		</View>,
		<RunStatsCard key="stats" seconds={run.seconds} km={run.km} />,
		<PointsCard key="points" points={run.points} status={run.status} />,
		run.isDetail && run.splits.length ? <SplitsCard key="splits" splits={run.splits} /> : null,
		run.isDetail ? null : (
			<Button key="save" size="lg" fullWidth icon="check" onPress={run.save} testID="run-save">
				{RUN_SUMMARY_COPY.save}
			</Button>
		),
		run.isDetail ? null : (
			<Button
				key="detail"
				variant="glass"
				fullWidth
				onPress={run.openDetail}
				testID="run-open-detail"
			>
				{RUN_SUMMARY_COPY.details}
			</Button>
		),
	];

	return (
		<View style={styles.root} onLayout={onLayout}>
			<View style={styles.map} pointerEvents="none">
				<RunMap route={run.route} progress={1} interactive={false} friends={run.pins} />
			</View>
			<View style={styles.map} pointerEvents="none">
				{size ? (
					<GradientLayers
						layers={theme.pace.gradients.summaryMapFade}
						width={size.width}
						height={MAP_HEIGHT}
					/>
				) : null}
			</View>
			<ScreenScroll contentStyle={styles.content}>
				{run.isGroup ? <GroupRunDetail /> : soloContent}
			</ScreenScroll>
			<View style={styles.tooltip} pointerEvents="none">
				<Tooltip>{halfway}</Tooltip>
			</View>
			<View style={styles.topBar}>
				<TopBar
					title={run.title}
					onBack={run.goBack}
					right={
						run.canShare
							? { icon: "share-2", label: RUN_SUMMARY_COPY.share, onPress: run.share }
							: undefined
					}
				/>
			</View>
		</View>
	);
};
