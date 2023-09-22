import Knex from 'knex';

const knexConfig = require('./knexfile');

const nodeEnv = process.env.NODE_ENV || 'development';
// eslint-disable-next-line import/prefer-default-export
export const database = Knex(knexConfig[nodeEnv] as string);
