import { env } from "node:process";
import { parseEnv } from "./main_environment.ts";
import { UseRouteConfig } from "./main_routes.ts";

import { KyselyRepoFactory } from "#infrastructure/repo_adapter/_factory.ts";
import { JsonwebtokenJwtService } from "#infrastructure/jsonwebtoken_jwt_service.ts";
import { ExpressServer } from "#infrastructure/server_adapter/express_server.ts";

import { UseCaseFactory } from "#application/usecase/_factory.ts";
import { applyMigration } from "./main_migration.ts";

const environment = parseEnv(env);

const jwtService = new JsonwebtokenJwtService(environment.secret);

const repoFac = new KyselyRepoFactory(environment.database);
await applyMigration(repoFac.connection);

const useCaseFac = new UseCaseFactory(repoFac, jwtService);

const server = new ExpressServer(jwtService);
server.use(new UseRouteConfig(useCaseFac));
server.listen(environment.port);
