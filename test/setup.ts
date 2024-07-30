import { GlobalSetupContext } from "vitest/node";
import {
  PostgreSqlContainer,
  StartedPostgreSqlContainer,
} from "@testcontainers/postgresql";
import * as console from "node:console";

export default async ({ provide }: GlobalSetupContext) => {
  console.log("Gerando Banco de Dados de Teste...");
  const container = await new PostgreSqlContainer().start();
  provide("container", container.getConnectionUri());
  return async () => {
    console.log("Limpando banco de dados de teste!");
    await container.stop();
  };
};

declare module "vitest" {
  export interface ProvidedContext {
    container: string;
    secret: string;
  }
}
