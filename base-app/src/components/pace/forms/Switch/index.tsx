import React from "react";
import { Pressable, Text } from "react-native";

import Animated from "react-native-reanimated";

import { useTheme } from "@/theme";

import { useToggle } from "../../hooks";

import { useSwitchAnimation } from "./hooks/useSwitchAnimation";
import { createSwitchStyles } from "./styles";
import { ISwitchProps } from "./types";

// Interruptor: ligado = laranja com brilho; o botão branco desliza com mola.
export const Switch: React.FC<ISwitchProps> = ({
	checked,
	defaultChecked,
	onChange,
	label,
	disabled = false,
	style,
	testID = "pace-switch",
}) => {
	const { theme } = useTheme();
	const { isOn, toggle } = useToggle({ checked, defaultChecked, onChange, disabled });
	const { trackStyle, thumbStyle } = useSwitchAnimation(isOn);
	const styles = createSwitchStyles(theme, { isOn, disabled });

	return (
		<Pressable
			testID={testID}
			accessibilityRole="switch"
			accessibilityLabel={label}
			accessibilityState={{ checked: isOn, disabled }}
			onPress={toggle}
			disabled={disabled}
			style={[styles.root, style]}
		>
			{label ? <Text style={styles.label}>{label}</Text> : null}
			<Animated.View style={[styles.track, trackStyle]}>
				<Animated.View style={[styles.thumb, thumbStyle]} />
			</Animated.View>
		</Pressable>
	);
};

export * from "./types";
