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
import { useMyPro } from "@/lib/data";
import { IS_PREVIEW } from "@/constants/preview";
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
	isLockOpen: boolean;
	toast: IFloatingToastData | null;
	apply: () => void;
	reset: () => void;
	closeLock: () => void;
	openPro: () => void;
	goBack: () => void;
}

const same = (a: IBuddyStudio, b: IBuddyStudio): boolean =>
	a.color === b.color && a.head === b.head && a.eyes === b.eyes && a.effect === b.effect;

// PACE BUDDY STUDIO: experimenta cores, acessórios e efeitos Premium no Buddy
// e aplica (só com o Team Pro). O que foi conquistado correndo não muda.
export const useBuddyStudio = (): IUseBuddyStudioReturn => {
	const router = useRouter();
	const { toast, showToast } = useFloatingToast();
	const { isPro } = useMyPro();
	const ctx = useBuddyContext();
	const color = useBuddyStore((s) => s.color);
	const lastFree = useBuddyStore((s) => s.lastFree);
	const equipped = useBuddyStore((s) => s.equipped);
	const goals = useBuddyStore((s) => s.goals);
	const saved = useBuddyStore((s) => s.studio);
	const setStudio = useBuddyStore((s) => s.setStudio);
	const [tab, setTabState] = useState<IStudioTab>("cores");
	const [draft, setDraft] = useState<IBuddyStudio>(saved);
	const [isLockOpen, setIsLockOpen] = useState(false);
	const canApply = IS_PREVIEW || isPro;

	const base = useMemo(
		() => ({
			color: effectiveColor(color, lastFree, ctx.rank),
			accessories: wornAccessories(equipped, goals, ctx),
		}),
		[color, lastFree, equipped, goals, ctx],
	);
	const preview = withStudio(base, draft);
	const look = (next: IBuddyStudio) => withStudio(base, next);

	const item = (
		id: string,
		name: string,
		next: IBuddyStudio,
		isSelected: boolean,
	): IStudioItem => ({
		id,
		name,
		isSelected,
		...look(next),
		pick: () => {
			setDraft(next);
		},
	});

	const toggle = <K extends keyof IBuddyStudio>(key: K, value: IBuddyStudio[K]): IBuddyStudio => ({
		...draft,
		[key]: draft[key] === value ? null : value,
	});

	const byTab: Record<IStudioTab, () => IStudioItem[]> = {
		cores: () =>
			BUDDY_PRO_COLORS.map((c) =>
				item(c, BUDDY_COLORS[c].name, toggle("color", c), draft.color === c),
			),
		acessorios: () =>
			BUDDY_PRO_ACCESSORIES.map((a) => {
				const key = a.slot === "eyes" ? "eyes" : "head";
				return item(a.id, a.name, toggle(key, a.id), draft[key] === a.id);
			}),
		efeitos: () =>
			BUDDY_PRO_EFFECTS.map((e) =>
				item(e.id, e.name, toggle("effect", e.id), draft.effect === e.id),
			),
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
		isLockOpen,
		toast,
		apply: () => {
			if (!canApply) {
				setIsLockOpen(true);
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
		closeLock: () => {
			setIsLockOpen(false);
		},
		openPro: () => {
			setIsLockOpen(false);
			router.push(ROUTES.PRO);
		},
		goBack: () => {
			if (router.canGoBack()) router.back();
			else router.replace(ROUTES.HOME);
		},
	};
};
