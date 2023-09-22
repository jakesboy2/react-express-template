import { Knex } from 'knex';

const TABLE_NAME = 'reset_password_requests';

export async function up(knex: Knex): Promise<void> {
  const hasTable = await knex.schema.hasTable(TABLE_NAME);
  if (hasTable) return;

  return knex.schema.createTable(TABLE_NAME, (table) => {
    table.increments('id');
    table.string('accessCode').nullable();
    table.timestamp('createdAt').nullable();
    table.integer('userId').notNullable();

    table.foreign('userId')
      .references('id')
      .inTable('users')
      .onDelete('CASCADE');
  });
}

export async function down(knex: Knex): Promise<void> {
  const hasTable = await knex.schema.hasTable(TABLE_NAME);
  if (!hasTable) return;

  return knex.schema.dropTable(TABLE_NAME);
}
