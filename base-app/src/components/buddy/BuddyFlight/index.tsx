import React from "react";
import { View } from "react-native";

import Animated from "react-native-reanimated";

import { useTheme } from "@/theme";

import { BuddyFigure } from "../BuddyFigure";

import { useBuddyFlight } from "./hooks/useBuddyFlight";
import { createBuddyFlightStyles } from "./styles";

const POSE = { act: "armsUp", phase: null, blink: false, gx: 0, gy: 0 } as const;

// O Buddy vivo voando do painel até o INICIAR da tela Correr
export const BuddyFlight: React.FC = () => {
	const { theme } = useTheme();
	const styles = createBuddyFlightStyles(theme);
	const flight = useBuddyFlight();

	if (!flight.isFlying) return null;
	return (
		<View style={styles.layer} pointerEvents="none">
			<Animated.View style={[styles.ring, flight.ringStyle]} />
			<Animated.View style={[styles.buddy, flight.buddyStyle]}>
				<BuddyFigure pose={POSE} color={flight.color} accessories={flight.accessories} />
			</Animated.View>
		</View>
	);
};
