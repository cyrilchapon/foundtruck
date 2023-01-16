import type { Migration } from '../umzug'

export const up: Migration = async ({ context: { knex } }) => {
  // await knex.transaction(async tx => {
  //   await tx.batchInsert('table', [])
  // })
}

export const down: Migration = async ({ context: { knex } }) => {
  // await knex.transaction(async tx => {
  //   await tx('table').delete()
  // })
}
