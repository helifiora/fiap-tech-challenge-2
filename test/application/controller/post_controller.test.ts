import { PostUseCaseFactory } from "#application/usecase/post/_factory.ts";
import { assert, beforeEach, test, expect } from "vitest";
import { useDatabaseContainer } from "../../use_database_container.ts";
import {
  ControllerInvalidBodyError,
  ControllerRequest,
} from "#application/controller.ts";
import { AuthorUser } from "#domain/model/author.ts";
import { PostRepo } from "#application/repo/post_repo.ts";
import { PostController } from "#application/controller/post_controller.ts";
import { Post } from "#domain/model/post.ts";
import { createGuid } from "#domain/service/guid.ts";

let controller: PostController;
let postRepo: PostRepo;

let author: AuthorUser;

beforeEach(async () => {
  const repoFactory = await useDatabaseContainer("post-controller");
  postRepo = repoFactory.postRepo();

  const useCaseFac = new PostUseCaseFactory(postRepo);
  controller = new PostController(useCaseFac);

  const authorRepo = repoFactory.authorRepo();

  author = await AuthorUser.create("john@doe.com", "John Doe", "MyPassword!");
  await authorRepo.create(author);
});

test("[create] should create a new post", async () => {
  const request = new ControllerRequest({
    user: author,
    body: {
      title: "Title",
      content: "Lorem Ipsum",
    },
  });

  const response = await controller.create(request);
  assert.equal(response.status, 201);
  assert.equal(response.content.title, "Title");
  assert.equal(response.content.content, "Lorem Ipsum");
  assert.equal(response.content.authorId, author.id);
});

test.each([1, "", Array(400).fill(5).join("")])(
  "[create] should throw ControllerInvalidBodyError when title is invalid - %s",
  async (value: any) => {
    const request = new ControllerRequest({
      user: author,
      body: {
        title: value,
        content: "Lorem Ipsum",
      },
    });

    expect(() => controller.create(request)).rejects.toThrow(
      ControllerInvalidBodyError,
    );
  },
);

test.each([1, ""])(
  "[create] should throw ControllerInvalidBodyError when content is invalid - %s",
  async (value: any) => {
    const request = new ControllerRequest({
      user: author,
      body: {
        title: "Title",
        content: value,
      },
    });

    expect(() => controller.create(request)).rejects.toThrow(
      ControllerInvalidBodyError,
    );
  },
);

test("[delete] should delete an existing post", async () => {
  const post = Post.create({
    title: "Lorem Ipsum",
    content: "Lorem Lorem",
    authorId: author.id,
  });

  await postRepo.save(post);

  const request = new ControllerRequest({
    user: author,
    params: {
      id: post.id,
    },
  });

  await controller.delete(request);
  const result = await postRepo.getById(author.id);
  assert.isNull(result);
});

test("[update] should update an existing post", async () => {
  const post = Post.create({
    title: "Lorem Ipsum",
    content: "Lorem Lorem",
    authorId: author.id,
  });

  await postRepo.save(post);

  const request = new ControllerRequest({
    user: author,
    params: {
      id: post.id,
    },
    body: {
      id: post.id,
      title: "Lorem a",
      content: "Jovem de valor",
    },
  });

  const result = await controller.update(request);
  assert.equal(result.status, 200);
  assert.equal(result.content.id, post.id);
  assert.equal(result.content.title, "Lorem a");
  assert.equal(result.content.content, "Jovem de valor");

  const resultBank = await postRepo.getById(post.id);
  assert(resultBank);
  assert.equal(resultBank.id, post.id);
  assert.equal(resultBank.title, "Lorem a");
  assert.equal(resultBank.content, "Jovem de valor");
});

test("[update] should return badRequest when param id and body id are not compatible", async () => {
  const request = new ControllerRequest({
    user: author,
    params: {
      id: createGuid(),
    },
    body: {
      id: createGuid(),
      title: "Lorem a",
      content: "Jovem de valor",
    },
  });

  const result = await controller.update(request);
  assert.equal(result.status, 400);
  assert.equal(result.content.error, "Id incompatível");
});

test.each(["123", "456", "9898980=980980", "090909-09090"])(
  "[update] should throw ControllerInvalidBodyError when id is invalid - %s",
  async (value: any) => {
    const post = Post.create({
      title: "Lorem Ipsum",
      content: "Lorem Lorem",
      authorId: author.id,
    });

    await postRepo.save(post);

    const request = new ControllerRequest({
      user: author,
      params: {
        id: value,
      },
      body: {
        id: value,
        title: "Lorem a",
        content: "Jovem de valor",
      },
    });

    expect(() => controller.update(request)).rejects.toThrow(
      ControllerInvalidBodyError,
    );
  },
);

