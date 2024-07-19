import { Post } from "#domain/model/post.ts";
import { randomUUID } from "node:crypto";
import { assert, test, vi } from "vitest";

test("[restore] should return Post instance", () => {
  const id = randomUUID();
  const authorId = randomUUID();

  const post = Post.restore({
    id,
    authorId,
    content: "Lorem ipsum, lorem ipsum, lorem ipsum",
    publishedAt: "2020-01-20T10:00:00",
    title: "Jovem 1: Entenda os benefícios",
  });

  assert.equal(post.id, id);
  assert.equal(post.authorId, authorId);
  assert.equal(post.content, "Lorem ipsum, lorem ipsum, lorem ipsum");
  assert.deepEqual(post.publishedAt, new Date("2020-01-20T10:00:00"));
  assert.equal(post.title, "Jovem 1: Entenda os benefícios");
});

test("[create] should return Post instance", () => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date("2020-10-20T13:00:00"));

  const authorId = randomUUID();

  const post = Post.create({
    authorId,
    content: "Lorem ipsum, lorem ipsum, lorem ipsum",
    title: "Jovem 1: Entenda os benefícios",
  });

  assert.equal(post.authorId, authorId);
  assert.equal(post.content, "Lorem ipsum, lorem ipsum, lorem ipsum");
  assert.deepEqual(post.publishedAt, new Date("2020-10-20T13:00:00"));
  assert.equal(post.title, "Jovem 1: Entenda os benefícios");

  vi.useRealTimers();
});
