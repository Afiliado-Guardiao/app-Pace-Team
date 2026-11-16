import React from "react";
import { Text, View } from "react-native";

import { FloatingToast, ScreenBackground, ScreenScroll, TopBar } from "@/components/pace";
import { ITheme, useTheme } from "@/theme";
import { useHydrationStore } from "@/lib/hydration";
import { PHOTOS } from "@/lib/pace";

import { HydroLog } from "./components/HydroLog";
import { HydroProfile } from "./components/HydroProfile";
import { HydroReminders } from "./components/HydroReminders";
import { HydroRunCard } from "./components/HydroRunCard";
import { HydroSheets } from "./components/HydroSheets";
import { HydroSweatCard } from "./components/HydroSweatCard";
import { HydroToday } from "./components/HydroToday";
import { HydroWeek } from "./components/HydroWeek";
import { HYDRO_COPY as C } from "./constants";
import { useHydrationScreen } from "./hooks/useHydrationScreen";

const createHydrationStyles = (theme: ITheme) => ({
	root: { flex: 1 },
	disclaimer: {
		fontFamily: theme.pace.typography.fonts.medium,
		fontSize: theme.pace.typography.sizes.xs,
		lineHeight: theme.pace.typography.sizes.xs * 1.5,
		color: theme.pace.colors.textTertiary,
		textAlign: "center" as const,
	},
});

// PACE HYDRATION (4º pilar do Team Pro): o dia em água, corrida, suor,
// lembretes e os dados do atleta
export const HydrationScreen: React.FC = () => {
	const { theme } = useTheme();
	const s = useHydrationScreen();
	const tests = useHydrationStore((st) => st.tests);
	const styles = createHydrationStyles(theme);
	const { hydro } = s;

	return (
		<View style={styles.root}>
			<ScreenBackground photo={PHOTOS.runnerCitySunset} />
			<ScreenScroll bottom={40} testID="hydration-scroll">
				<TopBar title={C.title} onBack={s.goBack} />
				<HydroToday
					hydro={hydro}
					onAdd={(ml) => {
						s.add(ml);
					}}
					onOther={() => {
						s.amount.open("day");
					}}
					onEditData={s.body.open}
				/>
				<HydroLog logs={hydro.todayLogs} onRemove={s.remove} />
				<HydroRunCard
					hydro={hydro}
					onLogPost={(ml) => {
						s.add(ml, "post");
					}}
				/>
				<HydroWeek week={hydro.week} baseMl={hydro.baseMl} />
				<HydroSweatCard tests={tests} personalRate={hydro.personalRate} onAdd={s.sweat.open} />
				<HydroReminders reminders={s.reminders} onChange={s.setReminders} />
				<HydroProfile
					body={hydro.body}
					hasRestriction={hydro.hasRestriction}
					onEdit={s.body.open}
				/>
				<Text style={styles.disclaimer}>{C.disclaimer}</Text>
			</ScreenScroll>
			<HydroSheets amount={s.amount} body={s.body} sweat={s.sweat} />
			<FloatingToast toast={s.toast} />
		</View>
	);
};
