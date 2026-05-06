export const MIN_HEIGHT = 140;
export const MAX_HEIGHT = 220;

export const MIN_WEIGHT = 40;
export const MAX_WEIGHT = 160;

export const BODY_METRICS_DEFAULTS = {
	height: 170,
	weight: 70,
};

export const getHeightRange = (): string[] => {
	return Array.from({ length: MAX_HEIGHT - MIN_HEIGHT + 1 }, (_, i) => (MIN_HEIGHT + i).toString());
};

export const getWeightRange = (): string[] => {
	return Array.from({ length: MAX_WEIGHT - MIN_WEIGHT + 1 }, (_, i) => (MIN_WEIGHT + i).toString());
};
