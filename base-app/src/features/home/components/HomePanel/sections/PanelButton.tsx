import React from "react";
import { Pressable, Text, TextStyle, ViewStyle } from "react-native";

import { Icon } from "@/components/pace";
import { useTheme } from "@/theme";

import { ACRYLIC } from "../constants";

interface IPanelButtonProps {
	label: string;
	onPress: () => void;
	testID: string;
	// Botão principal (laranja); o padrão é o de vidro "Ver …"
	isPrimary?: boolean;
	isWide?: boolean;
}

const H = 40;

// Pílula "Ver … ›" das seções (vidro branco 8%, borda 20%)
export const PanelButton: React.FC<IPanelButtonProps> = ({
	label,
	onPress,
	testID,
	isPrimary = false,
	isWide = false,
}) => {
	const { theme } = useTheme();
	const { colors, typography } = theme.pace;
	const box: ViewStyle = {
		height: H,
		paddingHorizontal: 16,
		borderRadius: H / 2,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		gap: 4,
		alignSelf: isWide ? "stretch" : "center",
		flexGrow: isWide ? 1 : 0,
		backgroundColor: isPrimary ? colors.accent : ACRYLIC.button,
		borderWidth: 1,
		borderColor: isPrimary ? colors.accent : ACRYLIC.buttonBorder,
	};
	const text: TextStyle = {
		fontFamily: typography.fonts.bold,
		fontSize: 13,
		color: colors.textPrimary,
	};

	return (
		<Pressable
			style={({ pressed }) => [box, pressed && { opacity: 0.8 }]}
			onPress={onPress}
			accessibilityRole="button"
			accessibilityLabel={label}
			testID={testID}
		>
			<Text style={text}>{label}</Text>
			<Icon name="chevron-right" size={16} strokeWidth={2.4} />
		</Pressable>
	);
};
