import { useCallback, useEffect, useState } from "react";

export const useTimer = () => {
	const [timerMap] = useState(new Map<string, number>());

	const cancelTimer = useCallback(
		(id: string) => {
			const timerId = timerMap.get(id);
			if (timerId !== undefined) {
				clearTimeout(timerId);
				timerMap.delete(id);
			}
		},
		[timerMap],
	);

	const setTimeoutTimer = useCallback(
		// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
		(id: string, callback: Function, delay: number) => {
			cancelTimer(id);
			const timerId = setTimeout(callback, delay);
			timerMap.set(id, timerId);
		},
		[cancelTimer, timerMap],
	);

	useEffect(() => {
		return () => {
			timerMap.forEach((timerId) => clearTimeout(timerId));
		};
	}, [timerMap]);

	return {
		setTimeoutTimer,
		cancelTimer,
	};
};
