export type LocaleCode = "zh-CN" | "en-US";

export type LocaleConfig = {
	code: LocaleCode;
	name: string;
	i18nKey: string;
};

export const chineseSimplified = {
	code: "zh-CN",
	name: "简体中文",
	i18nKey: "language.chinese_simplified",
} satisfies LocaleConfig;

export const englishUnitedStates = {
	code: "en-US",
	name: "English",
	i18nKey: "language.english_us",
} satisfies LocaleConfig;
