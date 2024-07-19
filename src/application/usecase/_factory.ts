import type { JwtService } from "#application/jwt_service.ts";
import type { RepoFactory } from "#application/repo/_factory.ts";

import { AuthorUseCaseFactory } from "./author/_factory.ts";
import { PostUseCaseFactory } from "./post/_factory.ts";

export class UseCaseFactory {
  authorFac: AuthorUseCaseFactory;
  postFac: PostUseCaseFactory;

  constructor(repoFac: RepoFactory, jwtService: JwtService) {
    this.authorFac = new AuthorUseCaseFactory(repoFac.authorRepo(), jwtService);
    this.postFac = new PostUseCaseFactory(repoFac.postRepo());
  }
}
