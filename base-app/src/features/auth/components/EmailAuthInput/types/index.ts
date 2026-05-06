export interface IEmailAuthInputProps {
	label: string;
	value: string;
	onChangeText: (text: string) => void;
	placeholder?: string;
	error?: string;
	secureTextEntry?: boolean;
	keyboardType?: "default" | "email-address";
	autoCapitalize?: "none" | "words" | "sentences" | "characters";
	returnKeyType?: "done" | "next" | "go" | "search" | "send";
	onSubmitEditing?: () => void;
	testID?: string;
	accessibilityLabel?: string;
}
