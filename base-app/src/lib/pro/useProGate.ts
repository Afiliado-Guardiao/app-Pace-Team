import { useMyPro } from "@/lib/data";
import { IS_PREVIEW } from "@/constants/preview";

import { IProOfferSource } from "./constants";
import { useProOfferStore } from "./offerStore";

interface IUseProGateReturn {
	// Pode usar o recurso (Team Pro, ou a prévia web)
	isPro: boolean;
	isLoading: boolean;
	// Tentou usar sem o Pro: abre a janela com os planos
	ask: () => void;
	// Saindo do recurso: sem o Pro, lembra do plano (no máximo 1 vez por dia)
	leave: () => void;
}

// Recurso Pro em modo vitrine: quem não tem o Pro vê tudo, mas ao usar
// aparece a janela do Team Pro.
export const useProGate = (source: IProOfferSource): IUseProGateReturn => {
	const { isPro, isLoading } = useMyPro();
	const show = useProOfferStore((s) => s.show);
	const showOnExit = useProOfferStore((s) => s.showOnExit);
	const allowed = IS_PREVIEW || isPro;
	return {
		isPro: allowed,
		isLoading: !IS_PREVIEW && isLoading,
		ask: () => {
			show(source);
		},
		leave: () => {
			if (!allowed && !isLoading) showOnExit(source);
		},
	};
};
