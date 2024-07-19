import { env } from "node:process";
import { parseEnv } from "./main_environment.ts";
import { KyselyRepoFactory } from "#infrastructure/repo_adapter/_factory.ts";
import { FileMigrationProvider, Migrator } from "kysely";
import fs from "node:fs/promises";
import path from "node:path";

const environment = parseEnv(env);
const dbFac = new KyselyRepoFactory(environment.database);

const migrator = new Migrator({
  db: dbFac.connection,
  provider: new FileMigrationProvider({
    fs,
    path,
    migrationFolder: path.resolve("src", "infrastructure", "migration"),
  }),
});

console.log(await migrator.migrateToLatest());
