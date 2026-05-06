import React from "react";
import { Text, TextInput as RNTextInput, View } from "react-native";

import { useTheme } from "@/theme";

import { useTextInput } from "./hooks";
import { createTextInputStyles } from "./styles";
import { ITextInputProps } from "./types";

export const TextInput: React.FC<ITextInputProps> = ({
	value,
	onChangeText,
	placeholder,
	keyboardType = "default",
	error,
	disabled = false,
	multiline = false,
	maxLength,
	style,
	testID,
	accessibilityLabel,
}) => {
	const { theme } = useTheme();
	const { isFocused, handleFocus, handleBlur } = useTextInput();
	const styles = createTextInputStyles(theme, !!error, isFocused, disabled);

	return (
		<View style={style}>
			<View style={styles.container}>
				<RNTextInput
					testID={testID}
					accessibilityLabel={accessibilityLabel ?? placeholder}
					value={value}
					onChangeText={onChangeText}
					placeholder={placeholder}
					placeholderTextColor={theme.colors.textMuted}
					keyboardType={keyboardType}
					editable={!disabled}
					multiline={multiline}
					maxLength={maxLength}
					onFocus={handleFocus}
					onBlur={handleBlur}
					style={styles.input}
				/>
			</View>
			{error && <Text style={styles.errorText}>{error}</Text>}
		</View>
	);
};

export * from "./types";
