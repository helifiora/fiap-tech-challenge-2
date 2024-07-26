import type { KyselyDatabase } from "#infrastructure/kysely_db.ts";
import { KyselyMigrator } from "#infrastructure/kysely_migrator.ts";
import { Kysely, PostgresDialect } from "kysely";
import pg from "pg";

type Output = [db: KyselyDatabase, migrator: KyselyMigrator];

export async function setupKyselyDb(connectionString: string): Promise<Output> {
  const dialect = new PostgresDialect({
    pool: new pg.Pool({ connectionString }),
  });

  const db = new Kysely({ dialect }) as KyselyDatabase;
  const migrator = new KyselyMigrator(db);
  return [db, migrator];
}
