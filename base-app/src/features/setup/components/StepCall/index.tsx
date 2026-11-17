import React from "react";
import { Text, View } from "react-native";

import { Button, SegmentedControl } from "@/components/pace";
import { useTheme } from "@/theme";

import { SETUP_COPY as C } from "../../constants";
import { toCallMode, useStepCall } from "../../hooks/useStepCall";
import { useWorn } from "../../hooks/useWorn";
import { SubDots } from "../SubDots";

import { CallDetails } from "./CallDetails";
import { CallScene } from "./CallScene";
import { createStepCallStyles } from "./styles";

interface IStepCallProps {
	onDone: () => void;
}

const TABS = [
	{ value: "tap", label: C.callTap },
	{ value: "siri", label: C.callSiri },
	{ value: "water", label: C.callWater, badge: C.callPro },
	{ value: "watch", label: C.callWatch },
] as const;

// 3b · "Me chame quando quiser": toque duplo, Siri, água (Pro) e relógio
export const StepCall: React.FC<IStepCallProps> = ({ onDone }) => {
	const { theme } = useTheme();
	const worn = useWorn();
	const styles = createStepCallStyles(theme);
	const call = useStepCall();

	return (
		<View style={styles.root}>
			<View>
				<Text style={styles.title}>{C.callTitle}</Text>
				<Text style={styles.hint}>{C.callSub}</Text>
			</View>
			<SegmentedControl
				size="sm"
				options={TABS}
				value={call.mode}
				onChange={(value) => {
					call.setMode(toCallMode(value));
				}}
			/>
			<CallScene
				mode={call.mode}
				tapBeat={call.tapBeat}
				isListening={call.isListening}
				isBuddyIn={call.isBuddyIn}
				bubble={call.bubble}
				worn={worn}
				styles={styles}
			/>
			<CallDetails mode={call.mode} onSay={call.say} styles={styles} />
			<SubDots index={1} />
			<Button
				size="lg"
				fullWidth
				iconRight="chevron-right"
				onPress={onDone}
				testID="setup-call-cta"
			>
				{C.callCta}
			</Button>
		</View>
	);
};
