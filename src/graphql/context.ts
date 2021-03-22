import { Knex } from 'knex';

export interface Context {
  knex: Knex;
}

function genContext(knex: Knex): Context {
  return { knex };
}

export { genContext };
