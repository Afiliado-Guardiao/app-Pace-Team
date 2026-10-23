import { useWindowDimensions } from "react-native";

import {
	BUDDY_ACCESSORIES,
	BUDDY_COLORS,
	BUDDY_FREE_COLORS,
	BUDDY_TIER_COLORS,
	IBuddyAccessoryId,
	IBuddyColorId,
} from "@/lib/buddy/constants";
import { isUnlocked, requirementText } from "@/lib/buddy/rules";
import { useBuddyStore } from "@/lib/buddy/store";
import { useBuddyContext } from "@/lib/buddy/useBuddyContext";

import { useBuddyLook } from "./useBuddyLook";

export interface IColorItem {
	id: IBuddyColorId;
	name: string;
	sub: string;
	isLocked: boolean;
	isSelected: boolean;
}

export interface IAccessoryItem {
	id: IBuddyAccessoryId | "base";
	name: string;
	req: string;
	isLocked: boolean;
	isWorn: boolean;
}

const SIDE = 20;

// Largura de cada célula numa grade de n colunas
const cellWidth = (screen: number, columns: number, gap: number): number =>
	(screen - SIDE * 2 - gap * (columns - 1)) / columns;

// "Seu Buddy": cores, cores do ranking (só a do nível atual) e acessórios.
export const useBuddyWardrobe = () => {
	const { width } = useWindowDimensions();
	const ctx = useBuddyContext();
	const goals = useBuddyStore((s) => s.goals);
	const { color, accessories } = useBuddyLook();

	const colorItem = (id: IBuddyColorId): IColorItem => {
		const pal = BUDDY_COLORS[id];
		const isFree = !pal.tier || ctx.rank === id;
		return {
			id,
			name: pal.name,
			sub: pal.tier ? (isFree ? "Seu nível" : `Só ${pal.name}`) : "",
			isLocked: !isFree,
			isSelected: color === id,
		};
	};

	const accItems: IAccessoryItem[] = [
		{
			id: "base",
			name: "Sem nada",
			req: accessories.length === 0 ? "Usando" : "Tirar tudo",
			isLocked: false,
			isWorn: accessories.length === 0,
		},
		...BUDDY_ACCESSORIES.map((a) => {
			const isFree = isUnlocked(a, goals, ctx);
			const isWorn = accessories.includes(a.id);
			return {
				id: a.id,
				name: a.name,
				req: isFree ? (isWorn ? "Usando" : "Liberado") : requirementText(a, goals),
				isLocked: !isFree,
				isWorn,
			};
		}),
	];

	return {
		color,
		colors: BUDDY_FREE_COLORS.map(colorItem),
		tierColors: BUDDY_TIER_COLORS.map(colorItem),
		accItems,
		cells: {
			color: cellWidth(width, 5, 6),
			tier: cellWidth(width, 3, 6),
			acc: cellWidth(width, 4, 8),
		},
		pickColor: (item: IColorItem) => {
			if (!item.isLocked) useBuddyStore.getState().setColor(item.id, !!BUDDY_COLORS[item.id].tier);
		},
		equip: (item: IAccessoryItem) => {
			if (!item.isLocked) useBuddyStore.getState().equip(item.id);
		},
	};
};
