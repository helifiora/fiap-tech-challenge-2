import {
  ControllerRequest,
  ControllerResponse,
} from "#application/controller.ts";

import { CreatePost } from "#application/usecase/post/create_post.ts";
import { DeletePost } from "#application/usecase/post/delete_post.ts";
import { GetPostById } from "#application/usecase/post/get_post_by_id.ts";
import { GetPosts } from "#application/usecase/post/get_posts.ts";
import { UpdatePost } from "#application/usecase/post/update_post.ts";
import { postSchema } from "./post_schema.ts";

export class PostController {
  static async create(
    request: ControllerRequest,
    useCase: CreatePost,
  ): Promise<ControllerResponse> {
    const body = request.body(postSchema.create);

    const result = await useCase.handle({
      currentAuthorId: request.user!.id,
      content: body.content,
      title: body.title,
    });

    return ControllerResponse.created(result);
  }

  static async delete(
    request: ControllerRequest,
    useCase: DeletePost,
  ): Promise<ControllerResponse> {
    const id = request.param("id");
    await useCase.handle({ id });
    return ControllerResponse.noContent();
  }

  static async index(
    request: ControllerRequest,
    useCase: GetPosts,
  ): Promise<ControllerResponse> {
    const query = request.query("q") ?? undefined;
    const result = await useCase.handle({ query });
    return ControllerResponse.ok(result);
  }

  static async show(
    request: ControllerRequest,
    useCase: GetPostById,
  ): Promise<ControllerResponse> {
    const id = request.param("id");
    const result = await useCase.handle({ id });
    if (result === null) {
      return ControllerResponse.noContent();
    }

    return ControllerResponse.ok(result);
  }

  static async update(
    request: ControllerRequest,
    useCase: UpdatePost,
  ): Promise<ControllerResponse> {
    const body = request.body(postSchema.update);
    const id = request.param("id");
    if (body.id !== id) {
      return ControllerResponse.badRequest("Id incompatível");
    }

    const result = await useCase.handle({
      currentAuthorId: request.user!.id,
      content: body.content,
      title: body.title,
      id: id,
    });

    return ControllerResponse.created(result);
  }
}
