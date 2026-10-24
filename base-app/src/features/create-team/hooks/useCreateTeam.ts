import { useMemo, useState } from "react";

import { useRouter } from "expo-router";

import { IFloatingToastData, useFloatingToast } from "@/components/pace";
import { teamErrorMessage, useTeamActions } from "@/lib/data";
import { ME } from "@/lib/pace";
import { useStore } from "@/store";
import { IS_PREVIEW } from "@/constants/preview";
import { ROUTES } from "@/constants/routes";

import { CITY_OPTIONS, CREATE_TEAM_COPY, REGION_OPTIONS } from "../constants";

const MIN_NAME = 2;

// 10 Criar equipe: nome, cidade/região, categoria e prévia do cartão.
export const useCreateTeam = () => {
	const router = useRouter();
	const user = useStore((s) => s.user);
	const { create } = useTeamActions();
	const { toast, showToast } = useFloatingToast();
	// A cidade do cadastro entra primeiro na lista
	const cityOptions = useMemo(
		() => [...new Set([user?.city, ...CITY_OPTIONS].filter((c): c is string => Boolean(c)))],
		[user?.city],
	);
	const [name, setName] = useState("");
	const [city, setCity] = useState<string>(cityOptions[0] ?? CITY_OPTIONS[0]);
	const [region, setRegion] = useState<string>(REGION_OPTIONS[0]);
	const [size, setSize] = useState("5");
	// Sem nome no cadastro o campo começa vazio (o nome do design só na prévia)
	const [captain, setCaptain] = useState(user?.name || (IS_PREVIEW ? ME.name : ""));

	const logoToast: IFloatingToastData = {
		tone: "info",
		icon: "image-plus",
		title: CREATE_TEAM_COPY.logo,
		message: CREATE_TEAM_COPY.logoSoon,
	};

	return {
		toast,
		name,
		setName,
		city,
		setCity,
		cityOptions,
		region,
		setRegion,
		size,
		setSize,
		captain,
		setCaptain,
		slots: Number(size),
		isSubmitting: create.isPending,
		pickLogo: () => {
			showToast(logoToast);
		},
		submit: () => {
			if (name.trim().length < MIN_NAME) {
				showToast({
					tone: "warning",
					title: CREATE_TEAM_COPY.title,
					message: CREATE_TEAM_COPY.nameMissing,
				});
				return;
			}
			create.mutate(
				{ name: name.trim(), city, region, size: Number(size) },
				{
					onSuccess: () => {
						router.replace(ROUTES.INVITE);
					},
					onError: (error) => {
						showToast({
							tone: "danger",
							title: CREATE_TEAM_COPY.title,
							message: teamErrorMessage(error),
						});
					},
				},
			);
		},
		goBack: () => {
			if (router.canGoBack()) router.back();
			else router.navigate(ROUTES.TEAM);
		},
	};
};
