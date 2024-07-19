import type { JwtService } from "#application/jwt_service.ts";
import jsonwebtoken from "jsonwebtoken";
import { Author } from "#domain/model/author.ts";
import { BaseError, BaseErrorEnum } from "#utils/error.ts";

export class JsonwebtokenJwtService implements JwtService {
  #privateKey: string;

  constructor(privateKey: string) {
    this.#privateKey = privateKey;
  }

  async sign(author: Author): Promise<string> {
    const raw = {
      id: author.id,
      email: author.email,
      username: author.username,
    };

    return jsonwebtoken.sign(
      { author: JSON.stringify(raw) },
      this.#privateKey,
      { expiresIn: "60m" },
    );
  }

  async verify(token: string): Promise<Author> {
    try {
      const result = jsonwebtoken.verify(token, this.#privateKey) as any;
      const raw = JSON.parse(result.author);
      return new Author(raw.id, raw.email, raw.username);
    } catch (_) {
      throw new InvalidTokenError();
    }
  }
}

export class InvalidTokenError extends BaseError {
  constructor() {
    super(BaseErrorEnum.authentication, "Token invalid");
  }
}
