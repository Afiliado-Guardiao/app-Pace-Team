import { useMemo } from "react";

import { PaywalloClient } from "@virex-tech/paywallo-sdk";

interface IUseSessionFlagReturn {
	variant: string;
	is: (value: string) => boolean;
}

export const useSessionFlag = (
	key: string,
	defaultValue: string = "control",
): IUseSessionFlagReturn => {
	const variant = useMemo<string>(
		() => PaywalloClient.getSessionFlag(key) ?? defaultValue,
		[key, defaultValue],
	);

	return {
		variant,
		is: (value: string): boolean => variant === value,
	};
};
