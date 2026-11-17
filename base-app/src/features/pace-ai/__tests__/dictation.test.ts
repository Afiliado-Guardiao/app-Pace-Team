import { addResult, dictationText, EMPTY_DICTATION, IDictation } from "../utils/dictation";

const feed = (steps: [string, boolean][]): IDictation =>
	steps.reduce((d, [t, f]) => addResult(d, t, f), EMPTY_DICTATION);

describe("ditado do PACE AI (a fala não some depois de uma pausa)", () => {
	it("junta o que vem depois da pausa ao que já foi falado", () => {
		const d = feed([
			["Quanto eu", false],
			["Quanto eu corri", false],
			["Quanto eu corri essa semana", true],
			[" e", false],
			[" e qual foi meu pace", false],
		]);
		expect(dictationText(d)).toBe("Quanto eu corri essa semana e qual foi meu pace");
	});

	it("não repete o último trecho quando o iPhone manda o fim de novo", () => {
		const d = feed([
			["Bom dia", true],
			["Bom dia", true],
		]);
		expect(dictationText(d)).toBe("Bom dia");
	});

	it("guarda o trecho mesmo se o iPhone recomeçar sem avisar", () => {
		const d = feed([
			["Quero treinar para a meia maratona", false],
			["em março", false],
		]);
		expect(dictationText(d)).toBe("Quero treinar para a meia maratona em março");
	});

	it("correção normal do iPhone troca a palavra, não duplica", () => {
		const d = feed([
			["Quanto de agua", false],
			["Quanto de água eu bebo", false],
		]);
		expect(dictationText(d)).toBe("Quanto de água eu bebo");
	});
});
