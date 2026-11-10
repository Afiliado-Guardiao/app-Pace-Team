import { useState } from "react";

import { Asset } from "expo-asset";

import { pickFromGallery } from "@/lib/media";

import { ITeamEmblemId, TEAM_EMBLEMS } from "../constants/emblems";

interface IUseLogoPickerReturn {
	uri: string | null;
	emblem: ITeamEmblemId | null;
	isOpen: boolean;
	open: () => void;
	close: () => void;
	pickGallery: () => void;
	pickEmblem: (id: ITeamEmblemId) => void;
}

// Logo da equipe: foto da galeria ou um dos emblemas prontos. O emblema vira
// um arquivo local e sobe igual a uma foto (uploadTeamLogo), sem mudar o banco.
export const useLogoPicker = (onDenied: () => void): IUseLogoPickerReturn => {
	const [uri, setUri] = useState<string | null>(null);
	const [emblem, setEmblem] = useState<ITeamEmblemId | null>(null);
	const [isOpen, setIsOpen] = useState(false);

	return {
		uri,
		emblem,
		isOpen,
		open: () => {
			setIsOpen(true);
		},
		close: () => {
			setIsOpen(false);
		},
		pickGallery: () => {
			setIsOpen(false);
			void pickFromGallery({ isSquare: true }).then((result) => {
				if (result.status === "picked") {
					setUri(result.uri);
					setEmblem(null);
				}
				if (result.status === "denied") onDenied();
			});
		},
		pickEmblem: (id) => {
			const item = TEAM_EMBLEMS.find((e) => e.id === id);
			if (!item) return;
			setIsOpen(false);
			setEmblem(id);
			// No app, a imagem empacotada é um id numérico (require)
			void Asset.fromModule(item.source as number)
				.downloadAsync()
				.then((asset) => {
					setUri(asset.localUri ?? asset.uri);
				});
		},
	};
};
