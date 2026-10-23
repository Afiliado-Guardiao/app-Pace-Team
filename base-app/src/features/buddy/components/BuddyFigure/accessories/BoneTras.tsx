import React from "react";
import { View } from "react-native";

import { abs, NAVY } from "./shared";

export const BoneTras: React.FC<{ fill: string }> = ({ fill }) => (
	<>
		<View
			style={abs({
				left: 54,
				top: -16,
				width: 46,
				height: 11,
				borderRadius: 23,
				backgroundColor: "#1E2C3A",
				transform: [{ rotate: "-24deg" }],
				boxShadow: "0 3px 5px -2px rgba(0,0,0,.5)",
			})}
		/>
		<View
			style={abs({
				left: 6,
				top: -17,
				width: 76,
				height: 32,
				borderTopLeftRadius: 38,
				borderTopRightRadius: 38,
				borderBottomLeftRadius: 9,
				borderBottomRightRadius: 9,
				backgroundColor: "#FD5A0C",
				boxShadow: `inset 0 -3px 0 ${NAVY}, inset 10px 8px 14px rgba(255,154,92,.9), inset -8px -6px 12px rgba(184,48,0,.8), 0 4px 8px -4px rgba(0,0,0,.5)`,
			})}
		/>
		<View
			style={abs({
				left: 33,
				top: 1,
				width: 22,
				height: 14,
				borderTopLeftRadius: 11,
				borderTopRightRadius: 11,
				borderWidth: 3,
				borderBottomWidth: 0,
				borderColor: NAVY,
				backgroundColor: fill,
			})}
		/>
		<View
			style={abs({
				left: 30,
				top: 12,
				width: 28,
				height: 3.5,
				borderRadius: 2,
				backgroundColor: NAVY,
			})}
		/>
		<View
			style={abs({
				left: 39,
				top: -20,
				width: 10,
				height: 6,
				borderTopLeftRadius: 5,
				borderTopRightRadius: 5,
				borderBottomLeftRadius: 2,
				borderBottomRightRadius: 2,
				backgroundColor: NAVY,
			})}
		/>
	</>
);
