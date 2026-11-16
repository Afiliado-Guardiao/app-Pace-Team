import { useState } from "react";

import { sweatRateOf, useHydrationStore } from "@/lib/hydration";

import { HYDRO_COPY } from "../constants";

import { num, str } from "./formUtils";

export type ISweatField = "preKg" | "postKg" | "minutes" | "fluidMl";

export interface ISweatForm {
	isOpen: boolean;
	fields: Record<ISweatField, string>;
	error: string | null;
	set: (key: ISweatField, v: string) => void;
	open: () => void;
	close: () => void;
	save: () => void;
}

const EMPTY = { preKg: "", postKg: "", minutes: "", fluidMl: "0" };

// Pesagem antes e depois da corrida: vira a taxa de suor pessoal
export const useSweatForm = (): ISweatForm => {
	const weightKg = useHydrationStore((s) => s.body.weightKg);
	const addTest = useHydrationStore((s) => s.addTest);
	const [isOpen, setIsOpen] = useState(false);
	const [fields, setFields] = useState<Record<ISweatField, string>>(EMPTY);
	const [error, setError] = useState<string | null>(null);

	return {
		isOpen,
		fields,
		error,
		set: (key, v) => {
			setFields((f) => ({ ...f, [key]: v }));
		},
		open: () => {
			setFields({ ...EMPTY, preKg: str(weightKg) });
			setError(null);
			setIsOpen(true);
		},
		close: () => {
			setIsOpen(false);
		},
		save: () => {
			const test = {
				preKg: num(fields.preKg) ?? 0,
				postKg: num(fields.postKg) ?? 0,
				minutes: num(fields.minutes) ?? 0,
				fluidMl: num(fields.fluidMl) ?? 0,
			};
			// Números que não fecham não viram taxa (nada inventado)
			if (sweatRateOf({ ...test, id: "", at: 0 }) === null) {
				setError(HYDRO_COPY.sweatInvalid);
				return;
			}
			addTest(test);
			setIsOpen(false);
		},
	};
};
