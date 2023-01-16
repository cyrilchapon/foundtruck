import type { Migration } from '../umzug'

export const up: Migration = async ({ context: { knex } }) => {
  // await knex.schema.createTable()
}

export const down: Migration = async ({ context: { knex } }) => {
  // await knex.schema.dropTable()
}
