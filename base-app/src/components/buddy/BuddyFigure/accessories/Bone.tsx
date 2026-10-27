import React from "react";
import { View } from "react-native";

import { abs, NAVY } from "./shared";

export const Bone: React.FC = () => (
	<>
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
				backgroundColor: NAVY,
				boxShadow: "inset 0 -3px 0 rgba(253,90,12,.85), inset 10px 8px 16px rgba(79,107,132,.9)",
			})}
		/>
		<View
			style={abs({
				left: 44,
				top: 7,
				width: 56,
				height: 11,
				borderRadius: 28,
				backgroundColor: "#202F3E",
				transform: [{ rotate: "-5deg" }],
				boxShadow: "0 4px 6px -2px rgba(0,0,0,.5)",
			})}
		/>
		<View
			style={abs({
				left: 37,
				top: -7,
				width: 13,
				height: 13,
				borderRadius: 7,
				backgroundColor: "#FD5A0C",
				boxShadow: "0 0 6px rgba(253,90,12,.7)",
			})}
		/>
	</>
);
