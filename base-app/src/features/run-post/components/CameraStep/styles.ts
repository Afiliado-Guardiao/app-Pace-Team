import { ImageStyle, TextStyle, ViewStyle } from "react-native";

import { POST_ART_RATIO } from "@/components/shared/PostArt";
import { ITheme } from "@/theme";

const FRAME_GAP = 50;
const FRAME_SIDE = 12;
const FRAME_RADIUS = 26;
const BAR_SIDE = 18;
const BOTTOM = 34;
const THUMB_W = 34;
const THUMB_H = 44;
const SHUTTER = 76;

export const createCameraStepStyles = (theme: ITheme, insets: { top: number; bottom: number }) => {
	const { colors, typography } = theme.pace;
	const fill: ViewStyle = { position: "absolute", top: 0, left: 0, right: 0, bottom: 0 };

	return {
		root: { flex: 1, backgroundColor: colors.cameraBg } as ViewStyle,
		frame: {
			position: "absolute",
			top: insets.top + FRAME_GAP,
			left: FRAME_SIDE,
			right: FRAME_SIDE,
			borderRadius: FRAME_RADIUS,
			overflow: "hidden",
		} as ViewStyle,
		live: { width: "100%", aspectRatio: POST_ART_RATIO } as ViewStyle,
		fill,
		topBar: {
			position: "absolute",
			top: insets.top,
			left: BAR_SIDE,
			right: BAR_SIDE,
			flexDirection: "row",
			alignItems: "center",
			justifyContent: "space-between",
		} as ViewStyle,
		title: {
			fontFamily: typography.fonts.bold,
			fontSize: typography.sizes.body,
			color: colors.textPrimary,
		} as TextStyle,
		bottom: {
			position: "absolute",
			left: 0,
			right: 0,
			bottom: Math.max(BOTTOM, insets.bottom),
			flexDirection: "row",
			alignItems: "center",
			justifyContent: "space-between",
			paddingHorizontal: 34,
		} as ViewStyle,
		thumbs: { flexDirection: "row", gap: 6 } as ViewStyle,
		thumb: {
			width: THUMB_W,
			height: THUMB_H,
			borderRadius: 9,
			overflow: "hidden",
			borderWidth: 1,
			borderColor: colors.cameraThumbBorder,
		} as ViewStyle,
		thumbOn: { borderWidth: 2, borderColor: colors.ink.white } as ViewStyle,
		thumbImage: { width: "100%", height: "100%" } as ImageStyle,
		shutter: {
			width: SHUTTER,
			height: SHUTTER,
			borderRadius: SHUTTER / 2,
			borderWidth: 4,
			borderColor: colors.ink.white,
			padding: 5,
			boxShadow: "0 10px 30px -8px rgba(0,0,0,.6)",
		} as ViewStyle,
		shutterInner: {
			flex: 1,
			borderRadius: SHUTTER / 2,
			backgroundColor: colors.ink.white,
		} as ViewStyle,
		flash: { ...fill, backgroundColor: colors.ink.white } as ViewStyle,
	};
};
