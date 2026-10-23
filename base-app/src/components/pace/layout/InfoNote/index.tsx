import React from "react";
import { Text, View } from "react-native";

import { useTheme } from "@/theme";

import { Icon } from "../../core/Icon";
import { createLayoutTextStyles } from "../styles";

interface IInfoNoteProps {
	icon?: string;
	iconColor?: string;
	children: string;
}

const ICON_SIZE = 15;

// Nota de transparência em texto pequeno (verificação de pontos, privacidade…).
export const InfoNote: React.FC<IInfoNoteProps> = ({
	icon = "shield-check",
	iconColor,
	children,
}) => {
	const { theme } = useTheme();
	const styles = createLayoutTextStyles(theme);

	return (
		<View style={styles.note}>
			<Icon
				name={icon}
				size={ICON_SIZE}
				color={iconColor ?? theme.pace.colors.textTertiary}
				style={styles.noteIcon}
			/>
			<Text style={styles.noteText}>{children}</Text>
		</View>
	);
};
