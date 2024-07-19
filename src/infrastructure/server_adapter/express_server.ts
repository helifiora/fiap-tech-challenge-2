import type {
  Server,
  ControllerAddRouterFn,
  ServerConfig,
} from "#application/server.ts";
import express, { type Express } from "express";
import { ExpressControllerRouter } from "./express_controller_router.ts";
import { ExpressAuthMiddleware } from "./express_controller_middlewares.ts";
import { JwtService } from "#application/jwt_service.ts";
import swagger from "swagger-ui-express";

import json from "../../swagger.json";

export class ExpressServer implements Server {
  #express: Express;

  #auth: ExpressAuthMiddleware;

  constructor(jwtService: JwtService) {
    this.#express = express();
    this.#express.use(express.json());
    this.#express.use("/swagger", swagger.serve, swagger.setup(json));
    this.#auth = new ExpressAuthMiddleware(jwtService);
  }

  use(config: ServerConfig): void {
    config.handle(this);
  }

  addRoute(path: string, fn: ControllerAddRouterFn): void {
    const router = new ExpressControllerRouter(this.#auth);
    fn(router);
    this.#express.use(path, router.router);
  }

  listen(port: number): void {
    this.#express.listen(port);
  }
}
