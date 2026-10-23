// Regras do Pace Buddy (design: effColor, isUn, reqTxt…), usadas pela tela
// "Seu Buddy" e pelo estado que o widget e o atalho leem fora do app.
import {
	BUDDY_ACCESSORIES,
	BUDDY_COLORS,
	BUDDY_SICK_DAYS,
	IBuddyAccessory,
	IBuddyAccessoryId,
	IBuddyColorId,
	IBuddyRank,
} from "./constants";

// O que vem do app: equipe, liderança e pódio no ranking semanal
export interface IBuddyContext {
	teamName: string;
	isLeader: boolean;
	rank: IBuddyRank;
}

const DAY_MS = 86_400_000;

// Pódio da equipe no ranking semanal → cor metálica liberada
export const rankOfPosition = (position: number | null | undefined): IBuddyRank => {
	if (position === 1) return "ouro";
	if (position === 2) return "prata";
	if (position === 3) return "bronze";
	return "none";
};

// Cor de ranking só vale enquanto a equipe está naquele nível
export const effectiveColor = (
	color: IBuddyColorId,
	lastFree: IBuddyColorId,
	rank: IBuddyRank,
): IBuddyColorId => (BUDDY_COLORS[color].tier && color !== rank ? lastFree : color);

const hasTeam = (ctx: IBuddyContext): boolean => ctx.teamName.trim().length > 0;

export const isUnlocked = (acc: IBuddyAccessory, goals: number, ctx: IBuddyContext): boolean =>
	acc.leader ? ctx.isLeader && hasTeam(ctx) : goals >= (acc.need ?? 0);

export const requirementText = (acc: IBuddyAccessory, goals: number): string =>
	acc.leader
		? "Só líder"
		: `${String(Math.min(goals, acc.need ?? 0))}/${String(acc.need ?? 0)} metas`;

export const accessoryOf = (id: IBuddyAccessoryId): IBuddyAccessory | undefined =>
	BUDDY_ACCESSORIES.find((a) => a.id === id);

// Acessórios vestidos que continuam liberados (ex.: a coroa some se deixar de ser líder)
export const wornAccessories = (
	equipped: readonly IBuddyAccessoryId[],
	goals: number,
	ctx: IBuddyContext,
): IBuddyAccessoryId[] =>
	equipped.filter((id) => {
		const acc = accessoryOf(id);
		return acc ? isUnlocked(acc, goals, ctx) : false;
	});

// Data em que o Buddy fica doente (7 dias sem correr); null = nunca correu
export const sickAt = (lastRunAt: number | null): number | null =>
	lastRunAt === null ? null : lastRunAt + BUDDY_SICK_DAYS * DAY_MS;
