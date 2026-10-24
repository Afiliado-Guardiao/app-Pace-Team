import { useQuery } from "@tanstack/react-query";

import { getPlans } from "./client";
import { IPlan } from "./types";

interface IUsePlansReturn {
	plans: IPlan[];
	isLoading: boolean;
	isError: boolean;
	retry: () => void;
}

// Planos mensal e anual com o preço que a Apple mostra para a conta do atleta.
export const usePlans = (): IUsePlansReturn => {
	const query = useQuery({ queryKey: ["pace", "plans"], queryFn: getPlans, staleTime: 5 * 60_000 });
	return {
		plans: query.data ?? [],
		isLoading: query.isLoading,
		isError: query.isError,
		retry: () => {
			void query.refetch();
		},
	};
};
