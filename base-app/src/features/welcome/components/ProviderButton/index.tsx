import React from "react";
import { ActivityIndicator, Text, View } from "react-native";

import { Button } from "@/components/pace";

import { BrandIcon } from "../BrandIcon";

interface IProviderButtonProps {
	brand: "apple" | "google";
	label: string;
	isBusy: boolean;
	isDisabled: boolean;
	onPress: () => void;
	styles: {
		buttonContent: object;
		buttonText: object;
		spinnerColor: string;
		buttonSize: "md" | "lg";
	};
}

// Botão claro "Continuar com Apple/Google" com a marca (ou o spinner).
export const ProviderButton: React.FC<IProviderButtonProps> = ({
	brand,
	label,
	isBusy,
	isDisabled,
	onPress,
	styles,
}) => (
	<Button
		fullWidth
		size={styles.buttonSize}
		variant="light"
		onPress={onPress}
		disabled={isDisabled}
		accessibilityLabel={label}
		testID={`welcome-${brand}`}
	>
		<View style={styles.buttonContent}>
			{isBusy ? <ActivityIndicator color={styles.spinnerColor} /> : <BrandIcon brand={brand} />}
			<Text style={styles.buttonText}>{label}</Text>
		</View>
	</Button>
);
