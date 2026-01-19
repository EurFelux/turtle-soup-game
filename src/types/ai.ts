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
