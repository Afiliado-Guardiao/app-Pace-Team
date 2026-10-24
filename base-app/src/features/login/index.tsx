import React from "react";
import { Pressable, Text, View } from "react-native";

import {
	Button,
	FloatingToast,
	Input,
	Logo,
	ScreenBackground,
	ScreenScroll,
} from "@/components/pace";
import { useTheme } from "@/theme";
import { PHOTOS } from "@/lib/pace";

import { ResetPasswordSheet } from "./components/ResetPasswordSheet";
import { LOGIN_COPY } from "./constants";
import { useLoginScreen } from "./hooks/useLoginScreen";
import { createLoginStyles } from "./styles";

const LOGO_HEIGHT = 56;
const PHOTO_BLUR = 22;

// 03 Login: e-mail e senha (Supabase), esqueci a senha e atalhos Apple/Google.
export const LoginScreen: React.FC = () => {
	const { theme } = useTheme();
	const login = useLoginScreen();
	const styles = createLoginStyles(theme);

	return (
		<View style={styles.root}>
			<ScreenBackground photo={PHOTOS.runnerMountain} blur={PHOTO_BLUR} />
			<ScreenScroll contentStyle={styles.content}>
				<View style={styles.logo}>
					<Logo height={LOGO_HEIGHT} />
				</View>
				<View style={styles.header}>
					<Text style={styles.title}>{LOGIN_COPY.title}</Text>
					<Text style={styles.subtitle}>{LOGIN_COPY.subtitle}</Text>
				</View>
				<View style={styles.fields}>
					<Input
						label={LOGIN_COPY.email}
						icon="mail"
						type="email"
						value={login.email}
						onChangeText={login.setEmail}
						error={login.errors.email}
						testID="login-email"
					/>
					<Input
						label={LOGIN_COPY.password}
						icon="lock"
						type="password"
						value={login.password}
						onChangeText={login.setPassword}
						error={login.errors.password}
						testID="login-password"
					/>
					<Pressable
						onPress={login.handleForgot}
						style={styles.forgot}
						accessibilityRole="button"
						accessibilityLabel={LOGIN_COPY.forgot}
						testID="login-forgot"
					>
						<Text style={styles.link}>{LOGIN_COPY.forgot}</Text>
					</Pressable>
				</View>
				<Button
					size="lg"
					fullWidth
					onPress={login.handleSubmit}
					disabled={login.isLoading}
					testID="login-submit"
				>
					{LOGIN_COPY.submit}
				</Button>
				<View style={styles.divider}>
					<View style={styles.dividerLine} />
					<Text style={styles.dividerText}>{LOGIN_COPY.divider}</Text>
					<View style={styles.dividerLine} />
				</View>
				<View style={styles.socialRow}>
					<Button variant="glass" fullWidth style={styles.socialItem} onPress={login.handleApple}>
						{LOGIN_COPY.apple}
					</Button>
					<Button variant="glass" fullWidth style={styles.socialItem} onPress={login.handleGoogle}>
						{LOGIN_COPY.google}
					</Button>
				</View>
				<Text style={styles.footer}>
					{LOGIN_COPY.newHere}
					<Text style={styles.footerLink} onPress={login.handleSignup} testID="login-signup">
						{LOGIN_COPY.createAccount}
					</Text>
				</Text>
			</ScreenScroll>
			<ResetPasswordSheet reset={login.reset} />
			<FloatingToast toast={login.toast} />
		</View>
	);
};
