import React from "react";
import { View } from "react-native";

import Svg, { Defs, LinearGradient, Polygon, Stop } from "react-native-svg";

import { useSvgId } from "@/components/pace";

import { abs } from "./shared";

export const Coroa: React.FC = () => {
	const id = useSvgId("bd-crown");
	return (
		<>
			<Svg width={46} height={30} style={abs({ left: 21, top: -28 })}>
				<Defs>
					<LinearGradient id={id} x1="0" y1="0" x2="0" y2="1">
						<Stop offset="0" stopColor="#FFE7A3" />
						<Stop offset="0.45" stopColor="#FFC94D" />
						<Stop offset="1" stopColor="#D9952B" />
					</LinearGradient>
				</Defs>
				<Polygon points="0,30 0,8.4 11,17.4 23,0 35,17.4 46,8.4 46,30" fill={`url(#${id})`} />
			</Svg>
			{[0, 1, 2].map((i) => (
				<View
					key={i}
					style={abs({
						left: 28 + i * 13,
						top: -7,
						width: 6,
						height: 6,
						borderRadius: 3,
						backgroundColor: "#FD5A0C",
						boxShadow: "0 0 4px #FD5A0C",
					})}
				/>
			))}
		</>
	);
};
