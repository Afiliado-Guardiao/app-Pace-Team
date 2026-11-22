// Itens do mapa em lugares fixos. No iPhone, um item que entra ou sai no meio
// da lista do mapa pode derrubar o app: por isso a lista tem sempre o mesmo
// tamanho e a mesma ordem, e o que não aparece fica montado, só escondido.
// Equipe de até 50 pessoas.
const SIZES = [10, 25, 50] as const;

// Quantos lugares para tantos itens
export const slotCount = (items: number): number =>
	SIZES.find((size) => items <= size) ?? SIZES[SIZES.length - 1];

export const padSlots = <T>(items: readonly T[] | undefined, size: number): (T | null)[] =>
	Array.from({ length: size }, (_, i) => items?.[i] ?? null);
