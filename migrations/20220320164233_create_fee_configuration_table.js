const tableName = "fee_configurations";

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async (knex) => {
  await knex.schema.createTable(tableName, (table) => {
    table.string("id", 25);
    table.string("currency", 5);
    table.string("locale", 5);
    table.string("entity", 50);
    table.string("entity_property", 100);
    table.string("type", 10);
    table.string("value", 10);
    table.integer("specificity", 3);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async (knex) => {
  await knex.schema.dropTableIfExists(tableName);
};
