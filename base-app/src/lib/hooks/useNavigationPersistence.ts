import { useEffect } from "react";

import { useSegments } from "expo-router";

import { useStore } from "@/store";

export const useNavigationPersistence = (): void => {
	const segments = useSegments();
	const currentRoute = segments[0] ? `/${segments.join("/")}` : "/";

	const setLastRoute = useStore((state) => state.setLastRoute);
	const lastRoute = useStore((state) => state.lastRoute);

	useEffect(() => {
		if (currentRoute === "/") return;
		if (currentRoute === lastRoute) return;
		if (currentRoute === "/(non-auth)/auth") return;

		setLastRoute(currentRoute);
	}, [currentRoute, setLastRoute, lastRoute]);
};
