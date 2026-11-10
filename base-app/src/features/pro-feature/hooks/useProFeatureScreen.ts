import { useLocalSearchParams, useRouter } from "expo-router";

import { useMyPro } from "@/lib/data";
import { ROUTES } from "@/constants/routes";

import { IProFeatureInfo, IProFeatureKey, PRO_FEATURES } from "../constants";

interface IUseProFeatureScreenReturn {
	feature: IProFeatureInfo;
	isPro: boolean;
	goBack: () => void;
	openPro: () => void;
}

const isKey = (value: unknown): value is IProFeatureKey =>
	value === "ai" || value === "studio" || value === "analytics";

// Apresentação de um recurso Pro: explica o que faz e leva ao Team Pro
export const useProFeatureScreen = (): IUseProFeatureScreenReturn => {
	const router = useRouter();
	const { id } = useLocalSearchParams<{ id?: string }>();
	const { isPro } = useMyPro();
	const key: IProFeatureKey = isKey(id) ? id : "ai";

	return {
		feature: PRO_FEATURES[key],
		isPro,
		goBack: () => {
			if (router.canGoBack()) router.back();
			else router.replace(ROUTES.HOME);
		},
		openPro: () => {
			router.push(ROUTES.PRO);
		},
	};
};
