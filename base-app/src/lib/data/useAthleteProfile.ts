import { useQuery } from "@tanstack/react-query";

import { avatarUrlOf, getAthleteProfile, IAthleteProfile } from "@/lib/supabase";
import { IS_PREVIEW } from "@/constants/preview";

import { DATA_KEYS } from "./keys";

export interface IAthleteView extends Omit<IAthleteProfile, "avatarPath"> {
	avatarUrl: string | null;
}

interface IUseAthleteProfileReturn {
	athlete: IAthleteView | null;
	isLoading: boolean;
}

// Perfil de um atleta (tocar no nome ou na foto no feed e na equipe)
export const useAthleteProfile = (id: string | undefined): IUseAthleteProfileReturn => {
	const query = useQuery({
		queryKey: DATA_KEYS.athlete(id ?? ""),
		queryFn: () => getAthleteProfile(id ?? ""),
		enabled: Boolean(id) && !IS_PREVIEW,
	});
	const data = query.data ?? null;
	return {
		athlete: data
			? { ...data, avatarUrl: data.avatarPath ? avatarUrlOf(data.avatarPath) : null }
			: null,
		isLoading: query.isLoading,
	};
};
