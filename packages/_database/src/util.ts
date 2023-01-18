import { Knex } from 'knex'

export type KnexOrTransaction = Knex | Knex.Transaction

export const ensureConnection =
  async (knex: KnexOrTransaction) =>
    knex.raw(`SELECT 1`)
