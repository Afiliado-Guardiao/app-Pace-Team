import AsyncStorage from "@react-native-async-storage/async-storage";

import { sharedAuthStorage } from "@/lib/supabase/sharedAuthStorage";

import { BUDDY_KEYS, buddyNative } from "../native";
import { flushPendingRuns } from "../pendingRuns";

const mockSaveRun = jest.fn();
const mockCompleteGoal = jest.fn();

jest.mock("@/lib/supabase", () => ({
	saveRun: (...args: unknown[]) => mockSaveRun(...args) as unknown,
	completeBuddyGoal: () => mockCompleteGoal() as unknown,
}));

// App Group de mentira (no teste não há iPhone)
const group = new Map<string, string>();

beforeEach(() => {
	group.clear();
	mockSaveRun.mockReset();
	mockCompleteGoal.mockReset();
	jest.spyOn(buddyNative, "get").mockImplementation((key) => group.get(key) ?? null);
	jest.spyOn(buddyNative, "set").mockImplementation((key, value) => {
		group.set(key, value);
	});
	jest.spyOn(buddyNative, "remove").mockImplementation((key) => {
		group.delete(key);
	});
});

const run = (finishedAt: number, goalReached: boolean) => ({
	mode: "dist",
	seconds: 1800,
	km: 5,
	finishedAt,
	route: [[-23.5, -46.6]],
	goalReached,
});

describe("Corridas feitas pelo atalho", () => {
	it("envia a fila, conta a meta e mantém só o que falhou", async () => {
		group.set(BUDDY_KEYS.pendingRuns, JSON.stringify([run(1, true), run(2, false)]));
		mockSaveRun.mockResolvedValueOnce({}).mockRejectedValueOnce(new Error("offline"));
		mockCompleteGoal.mockResolvedValue({ goals: 1, unlocked: null });

		await expect(flushPendingRuns()).resolves.toBe(1);
		expect(mockCompleteGoal).toHaveBeenCalledTimes(1);
		const left = JSON.parse(group.get(BUDDY_KEYS.pendingRuns) ?? "[]") as { finishedAt: number }[];
		expect(left.map((r) => r.finishedAt)).toEqual([2]);
	});

	it("não salva de novo se só a contagem da meta falhar", async () => {
		group.set(BUDDY_KEYS.pendingRuns, JSON.stringify([run(1, true)]));
		mockSaveRun.mockResolvedValue({});
		mockCompleteGoal.mockRejectedValue(new Error("offline"));

		await expect(flushPendingRuns()).resolves.toBe(1);
		expect(group.has(BUDDY_KEYS.pendingRuns)).toBe(false);
	});
});

describe("Login compartilhado com o atalho", () => {
	it("leva o login antigo para o App Group e lê de lá depois", async () => {
		await AsyncStorage.setItem("sb-x-auth-token", "antigo");
		await expect(sharedAuthStorage.getItem("sb-x-auth-token")).resolves.toBe("antigo");
		expect(group.get("sb-x-auth-token")).toBe("antigo");
		// O atalho renovou o token: o app passa a usar o novo
		group.set("sb-x-auth-token", "renovado");
		await expect(sharedAuthStorage.getItem("sb-x-auth-token")).resolves.toBe("renovado");
	});
});
