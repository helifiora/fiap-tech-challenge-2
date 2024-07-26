import { env } from "node:process";
import { parseEnv } from "./main_environment.ts";
import {
  FileMigrationProvider,
  Kysely,
  Migrator,
  PostgresDialect,
} from "kysely";
import fs from "node:fs/promises";
import path from "node:path";
import pg from "pg";

const environment = parseEnv(env);

const dialect = new PostgresDialect({
  pool: new pg.Pool({ connectionString: environment.database }),
});

const db = new Kysely({ dialect });

const migrator = new Migrator({
  db,
  provider: new FileMigrationProvider({
    fs,
    path,
    migrationFolder: path.resolve("migrations"),
  }),
});

console.log(await migrator.migrateToLatest());
