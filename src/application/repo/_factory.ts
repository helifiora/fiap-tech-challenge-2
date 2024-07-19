import type { PostRepo, AuthorRepo } from "#application/repo/mod.ts";

export interface RepoFactory {
  authorRepo(): AuthorRepo;

  postRepo(): PostRepo;
}
