import {
  ControllerHandler,
  ControllerRequest,
  ControllerResponse,
} from "#application/controller.ts";
import { ControllerRouter, ControllerConfig } from "#application/server.ts";
import { BaseError, BaseErrorEnum } from "#utils/error.ts";
import { Handler, Request, Response, Router } from "express";
import { ExpressAuthMiddleware } from "./express_controller_middlewares.ts";

type RouteHandlerExpressFn = (req: Request, res: Response) => Promise<Response>;

export class ExpressControllerRouter implements ControllerRouter {
  router = Router();

  #auth: ExpressAuthMiddleware;

  constructor(auth: ExpressAuthMiddleware) {
    this.#auth = auth;
  }

  delete(path: string, fn: ControllerHandler, config?: ControllerConfig): void {
    this.router.delete(path, ...this.#middlewares(config), this.#handle(fn));
  }

  get(path: string, fn: ControllerHandler, config?: ControllerConfig): void {
    this.router.get(path, ...this.#middlewares(config), this.#handle(fn));
  }

  post(path: string, fn: ControllerHandler, config?: ControllerConfig): void {
    this.router.post(path, ...this.#middlewares(config), this.#handle(fn));
  }

  put(path: string, fn: ControllerHandler, config?: ControllerConfig): void {
    this.router.put(path, ...this.#middlewares(config), this.#handle(fn));
  }

  #middlewares(config: ControllerConfig = {}): Handler[] {
    const result: Handler[] = [];
    if (!config.anonymous) {
      result.push(this.#auth.handle);
    }

    return result;
  }

  #handle(fn: ControllerHandler): RouteHandlerExpressFn {
    return async (req, res) => {
      try {
        const request = this.#createRequest(req, res.locals.user);
        const result = await fn(request);
        return this.#handleSuccess(res, result);
      } catch (e) {
        return this.#handleError(res, e);
      }
    };
  }

  #createRequest(request: Request, user: any): ControllerRequest {
    const params = request.params;
    const queries = { ...request.query } as Record<string, string>;
    const body = request.body;
    return new ControllerRequest({
      body,
      params,
      queries,
      user,
    });
  }

  #handleSuccess(res: Response, result: ControllerResponse): Response {
    return res.status(result.status).send(result.content);
  }

  #handleError(res: Response, error: unknown): Response {
    console.log(error);

    if (BaseError.isInstance(error)) {
      if (error.type === BaseErrorEnum.validation) {
        return res.status(400).send({ error: error.message });
      }

      if (error.type === BaseErrorEnum.authentication) {
        return res.status(401).send({ error: error.message });
      }

      if (error.type === BaseErrorEnum.authorization) {
        return res.status(403).send();
      }
    }

    return res.status(500).send({ error: "Erro interno" });
  }
}
