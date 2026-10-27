import React from "react";
import { KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, View } from "react-native";

import { BlurView } from "expo-blur";

import { useTheme } from "@/theme";

import { GlassSurface } from "../../primitives";

import { createSheetStyles } from "./styles";
import { ISheetProps } from "./types";

type ISheetPanelProps = Omit<ISheetProps, "open" | "contained">;

// Fundo escurecido e desfocado + folha de vidro com alça, título, texto e ações.
// Com o teclado aberto, a folha sobe junto (o campo digitado fica visível).
export const SheetPanel: React.FC<ISheetPanelProps> = ({
	title,
	onClose,
	children,
	actions,
	style,
	testID = "pace-sheet",
}) => {
	const { theme } = useTheme();
	const styles = createSheetStyles(theme);

	return (
		<KeyboardAvoidingView
			behavior={Platform.OS === "ios" ? "padding" : undefined}
			style={styles.root}
			testID={testID}
		>
			<Pressable
				testID={`${testID}-scrim`}
				accessibilityRole="button"
				accessibilityLabel="Fechar"
				onPress={onClose}
				style={styles.scrim}
			>
				<BlurView
					tint={theme.pace.blur.tint}
					intensity={theme.pace.blur.intensity.scrim}
					style={StyleSheet.absoluteFill}
				/>
				<View style={styles.scrimTint} />
			</Pressable>
			<GlassSurface
				appearance={styles.appearance}
				radius={theme.pace.radii.sheet}
				style={[styles.panel, style]}
			>
				<View style={styles.handle} accessibilityRole="none" />
				{title ? (
					<Text style={styles.title} accessibilityRole="header">
						{title}
					</Text>
				) : null}
				{typeof children === "string" ? <Text style={styles.body}>{children}</Text> : children}
				{actions ? <View style={styles.actions}>{actions}</View> : null}
			</GlassSurface>
		</KeyboardAvoidingView>
	);
};
