import React from "react";
import { Pressable, Text, TextInput as RNTextInput, View } from "react-native";

import { EyeIcon, EyeSlashIcon } from "phosphor-react-native";

import { useTheme } from "@/theme";

import { useEmailAuthInput } from "./hooks/useEmailAuthInput";
import { createEmailAuthInputStyles } from "./styles";
import { IEmailAuthInputProps } from "./types";

export const EmailAuthInput: React.FC<IEmailAuthInputProps> = ({
	label,
	value,
	onChangeText,
	placeholder,
	error,
	secureTextEntry = false,
	keyboardType = "default",
	autoCapitalize = "none",
	returnKeyType = "done",
	onSubmitEditing,
	testID,
	accessibilityLabel,
}) => {
	const { theme } = useTheme();
	const { isFocused, showPassword, handleFocus, handleBlur, togglePasswordVisibility } =
		useEmailAuthInput();
	const styles = createEmailAuthInputStyles(theme, !!error, isFocused);

	return (
		<View style={styles.container}>
			<Text style={styles.label}>{label}</Text>

			<View style={styles.inputWrapper}>
				<RNTextInput
					testID={testID ?? `input-${label}`}
					accessibilityLabel={accessibilityLabel ?? label}
					style={styles.input}
					value={value}
					onChangeText={onChangeText}
					placeholder={placeholder}
					placeholderTextColor={theme.colors.textSecondary}
					secureTextEntry={secureTextEntry && !showPassword}
					keyboardType={keyboardType}
					autoCapitalize={autoCapitalize}
					returnKeyType={returnKeyType}
					onFocus={handleFocus}
					onBlur={handleBlur}
					onSubmitEditing={onSubmitEditing}
				/>

				{secureTextEntry && (
					<Pressable
						testID="btn-toggle-password"
						accessibilityLabel="Toggle password visibility"
						onPress={togglePasswordVisibility}
						style={styles.eyeIcon}
					>
						{showPassword ? (
							<EyeSlashIcon size={20} color={theme.colors.textSecondary} />
						) : (
							<EyeIcon size={20} color={theme.colors.textSecondary} />
						)}
					</Pressable>
				)}
			</View>

			{error && <Text style={styles.errorText}>{error}</Text>}
		</View>
	);
};
