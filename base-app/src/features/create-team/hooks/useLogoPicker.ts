import { useCallback, useEffect, useState } from "react";

import { Asset } from "expo-asset";

import { IGalleryResult, pickFromCamera, pickFromGallery } from "@/lib/media";

import { ITeamEmblemId, TEAM_EMBLEMS } from "../constants/emblems";

interface IUseLogoPickerReturn {
	uri: string | null;
	emblem: ITeamEmblemId | null;
	pickCamera: () => void;
	pickGallery: () => void;
	pickEmblem: (id: ITeamEmblemId) => void;
}

// Logo da equipe: um dos emblemas prontos (Raposa já vem escolhida numa
// equipe nova), foto da câmera ou da galeria. O emblema vira um arquivo local
// e sobe igual a uma foto (uploadTeamLogo), sem mudar o banco.
export const useLogoPicker = (onDenied: () => void, isNew: boolean): IUseLogoPickerReturn => {
	const [uri, setUri] = useState<string | null>(null);
	const [emblem, setEmblem] = useState<ITeamEmblemId | null>(null);

	const pickEmblem = useCallback((id: ITeamEmblemId) => {
		const item = TEAM_EMBLEMS.find((e) => e.id === id);
		if (!item) return;
		setEmblem(id);
		// No app, a imagem empacotada é um id numérico (require)
		void Asset.fromModule(item.source as number)
			.downloadAsync()
			.then((asset) => {
				setUri(asset.localUri ?? asset.uri);
			});
	}, []);

	useEffect(() => {
		if (isNew) pickEmblem("raposa");
	}, [isNew, pickEmblem]);

	const take = (result: IGalleryResult) => {
		if (result.status === "picked") {
			setUri(result.uri);
			setEmblem(null);
		}
		if (result.status === "denied") onDenied();
	};

	return {
		uri,
		emblem,
		pickCamera: () => {
			void pickFromCamera().then(take);
		},
		pickGallery: () => {
			void pickFromGallery({ isSquare: true }).then(take);
		},
		pickEmblem,
	};
};
