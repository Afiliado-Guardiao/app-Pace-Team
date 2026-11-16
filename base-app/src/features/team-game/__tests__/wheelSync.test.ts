import { act, renderHook } from "@testing-library/react-native";

import { demoSpinGame, demoStartGame } from "@/lib/data/teamGameDemo";
import { ITeamGame } from "@/lib/supabase";

import { useWheelSync } from "../hooks/useWheelSync";

const mockLand = jest.fn();
const mockPlace = jest.fn();
jest.mock("../hooks/useWheelSpin", () => ({
	useWheelSpin: () => ({ outerStyle: {}, innerStyle: {}, land: mockLand, place: mockPlace }),
}));

const spun = (game: ITeamGame): ITeamGame => {
	const result = demoSpinGame(game);
	if (!result) throw new Error("sem giro");
	return result.game;
};

describe("Roleta: o resultado só aparece quando os anéis param", () => {
	beforeEach(() => {
		mockLand.mockReset();
		mockPlace.mockReset();
	});

	it("esconde o sorteado enquanto gira e mostra quando para", () => {
		const start = demoStartGame("facil", ["Ana", "Lucas"]);
		const { result, rerender } = renderHook(({ game }) => useWheelSync(game), {
			initialProps: { game: start },
		});
		expect(result.current.hiddenId).toBeNull();
		expect(result.current.isSpinning).toBe(false);

		const next = spun(start);
		rerender({ game: next });
		const picked = result.current.latest;
		expect(picked).not.toBeNull();
		expect(result.current.hiddenId).toBe(picked?.userId);
		expect(result.current.isSpinning).toBe(true);
		expect(result.current.hit).toBeNull();
		expect(mockLand).toHaveBeenCalledTimes(1);

		// Os anéis param
		const onDone = mockLand.mock.calls[0][1] as () => void;
		act(() => {
			onDone();
		});
		expect(result.current.hiddenId).toBeNull();
		expect(result.current.isSpinning).toBe(false);
		expect(result.current.hit).toEqual({ challenge: picked?.challenge, slot: picked?.slot });
	});

	it("abrindo a tela no meio da roleta, o que já saiu aparece direto", () => {
		const mid = spun(demoStartGame("medio", ["Ana"]));
		const { result } = renderHook(() => useWheelSync(mid));
		expect(result.current.hiddenId).toBeNull();
		expect(result.current.isSpinning).toBe(false);
		expect(mockPlace).toHaveBeenCalledTimes(1);
		expect(mockLand).not.toHaveBeenCalled();
	});
});
