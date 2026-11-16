import { demoSpinGame, demoStartGame } from "@/lib/data/teamGameDemo";

import { formatPace } from "../constants";
import { landAngle } from "../constants/wheel";

const norm = (deg: number): number => ((deg % 360) + 360) % 360;

describe("Roleta da equipe", () => {
	it("para a casa sorteada embaixo da seta, girando no sentido pedido", () => {
		const cw = landAngle({ from: 30, index: 3, n: 8, turns: 5, dir: 1 });
		expect(norm(cw)).toBe(norm(-135));
		expect(cw).toBeGreaterThan(30 + 5 * 360 - 1);
		const ccw = landAngle({ from: 0, index: 1, n: 3, turns: 4, dir: -1 });
		expect(norm(ccw)).toBe(norm(-120));
		expect(ccw).toBeLessThan(-4 * 360);
	});

	it("formata o pace", () => {
		expect(formatPace(330)).toBe("5:30");
		expect(formatPace(405)).toBe("6:45");
	});

	it("cada giro sorteia uma pessoa nova e no fim todos correm", () => {
		let game = demoStartGame("dificil", ["Ana", "Lucas"]);
		const picked = new Set<string>();
		for (let i = 0; i < 3; i += 1) {
			const spin = demoSpinGame(game);
			expect(spin).not.toBeNull();
			if (!spin) return;
			picked.add(spin.userId);
			game = spin.game;
		}
		expect(picked.size).toBe(3);
		expect(game.status).toBe("running");
		expect(demoSpinGame(game)).toBeNull();
		expect(game.players.every((p) => p.km !== null && p.km >= 6)).toBe(true);
	});
});
