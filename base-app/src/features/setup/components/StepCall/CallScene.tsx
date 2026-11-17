import React from "react";
import { View } from "react-native";

import Animated, { ZoomIn } from "react-native-reanimated";

import { BuddyFigure, IBuddyPose } from "@/components/buddy";
import { Icon } from "@/components/pace";
import { IBuddyAccessoryId } from "@/lib/buddy/constants";

import { ICallMode } from "../../hooks/useStepCall";
import { BuddyBubble } from "../BuddyBubble";
import { PhoneBack } from "../PhoneBack";

import { IStepCallStyles } from "./styles";

interface ICallSceneProps {
	mode: ICallMode;
	tapBeat: number;
	isListening: boolean;
	isBuddyIn: boolean;
	bubble: string;
	worn: IBuddyAccessoryId[];
	styles: IStepCallStyles;
}

const WAVE: IBuddyPose = { act: "wave", phase: null, blink: false, gx: 0, gy: 0 };
const ICON = 34;

// Ícone de cada aba: celular (toque duplo), microfone (Siri), gota (água)
// ou relógio
const SceneIcon: React.FC<Pick<ICallSceneProps, "mode" | "tapBeat" | "isListening" | "styles">> = ({
	mode,
	tapBeat,
	isListening,
	styles,
}) => {
	if (mode === "tap") return <PhoneBack beat={tapBeat} />;
	const icon = { siri: "mic", water: "droplets", watch: "watch" }[mode];
	return (
		<View style={[styles.mic, isListening ? styles.micOn : null]}>
			<Icon name={icon} size={ICON} color={styles.accent} />
		</View>
	);
};

// Cena do 3b: o jeito de chamar à esquerda e o Bud respondendo à direita.
export const CallScene: React.FC<ICallSceneProps> = (props) => {
	const { isBuddyIn, bubble, worn, styles } = props;

	return (
		<View style={styles.scene}>
			<SceneIcon {...props} />
			{isBuddyIn ? (
				<Animated.View entering={ZoomIn.springify().damping(12)} style={styles.buddyCol}>
					<BuddyBubble text={bubble} />
					<View style={styles.buddy} pointerEvents="none">
						<View style={styles.buddyInner}>
							<BuddyFigure pose={WAVE} color="branco" accessories={worn} />
						</View>
					</View>
				</Animated.View>
			) : (
				<View style={styles.buddyCol} />
			)}
		</View>
	);
};
