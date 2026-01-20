import z from "zod";

export const TryResponseSchema = z.enum(["yes", "no", "unrelated"]);

export type TryResponse = z.infer<typeof TryResponseSchema>;

const baseDbFields = {
	id: z.string(),
	updateAt: z.iso.datetime(),
	createAt: z.iso.datetime(),
};

const baseTry = {
	id: z.string(),
	soupId: z.string(),
	createAt: z.iso.datetime(),
	question: z.string(),
	reason: z.string(),
};

export const DbTrySchema = z.discriminatedUnion("status", [
	z.object({
		status: z.literal("valid"),
		...baseTry,
		...baseDbFields,
		response: TryResponseSchema,
	}),
	z.object({
		status: z.literal("invalid"),
		...baseTry,
		...baseDbFields,
		updateAt: z.iso.datetime(),
	}),
]);

export type DbTry = z.infer<typeof DbTrySchema>;

export const TrySchema = z.discriminatedUnion("status", [
	z.object({
		status: z.literal("valid"),
		...baseTry,
		response: TryResponseSchema,
	}),
	z.object({
		status: z.literal("invalid"),
		...baseTry,
	}),
]);

export type Try = z.infer<typeof TrySchema>;

const _baseSoup = {
	id: z.string(),
	title: z.string(),
	/* 汤面 */
	surface: z.string(),
	/* 汤底 */
	truth: z.string(),
};

export const BaseDbSoupSchema = z.discriminatedUnion("status", [
	z.object({
		status: z.literal("unresolved"),
		..._baseSoup,
	}),
	z.object({
		status: z.literal("resolved"),
		..._baseSoup,
		solution: z.string(),
		score: z.number(),
		explanation: z.string(),
	}),
	z.object({
		status: z.literal("given_up"),
		..._baseSoup,
		explanation: z.string(),
	}),
]);

export type BaseDbSoup = z.infer<typeof BaseDbSoupSchema>;

export const DbSoupSchema = z.discriminatedUnion("status", [
	z.object({
		status: z.literal("unresolved"),
		..._baseSoup,
		...baseDbFields,
	}),
	z.object({
		status: z.literal("resolved"),
		..._baseSoup,
		...baseDbFields,
		solution: z.string(),
		score: z.number(),
		explanation: z.string(),
	}),
	z.object({
		status: z.literal("given_up"),
		..._baseSoup,
		...baseDbFields,
		explanation: z.string(),
	}),
]);

export type DbSoup = z.infer<typeof DbSoupSchema>;

export const SoupSchema = z.discriminatedUnion("status", [
	z.object({
		status: z.literal("unresolved"),
		id: z.string(),
		title: z.string(),
		/* 汤面 */
		surface: z.string(),
		/* 汤底 */
		truth: z.string(),
		tries: z.array(TrySchema),
	}),
	z.object({
		status: z.literal("resolved"),
		id: z.string(),
		title: z.string(),
		surface: z.string(),
		truth: z.string(),
		tries: z.array(TrySchema),
		solution: z.string(),
		score: z.number(),
		explanation: z.string(),
	}),
	z.object({
		status: z.literal("given_up"),
		id: z.string(),
		title: z.string(),
		surface: z.string(),
		truth: z.string(),
		tries: z.array(TrySchema),
		explanation: z.string(),
	}),
]);

export type Soup = z.infer<typeof SoupSchema>;
