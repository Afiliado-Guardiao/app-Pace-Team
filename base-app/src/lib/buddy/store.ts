import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import {
	BUDDY_ACCESSORIES,
	BUDDY_COLORS,
	BUDDY_DEFAULT_KM_INDEX,
	BUDDY_KMS,
	IBuddyAccessoryId,
	IBuddyColorId,
	IBuddyEffectId,
} from "./constants";

// Despertador de corrida (dias: 0 = domingo … 6 = sábado)
export interface IBuddyAlarm {
	isOn: boolean;
	hour: number;
	minute: number;
	days: number[];
}

// Visual escolhido no Buddy Studio (só aparece enquanto a equipe tem o Pro)
export interface IBuddyStudio {
	color: IBuddyColorId | null;
	head: IBuddyAccessoryId | null;
	eyes: IBuddyAccessoryId | null;
	effect: IBuddyEffectId | null;
}

export const EMPTY_STUDIO: IBuddyStudio = { color: null, head: null, eyes: null, effect: null };

interface IBuddyState {
	// Metas cumpridas com o Buddy (liberam acessórios)
	goals: number;
	equipped: IBuddyAccessoryId[];
	color: IBuddyColorId;
	// Última cor comum (volta para ela se perder o nível do ranking)
	lastFree: IBuddyColorId;
	// Meta de km escolhida por último no atalho
	kmIdx: number;
	alarm: IBuddyAlarm;
	// O 1º da equipe escondeu a coroa
	hideCrown: boolean;
	// Acessório de presente do onboarding (já vem liberado)
	gift: IBuddyAccessoryId | null;
	studio: IBuddyStudio;
	setStudio: (studio: IBuddyStudio) => void;
	giveGift: (id: IBuddyAccessoryId) => void;
	setHideCrown: (hide: boolean) => void;
	setKmIdx: (index: number) => void;
	setGoals: (goals: number) => void;
	equip: (id: IBuddyAccessoryId | "base") => boolean;
	setColor: (color: IBuddyColorId, isTier: boolean) => void;
	setAlarm: (alarm: Partial<IBuddyAlarm>) => void;
	// Metas, cor e acessórios salvos no servidor (outro aparelho, atalho)
	hydrate: (profile: {
		goals: number;
		color: string;
		lastFree: string;
		equipped: string[];
		hideCrown?: boolean;
	}) => void;
}

export const DEFAULT_ALARM: IBuddyAlarm = {
	isOn: false,
	hour: 6,
	minute: 0,
	days: [1, 2, 3, 4, 5],
};

const slotOf = (id: IBuddyAccessoryId) => BUDDY_ACCESSORIES.find((a) => a.id === id)?.slot;
const isColor = (c: string): c is IBuddyColorId =>
	c in BUDDY_COLORS && !BUDDY_COLORS[c as IBuddyColorId].pro;
const isAccessory = (id: string): id is IBuddyAccessoryId =>
	BUDDY_ACCESSORIES.some((a) => a.id === id);

// Memória do Pace Buddy no aparelho: cores, acessórios, metas e despertador.
// É daqui que sai o estado que o widget e o atalho leem fora do app.
export const useBuddyStore = create<IBuddyState>()(
	persist(
		(set, get) => ({
			goals: 0,
			equipped: [],
			color: "branco",
			lastFree: "branco",
			kmIdx: BUDDY_DEFAULT_KM_INDEX,
			alarm: DEFAULT_ALARM,
			hideCrown: false,
			gift: null,
			studio: EMPTY_STUDIO,
			setStudio: (studio) => {
				set({ studio });
			},
			giveGift: (id) => {
				const slot = slotOf(id);
				set({ gift: id, equipped: [...get().equipped.filter((x) => slotOf(x) !== slot), id] });
			},
			setHideCrown: (hide) => {
				set({ hideCrown: hide });
			},
			setKmIdx: (index) => {
				set({ kmIdx: Math.max(0, Math.min(BUDDY_KMS.length - 1, index)) });
			},
			setGoals: (goals) => {
				set({ goals });
			},
			equip: (id) => {
				if (id === "base") {
					set({ equipped: [] });
					return false;
				}
				const current = get().equipped;
				if (current.includes(id)) {
					set({ equipped: current.filter((x) => x !== id) });
					return false;
				}
				const slot = slotOf(id);
				set({ equipped: [...current.filter((x) => slotOf(x) !== slot), id] });
				return true;
			},
			setColor: (color, isTier) => {
				set(isTier ? { color } : { color, lastFree: color });
			},
			setAlarm: (alarm) => {
				set({ alarm: { ...get().alarm, ...alarm } });
			},
			hydrate: (profile) => {
				set({
					goals: profile.goals,
					color: isColor(profile.color) ? profile.color : get().color,
					lastFree: isColor(profile.lastFree) ? profile.lastFree : get().lastFree,
					equipped: profile.equipped.filter(isAccessory),
					hideCrown: profile.hideCrown ?? get().hideCrown,
				});
			},
		}),
		{
			name: "@pace-team:buddy",
			storage: createJSONStorage(() => AsyncStorage),
			partialize: (s) => ({
				goals: s.goals,
				equipped: s.equipped,
				color: s.color,
				lastFree: s.lastFree,
				kmIdx: s.kmIdx,
				alarm: s.alarm,
				hideCrown: s.hideCrown,
				gift: s.gift,
				studio: s.studio,
			}),
		},
	),
);
