import { useEffect, useMemo, useRef, useState } from "react";

import * as Localization from "expo-localization";
import { useLocalSearchParams, useRouter } from "expo-router";

import { useFloatingToast } from "@/components/pace";
import { teamErrorMessage, useMyTeam, useTeamActions } from "@/lib/data";
import { pickFromGallery } from "@/lib/media";
import { COUNTRIES, countryOf, ME, placeOptions } from "@/lib/pace";
import { uploadTeamLogo } from "@/lib/supabase";
import { useStore } from "@/store";
import { IS_PREVIEW } from "@/constants/preview";
import { ROUTES } from "@/constants/routes";

import { CREATE_TEAM_COPY } from "../constants";

import { usePlaceField } from "./usePlaceField";

const MIN_NAME = 2;

// País do aparelho (ex.: atleta morando em Portugal), se estiver na lista
const deviceCountry = (): string => {
	const code = Localization.getLocales().at(0)?.regionCode ?? "BR";
	return COUNTRIES.some((c) => c.code === code) ? code : "BR";
};

// 10 Criar equipe (e Editar equipe, com ?edit=1): escudo, nome, país,
// cidade/região (com "Outra" para digitar), categoria e prévia do cartão.
export const useCreateTeam = () => {
	const router = useRouter();
	const params = useLocalSearchParams<{ edit?: string }>();
	const user = useStore((s) => s.user);
	const { team } = useMyTeam();
	const isEdit = params.edit === "1" && Boolean(team);
	const { create, update } = useTeamActions();
	const { toast, showToast } = useFloatingToast();
	const [country, setCountryCode] = useState(deviceCountry);
	const place = countryOf(country);
	// A cidade do cadastro entra primeiro na lista (no Brasil)
	const cityOptions = useMemo(
		() => placeOptions(place.cities, country === "BR" ? user?.city : null),
		[place.cities, country, user?.city],
	);
	const regionOptions = useMemo(() => placeOptions(place.regions), [place.regions]);
	const city = usePlaceField(cityOptions[0] ?? "");
	const region = usePlaceField(regionOptions[0] ?? "");
	const [name, setName] = useState("");
	const [size, setSize] = useState("5");
	// Sem nome no cadastro o campo começa vazio (o nome do design só na prévia)
	const [captain, setCaptain] = useState(user?.name || (IS_PREVIEW ? ME.name : ""));
	const [logoUri, setLogoUri] = useState<string | null>(null);
	const hasFilled = useRef(false);

	// Editar: começa com os dados atuais da equipe
	useEffect(() => {
		if (!isEdit || !team || hasFilled.current) return;
		hasFilled.current = true;
		const saved = countryOf(team.country);
		setCountryCode(team.country);
		setName(team.name);
		setSize(String(team.size));
		city.fill(team.city, placeOptions(saved.cities, team.city));
		region.fill(team.region, placeOptions(saved.regions));
	}, [isEdit, team, city, region]);

	const warn = (message: string): void => {
		showToast({ tone: "warning", title: CREATE_TEAM_COPY.title, message });
	};
	const fail = (error: unknown): void => {
		showToast({ tone: "danger", title: CREATE_TEAM_COPY.title, message: teamErrorMessage(error) });
	};
	// O escudo vai depois que a equipe existe; se falhar, fica com as iniciais
	const finish = (teamId: string | undefined, next: () => void): void => {
		const upload =
			teamId && logoUri && !IS_PREVIEW ? uploadTeamLogo(teamId, logoUri) : Promise.resolve();
		void upload.catch(() => undefined).finally(next);
	};

	const submit = (): void => {
		if (name.trim().length < MIN_NAME) {
			warn(CREATE_TEAM_COPY.nameMissing);
			return;
		}
		if (!city.value) {
			warn(CREATE_TEAM_COPY.cityMissing);
			return;
		}
		const form = { name: name.trim(), city: city.value, region: region.value, size: Number(size), country };
		if (isEdit) {
			update.mutate(form, {
				onSuccess: (id) => {
					finish(id ?? team?.id, () => {
						router.back();
					});
				},
				onError: fail,
			});
			return;
		}
		create.mutate(form, {
			onSuccess: (id) => {
				finish(id, () => {
					router.replace(ROUTES.INVITE);
				});
			},
			onError: fail,
		});
	};

	return {
		toast,
		isEdit,
		name,
		setName,
		country,
		countryOptions: COUNTRIES.map((c) => ({ value: c.code, label: c.name })),
		setCountry: (code: string) => {
			const next = countryOf(code);
			setCountryCode(code);
			city.setChoice(placeOptions(next.cities).at(0) ?? "");
			region.setChoice(placeOptions(next.regions).at(0) ?? "");
		},
		city,
		cityOptions,
		region,
		regionOptions,
		size,
		setSize,
		captain,
		setCaptain,
		slots: Number(size),
		isSubmitting: create.isPending || update.isPending,
		logoUri: logoUri ?? (isEdit ? (team?.logoUrl ?? null) : null),
		pickLogo: () => {
			void pickFromGallery({ isSquare: true }).then((result) => {
				if (result.status === "picked") setLogoUri(result.uri);
				if (result.status === "denied") warn(CREATE_TEAM_COPY.logoDenied);
			});
		},
		submit,
		goBack: () => {
			if (router.canGoBack()) router.back();
			else router.navigate(ROUTES.TEAM);
		},
	};
};
