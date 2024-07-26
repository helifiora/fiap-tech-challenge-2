import { FileMigrationProvider, Migrator } from "kysely";
import { KyselyDatabase } from "./kysely_db.ts";
import fs from "node:fs/promises";
import path from "node:path";

export class KyselyMigrator {
  #migrator: Migrator;

  constructor(db: KyselyDatabase) {
    this.#migrator = new Migrator({
      db,
      provider: new FileMigrationProvider({
        fs,
        path,
        migrationFolder: path.resolve("migrations"),
      }),
    });
  }

  async toLatest(): Promise<void> {
    const { error } = await this.#migrator.migrateToLatest();
    if (error) {
      console.error(error);
    }
  }

  async toInitial(): Promise<void> {
    const { error } = await this.#migrator.migrateDown();
    if (error) {
      console.error(error);
    }
  }
}
