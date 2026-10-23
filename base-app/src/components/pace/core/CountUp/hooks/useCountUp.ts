import { useMemo } from "react";

import { useTween } from "../../../hooks";
import { easeOutBack, formatCountUp, parseCountUp } from "../../../utils";

interface IUseCountUpOptions {
	duration: number;
	delay: number;
}

interface IUseCountUpReturn {
	text: string;
	isNumeric: boolean;
}

// Conta de 0 até o valor, passa um pouco e assenta (overshoot).
export const useCountUp = (
	value: string | number | null | undefined,
	options: IUseCountUpOptions,
): IUseCountUpReturn => {
	const parts = useMemo(() => parseCountUp(value), [value]);
	const current = useTween(parts.isNumeric ? parts.target : 0, {
		duration: options.duration,
		delay: options.delay,
		easing: easeOutBack,
	});

	return { text: formatCountUp(current, parts), isNumeric: parts.isNumeric };
};
