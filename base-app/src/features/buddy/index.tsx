import React from "react";
import { Pressable, ScrollView, Text, View } from "react-native";

import { Icon } from "@/components/pace";
import { useTheme } from "@/theme";

import { AlarmCard } from "./components/AlarmCard";
import { BuddyWardrobe } from "./components/BuddyWardrobe";
import { ShortcutGuide } from "./components/ShortcutGuide";
import { BUDDY_SCREEN_COPY } from "./constants";
import { useBuddyScreen } from "./hooks/useBuddyScreen";
import { createBuddyScreenStyles } from "./styles";

// "Seu Buddy" (Perfil): cores, acessórios, atalho do Toque Traseiro e
// despertador. O Buddy em si vive fora do app (atalho e widget do iPhone).
export const BuddyScreen: React.FC = () => {
	const { theme } = useTheme();
	const screen = useBuddyScreen();
	const styles = createBuddyScreenStyles(theme, screen.top);

	return (
		<View style={styles.root}>
			<View style={styles.header}>
				<Pressable
					testID="buddy-back"
					accessibilityLabel="Voltar"
					onPress={screen.goBack}
					style={styles.back}
				>
					<Icon name="chevron-left" size={18} strokeWidth={2.2} />
				</Pressable>
				<View style={styles.titles}>
					<Text style={styles.title}>{BUDDY_SCREEN_COPY.title}</Text>
					<Text style={styles.subtitle}>{screen.goalsLabel}</Text>
				</View>
			</View>
			<ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
				<ShortcutGuide />
				<BuddyWardrobe />
				<AlarmCard />
			</ScrollView>
		</View>
	);
};
