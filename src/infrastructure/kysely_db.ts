import { Kysely } from "kysely";

export type KyselyDatabase = Kysely<Db>;

type Db = {
  author: AuthorTable;
  post: PostTable;
};

type PostTable = {
  id: string;
  title: string;
  content: string;
  published_at: string;
  author_id: string;
};

type AuthorTable = {
  id: string;
  username: string;
  email: string;
  password_hash: string;
};
