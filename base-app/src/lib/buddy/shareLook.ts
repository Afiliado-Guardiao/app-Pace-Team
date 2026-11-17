import {
	BUDDY_ACCESSORIES,
	BUDDY_COLORS,
	BUDDY_PRO_ACCESSORIES,
	IBuddyAccessoryId,
	IBuddyColorId,
} from "./constants";

// Visual do Bud que vai junto no post (cor + acessórios do Studio). Fica
// guardado no próprio post, então quem vê o feed vê o Bud de quem postou.
export interface IShareLook {
	color: IBuddyColorId;
	accessories: IBuddyAccessoryId[];
}

const ACCESSORY_IDS = new Set<string>(
	[...BUDDY_ACCESSORIES, ...BUDDY_PRO_ACCESSORIES].map((a) => a.id),
);
const STUDIO_IDS = new Set<string>(BUDDY_PRO_ACCESSORIES.map((a) => a.id));

const isColor = (v: unknown): v is IBuddyColorId => typeof v === "string" && v in BUDDY_COLORS;
const isAccessory = (v: unknown): v is IBuddyAccessoryId =>
	typeof v === "string" && ACCESSORY_IDS.has(v);

// Lê o visual guardado num post (de uma versão antiga ou de outro aparelho):
// só o que o app conhece. O Bud só aparece no post de quem usa acessório pago
// do Buddy Studio (é a vitrine dele); sem isso, nada de Bud.
export const toShareLook = (raw: unknown): IShareLook | null => {
	if (!raw || typeof raw !== "object") return null;
	const { color, accessories } = raw as { color?: unknown; accessories?: unknown };
	if (!isColor(color)) return null;
	const list = Array.isArray(accessories) ? accessories.filter(isAccessory).slice(0, 6) : [];
	if (!list.some((id) => STUDIO_IDS.has(id))) return null;
	return { color, accessories: list };
};
