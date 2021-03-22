// Update with your config settings.

module.exports = {

  development: {
    client: "postgresql",
    connection: process.env.PG_DATABASE_URL,
    pool: {
      min: 0,
      max: 5
    },
    migrations: {
      tableName: "knex_migrations"
    }
  },

  staging: {
    client: "postgresql",
    connection: process.env.PG_DATABASE_URL,
    pool: {
      min: 0,
      max: 5
    },
    migrations: {
      tableName: "knex_migrations"
    }
  },

  production: {
    client: "postgresql",
    connection: process.env.PG_DATABASE_URL,
    pool: {
      min: 0,
      max: 5
    },
    migrations: {
      tableName: "knex_migrations"
    }
  }

};
