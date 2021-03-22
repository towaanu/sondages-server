import { Knex } from "knex";

const questionsTableName = "questions";

export async function up(knex: Knex): Promise<void> {
  await knex.raw('create extension if not exists "uuid-ossp"');

  await knex.schema.createTable(questionsTableName, (table) => {
    // table.increments('id');
    table.uuid("id").primary().defaultTo(knex.raw("uuid_generate_v4()"));
    table.string("label", 255).notNullable();
    table.timestamp("created_at", { useTz: true }).defaultTo(knex.fn.now());
    table.timestamp("updated_at", { useTz: true }).defaultTo(knex.fn.now());
  });

  await knex.raw(`
	CREATE TRIGGER update_timestamp
	BEFORE UPDATE
	ON ${questionsTableName}
	FOR EACH ROW
	EXECUTE PROCEDURE update_timestamp();
  `);
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable(questionsTableName);
}
