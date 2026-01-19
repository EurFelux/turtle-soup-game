import { createContext } from "react";
import { defaultLocale } from "@/config/locale";
import type { LocaleCode } from "@/types/locale";

type LocaleProviderState = {
	locale: LocaleCode;
	setLocale: (locale: LocaleCode) => void;
};

const initialState: LocaleProviderState = {
	locale: defaultLocale,
	setLocale: () => null,
};

export const LocaleProviderContext =
	createContext<LocaleProviderState>(initialState);
