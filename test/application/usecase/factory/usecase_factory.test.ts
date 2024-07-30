import { test, assert } from "vitest";
import { RepoFactory } from "#application/repo/_factory.ts";
import { AuthorRepo } from "#application/repo/author_repo.ts";
import { PostRepo } from "#application/repo/post_repo.ts";
import { JwtService } from "#application/jwt_service.ts";
import { Author } from "#domain/model/author.ts";
import { UseCaseFactory } from "#application/usecase/_factory.ts";
import { PostUseCaseFactory } from "#application/usecase/post/_factory.ts";
import { AuthorUseCaseFactory } from "#application/usecase/author/_factory.ts";

test("should define useCase factory", () => {
  const factory = new UseCaseFactory(
    new FakeRepoFactory(),
    new FakeJwtService(),
  );

  assert.instanceOf(factory.postFac, PostUseCaseFactory);
  assert.instanceOf(factory.authorFac, AuthorUseCaseFactory);
});

class FakeRepoFactory implements RepoFactory {
  authorRepo(): AuthorRepo {
    return {} as any;
  }

  postRepo(): PostRepo {
    return {} as any;
  }
}

class FakeJwtService implements JwtService {
  sign(content: Author): Promise<string> {
    throw "";
  }

  verify(token: string): Promise<Author> {
    throw "";
  }
}
