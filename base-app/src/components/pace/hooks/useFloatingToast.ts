import { useCallback, useEffect, useRef, useState } from "react";

import { IToastProps } from "../surfaces/Toast/types";

export type IFloatingToastData = Pick<
	IToastProps,
	"tone" | "icon" | "title" | "message" | "action"
>;

interface IUseFloatingToastReturn {
	toast: IFloatingToastData | null;
	showToast: (data: IFloatingToastData) => void;
	hideToast: () => void;
}

const DEFAULT_DURATION = 2600;

// Aviso flutuante no topo da tela que some sozinho (padrão do protótipo: 2,6 s).
export const useFloatingToast = (duration = DEFAULT_DURATION): IUseFloatingToastReturn => {
	const [toast, setToast] = useState<IFloatingToastData | null>(null);
	const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

	const hideToast = useCallback(() => {
		if (timer.current) clearTimeout(timer.current);
		setToast(null);
	}, []);

	const showToast = useCallback(
		(data: IFloatingToastData) => {
			if (timer.current) clearTimeout(timer.current);
			setToast(data);
			timer.current = setTimeout(() => {
				setToast(null);
			}, duration);
		},
		[duration],
	);

	useEffect(
		() => () => {
			if (timer.current) clearTimeout(timer.current);
		},
		[],
	);

	return { toast, showToast, hideToast };
};
