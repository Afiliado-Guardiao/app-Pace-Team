import React from "react";

import { useTheme } from "@/theme";

import { IIconProps } from "./types";
import { resolveIcon } from "./utils";

const DEFAULT_SIZE = 20;
const DEFAULT_STROKE = 1.75;

// Ícone de linha Lucide (traço 1,75px, pontas arredondadas), como no design system.
export const Icon: React.FC<IIconProps> = ({
	name,
	size = DEFAULT_SIZE,
	strokeWidth = DEFAULT_STROKE,
	color,
	fill,
	style,
}) => {
	const { theme } = useTheme();
	const Glyph = resolveIcon(name);

	if (!Glyph) return null;

	return (
		<Glyph
			size={size}
			strokeWidth={strokeWidth}
			color={color ?? theme.pace.colors.textPrimary}
			fill={fill ?? "none"}
			style={style}
		/>
	);
};

export * from "./types";
