import type { Migration } from '../umzug'

export const up: Migration = async ({ context: { knex } }) => {
  await knex.raw('create extension if not exists "postgis"')
}

export const down: Migration = async ({ context: { knex } }) => {
  await knex.raw('drop extension if exists "postgis"')
}
