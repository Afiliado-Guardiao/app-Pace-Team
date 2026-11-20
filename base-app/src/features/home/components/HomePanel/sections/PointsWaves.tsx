import React from "react";

import Animated, { SharedValue, useAnimatedProps } from "react-native-reanimated";
import Svg, { Defs, G, LinearGradient, Mask, Path, Rect, Stop } from "react-native-svg";

import { useSvgId } from "@/components/pace";
import { useTheme } from "@/theme";

import { ACRYLIC } from "../constants";

interface IPointsWavesProps {
	width: number;
	seconds: SharedValue<number>;
}

interface IWave {
	color: string;
	amp: number;
	period: number;
	duration: number;
}

const H = 40;
const STEP = 4;
const AnimatedPath = Animated.createAnimatedComponent(Path);

// Senoide deslizando para a esquerda (fase cresce com o tempo)
const wavePath = (w: number, wave: IWave, t: number): string => {
	"worklet";
	const phase = (2 * Math.PI * t) / wave.duration;
	let d = "";
	for (let x = 0; x <= w; x += STEP) {
		const y = H / 2 + wave.amp * Math.sin((2 * Math.PI * x) / wave.period + phase);
		d += `${x === 0 ? "M" : "L"}${x.toFixed(1)} ${y.toFixed(1)} `;
	}
	return d;
};

const WaveLine: React.FC<{ width: number; wave: IWave; seconds: SharedValue<number> }> = ({
	width,
	wave,
	seconds,
}) => {
	const props = useAnimatedProps(() => ({ d: wavePath(width, wave, seconds.value) }));
	return <AnimatedPath animatedProps={props} stroke={wave.color} strokeWidth={1.6} fill="none" />;
};

// Três ondas (laranja, pêssego e branca) com as pontas sumindo por máscara
export const PointsWaves: React.FC<IPointsWavesProps> = ({ width, seconds }) => {
	const { theme } = useTheme();
	const id = useSvgId("hp-waves");
	const waves: IWave[] = [
		{ color: theme.pace.colors.accent, amp: 9, period: 120, duration: 3.2 },
		{ color: ACRYLIC.peach, amp: 7, period: 80, duration: 4.4 },
		{ color: ACRYLIC.white75, amp: 6, period: 160, duration: 5.6 },
	];

	return (
		<Svg width={width} height={H}>
			<Defs>
				<LinearGradient id={`${id}f`} x1="0" y1="0" x2="1" y2="0">
					<Stop offset="0" stopColor="#fff" stopOpacity={0} />
					<Stop offset="0.2" stopColor="#fff" stopOpacity={1} />
					<Stop offset="0.8" stopColor="#fff" stopOpacity={1} />
					<Stop offset="1" stopColor="#fff" stopOpacity={0} />
				</LinearGradient>
				<Mask id={`${id}m`}>
					<Rect width={width} height={H} fill={`url(#${id}f)`} />
				</Mask>
			</Defs>
			<G mask={`url(#${id}m)`}>
				{waves.map((w) => (
					<WaveLine key={w.period} width={width} wave={w} seconds={seconds} />
				))}
			</G>
		</Svg>
	);
};
