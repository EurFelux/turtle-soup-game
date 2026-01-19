import {
	createOpenAICompatible,
	type OpenAICompatibleProvider,
} from "@ai-sdk/openai-compatible";
import { generateText } from "ai";
import { mutate } from "swr";
import * as z from "zod";
import {
	createSoupPrompt,
	judgeTryPrompt,
	LOCALE_VARIABLE,
	TRUTH_VARIABLE,
} from "@/config/ai";
import { swrKeyMap } from "@/config/swr";
import { addTryToSoup, createSoup } from "@/db";
import {
	type AiSettings,
	type LocaleCode,
	type Try,
	TryResponseSchema,
} from "@/types";
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

export const createSoupFromAI = async ({
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
		throw new Error(`Invalid data: ${parsedSoup.error}`);
	}
	const soup = parsedSoup.data;
	await createSoup({
		id: uuidv4(),
		title: soup.title,
		surface: soup.surface,
		truth: soup.truth,
	});
	mutate(swrKeyMap.soups, (data) => [...(data || []), soup]);
	return parsedSoup.data;
};

const CreateTryResultSchema = z.discriminatedUnion("status", [
	z.object({
		status: z.literal("valid"),
		response: TryResponseSchema,
		reason: z.string(),
	}),
	z.object({
		status: z.literal("invalid"),
		reason: z.string(),
	}),
]);

type CreateTryParams = {
	soupId: string;
	userPrompt: string;
	aiSettings: AiSettings;
	locale: LocaleCode;
	truth: string;
	signal?: AbortSignal;
};

export const createTryFromAI = async ({
	soupId,
	userPrompt,
	aiSettings,
	locale,
	truth,
	signal,
}: CreateTryParams) => {
	const provider = createProvider(aiSettings);
	const systemPrompt = judgeTryPrompt
		.replaceAll(TRUTH_VARIABLE, truth)
		.replaceAll(LOCALE_VARIABLE, locale);
	if (!userPrompt) {
		throw new Error("User prompt is required");
	}
	const result = await generateText({
		model: provider.languageModel(aiSettings.model),
		system: systemPrompt,
		messages: [
			{
				role: "user",
				content: userPrompt,
			},
		],
		abortSignal: signal,
	});
	const parsedJson = safeParseJson(result.text);
	if (!parsedJson.success) {
		throw new Error(`Failed to parse JSON: ${parsedJson.error}`);
	}
	const parsedTry = CreateTryResultSchema.safeParse(parsedJson.data);
	if (!parsedTry.success) {
		throw new Error(`Invalid data: ${parsedTry.error}`);
	}
	const tryData = parsedTry.data;
	let validatedTry: Try | undefined;
	if (tryData.status === "valid") {
		validatedTry = {
			id: uuidv4(),
			soupId,
			createAt: new Date().toISOString(),
			question: userPrompt,
			status: tryData.status,
			reason: tryData.reason,
			response: tryData.response,
		} satisfies Try;
	} else {
		validatedTry = {
			id: uuidv4(),
			soupId,
			createAt: new Date().toISOString(),
			question: userPrompt,
			status: tryData.status,
			reason: tryData.reason,
		} satisfies Try;
	}
	await addTryToSoup(soupId, validatedTry);
	mutate<Try[]>(swrKeyMap.tries(soupId), (data) => {
		if (!data) return data;
		return [...data, validatedTry];
	});
	return parsedTry.data;
};
