import {
  ControllerResponse,
  ControllerRequest,
} from "#application/controller.ts";

import { postSchema } from "./post_schema.ts";

import { PostUseCaseFactory } from "#application/usecase/post/_factory.ts";

export class PostController {
  #useCases: PostUseCaseFactory;

  constructor(useCases: PostUseCaseFactory) {
    this.#useCases = useCases;
  }

  async create(request: ControllerRequest): Promise<ControllerResponse> {
    const body = request.body(postSchema.create);

    const useCase = this.#useCases.createPost();

    const result = await useCase.handle({
      currentAuthorId: request.user!.id,
      content: body.content,
      title: body.title,
    });

    return ControllerResponse.created(result);
  }

  async delete(request: ControllerRequest): Promise<ControllerResponse> {
    const id = request.param("id");
    const useCase = this.#useCases.deletePost();
    await useCase.handle({
      id,
      currentAuthorId: request.user!.id,
    });

    return ControllerResponse.noContent();
  }

  async index(request: ControllerRequest): Promise<ControllerResponse> {
    const query = request.query("q") ?? undefined;
    const useCase = this.#useCases.getPosts();
    const result = await useCase.handle({ query });
    return ControllerResponse.ok(result);
  }

  async show(request: ControllerRequest): Promise<ControllerResponse> {
    const id = request.param("id");
    const useCase = this.#useCases.getPostById();
    const result = await useCase.handle({ id });
    if (result === null) {
      return ControllerResponse.noContent();
    }

    return ControllerResponse.ok(result);
  }

  async update(request: ControllerRequest): Promise<ControllerResponse> {
    const body = request.body(postSchema.update);
    const id = request.param("id");
    if (body.id !== id) {
      return ControllerResponse.badRequest("Id incompatível");
    }

    const useCase = this.#useCases.updatePost();
    const result = await useCase.handle({
      currentAuthorId: request.user!.id,
      content: body.content,
      title: body.title,
      id: id,
    });

    return ControllerResponse.ok(result);
  }
}
