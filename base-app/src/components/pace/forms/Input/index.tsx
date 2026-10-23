import React from "react";
import { Pressable, Text, TextInput, View } from "react-native";

import { useTheme } from "@/theme";

import { Icon } from "../../core/Icon";
import { GlassSurface } from "../../primitives";

import { useInput } from "./hooks/useInput";
import { createInputStyles } from "./styles";
import { IInputProps } from "./types";

const ICON_SIZE = 18;

// Campo de vidro com rótulo, ícone, foco laranja, erro/dica e "mostrar senha".
export const Input: React.FC<IInputProps> = ({
	label,
	icon,
	type = "text",
	value,
	defaultValue,
	placeholder,
	onChangeText,
	error,
	hint,
	trailing,
	disabled = false,
	style,
	testID = "pace-input",
	accessibilityLabel,
}) => {
	const { theme } = useTheme();
	const field = useInput(type);
	const styles = createInputStyles(theme, {
		hasError: !!error,
		isFocused: field.isFocused,
		disabled,
	});
	const message = error ?? hint;
	const eyeIcon = field.isSecure ? "eye" : "eye-off";

	return (
		<View style={[styles.root, style]}>
			{label ? <Text style={styles.label}>{label}</Text> : null}
			<GlassSurface
				appearance={styles.appearance}
				radius={theme.pace.radii.md}
				style={styles.field}
			>
				{icon ? <Icon name={icon} size={ICON_SIZE} color={styles.iconColor} /> : null}
				<TextInput
					testID={testID}
					accessibilityLabel={accessibilityLabel ?? label}
					value={value}
					defaultValue={defaultValue}
					placeholder={placeholder}
					placeholderTextColor={styles.placeholderColor}
					onChangeText={onChangeText}
					editable={!disabled}
					secureTextEntry={field.isSecure}
					keyboardType={field.keyboardType}
					autoCapitalize={type === "text" ? "sentences" : "none"}
					onFocus={field.handleFocus}
					onBlur={field.handleBlur}
					selectionColor={theme.pace.colors.orange[400]}
					style={styles.input}
				/>
				{field.isPassword ? (
					<Pressable
						testID={`${testID}-reveal`}
						accessibilityRole="button"
						accessibilityLabel="Mostrar senha"
						onPress={field.toggleSecure}
						hitSlop={8}
					>
						<Icon name={eyeIcon} size={ICON_SIZE} color={styles.placeholderColor} />
					</Pressable>
				) : (
					trailing
				)}
			</GlassSurface>
			{message ? <Text style={styles.message}>{message}</Text> : null}
		</View>
	);
};

export * from "./types";
