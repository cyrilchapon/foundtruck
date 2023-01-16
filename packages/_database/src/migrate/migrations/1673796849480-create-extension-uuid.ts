import type { Migration } from '../umzug'

export const up: Migration = async ({ context: { knex } }) => {
  await knex.raw('create extension if not exists "uuid-ossp"')
}

export const down: Migration = async ({ context: { knex } }) => {
  await knex.raw('drop extension if exists "uuid-ossp"')
}
