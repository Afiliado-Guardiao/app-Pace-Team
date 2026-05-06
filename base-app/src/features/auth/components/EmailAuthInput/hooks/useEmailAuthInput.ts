import { useCallback, useState } from "react";

import { useFocusState } from "@/lib/hooks/useFocusState";

export const useEmailAuthInput = () => {
	const { isFocused, handleFocus, handleBlur } = useFocusState();
	const [showPassword, setShowPassword] = useState(false);

	const togglePasswordVisibility = useCallback(() => {
		setShowPassword((prev) => !prev);
	}, []);

	return {
		isFocused,
		showPassword,
		handleFocus,
		handleBlur,
		togglePasswordVisibility,
	};
};
