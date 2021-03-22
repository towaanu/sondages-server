import { Knex } from "knex";

const votesTableName = "votes";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable(votesTableName, (table) => {
    table.increments("id");

    table
      .integer("predefined_answer_id")
      .references("id")
      .inTable("predefined_answers")
      .notNullable();

    table.timestamp("created_at", { useTz: true }).defaultTo(knex.fn.now());
    table.timestamp("updated_at", { useTz: true }).defaultTo(knex.fn.now());
  });

  await knex.raw(`
	CREATE TRIGGER update_timestamp
	BEFORE UPDATE
	ON ${votesTableName}
	FOR EACH ROW
	EXECUTE PROCEDURE update_timestamp();
  `);
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable(votesTableName);
}
