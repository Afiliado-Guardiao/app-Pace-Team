import { useCallback, useState } from "react";

import { PaywalloClient } from "@virex-tech/paywallo-sdk";

interface IUseSubscriptionGateReturn {
	unlock: () => Promise<boolean>;
	isUnlocking: boolean;
}

export const useSubscriptionGate = (placement: string): IUseSubscriptionGateReturn => {
	const [isUnlocking, setIsUnlocking] = useState<boolean>(false);

	const unlock = useCallback(async (): Promise<boolean> => {
		setIsUnlocking(true);
		try {
			return await PaywalloClient.requireSubscriptionWithCampaign(placement);
		} finally {
			setIsUnlocking(false);
		}
	}, [placement]);

	return { unlock, isUnlocking };
};
