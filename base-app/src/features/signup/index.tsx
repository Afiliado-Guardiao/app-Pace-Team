import React from "react";
import { Pressable, Text, View } from "react-native";

import {
	Button,
	Checkbox,
	FloatingToast,
	Icon,
	Input,
	ScreenBackground,
	ScreenScroll,
	Select,
	TopBar,
} from "@/components/pace";
import { useTheme } from "@/theme";
import { PHOTOS } from "@/lib/pace";
import { openLegalPage } from "@/constants/legal";

import { CITIES, SIGNUP_COPY, STATES } from "./constants";
import { useSignupScreen } from "./hooks/useSignupScreen";
import { createSignupStyles } from "./styles";

const CAMERA_ICON = 24;
const PLUS_ICON = 14;
const PLUS_STROKE = 2.6;

const openTerms = (): void => {
	openLegalPage("terms");
};
const openPrivacy = (): void => {
	openLegalPage("privacy");
};

// 04 Cadastro: dados do atleta, aceite dos termos e conta no Supabase.
export const SignupScreen: React.FC = () => {
	const { theme } = useTheme();
	const signup = useSignupScreen();
	const styles = createSignupStyles(theme);
	const { form, errors } = signup;

	return (
		<View style={styles.root}>
			<ScreenBackground photo={PHOTOS.teamRunningSunset} />
			<ScreenScroll>
				<TopBar title={SIGNUP_COPY.title} onBack={signup.handleBack} />
				<Pressable
					style={styles.photoRow}
					onPress={signup.handlePhoto}
					accessibilityRole="button"
					accessibilityLabel={SIGNUP_COPY.photoTitle}
					testID="signup-photo"
				>
					<View style={styles.photo}>
						<Icon name="camera" size={CAMERA_ICON} color={styles.iconColor} />
						<View style={styles.photoBadge}>
							<Icon name="plus" size={PLUS_ICON} strokeWidth={PLUS_STROKE} />
						</View>
					</View>
					<View>
						<Text style={styles.photoTitle}>{SIGNUP_COPY.photoTitle}</Text>
						<Text style={styles.photoHint}>{SIGNUP_COPY.photoHint}</Text>
					</View>
				</Pressable>
				<Input
					label={SIGNUP_COPY.name}
					icon="user-round"
					value={form.name}
					onChangeText={(value) => {
						signup.setField("name", value);
					}}
					error={errors.name}
					testID="signup-name"
				/>
				<Input
					label={SIGNUP_COPY.email}
					icon="mail"
					type="email"
					placeholder={SIGNUP_COPY.emailPlaceholder}
					value={form.email}
					onChangeText={(value) => {
						signup.setField("email", value);
					}}
					error={errors.email}
					testID="signup-email"
				/>
				<Input
					label={SIGNUP_COPY.password}
					icon="lock"
					type="password"
					hint={SIGNUP_COPY.passwordHint}
					value={form.password}
					onChangeText={(value) => {
						signup.setField("password", value);
					}}
					error={errors.password}
					testID="signup-password"
				/>
				<Input
					label={SIGNUP_COPY.birthday}
					icon="calendar"
					type="number"
					placeholder={SIGNUP_COPY.birthdayPlaceholder}
					hint={SIGNUP_COPY.birthdayHint}
					value={form.birthday}
					onChangeText={(value) => {
						signup.setField("birthday", value);
					}}
					error={errors.birthday}
					testID="signup-birthday"
				/>
				<View style={styles.row}>
					<Select
						label={SIGNUP_COPY.city}
						options={CITIES}
						value={form.city}
						onChange={(value) => {
							signup.setField("city", value);
						}}
						style={styles.city}
					/>
					<Select
						label={SIGNUP_COPY.state}
						options={STATES}
						value={form.state}
						onChange={(value) => {
							signup.setField("state", value);
						}}
						style={styles.state}
					/>
				</View>
				<Checkbox
					checked={signup.accepted}
					onChange={signup.setAccepted}
					accessibilityLabel="Aceito os Termos de Uso e a Política de Privacidade"
					label={
						<Text>
							{SIGNUP_COPY.termsStart}
							<Text
								style={styles.termsLink}
								onPress={openTerms}
								accessibilityRole="link"
								testID="signup-terms-link"
							>
								{SIGNUP_COPY.terms}
							</Text>
							{SIGNUP_COPY.and}
							<Text
								style={styles.termsLink}
								onPress={openPrivacy}
								accessibilityRole="link"
								testID="signup-privacy-link"
							>
								{SIGNUP_COPY.privacy}
							</Text>
							.
						</Text>
					}
					testID="signup-terms"
				/>
				<Button
					size="lg"
					fullWidth
					disabled={!signup.accepted || signup.isLoading}
					onPress={signup.handleSubmit}
					testID="signup-submit"
				>
					{SIGNUP_COPY.submit}
				</Button>
				<Text style={styles.note}>{SIGNUP_COPY.locationNote}</Text>
			</ScreenScroll>
			<FloatingToast toast={signup.toast} />
		</View>
	);
};
