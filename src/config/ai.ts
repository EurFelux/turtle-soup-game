import type { AiSettings } from "@/types/ai";

export const defaultAiSettings = {
	provider: "",
	providerType: "openai-chat",
	model: "",
	apiKey: "",
	baseUrl: "",
} as const satisfies AiSettings;
