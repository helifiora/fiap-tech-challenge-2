import { afterEach, assert, beforeEach, test, inject } from "vitest";
import { KyselyDatabase } from "#infrastructure/kysely_db.ts";
import { KyselyMigrator } from "#infrastructure/kysely_migrator.ts";
import { PostRepo } from "#application/repo/post_repo.ts";
import { KyselyPostRepo } from "#infrastructure/repo_adapter/kisely_post_repository.ts";
import { KyselyAuthorRepo } from "#infrastructure/repo_adapter/kysely_author_repository.ts";
import { AuthorUser } from "#domain/model/author.ts";
import { setupKyselyDb } from "test/setup_kysely_db.ts";
import { Post } from "#domain/model/post.ts";
import { DeletePost } from "#application/usecase/post/delete_post.ts";
import { randomEmail } from "test/utils";

let useCase: DeletePost;
let postRepo: PostRepo;

let db: KyselyDatabase;
let migrator: KyselyMigrator;

let post: Post;

beforeEach(async () => {
  const connectionDb = inject("container");
  [db, migrator] = await setupKyselyDb(connectionDb);
  await migrator.toLatest();

  postRepo = new KyselyPostRepo(db);
  useCase = new DeletePost(postRepo);

  const authorRepo = new KyselyAuthorRepo(db);
  const author = await AuthorUser.create(
    randomEmail(),
    "John Doe",
    "test-hashed-password!",
  );

  await authorRepo.create(author);

  post = Post.create({
    authorId: author.id,
    content: "Lorem Ipsum",
    title: "Green",
  });

  await postRepo.save(post);
});

afterEach(async () => {
  await migrator.toInitial();
});

test("should remove from database successfuly", async () => {
  await useCase.handle({ id: post.id });
  const result = await postRepo.getById(post.id);
  assert.isNull(result);
});
