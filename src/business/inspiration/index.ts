import { sampleSize } from "lodash";
import { getInspirationPrompt, inspirationsMap } from "@/config/inspiration";
import { defaultLocale } from "@/config/locale";
import type { LocaleCode } from "@/types";

const getInspirations = ({ locale }: { locale?: LocaleCode }) => {
	if (!locale) return inspirationsMap[defaultLocale];
	return inspirationsMap[locale];
};

const randomInspiration = ({
	locale,
	size = 3,
}: {
	locale: LocaleCode;
	size?: number;
}) => {
	const inspirations = getInspirations({ locale });
	return sampleSize(inspirations, size);
};

export const createInspirationPrompt = ({
	locale,
}: {
	locale: LocaleCode;
}): string => {
	const inspirations = randomInspiration({ locale });
	const promptTemplate = getInspirationPrompt({ locale });
	return promptTemplate + inspirations.join(", ");
};
