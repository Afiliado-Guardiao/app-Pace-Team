import { useCallback, useMemo, useRef, useState } from "react";

import { usePlacement } from "expo-superwall";

interface IUseSubscriptionGateReturn {
	unlock: () => Promise<boolean>;
	isUnlocking: boolean;
}

/**
 * Gate de feature premium via Superwall.
 *
 * `unlock()` registra o placement (configurado no dashboard do Superwall) e
 * resolve `true` quando o usuário tem acesso — já assinante, holdout/skip, ou
 * após uma compra/restauração bem-sucedida — e `false` quando o paywall é
 * recusado ou ocorre erro.
 *
 * Substitui o antigo gate baseado em `PaywalloClient.requireSubscriptionWithCampaign`.
 */
export const useSubscriptionGate = (placement: string): IUseSubscriptionGateReturn => {
	const [isUnlocking, setIsUnlocking] = useState<boolean>(false);
	const resolveRef = useRef<((granted: boolean) => void) | null>(null);

	const settle = useCallback((granted: boolean): void => {
		setIsUnlocking(false);
		if (resolveRef.current) {
			resolveRef.current(granted);
			resolveRef.current = null;
		}
	}, []);

	const { registerPlacement } = usePlacement({
		onDismiss: (_info, result) => {
			settle(result.type === "purchased" || result.type === "restored");
		},
		onSkip: () => {
			settle(true);
		},
		onError: () => {
			settle(false);
		},
	});

	// registerPlacement muda de identidade a cada render; estabiliza via ref.
	const registerPlacementRef = useRef(registerPlacement);
	registerPlacementRef.current = registerPlacement;

	const unlock = useCallback((): Promise<boolean> => {
		if (resolveRef.current) return Promise.resolve(false);

		setIsUnlocking(true);

		return new Promise<boolean>((resolve) => {
			resolveRef.current = resolve;
			void registerPlacementRef
				.current({
					placement,
					feature: () => {
						settle(true);
					},
				})
				.catch(() => {
					settle(false);
				});
		});
	}, [placement, settle]);

	return useMemo(() => ({ unlock, isUnlocking }), [unlock, isUnlocking]);
};
