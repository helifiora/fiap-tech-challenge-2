import type { Author } from "#domain/model/author.ts";
import { BaseSchema, type InferOutput, parse, ValiError } from "valibot";
import { BaseError, BaseErrorEnum } from "#utils/error.ts";

export type ControllerHandler = (
  request: ControllerRequest,
) => Promise<ControllerResponse>;

type HandlerRequestParams = {
  body?: object;
  params?: Record<string, string>;
  queries?: Record<string, string>;
  headers?: Record<string, string>;
  user?: Author;
};

export class ControllerRequest {
  #body: object;
  #params: Record<string, string>;
  #queries: Record<string, string>;
  #headers: Record<string, string>;

  user: Author | null;

  constructor(params: HandlerRequestParams) {
    this.#body = params.body ?? {};
    this.#params = params.params ?? {};
    this.#queries = params.queries ?? {};
    this.#headers = params.headers ?? {};
    this.user = params.user ?? null;
  }

  body<T extends BaseSchema<any, any, any>>(schema: T): InferOutput<T> {
    try {
      return parse(schema, this.#body);
    } catch (e) {
      throw new ControllerInvalidBodyError((e as ValiError<any>).message);
    }
  }

  param(key: string): string {
    const result = this.#params[key] ?? null;
    if (result === null) {
      throw new ControllerNoParamError(key);
    }

    return result;
  }

  query(key: string): string | null {
    return this.#queries[key] ?? null;
  }

  header(key: string): string | null {
    return this.#headers[key] ?? null;
  }
}

export class ControllerResponse {
  status: number;
  content: any;

  constructor(content: any, status: number = 200) {
    this.content = content;
    this.status = status;
  }

  static ok(content: any): ControllerResponse {
    return new ControllerResponse(content, 200);
  }

  static badRequest(content: any): ControllerResponse {
    return new ControllerResponse({ error: content }, 400);
  }

  static created(content: any): ControllerResponse {
    return new ControllerResponse(content, 201);
  }

  static noContent(): ControllerResponse {
    return new ControllerResponse(null, 204);
  }
}

export class ControllerInvalidBodyError extends BaseError {
  constructor(message: string) {
    super(BaseErrorEnum.validation, message);
  }
}

export class ControllerNoParamError extends BaseError {
  constructor(message: string) {
    super(BaseErrorEnum.validation, message);
  }
}
