import { useCallback,useState } from "react";

import { IInputOptions } from "../../../types";
import { IUseInputModalReturn } from "../types";

export const useInputModal = (
	options: IInputOptions,
	onConfirm: (value: string) => void,
): IUseInputModalReturn => {
	const [value, setValue] = useState(options.initialValue ?? "");
	const [error, setError] = useState<string | null>(null);

	const handleChangeText = useCallback((text: string) => {
		setValue(text);
		setError(null);
	}, []);

	const handleConfirm = useCallback(() => {
		if (options.validation) {
			const validationError = options.validation(value);
			if (validationError) {
				setError(validationError);
				return;
			}
		}
		onConfirm(value);
	}, [value, options, onConfirm]);

	return { value, error, handleChangeText, handleConfirm };
};
