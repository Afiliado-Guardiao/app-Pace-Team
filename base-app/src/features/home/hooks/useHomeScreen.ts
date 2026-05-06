import { useMemo } from "react";

import { useStore } from "@/store";

type ITimeOfDay = "morning" | "afternoon" | "evening";

interface IUseHomeScreenReturn {
	userName: string | null;
	userEmail: string | null;
	userBirthday: string | null;
	memberSince: string | null;
	timeOfDay: ITimeOfDay;
}

const getTimeOfDay = (hour: number): ITimeOfDay => {
	if (hour >= 5 && hour < 12) return "morning";
	if (hour >= 12 && hour < 18) return "afternoon";
	return "evening";
};

const formatBirthday = (iso: string | null | undefined, locale: string): string | null => {
	if (!iso) return null;
	const [year, month, day] = iso.split("-").map(Number);
	if (!year || !month || !day) return null;
	const date = new Date(year, month - 1, day);
	return date.toLocaleDateString(locale, { day: "2-digit", month: "long", year: "numeric" });
};

const formatMemberSince = (iso: string | null | undefined, locale: string): string | null => {
	if (!iso) return null;
	const date = new Date(iso);
	if (Number.isNaN(date.getTime())) return null;
	return date.toLocaleDateString(locale, { month: "long", year: "numeric" });
};

export const useHomeScreen = (locale = "pt-BR"): IUseHomeScreenReturn => {
	const user = useStore((state) => state.user);

	const timeOfDay = useMemo(() => getTimeOfDay(new Date().getHours()), []);
	const userBirthday = useMemo(
		() => formatBirthday(user?.birthday, locale),
		[user?.birthday, locale],
	);
	const memberSince = useMemo(
		() => formatMemberSince(user?.createdAt, locale),
		[user?.createdAt, locale],
	);

	return {
		userName: user?.name ?? null,
		userEmail: user?.email ?? null,
		userBirthday,
		memberSince,
		timeOfDay,
	};
};
