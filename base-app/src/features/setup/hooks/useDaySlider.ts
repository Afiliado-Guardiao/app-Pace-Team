import { useState } from "react";
import { GestureResponderEvent, LayoutChangeEvent } from "react-native";

interface IUseDaySliderReturn {
	onLayout: (e: LayoutChangeEvent) => void;
	onTouch: (e: GestureResponderEvent) => void;
}

// Arrastar/tocar na trilha escolhe de 0 a `max` dias
export const useDaySlider = (
	max: number,
	onChange: (value: number) => void,
): IUseDaySliderReturn => {
	const [width, setWidth] = useState(1);
	return {
		onLayout: (e) => {
			setWidth(Math.max(1, e.nativeEvent.layout.width));
		},
		onTouch: (e) => {
			const ratio = Math.max(0, Math.min(1, e.nativeEvent.locationX / width));
			onChange(Math.round(ratio * max));
		},
	};
};
