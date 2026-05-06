// Estilos hardcoded — não pode depender do ThemeProvider porque o ErrorBoundary é a última linha de defesa

import { StyleSheet } from "react-native";

export const createErrorFallbackStyles = () => {
	return StyleSheet.create({
		container: {
			flex: 1,
			backgroundColor: "#f9fafb",
			alignItems: "center",
			justifyContent: "center",
			padding: 24,
		},
		card: {
			backgroundColor: "#ffffff",
			borderRadius: 16,
			padding: 32,
			alignItems: "center",
			maxWidth: 400,
			width: "100%",
			shadowColor: "#000000",
			shadowOffset: {
				width: 0,
				height: 4,
			},
			shadowOpacity: 0.1,
			shadowRadius: 12,
			elevation: 8,
		},
		iconContainer: {
			width: 80,
			height: 80,
			borderRadius: 40,
			backgroundColor: "#fee2e2",
			alignItems: "center",
			justifyContent: "center",
			marginBottom: 24,
		},
		icon: {
			fontSize: 40,
		},
		title: {
			fontSize: 24,
			fontWeight: "700",
			color: "#1f2937",
			marginBottom: 12,
			textAlign: "center",
			letterSpacing: -0.5,
		},
		message: {
			fontSize: 16,
			color: "#6b7280",
			textAlign: "center",
			marginBottom: 8,
			lineHeight: 24,
		},
		errorDetails: {
			fontSize: 14,
			color: "#6b7280",
			textAlign: "center",
			marginBottom: 32,
			lineHeight: 20,
			fontStyle: "italic",
			paddingHorizontal: 12,
		},
		button: {
			backgroundColor: "#1f2937",
			paddingHorizontal: 40,
			paddingVertical: 16,
			borderRadius: 12,
			minWidth: 200,
			alignItems: "center",
			shadowColor: "#000000",
			shadowOffset: {
				width: 0,
				height: 2,
			},
			shadowOpacity: 0.15,
			shadowRadius: 4,
			elevation: 3,
		},
		buttonPressed: {
			backgroundColor: "#6b7280",
			transform: [{ scale: 0.98 }],
		},
		buttonText: {
			color: "#ffffff",
			fontSize: 16,
			fontWeight: "700",
			letterSpacing: 0.5,
		},
	});
};
