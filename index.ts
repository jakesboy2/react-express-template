import express, { Express } from 'express';

import Knex from 'knex';
import cors from 'cors';
import dotenv from 'dotenv';
import baseRouter from './routes/routes';

dotenv.config();

const knexConfig = require('./database/knexfile');

const nodeEnv = process.env.NODE_ENV || 'development';
Knex(knexConfig[nodeEnv] as string);

const app: Express = express();

app.use(express.json());
app.use(cors());

app.use('/api', baseRouter);

const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log(`Template ${nodeEnv} server listening on port ${port}`);
});
