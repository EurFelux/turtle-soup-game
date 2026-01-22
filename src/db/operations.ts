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
	type DbTry,
	type NotCreatingSoup,
	type Try,
	TrySchema,
} from "@/types";
import db from "./database";

// ==================== Soup CRUD Operations ====================

/**
 * Create a new soup puzzle
 */
export async function createSoup(soup: BaseDbSoup): Promise<NotCreatingSoup> {
	// Runtime validation with Zod
	const dbSoup = {
		...soup,
		createAt: new Date().toISOString(),
		updateAt: new Date().toISOString(),
	} satisfies DbSoup;
	const validatedSoup = DbSoupSchema.parse(dbSoup);
	const id = await db.soups.add(validatedSoup);
	const created = await getSoupById(id);
	if (!created) throw new Error(`Soup with id ${id} not found`);
	return created;
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
	return db.soups.update(id, changes);
}

/**
 * Set soup puzzle
 */
export async function setSoup(changes: DbSoup): Promise<string> {
	return db.soups.put(changes);
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
 * Get tries by soup ID
 */
export async function getTriesBySoupId(soupId: string): Promise<DbTry[]> {
	return await db.tries.where("soupId").equals(soupId).toArray();
}

/**
 * Get soup puzzle with all its try records
 */
export async function getSoupById(
	soupId: string,
): Promise<NotCreatingSoup | null> {
	const dbSoup = await getDbSoupById(soupId);
	if (!dbSoup) return null;

	const dbTries = await getTriesBySoupId(soupId);

	// Convert DbTry to Try by removing database-specific fields
	const tries: Try[] = dbTries.map(({ updateAt: _1, ...tryData }) => tryData);

	if (dbSoup.status === "resolved") {
		return {
			id: dbSoup.id,
			title: dbSoup.title,
			surface: dbSoup.surface,
			truth: dbSoup.truth,
			hints: dbSoup.hints,
			tries,
			status: "resolved",
			solution: dbSoup.solution,
			score: dbSoup.score,
			explanation: dbSoup.explanation,
		};
	} else if (dbSoup.status === "unresolved") {
		return {
			id: dbSoup.id,
			title: dbSoup.title,
			surface: dbSoup.surface,
			truth: dbSoup.truth,
			hints: dbSoup.hints,
			tries,
			status: "unresolved",
		};
	} else if (dbSoup.status === "given_up") {
		return {
			id: dbSoup.id,
			title: dbSoup.title,
			surface: dbSoup.surface,
			truth: dbSoup.truth,
			hints: dbSoup.hints,
			tries,
			status: "given_up",
			explanation: dbSoup.explanation,
		};
	} else {
		throw new Error("Unexpected branch.");
	}
}

/**
 * Get all soup puzzles with their try records
 */
export async function getAllSoups(): Promise<NotCreatingSoup[]> {
	const dbSoups = await getAllDbSoups();
	const allDbTries = await db.tries.toArray();

	// Group tries by soupId for quick lookup
	const triesBySoupId = new Map<string, Try[]>();
	for (const dbTry of allDbTries) {
		const { updateAt: _1, ...tryData } = dbTry;
		const tries = triesBySoupId.get(dbTry.soupId) || [];
		tries.push(tryData);
		triesBySoupId.set(dbTry.soupId, tries);
	}

	// Convert DbSoup to Soup with associated tries
	return dbSoups.map((dbSoup): NotCreatingSoup => {
		if (dbSoup.status === "resolved") {
			return {
				id: dbSoup.id,
				title: dbSoup.title,
				surface: dbSoup.surface,
				truth: dbSoup.truth,
				hints: dbSoup.hints,
				tries: triesBySoupId.get(dbSoup.id) || [],
				status: "resolved",
				solution: dbSoup.solution,
				score: dbSoup.score,
				explanation: dbSoup.explanation,
			};
		} else if (dbSoup.status === "unresolved") {
			return {
				id: dbSoup.id,
				title: dbSoup.title,
				surface: dbSoup.surface,
				truth: dbSoup.truth,
				hints: dbSoup.hints,
				tries: triesBySoupId.get(dbSoup.id) || [],
				status: "unresolved",
			};
		} else if (dbSoup.status === "given_up") {
			return {
				id: dbSoup.id,
				title: dbSoup.title,
				surface: dbSoup.surface,
				truth: dbSoup.truth,
				hints: dbSoup.hints,
				tries: triesBySoupId.get(dbSoup.id) || [],
				status: "given_up",
				explanation: dbSoup.explanation,
			};
		} else {
			throw new Error("Unexpected branch.");
		}
	});
}

/**
 * Add a try record to a soup puzzle (atomic operation)
 */
export async function addTryToSoup(
	soupId: string,
	tryRecord: Try,
): Promise<void> {
	// Runtime validation with Zod
	const validatedTry = TrySchema.parse(tryRecord);

	// Use transaction to ensure atomicity
	await db.transaction("rw", [db.soups, db.tries], async () => {
		// Verify soup exists within transaction
		const soup = await db.soups.get(soupId);
		if (!soup) {
			throw new Error(`Soup with id ${soupId} does not exist`);
		}

		// Add try record with database fields
		const dbTry: DbTry = {
			...validatedTry,
			createAt: new Date().toISOString(),
			updateAt: new Date().toISOString(),
		};
		await db.tries.add(dbTry);
	});
}

/**
 * Remove a try record from a soup puzzle (atomic operation)
 */
export async function removeTryFromSoup(
	soupId: string,
	tryId: string,
): Promise<void> {
	// Use transaction to ensure atomicity
	await db.transaction("rw", [db.tries], async () => {
		// Verify the try exists and belongs to this soup
		const tryRecord = await db.tries.get(tryId);
		if (!tryRecord) {
			throw new Error(`Try ${tryId} does not exist`);
		}
		if (tryRecord.soupId !== soupId) {
			throw new Error(`Try ${tryId} does not belong to soup ${soupId}`);
		}

		// Delete try record
		await db.tries.delete(tryId);
	});
}

/**
 * Delete soup puzzle and all its try records (atomic cascade delete)
 */
export async function deleteSoupWithTries(id: string): Promise<void> {
	// Use transaction to ensure atomicity
	await db.transaction("rw", [db.soups, db.tries], async () => {
		// Verify soup exists
		const soup = await db.soups.get(id);
		if (!soup) {
			throw new Error(`Soup with id ${id} does not exist`);
		}

		// Delete all associated tries
		await db.tries.where("soupId").equals(id).delete();

		// Delete the soup
		await db.soups.delete(id);
	});
}
