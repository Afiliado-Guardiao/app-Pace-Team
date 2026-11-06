import { useCallback, useRef, useState } from "react";
import { Image, Platform, View } from "react-native";

import { useRouter } from "expo-router";
import * as Sharing from "expo-sharing";

import { captureRef } from "react-native-view-shot";

import { useFloatingToast } from "@/components/pace";
import { ROUTES } from "@/constants/routes";

import { SHARE_BGS, SHARE_COPY, SHARE_TEMPLATES, STORY } from "../constants";

import { useStoryRun } from "./useStoryRun";

type IPanel = "templates" | "background";

const PREFETCH_TIMEOUT_MS = 3000;

// Foto da equipe e de quem correu: carregadas antes de gerar a imagem (sem
// isso, uma foto que ainda vinha da internet saía em branco no PNG)
const prefetchPhotos = async (uris: string[]): Promise<void> => {
	const loads = Promise.all(uris.map((uri) => Image.prefetch(uri).catch(() => false)));
	const timeout = new Promise((resolve) => setTimeout(resolve, PREFETCH_TIMEOUT_MS));
	await Promise.race([loads, timeout]);
};

const remoteUri = (source: unknown): string | null =>
	source && typeof source === "object" && "uri" in source && typeof source.uri === "string"
		? source.uri
		: null;

// Compartilhar: escolhe modelo e fundo e gera o PNG 1080 × 1920 do story.
export const useRunShare = () => {
	const router = useRouter();
	const { run, isDemo } = useStoryRun();
	const canvasRef = useRef<View>(null);
	const { toast, showToast } = useFloatingToast();
	const [templateIndex, setTemplateIndex] = useState(0);
	const [backgroundIndex, setBackgroundIndex] = useState(0);
	const [panel, setPanel] = useState<IPanel>("templates");
	const [isSharing, setIsSharing] = useState(false);
	const template = SHARE_TEMPLATES[templateIndex] ?? SHARE_TEMPLATES[0];
	const background = SHARE_BGS[backgroundIndex] ?? SHARE_BGS[0];

	const share = useCallback(async () => {
		const canShare = Platform.OS !== "web" && (await Sharing.isAvailableAsync());
		if (!canShare || !canvasRef.current) {
			showToast({ tone: "info", icon: "info", title: SHARE_COPY.toastUnavailable });
			return;
		}
		setIsSharing(true);
		try {
			const photos = [run.team?.logoUrl ?? null, ...run.crew.map((p) => remoteUri(p.image))];
			await prefetchPhotos(photos.filter((u): u is string => Boolean(u)));
			const uri = await captureRef(canvasRef, {
				format: "png",
				width: STORY.width,
				height: STORY.height,
			});
			await Sharing.shareAsync(uri, {
				mimeType: "image/png",
				UTI: "public.png",
				dialogTitle: "PACE TEAM",
			});
			showToast({ tone: "success", icon: "check-circle-2", title: SHARE_COPY.toastShared });
		} catch {
			showToast({ tone: "danger", icon: "alert-circle", title: SHARE_COPY.toastError });
		} finally {
			setIsSharing(false);
		}
	}, [showToast, run]);

	return {
		run,
		isDemo,
		canvasRef,
		toast,
		template,
		templateIndex,
		background,
		backgroundIndex,
		panel,
		isSharing,
		isTransparent: background.id === "none",
		setTemplateIndex,
		setBackgroundIndex,
		showTemplates: () => {
			setPanel("templates");
		},
		showBackgrounds: () => {
			setPanel("background");
		},
		share: () => {
			void share();
		},
		goBack: () => {
			if (router.canGoBack()) router.back();
			else router.replace(ROUTES.RUN_SUMMARY);
		},
	};
};

export type IUseRunShareReturn = ReturnType<typeof useRunShare>;
