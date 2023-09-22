import { Express } from 'express';

export interface TypedRequest<Params, Query, Body> extends Express.Request {
    params: Params,
    query: Query,
    body: Body,
  }

export type envs = 'development' | 'production';
