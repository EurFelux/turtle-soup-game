import { useContext } from "react";
import { LocaleProviderContext } from "@/context/locale";

export const useLocale = () => {
	const context = useContext(LocaleProviderContext);

	if (context === undefined)
		throw new Error("useTheme must be used within a ThemeProvider");

	return context;
};
