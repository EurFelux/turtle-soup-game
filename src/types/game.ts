import z from "zod";

export const TryResponseSchema = z.enum(["yes", "no", "unrelated"]);

export type TryResponse = z.infer<typeof TryResponseSchema>;

const baseDbFields = {
	id: z.string(),
	updateAt: z.iso.datetime(),
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
		updateAt: z.iso.datetime(),
		response: TryResponseSchema,
	}),
	z.object({
		status: z.literal("invalid"),
		...baseTry,
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

export const BaseDbSoupSchema = z.object(_baseSoup);

export type BaseDbSoup = z.infer<typeof BaseDbSoupSchema>;

export const DbSoupSchema = z.object({
	..._baseSoup,
	createAt: z.iso.datetime(),
	updateAt: z.iso.datetime(),
});

export type DbSoup = z.infer<typeof DbSoupSchema>;

export const SoupSchema = z.object({
	id: z.string(),
	title: z.string(),
	/* 汤面 */
	surface: z.string(),
	/* 汤底 */
	truth: z.string(),
	tries: z.array(TrySchema),
});

export type Soup = z.infer<typeof SoupSchema>;
