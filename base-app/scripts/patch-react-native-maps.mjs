// react-native-maps 1.20.1 na arquitetura nova do React Native: um item que
// entra ou sai no meio da lista do mapa pode chegar numa posição que não
// existe mais e derrubar o app (NSRangeException em insertReactSubview). Aqui
// a posição fica presa ao tamanho da lista. Roda sozinho no "npm install".
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const FILE = path.join(HERE, "../node_modules/react-native-maps/ios/AirMaps/AIRMap.m");
const BEFORE = "[_reactSubviews insertObject:(UIView *)subview atIndex:(NSUInteger) atIndex];";
const AFTER =
	"[_reactSubviews insertObject:(UIView *)subview atIndex:MIN((NSUInteger)MAX(atIndex, 0), _reactSubviews.count)];";

if (fs.existsSync(FILE)) {
	const source = fs.readFileSync(FILE, "utf8");
	if (!source.includes(AFTER)) {
		if (!source.includes(BEFORE)) {
			throw new Error("patch-react-native-maps: AIRMap.m mudou; confira a correção");
		}
		fs.writeFileSync(FILE, source.replace(BEFORE, AFTER));
	}
}
