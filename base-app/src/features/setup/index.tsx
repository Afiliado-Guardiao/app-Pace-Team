import React from "react";
import { View } from "react-native";

import { FloatingToast, ScreenBackground, ScreenScroll } from "@/components/pace";
import { ITheme, useTheme } from "@/theme";
import { PHOTOS } from "@/lib/pace";

import { MedalOverlay } from "./components/MedalOverlay";
import { SetupProgress } from "./components/SetupProgress";
import { StepAcc } from "./components/StepAcc";
import { StepCall } from "./components/StepCall";
import { StepCare } from "./components/StepCare";
import { StepDone } from "./components/StepDone";
import { StepGoal } from "./components/StepGoal";
import { StepInvites } from "./components/StepInvites";
import { StepPro } from "./components/StepPro";
import { StepTeam } from "./components/StepTeam";
import { useSetupScreen } from "./hooks/useSetupScreen";

const createSetupStyles = (theme: ITheme) => ({
	root: { flex: 1 },
	content: { gap: theme.pace.spacing[5], paddingTop: theme.pace.spacing[2] },
});

// Onboarding depois da conta (03 Buddy · 04 objetivo · 05 equipe ·
// 06 convites · 07 Team Pro · 08 conclusão), uma etapa por vez
export const SetupScreen: React.FC = () => {
	const { theme } = useTheme();
	const s = useSetupScreen();
	const styles = createSetupStyles(theme);

	return (
		<View style={styles.root}>
			<ScreenBackground photo={PHOTOS.teamRunningSunset} />
			<ScreenScroll contentStyle={styles.content} key={s.step}>
				<SetupProgress current={s.segment} onBack={s.canBack ? s.back : undefined} />
				{s.step === "acc" ? <StepAcc onDone={s.next} /> : null}
				{s.step === "call" ? <StepCall onDone={s.next} /> : null}
				{s.step === "care" ? <StepCare onDone={s.next} /> : null}
				{s.step === "goal" ? <StepGoal goal={s.goal} onPick={s.pickGoal} onDone={s.next} /> : null}
				{s.step === "team" ? <StepTeam team={s.team} onSolo={s.solo} /> : null}
				{s.step === "invites" ? (
					<StepInvites team={s.myTeam} inv={s.inv} isPro={s.isPro} onFinish={s.finishTeam} />
				) : null}
				{s.step === "pro" ? (
					<StepPro
						teamName={s.myTeam?.name ?? ""}
						people={s.people}
						onPro={s.openPro}
						onSkip={s.next}
					/>
				) : null}
				{s.step === "done" ? (
					<StepDone
						name={s.name}
						handle={s.handle}
						chips={s.chips}
						hasMedal={Boolean(s.myTeam)}
						onFinish={s.finish}
					/>
				) : null}
			</ScreenScroll>
			<MedalOverlay open={s.isMedalOpen} teamName={s.myTeam?.name ?? ""} onDone={s.closeMedal} />
			<FloatingToast toast={s.toast} />
		</View>
	);
};
