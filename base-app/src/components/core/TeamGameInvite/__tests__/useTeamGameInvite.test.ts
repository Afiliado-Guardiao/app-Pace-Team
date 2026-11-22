import { act, renderHook } from "@testing-library/react-native";

import { ITeamGame } from "@/lib/supabase";

import { useSeenGamesStore } from "../seenStore";
import { useTeamGameInvite } from "../useTeamGameInvite";

const mockNavigate = jest.fn();
let mockGame: ITeamGame | null = null;

jest.mock("expo-router", () => ({
	useRouter: () => ({ navigate: mockNavigate, push: jest.fn() }),
	useSegments: () => ["(auth)", "(tabs)", "home"],
}));
jest.mock("@/lib/data", () => ({ useTeamGame: () => ({ game: mockGame }) }));
jest.mock("@/lib/run", () => ({
	useRunStore: (pick: (s: { setMode: jest.Mock; setGoal: jest.Mock }) => unknown) =>
		pick({ setMode: jest.fn(), setGoal: jest.fn() }),
}));

const player = (o: Partial<ITeamGame["players"][number]>): ITeamGame["players"][number] => ({
	userId: "u",
	name: "Ana Souza",
	avatarPath: null,
	isYou: false,
	slot: 0,
	challenge: 0,
	km: 5,
	pace: 240,
	assignedAt: null,
	status: "pending",
	points: null,
	...o,
});

const game = (o: Partial<ITeamGame>): ITeamGame => ({
	id: "g1",
	level: "medio",
	status: "running",
	isStarter: false,
	starterName: "Dutra",
	createdAt: "",
	endsAt: null,
	isSuccess: null,
	wheel: [],
	stakes: { win: 20, lose: 10 },
	players: [
		player({ userId: "a", name: "Dutra" }),
		player({ userId: "me", isYou: true, km: 3, pace: 330 }),
	],
	...o,
});

describe("useTeamGameInvite", () => {
	beforeEach(() => {
		useSeenGamesStore.setState({ ids: [] });
		mockNavigate.mockClear();
	});

	it("abre para quem foi sorteado, com o desafio de cada um", () => {
		mockGame = game({});
		const { result } = renderHook(() => useTeamGameInvite());
		expect(result.current.isOpen).toBe(true);
		expect(result.current.mine).toBe("3 km · pace 5'30\"/km");
		expect(result.current.rows.map((r) => r.name)).toEqual(["Dutra", "Você"]);
	});

	it("não abre para quem chamou a roleta nem enquanto ela gira", () => {
		mockGame = game({ isStarter: true });
		expect(renderHook(() => useTeamGameInvite()).result.current.isOpen).toBe(false);
		mockGame = game({ status: "spinning" });
		expect(renderHook(() => useTeamGameInvite()).result.current.isOpen).toBe(false);
	});

	it("aceitar abre a corrida e o convite não volta", () => {
		mockGame = game({});
		const { result, rerender } = renderHook(() => useTeamGameInvite());
		act(() => {
			result.current.accept();
		});
		rerender({});
		expect(mockNavigate).toHaveBeenCalled();
		expect(result.current.isOpen).toBe(false);
	});
});
