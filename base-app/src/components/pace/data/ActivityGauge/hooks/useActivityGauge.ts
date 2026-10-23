import { useTheme } from "@/theme";

import { useTween } from "../../../hooks";
import { easeOutBack } from "../../../utils";
import { GAUGE_START, GAUGE_SWEEP, TICK_COUNT, TICK_GAP_DEG, TICK_INSET } from "../constants";

interface ITick {
	x1: number;
	y1: number;
	x2: number;
	y2: number;
}

interface IUseActivityGaugeReturn {
	arcPath: string | null;
	ticks: ITick[];
}

const OVERSHOOT = 1.4;
const gaugeEasing = (t: number): number => easeOutBack(t, OVERSHOOT);

// Arco de 240° que enche com mola e marcas (ticks) só na parte ainda vazia.
export const useActivityGauge = (
	ratio: number,
	geometry: { size: number; stroke: number },
): IUseActivityGaugeReturn => {
	const { theme } = useTheme();
	const { motion } = theme.pace;
	const target = Math.max(0, Math.min(1, ratio));
	const tweened = useTween(target, {
		duration: motion.durations.gauge,
		delay: motion.gaugeDelay,
		easing: gaugeEasing,
	});
	const progress = Math.max(0, Math.min(1, tweened));

	const { size, stroke } = geometry;
	const r = (size - stroke) / 2;
	const c = size / 2;
	const point = (deg: number, radius = r): [number, number] => {
		const rad = ((deg - 90) * Math.PI) / 180;
		return [c + radius * Math.cos(rad), c + radius * Math.sin(rad)];
	};
	const end = GAUGE_START + GAUGE_SWEEP * progress;
	const [sx, sy] = point(GAUGE_START);
	const [ex, ey] = point(end);
	const large = end - GAUGE_START > 180 ? 1 : 0;
	const arcPath =
		progress > 0
			? `M${String(sx)} ${String(sy)} A${String(r)} ${String(r)} 0 ${String(large)} 1 ${String(ex)} ${String(ey)}`
			: null;

	const ticks: ITick[] = [];
	for (let i = 0; i <= TICK_COUNT; i++) {
		const deg = GAUGE_START + (GAUGE_SWEEP * i) / TICK_COUNT;
		if (deg <= end + TICK_GAP_DEG) continue;
		const [x1, y1] = point(deg, r - stroke / 2 + TICK_INSET);
		const [x2, y2] = point(deg, r + stroke / 2 - TICK_INSET);
		ticks.push({ x1, y1, x2, y2 });
	}

	return { arcPath, ticks };
};
