// Update with your config settings.

require("dotenv").config();

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
module.exports = {
  client: "postgres",
  connection: {
    database: "d2rt76hev4ha6l",
    user:     "yzhdavjypfwdty",
    password: "0e3f533fab15a18a90a282413416603ea6849758992a428e94a8023dc46b9a63",
    host: "ec2-54-73-167-224.eu-west-1.compute.amazonaws.com",
    ssl: { rejectUnauthorized: false },
  },
  pool: {
    min: 2,
    max: 10
  },
  migrations: {
    tableName: "knex_migrations"
  },
};
