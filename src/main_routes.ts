import type { UseCaseFactory } from "#application/usecase/_factory.ts";
import type { AuthorUseCaseFactory } from "#application/usecase/author/_factory.ts";
import type { PostUseCaseFactory } from "#application/usecase/post/_factory.ts";
import type {
  Server,
  ControllerRouter,
  ServerConfig,
} from "#application/server.ts";

import {
  AuthorController,
  PostController,
} from "#application/controller/mod.ts";

export class UseRouteConfig implements ServerConfig {
  #authorFac: AuthorUseCaseFactory;
  #postFac: PostUseCaseFactory;

  constructor(useCaseFactory: UseCaseFactory) {
    this.#authorFac = useCaseFactory.authorFac;
    this.#postFac = useCaseFactory.postFac;
  }

  handle(server: Server): void {
    server.addRoute("/authors", (route) => this.#includeAuthor(route));
    server.addRoute("/posts", (route) => this.#includePost(route));
  }

  #includeAuthor(route: ControllerRouter): void {
    const ctrl = new AuthorController(this.#authorFac);
    route.post("/signin", (req) => ctrl.signIn(req), { anonymous: true });
    route.post("/signup", (req) => ctrl.signUp(req), { anonymous: true });
  }

  #includePost(route: ControllerRouter): void {
    const ctrl = new PostController(this.#postFac);
    route.get("/", (req) => ctrl.index(req), { anonymous: true });
    route.get("/search", (req) => ctrl.index(req), { anonymous: true });
    route.get("/:id", (req) => ctrl.show(req), { anonymous: true });
    route.post("/", (req) => ctrl.create(req));
    route.put("/:id", (req) => ctrl.update(req));
    route.delete("/:id", (req) => ctrl.delete(req));
  }
}
