import { useCallback, useState } from "react";
import { KeyboardTypeOptions } from "react-native";

import { IInputType } from "../types";

interface IUseInputReturn {
	isFocused: boolean;
	isPassword: boolean;
	isSecure: boolean;
	keyboardType: KeyboardTypeOptions;
	handleFocus: () => void;
	handleBlur: () => void;
	toggleSecure: () => void;
}

const KEYBOARD: Record<IInputType, KeyboardTypeOptions> = {
	text: "default",
	email: "email-address",
	password: "default",
	number: "numeric",
	tel: "phone-pad",
};

// Foco (borda e ícone laranja) e "mostrar senha".
export const useInput = (type: IInputType): IUseInputReturn => {
	const [isFocused, setIsFocused] = useState(false);
	const [isRevealed, setIsRevealed] = useState(false);
	const isPassword = type === "password";

	const handleFocus = useCallback(() => {
		setIsFocused(true);
	}, []);
	const handleBlur = useCallback(() => {
		setIsFocused(false);
	}, []);
	const toggleSecure = useCallback(() => {
		setIsRevealed((value) => !value);
	}, []);

	return {
		isFocused,
		isPassword,
		isSecure: isPassword && !isRevealed,
		keyboardType: KEYBOARD[type],
		handleFocus,
		handleBlur,
		toggleSecure,
	};
};
