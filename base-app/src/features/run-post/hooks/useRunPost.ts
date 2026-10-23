import { useCallback, useEffect, useRef, useState } from "react";
import { ImageSourcePropType, Platform } from "react-native";

import { CameraType, CameraView, useCameraPermissions } from "expo-camera";
import { useRouter } from "expo-router";

import { IPostArtLayers } from "@/components/shared/PostArt";
import { usePostActions } from "@/lib/data";
import { useRunStore } from "@/lib/run";
import { useStore } from "@/store";
import { IS_PREVIEW } from "@/constants/preview";
import { ROUTES } from "@/constants/routes";

import { POST_COPY, POST_FALLBACK, POST_MIN_KM, POST_PHOTOS } from "../constants";

import { useShutterFlash } from "./useShutterFlash";

type IStep = "camera" | "edit";
// Foto escolhida: índice de exemplo, a câmera ao vivo ou a foto tirada
type IPhoto = { kind: "sample"; index: number } | { kind: "live" } | { kind: "shot"; uri: string };

const EDIT_DELAY_MS = 380;
const IS_WEB = Platform.OS === "web";

// Postar a foto da corrida: câmera → edição (camadas e legenda) → feed.
export const useRunPost = () => {
	const router = useRouter();
	const lastResult = useRunStore((s) => s.lastResult);
	const addMyPost = useStore((s) => s.addMyPost);
	const setHasJustPosted = useStore((s) => s.setHasJustPosted);
	const { publish: publishMutation } = usePostActions();
	const savedRunId = lastResult?.saved?.id ?? null;
	const [permission, requestPermission] = useCameraPermissions();
	const cameraRef = useRef<CameraView>(null);
	const flash = useShutterFlash();
	const [step, setStep] = useState<IStep>("camera");
	const [photo, setPhoto] = useState<IPhoto>({ kind: "sample", index: 0 });
	const [facing, setFacing] = useState<CameraType>("back");
	const [layers, setLayers] = useState<IPostArtLayers>({ route: true, stats: true, badge: true });
	const [caption, setCaption] = useState("");
	const run = lastResult && lastResult.km > POST_MIN_KM ? lastResult : POST_FALLBACK;

	// No iPhone abre direto na câmera ao vivo quando há permissão
	useEffect(() => {
		if (IS_WEB || !permission) return;
		if (permission.granted) setPhoto({ kind: "live" });
		else if (permission.canAskAgain) void requestPermission();
	}, [permission, requestPermission]);

	const shoot = useCallback(async () => {
		flash.fire();
		if (photo.kind === "live" && cameraRef.current) {
			const picture = await cameraRef.current.takePictureAsync({ quality: 0.85 }).catch(() => null);
			if (picture) setPhoto({ kind: "shot", uri: picture.uri });
		}
		setTimeout(() => {
			setStep("edit");
		}, EDIT_DELAY_MS);
	}, [flash, photo.kind]);

	const imageOf = (p: IPhoto): ImageSourcePropType | undefined => {
		if (p.kind === "sample") return POST_PHOTOS[p.index];
		return p.kind === "shot" ? { uri: p.uri } : undefined;
	};

	const publish = useCallback(() => {
		const post = {
			sample: photo.kind === "sample" ? photo.index : 0,
			uri: photo.kind === "shot" ? photo.uri : undefined,
			seconds: run.seconds,
			km: run.km,
			layers,
			caption: caption.trim() || POST_COPY.defaultCaption,
		};
		const done = (): void => {
			setHasJustPosted(true);
			router.replace(ROUTES.HOME);
		};
		if (IS_PREVIEW) {
			addMyPost({ ...post, id: `me-${String(Date.now())}`, createdAt: Date.now() });
			done();
			return;
		}
		publishMutation.mutate({ ...post, runId: savedRunId }, { onSuccess: done });
	}, [
		addMyPost,
		photo,
		run,
		layers,
		caption,
		router,
		publishMutation,
		savedRunId,
		setHasJustPosted,
	]);

	return {
		step,
		run,
		cameraRef,
		facing,
		isLive: photo.kind === "live",
		selectedSample: photo.kind === "sample" ? photo.index : -1,
		image: imageOf(photo),
		flashStyle: flash.style,
		layers,
		caption,
		setCaption,
		selectSample: (index: number) => {
			setPhoto({ kind: "sample", index });
		},
		flip: () => {
			if (photo.kind !== "live" && permission?.granted) setPhoto({ kind: "live" });
			else setFacing((f) => (f === "back" ? "front" : "back"));
		},
		shoot: () => {
			void shoot();
		},
		toggleLayer: (key: keyof IPostArtLayers) => {
			setLayers((l) => ({ ...l, [key]: !l[key] }));
		},
		close: () => {
			if (router.canGoBack()) router.back();
			else router.replace(ROUTES.RUN_SUMMARY);
		},
		backToCamera: () => {
			setStep("camera");
		},
		publish,
		isPublishing: publishMutation.isPending,
	};
};

export type IUseRunPostReturn = ReturnType<typeof useRunPost>;
