import { useMemo } from "react";

import { Montserrat_700Bold } from "@expo-google-fonts/montserrat/700Bold";

import { Skia, SkImage, useFont, useImage } from "@shopify/react-native-skia";

import { IWeather } from "@/lib/weather";

import { HERO_IMAGES } from "../scene/assets";
import { makeBasePicture, makeTonePaint } from "../scene/basePicture";
import { IBuddyKit } from "../scene/frontPicture";
import { SCENE_W } from "../scene/geometry";
import { IHeroRunner, ISceneKit } from "../scene/types";

const BASE_WIDTH = 360;
const LABEL_SIZE = 8;
const MATE_SPRITES = 4;

interface IUseHeroKitReturn {
	kit: ISceneKit | null;
	buddy: IBuddyKit | null;
}

const useMateImages = (): (SkImage | null)[] => [
	useImage(HERO_IMAGES.mates[0]),
	useImage(HERO_IMAGES.mates[1]),
	useImage(HERO_IMAGES.mates[2]),
	useImage(HERO_IMAGES.mates[3]),
];

// Peças da cena prontas para os quadros (imagens, tom do clima, pista parada)
export const useHeroKit = (o: {
	weather: IWeather;
	runners: IHeroRunner[];
	width: number;
}): IUseHeroKitReturn => {
	const { weather, runners, width } = o;
	const track = useImage(HERO_IMAGES.track);
	const buddyImage = useImage(HERO_IMAGES.buddy);
	const me = useImage(HERO_IMAGES.me);
	const [m0, m1, m2, m3] = useMateImages();
	const k = width / BASE_WIDTH;
	const font = useFont(Montserrat_700Bold, LABEL_SIZE * (k || 1));

	const base = useMemo(() => (track ? makeBasePicture(track, weather) : null), [track, weather]);
	const tonePaint = useMemo(() => makeTonePaint(weather), [weather]);
	const buddy = useMemo<IBuddyKit | null>(() => {
		if (!buddyImage || width <= 0) return null;
		const paint = Skia.Paint();
		paint.setImageFilter(
			Skia.ImageFilter.MakeDropShadow(0, 16 * k, 9 * k, 9 * k, Skia.Color("rgba(0,0,0,0.4)"), null),
		);
		return { image: buddyImage, paint };
	}, [buddyImage, width, k]);

	const kit = useMemo<ISceneKit | null>(() => {
		const all = [me, m0, m1, m2, m3];
		if (!track || !base || width <= 0 || all.some((img) => !img)) return null;
		const loaded = all as SkImage[];
		let mate = 0;
		const sprites = runners.map((r) => (r.isMe ? loaded[0] : loaded[1 + (mate++ % MATE_SPRITES)]));
		return {
			ks: width / SCENE_W,
			k,
			weather,
			track,
			base,
			sprites,
			names: runners.map((r) => r.name),
			isMe: runners.map((r) => r.isMe),
			tonePaint,
			font,
		};
	}, [track, base, me, m0, m1, m2, m3, runners, width, k, weather, tonePaint, font]);

	return { kit, buddy };
};
