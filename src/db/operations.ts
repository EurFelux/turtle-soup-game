/**
 * Database Operations Module
 *
 * This module provides the public API for all database operations.
 * External modules should only import functions from @/db, direct access to db instance is prohibited.
 *
 * Usage example:
 * ```ts
 * import { createSoup, getSoupById } from "@/db";
 * ```
 */

import {
	type BaseDbSoup,
	type DbSoup,
	DbSoupSchema,
	type Soup,
	type Try,
	TrySchema,
} from "@/types";
import db from "./database";

// ==================== Soup CRUD Operations ====================

/**
 * Create a new soup puzzle
 */
export async function createSoup(soup: BaseDbSoup): Promise<string> {
	// Runtime validation with Zod
	const dbSoup = {
		...soup,
		createAt: new Date().toISOString(),
		updateAt: new Date().toISOString(),
	} satisfies DbSoup;
	const validatedSoup = DbSoupSchema.parse(dbSoup);
	return await db.soups.add(validatedSoup);
}

/**
 * Bulk create soup puzzles
 */
export async function createSoups(soups: BaseDbSoup[]): Promise<string[]> {
	// Runtime validation with Zod
	const dbSoups = soups.map((soup) => ({
		...soup,
		createAt: new Date().toISOString(),
		updateAt: new Date().toISOString(),
	}));
	const validatedSoups = dbSoups.map((soup) => DbSoupSchema.parse(soup));
	return await db.soups.bulkAdd(validatedSoups, { allKeys: true });
}

/**
 * Get soup puzzle by ID
 */
export async function getDbSoupById(id: string): Promise<DbSoup | undefined> {
	return await db.soups.get(id);
}

/**
 * Get all soup puzzles
 */
export async function getAllDbSoups(): Promise<DbSoup[]> {
	return await db.soups.toArray();
}

/**
 * Update soup puzzle
 */
export async function updateSoup(
	id: string,
	changes: Partial<Omit<DbSoup, "id">>,
): Promise<number> {
	// Runtime validation with Zod (partial schema)
	const validatedChanges = DbSoupSchema.partial()
		.omit({ id: true })
		.parse(changes);
	return await db.soups.update(id, validatedChanges);
}

/**
 * Delete soup puzzle
 */
export async function deleteSoup(id: string): Promise<void> {
	await db.soups.delete(id);
}

/**
 * Delete all soup puzzles
 */
export async function deleteAllSoups(): Promise<void> {
	await db.soups.clear();
}

// ==================== Try CRUD Operations ====================

/**
 * Create a new try record
 */
export async function createTry(tryRecord: Try): Promise<string> {
	// Runtime validation with Zod
	const validatedTry = TrySchema.parse(tryRecord);
	return await db.tries.add(validatedTry);
}

/**
 * Bulk create try records
 */
export async function createTries(tries: Try[]): Promise<string[]> {
	// Runtime validation with Zod
	const validatedTries = tries.map((tryRecord) => TrySchema.parse(tryRecord));
	return await db.tries.bulkAdd(validatedTries, { allKeys: true });
}

/**
 * Get try record by ID
 */
export async function getTryById(id: string): Promise<Try | undefined> {
	return await db.tries.get(id);
}

/**
 * Get all try records
 */
export async function getAllTries(): Promise<Try[]> {
	return await db.tries.toArray();
}

/**
 * Get try records by date range
 */
export async function getTriesByDateRange(
	startDate: string,
	endDate: string,
): Promise<Try[]> {
	return await db.tries
		.filter((tryRecord) => {
			return tryRecord.createAt >= startDate && tryRecord.createAt <= endDate;
		})
		.toArray();
}

/**
 * Update try record
 */
export async function updateTry(
	id: string,
	changes: Partial<Omit<Try, "id">>,
): Promise<number> {
	// NOTE: runtime check is passed bacause discrinimatedUnion doesn's support partial method
	return await db.tries.update(id, changes);
}

/**
 * Delete try record
 */
export async function deleteTry(id: string): Promise<void> {
	await db.tries.delete(id);
}

/**
 * Bulk delete try records
 */
export async function deleteTries(ids: string[]): Promise<void> {
	await db.tries.bulkDelete(ids);
}

/**
 * Delete all try records
 */
export async function deleteAllTries(): Promise<void> {
	await db.tries.clear();
}

// ==================== Relational Query Operations ====================

/**
 * Get soup puzzle with all its try records
 */
export async function getSoupById(soupId: string): Promise<Soup | null> {
	const dbSoup = await getDbSoupById(soupId);
	if (!dbSoup) return null;

	const tries = await db.tries.bulkGet(dbSoup.tryIds);
	const { tryIds: _, ...soup } = dbSoup;
	return {
		...soup,
		tries: tries.filter((t): t is Try => t !== undefined),
	};
}

/**
 * Get all soup puzzles with their try records
 */
export async function getAllSoups(): Promise<Soup[]> {
	const dbSoups = await getAllDbSoups();
	const allTries = await db.tries.toArray();

	// Create a map of tries by ID for quick lookup
	const triesMap = new Map<string, Try>();
	for (const tryRecord of allTries) {
		triesMap.set(tryRecord.id, tryRecord);
	}

	// Convert DbSoup to Soup by replacing tryIds with actual Try objects
	return dbSoups.map((dbSoup): Soup => {
		const tries = dbSoup.tryIds
			.map((tryId) => triesMap.get(tryId))
			.filter((tryRecord): tryRecord is Try => tryRecord !== undefined);

		return {
			id: dbSoup.id,
			title: dbSoup.title,
			surface: dbSoup.surface,
			truth: dbSoup.truth,
			tries,
		};
	});
}

/**
 * Add a try record to a soup puzzle
 */
export async function addTryToSoup(
	soupId: string,
	tryRecord: Try,
): Promise<void> {
	// Runtime validation with Zod
	const validatedTry = TrySchema.parse(tryRecord);

	// Add try record
	await createTry(validatedTry);

	// Update soup's tryIds
	const soup = await getDbSoupById(soupId);
	if (soup) {
		await updateSoup(soupId, {
			tryIds: [...soup.tryIds, validatedTry.id],
		});
	}
}

/**
 * Remove a try record from a soup puzzle
 */
export async function removeTryFromSoup(
	soupId: string,
	tryId: string,
): Promise<void> {
	// Delete try record
	await deleteTry(tryId);

	// Update soup's tryIds
	const soup = await getDbSoupById(soupId);
	if (soup) {
		await updateSoup(soupId, {
			tryIds: soup.tryIds.filter((id) => id !== tryId),
		});
	}
}
