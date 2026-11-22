import { ITeamGame, ITeamGamePlayer } from "@/lib/supabase";

import { resultRows } from "../rows";

const player = (o: Partial<ITeamGamePlayer>): ITeamGamePlayer => ({
	userId: "u",
	name: "Ana Souza",
	avatarPath: null,
	isYou: false,
	slot: 0,
	challenge: 0,
	km: 4,
	pace: 420,
	assignedAt: null,
	status: "failed",
	points: -10,
	runKm: 0.412,
	runSeconds: 685,
	...o,
});

const game = (players: ITeamGamePlayer[]): ITeamGame => ({
	id: "g",
	level: "facil",
	status: "done",
	isStarter: false,
	starterName: "Ana",
	createdAt: "",
	endsAt: null,
	isSuccess: false,
	wheel: [],
	stakes: { win: 25, lose: 10 },
	players,
});

describe("resultado da roleta", () => {
	it("mostra o desafio, o que correu e os pontos perdidos, com você primeiro", () => {
		const rows = resultRows(
			game([player({ userId: "a" }), player({ userId: "me", isYou: true, slot: 1 })]),
		);
		expect(rows.map((r) => r.name)).toEqual(["Você", "Ana Souza"]);
		expect(rows[0].goal).toBe("4 km em até 28:00 (7'00\"/km)");
		expect(rows[0].ran).toBe("412 m em 11:25 (27'43\"/km)");
		expect(rows[0].points).toBe("−10 pts");
		expect(rows[0].isDone).toBe(false);
	});

	it("avisa quem não correu no prazo", () => {
		const [row] = resultRows(game([player({ runKm: null, runSeconds: null })]));
		expect(row.ran).toBe("Não correu no prazo");
	});
});
