import { Kysely, sql } from "kysely";

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable("author")
    .addColumn("id", "uuid", (col) => col.primaryKey())
    .addColumn("username", "varchar(255)", (col) => col.notNull())
    .addColumn("email", "varchar(255)", (col) => col.unique().notNull())
    .addColumn("password_hash", "text", (col) => col.notNull())
    .execute();

  await db.schema
    .createTable("post")
    .addColumn("id", "uuid", (col) => col.primaryKey())
    .addColumn("title", "varchar(255)", (col) => col.notNull())
    .addColumn("content", "text", (col) => col.notNull())
    .addColumn("published_at", "timestamp", (col) =>
      col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull(),
    )
    .addColumn("author_id", "uuid", (col) =>
      col.references("author.id").onDelete("restrict").notNull(),
    )
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable("post").execute();
  await db.schema.dropTable("author").execute();
}
