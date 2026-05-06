import { useStore } from "@/store";

import { IUseProfileScreenReturn } from "../types";

import { useProfileActions } from "./useProfileActions";

export const useProfileScreen = (): IUseProfileScreenReturn => {
	const user = useStore((state) => state.user);
	const actions = useProfileActions();

	return {
		user,
		...actions,
	};
};
