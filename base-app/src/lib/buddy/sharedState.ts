// Estado do Buddy que o app grava no App Group para o widget e o atalho
// (Toque Traseiro) lerem fora do app. É o contrato com o código Swift em
// targets/buddy-widget: mudar um campo aqui exige mudar lá também.
import {
	BUDDY_ACCESSORIES,
	BUDDY_KMS,
	IBuddyAccessoryId,
	IBuddyColorId,
	IBuddyRank,
} from "./constants";
import { effectiveColor, IBuddyContext, sickAt, withStudio, wornAccessories } from "./rules";
import { IBuddyAlarm, IBuddyStudio } from "./store";

export const BUDDY_STATE_VERSION = 1;

export interface IBuddySharedState {
	version: number;
	userName: string;
	teamName: string;
	isLeader: boolean;
	rank: IBuddyRank;
	// Cor que o Buddy está usando (a de ranking só vale no nível certo)
	color: IBuddyColorId;
	accessories: IBuddyAccessoryId[];
	goals: number;
	// Próximo acessório por metas (frase "Faltam x metas pra liberar…")
	next: { name: string; need: number } | null;
	kms: readonly number[];
	kmIdx: number;
	// ms desde 1970; o Buddy fica doente em sickAt
	lastRunAt: number | null;
	sickAt: number | null;
	alarm: IBuddyAlarm;
}

interface IBuddyInputs {
	userName: string;
	ctx: IBuddyContext;
	goals: number;
	equipped: readonly IBuddyAccessoryId[];
	color: IBuddyColorId;
	lastFree: IBuddyColorId;
	kmIdx: number;
	lastRunAt: number | null;
	alarm: IBuddyAlarm;
	// Visual do Buddy Studio (só quando o atleta tem o Team Pro)
	studio?: IBuddyStudio | null;
}

export const buildSharedState = (input: IBuddyInputs): IBuddySharedState => {
	const next = BUDDY_ACCESSORIES.find((a) => a.need && input.goals < a.need);
	const base = {
		color: effectiveColor(input.color, input.lastFree, input.ctx.rank),
		accessories: wornAccessories(input.equipped, input.goals, input.ctx),
	};
	const look = input.studio ? withStudio(base, input.studio) : base;
	return {
		version: BUDDY_STATE_VERSION,
		userName: input.userName,
		teamName: input.ctx.teamName,
		isLeader: input.ctx.isLeader,
		rank: input.ctx.rank,
		color: look.color,
		accessories: look.accessories,
		goals: input.goals,
		next: next ? { name: next.name, need: next.need ?? 0 } : null,
		kms: BUDDY_KMS,
		kmIdx: input.kmIdx,
		lastRunAt: input.lastRunAt,
		sickAt: sickAt(input.lastRunAt),
		alarm: input.alarm,
	};
};
