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
    route.post(
      "/signin",
      (req) => AuthorController.signIn(req, this.#authorFac.getAuthor()),
      { anonymous: true },
    );

    route.post(
      "/signup",
      (req) => AuthorController.signUp(req, this.#authorFac.createAuthor()),
      { anonymous: true },
    );
  }

  #includePost(route: ControllerRouter): void {
    route.get(
      "/",
      (req) => PostController.index(req, this.#postFac.getPosts()),
      { anonymous: true },
    );

    route.get(
      "/search",
      (req) => PostController.index(req, this.#postFac.getPosts()),
      { anonymous: true },
    );

    route.get(
      "/:id",
      (req) => PostController.show(req, this.#postFac.getPostById()),
      { anonymous: true },
    );

    route.post("/", (req) =>
      PostController.create(req, this.#postFac.createPost()),
    );

    route.put("/:id", (req) =>
      PostController.update(req, this.#postFac.updatePost()),
    );

    route.delete("/:id", (req) =>
      PostController.delete(req, this.#postFac.deletePost()),
    );
  }
}
