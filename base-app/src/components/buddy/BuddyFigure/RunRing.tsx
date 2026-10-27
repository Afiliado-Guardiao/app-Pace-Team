import React from "react";
import { View, ViewStyle } from "react-native";

import Animated from "react-native-reanimated";
import Svg, { Circle, Defs, LinearGradient, Stop } from "react-native-svg";

import { GradientLayers, useSvgId } from "@/components/pace";
import { IBuddyPhase } from "@/lib/buddy/constants";

import { anim, EASE_SPRING } from "../animations";

interface IRunRingProps {
	phase: IBuddyPhase;
}

const SIZE = 112;
const STREAK_W = [60, 84, 70, 92, 64, 50] as const;
const FILL: ViewStyle = { position: "absolute", top: 0, left: 0, right: 0, bottom: 0 };

// Anel laranja girando (conic-gradient do design: cauda transparente → laranja → quase branco)
const RingLayer: React.FC<{ inset: number; duration: string; isReverse?: boolean }> = ({
	inset,
	duration,
	isReverse,
}) => {
	const id = useSvgId("bd-ring");
	const size = SIZE - inset * 2;
	const r = size * 0.435;
	const stroke = size * 0.17;
	const circumference = 2 * Math.PI * r;

	return (
		<Animated.View
			style={[
				{ position: "absolute", left: inset, top: inset, width: size, height: size },
				anim(isReverse ? "spinr" : "spin", duration, { timing: "linear" }),
			]}
		>
			<Svg width={size} height={size}>
				<Defs>
					<LinearGradient id={id} x1="0" y1="0" x2="1" y2="1">
						<Stop offset="0" stopColor="#FD5A0C" stopOpacity={0} />
						<Stop offset="0.42" stopColor="#FD5A0C" stopOpacity={0.55} />
						<Stop offset="0.78" stopColor="#FD5A0C" />
						<Stop offset="1" stopColor="#FFE3D1" />
					</LinearGradient>
				</Defs>
				<Circle
					cx={size / 2}
					cy={size / 2}
					r={r}
					fill="none"
					stroke={`url(#${id})`}
					strokeWidth={stroke}
					strokeLinecap="round"
					strokeDasharray={`${String(circumference * 0.78)} ${String(circumference)}`}
				/>
			</Svg>
		</Animated.View>
	);
};

// Largada: anel "Vira um círculo" / "Máxima velocidade" + rastros de velocidade.
export const RunRing: React.FC<IRunRingProps> = ({ phase }) => {
	const isRing = phase === "ring" || phase === "max" || phase === "dash";
	const hasStreaks = phase === "run" || isRing;
	const isFast = phase === "max" || phase === "dash";

	return (
		<>
			{hasStreaks ? (
				<View
					style={{ position: "absolute", left: -46, top: 36, width: 96, height: 76, zIndex: 0 }}
					pointerEvents="none"
				>
					{STREAK_W.map((w, i) => (
						<Animated.View
							key={i}
							style={[
								{
									position: "absolute",
									right: 0,
									top: i * 13,
									width: w,
									height: isFast ? 4 : 3,
									borderRadius: 3,
									overflow: "hidden",
								},
								anim("streak", phase === "run" ? "0.42s" : "0.26s", {
									timing: "linear",
									delay: `${String(-i * 0.07)}s`,
								}),
							]}
						>
							<GradientLayers
								layers={[
									{
										type: "linear",
										angle: 270,
										stops: [
											{ offset: 0, color: "rgba(255,122,46,.95)" },
											{ offset: 1, color: "rgba(255,122,46,0)" },
										],
									},
								]}
								width={w}
								height={4}
							/>
						</Animated.View>
					))}
				</View>
			) : null}
			{isRing ? (
				<View
					style={{
						position: "absolute",
						left: 14,
						top: 58,
						width: SIZE,
						height: SIZE,
						zIndex: 2,
						transform: [{ scaleY: 0.3 }],
						boxShadow: "0 0 10px rgba(253,90,12,.6)",
						borderRadius: SIZE / 2,
					}}
					pointerEvents="none"
				>
					<Animated.View
						style={[FILL, anim("ringin", "0.4s", { timing: EASE_SPRING, count: 1, fill: "both" })]}
					>
						<View
							style={{
								position: "absolute",
								top: 10,
								left: 10,
								right: 10,
								bottom: 10,
								borderRadius: 46,
								backgroundColor: "rgba(253,90,12,.25)",
							}}
						/>
						<RingLayer inset={0} duration="0.32s" />
						<RingLayer inset={18} duration="0.24s" isReverse />
						{phase !== "ring" ? <RingLayer inset={-12} duration="0.2s" /> : null}
					</Animated.View>
				</View>
			) : null}
		</>
	);
};
