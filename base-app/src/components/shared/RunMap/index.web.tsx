import React from "react";
import { View } from "react-native";

import Svg, { Line, Polyline } from "react-native-svg";

import { useLayoutSize } from "@/components/pace";
import { useTheme } from "@/theme";

import { EndPin, MePin, StartPin } from "./markers";
import { createRunMapStyles, ROUTE_HALO, ROUTE_WIDTH } from "./styles";
import { ILatLng, IRunMapProps } from "./types";

const PAD = 40;
const GRID = 6;
const PIN_HALF = 9;
const ME_HALF = 14;

// Prévia web: sem mapa nativo, desenha a rota projetada sobre o fundo ardósia.
export const RunMap: React.FC<IRunMapProps> = ({
	route,
	progress = 1,
	showRoute = true,
	showMe = false,
	me,
	style,
}) => {
	const { theme } = useTheme();
	const styles = createRunMapStyles(theme);
	const { size, onLayout } = useLayoutSize();
	const points: readonly ILatLng[] = route.length > 0 ? route : me ? [me] : [];
	const lats = points.map((p) => p[0]);
	const lngs = points.map((p) => p[1]);
	const w = size?.width ?? 0;
	const h = size?.height ?? 0;
	const spanLat = Math.max(1e-4, Math.max(...lats) - Math.min(...lats));
	const spanLng = Math.max(1e-4, Math.max(...lngs) - Math.min(...lngs));
	const scale = Math.min((w - PAD * 2) / spanLng, (h - PAD * 2) / spanLat);
	const project = (p: ILatLng): [number, number] => [
		w / 2 + (p[1] - (Math.max(...lngs) + Math.min(...lngs)) / 2) * scale,
		h / 2 - (p[0] - (Math.max(...lats) + Math.min(...lats)) / 2) * scale,
	];
	const count = Math.max(1, Math.round(points.length * Math.min(1, progress)));
	const drawn = points.slice(0, count).map(project);
	const all = points.map(project);
	const toAttr = (list: [number, number][]) =>
		list.map(([x, y]) => `${String(x)},${String(y)}`).join(" ");
	const start = all.at(0);
	const end = all.at(-1);
	const tip = me ? project(me) : drawn.at(-1);

	return (
		<View style={[styles.map, style]} onLayout={onLayout}>
			{size && points.length > 0 ? (
				<Svg width={w} height={h}>
					{Array.from({ length: GRID }).map((_, i) => (
						<Line
							key={`h${String(i)}`}
							x1={0}
							x2={w}
							y1={(h / GRID) * i}
							y2={(h / GRID) * i}
							stroke="rgba(255,255,255,.05)"
						/>
					))}
					{Array.from({ length: GRID }).map((_, i) => (
						<Line
							key={`v${String(i)}`}
							y1={0}
							y2={h}
							x1={(w / GRID) * i}
							x2={(w / GRID) * i}
							stroke="rgba(255,255,255,.05)"
						/>
					))}
					{showRoute ? (
						<>
							<Polyline
								points={toAttr(all)}
								fill="none"
								stroke={styles.routeHalo}
								strokeWidth={ROUTE_HALO}
								strokeLinecap="round"
							/>
							<Polyline
								points={toAttr(drawn)}
								fill="none"
								stroke={styles.routeColor}
								strokeWidth={ROUTE_WIDTH}
								strokeLinecap="round"
								strokeLinejoin="round"
							/>
						</>
					) : null}
				</Svg>
			) : null}
			{showRoute && start ? (
				<View style={{ position: "absolute", left: start[0] - PIN_HALF, top: start[1] - PIN_HALF }}>
					<StartPin />
				</View>
			) : null}
			{showRoute && progress >= 1 && !showMe && end ? (
				<View style={{ position: "absolute", left: end[0] - PIN_HALF, top: end[1] - PIN_HALF }}>
					<EndPin />
				</View>
			) : null}
			{(showMe || showRoute) && tip ? (
				<View style={{ position: "absolute", left: tip[0] - ME_HALF, top: tip[1] - ME_HALF }}>
					<MePin />
				</View>
			) : null}
		</View>
	);
};

export * from "./types";
