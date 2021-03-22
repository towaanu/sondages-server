import {knex} from 'knex';
import {toCamelCase} from "./helpers/convertCase";
import snakeCase from 'lodash/snakeCase';

const knexPg = knex({
    client: "pg",
    connection: process.env.PG_DATABASE_URL,
    pool: {min: 0, max: 5},
    debug: process.env.NODE_ENV === "development",
    postProcessResponse: (result, _queryContext) => toCamelCase(result),
    wrapIdentifier: (value, origImpl, _queryContext) => origImpl(snakeCase(value))
})

export { knexPg }
