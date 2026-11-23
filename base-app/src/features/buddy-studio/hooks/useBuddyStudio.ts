import { useMemo, useState } from "react";

import { useRouter } from "expo-router";

import { IFloatingToastData, useFloatingToast } from "@/components/pace";
import {
	BUDDY_COLORS,
	BUDDY_PRO_ACCESSORIES,
	BUDDY_PRO_COLORS,
	BUDDY_PRO_EFFECTS,
	effectiveColor,
	EMPTY_STUDIO,
	IBuddyAccessoryId,
	IBuddyColorId,
	IBuddyEffectId,
	IBuddyStudio,
	useBuddyContext,
	useBuddyStore,
	withStudio,
	wornAccessories,
} from "@/lib/buddy";
import { useProGate } from "@/lib/pro";
import { ROUTES } from "@/constants/routes";

import { IStudioTab, STUDIO_TOASTS } from "../constants";

export interface IStudioItem {
	id: string;
	name: string;
	isSelected: boolean;
	color: IBuddyColorId;
	accessories: IBuddyAccessoryId[];
	effect: IBuddyEffectId | null;
	pick: () => void;
}

interface IUseBuddyStudioReturn {
	tab: IStudioTab;
	setTab: (tab: string) => void;
	preview: {
		color: IBuddyColorId;
		accessories: IBuddyAccessoryId[];
		effect: IBuddyEffectId | null;
	};
	items: IStudioItem[];
	isPro: boolean;
	isDirty: boolean;
	toast: IFloatingToastData | null;
	apply: () => void;
	reset: () => void;
	goBack: () => void;
}

const same = (a: IBuddyStudio, b: IBuddyStudio): boolean =>
	a.color === b.color &&
	a.head === b.head &&
	a.eyes === b.eyes &&
	a.back === b.back &&
	a.mouth === b.mouth &&
	a.effect === b.effect;

// PACE BUDDY STUDIO: experimenta cores, acessórios e efeitos Premium no Buddy
// e aplica (só com o Team Pro). O que foi conquistado correndo não muda.
export const useBuddyStudio = (): IUseBuddyStudioReturn => {
	const router = useRouter();
	const { toast, showToast } = useFloatingToast();
	const gate = useProGate("studio");
	const ctx = useBuddyContext();
	const color = useBuddyStore((s) => s.color);
	const lastFree = useBuddyStore((s) => s.lastFree);
	const equipped = useBuddyStore((s) => s.equipped);
	const goals = useBuddyStore((s) => s.goals);
	const stored = useBuddyStore((s) => s.studio);
	const saved: IBuddyStudio = { ...EMPTY_STUDIO, ...stored };
	const setStudio = useBuddyStore((s) => s.setStudio);
	const [tab, setTabState] = useState<IStudioTab>("cores");
	const [draft, setDraft] = useState<IBuddyStudio>(saved);
	const canApply = gate.isPro;

	const base = useMemo(
		() => ({
			color: effectiveColor(color, lastFree, ctx.rank),
			accessories: wornAccessories(equipped, goals, ctx),
		}),
		[color, lastFree, equipped, goals, ctx],
	);
	const preview = withStudio(base, draft);
	const look = (next: IBuddyStudio) => withStudio(base, next);

	// Cor, acessório e efeito somam: tocar num item troca só o dele e mantém o
	// resto da escolha (tocar de novo no escolhido tira só ele). A miniatura
	// mostra o Buddy como vai ficar, com tudo junto
	const item = <K extends keyof IBuddyStudio>(
		key: K,
		value: NonNullable<IBuddyStudio[K]>,
		name: string,
	): IStudioItem => {
		const isSelected = draft[key] === value;
		return {
			id: value,
			name,
			isSelected,
			...look({ ...draft, [key]: value }),
			pick: () => {
				setDraft({ ...draft, [key]: isSelected ? null : value });
			},
		};
	};

	const byTab: Record<IStudioTab, () => IStudioItem[]> = {
		cores: () => BUDDY_PRO_COLORS.map((c) => item("color", c, BUDDY_COLORS[c].name)),
		acessorios: () => BUDDY_PRO_ACCESSORIES.map((a) => item(a.slot, a.id, a.name)),
		efeitos: () => BUDDY_PRO_EFFECTS.map((e) => item("effect", e.id, e.name)),
	};

	return {
		tab,
		setTab: (value) => {
			setTabState(value as IStudioTab);
		},
		preview,
		items: byTab[tab](),
		isPro: canApply,
		isDirty: !same(draft, saved),
		toast,
		apply: () => {
			// Sem o Pro: vê e experimenta tudo; para usar, a janela do Team Pro
			if (!canApply) {
				gate.ask();
				return;
			}
			setStudio(draft);
			showToast(STUDIO_TOASTS.applied);
		},
		reset: () => {
			setDraft(EMPTY_STUDIO);
			if (canApply) {
				setStudio(EMPTY_STUDIO);
				showToast(STUDIO_TOASTS.reset);
			}
		},
		goBack: () => {
			gate.leave();
			if (router.canGoBack()) router.back();
			else router.replace(ROUTES.HOME);
		},
	};
};
