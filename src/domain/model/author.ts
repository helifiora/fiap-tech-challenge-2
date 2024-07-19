import { createGuid } from "#domain/service/guid.ts";
import {
  createPassword,
  verifyPassword,
} from "#domain/service/hash_password.ts";

export class Author {
  id: string;
  email: string;
  username: string;

  constructor(id: string, email: string, username: string) {
    this.id = id;
    this.email = email;
    this.username = username;
  }
}

export class AuthorUser extends Author {
  passwordHash: string;

  constructor(
    id: string,
    email: string,
    username: string,
    passwordHash: string,
  ) {
    super(id, email, username);
    this.passwordHash = passwordHash;
  }

  static async create(
    email: string,
    username: string,
    password: string,
  ): Promise<AuthorUser> {
    const id = createGuid();
    const hash = await createPassword(password);
    return new AuthorUser(id, email, username, hash);
  }

  async verifyPassword(password: string): Promise<boolean> {
    return await verifyPassword(this.passwordHash, password);
  }
}
