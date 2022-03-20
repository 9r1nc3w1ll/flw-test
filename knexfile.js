// Update with your config settings.

require('dotenv').config();

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
module.exports = {
  client: 'postgres',
  connection: {
    database: 'd64svpq1i8rhq6',
    user:     'myzzevbdqmhwgs',
    password: 'f9e07d1a0baf090fd2916796b5fa1fd78d9a6bae8d702a15d7d55a911d9852aa',
    host: 'ec2-54-76-249-45.eu-west-1.compute.amazonaws.com',
    ssl: { rejectUnauthorized: false },
  },
  pool: {
    min: 2,
    max: 10
  },
  migrations: {
    tableName: 'knex_migrations'
  },
};
