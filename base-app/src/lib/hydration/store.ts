import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { ISweatTest } from "./estimate";

// PACE HYDRATION fica no próprio celular (é o que o cartão do Bud e a Siri
// leem com o app fechado). Só o Team Pro usa (a tela confere o Pro).

export type IHydroKind = "day" | "pre" | "during" | "post";

export interface IHydroLog {
	id: string;
	ml: number;
	at: number;
	kind: IHydroKind;
}

export interface IHydroReminders {
	isOn: boolean;
	// Janela do dia (horas cheias) e intervalo entre os lembretes
	startHour: number;
	endHour: number;
	everyMin: number;
	// 0 = domingo … 6 = sábado
	days: number[];
	// Antiga pausa "só hoje" (saiu: o lembrete ligado fica ligado). Fica no
	// tipo só para não quebrar o que já está salvo no celular
	pausedUntil: number;
	// Aviso de reposição depois de cada corrida
	isPostRunOn: boolean;
}

export interface IHydroBodyInput {
	weightKg: number | null;
	heightCm: number | null;
	// Idade escolhida na régua (sem ela, vem da data de nascimento do cadastro)
	age?: number | null;
}

interface IHydrationState {
	body: IHydroBodyInput;
	// Orientação médica sobre líquidos: o app não mostra meta, só o registro
	hasRestriction: boolean;
	restrictionNote: string;
	logs: IHydroLog[];
	tests: ISweatTest[];
	reminders: IHydroReminders;
	// Corridas que já ganharam o aviso de reposição
	notifiedRuns: string[];
	setBody: (body: IHydroBodyInput) => void;
	setRestriction: (on: boolean, note: string) => void;
	addLog: (ml: number, kind: IHydroKind) => void;
	removeLog: (id: string) => void;
	addTest: (test: Omit<ISweatTest, "id" | "at">) => void;
	removeTest: (id: string) => void;
	setReminders: (r: Partial<IHydroReminders>) => void;
	markRunNotified: (runId: string) => void;
}

export const DEFAULT_REMINDERS: IHydroReminders = {
	isOn: false,
	startHour: 8,
	endHour: 21,
	everyMin: 120,
	days: [0, 1, 2, 3, 4, 5, 6],
	pausedUntil: 0,
	isPostRunOn: true,
};

// Guarda 60 dias de registros (o histórico mostra a última semana)
const KEEP_MS = 60 * 86_400_000;
const MAX_TESTS = 20;
const newId = (): string => `${String(Date.now())}-${Math.random().toString(36).slice(2, 8)}`;

export const useHydrationStore = create<IHydrationState>()(
	persist(
		(set) => ({
			body: { weightKg: null, heightCm: null },
			hasRestriction: false,
			restrictionNote: "",
			logs: [],
			tests: [],
			reminders: DEFAULT_REMINDERS,
			notifiedRuns: [],
			setBody: (body) => {
				set({ body });
			},
			setRestriction: (on, note) => {
				set({ hasRestriction: on, restrictionNote: note.slice(0, 200) });
			},
			addLog: (ml, kind) => {
				const now = Date.now();
				set((s) => ({
					logs: [{ id: newId(), ml, at: now, kind }, ...s.logs].filter((l) => now - l.at < KEEP_MS),
				}));
			},
			removeLog: (id) => {
				set((s) => ({ logs: s.logs.filter((l) => l.id !== id) }));
			},
			addTest: (test) => {
				set((s) => ({
					tests: [{ ...test, id: newId(), at: Date.now() }, ...s.tests].slice(0, MAX_TESTS),
				}));
			},
			removeTest: (id) => {
				set((s) => ({ tests: s.tests.filter((t) => t.id !== id) }));
			},
			setReminders: (r) => {
				set((s) => ({ reminders: { ...s.reminders, ...r } }));
			},
			markRunNotified: (runId) => {
				set((s) => ({ notifiedRuns: [runId, ...s.notifiedRuns].slice(0, 50) }));
			},
		}),
		{
			name: "@pace-team:hydration",
			storage: createJSONStorage(() => AsyncStorage),
		},
	),
);
