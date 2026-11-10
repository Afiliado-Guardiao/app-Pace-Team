import * as ImagePicker from "expo-image-picker";

import { IGalleryResult } from "./gallery";

const QUALITY = 0.85;

// Abre a câmera (quadrado) para tirar a foto do escudo da equipe. A permissão
// só é pedida aqui, quando o atleta toca em "Foto".
export async function pickFromCamera(): Promise<IGalleryResult> {
	try {
		const permission = await ImagePicker.requestCameraPermissionsAsync();
		if (!permission.granted) return { status: "denied" };
		const result = await ImagePicker.launchCameraAsync({
			mediaTypes: ["images"],
			allowsEditing: true,
			aspect: [1, 1],
			quality: QUALITY,
		});
		const asset = result.canceled ? undefined : result.assets[0];
		return asset ? { status: "picked", uri: asset.uri } : { status: "cancelled" };
	} catch {
		return { status: "denied" };
	}
}
