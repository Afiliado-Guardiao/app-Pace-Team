import { useEffect, useRef } from "react";

import { PaywalloClient } from "@virex-tech/paywallo-sdk";

import { useStore } from "@/store";

export const usePaywalloAuthSync = (): void => {
	const user = useStore((state) => state.user);
	const previousUserIdRef = useRef<string | null>(null);

	useEffect(() => {
		const previousUserId = previousUserIdRef.current;
		const currentUserId = user?.id ?? null;

		if (previousUserId === currentUserId) return;

		if (currentUserId && user?.email) {
			void PaywalloClient.identify({
				email: user.email,
				properties: {
					name: user.name,
					signup_at: user.createdAt,
					referral_code: user.referralCode,
				},
			});
		} else if (previousUserId && !currentUserId) {
			void PaywalloClient.reset();
		}

		previousUserIdRef.current = currentUserId;
	}, [user]);
};
