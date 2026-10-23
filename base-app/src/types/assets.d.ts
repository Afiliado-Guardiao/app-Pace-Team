// Imagens locais importadas com `import x from "...png"` (Metro devolve o id do asset).
declare module "*.png" {
	import { ImageSourcePropType } from "react-native";

	const source: ImageSourcePropType;
	export default source;
}

declare module "*.jpg" {
	import { ImageSourcePropType } from "react-native";

	const source: ImageSourcePropType;
	export default source;
}

declare module "*.mp4" {
	const source: number;
	export default source;
}
