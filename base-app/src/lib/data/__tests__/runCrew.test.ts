import { buildRunCrew } from "../runCrew";
import { ITeamRunView } from "../useTeamRun";

const PATH: [number, number][] = [
	[-23.6, -46.6],
	[-23.601, -46.601],
	[-23.602, -46.602],
];

const teamRun = (mates: ITeamRunView["mates"]): ITeamRunView => ({
	id: "run-1",
	userId: "me",
	name: "Wesley",
	avatarUrl: null,
	isYou: true,
	startedAt: "2026-11-02T15:47:00Z",
	seconds: 5,
	km: 0,
	points: 0,
	status: "invalid",
	mode: "team",
	route: [],
	mates,
});

describe("buildRunCrew", () => {
	it("sozinho: o próprio percurso com a sua foto redonda na chegada", () => {
		const crew = buildRunCrew({ name: "Wesley", photo: "w.jpg", km: 2, route: PATH }, null);
		expect(crew.route).toBe(PATH);
		expect(crew.crew).toEqual([{ image: { uri: "w.jpg" }, name: "Wesley", at: 1 }]);
	});

	it("sozinho e sem foto de perfil: só o percurso", () => {
		const crew = buildRunCrew({ name: "Wesley", photo: null, km: 2, route: PATH }, null);
		expect(crew.crew).toEqual([]);
	});

	it("parado em casa: desenha o percurso do colega e deixa a sua foto na largada com 0 m", () => {
		const run = teamRun([
			{
				name: "Matheus Dutra",
				isYou: false,
				km: 1.2,
				seconds: 600,
				avatarUrl: "m.jpg",
				route: PATH,
			},
		]);
		const crew = buildRunCrew({ name: "Wesley", photo: "w.jpg", km: 0, route: [] }, run);
		expect(crew.route).toBe(PATH);
		expect(crew.crew).toEqual([
			{ image: { uri: "w.jpg" }, name: "Wesley", label: "Wesley · 0 m", at: 0 },
			{ image: { uri: "m.jpg" }, name: "Matheus Dutra", label: "Matheus · 1,20 km", at: 1 },
		]);
	});

	it("quem correu menos fica no meio do caminho de quem foi mais longe", () => {
		const run = teamRun([
			{ name: "Matheus", isYou: false, km: 4, seconds: 1500, avatarUrl: null, route: PATH },
		]);
		const crew = buildRunCrew({ name: "Wesley", photo: null, km: 2, route: PATH }, run);
		expect(crew.crew.map((c) => c.at)).toEqual([0.5, 1]);
	});
});
