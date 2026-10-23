import { useCallback, useMemo, useState } from "react";

import { ISelectOption } from "../types";

interface IUseSelectOptions {
	options: readonly ISelectOption[];
	value?: string;
	defaultValue?: string;
	onChange?: (value: string) => void;
}

interface IUseSelectReturn {
	items: { value: string; label: string }[];
	current: string | undefined;
	currentLabel: string | undefined;
	isOpen: boolean;
	open: () => void;
	close: () => void;
	select: (value: string) => void;
}

// Valor controlado (value) ou interno (defaultValue) e a folha de opções.
export const useSelect = ({
	options,
	value,
	defaultValue,
	onChange,
}: IUseSelectOptions): IUseSelectReturn => {
	const [inner, setInner] = useState(defaultValue);
	const [isOpen, setIsOpen] = useState(false);
	const current = value ?? inner;

	const items = useMemo(
		() => options.map((o) => (typeof o === "string" ? { value: o, label: o } : o)),
		[options],
	);
	const currentLabel = items.find((item) => item.value === current)?.label;

	const open = useCallback(() => {
		setIsOpen(true);
	}, []);
	const close = useCallback(() => {
		setIsOpen(false);
	}, []);
	const select = useCallback(
		(next: string) => {
			if (value === undefined) setInner(next);
			onChange?.(next);
			setIsOpen(false);
		},
		[value, onChange],
	);

	return { items, current, currentLabel, isOpen, open, close, select };
};
