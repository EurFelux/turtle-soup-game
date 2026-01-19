import {
	createOpenAICompatible,
	type OpenAICompatibleProvider,
} from "@ai-sdk/openai-compatible";
import { generateText } from "ai";
import { mutate } from "swr";
import * as z from "zod";
import { createSoupPrompt, LOCALE_VARIABLE } from "@/config/ai";
import { swrKeyMap } from "@/config/swr";
import { createSoup } from "@/db";
import type { AiSettings, LocaleCode } from "@/types";
import { safeParseJson } from "@/utils/json";
import { uuidv4 } from "@/utils/uuid";

const createProvider = (aiSettings: AiSettings): OpenAICompatibleProvider => {
	switch (aiSettings.providerType) {
		case "openai-chat":
		default:
			return createOpenAICompatible({
				name: aiSettings.provider,
				baseURL: aiSettings.baseUrl,
				apiKey: aiSettings.apiKey,
			});
	}
};

const CreateSoupResultSchema = z.object({
	title: z.string(),
	surface: z.string(),
	truth: z.string(),
});

type CreateSoupParams = {
	userPrompt?: string;
	aiSettings: AiSettings;
	locale: LocaleCode;
	signal?: AbortSignal;
};

export const createSoupFromAi = async ({
	userPrompt = "",
	aiSettings,
	locale,
	signal,
}: CreateSoupParams) => {
	const provider = createProvider(aiSettings);
	const systemPrompt = createSoupPrompt.replaceAll(LOCALE_VARIABLE, locale);
	const result = await generateText({
		model: provider.languageModel(aiSettings.model),
		system: systemPrompt,
		messages: [
			{
				role: "user",
				content: userPrompt
					? "创作主题：" + userPrompt
					: "无特定主题，请自由发挥",
			},
		],
		abortSignal: signal,
	});
	const parsedJson = safeParseJson(result.text);
	if (!parsedJson.success) {
		throw new Error(`Failed to parse JSON: ${parsedJson.error}`);
	}
	const parsedSoup = CreateSoupResultSchema.safeParse(parsedJson.data);
	if (!parsedSoup.success) {
		throw new Error(`Failed to parse JSON: ${parsedJson}`);
	}
	const soup = parsedSoup.data;
	await createSoup({
		id: uuidv4(),
		title: soup.title,
		surface: soup.surface,
		truth: soup.truth,
		tryIds: [],
	});
	mutate(swrKeyMap.soups, (data) => [...(data || []), soup]);
	return parsedSoup.data;
};
