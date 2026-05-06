import { useCallback, useState } from "react";

interface IUseFocusStateReturn {
	isFocused: boolean;
	handleFocus: () => void;
	handleBlur: () => void;
}

export const useFocusState = (): IUseFocusStateReturn => {
	const [isFocused, setIsFocused] = useState(false);

	const handleFocus = useCallback(() => {
		setIsFocused(true);
	}, []);

	const handleBlur = useCallback(() => {
		setIsFocused(false);
	}, []);

	return {
		isFocused,
		handleFocus,
		handleBlur,
	};
};
