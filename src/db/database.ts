/**
 * Database Instance Definition
 *
 * This file is for internal use within the db module only. External imports are prohibited.
 * External modules should use the operation functions exported from @/db.
 */

import Dexie, { type EntityTable } from "dexie";
import type { DbSoup, Try } from "@/types";

// Create database instance (not exported, for internal use only)
const db = new Dexie("Turtle") as Dexie & {
	soups: EntityTable<DbSoup, "id">;
	tries: EntityTable<Try, "id">;
};

// Define database version and table schemas
db.version(1).stores({
	soups: "id",
	tries: "id, score",
});

// For internal use within db module only
export default db;
