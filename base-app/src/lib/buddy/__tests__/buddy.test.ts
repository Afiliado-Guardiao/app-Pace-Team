import { act, renderHook } from "@testing-library/react-native";

import { BUDDY_ACCESSORIES } from "../constants";
import { BUDDY_KEYS, buddyNative } from "../native";
import { effectiveColor, isUnlocked, rankOfPosition, sickAt, wornAccessories } from "../rules";
import { buildSharedState } from "../sharedState";
import { DEFAULT_ALARM, useBuddyStore } from "../store";
import { useBuddySync } from "../useBuddySync";

// O 1º do ranking da equipe (com pontos) é quem ganha a coroa
const mockTeam = {
	name: "Pace Sharks",
	isCaptain: false,
	position: 2,
	members: [
		{ name: "Lucas", you: true, pts: 120 },
		{ name: "Ana", pts: 80 },
	],
};
const mockRuns = [{ startedAt: "2026-10-20T06:00:00.000Z" }];

jest.mock("@/lib/data", () => ({
	useMyTeam: () => ({ team: mockTeam }),
	useMyRuns: () => ({ saved: mockRuns }),
}));
jest.mock("@/lib/supabase/client", () => ({ AUTH_STORAGE_KEY: "sb-test-auth-token" }));
jest.mock("../notifications", () => ({
	scheduleSickReminder: jest.fn(() => Promise.resolve()),
	scheduleBuddyAlarm: jest.fn(() => Promise.resolve()),
}));
jest.mock("@/store", () => ({
	useStore: (pick: (s: { user: { name: string } }) => unknown) => pick({ user: { name: "Lucas" } }),
}));

const acc = (id: string) => {
	const found = BUDDY_ACCESSORIES.find((a) => a.id === id);
	if (!found) throw new Error(id);
	return found;
};

describe("Pace Buddy — regras", () => {
	it("pódio da equipe libera a cor metálica do nível", () => {
		expect(rankOfPosition(1)).toBe("ouro");
		expect(rankOfPosition(3)).toBe("bronze");
		expect(rankOfPosition(4)).toBe("none");
		// Caiu de nível: volta para a cor normal
		expect(effectiveColor("ouro", "azul", "prata")).toBe("azul");
		expect(effectiveColor("prata", "azul", "prata")).toBe("prata");
	});

	it("acessórios por metas; a coroa vai sozinha para o 1º da equipe, por cima", () => {
		const ctx = { teamName: "Pace Sharks", isLeader: false, rank: "none" as const };
		expect(isUnlocked(acc("faixa"), 3, ctx)).toBe(true);
		expect(wornAccessories(["bone"], 20, ctx)).toEqual(["bone"]);
		expect(wornAccessories(["bone"], 20, { ...ctx, isLeader: true })).toEqual(["bone", "coroa"]);
		// O líder escondeu a coroa
		expect(wornAccessories(["bone"], 20, { ...ctx, isLeader: true, hideCrown: true })).toEqual([
			"bone",
		]);
	});

	it("fica doente 7 dias depois da última corrida", () => {
		expect(sickAt(null)).toBeNull();
		expect(sickAt(0)).toBe(7 * 86_400_000);
	});

	it("estado do widget usa só o que está liberado", () => {
		const state = buildSharedState({
			userName: "Lucas",
			ctx: { teamName: "", isLeader: true, rank: "none" },
			goals: 4,
			equipped: ["faixa", "coroa"],
			color: "ouro",
			lastFree: "verde",
			kmIdx: 3,
			lastRunAt: null,
			alarm: DEFAULT_ALARM,
		});
		expect(state.color).toBe("verde");
		// Sem equipe a coroa não vale
		expect(state.accessories).toEqual(["faixa"]);
		expect(state.next).toEqual({ name: "Óculos de grau", need: 5 });
	});
});

describe("Pace Buddy — sincronização com o widget", () => {
	it("grava o estado e recarrega o widget só quando muda", () => {
		const set = jest.spyOn(buddyNative, "set");
		const reload = jest.spyOn(buddyNative, "reloadWidgets");
		const stateWrites = () => set.mock.calls.filter(([key]) => key === BUDDY_KEYS.state);
		const { rerender } = renderHook(() => {
			useBuddySync();
		});
		expect(stateWrites()).toHaveLength(1);
		// O atalho também recebe onde está o servidor e o login
		expect(set.mock.calls.some(([key]) => key === BUDDY_KEYS.config)).toBe(true);
		const sent = JSON.parse(String(stateWrites()[0]?.[1])) as { rank: string; isLeader: boolean };
		expect(sent.rank).toBe("prata");
		expect(sent.isLeader).toBe(true);
		rerender({});
		expect(stateWrites()).toHaveLength(1);
		act(() => {
			useBuddyStore.getState().setGoals(3);
		});
		rerender({});
		expect(stateWrites()).toHaveLength(2);
		expect(reload).toHaveBeenCalledTimes(2);
	});
});
