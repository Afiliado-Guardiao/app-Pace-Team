import { ImageStyle, TextStyle, ViewStyle } from "react-native";

import { ITheme } from "@/theme";

const PIN = 18;
const PIN_BORDER = 4;
const ME = 28;
const ME_DOT = 14;
const ME_BORDER = 3;
const FRIEND = 40;
const FRIEND_BORDER = 2.5;
const REGION_W = 96;
const REGION_H = 40;

export const ROUTE_WIDTH = 5;
export const ROUTE_HALO = 12;

export const createRunMapStyles = (theme: ITheme) => {
	const { colors, typography } = theme.pace;
	const pin: ViewStyle = {
		width: PIN,
		height: PIN,
		borderRadius: PIN / 2,
		borderWidth: PIN_BORDER,
		borderColor: colors.ink.white,
	};

	return {
		map: {
			position: "absolute",
			top: 0,
			left: 0,
			right: 0,
			bottom: 0,
			backgroundColor: colors.slate[700],
		} as ViewStyle,
		startPin: { ...pin, backgroundColor: colors.slate[900] } as ViewStyle,
		endPin: {
			...pin,
			backgroundColor: colors.orange[500],
			boxShadow: "0 0 12px rgba(253,90,12,.8)",
		} as ViewStyle,
		meHalo: {
			width: ME,
			height: ME,
			borderRadius: ME / 2,
			alignItems: "center",
			justifyContent: "center",
			backgroundColor: "rgba(253,90,12,.25)",
		} as ViewStyle,
		meDot: {
			width: ME_DOT,
			height: ME_DOT,
			borderRadius: ME_DOT / 2,
			borderWidth: ME_BORDER,
			borderColor: colors.ink.white,
			backgroundColor: colors.orange[500],
			boxShadow: "0 0 12px rgba(253,90,12,.9)",
		} as ViewStyle,
		friend: { alignItems: "center", gap: 4, width: 64 } as ViewStyle,
		friendPhoto: {
			width: FRIEND,
			height: FRIEND,
			borderRadius: FRIEND / 2,
			borderWidth: FRIEND_BORDER,
			borderColor: colors.ink.white,
		} as ImageStyle,
		friendLabel: {
			paddingHorizontal: 7,
			paddingVertical: 3,
			borderRadius: 99,
			backgroundColor: "rgba(255,255,255,.18)",
			borderWidth: 1,
			borderColor: "rgba(255,255,255,.45)",
		} as ViewStyle,
		friendText: {
			fontFamily: typography.fonts.bold,
			fontSize: 9.5,
			color: colors.ink.white,
		} as TextStyle,
		region: {
			width: REGION_W,
			height: REGION_H,
			borderRadius: REGION_H / 2,
			alignItems: "center",
			justifyContent: "center",
			backgroundColor: "rgba(255,255,255,.16)",
			borderWidth: 1,
			borderColor: "rgba(255,255,255,.4)",
		} as ViewStyle,
		regionCount: {
			fontFamily: typography.fonts.extrabold,
			fontSize: 14,
			color: colors.ink.white,
		} as TextStyle,
		regionText: {
			fontFamily: typography.fonts.semibold,
			fontSize: 9,
			color: "#aab6c2",
		} as TextStyle,
		routeColor: colors.route,
		routeHalo: "rgba(253,90,12,.18)",
		regionFill: "rgba(253,90,12,.14)",
	};
};
