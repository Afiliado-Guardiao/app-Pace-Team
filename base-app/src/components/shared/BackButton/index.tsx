import React from "react";
import { Pressable, View } from "react-native";

import { CaretLeftIcon } from "phosphor-react-native";

import { useTheme } from "@/theme";

import { useBackButton } from "./hooks";
import { createBackButtonStyles } from "./styles";
import { IBackButtonProps } from "./types";

export const BackButton: React.FC<IBackButtonProps> = ({ onPress, disabled }) => {
	const { theme } = useTheme();
	const { handlePress } = useBackButton({ onPress, disabled });
	const styles = createBackButtonStyles(theme, disabled);

	return (
		<Pressable
			testID="btn-back"
			accessibilityLabel="Go back"
			style={styles.button}
			onPress={handlePress}
			disabled={disabled}
		>
			<View pointerEvents="none">
				<CaretLeftIcon size={theme.componentSizes.icon.sm} color={theme.colors.text} />
			</View>
		</Pressable>
	);
};
