import React from "react";
import { Pressable, View } from "react-native";

import { BuddyFigure } from "../BuddyFigure";

import { useBuddyWave } from "./hooks/useBuddyWave";
import { createBuddyButtonStyles } from "./styles";

interface IBuddyButtonProps {
	label: string;
	onPress: () => void;
	size?: number;
	testID?: string;
}

const SCALE = 0.42;
const NO_ACCESSORIES = [] as const;
const HIT_SLOP = 6;

// Botão do Buddy (branco, sempre parado no lugar) que dá tchau
export const BuddyButton: React.FC<IBuddyButtonProps> = ({
	label,
	onPress,
	size = 44,
	testID = "buddy-button",
}) => {
	const { pose } = useBuddyWave();
	const styles = createBuddyButtonStyles(size, SCALE);

	return (
		<Pressable
			testID={testID}
			accessibilityRole="button"
			accessibilityLabel={label}
			hitSlop={HIT_SLOP}
			onPress={onPress}
			style={({ pressed }) => [styles.root, pressed && { opacity: 0.75 }]}
		>
			<View style={styles.figure} pointerEvents="none">
				<BuddyFigure pose={pose} color="branco" accessories={NO_ACCESSORIES} />
			</View>
		</Pressable>
	);
};
