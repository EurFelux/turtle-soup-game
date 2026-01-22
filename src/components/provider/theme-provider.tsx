import { useEffect, useState, useSyncExternalStore } from "react";
import { localStorageKeyMap } from "@/config/storage";
import { ThemeProviderContext } from "@/context/theme";
import type { Theme } from "@/types";

type ThemeProviderProps = {
	children: React.ReactNode;
	defaultTheme?: Theme;
	storageKey?: string;
};

export function ThemeProvider({
	children,
	defaultTheme = "system",
	...props
}: ThemeProviderProps) {
	const [theme, setTheme] = useState<Theme>(
		() =>
			(localStorage.getItem(localStorageKeyMap.theme) as Theme) || defaultTheme,
	);

	const isDark = useSyncExternalStore(
		(listener) => {
			const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
			mediaQuery.addEventListener("change", listener);

			return () => {
				window.removeEventListener("change", listener);
			};
		},
		() => window.matchMedia("(prefers-color-scheme: dark)").matches,
	);

	useEffect(() => {
		const root = window.document.documentElement;

		root.classList.remove("light", "dark");

		if (theme === "system") {
			const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
				.matches
				? "dark"
				: "light";

			root.classList.add(systemTheme);
			return;
		}

		root.classList.add(theme);
		// subscribe isDark, so internal theme changes are reflected
	}, [theme, isDark]);

	const value = {
		theme,
		setTheme: (theme: Theme) => {
			localStorage.setItem(localStorageKeyMap.theme, theme);
			setTheme(theme);
		},
	};

	return (
		<ThemeProviderContext.Provider {...props} value={value}>
			{children}
		</ThemeProviderContext.Provider>
	);
}
