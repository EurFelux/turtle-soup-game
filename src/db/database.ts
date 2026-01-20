/**
 * Database Instance Definition
 *
 * This file is for internal use within the db module only. External imports are prohibited.
 * External modules should use the operation functions exported from @/db.
 */

import Dexie, { type EntityTable } from "dexie";
import type { DbSoup, DbTry } from "@/types";

// Create database instance (not exported, for internal use only)
const db = new Dexie("Turtle") as Dexie & {
	soups: EntityTable<DbSoup, "id">;
	tries: EntityTable<DbTry, "id">;
};

// Define database version and table schemas
db.version(1).stores({
	soups: "id, createAt, updateAt",
	tries: "id, soupId, createAt, updateAt",
});

// Version 2: Add hints field to soups
db.version(2)
	.stores({
		soups: "id, createAt, updateAt",
		tries: "id, soupId, createAt, updateAt",
	})
	.upgrade((tx) => {
		// Add hints field to existing soups
		return tx
			.table("soups")
			.toCollection()
			.modify((soup) => {
				if (!soup.hints) {
					soup.hints = [];
				}
			});
	});

// For internal use within db module only
export default db;
