import { useProOfferStore } from "../offerStore";

describe("janela do Team Pro", () => {
	beforeEach(() => {
		useProOfferStore.setState({ source: null, exitShownOn: null });
	});

	it("tentar usar um recurso abre a janela com o recurso certo", () => {
		useProOfferStore.getState().show("studio");
		expect(useProOfferStore.getState().source).toBe("studio");
		useProOfferStore.getState().close();
		expect(useProOfferStore.getState().source).toBeNull();
	});

	it("ao sair, lembra do plano no máximo uma vez por dia", () => {
		useProOfferStore.getState().showOnExit("ai");
		expect(useProOfferStore.getState().source).toBe("ai");
		useProOfferStore.getState().close();
		useProOfferStore.getState().showOnExit("hydration");
		expect(useProOfferStore.getState().source).toBeNull();
	});

	it("no dia seguinte volta a lembrar", () => {
		useProOfferStore.setState({ exitShownOn: "2000-01-01" });
		useProOfferStore.getState().showOnExit("analytics");
		expect(useProOfferStore.getState().source).toBe("analytics");
	});
});
