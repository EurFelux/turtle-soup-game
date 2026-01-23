import { useId, useState } from "react";
import { useTimer } from "./useTimer";

export const useTemporaryState = <T>(
	initialState: T | (() => T),
	delay: number = 2000,
) => {
	const [value, _setValue] = useState<T>(initialState);
	const { setTimeoutTimer } = useTimer();
	const id = useId();

	const setValue = (newValue: T) => {
		_setValue(newValue);
		setTimeoutTimer(
			id,
			() => {
				_setValue(initialState);
			},
			delay,
		);
	};

	return [value, setValue] as const;
};
