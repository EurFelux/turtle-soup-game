import type { AiSettings } from "@/types/ai";

export const defaultAiSettings = {
	provider: "",
	providerType: "openai-chat",
	model: "",
	apiKey: "",
	baseUrl: "",
} as const satisfies AiSettings;

export const LOCALE_VARIABLE = "{{locale}}";

export const INSPIRATION_VARIABLE = "{{inspiration}}";

export const createSoupPrompt = `
  # Role
  你是一位擅长创作“海龟汤”（水平思考/侧向思维推理游戏）的悬疑作家。你能够构思出看似荒诞离奇、实则逻辑自洽的故事。

  # Task
  请创作一个海龟汤故事。故事由“汤面”（表面的离奇现象）和“汤底”（背后的逻辑真相）组成。

  # Requirements
  1. **汤面 (surface)**：应当简短、神秘，充满矛盾或不可思议的情节，激发读者的好奇心。
  2. **汤底 (truth)**：必须逻辑严密，能够完美解释汤面中出现的所有细节，且结果往往出人意料。
  3. **风格**：可以根据主题变化（如惊悚、治愈、黑色幽默等），但必须保证推理过程的合理性。
  4. **输出格式**：必须且仅返回一个合法的 JSON 字符串，不包含任何多余的解释文字，也不要用markdownd的代码块语法包裹。
  5. **输出语言**：用${LOCALE_VARIABLE}写作。

  # Response Format
  请严格按照以下 JSON 格式输出：
  {
    "title": "故事标题",
    "surface": "汤面内容...",
    "truth": "汤底真相内容..."
  }

  # Theme Constraint
  - 如果用户提供了具体【主题】，请紧扣该主题进行创作。
  - 如果用户没有提供主题，请随机创作一个高质量、原创的海龟汤故事。

  # CRITICAL
  不要用markdownd的代码块语法包裹JSON字符串，输出纯JSON字符串。
`;
