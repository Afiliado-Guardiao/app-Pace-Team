// Corrida: GPS em tempo real (inclusive com a tela bloqueada), filtros,
// distância e o estado da corrida em andamento.
export { ROUTE, ROUTE_CENTER } from "./demoRoute";
export type { IRunPoint } from "./geo";
export { distanceMeters, GPS_FILTER, routeDistance } from "./geo";
export type { IGpsFix } from "./gps";
export { startGpsWatch, useGpsStore } from "./gps";
export { RUN_LOCATION_TASK } from "./locationTask";
export { useRunReviewStore } from "./reviewStore";
export type { IRouteComparison, IRouteRun } from "./routeMatch";
export { compareWithPrevious, isSameRoute } from "./routeMatch";
export type { IRunGoal, IRunMode, IRunResult, IRunSaved, IRunStatus } from "./runStore";
export { DEFAULT_GOAL, elapsedSeconds, useRunStore } from "./runStore";
export type { ILocationPermission } from "./tracking";
export { currentFix, requestRunPermission, startTracking, stopTracking } from "./tracking";
export { useGpsWarmup } from "./useGpsWarmup";
