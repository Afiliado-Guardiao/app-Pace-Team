import { usePlans } from "@/lib/purchases";

// Preço do plano mensal como a Apple mostra para a conta do atleta. Sem o
// preço da Apple (sem internet, prévia web), não mostra preço nenhum: a Apple
// recusa preço escrito à mão que pode não bater com o da loja.
export const useProPrice = (): string | null => {
	const { plans } = usePlans();
	return plans.find((plan) => plan.period === "monthly")?.price ?? null;
};
