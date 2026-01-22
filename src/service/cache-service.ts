type CacheType = "requesting";

type CacheMapType = {
	[key: `requesting-${string}`]: boolean;
};

type CacheKey = keyof CacheMapType;
type CacheValue<K extends CacheKey> = CacheMapType[K];

const cacheMap = new Map<CacheKey, CacheValue<CacheKey>>();
const subscribers = new Map<CacheKey, Set<() => void>>();

export const getCache = <T extends CacheKey>(
	key: T,
): CacheValue<T> | undefined => {
	return cacheMap.get(key) as CacheValue<T> | undefined;
};

export const setCache = <T extends CacheKey>(key: T, value: CacheValue<T>) => {
	cacheMap.set(key, value);
	notify(key);
};

const notify = (key: CacheKey) => {
	subscribers.get(key)?.forEach((callback) => callback());
};

export const subscribe = <T extends CacheKey>(
	key: CacheKey,
	callback: (value?: CacheValue<T>) => void,
) => {
	if (!subscribers.has(key)) {
		subscribers.set(key, new Set());
	}
	subscribers.get(key)?.add(callback);
	return () => {
		unsubscribe(key, callback);
	};
};

export const unsubscribe = <T extends CacheKey>(
	key: CacheKey,
	callback: (value?: CacheValue<T>) => void,
) => {
	subscribers.get(key)?.delete(callback);
};

export const clearCache = (type?: CacheType) => {
	switch (type) {
		case "requesting":
			cacheMap.forEach((_, key) => {
				if (key.startsWith("requesting-")) {
					cacheMap.delete(key);
				}
			});
			break;
		default:
			cacheMap.clear();
			break;
	}
};
