interface IRoundedRect {
	x: number;
	y: number;
	width: number;
	height: number;
	topRadius: number;
	bottomRadius: number;
}

// Caminho SVG de um retângulo com raios diferentes em cima e embaixo.
export const roundedRectPath = ({
	x,
	y,
	width,
	height,
	topRadius,
	bottomRadius,
}: IRoundedRect): string => {
	const right = x + width;
	const bottom = y + height;
	const rt = Math.max(0, Math.min(topRadius, width / 2, height / 2));
	const rb = Math.max(0, Math.min(bottomRadius, width / 2, height / 2));

	return [
		`M${String(x + rt)} ${String(y)}`,
		`H${String(right - rt)}`,
		`A${String(rt)} ${String(rt)} 0 0 1 ${String(right)} ${String(y + rt)}`,
		`V${String(bottom - rb)}`,
		`A${String(rb)} ${String(rb)} 0 0 1 ${String(right - rb)} ${String(bottom)}`,
		`H${String(x + rb)}`,
		`A${String(rb)} ${String(rb)} 0 0 1 ${String(x)} ${String(bottom - rb)}`,
		`V${String(y + rt)}`,
		`A${String(rt)} ${String(rt)} 0 0 1 ${String(x + rt)} ${String(y)}`,
		"Z",
	].join(" ");
};