test.each([1, "", Array(400).fill(5).join("")])(
  "[update] should throw ControllerInvalidBodyError when title is invalid - %s",
  async (value: any) => {
    const post = Post.create({
      title: "Lorem Ipsum",
      content: "Lorem Lorem",
      authorId: author.id,
    });

    await postRepo.save(post);

    const request = new ControllerRequest({
      user: author,
      params: {
        id: createGuid(),
      },
      body: {
        id: createGuid(),
        title: value,
        content: "Jovem de valor",
      },
    });

    expect(() => controller.update(request)).rejects.toThrow(
      ControllerInvalidBodyError,
    );
  },
);

test.each([1, ""])(
  "[update] should throw ControllerInvalidBodyError when content is invalid - %s",
  async (value: any) => {
    const post = Post.create({
      title: "Lorem Ipsum",
      content: "Lorem Lorem",
      authorId: author.id,
    });

    await postRepo.save(post);

    const request = new ControllerRequest({
      user: author,
      params: {
        id: createGuid(),
      },
      body: {
        id: createGuid(),
        title: "Title Title",
        content: value,
      },
    });

    expect(() => controller.update(request)).rejects.toThrow(
      ControllerInvalidBodyError,
    );
  },
);

test("[show] should return an existing post", async () => {
  const post = Post.create({
    title: "Lorem Ipsum",
    content: "Lorem Lorem",
    authorId: author.id,
  });

  await postRepo.save(post);

  const request = new ControllerRequest({
    user: author,
    params: {
      id: post.id,
    },
  });

  const result = await controller.show(request);
  assert(result);
  assert.equal(result.status, 200);
  assert.equal(result.content.id, post.id);
  assert.equal(result.content.title, post.title);
  assert.equal(result.content.content, post.content);
});

test("[show] should return NotFound when item does not exist", async () => {
  const post = Post.create({
    title: "Lorem Ipsum",
    content: "Lorem Lorem",
    authorId: author.id,
  });

  await postRepo.save(post);

  const request = new ControllerRequest({
    user: author,
    params: {
      id: createGuid(),
    },
  });

  const result = await controller.show(request);
  assert.equal(result.status, 204);
});

test("[index] should return an empty array when there is no item", async () => {
  const request = new ControllerRequest({
    user: author,
    params: {},
  });

  const result = await controller.index(request);
  assert.equal(result.status, 200);
  assert.deepEqual(result.content, []);
});

test("[index] should return items", async () => {
  const posts = [
    Post.create({
      title: "Lorem Ipsum",
      content: "Lorem Lorem",
      authorId: author.id,
    }),
    Post.create({
      title: "Lorem Ipsum 2",
      content: "Lorem Lorem 2",
      authorId: author.id,
    }),
    Post.create({
      title: "Lorem Ipsum 3",
      content: "Lorem Lorem 3",
      authorId: author.id,
    }),
  ];

  for (const item of posts) {
    await postRepo.save(item);
  }

  const request = new ControllerRequest({
    user: author,
    params: {
      id: createGuid(),
    },
  });

  const result = await controller.index(request);
  assert.equal(result.status, 200);
  assert.equal(result.content.length, 3);
});

test("[index] should return items with query", async () => {
  const posts = [
    Post.create({
      title: "Lorem Ipsum ron",
      content: "Lorem Lorem",
      authorId: author.id,
    }),
    Post.create({
      title: "Lorem Ipsum 2",
      content: "Lorem ron 2",
      authorId: author.id,
    }),
    Post.create({
      title: "None None None",
      content: "None None None",
      authorId: author.id,
    }),
  ];

  for (const item of posts) {
    await postRepo.save(item);
  }

  const request = new ControllerRequest({
    user: author,
    queries: { q: "ron" },
  });

  const result = await controller.index(request);
  assert.equal(result.status, 200);
  assert.equal(result.content.length, 2);

  const items = result.content.map((s: any) => ({
    id: s.id,
    title: s.title,
    content: s.content,
  })) as {
    id: string;
    title: string;
    content: string;
  }[];

  const postMap = new Map(
    posts.map((s) => [
      s.id,
      {
        id: s.id,
        title: s.title,
        content: s.content,
      },
    ]),
  );

  for (const item of items) {
    const postResult = postMap.get(item.id) ?? null;
    assert(postResult);
    assert.deepEqual(item, postResult);
  }
});
