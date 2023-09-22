import { Knex } from 'knex';

const TABLE_NAME = 'users';
const NEW_COLUMN = 'displayName';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.alterTable(TABLE_NAME, (table) => {
    table.string(NEW_COLUMN, 128).notNullable().defaultTo('None');
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.alterTable(TABLE_NAME, (table) => {
    table.dropColumn(NEW_COLUMN);
  });
}
