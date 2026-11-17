import React from "react";
import { View, ViewStyle } from "react-native";

import Animated from "react-native-reanimated";

import { eyeOffset, eyeScale, IBuddyPose, isSleepAct } from "./pose";

interface IEyesProps {
	pose: IBuddyPose;
	// Bud preto: olho preto com aro claro e brilho forte (senão some no corpo)
	isOnDark?: boolean;
}

const INK = "#141210";
const ROW: ViewStyle = {
	position: "absolute",
	left: 0,
	right: 0,
	top: 22,
	height: 18,
	flexDirection: "row",
	justifyContent: "center",
	alignItems: "flex-start",
	gap: 20,
	zIndex: 1,
};
const CLOSED: ViewStyle = {
	width: 13,
	height: 7,
	marginTop: 6,
	borderBottomWidth: 2.6,
	borderColor: INK,
	borderBottomLeftRadius: 10,
	borderBottomRightRadius: 10,
};
const HAPPY: ViewStyle = {
	width: 13,
	height: 8,
	marginTop: 4,
	borderTopWidth: 3,
	borderColor: INK,
	borderTopLeftRadius: 10,
	borderTopRightRadius: 10,
};
// Olho da arte nova: oval preto brilhante, com reflexo suave no alto
const OPEN: ViewStyle = {
	width: 10,
	height: 15,
	borderRadius: 8,
	backgroundColor: INK,
	boxShadow: "0 1px 2px rgba(60,40,20,.35)",
};
const GLOSS: ViewStyle = {
	position: "absolute",
	left: 2,
	top: 2,
	width: 4,
	height: 5,
	borderRadius: 3,
	backgroundColor: "rgba(255,255,255,.28)",
};
// No Bud preto: aro claro em volta e reflexos mais fortes, como vidro
const OPEN_DARK: ViewStyle = {
	borderWidth: 0.9,
	borderColor: "rgba(170,176,186,.65)",
	boxShadow: "0 1px 3px rgba(0,0,0,.6)",
};
const GLOSS_DARK: ViewStyle = { backgroundColor: "rgba(255,255,255,.92)" };
const GLOSS_LOW: ViewStyle = {
	position: "absolute",
	right: 2,
	bottom: 2.5,
	width: 2,
	height: 2,
	borderRadius: 1,
	backgroundColor: "rgba(255,255,255,.45)",
};
// Olhos fechados e doentes no Bud preto: traço claro
const LINE_DARK = "#C9CDD3";
const FAST = {
	transitionProperty: "transform",
	transitionDuration: "0.09s",
	transitionTimingFunction: "ease-out",
} as const;

const Eye: React.FC<{ pose: IBuddyPose; index: 0 | 1; isOnDark: boolean }> = ({
	pose,
	index,
	isOnDark,
}) => {
	const { act } = pose;
	const ink = isOnDark ? LINE_DARK : INK;
	const color = { borderColor: ink };
	if (isSleepAct(act) && !(act === "peek" && index === 0)) return <View style={[CLOSED, color]} />;
	if (act === "celebrate") return <View style={[HAPPY, color]} />;
	if (act === "sick") {
		return (
			<Animated.View
				style={[
					{
						width: 11,
						height: pose.blink ? 2 : 9,
						marginTop: 7,
						borderTopLeftRadius: 2,
						borderTopRightRadius: 2,
						borderBottomLeftRadius: 6,
						borderBottomRightRadius: 6,
						backgroundColor: ink,
						transform: [{ rotate: index ? "12deg" : "-12deg" }],
					},
					{ transitionProperty: "height", transitionDuration: "0.09s" },
				]}
			/>
		);
	}
	const [sx, sy] = eyeScale(pose, index);
	return (
		<Animated.View
			style={[
				OPEN,
				isOnDark ? OPEN_DARK : null,
				{ transform: [{ scaleX: sx }, { scaleY: sy }] },
				FAST,
			]}
		>
			<View style={[GLOSS, isOnDark ? GLOSS_DARK : null]} />
			{isOnDark ? <View style={GLOSS_LOW} /> : null}
		</Animated.View>
	);
};

// Olhos do Buddy: abertos, piscando, dormindo, felizes ou doentes.
export const Eyes: React.FC<IEyesProps> = ({ pose, isOnDark = false }) => {
	const [ex, ey] = eyeOffset(pose);

	return (
		<Animated.View
			style={[
				ROW,
				{ transform: [{ translateX: ex }, { translateY: ey }] },
				{
					transitionProperty: "transform",
					transitionDuration: "0.14s",
					transitionTimingFunction: "ease-out",
				},
			]}
		>
			<Eye pose={pose} index={0} isOnDark={isOnDark} />
			<Eye pose={pose} index={1} isOnDark={isOnDark} />
		</Animated.View>
	);
};
