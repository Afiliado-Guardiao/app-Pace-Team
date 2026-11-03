import type { LucideIcon } from "lucide-react-native";
import * as icons from "lucide-react-native/icons";

const ICONS = icons as Record<string, LucideIcon | undefined>;

const toPascal = (name: string): string =>
	name
		.split(/[-_ ]/)
		.map((part) => part.charAt(0).toUpperCase() + part.slice(1))
		.join("");

// Nomes antigos do Lucide (ainda usados no design) → nome atual. Sem isso o
// ícone some e o botão fica invisível (ex.: o "···" dos posts).
const RENAMED: Record<string, string> = {
	"more-horizontal": "ellipsis",
	"more-vertical": "ellipsis-vertical",
	"trash-2": "trash",
	"alert-circle": "circle-alert",
	"check-circle-2": "circle-check",
	"check-circle": "circle-check",
	"x-circle": "circle-x",
	home: "house",
};

// Resolve "map-pin" → MapPin. Nome desconhecido volta null (não quebra a tela).
export const resolveIcon = (name: string): LucideIcon | null => {
	const current = RENAMED[name] ?? name;
	return ICONS[toPascal(current)] ?? ICONS[current] ?? null;
};
