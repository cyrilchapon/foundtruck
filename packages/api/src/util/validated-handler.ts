import { processRequest } from 'zod-express-middleware'
import { RequestHandler } from 'express'
import { z, ZodType } from 'zod'
import {
  AsyncManagedRequestHandler,
  AsyncRequestHandler,
  createAsyncHandler,
  createAsyncManagedHandler,
} from './async-handler'

const createVh =
  <
    TVParams = unknown,
    TVQuery = unknown,
    TVBody = unknown,
    ZVParams extends ZodType<TVParams> = ZodType<TVParams>,
    ZVQuery extends ZodType<TVQuery> = ZodType<TVQuery>,
    ZVBody extends ZodType<TVBody> = ZodType<TVBody>,
  >(schemas: {
    params?: ZVParams
    query?: ZVQuery
    body?: ZVBody
  }) =>
  (
    handler: RequestHandler<
      z.infer<ZVParams>,
      unknown,
      z.infer<ZVBody>,
      z.infer<ZVQuery>
    >,
  ): [
    RequestHandler<TVParams, unknown, TVBody, TVQuery>,
    RequestHandler<
      z.infer<ZVParams>,
      unknown,
      z.infer<ZVBody>,
      z.infer<ZVQuery>
    >,
  ] =>
    [processRequest(schemas), handler]

const createVah =
  <
    TVParams = unknown,
    TVQuery = unknown,
    TVBody = unknown,
    ZVParams extends ZodType<TVParams> = ZodType<TVParams>,
    ZVQuery extends ZodType<TVQuery> = ZodType<TVQuery>,
    ZVBody extends ZodType<TVBody> = ZodType<TVBody>,
  >(schemas: {
    params?: ZVParams
    query?: ZVQuery
    body?: ZVBody
  }) =>
  (
    handler: AsyncRequestHandler<
      z.infer<ZVParams>,
      unknown,
      z.infer<ZVBody>,
      z.infer<ZVQuery>
    >,
  ): [
    RequestHandler<TVParams, unknown, TVBody, TVQuery>,
    RequestHandler<
      z.infer<ZVParams>,
      unknown,
      z.infer<ZVBody>,
      z.infer<ZVQuery>
    >,
  ] =>
    [processRequest(schemas), createAsyncHandler(handler)]

const createVmah =
  <
    TVParams = unknown,
    TVQuery = unknown,
    TVBody = unknown,
    TVResBody = unknown,
    ZVParams extends ZodType<TVParams> = ZodType<TVParams>,
    ZVQuery extends ZodType<TVQuery> = ZodType<TVQuery>,
    ZVBody extends ZodType<TVBody> = ZodType<TVBody>,
    ZVResBody extends ZodType<TVResBody> = ZodType<TVResBody>,
  >(schemas: {
    params?: ZVParams
    query?: ZVQuery
    body?: ZVBody
    res?: ZVResBody
  }) =>
  (
    handler: AsyncManagedRequestHandler<
      z.infer<ZVParams>,
      z.infer<ZVResBody>,
      z.infer<ZVBody>,
      z.infer<ZVQuery>
    >,
  ): [
    RequestHandler<TVParams, unknown, TVBody, TVQuery>,
    RequestHandler<
      z.infer<ZVParams>,
      z.infer<ZVResBody>,
      z.infer<ZVBody>,
      z.infer<ZVQuery>
    >,
  ] =>
    [processRequest(schemas), createAsyncManagedHandler(handler)]

const createEndpoint = createVmah

export { createEndpoint, createVh, createVah, createVmah }
