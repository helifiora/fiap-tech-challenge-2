import type { ControllerHandler } from "./controller.ts";

export interface Server {
  addRoute(path: string, fn: ControllerAddRouterFn): void;
  listen(port: number): void;
  use(config: ServerConfig): void;
}

export interface ControllerRouter {
  delete(path: string, fn: ControllerHandler, config?: ControllerConfig): void;
  get(path: string, fn: ControllerHandler, config?: ControllerConfig): void;
  post(path: string, fn: ControllerHandler, config?: ControllerConfig): void;
  put(path: string, fn: ControllerHandler, config?: ControllerConfig): void;
}

export type ControllerAddRouterFn = (router: ControllerRouter) => void;

export type ControllerConfig = { anonymous?: boolean };

export interface ServerConfig {
  handle(server: Server): void;
}
