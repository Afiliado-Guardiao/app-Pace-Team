import { renderHook } from "@testing-library/react-native";

import { padSlots, slotCount } from "../slots";
import { useSlotCount } from "../useSlotCount";

describe("lugares fixos do mapa", () => {
	it("a lista tem sempre o mesmo tamanho, com o que falta escondido", () => {
		expect(padSlots(["a", "b"], 4)).toEqual(["a", "b", null, null]);
		expect(padSlots(undefined, 2)).toEqual([null, null]);
	});

	it("cabe uma equipe de 50", () => {
		expect([0, 10, 11, 25, 26, 50].map(slotCount)).toEqual([10, 10, 25, 25, 50, 50]);
	});

	it("colega que sai não encolhe a lista", () => {
		const { result, rerender } = renderHook(({ n }: { n: number }) => useSlotCount(n), {
			initialProps: { n: 12 },
		});
		expect(result.current).toBe(25);
		rerender({ n: 0 });
		expect(result.current).toBe(25);
	});
});
