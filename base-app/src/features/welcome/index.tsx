import React from "react";
import { Pressable, Text, useWindowDimensions, View } from "react-native";

import Animated from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { FloatingToast, Logo, useEntrance, VideoBackground } from "@/components/pace";
import { useTheme } from "@/theme";

import { ProviderButton } from "./components/ProviderButton";
import { WELCOME_COPY, WELCOME_VIDEO } from "./constants";
import { useWelcomeScreen } from "./hooks/useWelcomeScreen";
import { COMPACT_HEIGHT, createWelcomeStyles } from "./styles";

const LOGO_HEIGHT = 40;
const LOGO_HEIGHT_COMPACT = 32;
const HEADLINE_DELAY = 450;

// 02b Boas-vindas: vídeo, logo, frase e entrada por Apple, Google ou e-mail.
export const WelcomeScreen: React.FC = () => {
	const { theme } = useTheme();
	const insets = useSafeAreaInsets();
	const welcome = useWelcomeScreen();
	const logoPop = useEntrance("pop");
	const headlinePop = useEntrance("pop", { delay: HEADLINE_DELAY });
	const { height } = useWindowDimensions();
	const isCompact = height < COMPACT_HEIGHT;
	const styles = createWelcomeStyles(theme, insets, isCompact);

	return (
		<View style={styles.root}>
			<VideoBackground source={WELCOME_VIDEO} scrim="welcomeScrim" />
			<View style={styles.content}>
				<Animated.View style={[styles.logoRow, logoPop]}>
					<Logo height={isCompact ? LOGO_HEIGHT_COMPACT : LOGO_HEIGHT} />
				</Animated.View>
				<View style={styles.spacer} />
				<Animated.View style={[styles.headline, headlinePop]}>
					<Text style={styles.slogan}>{WELCOME_COPY.slogan}</Text>
					<Text style={styles.title}>{WELCOME_COPY.title}</Text>
				</Animated.View>
				<Text style={styles.terms}>
					{WELCOME_COPY.termsStart}
					<Text style={styles.termsLink} onPress={welcome.handleLegal}>
						{WELCOME_COPY.terms}
					</Text>
					{WELCOME_COPY.and}
					<Text style={styles.termsLink} onPress={welcome.handleLegal}>
						{WELCOME_COPY.privacy}
					</Text>
					{WELCOME_COPY.termsEnd}
				</Text>
				<View style={styles.buttons}>
					<ProviderButton
						brand="apple"
						label={WELCOME_COPY.apple}
						isBusy={welcome.busy === "apple"}
						isDisabled={welcome.busy !== null && welcome.busy !== "apple"}
						onPress={welcome.handleApple}
						styles={styles}
					/>
					<ProviderButton
						brand="google"
						label={WELCOME_COPY.google}
						isBusy={welcome.busy === "google"}
						isDisabled={welcome.busy !== null && welcome.busy !== "google"}
						onPress={welcome.handleGoogle}
						styles={styles}
					/>
				</View>
				<Pressable
					testID="welcome-email"
					accessibilityRole="button"
					accessibilityLabel={WELCOME_COPY.email}
					onPress={welcome.handleEmail}
					style={styles.emailLink}
				>
					<Text style={styles.emailText}>{WELCOME_COPY.email}</Text>
				</Pressable>
				{welcome.showCatalogShortcut ? (
					<Pressable
						testID="btn-open-catalog"
						accessibilityRole="button"
						accessibilityLabel={WELCOME_COPY.catalog}
						onPress={welcome.handleOpenCatalog}
						style={styles.logoRow}
					>
						<Text style={styles.catalogText}>{WELCOME_COPY.catalog}</Text>
					</Pressable>
				) : null}
			</View>
			<FloatingToast toast={welcome.toast} />
		</View>
	);
};
