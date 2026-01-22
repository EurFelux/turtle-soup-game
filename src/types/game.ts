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

const HintsSchema = z.array(z.string().min(1).max(30));

const baseSoup = {
	id: z.uuidv4(),
	title: z.string(),
	/* 汤面 */
	surface: z.string(),
	/* 汤底 */
	truth: z.string(),
	/* Hints */
	hints: HintsSchema,
	updateAt: z.iso.datetime(),
	createAt: z.iso.datetime(),
};

const _baseSoupSchema = z.object(baseSoup);

type BaseSoup = z.infer<typeof _baseSoupSchema>;

// Data Object
export const DbSoupSchema = z.discriminatedUnion("status", [
	z.object({
		status: z.literal("unresolved"),
		...baseSoup,
	}),
	z.object({
		status: z.literal("resolved"),
		...baseSoup,
		solution: z.string(),
		score: z.number(),
		explanation: z.string(),
	}),
	z.object({
		status: z.literal("given_up"),
		...baseSoup,
		explanation: z.string(),
	}),
]);

export type DbSoup = z.infer<typeof DbSoupSchema>;

const CreatingSoupSchema = z.object({
	id: z.uuidv4(),
	status: z.literal("creating"),
	createAt: z.iso.datetime(),
});

export type CreatingSoup = z.infer<typeof CreatingSoupSchema>;

const UnresolvedSoupSchema = z.object({
	status: z.literal("unresolved"),
	...baseSoup,
	tries: z.array(TrySchema),
});

export type UnresolvedSoup = z.infer<typeof UnresolvedSoupSchema>;

const ResolvedSoupSchema = z.object({
	status: z.literal("resolved"),
	...baseSoup,
	tries: z.array(TrySchema),
	solution: z.string(),
	score: z.number(),
	explanation: z.string(),
});

export type ResolvedSoup = z.infer<typeof ResolvedSoupSchema>;

const GivenUpSoupSchema = z.object({
	status: z.literal("given_up"),
	...baseSoup,
	tries: z.array(TrySchema),
	explanation: z.string(),
});

export type GivenUpSoup = z.infer<typeof GivenUpSoupSchema>;

export const SoupSchema = z.discriminatedUnion("status", [
	CreatingSoupSchema,
	UnresolvedSoupSchema,
	ResolvedSoupSchema,
	GivenUpSoupSchema,
]);

export type Soup = z.infer<typeof SoupSchema>;

export type NotCreatingSoup = UnresolvedSoup | ResolvedSoup | GivenUpSoup;

export type CreateSoupParams = Omit<
	BaseSoup,
	"createAt" | "updateAt" | "hints"
>;
