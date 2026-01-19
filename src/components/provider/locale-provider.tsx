import { useState } from "react";
import { LocaleProviderContext } from "@/context/locale";
import type { LocaleCode } from "@/types/locale";

type LocaleProviderProps = {
	children: React.ReactNode;
	storageKey?: string;
};

export function ThemeProvider({
	children,
	storageKey = "locale",
	...props
}: LocaleProviderProps) {
	const [locale, setLocale] = useState<LocaleCode>(
		window.navigator.language.startsWith("zh") ? "zh-CN" : "en-US",
	);

	const value = {
		locale,
		setLocale: (locale: LocaleCode) => {
			localStorage.setItem(storageKey, locale);
			setLocale(locale);
		},
	};

	return (
		<LocaleProviderContext.Provider {...props} value={value}>
			{children}
		</LocaleProviderContext.Provider>
	);
}
