import { splitStopColor } from "../utils";

// O alfa precisa ir em stopOpacity: o react-native-svg nativo ignora o alfa da cor.
describe("splitStopColor", () => {
	it("separa rgba em cor rgb e opacidade", () => {
		expect(splitStopColor("rgba(14,21,28,.55)")).toEqual({
			stopColor: "rgb(14,21,28)",
			stopOpacity: 0.55,
		});
		expect(splitStopColor("rgba(255, 255, 255, 0)")).toEqual({
			stopColor: "rgb(255,255,255)",
			stopOpacity: 0,
		});
	});

	it("separa hex de 8 dígitos", () => {
		expect(splitStopColor("#FF660080")).toEqual({
			stopColor: "#FF6600",
			stopOpacity: 128 / 255,
		});
	});

	it("mantém cores sólidas com opacidade 1", () => {
		expect(splitStopColor("#FF6A00")).toEqual({ stopColor: "#FF6A00", stopOpacity: 1 });
	});
});
