import React from "react";
import { Text, View } from "react-native";

import { Button, Input, Sheet } from "@/components/pace";
import { ITheme, useTheme } from "@/theme";

import { RESET_COPY } from "../../constants";
import { useResetPassword } from "../../hooks/useResetPassword";

interface IResetPasswordSheetProps {
	reset: ReturnType<typeof useResetPassword>;
}

const createResetPasswordStyles = (theme: ITheme) => {
	const { colors, spacing, typography } = theme.pace;
	return {
		form: { gap: spacing[3] },
		body: {
			fontFamily: typography.fonts.medium,
			fontSize: typography.sizes.sm,
			lineHeight: typography.sizes.sm * 1.5,
			color: colors.textSecondary,
		},
		error: {
			fontFamily: typography.fonts.semibold,
			fontSize: typography.sizes.sm,
			color: colors.statusDanger,
		},
	};
};

// Folha "Esqueci minha senha": pede o e-mail, depois o código e a senha nova.
export const ResetPasswordSheet: React.FC<IResetPasswordSheetProps> = ({ reset }) => {
	const { theme } = useTheme();
	const styles = createResetPasswordStyles(theme);
	const isCode = reset.step === "code";

	return (
		<Sheet
			open={reset.isOpen}
			title={RESET_COPY.title}
			onClose={reset.close}
			actions={
				<>
					<Button
						fullWidth
						disabled={reset.isBusy}
						onPress={isCode ? reset.confirm : reset.sendCode}
						testID="reset-submit"
					>
						{isCode ? RESET_COPY.confirm : RESET_COPY.send}
					</Button>
					{isCode ? (
						<Button
							fullWidth
							variant="ghost"
							disabled={reset.isBusy}
							onPress={reset.sendCode}
							testID="reset-resend"
						>
							{RESET_COPY.resend}
						</Button>
					) : null}
				</>
			}
		>
			<View style={styles.form}>
				<Text style={styles.body}>
					{isCode ? `${RESET_COPY.codeSentTo}${reset.email}.` : RESET_COPY.emailBody}
				</Text>
				{isCode ? (
					<>
						<Input
							label={RESET_COPY.code}
							icon="key-round"
							type="number"
							value={reset.code}
							placeholder={RESET_COPY.codePlaceholder}
							onChangeText={reset.setCode}
							testID="reset-code"
							accessibilityLabel={RESET_COPY.code}
						/>
						<Input
							label={RESET_COPY.newPassword}
							icon="lock"
							type="password"
							value={reset.newPassword}
							hint={RESET_COPY.passwordHint}
							onChangeText={reset.setNewPassword}
							testID="reset-new-password"
							accessibilityLabel={RESET_COPY.newPassword}
						/>
					</>
				) : (
					<Input
						label={RESET_COPY.email}
						icon="mail"
						type="email"
						value={reset.email}
						onChangeText={reset.setEmail}
						testID="reset-email"
						accessibilityLabel={RESET_COPY.email}
					/>
				)}
				{reset.error ? <Text style={styles.error}>{reset.error}</Text> : null}
			</View>
		</Sheet>
	);
};
