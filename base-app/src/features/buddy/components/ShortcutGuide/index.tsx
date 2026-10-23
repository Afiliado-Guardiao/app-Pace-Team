import React from "react";
import { Text, View } from "react-native";

import { Button, GlassCard, Label } from "@/components/pace";
import { useTheme } from "@/theme";

import { BUDDY_SCREEN_COPY, SHORTCUT_STEPS } from "../../constants";
import { useShortcutGuide } from "../../hooks/useShortcutGuide";

import { createShortcutGuideStyles } from "./styles";

// Como ligar o Toque Traseiro do iPhone para chamar o Buddy fora do app.
export const ShortcutGuide: React.FC = () => {
	const { theme } = useTheme();
	const styles = createShortcutGuideStyles(theme);
	const guide = useShortcutGuide();

	return (
		<View style={styles.section}>
			<Label>{BUDDY_SCREEN_COPY.shortcutLabel}</Label>
			<GlassCard padding={16} testID="buddy-shortcut-guide">
				<View style={styles.card}>
					<Text style={styles.title}>{BUDDY_SCREEN_COPY.shortcutTitle}</Text>
					<Text style={styles.body}>{BUDDY_SCREEN_COPY.shortcutBody}</Text>
					{SHORTCUT_STEPS.map((step, i) => (
						<View key={step} style={styles.step}>
							<View style={styles.number}>
								<Text style={styles.numberText}>{i + 1}</Text>
							</View>
							<Text style={styles.stepText}>{step}</Text>
						</View>
					))}
					{guide.isAvailable ? (
						<View style={styles.actions}>
							<Button
								testID="buddy-open-shortcuts"
								variant="glass"
								size="sm"
								icon="layers"
								fullWidth
								onPress={guide.openShortcuts}
							>
								{BUDDY_SCREEN_COPY.openShortcuts}
							</Button>
							{guide.hasAlways ? (
								<Text style={styles.ok}>{BUDDY_SCREEN_COPY.alwaysOk}</Text>
							) : (
								<Button
									testID="buddy-allow-always"
									variant="primary"
									size="sm"
									icon="map-pin"
									fullWidth
									onPress={guide.allowAlways}
								>
									{BUDDY_SCREEN_COPY.allowAlways}
								</Button>
							)}
							{guide.hasAlways ? null : (
								<Text style={styles.note}>{BUDDY_SCREEN_COPY.alwaysHint}</Text>
							)}
						</View>
					) : null}
					<Text style={styles.note}>
						{guide.isAvailable
							? BUDDY_SCREEN_COPY.shortcutDone
							: BUDDY_SCREEN_COPY.shortcutUnavailable}
					</Text>
				</View>
			</GlassCard>
		</View>
	);
};
