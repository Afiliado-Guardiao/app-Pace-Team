import { useRef } from "react";

import { slotCount } from "./slots";

// Lugares reservados no mapa: só aumentam (equipe grande), nunca diminuem com
// o mapa aberto. Quando aumentam, o mapa é montado de novo (a chave muda).
export const useSlotCount = (items: number | undefined): number => {
	const size = useRef(slotCount(0));
	size.current = Math.max(size.current, slotCount(items ?? 0));
	return size.current;
};
