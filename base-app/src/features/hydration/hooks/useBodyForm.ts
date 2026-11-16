import { useState } from "react";

import { useHydrationStore } from "@/lib/hydration";

import { num, str } from "./formUtils";

export interface IBodyForm {
	isOpen: boolean;
	weight: string;
	height: string;
	hasRestriction: boolean;
	note: string;
	setWeight: (v: string) => void;
	setHeight: (v: string) => void;
	setRestriction: (v: boolean) => void;
	setNote: (v: string) => void;
	open: () => void;
	close: () => void;
	save: () => void;
}

const inRange = (v: number | null, lo: number, hi: number): number | null =>
	v !== null && v >= lo && v <= hi ? v : null;

// Peso, altura e orientação médica (a idade vem do cadastro)
export const useBodyForm = (): IBodyForm => {
	const st = useHydrationStore();
	const [isOpen, setIsOpen] = useState(false);
	const [weight, setWeight] = useState("");
	const [height, setHeight] = useState("");
	const [hasRestriction, setRestriction] = useState(false);
	const [note, setNote] = useState("");

	return {
		isOpen,
		weight,
		height,
		hasRestriction,
		note,
		setWeight,
		setHeight,
		setRestriction,
		setNote,
		open: () => {
			setWeight(str(st.body.weightKg));
			setHeight(str(st.body.heightCm));
			setRestriction(st.hasRestriction);
			setNote(st.restrictionNote);
			setIsOpen(true);
		},
		close: () => {
			setIsOpen(false);
		},
		save: () => {
			st.setBody({
				weightKg: inRange(num(weight), 25, 250),
				heightCm: inRange(num(height), 100, 230),
			});
			st.setRestriction(hasRestriction, note);
			setIsOpen(false);
		},
	};
};
