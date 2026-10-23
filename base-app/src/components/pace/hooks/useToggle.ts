import { useCallback, useState } from "react";

interface IUseToggleOptions {
	checked?: boolean;
	defaultChecked?: boolean;
	onChange?: (value: boolean) => void;
	disabled?: boolean;
}

interface IUseToggleReturn {
	isOn: boolean;
	toggle: () => void;
}

// Estado ligado/desligado controlado (checked) ou interno (defaultChecked),
// como Checkbox e Switch do design system.
export const useToggle = ({
	checked,
	defaultChecked = false,
	onChange,
	disabled = false,
}: IUseToggleOptions): IUseToggleReturn => {
	const [inner, setInner] = useState(defaultChecked);
	const isOn = checked ?? inner;

	const toggle = useCallback(() => {
		if (disabled) return;
		if (checked === undefined) setInner(!isOn);
		onChange?.(!isOn);
	}, [disabled, checked, isOn, onChange]);

	return { isOn, toggle };
};
