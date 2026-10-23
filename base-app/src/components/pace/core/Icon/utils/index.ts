import type { LucideIcon } from "lucide-react-native";
import * as icons from "lucide-react-native/icons";

const ICONS = icons as Record<string, LucideIcon | undefined>;

const toPascal = (name: string): string =>
	name
		.split(/[-_ ]/)
		.map((part) => part.charAt(0).toUpperCase() + part.slice(1))
		.join("");

// Resolve "map-pin" → MapPin. Nome desconhecido volta null (não quebra a tela).
export const resolveIcon = (name: string): LucideIcon | null =>
	ICONS[toPascal(name)] ?? ICONS[name] ?? null;
