import React from "react";
import { View } from "react-native";

import MapView, { Circle, Marker, Polyline } from "react-native-maps";

import { useTheme } from "@/theme";

import { EndPin, FriendPin, MePin, RegionLabel, StartPin } from "./markers";
import { createRunMapStyles, ROUTE_HALO, ROUTE_WIDTH } from "./styles";
import { IRunMapProps } from "./types";
import { useRunMap } from "./useRunMap";

// Mapa da corrida (Apple Maps escuro no iPhone): rota laranja com halo,
// início, fim, o atleta pulsando, amigos do time e regiões agregadas.
export const RunMap: React.FC<IRunMapProps> = ({
	route,
	progress = 1,
	showRoute = true,
	showMe = false,
	me,
	regions,
	friends,
	interactive = true,
	follow = false,
	style,
}) => {
	const { theme } = useTheme();
	const styles = createRunMapStyles(theme);
	const map = useRunMap({ route, progress, me, follow });

	return (
		<View style={[styles.map, style]} pointerEvents={interactive ? "auto" : "none"}>
			<MapView
				ref={map.ref}
				style={styles.map}
				initialRegion={map.initialRegion}
				onMapReady={map.fit}
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
				{showRoute && map.drawn.length > 1 ? (
					<>
						<Polyline
							coordinates={map.fullCoords}
							strokeColor={styles.routeHalo}
							strokeWidth={ROUTE_HALO}
							lineCap="round"
						/>
						<Polyline
							coordinates={map.drawnCoords}
							strokeColor={styles.routeColor}
							strokeWidth={ROUTE_WIDTH}
							lineCap="round"
							lineJoin="round"
						/>
					</>
				) : null}
				{showRoute && map.start ? (
					<Marker coordinate={map.start} anchor={{ x: 0.5, y: 0.5 }} tracksViewChanges={false}>
						<StartPin />
					</Marker>
				) : null}
				{showRoute && progress >= 1 && !showMe && map.end ? (
					<Marker coordinate={map.end} anchor={{ x: 0.5, y: 0.5 }} tracksViewChanges={false}>
						<EndPin />
					</Marker>
				) : null}
				{(showMe || showRoute) && map.mePosition ? (
					<Marker coordinate={map.mePosition} anchor={{ x: 0.5, y: 0.5 }}>
						<MePin />
					</Marker>
				) : null}
				{regions?.map((r, i) => (
					<React.Fragment key={i}>
						<Circle
							center={{ latitude: r.center[0], longitude: r.center[1] }}
							radius={r.radius}
							strokeColor={styles.routeColor}
							strokeWidth={1}
							fillColor={styles.regionFill}
						/>
						<Marker
							coordinate={{ latitude: r.center[0], longitude: r.center[1] }}
							anchor={{ x: 0.5, y: 0.5 }}
						>
							<RegionLabel count={r.count} label={r.label} />
						</Marker>
					</React.Fragment>
				))}
				{friends?.map((f, i) => (
					<Marker
						key={i}
						coordinate={{ latitude: f.position[0], longitude: f.position[1] }}
						anchor={{ x: 0.5, y: 0.35 }}
					>
						<FriendPin image={f.image} label={f.label} />
					</Marker>
				))}
			</MapView>
		</View>
	);
};

export * from "./types";
