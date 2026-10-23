import { ITabItem } from "../types";

// As 5 abas do app, de cima para baixo no trilho lateral
export const PACE_TABS: readonly ITabItem[] = [
	{ id: "home", icon: "house", label: "Início" },
	{ id: "run", icon: "footprints", label: "Corrida" },
	{ id: "ranking", icon: "trophy", label: "Ranking" },
	{ id: "team", icon: "users", label: "Equipe" },
	{ id: "profile", icon: "user-round", label: "Perfil" },
];

export const DEFAULT_TAB_SIZE = 54;
export const ICON_RATIO = 0.4;
export const ACTIVE_STROKE = 2;
export const IDLE_STROKE = 1.75;
export const TAB_GAP = 10;
export const LABEL_GAP = 3;

// Trilho lateral
export const RAIL_GAP = 6;
export const RAIL_PADDING = 6;
export const RAIL_ICON_RATIO = 0.44;
export const RAIL_ACTIVE_STROKE = 2.1;
export const RAIL_LABEL_HEIGHT = 30;
export const RAIL_LABEL_OFFSET = 10;
export const RAIL_LABEL_PADDING_X = 13;
// Movimento mínimo para virar arrasto (px)
export const RAIL_DRAG_THRESHOLD = 4;
