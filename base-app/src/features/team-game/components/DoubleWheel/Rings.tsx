import React from "react";

import Svg, { Circle, G, Path, Text as SvgText, TSpan } from "react-native-svg";

import { ITeamGameCell } from "@/lib/supabase";

import { formatPace } from "../../constants";
import { NAME_IN, NAME_OUT, OUTER_IN, ringSlice } from "../../constants/wheel";

import { IDoubleWheelPalette } from "./styles";

interface IRingProps {
	size: number;
	palette: IDoubleWheelPalette;
	// Casa / nome sorteado (laranja); null enquanto gira
	hit: number | null;
}

const NAME_MAX = 8;
// Gira em volta do centro da roleta
const spinAt = (deg: number, c: number): string =>
	`rotate(${String(deg)} ${String(c)} ${String(c)})`;
const fillOf = (o: { i: number; isHit: boolean; hit: string; a: string; b: string }): string => {
	if (o.isHit) return o.hit;
	return o.i % 2 ? o.b : o.a;
};
const shortName = (name: string): string =>
	name.length > NAME_MAX ? `${name.slice(0, NAME_MAX - 1)}…` : name;

// Anel de fora: as 8 casas com km e pace
export const ChallengeRing: React.FC<IRingProps & { cells: ITeamGameCell[] }> = ({
	size,
	palette,
	hit,
	cells,
}) => {
	const c = size / 2;
	const r1 = c - 1;
	const r0 = r1 * OUTER_IN;
	const mid = (r0 + r1) / 2;
	const n = cells.length;
	const km = size * 0.053;
	return (
		<Svg width={size} height={size}>
			{cells.map((cell, i) => {
				const isHit = i === hit;
				const ink = isHit ? palette.hitText : palette.outerText;
				const fill = fillOf({ i, isHit, hit: palette.hit, a: palette.outerA, b: palette.outerB });
				return (
					<G key={i}>
						<Path
							d={ringSlice({ c, r0, r1, i, n })}
							fill={fill}
							stroke={palette.line}
							strokeWidth={1}
						/>
						<G transform={`${spinAt((i * 360) / n, c)} translate(${String(c)} ${String(c - mid)})`}>
							<SvgText textAnchor="middle" fontFamily={palette.numeric} fontSize={km} fill={ink}>
								{String(cell.km)}
								<TSpan fontSize={km * 0.5}> km</TSpan>
							</SvgText>
							<G transform={`translate(0 ${String(km * 0.85)})`}>
								<SvgText
									textAnchor="middle"
									fontFamily={palette.numericLight}
									fontSize={km * 0.56}
									fill={ink}
								>
									{`${formatPace(cell.pace)}/km`}
								</SvgText>
							</G>
						</G>
					</G>
				);
			})}
		</Svg>
	);
};

// Anel de dentro: os nomes de quem está online
export const NameRing: React.FC<IRingProps & { names: string[] }> = ({
	size,
	palette,
	hit,
	names,
}) => {
	const c = size / 2;
	const r1 = (c - 1) * NAME_OUT;
	const r0 = (c - 1) * NAME_IN;
	const n = Math.max(names.length, 1);
	return (
		<Svg width={size} height={size}>
			<Circle cx={c} cy={c} r={r1 + 3} fill={palette.line} />
			{names.map((name, i) => {
				const isHit = i === hit;
				const fill = fillOf({ i, isHit, hit: palette.hit, a: palette.innerA, b: palette.innerB });
				return (
					<G key={i}>
						<Path
							d={ringSlice({ c, r0, r1, i, n })}
							fill={fill}
							stroke={palette.line}
							strokeWidth={1.5}
						/>
						<G
							transform={`${spinAt((i * 360) / n - 90, c)} translate(${String(c + (r0 + r1) / 2)} ${String(c + size * 0.013)})`}
						>
							<SvgText
								textAnchor="middle"
								fontFamily={palette.name}
								fontSize={size * 0.037}
								fill={isHit ? palette.hitText : palette.innerText}
							>
								{shortName(name)}
							</SvgText>
						</G>
					</G>
				);
			})}
		</Svg>
	);
};
