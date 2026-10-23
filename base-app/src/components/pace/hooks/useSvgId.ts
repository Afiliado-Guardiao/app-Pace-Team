import { useId } from "react";

// Id único e válido para referências url(#id) dentro do SVG.
export const useSvgId = (prefix: string): string => {
	const id = useId();
	return `${prefix}-${id.replace(/[^a-zA-Z0-9_-]/g, "")}`;
};
