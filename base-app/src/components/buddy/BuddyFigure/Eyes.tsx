import React from "react";
import { View, ViewStyle } from "react-native";

import Animated from "react-native-reanimated";

import { eyeOffset, eyeScale, IBuddyPose, isSleepAct } from "./pose";

interface IEyesProps {
	pose: IBuddyPose;
}

const INK = "#0B1520";
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
const OPEN: ViewStyle = { width: 10, height: 16, borderRadius: 8, backgroundColor: INK };
const FAST = {
	transitionProperty: "transform",
	transitionDuration: "0.09s",
	transitionTimingFunction: "ease-out",
} as const;

const Eye: React.FC<{ pose: IBuddyPose; index: 0 | 1 }> = ({ pose, index }) => {
	const { act } = pose;
	if (isSleepAct(act) && !(act === "peek" && index === 0)) return <View style={CLOSED} />;
	if (act === "celebrate") return <View style={HAPPY} />;
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
						backgroundColor: INK,
						transform: [{ rotate: index ? "12deg" : "-12deg" }],
					},
					{ transitionProperty: "height", transitionDuration: "0.09s" },
				]}
			/>
		);
	}
	const [sx, sy] = eyeScale(pose, index);
	return <Animated.View style={[OPEN, { transform: [{ scaleX: sx }, { scaleY: sy }] }, FAST]} />;
};

// Olhos do Buddy: abertos, piscando, dormindo, felizes ou doentes.
export const Eyes: React.FC<IEyesProps> = ({ pose }) => {
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
			<Eye pose={pose} index={0} />
			<Eye pose={pose} index={1} />
		</Animated.View>
	);
};
