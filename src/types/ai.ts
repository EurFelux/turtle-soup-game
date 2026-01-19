import type { InferUITools, ToolSet, UIMessage } from "ai";
import * as z from "zod";

const _ProviderTypeSchema = z.enum([
	"anthropic",
	"openai-chat",
	"openai-responses",
	"gemini",
]);

export type ProviderType = z.infer<typeof _ProviderTypeSchema>;

export const AiSettingsSchema = z.object({
	/* Provider Name, Primary Key */
	provider: z.string(),
	/* Provider Type */
	providerType: _ProviderTypeSchema,
	/* Model Name */
	model: z.string(),
	/* API Key */
	apiKey: z.string(),
	/* Base URL */
	baseUrl: z.string(),
});

export type AiSettings = z.infer<typeof AiSettingsSchema>;

const _metadataSchema = z.object({
	timestamp: z.iso.datetime(),
});

type MyMetadata = z.infer<typeof _metadataSchema>;

const _dataPartSchema = z.object({});

type MyDataPart = z.infer<typeof _dataPartSchema>;

const _tools = {} satisfies ToolSet;

type MyTools = InferUITools<typeof _tools>;

export type MyUIMessage = UIMessage<MyMetadata, MyDataPart, MyTools>;
