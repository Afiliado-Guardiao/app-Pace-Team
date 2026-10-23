import { useCallback, useEffect, useRef, useState } from "react";

const REPEAT_MS = 120;
const FAST_AFTER = 8;
const FAST_FACTOR = 5;

// Campo da meta: segurar o −/+ repete (e acelera); tocar no número edita.
export const useGoalField = (
	onStep: (direction: number) => void,
	onType: (text: string) => void,
) => {
	const [isEditing, setIsEditing] = useState(false);
	const [text, setText] = useState("");
	const hold = useRef<ReturnType<typeof setInterval> | null>(null);

	const stopHold = useCallback(() => {
		if (hold.current) clearInterval(hold.current);
		hold.current = null;
	}, []);

	const startHold = useCallback(
		(direction: number) => {
			onStep(direction);
			let count = 0;
			stopHold();
			hold.current = setInterval(() => {
				count += 1;
				onStep(direction * (count > FAST_AFTER ? FAST_FACTOR : 1));
			}, REPEAT_MS);
		},
		[onStep, stopHold],
	);

	useEffect(() => stopHold, [stopHold]);

	const beginEdit = useCallback((value: string) => {
		setText(value);
		setIsEditing(true);
	}, []);

	const commit = useCallback(() => {
		setIsEditing(false);
		onType(text);
	}, [onType, text]);

	return { isEditing, text, setText, beginEdit, commit, startHold, stopHold };
};
