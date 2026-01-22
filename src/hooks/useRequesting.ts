import { useEffect, useState } from "react";
import { getCache, setCache, subscribe } from "@/service/cache-service";

export const useRequesting = (id: string) => {
	const [isRequesting, _setIsRequesting] = useState(
		getCache(`requesting-${id}`) || false,
	);

	useEffect(() => {
		const unsubscribe = subscribe(`requesting-${id}`, () => {
			_setIsRequesting(getCache(`requesting-${id}`) || false);
		});
		return () => {
			unsubscribe();
		};
	}, [id]);

	const setIsRequesting = (value: boolean) => {
		setCache(`requesting-${id}`, value);
	};

	return [isRequesting, setIsRequesting] as const;
};
