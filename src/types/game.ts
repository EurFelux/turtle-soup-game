import z from "zod";

export const TryResponseSchema = z.enum(["yes", "no", "unrelated"]);

export type TryResponse = z.infer<typeof TryResponseSchema>;

const baseTry = {
	id: z.string(),
	createAt: z.iso.datetime(),
	question: z.string(),
};

export const TrySchema = z.discriminatedUnion("status", [
	z.object({
		status: z.literal("valid"),
		...baseTry,
		response: TryResponseSchema,
	}),
	z.object({
		status: z.literal("invalid"),
		...baseTry,
		reason: z.string(),
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
	tryIds: z.array(z.string()),
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
