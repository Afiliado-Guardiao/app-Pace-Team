import React from "react";
import { Text, View } from "react-native";

import Svg, { Circle } from "react-native-svg";

import { BuddyFigure, IBuddyPose } from "@/components/buddy";
import { Icon } from "@/components/pace";
import { useTheme } from "@/theme";
import { IBuddyAccessoryId } from "@/lib/buddy";

import { IProSectionId } from "../constants";
import { PANEL_COPY, PRO_PREVIEW } from "../copy";
import { IPanelData } from "../hooks/usePanelData";

import { createProPreviewStyles } from "./proPreviewStyles";

interface IProPreviewProps {
	id: IProSectionId;
	data: IPanelData["pro"];
	k: number;
}

const POSE: IBuddyPose = { act: "idle", phase: null, blink: false, gx: 0, gy: 0 };
const NO_ACCESSORIES = [] as const;
const BUD = { w: 140, h: 135 };

const MiniBud: React.FC<{ size: number; accessory?: IBuddyAccessoryId }> = ({
	size,
	accessory,
}) => {
	const scale = size / BUD.w;
	return (
		<View style={{ width: size, height: BUD.h * scale }}>
			<View style={{ transform: [{ scale }], transformOrigin: "0% 0%" }}>
				<BuddyFigure
					pose={POSE}
					color="branco"
					accessories={accessory ? [accessory] : NO_ACCESSORIES}
				/>
			</View>
		</View>
	);
};

// Miniatura de cada tela do Pro (as mesmas do app), para ver antes de assinar
export const ProPreview: React.FC<IProPreviewProps> = ({ id, data, k }) => {
	const { theme } = useTheme();
	const s = createProPreviewStyles(theme, k);

	if (id === "ai") {
		return (
			<View style={s.stack}>
				<View style={s.row}>
					<MiniBud size={54 * k} />
					<View style={s.speech}>
						<Text style={s.speechText}>{data.greeting}</Text>
					</View>
				</View>
				{PRO_PREVIEW.questions.map((q) => (
					<View key={q} style={s.chip}>
						<Text style={s.chipText}>{q}</Text>
					</View>
				))}
			</View>
		);
	}
	if (id === "hydration") {
		const ring = 112 * k;
		return (
			<View style={[s.stack, s.center]}>
				<View style={[s.ring, { width: ring, height: ring }]}>
					<Svg width={ring} height={ring} style={s.abs}>
						<Circle
							cx={ring / 2}
							cy={ring / 2}
							r={ring / 2 - 5}
							stroke={s.ringTrack.color}
							strokeWidth={8}
							fill="none"
						/>
					</Svg>
					<MiniBud size={40 * k} />
					<Text style={s.ringText}>{PRO_PREVIEW.waterTitle}</Text>
				</View>
				<View style={[s.row, s.center]}>
					{PRO_PREVIEW.cups.map((cup) => (
						<View key={cup} style={s.cup}>
							<Icon name="glass-water" size={13 * k} strokeWidth={2.2} />
							<Text style={s.chipText}>{cup}</Text>
						</View>
					))}
				</View>
			</View>
		);
	}
	if (id === "studio") {
		return (
			<View style={s.grid}>
				{PRO_PREVIEW.studioAccessories.map((a) => (
					<View key={a.id} style={s.tile}>
						<MiniBud size={44 * k} accessory={a.id} />
						<View style={s.badge}>
							<Text style={s.badgeText}>{PANEL_COPY.pro}</Text>
						</View>
						<Text style={s.tileText} numberOfLines={1}>
							{a.name}
						</Text>
					</View>
				))}
			</View>
		);
	}
	const max = Math.max(1, ...data.weeks);
	const last = data.weeks.length - 1;
	return (
		<View style={s.stack}>
			<Text style={s.kicker}>{PRO_PREVIEW.thisWeek}</Text>
			<Text style={s.teamName} numberOfLines={1}>
				{data.teamName}
			</Text>
			<View style={[s.row, s.baseline]}>
				<Text style={s.bigNumber}>{data.teamKm}</Text>
				<Text style={s.chipText}>km</Text>
			</View>
			<View style={s.bars}>
				{data.weeks.map((km, i) => (
					<View key={data.weekLabels[i] ?? i} style={s.barCol}>
						<View
							style={[s.bar, { height: Math.max(4, (km / max) * 54 * k) }, i === last && s.barNow]}
						/>
						<Text style={s.barLabel}>{data.weekLabels[i]}</Text>
					</View>
				))}
			</View>
		</View>
	);
};
