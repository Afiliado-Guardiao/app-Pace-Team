import React from "react";
import { View } from "react-native";

import { abs, FRAME } from "./shared";

export const Grau: React.FC = () => {
	const lens = (left: number) => (
		<View
			key={left}
			style={abs({
				left,
				top: 19,
				width: 26,
				height: 21,
				borderWidth: 3.5,
				borderColor: FRAME,
				borderTopLeftRadius: 9,
				borderTopRightRadius: 9,
				borderBottomLeftRadius: 11,
				borderBottomRightRadius: 11,
				backgroundColor: "rgba(214,236,255,.16)",
				overflow: "hidden",
				boxShadow: "0 3px 5px -2px rgba(0,0,0,.45), inset 0 0 0 1px rgba(255,255,255,.12)",
			})}
		>
			<View
				style={abs({
					left: 5,
					top: -6,
					width: 5,
					height: 30,
					backgroundColor: "rgba(255,255,255,.55)",
					transform: [{ rotate: "32deg" }],
				})}
			/>
			<View
				style={abs({
					left: 12,
					top: -6,
					width: 2,
					height: 30,
					backgroundColor: "rgba(255,255,255,.4)",
					transform: [{ rotate: "32deg" }],
				})}
			/>
		</View>
	);
	return (
		<>
			<View
				style={abs({
					left: -2,
					top: 23,
					width: 19,
					height: 3.5,
					borderRadius: 2,
					backgroundColor: FRAME,
				})}
			/>
			<View
				style={abs({
					left: 71,
					top: 23,
					width: 19,
					height: 3.5,
					borderRadius: 2,
					backgroundColor: FRAME,
				})}
			/>
			<View
				style={abs({
					left: 41,
					top: 25,
					width: 6,
					height: 3.5,
					borderRadius: 2,
					backgroundColor: FRAME,
				})}
			/>
			{lens(16)}
			{lens(46)}
		</>
	);
};
