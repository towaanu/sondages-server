import { Knex } from "knex";


const predefinedAnswersTableName = "predefined_answers";

export async function up(knex: Knex): Promise<void> {
    await knex.schema
	.createTable(predefinedAnswersTableName, table => {
	    table.increments('id');
	    table.string("label", 255).notNullable();

	    table.uuid("question_id")
		.references("id")
		.inTable("questions")
		.notNullable();

	    table.timestamp('created_at', {useTz: true}).defaultTo(knex.fn.now());
	    table.timestamp('updated_at', {useTz: true}).defaultTo(knex.fn.now());

	    table.unique(["question_id", "label"]);
	});

    await knex.raw(`
	CREATE TRIGGER update_timestamp
	BEFORE UPDATE
	ON ${predefinedAnswersTableName}
	FOR EACH ROW
	EXECUTE PROCEDURE update_timestamp();
  `);
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable(predefinedAnswersTableName)
}

