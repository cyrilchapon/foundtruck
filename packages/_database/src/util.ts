import { Knex } from 'knex'

export const ensureConnection =
  async (knex: Knex | Knex.Transaction) =>
    knex.raw(`SELECT 1`)
