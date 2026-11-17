import fs from "fs";
import path from "path";

// No iPhone o Reanimated só aceita curvas prontas em texto (linear, ease,
// ease-in…). "cubic-bezier(…)" ou "steps(…)" em texto funciona na prévia web
// mas derruba o app no aparelho (foi o erro do "Começar" no onboarding):
// use cubicBezier()/steps() do react-native-reanimated.
const SRC = path.join(__dirname, "..", "..", "..");
const BAD = /["'`](cubic-bezier|steps)\(/;

const files = (dir: string): string[] =>
	fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
		const full = path.join(dir, e.name);
		if (e.isDirectory()) return e.name === "__tests__" ? [] : files(full);
		return /\.tsx?$/.test(e.name) ? [full] : [];
	});

describe("curvas de animação", () => {
	it("nenhuma curva em texto que o iPhone não aceita", () => {
		const bad = files(SRC).filter((f) => BAD.test(fs.readFileSync(f, "utf8")));
		expect(bad.map((f) => path.relative(SRC, f))).toEqual([]);
	});
});
