// Máscaras do Buddy Studio: SVG nas coordenadas do corpo (88 × 70), com
// espaço para passar por cima da cabeça e dos lados.
export const FACE_SVG_STYLE = {
	position: "absolute",
	left: -16,
	top: -32,
	overflow: "visible",
} as const;
export const FACE_VIEWBOX = "-16 -32 120 110";
export const FACE_W = 120;
export const FACE_H = 110;

// Buraco de elipse para "furar" a máscara (fillRule evenodd)
export const hole = (cx: number, cy: number, rx: number, ry: number): string =>
	`M${String(cx - rx)} ${String(cy)} a${String(rx)} ${String(ry)} 0 1 0 ${String(2 * rx)} 0 a${String(rx)} ${String(ry)} 0 1 0 ${String(-2 * rx)} 0 Z`;

// Retângulo de cantos redondos como caminho SVG (sem x/y no componente)
export const roundRect = (x: number, y: number, w: number, h: number, r: number): string =>
	`M${String(x + r)} ${String(y)} h${String(w - 2 * r)} a${String(r)} ${String(r)} 0 0 1 ${String(r)} ${String(r)} v${String(h - 2 * r)} a${String(r)} ${String(r)} 0 0 1 ${String(-r)} ${String(r)} h${String(-(w - 2 * r))} a${String(r)} ${String(r)} 0 0 1 ${String(-r)} ${String(-r)} v${String(-(h - 2 * r))} a${String(r)} ${String(r)} 0 0 1 ${String(r)} ${String(-r)} Z`;
