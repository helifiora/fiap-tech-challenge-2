import {
  ControllerResponse,
  type ControllerRequest,
} from "#application/controller.ts";

import { authorSchema } from "./author_schema.ts";

import { AuthorUseCaseFactory } from "#application/usecase/author/_factory.ts";

export class AuthorController {
  #useCases: AuthorUseCaseFactory;

  constructor(authorFac: AuthorUseCaseFactory) {
    this.#useCases = authorFac;
  }

  async signIn(request: ControllerRequest): Promise<ControllerResponse> {
    const body = request.body(authorSchema.signIn);

    const useCase = this.#useCases.getAuthor();

    const result = await useCase.handle({
      email: body.email,
      password: body.password,
    });

    return ControllerResponse.ok({ token: result.token });
  }

  async signUp(request: ControllerRequest): Promise<ControllerResponse> {
    const body = request.body(authorSchema.signUp);

    const useCase = this.#useCases.createAuthor();

    const result = await useCase.handle({
      username: body.username,
      email: body.email,
      password: body.password,
    });

    return ControllerResponse.created({
      id: result.id,
      token: result.token,
    });
  }
}
