// Regras do Pace Buddy (design: effColor, isUn, reqTxt…), usadas pela tela
// "Seu Buddy" e pelo estado que o widget e o atalho leem fora do app.
import {
	BUDDY_ACCESSORIES,
	BUDDY_COLORS,
	BUDDY_CROWN,
	BUDDY_PRO_ACCESSORIES,
	BUDDY_SICK_DAYS,
	IBuddyAccessory,
	IBuddyAccessoryId,
	IBuddyColorId,
	IBuddyEffectId,
	IBuddyRank,
	IBuddySlot,
} from "./constants";

// O que vem do app: equipe, liderança e pódio no ranking semanal
export interface IBuddyContext {
	teamName: string;
	// 1º do ranking da semana dentro da equipe (ganha a coroa)
	isLeader: boolean;
	rank: IBuddyRank;
	// O líder escolheu esconder a coroa
	hideCrown?: boolean;
	// Primeiro acessório, ganho de presente no onboarding (liberado sem metas)
	gift?: IBuddyAccessoryId | null;
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
	acc.leader ? ctx.isLeader && hasTeam(ctx) : acc.id === ctx.gift || goals >= (acc.need ?? 0);

export const requirementText = (acc: IBuddyAccessory, goals: number): string =>
	acc.leader
		? "Só líder"
		: `${String(Math.min(goals, acc.need ?? 0))}/${String(acc.need ?? 0)} metas`;

export const accessoryOf = (id: IBuddyAccessoryId): IBuddyAccessory | undefined =>
	BUDDY_ACCESSORIES.find((a) => a.id === id);

// O 1º da equipe usa a coroa, a não ser que tenha escondido
export const hasCrown = (ctx: IBuddyContext): boolean =>
	ctx.isLeader && hasTeam(ctx) && !ctx.hideCrown;

// Acessórios vestidos que continuam liberados, mais a coroa do líder por cima
export const wornAccessories = (
	equipped: readonly IBuddyAccessoryId[],
	goals: number,
	ctx: IBuddyContext,
): IBuddyAccessoryId[] => {
	const worn = equipped.filter((id) => {
		const acc = accessoryOf(id);
		return acc ? isUnlocked(acc, goals, ctx) : false;
	});
	return hasCrown(ctx) ? [...worn, BUDDY_CROWN] : worn;
};

// Data em que o Buddy fica doente (7 dias sem correr); null = nunca correu
export const sickAt = (lastRunAt: number | null): number | null =>
	lastRunAt === null ? null : lastRunAt + BUDDY_SICK_DAYS * DAY_MS;

// Buddy Studio por cima do visual conquistado: troca a cor e o acessório do
// mesmo lugar (cabeça/olhos). A coroa do líder continua por cima.
export interface IBuddyStudioPick {
	color: IBuddyColorId | null;
	head: IBuddyAccessoryId | null;
	eyes: IBuddyAccessoryId | null;
	back?: IBuddyAccessoryId | null;
	mouth?: IBuddyAccessoryId | null;
	effect: IBuddyEffectId | null;
}

const slotOfAny = (id: IBuddyAccessoryId): IBuddySlot | undefined =>
	[...BUDDY_ACCESSORIES, ...BUDDY_PRO_ACCESSORIES].find((a) => a.id === id)?.slot;

export const withStudio = (
	look: { color: IBuddyColorId; accessories: IBuddyAccessoryId[] },
	studio: IBuddyStudioPick,
): { color: IBuddyColorId; accessories: IBuddyAccessoryId[]; effect: IBuddyEffectId | null } => {
	const picks = [studio.head, studio.eyes, studio.back ?? null, studio.mouth ?? null].filter(
		(x): x is IBuddyAccessoryId => x !== null,
	);
	const taken = new Set(picks.map(slotOfAny));
	const kept = look.accessories.filter((id) => id === BUDDY_CROWN || !taken.has(slotOfAny(id)));
	return {
		color: studio.color ?? look.color,
		accessories: [...kept, ...picks],
		effect: studio.effect,
	};
};
