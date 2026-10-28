import { useLocalSearchParams, useRouter } from "expo-router";

import { IAthleteView, useAthleteProfile } from "@/lib/data";
import { formatKm } from "@/lib/pace";
import { ROUTES } from "@/constants/routes";

interface IUseAthleteScreenReturn {
	athlete: IAthleteView | null;
	isLoading: boolean;
	// "@ley · São Paulo, SP"
	sub: string;
	stats: { runs: string; totalKm: string; weekKm: string; weekPoints: string } | null;
	goBack: () => void;
	openTeam: () => void;
}

// Perfil de um atleta: foto, de onde é, equipe e posição, e os números
export const useAthleteScreen = (): IUseAthleteScreenReturn => {
	const router = useRouter();
	const params = useLocalSearchParams<{ id?: string }>();
	const { athlete, isLoading } = useAthleteProfile(params.id);
	const place = [athlete?.city, athlete?.state].filter(Boolean).join(", ");
	const handle = athlete?.handle ? `@${athlete.handle}` : "";
	const stats = athlete?.stats ?? null;

	return {
		athlete,
		isLoading,
		sub: [handle, place].filter(Boolean).join(" · "),
		stats: stats
			? {
					runs: String(stats.runs),
					totalKm: formatKm(stats.totalKm, 1),
					weekKm: formatKm(stats.weekKm, 1),
					weekPoints: String(stats.weekPoints),
				}
			: null,
		goBack: () => {
			if (router.canGoBack()) router.back();
			else router.navigate(ROUTES.HOME);
		},
		openTeam: () => {
			const id = athlete?.team?.id;
			if (id) router.push({ pathname: ROUTES.TEAM_DETAILS, params: { id } });
		},
	};
};
