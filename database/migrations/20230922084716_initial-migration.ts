import { Knex } from 'knex';

const USERS = 'users';
const RESET_PASSWORD = 'reset_password_requests';

export async function up(knex: Knex): Promise<void> {
  const hasUsersTable = await knex.schema.hasTable(USERS);
  if (hasUsersTable) return;

  await knex.schema.createTable('users', (table) => {
    table.increments('id');
    table.string('email').unique().notNullable();
    table.string('password').notNullable();
    table.string('displayName', 128).notNullable().defaultTo('None');
  });

  const hasResetPasswordTable = await knex.schema.hasTable(RESET_PASSWORD);
  if (hasResetPasswordTable) return;

  return knex.schema.createTable(RESET_PASSWORD, (table) => {
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
  const hasUsersTable = await knex.schema.hasTable(USERS);
  if (!hasUsersTable) return;
  await knex.schema.dropTable(USERS);

  const hasResetPasswordTable = await knex.schema.hasTable(RESET_PASSWORD);
  if (!hasResetPasswordTable) return;
  return knex.schema.dropTable(RESET_PASSWORD);
}
