import { useEffect, useState } from "react";

import { ageOf, useHydrationStore } from "@/lib/hydration";
import { useStore } from "@/store";

import { ISetupStep, SETUP_STEPS } from "../constants/setup";

import { IRulerScale } from "./useRuler";

// Régua do passo atual (peso, altura ou idade); null no passo de saúde
export interface ISetupRuler {
	scale: IRulerScale;
	value: number;
	text: string;
	unit: string;
	onChange: (v: number) => void;
}

export interface IHydroSetup {
	isOpen: boolean;
	step: number;
	isLast: boolean;
	info: ISetupStep;
	ruler: ISetupRuler | null;
	weight: number;
	height: number;
	age: number;
	hasRestriction: boolean;
	note: string;
	setWeight: (v: number) => void;
	setHeight: (v: number) => void;
	setAge: (v: number) => void;
	setRestriction: (v: boolean) => void;
	setNote: (v: string) => void;
	// "Editar dados": abre de novo no primeiro passo
	open: () => void;
	next: () => void;
	back: () => void;
}

const DEFAULTS = { weight: 70, height: 170, age: 30 } as const;

// Seus dados do PACE HYDRATION em 4 passos (peso, altura, idade e saúde).
// Abre sozinho na primeira vez (sem peso salvo); depois, pelo "Editar dados".
export const useHydroSetup = (onLeave: () => void): IHydroSetup => {
	const st = useHydrationStore();
	const birthday = useStore((s) => s.user?.birthday);
	const [isOpen, setIsOpen] = useState(false);
	const [step, setStep] = useState(0);
	const [weight, setWeight] = useState<number>(DEFAULTS.weight);
	const [height, setHeight] = useState<number>(DEFAULTS.height);
	const [age, setAge] = useState<number>(DEFAULTS.age);
	const [hasRestriction, setRestriction] = useState(false);
	const [note, setNote] = useState("");

	const open = () => {
		const s = useHydrationStore.getState();
		setWeight(s.body.weightKg ?? DEFAULTS.weight);
		setHeight(s.body.heightCm ?? DEFAULTS.height);
		setAge(s.body.age ?? ageOf(birthday, Date.now()) ?? DEFAULTS.age);
		setRestriction(s.hasRestriction);
		setNote(s.restrictionNote);
		setStep(0);
		setIsOpen(true);
	};

	// Primeira vez (depois de ler o que está salvo no aparelho): já pede os dados
	useEffect(() => {
		const check = () => {
			if (!useHydrationStore.getState().body.weightKg) open();
		};
		if (useHydrationStore.persist.hasHydrated()) {
			check();
			return undefined;
		}
		return useHydrationStore.persist.onFinishHydration(check);
		// eslint-disable-next-line react-hooks/exhaustive-deps -- só ao abrir a tela
	}, []);

	const isLast = step === SETUP_STEPS.length - 1;
	const info = SETUP_STEPS[step] ?? SETUP_STEPS[0];
	const values = { weight, height, age, health: 0 };
	const setters = { weight: setWeight, height: setHeight, age: setAge, health: () => undefined };
	const value = values[info.key];
	const ruler: ISetupRuler | null = info.scale
		? {
				scale: info.scale,
				value,
				text: value.toFixed(info.decimals ?? 0).replace(".", ","),
				unit: info.unit ?? "",
				onChange: setters[info.key],
			}
		: null;

	return {
		isOpen,
		step,
		isLast,
		info,
		ruler,
		weight,
		height,
		age,
		hasRestriction,
		note,
		setWeight,
		setHeight,
		setAge,
		setRestriction,
		setNote,
		open,
		next: () => {
			if (!isLast) {
				setStep(step + 1);
				return;
			}
			st.setBody({ weightKg: weight, heightCm: height, age });
			st.setRestriction(hasRestriction, note);
			setIsOpen(false);
		},
		back: () => {
			if (step > 0) {
				setStep(step - 1);
				return;
			}
			setIsOpen(false);
			// Primeira vez sem terminar: sai do PACE HYDRATION
			if (!st.body.weightKg) onLeave();
		},
	};
};
