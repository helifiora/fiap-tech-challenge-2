import {
  ControllerRequest,
  ControllerResponse,
} from "#application/controller.ts";

import { authorSchema } from "./author_schema.ts";

import { CreateAuthor } from "#application/usecase/author/create_author.ts";
import { GetAuthor } from "#application/usecase/author/get_author.ts";

export class AuthorController {
  static async signIn(
    request: ControllerRequest,
    useCase: GetAuthor,
  ): Promise<ControllerResponse> {
    const body = request.body(authorSchema.signIn);

    const result = await useCase.handle({
      email: body.email,
      password: body.password,
    });

    return ControllerResponse.ok({ token: result.token });
  }

  static async signUp(
    request: ControllerRequest,
    useCase: CreateAuthor,
  ): Promise<ControllerResponse> {
    const body = request.body(authorSchema.signUp);

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
