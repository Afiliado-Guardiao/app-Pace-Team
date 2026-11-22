import React, { useMemo } from "react";
import { View } from "react-native";

import MapView, { Circle, LatLng, Marker } from "react-native-maps";

import { useTheme } from "@/theme";

import { MapLine } from "./MapLine";
import { MapPin } from "./MapPin";
import { EndPin, FriendPin, MePin, RegionLabel, StartPin } from "./markers";
import { padSlots } from "./slots";
import { createRunMapStyles, ROUTE_HALO, ROUTE_WIDTH } from "./styles";
import { ILatLng, IRunMapProps } from "./types";
import { useRunMap } from "./useRunMap";
import { useSlotCount } from "./useSlotCount";

const PHOTO_ANCHOR = 0.35;
const toLatLng = ([latitude, longitude]: ILatLng): LatLng => ({ latitude, longitude });
const line = (points: readonly ILatLng[] | null | undefined): LatLng[] | null =>
	points ? points.map(toLatLng) : null;

// Mapa da corrida (Apple Maps escuro no iPhone): rota laranja com halo,
// início, fim, o atleta pulsando, amigos do time e regiões agregadas. Todos
// os itens ficam sempre montados, na mesma ordem (ver slots.ts).
export const RunMap: React.FC<IRunMapProps> = ({
	route,
	progress = 1,
	showRoute = true,
	showMe = false,
	me,
	meImage,
	regions,
	friends,
	leaderTrail,
	trails,
	interactive = true,
	follow = false,
	followPaused = false,
	onUserMove,
	recenter,
	style,
}) => {
	const { theme } = useTheme();
	const styles = createRunMapStyles(theme);
	const extra = useMemo(
		() => [...(trails ?? []).flat(), ...(friends ?? []).map((f) => f.position)],
		[trails, friends],
	);
	const map = useRunMap({ route, progress, me, follow, followPaused, recenter, extra });
	const trailSlots = useSlotCount(trails?.length);
	const friendSlots = useSlotCount(friends?.length);
	const hidden = useMemo(
		() => ({ line: [map.home, map.home], color: styles.hiddenColor }),
		[map.home, styles.hiddenColor],
	);
	const hasRoute = showRoute && map.drawn.length > 1;
	const isFinished = showRoute && progress >= 1 && !showMe;

	return (
		<View
			style={[styles.map, style]}
			pointerEvents={interactive ? "auto" : "none"}
			onTouchMove={onUserMove}
		>
			<MapView
				// Trocar entre rota e regiões, ou precisar de mais lugares, monta outro
				// mapa (não mexe na lista)
				key={`${regions ? "regions" : "route"}-${String(trailSlots)}-${String(friendSlots)}`}
				ref={map.ref}
				style={styles.map}
				initialRegion={map.initialRegion}
				onMapReady={map.fit}
				onPanDrag={onUserMove}
				userInterfaceStyle="dark"
				mapType="mutedStandard"
				showsPointsOfInterest={false}
				showsCompass={false}
				showsScale={false}
				toolbarEnabled={false}
				scrollEnabled={interactive}
				zoomEnabled={interactive}
				rotateEnabled={false}
				pitchEnabled={false}
			>
				{padSlots(trails, trailSlots).map((trail, i) => (
					<MapLine
						key={`trail-${String(i)}`}
						coords={line(trail)}
						color={styles.crewColor}
						width={ROUTE_WIDTH - 1}
						hidden={hidden}
					/>
				))}
				<MapLine
					key="leader"
					coords={line(leaderTrail)}
					color={styles.leaderColor}
					width={ROUTE_WIDTH}
					hidden={hidden}
				/>
				<MapLine
					key="halo"
					coords={hasRoute ? map.fullCoords : null}
					color={styles.routeHalo}
					width={ROUTE_HALO}
					hidden={hidden}
				/>
				<MapLine
					key="route"
					coords={hasRoute ? map.drawnCoords : null}
					color={styles.routeColor}
					width={ROUTE_WIDTH}
					hidden={hidden}
				/>
				<MapPin
					key="start"
					identifier="start"
					at={showRoute ? map.start : null}
					hiddenAt={map.home}
					isStill
				>
					<StartPin />
				</MapPin>
				<MapPin
					key="end"
					identifier="end"
					at={isFinished ? map.end : null}
					hiddenAt={map.home}
					isStill
				>
					<EndPin />
				</MapPin>
				<MapPin
					key="me"
					identifier="me"
					at={showMe || showRoute ? map.mePosition : null}
					hiddenAt={map.home}
					anchorY={meImage ? PHOTO_ANCHOR : undefined}
				>
					{meImage ? <FriendPin image={meImage} name="Você" label="Você" /> : <MePin />}
				</MapPin>
				{padSlots(friends, friendSlots).map((f, i) => (
					<MapPin
						key={`friend-${String(i)}`}
						identifier={`friend-${String(i)}`}
						at={f ? toLatLng(f.position) : null}
						hiddenAt={map.home}
						anchorY={PHOTO_ANCHOR}
					>
						<FriendPin image={f?.image} name={f?.name ?? f?.label ?? ""} label={f?.label ?? ""} />
					</MapPin>
				))}
				{regions?.map((r, i) => (
					<React.Fragment key={i}>
						<Circle
							center={toLatLng(r.center)}
							radius={r.radius}
							strokeColor={styles.routeColor}
							strokeWidth={1}
							fillColor={styles.regionFill}
						/>
						<Marker coordinate={toLatLng(r.center)} anchor={{ x: 0.5, y: 0.5 }}>
							<RegionLabel count={r.count} label={r.label} />
						</Marker>
					</React.Fragment>
				))}
			</MapView>
		</View>
	);
};

export * from "./types";
