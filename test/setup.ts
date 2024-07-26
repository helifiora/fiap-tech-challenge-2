import { GlobalSetupContext } from "vitest/node";
import {
  PostgreSqlContainer,
  StartedPostgreSqlContainer,
} from "@testcontainers/postgresql";

class Container {
  #container: StartedPostgreSqlContainer | null = null;

  async connection(): Promise<string> {
    if (this.#container === null) {
      this.#container = await this.#start();
    }

    return this.#container.getConnectionUri();
  }

  async close(): Promise<void> {
    if (this.#container !== null) {
      await this.#container.stop();
    }
  }

  async #start(): Promise<StartedPostgreSqlContainer> {
    return await new PostgreSqlContainer().start();
  }
}

export default async ({ provide }: GlobalSetupContext) => {
  console.log("Gerando Banco de Dados de Teste...");
  const container = new Container();
  const connection = await container.connection();
  provide("container", connection);
  provide("secret", "batman");
  return async () => await container.close();
};

declare module "vitest" {
  export interface ProvidedContext {
    container: string;
    secret: string;
  }
}
