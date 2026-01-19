const cacheMap = new Map<string, unknown>();

export const getCache = <T>(key: string) => {
	// NOTE: Safety not guaranteed
	return cacheMap.get(key) as T;
};

export const setCache = <T>(key: string, value: T) => {
	cacheMap.set(key, value);
};

export const clearCache = () => {
	cacheMap.clear();
};
