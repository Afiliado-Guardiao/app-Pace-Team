import * as ImagePicker from "expo-image-picker";

export type IGalleryResult =
	| { status: "picked"; uri: string }
	| { status: "cancelled" }
	| { status: "denied" };

interface IPickOptions {
	// Corte quadrado (foto de perfil) ou livre (foto da corrida)
	isSquare?: boolean;
}

const QUALITY = 0.85;

// Abre a galeria do iPhone e devolve a foto escolhida (arquivo local).
export async function pickFromGallery(options: IPickOptions = {}): Promise<IGalleryResult> {
	const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
	if (!permission.granted) return { status: "denied" };

	const result = await ImagePicker.launchImageLibraryAsync({
		mediaTypes: ["images"],
		allowsEditing: options.isSquare === true,
		aspect: options.isSquare ? [1, 1] : undefined,
		quality: QUALITY,
	});
	const asset = result.canceled ? undefined : result.assets[0];
	return asset ? { status: "picked", uri: asset.uri } : { status: "cancelled" };
}
