import { IPaceButtonSize } from "../types";

export const BUTTON_SIZES: Record<
	IPaceButtonSize,
	{ height: number; paddingX: number; fontSize: "sm" | "body" | "md"; icon: number }
> = {
	sm: { height: 36, paddingX: 14, fontSize: "sm", icon: 16 },
	md: { height: 48, paddingX: 20, fontSize: "body", icon: 18 },
	lg: { height: 56, paddingX: 26, fontSize: "md", icon: 20 },
};

export const DISABLED_OPACITY = 0.4;
export const ICON_STROKE = 2;
