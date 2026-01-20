import {
	createOpenAICompatible,
	type OpenAICompatibleProvider,
} from "@ai-sdk/openai-compatible";
import { generateText } from "ai";
import { mutate } from "swr";
import * as z from "zod";
import {
	createSoupPrompt,
	evaluateSolutionPrompt,
	evaluateSolutionPromptContext,
	judgeSolutionPrompt,
	judgeSolutionPromptContext,
	judgeTryPrompt,
	LOCALE_VARIABLE,
	SOLUTION_VARIABLE,
	TRIES_VARIABLE,
	TRUTH_VARIABLE,
} from "@/config/ai";
import { swrKeyMap } from "@/config/swr";
import { addTryToSoup, createSoup, getDbSoupById, setSoup } from "@/db";
import {
	type AiSettings,
	type DbSoup,
	type LocaleCode,
	type Soup,
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
		status: "unresolved",
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

const CreateSolutionResultSchema = z.object({
	solution: z.string(),
	score: z.number().int().min(0).max(100),
});

type CreateSolutionParams = {
	soup: Soup;
	userSolution: string;
	aiSettings: AiSettings;
	locale: LocaleCode;
	signal?: AbortSignal;
};

export const createSolutionFromAI = async ({
	soup,
	userSolution,
	aiSettings,
	locale,
	signal,
}: CreateSolutionParams) => {
	const provider = createProvider(aiSettings);

	if (!userSolution) {
		throw new Error("User solution is required");
	}

	const judgePrompt = judgeSolutionPrompt.replaceAll(
		TRUTH_VARIABLE,
		soup.truth,
	);

	const judgeResult = await generateText({
		model: provider.languageModel(aiSettings.model),
		system: judgePrompt,
		messages: [
			{
				role: "user",
				content: judgeSolutionPromptContext
					.replaceAll(TRUTH_VARIABLE, soup.truth)
					.replaceAll(SOLUTION_VARIABLE, userSolution),
			},
		],
		abortSignal: signal,
	});

	const isCorrect = judgeResult.text.trim().toLowerCase() === "true";

	if (!isCorrect) {
		throw new Error("Solution is incorrect");
	}

	// 第二步：生成评分和总结
	// 格式化提问历史为可读文本
	const triesText = soup.tries
		.map((tryItem, index) => {
			if (tryItem.status === "valid") {
				return `${index + 1}. Q: ${tryItem.question}\n   A: ${tryItem.response} (${tryItem.reason})`;
			}
			return `${index + 1}. Q: ${tryItem.question}\n   A: invalid (${tryItem.reason})`;
		})
		.join("\n");

	const evaluatePrompt = evaluateSolutionPrompt.replaceAll(
		LOCALE_VARIABLE,
		locale,
	);

	const evaluateResult = await generateText({
		model: provider.languageModel(aiSettings.model),
		system: evaluatePrompt,
		messages: [
			{
				role: "user",
				content: evaluateSolutionPromptContext
					.replaceAll(TRUTH_VARIABLE, soup.truth)
					.replaceAll(SOLUTION_VARIABLE, userSolution)
					.replaceAll(TRIES_VARIABLE, triesText),
			},
		],
		abortSignal: signal,
	});

	const parsedJson = safeParseJson(evaluateResult.text);
	if (!parsedJson.success) {
		throw new Error(`Failed to parse JSON: ${parsedJson.error}`);
	}

	const parsedSolution = CreateSolutionResultSchema.safeParse(parsedJson.data);
	if (!parsedSolution.success) {
		return;
	}

	const solutionData = parsedSolution.data;

	// 从数据库读取原始 soup 以获取 createAt 字段
	const dbSoup = await getDbSoupById(soup.id);
	if (!dbSoup) {
		throw new Error(`Soup with id ${soup.id} not found in database`);
	}

	// 更新数据库中的 soup 状态
	await setSoup({
		id: soup.id,
		title: soup.title,
		surface: soup.surface,
		truth: soup.truth,
		status: "resolved",
		solution: solutionData.solution,
		score: solutionData.score,
		createAt: dbSoup.createAt,
		updateAt: new Date().toISOString(),
	} satisfies DbSoup);

	// 更新 SWR 缓存
	mutate(swrKeyMap.soups);

	return solutionData;
};
