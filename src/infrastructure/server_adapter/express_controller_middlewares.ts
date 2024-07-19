import type { Handler } from "express";
import type { JwtService } from "#application/jwt_service.ts";

export class ExpressAuthMiddleware {
  #jwt: JwtService;

  constructor(jwt: JwtService) {
    this.#jwt = jwt;
  }

  handle: Handler = async (req, res, next) => {
    const [_, token] = req.headers.authorization?.split(" ") ?? ["", ""];
    if (token.trim().length === 0) {
      return res.status(401).send();
    }

    try {
      res.locals["user"] = await this.#jwt.verify(token);
      return next();
    } catch (e) {
      return res.status(401).send();
    }
  };
}
