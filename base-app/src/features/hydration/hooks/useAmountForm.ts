import { useState } from "react";

import { IHydroKind, useHydrationStore } from "@/lib/hydration";

import { num } from "./formUtils";

const MAX_SIP_ML = 2000;

export interface IAmountForm {
	isOpen: boolean;
	value: string;
	setValue: (v: string) => void;
	open: (kind: IHydroKind) => void;
	close: () => void;
	confirm: () => void;
}

// "Outro" valor de água (em ml), para qualquer momento do dia ou da corrida
export const useAmountForm = (onSaved: () => void): IAmountForm => {
	const addLog = useHydrationStore((s) => s.addLog);
	const [isOpen, setIsOpen] = useState(false);
	const [value, setValue] = useState("");
	const [kind, setKind] = useState<IHydroKind>("day");

	return {
		isOpen,
		value,
		setValue,
		open: (k) => {
			setKind(k);
			setValue("");
			setIsOpen(true);
		},
		close: () => {
			setIsOpen(false);
		},
		confirm: () => {
			const ml = num(value);
			if (ml === null) return;
			addLog(Math.min(MAX_SIP_ML, Math.round(ml)), kind);
			setIsOpen(false);
			onSaved();
		},
	};
};
