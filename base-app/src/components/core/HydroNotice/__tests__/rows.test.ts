import { toHydroNotice } from "@/lib/hydration/notice";

import { noticeRows } from "../rows";

const DATA = {
	type: "hydro_run",
	runId: "r1",
	startedAt: "2026-11-22T20:32:39.000Z",
	seconds: 1432,
	km: 0.882,
	tempC: 27,
	weightKg: 72,
	rateLph: 0.62,
	isPersonal: false,
	lossMl: 246,
	replaceMl: 250,
};

describe("pop-up da água depois da corrida", () => {
	it("lê os números da notificação e mostra cada um", () => {
		const notice = toHydroNotice(DATA);
		expect(notice).not.toBeNull();
		if (!notice) return;
		const values = noticeRows(notice).map((r) => r.value);
		expect(values).toContain("882 m em 23:52");
		expect(values).toContain("27 °C");
		expect(values).toContain("72,0 kg");
		expect(values).toContain("246 ml");
	});

	it("esconde o que não existe e ignora aviso antigo sem números", () => {
		const notice = toHydroNotice({ ...DATA, tempC: null, weightKg: null });
		expect(notice && noticeRows(notice).some((r) => r.label === "Temperatura")).toBe(false);
		expect(toHydroNotice({ type: "hydro_run" })).toBeNull();
	});
});
