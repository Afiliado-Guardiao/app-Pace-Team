import React from "react";
import { Image, Text, View, ViewStyle } from "react-native";

import Animated from "react-native-reanimated";

import { useTheme } from "@/theme";

import budSymbol from "../../../../../../assets/brand/symbol.png";
import { PANEL } from "../constants";
import { PANEL_COPY } from "../copy";
import { useSlowSpin } from "../hooks/useSlowSpin";

import { PanelButton } from "./PanelButton";
import { createSectionStyles } from "./styles";
import { WheelArt } from "./WheelArt";

interface IWheelSectionProps {
	isActive: boolean;
	k: number;
	onStart: () => void;
}

const WHEEL = 0.92;
const HUB = 0.31;
const PIN = 16;

// Roleta: metade da roleta da equipe subindo do pé do card, girando devagar,
// e "Começar" leva para a roleta de verdade
export const WheelSection: React.FC<IWheelSectionProps> = ({ isActive, k, onStart }) => {
	const { theme } = useTheme();
	const s = createSectionStyles(theme, k);
	const spin = useSlowSpin(isActive);
	const w = PANEL.baseWidth * k;
	const h = PANEL.sectionHeight * k;
	const size = w * WHEEL;
	const hub = size * HUB;
	const top = h - size / 2;
	const wheel: ViewStyle = {
		position: "absolute",
		left: (w - size) / 2,
		top,
		width: size,
		height: size,
		borderRadius: size / 2,
		boxShadow: `0 0 40px ${theme.pace.colors.accentSoft}`,
	};
	const hubBox: ViewStyle = {
		position: "absolute",
		left: (w - hub) / 2,
		top: h - hub / 2,
		width: hub,
		height: hub,
		borderRadius: hub / 2,
		alignItems: "center",
		paddingTop: hub * 0.14,
	};
	const pin: ViewStyle = {
		position: "absolute",
		left: w / 2 - PIN / 2,
		top: top - PIN / 2,
		width: PIN,
		height: PIN,
		borderRadius: PIN / 2,
		backgroundColor: theme.pace.colors.accent,
		boxShadow: `0 0 14px ${theme.pace.colors.accent}`,
	};

	return (
		<View style={{ width: w, height: h }}>
			<Animated.View style={[wheel, spin]} pointerEvents="none">
				<WheelArt size={size} />
			</Animated.View>
			<View style={hubBox} pointerEvents="none">
				<Image
					source={budSymbol}
					style={{ width: hub * 0.62, height: hub * 0.3 }}
					resizeMode="contain"
				/>
			</View>
			<View style={pin} pointerEvents="none" />
			<View style={[s.root, { height: top - PIN, justifyContent: "center", gap: 10 * k }]}>
				<Text style={s.title}>{PANEL_COPY.wheel.title}</Text>
				<Text style={s.text}>{PANEL_COPY.wheel.text}</Text>
				<PanelButton
					label={PANEL_COPY.wheel.action}
					onPress={onStart}
					isPrimary
					testID="home-panel-open-wheel"
				/>
			</View>
		</View>
	);
};
