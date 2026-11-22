import { formatMl } from "@/lib/hydration/day";
import { IHydroNotice } from "@/lib/hydration/notice";
import { formatDistance, formatDuration, formatKm, formatPace } from "@/lib/pace";

export interface INoticeRow {
	icon: string;
	label: string;
	value: string;
}

const liters = (lph: number): string => `${lph.toFixed(1).replace(".", ",")} L por hora`;

const whenOf = (startedAt: string): string => {
	const d = new Date(startedAt);
	if (!Number.isFinite(d.getTime())) return "";
	const hour = `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
	return ` às ${hour}`;
};

// Cada dado que entrou na conta, na ordem em que ela é feita
export const noticeRows = (n: IHydroNotice): INoticeRow[] => {
	const rows: (INoticeRow | null)[] = [
		{
			icon: "footprints",
			label: `Você correu${whenOf(n.startedAt)}`,
			value: `${formatDistance(n.km)} em ${formatDuration(n.seconds)}`,
		},
		n.km > 0 ? { icon: "gauge", label: "Pace", value: `${formatPace(n.seconds / n.km)}/km` } : null,
		n.tempC === null
			? null
			: {
					icon: "thermometer",
					label: "Temperatura",
					value: `${String(Math.round(n.tempC))} °C`,
				},
		n.weightKg === null
			? null
			: { icon: "user", label: "Seu peso", value: `${formatKm(n.weightKg, 1)} kg` },
		{
			icon: "droplets",
			label: n.isPersonal ? "Seu suor (pela sua pesagem)" : "Suor estimado",
			value: liters(n.rateLph),
		},
		{ icon: "droplet", label: "Você perdeu cerca de", value: formatMl(n.lossMl) },
	];
	return rows.filter((r): r is INoticeRow => r !== null);
};
